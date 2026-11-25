import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { api } from '@/services/api/client';
import { createWeightLog, getWeightLogs } from '@/features/activity/api';
import { useAuth } from '@/features/auth/AuthProvider';
import { getHealthProfile, type HealthProfileResponse } from '@/features/health-profile/api';
import {
  createCustomFoodApi,
  createRecipeFoodApi,
  deleteCustomFoodApi,
  getFoodDetailApi,
  updateCustomFoodApi,
} from './foodApi';
import {
  mapFoodResponseToFood,
  type CustomFoodRequest,
  type FoodResponse,
  type RecipeFoodRequest,
} from './foodTypes';
import { starterFoods } from './catalog';
import { latestWeight, summarizeLogs, todayKey } from './utils';
import type { AddFoodLogInput, Food, FoodLog, MealSlot, NutritionContextValue, NutritionState } from './types';

const STORAGE_KEY = '@kallo/nutrition-v1';
const initialState: NutritionState = {
  foodLogs: [], waterLogs: [], weightLogs: [], customFoods: [], recentFoodIds: [], favoriteFoodIds: [], selectedDate: todayKey(), walkthroughSeen: false,
  goals: { calories: 2000, protein: 150, carbs: 225, fat: 56, waterMl: 2000, targetWeightKg: 60 },
};

