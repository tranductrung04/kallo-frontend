import type { FoodSource, MealType } from '@/features/nutrition/foodTypes';
import { fromApiMealType } from '@/features/nutrition/nutriTypes';
import type { MealSlot } from '@/features/nutrition/types';

// =========================================================================
// PLAN.YAML ENUMS & DTOs
// =========================================================================

export type MealPlanType = 'DAILY' | 'WEEKLY';
export type MealPlanStatus = 'DRAFT' | 'SAVED' | 'APPLIED';

export type GenerateMealPlanRequest = {
  planDate: string;
  days?: number;
  calorieTargetOverride?: number | null;
  maxBudgetVnd?: number | null;
  excludedFoodIds?: string[];
  includeCustomFoods?: boolean;
  name?: string | null;
};

export type SwapMealPlanItemRequest = {
  maxBudgetVndOverride?: number | null;
  excludedFoodIds?: string[];
};

export type MealPlanItemResponse = {
  id: string;
  foodId: string;
  foodName: string | null;
  foodImageUrl: string | null;
  foodSource: FoodSource | null;
  servingName: string;
  servingGrams: number;
  servingMultiplier: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  estimatedPriceVnd: number;
};

export type MealPlanSlotResponse = {
  mealType: MealType;
  targetCalories: number;
  totalCalories: number;
  items: MealPlanItemResponse[];
};

export type MealPlanDayResponse = {
  dayIndex: number;
  mealDate: string;
  targetCalories: number;
  totalCalories: number;
  calorieDifferencePct: number;
  estimatedCostVnd: number;
  meals: MealPlanSlotResponse[];
};

export type MealPlanResponse = {
  id: string;
  name: string;
  description: string | null;
  type: MealPlanType;
  planDate: string;
  daysCount: number;
  status: MealPlanStatus;
  targetCalories: number;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalSugarG: number;
  totalFiberG: number;
  estimatedCostVnd: number;
  maxBudgetVnd: number | null;
  preferenceMatchScore: number;
  medicalWarning: string | null;
  appliedAt: string | null;
  appliedDate: string | null;
  days: MealPlanDayResponse[];
  createdAt: string;
  updatedAt: string;
};

export type MealPlanSummaryResponse = {
  id: string;
  name: string;
  type: MealPlanType;
  planDate: string;
  daysCount: number;
  status: MealPlanStatus;
  targetCalories: number;
  totalCalories: number;
  estimatedCostVnd: number;
  maxBudgetVnd: number | null;
  preferenceMatchScore: number;
  medicalWarning: string | null;
  createdAt: string;
};

