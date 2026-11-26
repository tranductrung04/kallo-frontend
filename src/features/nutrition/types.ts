import type {
  FoodCategory,
  FoodIngredientItemResponse,
  FoodSource,
} from './foodTypes';
import type {
  AllergicIngredientWarning,
  CopyMealResponse,
  DailySummaryResponse,
} from './nutriTypes';

export * from './foodTypes';
export * from './nutriTypes';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_SLOTS: Array<{ key: MealSlot; label: string }> = [
  { key: 'breakfast', label: 'Bữa sáng' },
  { key: 'lunch', label: 'Bữa trưa' },
  { key: 'dinner', label: 'Bữa tối' },
  { key: 'snack', label: 'Bữa phụ' },
];

export type NutritionValues = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Food = NutritionValues & {
  id: string;
  name: string;
  servingGrams: number;
  allergens: string[];
  barcode?: string;
  isCustom?: boolean;
  category?: FoodCategory;
  defaultServingName?: string;
  imageUrl?: string | null;
  source?: FoodSource;
  sugar?: number;
  fiber?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  carbsPer100g?: number;
  fatPer100g?: number;
  sugarPer100g?: number;
  fiberPer100g?: number;
  caloriesPerServing?: number;
  proteinPerServing?: number;
  carbsPerServing?: number;
  fatPerServing?: number;
  sugarPerServing?: number;
  fiberPerServing?: number;
  isVerified?: boolean;
  ownerUserId?: string | null;
  ingredients?: FoodIngredientItemResponse[];
  vietfoodClassId?: number | null;
  suitableMealTypes?: string[];
  referencePriceVnd?: number | null;
};

export type FoodLogSource = 'SEARCH' | 'CUSTOM' | 'AI_PHOTO' | 'BARCODE' | 'MEAL_PLAN' | 'COPY' | 'VOICE';

export type FoodLog = {
  id: string;
  clientUuid?: string;
  date: string;
  meal: MealSlot;
  foodId: string;
  foodName: string;
  grams: number;
  servingName?: string | null;
  servingQuantity?: number;
  source?: FoodLogSource;
  imageUri?: string;
  aiConfidence?: number;
  aiPredictedClassId?: number | null;
  feedbackGiven?: boolean;
  nutritionSnapshot?: NutritionValues;
  sugarG?: number;
  fiberG?: number;
  hasAllergyWarning?: boolean;
  allergicIngredients?: AllergicIngredientWarning[];
  updatedAt?: string;
  time?: string;
  synced?: boolean;
};

export type AddFoodLogInput = Omit<FoodLog, 'id' | 'foodName'> & {
  foodName?: string;
  tempImageKey?: string | null;
  loggedAt?: string;
};

export type WaterLog = {
  id: string;
  date: string;
  amountMl: number;
  loggedAt?: string;
  note?: string | null;
  clientUuid?: string;
};
export type WeightLog = { id: string; date: string; weightKg: number };

export type NutritionGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  targetWeightKg: number;
};

export type NutritionState = {
  foodLogs: FoodLog[];
  waterLogs: WaterLog[];
  weightLogs: WeightLog[];
  customFoods: Food[];
  recentFoodIds: string[];
  favoriteFoodIds: string[];
  selectedDate: string;
  walkthroughSeen: boolean;
  goals: NutritionGoals;
};

export type NutritionSummary = NutritionValues & {
  caloriesRemaining: number;
  waterMl: number;
  weightKg?: number;
  targetWeightKg: number;
  waterGoalMl: number;
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  caloriesBurned: number;
  sugar?: number;
  fiber?: number;
  steps?: number;
  goalAchieved?: boolean;
  sugarExceeded?: boolean;
  proteinExceeded?: boolean;
  mealsLoggedCount?: number;
};

export type NutritionContextValue = {
  state: NutritionState;
  ready: boolean;
  foods: Food[];
  recentServerFoods?: Food[];
  dailySummaries?: Record<string, DailySummaryResponse>;
  findFood: (id: string) => Food | undefined;
  getSummary: (date: string, caloriesBurned?: number) => NutritionSummary;
  getLogs: (date: string, meal?: MealSlot) => FoodLog[];
  addFoodLog: (input: AddFoodLogInput) => void;
  addFoodLogAsync?: (input: AddFoodLogInput) => Promise<FoodLog | undefined>;
  addMultipleFoodLogs?: (inputs: AddFoodLogInput[]) => void;
  updateFoodLog: (id: string, changes: Partial<Pick<FoodLog, 'grams' | 'meal'>>) => void;
  deleteFoodLog: (id: string) => void;
  copyMeal: (sourceDate: string, targetDate: string, meal: MealSlot) => Promise<CopyMealResponse | void>;
  addWater: (date: string, amountMl: number) => boolean;
  addWeight: (date: string, weightKg: number) => boolean;
  saveCustomFood: (food: Omit<Food, 'id' | 'isCustom'> & { id?: string }) => string;
  saveCustomFoodAsync: (payload: import('./foodTypes').CustomFoodRequest, id?: string) => Promise<Food>;
  deleteCustomFoodAsync: (id: string) => Promise<void>;
  saveRecipeAsync: (payload: import('./foodTypes').RecipeFoodRequest) => Promise<Food>;
  cacheFood: (food: Food | Food[]) => void;
  fetchFoodDetail: (id: string) => Promise<Food | undefined>;
  refreshDateData?: (date?: string, force?: boolean) => Promise<void>;
  refreshRecentFoods?: (limit?: number) => Promise<Food[]>;
  recalculateSummary?: (date?: string) => Promise<DailySummaryResponse | undefined>;
  setSelectedDate: (date: string) => void;
  setWalkthroughSeen: () => void;
};
