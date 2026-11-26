import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiErrorStatus, isUuid } from '@/services/api/apiUtils';
import { useAuth } from '@/features/auth/AuthProvider';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import type { AddFoodLogInput } from '@/features/nutrition/types';
import {
  applyMealPlanApi,
  deleteMealPlanApi,
  generateMealPlanApi,
  getMealPlanDetailApi,
  getMealPlansApi,
  saveMealPlanApi,
  swapMealPlanItemApi,
} from './api';
import {
  mapMealPlanResponseToMealPlan,
  mapMealPlanResponseToSummary,
  type MealPlan,
  type MealPlanContextValue,
  type MealPlanGoal,
  type MealPlanItem,
  type MealPlanSummaryResponse,
} from './types';
import {
  computeItemNutrients,
  generateMealPlan,
  VIETNAMESE_RECIPES,
} from './utils';

const STORAGE_KEY = '@kallo/meal-plans-v1';

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

export function MealPlanProvider({ children }: React.PropsWithChildren) {
  const { status } = useAuth();
  const {
    addMultipleFoodLogs,
    addFoodLog,
    refreshDateData,
    state: nutritionState,
  } = useNutrition();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [savedPlanSummaries, setSavedPlanSummaries] = useState<MealPlanSummaryResponse[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  // Restore saved meal plans from local cache
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (!data) return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.currentPlan) setCurrentPlan(parsed.currentPlan);
        if (Array.isArray(parsed.savedPlans)) setSavedPlans(parsed.savedPlans);
        if (Array.isArray(parsed.savedPlanSummaries)) {
          setSavedPlanSummaries(parsed.savedPlanSummaries);
        }
      } catch {
        /* Ignore invalid cache */
      }
    });
  }, []);

  // Persist local cache
  useEffect(() => {
    void AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentPlan, savedPlans, savedPlanSummaries })
    ).catch(() => undefined);
  }, [currentPlan, savedPlans, savedPlanSummaries]);

  const upsertSummary = useCallback((summary: MealPlanSummaryResponse) => {
    setSavedPlanSummaries((prev) => [
      summary,
      ...prev.filter((item) => item.id !== summary.id),
    ]);
  }, []);

  const savedPlanSummariesRef = useRef<MealPlanSummaryResponse[]>(savedPlanSummaries);
  savedPlanSummariesRef.current = savedPlanSummaries;
  const lastPlansFetchRef = useRef<number>(0);

  const refreshPlans = useCallback(async (): Promise<MealPlanSummaryResponse[]> => {
    if (status !== 'signedIn') return savedPlanSummariesRef.current;
    if (Date.now() - lastPlansFetchRef.current < 5000 && savedPlanSummariesRef.current.length > 0) {
      return savedPlanSummariesRef.current;
    }
    lastPlansFetchRef.current = Date.now();
    setIsLoadingPlans(true);
    try {
      const page = await getMealPlansApi(0, 20);
      const items = page.items ?? [];
      setSavedPlanSummaries(items);
      return items;
    } catch {
      return savedPlanSummariesRef.current;
    } finally {
      setIsLoadingPlans(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'signedIn') {
      void refreshPlans();
    }
  }, [status]);

  const loadPlanDetail = useCallback(
    async (planId: string): Promise<MealPlan | null> => {
      if (!isUuid(planId)) {
        const localMatch = savedPlans.find((p) => p.id === planId);
        if (localMatch) {
          setCurrentPlan(localMatch);
          return localMatch;
        }
        return null;
      }

      const res = await getMealPlanDetailApi(planId);
      const mapped = mapMealPlanResponseToMealPlan(res);
      setCurrentPlan(mapped);
      upsertSummary(mapMealPlanResponseToSummary(res));
      return mapped;
    },
    [savedPlans, upsertSummary]
  );

  const generatePlan = useCallback(
    async (goal: MealPlanGoal): Promise<MealPlan> => {
      setIsGenerating(true);
      try {
        if (status === 'signedIn') {
          try {
            const res = await generateMealPlanApi({
              planDate: goal.planDate || nutritionState.selectedDate || todayKey(),
              days: goal.durationDays,
              calorieTargetOverride: goal.targetCalories,
              maxBudgetVnd: goal.dailyBudgetVnd > 0 ? goal.dailyBudgetVnd : null,
              includeCustomFoods: goal.includeCustomFoods ?? true,
              name: goal.name ?? null,
            });
            const mapped = mapMealPlanResponseToMealPlan(res);
            setCurrentPlan(mapped);
            upsertSummary(mapMealPlanResponseToSummary(res));
            return mapped;
          } catch (err) {
            const httpStatus = getApiErrorStatus(err);
            // Re-throw domain/validation errors (400, 404 PROFILE_NOT_FOUND, 422 INSUFFICIENT_FOOD_DATA)
            if (httpStatus && httpStatus >= 400 && httpStatus < 500) {
              throw err;
            }
            // Fall through to offline mock generator only when server/network is unreachable
          }
        }

        await new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
        const newPlan = generateMealPlan(goal, VIETNAMESE_RECIPES);
        setCurrentPlan(newPlan);
        return newPlan;
      } finally {
        setIsGenerating(false);
      }
    },
    [status, nutritionState.selectedDate, upsertSummary]
  );

  const swapItemLocal = useCallback(
    (dayIndex: number, itemId: string, candidateFoodId?: string): boolean => {
      if (!currentPlan) return false;
      const day = currentPlan.days[dayIndex];
      if (!day) return false;
      const itemIndex = day.items.findIndex((i) => i.id === itemId);
      if (itemIndex < 0) return false;

      const oldItem = day.items[itemIndex];
      const candidate = candidateFoodId
        ? VIETNAMESE_RECIPES.find((r) => r.id === candidateFoodId)
        : VIETNAMESE_RECIPES.find(
            (r) =>
              r.id !== oldItem.foodId &&
              r.suitableMeals.includes(oldItem.meal) &&
              !r.allergens.some((a) =>
                currentPlan.goal.excludedAllergens.some((ex) =>
                  a.toLowerCase().includes(ex.toLowerCase())
                )
              )
          );

      if (!candidate) return false;

      const baseCal = candidate.calories / 100;
      const newGrams = baseCal > 0 ? Math.round(oldItem.calories / baseCal) : candidate.defaultGrams;
      const boundedGrams = Math.min(600, Math.max(50, newGrams));
      const nutrients = computeItemNutrients(candidate, boundedGrams);
      const priceRatio = boundedGrams / candidate.defaultGrams;
      const estPrice =
        Math.round((candidate.priceVnd * Math.min(1.5, Math.max(0.7, priceRatio))) / 1000) * 1000;

      const newItem: MealPlanItem = {
        id: `item-${dayIndex}-${oldItem.meal}-${candidate.id}-${Date.now()}`,
        foodId: candidate.id,
        name: candidate.name,
        meal: oldItem.meal,
        grams: boundedGrams,
        calories: nutrients.calories,
        protein: nutrients.protein,
        carbs: nutrients.carbs,
        fat: nutrients.fat,
        estimatedPriceVnd: estPrice,
        allergens: candidate.allergens,
      };

      const updatedItems = [...day.items];
      updatedItems[itemIndex] = newItem;

      const updatedDay = {
        ...day,
        items: updatedItems,
        totalCalories: updatedItems.reduce((s, i) => s + i.calories, 0),
        totalProtein: Math.round(updatedItems.reduce((s, i) => s + i.protein, 0) * 10) / 10,
        totalCarbs: Math.round(updatedItems.reduce((s, i) => s + i.carbs, 0) * 10) / 10,
        totalFat: Math.round(updatedItems.reduce((s, i) => s + i.fat, 0) * 10) / 10,
        totalCostVnd: updatedItems.reduce((s, i) => s + i.estimatedPriceVnd, 0),
      };

      const updatedDays = [...currentPlan.days];
      updatedDays[dayIndex] = updatedDay;

      setCurrentPlan({
        ...currentPlan,
        days: updatedDays,
      });
      return true;
    },
    [currentPlan]
  );

  const swapItemAsync = useCallback(
    async (
      dayIndex: number,
      itemId: string,
      options?: {
        candidateFoodId?: string;
        excludedFoodIds?: string[];
        maxBudgetVndOverride?: number | null;
      }
    ): Promise<boolean> => {
      if (!currentPlan) return false;

      if (status === 'signedIn' && isUuid(currentPlan.id) && isUuid(itemId)) {
        const res = await swapMealPlanItemApi(currentPlan.id, itemId, {
          excludedFoodIds: options?.excludedFoodIds ?? [],
          maxBudgetVndOverride: options?.maxBudgetVndOverride ?? null,
        });
        const mapped = mapMealPlanResponseToMealPlan(res);
        setCurrentPlan(mapped);
        upsertSummary(mapMealPlanResponseToSummary(res));
        return true;
      }

      return swapItemLocal(dayIndex, itemId, options?.candidateFoodId);
    },
    [currentPlan, status, swapItemLocal, upsertSummary]
  );

  const swapItem = useCallback(
    (dayIndex: number, itemId: string, candidateFoodId?: string): boolean => {
      if (currentPlan && isUuid(currentPlan.id) && isUuid(itemId)) {
        void swapItemAsync(dayIndex, itemId, { candidateFoodId }).catch(() => undefined);
        return true;
      }
      return swapItemLocal(dayIndex, itemId, candidateFoodId);
    },
    [currentPlan, swapItemAsync, swapItemLocal]
  );

  const savePlanAsync = useCallback(
    async (plan: MealPlan): Promise<MealPlan> => {
      if (status === 'signedIn' && isUuid(plan.id)) {
        const res = await saveMealPlanApi(plan.id);
        const mapped = mapMealPlanResponseToMealPlan(res);
        setCurrentPlan(mapped);
        setSavedPlans((current) => [mapped, ...current.filter((p) => p.id !== mapped.id)]);
        upsertSummary(mapMealPlanResponseToSummary(res));
        return mapped;
      }

      const savedLocal: MealPlan = { ...plan, status: 'saved' };
      setCurrentPlan((curr) => (curr?.id === plan.id ? savedLocal : curr));
      setSavedPlans((current) => [savedLocal, ...current.filter((p) => p.id !== plan.id)]);
      return savedLocal;
    },
    [status, upsertSummary]
  );

  const savePlan = useCallback(
    (plan: MealPlan) => {
      void savePlanAsync(plan).catch(() => undefined);
    },
    [savePlanAsync]
  );

  const deletePlan = useCallback(
    (planId: string) => {
      setSavedPlans((current) => current.filter((p) => p.id !== planId));
      setSavedPlanSummaries((current) => current.filter((p) => p.id !== planId));
      if (currentPlan?.id === planId) {
        setCurrentPlan(null);
      }
      if (status === 'signedIn' && isUuid(planId)) {
        void deleteMealPlanApi(planId).catch(() => undefined);
      }
    },
    [currentPlan, status]
  );

  const clearCurrentPlan = useCallback(() => {
    setCurrentPlan(null);
  }, []);

  const setActivePlan = useCallback((plan: MealPlan) => {
    setCurrentPlan(plan);
    if (!isUuid(plan.id)) {
      setSavedPlans((current) => [plan, ...current.filter((p) => p.id !== plan.id)]);
    }
  }, []);

  const applyPlanToDiaryAsync = useCallback(
    async (dayIndex = 0, targetDate?: string): Promise<number> => {
      if (!currentPlan) return 0;
      const day = currentPlan.days[dayIndex];
      if (!day || day.items.length === 0) return 0;

      const logDate = targetDate || day.date || nutritionState.selectedDate || todayKey();

      if (status === 'signedIn' && isUuid(currentPlan.id)) {
        // Ensure DRAFT plan transitions to SAVED before calling /apply
        if (currentPlan.apiStatus === 'DRAFT') {
          await savePlanAsync(currentPlan);
        }

        const isWeekly = (currentPlan.daysCount ?? currentPlan.days.length) > 1;
        const serverDayIdx = day.serverDayIndex ?? dayIndex + 1;
        const res = await applyMealPlanApi(currentPlan.id, {
          date: logDate,
          ...(isWeekly ? { dayIndex: serverDayIdx } : {}),
        });
        const mapped = mapMealPlanResponseToMealPlan(res);
        setCurrentPlan(mapped);
        upsertSummary(mapMealPlanResponseToSummary(res));
        await refreshDateData?.(logDate, true);
        return day.items.length;
      }

      const inputs: AddFoodLogInput[] = day.items.map((item) => ({
        date: logDate,
        meal: item.meal,
        foodId: item.foodId,
        foodName: item.name,
        grams: item.grams,
        source: 'MEAL_PLAN',
        nutritionSnapshot: {
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        },
      }));

      if (addMultipleFoodLogs) {
        addMultipleFoodLogs(inputs);
      } else {
        inputs.forEach((input) => addFoodLog(input));
      }

      return inputs.length;
    },
    [
      currentPlan,
      nutritionState.selectedDate,
      status,
      savePlanAsync,
      upsertSummary,
      refreshDateData,
      addMultipleFoodLogs,
      addFoodLog,
    ]
  );

  const applyPlanToDiary = useCallback(
    (dayIndex = 0, targetDate?: string): number => {
      if (!currentPlan) return 0;
      const day = currentPlan.days[dayIndex];
      if (!day || day.items.length === 0) return 0;

      if (status === 'signedIn' && isUuid(currentPlan.id)) {
        void applyPlanToDiaryAsync(dayIndex, targetDate).catch(() => undefined);
        return day.items.length;
      }

      const logDate = targetDate || nutritionState.selectedDate || todayKey();
      const inputs: AddFoodLogInput[] = day.items.map((item) => ({
        date: logDate,
        meal: item.meal,
        foodId: item.foodId,
        foodName: item.name,
        grams: item.grams,
        source: 'MEAL_PLAN',
        nutritionSnapshot: {
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
        },
      }));

      if (addMultipleFoodLogs) {
        addMultipleFoodLogs(inputs);
      } else {
        inputs.forEach((input) => addFoodLog(input));
      }

      return inputs.length;
    },
    [currentPlan, status, applyPlanToDiaryAsync, nutritionState.selectedDate, addMultipleFoodLogs, addFoodLog]
  );

  const value: MealPlanContextValue = {
    currentPlan,
    savedPlans,
    savedPlanSummaries,
    isGenerating,
    isLoadingPlans,
    refreshPlans,
    loadPlanDetail,
    generatePlan,
    swapItem,
    swapItemAsync,
    savePlan,
    savePlanAsync,
    deletePlan,
    clearCurrentPlan,
    setActivePlan,
    applyPlanToDiary,
    applyPlanToDiaryAsync,
  };

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>;
}

export function useMealPlan() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error('useMealPlan must be used inside MealPlanProvider');
  return ctx;
}