export type PageResponseMealPlanSummary = {
  items: MealPlanSummaryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

// =========================================================================
// UI DOMAIN TYPES (Compatible with curatedPlans + server MealPlanResponse)
// =========================================================================

export type MealPlanGoal = {
  durationDays: 1 | 7;
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  dailyBudgetVnd: number;
  excludedAllergens: string[];
  planDate?: string;
  includeCustomFoods?: boolean;
  name?: string;
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
  servingName?: string;
  servingMultiplier?: number;
  foodImageUrl?: string | null;
  foodSource?: FoodSource | null;
  sugarG?: number;
  fiberG?: number;
};

export type DayMealPlan = {
  dayIndex: number;
  serverDayIndex?: number;
  dayLabel: string;
  date?: string;
  items: MealPlanItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCostVnd: number;
  calorieDifferencePct?: number;
};

export type MealPlan = {
  id: string;
  createdAt: string;
  title: string;
  description?: string | null;
  goal: MealPlanGoal;
  days: DayMealPlan[];
  status: 'active' | 'saved' | 'draft';
  apiStatus?: MealPlanStatus;
  planType?: MealPlanType;
  planDate?: string;
  daysCount?: number;
  estimatedCostVnd?: number;
  maxBudgetVnd?: number | null;
  preferenceMatchScore?: number;
  medicalWarning?: string | null;
  appliedAt?: string | null;
  appliedDate?: string | null;
  isServerPlan?: boolean;
};

export type MealPlanContextValue = {
  currentPlan: MealPlan | null;
  savedPlans: MealPlan[];
  savedPlanSummaries?: MealPlanSummaryResponse[];
  isGenerating: boolean;
  isLoadingPlans?: boolean;
  refreshPlans?: () => Promise<MealPlanSummaryResponse[]>;
  loadPlanDetail?: (planId: string) => Promise<MealPlan | null>;
  generatePlan: (goal: MealPlanGoal) => Promise<MealPlan>;
  swapItem: (dayIndex: number, itemId: string, candidateFoodId?: string) => boolean;
  swapItemAsync?: (
    dayIndex: number,
    itemId: string,
    options?: { candidateFoodId?: string; excludedFoodIds?: string[]; maxBudgetVndOverride?: number | null }
  ) => Promise<boolean>;
  savePlan: (plan: MealPlan) => void;
  savePlanAsync?: (plan: MealPlan) => Promise<MealPlan>;
  deletePlan: (planId: string) => void;
  clearCurrentPlan?: () => void;
  setActivePlan?: (plan: MealPlan) => void;
  applyPlanToDiary: (dayIndex?: number, targetDate?: string) => number;
  applyPlanToDiaryAsync?: (dayIndex?: number, targetDate?: string) => Promise<number>;
};

// =========================================================================
// ADAPTERS
// =========================================================================

function mapApiStatusToLocal(status: MealPlanStatus): 'active' | 'saved' | 'draft' {
  switch (status) {
    case 'APPLIED':
      return 'active';
    case 'SAVED':
      return 'saved';
    case 'DRAFT':
    default:
      return 'draft';
  }
}

export function mapMealPlanResponseToMealPlan(res: MealPlanResponse): MealPlan {
  const daysCount = Math.max(1, res.daysCount || res.days?.length || 1);
  const dailyCal = Math.round(res.targetCalories || res.totalCalories / daysCount || 2000);
  const dailyBudget =
    res.maxBudgetVnd ?? (Math.round(res.estimatedCostVnd / daysCount) || 100000);

  const days: DayMealPlan[] = (res.days ?? []).map((day, idx) => {
    const items: MealPlanItem[] = [];
    for (const slot of day.meals ?? []) {
      const meal = fromApiMealType(slot.mealType);
      for (const item of slot.items ?? []) {
        items.push({
          id: item.id,
          foodId: item.foodId,
          name: item.foodName ?? 'Món ăn',
          meal,
          grams: item.servingGrams,
          calories: item.calories,
          protein: item.proteinG,
          carbs: item.carbsG,
          fat: item.fatG,
          estimatedPriceVnd: item.estimatedPriceVnd ?? 0,
          allergens: [],
          servingName: item.servingName,
          servingMultiplier: item.servingMultiplier,
          foodImageUrl: item.foodImageUrl,
          foodSource: item.foodSource,
          sugarG: item.sugarG,
          fiberG: item.fiberG,
        });
      }
    }

    const totalProtein = Math.round(items.reduce((s, i) => s + i.protein, 0) * 10) / 10;
    const totalCarbs = Math.round(items.reduce((s, i) => s + i.carbs, 0) * 10) / 10;
    const totalFat = Math.round(items.reduce((s, i) => s + i.fat, 0) * 10) / 10;

    return {
      dayIndex: idx,
      serverDayIndex: day.dayIndex,
      dayLabel: `Ngày ${day.dayIndex}`,
      date: day.mealDate,
      items,
      totalCalories: day.totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalCostVnd: day.estimatedCostVnd,
      calorieDifferencePct: day.calorieDifferencePct,
    };
  });

  return {
    id: res.id,
    createdAt: res.createdAt,
    title: res.name,
    description: res.description,
    status: mapApiStatusToLocal(res.status),
    apiStatus: res.status,
    planType: res.type,
    planDate: res.planDate,
    daysCount: res.daysCount,
    estimatedCostVnd: res.estimatedCostVnd,
    maxBudgetVnd: res.maxBudgetVnd,
    preferenceMatchScore: res.preferenceMatchScore,
    medicalWarning: res.medicalWarning,
    appliedAt: res.appliedAt,
    appliedDate: res.appliedDate,
    isServerPlan: true,
    goal: {
      durationDays: daysCount > 1 ? 7 : 1,
      targetCalories: dailyCal,
      proteinTarget: Math.round(res.totalProteinG / daysCount),
      carbsTarget: Math.round(res.totalCarbsG / daysCount),
      fatTarget: Math.round(res.totalFatG / daysCount),
      dailyBudgetVnd: dailyBudget,
      excludedAllergens: [],
      planDate: res.planDate,
    },
    days,
  };
}

export function mapMealPlanResponseToSummary(res: MealPlanResponse): MealPlanSummaryResponse {
  return {
    id: res.id,
    name: res.name,
    type: res.type,
    planDate: res.planDate,
    daysCount: res.daysCount,
    status: res.status,
    targetCalories: res.targetCalories,
    totalCalories: res.totalCalories,
    estimatedCostVnd: res.estimatedCostVnd,
    maxBudgetVnd: res.maxBudgetVnd,
    preferenceMatchScore: res.preferenceMatchScore,
    medicalWarning: res.medicalWarning,
    createdAt: res.createdAt,
  };
}