function id(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export const NutritionContext = createContext<NutritionContextValue | null>(null);

export function NutritionProvider({ children }: React.PropsWithChildren) {
  const { status } = useAuth();
  const [state, setState] = useState<NutritionState>(initialState);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then(async (value) => {
        let baseState = initialState;
        if (value) {
          try {
            baseState = { ...initialState, ...JSON.parse(value) };
          } catch {
            /* Ignore invalid local cache. */
          }
        }
        try {
          const profileRaw = await AsyncStorage.getItem('@kallo/health-profile');
          if (profileRaw) {
            const p = JSON.parse(profileRaw);
            baseState = {
              ...baseState,
              goals: {
                calories: p.dailyCalorieGoal || p.dailyCalories || baseState.goals.calories,
                protein: p.proteinGoalG || p.proteinGoalGrams || baseState.goals.protein,
                carbs: p.carbsGoalG || p.carbsGoalGrams || baseState.goals.carbs,
                fat: p.fatGoalG || p.fatGoalGrams || baseState.goals.fat,
                waterMl: p.waterGoalMl || baseState.goals.waterMl,
                targetWeightKg: p.targetWeightKg || baseState.goals.targetWeightKg,
              },
            };
          }
        } catch {
          /* Ignore profile parse errors. */
        }
        setState(baseState);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);
  useEffect(() => { if (ready) void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined); }, [ready, state]);
  useEffect(() => {
    if (ready && status === 'signedIn') {
      void api.get(`/reports/dashboard?date=${encodeURIComponent(state.selectedDate)}`).catch(() => undefined);
    }
  }, [ready, status, state.selectedDate]);
  useEffect(() => {
    if (ready && status === 'signedIn') {
      void (async () => {
        try {
          let p: HealthProfileResponse | null = null;
          const raw = await AsyncStorage.getItem('@kallo/health-profile');
          if (raw) {
            p = JSON.parse(raw);
          }
          const fresh = await getHealthProfile().catch(() => null);
          if (fresh) {
            p = fresh;
            await AsyncStorage.setItem('@kallo/health-profile', JSON.stringify(fresh));
          }
          if (p) {
            const pG = p.macronutrients?.proteinGrams ?? p.proteinGoalG ?? 100;
            const cG = p.macronutrients?.carbGrams ?? p.carbsGoalG ?? 150;
            const fG = p.macronutrients?.fatGrams ?? p.fatGoalG ?? 45;
            const wMl = p.waterGoalMl ?? (p.waterLiters ? Math.round(p.waterLiters * 1000) : 2000);
            setState((prev) => ({
              ...prev,
              goals: {
                calories: p.dailyCalorieGoal ? Math.round(p.dailyCalorieGoal) : prev.goals.calories,
                protein: Math.round(pG),
                carbs: Math.round(cG),
                fat: Math.round(fG),
                waterMl: Math.round(wMl),
                targetWeightKg: p.targetWeightKg ?? prev.goals.targetWeightKg,
              },
            }));
          }
        } catch {
          // ignore
        }
      })();
    }
  }, [ready, status]);

  useEffect(() => {
    if (ready && status === 'signedIn') {
      void getWeightLogs()
        .then((serverWeights) => {
          if (Array.isArray(serverWeights) && serverWeights.length > 0) {
            setState((current) => {
              const serverLogs = serverWeights.map((w) => ({
                id: w.id,
                date: w.loggedAt ? w.loggedAt.split('T')[0] : todayKey(),
                weightKg: Number(w.weightKg),
              }));
              const serverDateSet = new Set(serverLogs.map((l) => l.date));
              const localRemaining = current.weightLogs.filter((l) => !serverDateSet.has(l.date));
              return { ...current, weightLogs: [...serverLogs, ...localRemaining] };
            });
          }
        })
        .catch(() => undefined);
    }
  }, [ready, status]);

  const [serverFoods, setServerFoods] = useState<Food[]>([]);

  const cacheFood = useCallback((input: Food | Food[]) => {
    const items = Array.isArray(input) ? input : [input];
    setServerFoods((prev) => {
      const existingMap = new Map(prev.map((f) => [f.id, f]));
      let hasChanges = false;
      for (const item of items) {
        if (!existingMap.has(item.id)) {
          existingMap.set(item.id, item);
          hasChanges = true;
        }
      }
      return hasChanges ? Array.from(existingMap.values()) : prev;
    });
  }, []);

  const foods = useMemo(() => {
    const map = new Map<string, Food>();
    for (const f of starterFoods) map.set(f.id, f);
    for (const f of serverFoods) map.set(f.id, f);
    for (const f of state.customFoods) map.set(f.id, f);
    return Array.from(map.values());
  }, [state.customFoods, serverFoods]);

  const findFood = useCallback((foodId: string) => foods.find((food) => food.id === foodId), [foods]);

  const fetchFoodDetail = useCallback(async (foodId: string): Promise<Food | undefined> => {
    const found = foods.find((f) => f.id === foodId);
    if (found && found.allergens && (found.caloriesPer100g !== undefined || found.ingredients)) {
      return found;
    }
    try {
      const res = await getFoodDetailApi(foodId);
      const converted = mapFoodResponseToFood(res);
      cacheFood(converted);
      return converted;
    } catch {
      return found;
    }
  }, [foods, cacheFood]);

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
  const addWater = useCallback((date: string, amountMl: number) => {
    if (!Number.isFinite(amountMl) || amountMl === 0 || Math.abs(amountMl) > 5000) return false;
    if (amountMl < 0) {
      let toRemove = Math.abs(amountMl);
      const deletedIds: string[] = [];
      setState((current) => {
        const logsForDate = current.waterLogs.filter((log) => log.date === date);
        const totalWater = logsForDate.reduce((sum, log) => sum + log.amountMl, 0);
        if (totalWater <= 0) return current;

        let rem = Math.min(totalWater, toRemove);
        const remainingDateLogs: typeof current.waterLogs = [];
        const reversed = [...logsForDate].reverse();

        for (const log of reversed) {
          if (rem <= 0) {
            remainingDateLogs.unshift(log);
          } else if (log.amountMl <= rem) {
            rem -= log.amountMl;
            deletedIds.push(log.id);
          } else {
            remainingDateLogs.unshift({ ...log, amountMl: log.amountMl - rem });
            rem = 0;
          }
        }

        return {
          ...current,
          waterLogs: [
            ...current.waterLogs.filter((log) => log.date !== date),
            ...remainingDateLogs,
          ],
        };
      });
      deletedIds.forEach((logId) => {
        void api.delete(`/water-logs/${logId}`).catch(() => undefined);
      });
      return true;
    }

    setState((current) => ({ ...current, waterLogs: [...current.waterLogs, { id: id('water'), date, amountMl }] }));
    void api.post('/water-logs', { date, amountMl }).catch(() => undefined);
    return true;
  }, []);
  const addWeight = useCallback((date: string, weightKg: number) => {
    if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 300) return false;
    const clientUuid = randomUUID();
    const loggedAt = date.includes('T') ? date : `${date}T12:00:00.000Z`;
    setState((current) => ({
      ...current,
      weightLogs: [...current.weightLogs.filter((log) => log.date !== date), { id: clientUuid, date, weightKg }]
    }));
    void createWeightLog({ clientUuid, weightKg, loggedAt }).catch(() => undefined);
    return true;
  }, []);
  const saveCustomFood = useCallback((food: Omit<Food, 'id' | 'isCustom'> & { id?: string }) => {
    const foodId = food.id ?? id('custom');
    const fullFood: Food = { ...food, id: foodId, isCustom: true };
    setState((current) => ({
      ...current,
      customFoods: [...current.customFoods.filter((item) => item.id !== foodId), fullFood],
    }));
    const payload: CustomFoodRequest = {
      name: food.name,
      category: food.category ?? 'OTHER',
      defaultServingName: food.defaultServingName ?? `${food.servingGrams}g`,
      defaultServingGrams: food.servingGrams || 100,
      caloriesPer100g: food.calories,
      proteinPer100g: food.protein,
      carbsPer100g: food.carbs,
      fatPer100g: food.fat,
      sugarPer100g: food.sugar ?? 0,
      fiberPer100g: food.fiber ?? 0,
      suitableMealTypes: food.suitableMealTypes ?? ['LUNCH', 'DINNER'],
      imageUrl: food.imageUrl ?? null,
    };
    const isUuid = !!food.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(food.id);
    if (isUuid) {
      void updateCustomFoodApi(food.id!, payload).catch(() => undefined);
    } else {
      void createCustomFoodApi(payload)
        .then((created) => {
          const mapped = mapFoodResponseToFood(created);
          setState((current) => ({
            ...current,
            customFoods: current.customFoods.map((item) => (item.id === foodId ? mapped : item)),
          }));
        })
        .catch(() => undefined);
    }
    return foodId;
  }, []);

  const saveCustomFoodAsync = useCallback(async (payload: CustomFoodRequest, foodId?: string): Promise<Food> => {
    const isUuid = !!foodId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(foodId);
    let res: FoodResponse;
    if (isUuid && foodId) {
      res = await updateCustomFoodApi(foodId, payload);
    } else {
      res = await createCustomFoodApi(payload);
    }
    const food = mapFoodResponseToFood(res);
    setState((current) => ({
      ...current,
      customFoods: [...current.customFoods.filter((item) => item.id !== (foodId || food.id)), food],
    }));
    return food;
  }, []);

  const deleteCustomFoodAsync = useCallback(async (foodId: string): Promise<void> => {
    const isUuid = !!foodId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(foodId);
    if (isUuid) {
      await deleteCustomFoodApi(foodId);
    }
    setState((current) => ({
      ...current,
      customFoods: current.customFoods.filter((item) => item.id !== foodId),
      recentFoodIds: current.recentFoodIds.filter((item) => item !== foodId),
      favoriteFoodIds: current.favoriteFoodIds.filter((item) => item !== foodId),
    }));
  }, []);

  const saveRecipeAsync = useCallback(async (payload: RecipeFoodRequest): Promise<Food> => {
    const res = await createRecipeFoodApi(payload);
    const food = mapFoodResponseToFood(res);
    setState((current) => ({
      ...current,
      customFoods: [...current.customFoods.filter((item) => item.id !== food.id), food],
    }));
    return food;
  }, []);

  const value = useMemo<NutritionContextValue>(() => ({
    state,
    ready,
    foods,
    findFood,
    fetchFoodDetail,
    cacheFood,
    getSummary,
    getLogs,
    addFoodLog,
    addMultipleFoodLogs,
    updateFoodLog,
    deleteFoodLog,
    copyMeal,
    addWater,
    addWeight,
    saveCustomFood,
    saveCustomFoodAsync,
    deleteCustomFoodAsync,
    saveRecipeAsync,
    setSelectedDate: (date) => setState((current) => ({ ...current, selectedDate: date })),
    setWalkthroughSeen: () => setState((current) => ({ ...current, walkthroughSeen: true })),
  }), [
    state,
    ready,
    foods,
    findFood,
    fetchFoodDetail,
    cacheFood,
    getSummary,
    getLogs,
    addFoodLog,
    addMultipleFoodLogs,
    updateFoodLog,
    deleteFoodLog,
    copyMeal,
    addWater,
    addWeight,
    saveCustomFood,
    saveCustomFoodAsync,
    deleteCustomFoodAsync,
    saveRecipeAsync,
  ]);
  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
}

export function useNutrition() { const value = useContext(NutritionContext); if (!value) throw new Error('useNutrition must be used inside NutritionProvider'); return value; }
