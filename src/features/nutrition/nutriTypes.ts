import type { MealType } from './foodTypes';
import type { FoodLog, FoodLogSource, MealSlot, WaterLog } from './types';

// =========================================================================
// ENUMS (nutri.yaml)
// =========================================================================

export type LogSource =
  | 'SEARCH'
  | 'AI_PHOTO'
  | 'BARCODE'
  | 'CUSTOM'
  | 'MEAL_PLAN'
  | 'COPY';

// =========================================================================
// REQUEST SCHEMAS (nutri.yaml)
// =========================================================================

export type CreateFoodLogRequest = {
  foodId: string;
  mealType: MealType;
  servingGrams?: number;
  servingQuantity?: number;
  source?: LogSource;
  loggedDate?: string;
  loggedAt?: string;
  clientUuid: string;
  tempImageKey?: string | null;
  aiPredictedClassId?: number | null;
};

export type UpdateFoodLogRequest = {
  mealType: MealType;
  servingGrams?: number;
  servingQuantity: number;
  clientUpdatedAt?: string | null;
};

export type CopyMealRequest = {
  sourceDate: string;
  targetDate: string;
  mealType?: MealType;
};

export type FoodFeedbackRequest = {
  consented: boolean;
};

export type CreateWaterLogRequest = {
  amountMl: number;
  loggedDate?: string;
  loggedAt?: string;
  clientUuid: string;
  note?: string | null;
};

// =========================================================================
// RESPONSE SCHEMAS (nutri.yaml)
// =========================================================================

export type AllergicIngredientWarning = {
  ingredientId: string;
  code: string;
  name: string;
};

export type FoodLogResponse = {
  id: string;
  foodId: string | null;
  foodName: string | null;
  mealType: MealType;
  servingName: string | null;
  servingGrams: number | null;
  servingQuantity: number;
  source: LogSource;
  loggedDate: string;
  loggedAt: string;
  imageUrl: string | null;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  aiPredictedClassId: number | null;
  feedbackGiven: boolean;
  clientUuid: string;
  hasAllergyWarning: boolean;
  allergicIngredients: AllergicIngredientWarning[];
  createdAt: string;
  updatedAt: string;
};

export type DailyFoodLogsResponse = {
  date: string;
  meals: Partial<Record<MealType, FoodLogResponse[]>>;
  totalCalories: number;
  targetCalories: number | null;
  remainingCalories: number | null;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalSugarG: number;
  totalFiberG: number;
  mealsLoggedCount: number;
};

export type SkippedFoodItem = {
  foodId: string | null;
  reason: string;
};

export type CopyMealResponse = {
  sourceDate: string;
  targetDate: string;
  copiedCount: number;
  copiedLogs: FoodLogResponse[];
  skippedFoods: SkippedFoodItem[];
};

export type NutriBoundingBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type RecognizedFoodItem = {
  classId: number;
  className: string;
  confidence: number;
  bbox: NutriBoundingBox | null;
  foodId: string | null;
  foodName: string | null;
  defaultServingName: string | null;
  defaultServingGrams: number | null;
  estimatedServingGrams: number | null;
  sizeFactor: number;
  caloriesPerServing: number | null;
  proteinPerServing: number | null;
  carbsPerServing: number | null;
  fatPerServing: number | null;
  hasAllergyWarning: boolean;
  allergicIngredients: AllergicIngredientWarning[];
};

export type FoodRecognitionResponse = {
  tempImageKey: string;
  tempImageUrl: string | null;
  modelVersion: string | null;
  items: RecognizedFoodItem[];
};

export type WaterLogResponse = {
  id: string;
  amountMl: number;
  loggedDate: string;
  loggedAt: string;
  note: string | null;
  clientUuid: string;
  createdAt: string;
  updatedAt: string;
};

export type DailyWaterLogsResponse = {
  date: string;
  totalWaterMl: number;
  targetWaterMl: number | null;
  logs: WaterLogResponse[];
};

export type DailySummaryResponse = {
  date: string;
  caloriesConsumed: number;
  targetCalories: number | null;
  remainingCalories: number | null;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sugarG: number;
  fiberG: number;
  waterMl: number;
  targetWaterMl: number | null;
  caloriesBurned: number;
  steps: number;
  weightKg: number | null;
  goalAchieved: boolean;
  sugarExceeded: boolean;
  proteinExceeded: boolean;
  mealsLoggedCount: number;
};

// =========================================================================
// ADAPTERS & HELPERS
// =========================================================================

export function toApiMealType(meal: MealSlot): MealType {
  switch (meal) {
    case 'breakfast':
      return 'BREAKFAST';
    case 'lunch':
      return 'LUNCH';
    case 'dinner':
      return 'DINNER';
    case 'snack':
      return 'SNACK';
  }
}

export function fromApiMealType(mealType: MealType): MealSlot {
  switch (mealType) {
    case 'BREAKFAST':
      return 'breakfast';
    case 'LUNCH':
      return 'lunch';
    case 'DINNER':
      return 'dinner';
    case 'SNACK':
      return 'snack';
  }
}

export function toApiLogSource(source?: FoodLogSource): LogSource {
  if (!source || source === 'VOICE') return 'CUSTOM';
  return source;
}

export function extractTimeHHmm(isoString?: string | null): string | undefined {
  if (!isoString) return undefined;
  const dateObj = new Date(isoString);
  if (Number.isNaN(dateObj.getTime())) return undefined;
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function mapFoodLogResponseToFoodLog(item: FoodLogResponse): FoodLog {
  return {
    id: item.id,
    clientUuid: item.clientUuid,
    date: item.loggedDate,
    meal: fromApiMealType(item.mealType),
    foodId: item.foodId ?? item.id,
    foodName: item.foodName ?? 'Món ăn',
    grams: item.servingGrams ?? 100,
    servingName: item.servingName,
    servingQuantity: item.servingQuantity,
    source: item.source,
    imageUri: item.imageUrl ?? undefined,
    nutritionSnapshot: {
      calories: item.calories,
      protein: item.proteinG,
      carbs: item.carbsG,
      fat: item.fatG,
    },
    sugarG: item.sugarG,
    fiberG: item.fiberG,
    aiPredictedClassId: item.aiPredictedClassId,
    feedbackGiven: item.feedbackGiven,
    hasAllergyWarning: item.hasAllergyWarning,
    allergicIngredients: item.allergicIngredients ?? [],
    updatedAt: item.updatedAt,
    time: extractTimeHHmm(item.loggedAt),
    synced: true,
  };
}

export function flattenDailyFoodLogs(res: DailyFoodLogsResponse): FoodLog[] {
  const meals = res.meals ?? {};
  const list: FoodLog[] = [];
  const order: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  for (const mt of order) {
    const entries = meals[mt];
    if (Array.isArray(entries)) {
      for (const entry of entries) {
        list.push(mapFoodLogResponseToFoodLog(entry));
      }
    }
  }
  return list;
}

export function mapWaterLogResponseToWaterLog(item: WaterLogResponse): WaterLog {
  return {
    id: item.id,
    date: item.loggedDate,
    amountMl: item.amountMl,
    loggedAt: item.loggedAt,
    note: item.note,
    clientUuid: item.clientUuid,
  };
}
