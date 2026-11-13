import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import type { AddFoodLogInput } from '@/features/nutrition/types';
import type { MealPlan, MealPlanContextValue, MealPlanGoal, MealPlanItem } from './types';
import {
  computeItemNutrients,
  generateMealPlan,
  VIETNAMESE_RECIPES,
} from './utils';

const STORAGE_KEY = '@kallo/meal-plans-v1';

const MealPlanContext = createContext<MealPlanContextValue | null>(null);

export function MealPlanProvider({ children }: React.PropsWithChildren) {
  const { addMultipleFoodLogs, addFoodLog, state: nutritionState } = useNutrition();
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Restore saved meal plans
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (!data) return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.currentPlan) setCurrentPlan(parsed.currentPlan);
        if (Array.isArray(parsed.savedPlans)) setSavedPlans(parsed.savedPlans);
      } catch {
        /* Ignore invalid cache */
      }
    });
  }, []);

  // Save changes
  useEffect(() => {
    void AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentPlan, savedPlans })
    ).catch(() => undefined);
  }, [currentPlan, savedPlans]);

  const generatePlan = useCallback(async (goal: MealPlanGoal): Promise<MealPlan> => {
    setIsGenerating(true);
    // Simulate AI generation delay 600ms for smooth UX
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 600));
    const newPlan = generateMealPlan(goal, VIETNAMESE_RECIPES);
    setCurrentPlan(newPlan);
    setIsGenerating(false);
    return newPlan;
  }, []);

  const swapItem = useCallback((dayIndex: number, itemId: string, candidateFoodId?: string): boolean => {
    if (!currentPlan) return false;
    const day = currentPlan.days[dayIndex];
    if (!day) return false;
    const itemIndex = day.items.findIndex((i) => i.id === itemId);
    if (itemIndex < 0) return false;

    const oldItem = day.items[itemIndex];
    // Find candidate recipe
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

    // Scale portion to match old item's calories approximately
    const baseCal = candidate.calories / 100;
    const newGrams = baseCal > 0 ? Math.round(oldItem.calories / baseCal) : candidate.defaultGrams;
    const boundedGrams = Math.min(600, Math.max(50, newGrams));
    const nutrients = computeItemNutrients(candidate, boundedGrams);
    const priceRatio = boundedGrams / candidate.defaultGrams;
    const estPrice = Math.round(candidate.priceVnd * Math.min(1.5, Math.max(0.7, priceRatio)) / 1000) * 1000;

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
  }, [currentPlan]);

  const savePlan = useCallback((plan: MealPlan) => {
    setSavedPlans((current) => [
      plan,
      ...current.filter((p) => p.id !== plan.id),
    ]);
  }, []);

  const deletePlan = useCallback((planId: string) => {
    setSavedPlans((current) => current.filter((p) => p.id !== planId));
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }
  }, [currentPlan]);

  const clearCurrentPlan = useCallback(() => {
    setCurrentPlan(null);
  }, []);

  const setActivePlan = useCallback((plan: MealPlan) => {
    setCurrentPlan(plan);
    setSavedPlans((current) => [
      plan,
      ...current.filter((p) => p.id !== plan.id),
    ]);
  }, []);

  const applyPlanToDiary = useCallback((dayIndex = 0, targetDate?: string): number => {
    if (!currentPlan) return 0;
    const day = currentPlan.days[dayIndex];
    if (!day || day.items.length === 0) return 0;

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
  }, [currentPlan, nutritionState.selectedDate, addMultipleFoodLogs, addFoodLog]);

  const value: MealPlanContextValue = {
    currentPlan,
    savedPlans,
    isGenerating,
    generatePlan,
    swapItem,
    savePlan,
    deletePlan,
    clearCurrentPlan,
    setActivePlan,
    applyPlanToDiary,
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const ctx = useContext(MealPlanContext);
  if (!ctx) throw new Error('useMealPlan must be used inside MealPlanProvider');
  return ctx;
}
