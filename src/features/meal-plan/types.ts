import type { MealSlot, NutritionValues } from '@/features/nutrition/types';

export type MealPlanGoal = {
  durationDays: 1 | 7;
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  dailyBudgetVnd: number;
  excludedAllergens: string[];
};

export type MealPlanItem = {
  id: string;
  foodId: string;
  name: string;
  meal: MealSlot;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  estimatedPriceVnd: number;
  allergens: string[];
};

export type DayMealPlan = {
  dayIndex: number;
  dayLabel: string;
  date?: string;
  items: MealPlanItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCostVnd: number;
};

export type MealPlan = {
  id: string;
  createdAt: string;
  title: string;
  goal: MealPlanGoal;
  days: DayMealPlan[];
  status: 'active' | 'saved' | 'draft';
};

export type MealPlanContextValue = {
  currentPlan: MealPlan | null;
  savedPlans: MealPlan[];
  isGenerating: boolean;
  generatePlan: (goal: MealPlanGoal) => Promise<MealPlan>;
  swapItem: (dayIndex: number, itemId: string, candidateFoodId?: string) => boolean;
  savePlan: (plan: MealPlan) => void;
  deletePlan: (planId: string) => void;
  clearCurrentPlan?: () => void;
  setActivePlan?: (plan: MealPlan) => void;
  applyPlanToDiary: (dayIndex?: number, targetDate?: string) => number;
};
