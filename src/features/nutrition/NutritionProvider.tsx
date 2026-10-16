import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api/client';
import { starterFoods } from './catalog';
import { latestWeight, summarizeLogs, todayKey } from './utils';
import type { AddFoodLogInput, Food, FoodLog, MealSlot, NutritionContextValue, NutritionState } from './types';

const STORAGE_KEY = '@kallo/nutrition-v1';
const initialState: NutritionState = {
  foodLogs: [], waterLogs: [], weightLogs: [], customFoods: [], recentFoodIds: [], favoriteFoodIds: [], selectedDate: todayKey(), walkthroughSeen: false,
  goals: { calories: 2000, protein: 150, carbs: 225, fat: 56, waterMl: 2000, targetWeightKg: 60 },
};

function id(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

const NutritionContext = createContext<NutritionContextValue | null>(null);

export function NutritionProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<NutritionState>(initialState);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (!value) return;
      try { setState({ ...initialState, ...JSON.parse(value) }); } catch { /* Ignore invalid local cache. */ }
    }).catch(() => undefined).finally(() => setReady(true));
  }, []);
  useEffect(() => { if (ready) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined); }, [ready, state]);
  useEffect(() => { if (ready) void api.get(`/reports/dashboard?date=${encodeURIComponent(state.selectedDate)}`).catch(() => undefined); }, [ready, state.selectedDate]);

  const foods = useMemo(() => [...starterFoods, ...state.customFoods], [state.customFoods]);
  const findFood = useCallback((foodId: string) => foods.find((food) => food.id === foodId), [foods]);
  const getLogs = useCallback((date: string, meal?: MealSlot) => state.foodLogs.filter((log) => log.date === date && (!meal || log.meal === meal)), [state.foodLogs]);
  const getSummary = useCallback((date: string, caloriesBurned = 0) => summarizeLogs(getLogs(date), foods, state.waterLogs.filter((log) => log.date === date).reduce((sum, log) => sum + log.amountMl, 0), latestWeight(date, state.weightLogs), state.goals, caloriesBurned), [foods, getLogs, state.goals, state.waterLogs, state.weightLogs]);

  const addFoodLog = useCallback((input: AddFoodLogInput) => {
    const food = foods.find((item) => item.id === input.foodId);
    if ((!food && !input.foodName) || input.grams <= 0) return;
    const foodName = input.foodName ?? food?.name ?? 'Món ăn';
    const log: FoodLog = { ...input, id: id('food'), foodName };
    setState((current) => {
      const recentFoodIds = food ? [food.id, ...current.recentFoodIds.filter((value) => value !== food.id)].slice(0, 12) : current.recentFoodIds;
      return { ...current, foodLogs: [...current.foodLogs, log], recentFoodIds };
    });
    void api.post('/food-logs', input).catch(() => undefined);
  }, [foods]);
  const addMultipleFoodLogs = useCallback((inputs: AddFoodLogInput[]) => {
    const validLogs: FoodLog[] = [];
    for (const input of inputs) {
      const food = foods.find((item) => item.id === input.foodId);
      if ((!food && !input.foodName) || input.grams <= 0) continue;
      const foodName = input.foodName ?? food?.name ?? 'Món ăn';
      validLogs.push({ ...input, id: id('food'), foodName });
    }
    if (validLogs.length === 0) return;
    setState((current) => ({
      ...current,
      foodLogs: [...current.foodLogs, ...validLogs],
    }));
  }, [foods]);
  const updateFoodLog = useCallback((logId: string, changes: Partial<Pick<FoodLog, 'grams' | 'meal'>>) => setState((current) => ({ ...current, foodLogs: current.foodLogs.map((log) => {
    if (log.id !== logId) return log;
    const nutritionSnapshot = log.nutritionSnapshot && changes.grams && log.grams > 0
      ? { ...log.nutritionSnapshot, calories: log.nutritionSnapshot.calories * changes.grams / log.grams, protein: log.nutritionSnapshot.protein * changes.grams / log.grams, carbs: log.nutritionSnapshot.carbs * changes.grams / log.grams, fat: log.nutritionSnapshot.fat * changes.grams / log.grams }
      : log.nutritionSnapshot;
    return { ...log, ...changes, nutritionSnapshot };
  }) })), []);
  const deleteFoodLog = useCallback((logId: string) => setState((current) => ({ ...current, foodLogs: current.foodLogs.filter((log) => log.id !== logId) })), []);
  const copyMeal = useCallback((sourceDate: string, targetDate: string, meal: MealSlot) => setState((current) => ({ ...current, foodLogs: [...current.foodLogs, ...current.foodLogs.filter((log) => log.date === sourceDate && log.meal === meal).map((log) => ({ ...log, id: id('food'), date: targetDate }))] })), []);
  const addWater = useCallback((date: string, amountMl: number) => { if (!Number.isFinite(amountMl) || amountMl <= 0 || amountMl > 5000) return false; setState((current) => ({ ...current, waterLogs: [...current.waterLogs, { id: id('water'), date, amountMl }] })); void api.post('/water-logs', { date, amountMl }).catch(() => undefined); return true; }, []);
  const addWeight = useCallback((date: string, weightKg: number) => { if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 300) return false; setState((current) => ({ ...current, weightLogs: [...current.weightLogs.filter((log) => log.date !== date), { id: id('weight'), date, weightKg }] })); void api.post('/weight-logs', { date, weightKg }).catch(() => undefined); return true; }, []);
  const saveCustomFood = useCallback((food: Omit<Food, 'id' | 'isCustom'> & { id?: string }) => { const foodId = food.id ?? id('custom'); setState((current) => ({ ...current, customFoods: [...current.customFoods.filter((item) => item.id !== foodId), { ...food, id: foodId, isCustom: true }] })); void api.post('/foods/custom', { ...food, id: foodId }).catch(() => undefined); return foodId; }, []);
  const value = useMemo<NutritionContextValue>(() => ({ state, ready, foods, findFood, getSummary, getLogs, addFoodLog, addMultipleFoodLogs, updateFoodLog, deleteFoodLog, copyMeal, addWater, addWeight, saveCustomFood, setSelectedDate: (date) => setState((current) => ({ ...current, selectedDate: date })), setWalkthroughSeen: () => setState((current) => ({ ...current, walkthroughSeen: true })) }), [state, ready, foods, findFood, getSummary, getLogs, addFoodLog, addMultipleFoodLogs, updateFoodLog, deleteFoodLog, copyMeal, addWater, addWeight, saveCustomFood]);
  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
}

export function useNutrition() { const value = useContext(NutritionContext); if (!value) throw new Error('useNutrition must be used inside NutritionProvider'); return value; }
