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
};

export type FoodLogSource = 'SEARCH' | 'CUSTOM' | 'AI_PHOTO' | 'BARCODE' | 'MEAL_PLAN' | 'VOICE';

export type FoodLog = {
  id: string;
  date: string;
  meal: MealSlot;
  foodId: string;
  foodName: string;
  grams: number;
  source?: FoodLogSource;
  imageUri?: string;
  aiConfidence?: number;
  nutritionSnapshot?: NutritionValues;
  time?: string;
};

export type AddFoodLogInput = Omit<FoodLog, 'id' | 'foodName'> & {
  foodName?: string;
};

export type WaterLog = { id: string; date: string; amountMl: number };
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
};

export type NutritionContextValue = {
  state: NutritionState;
  ready: boolean;
  foods: Food[];
  findFood: (id: string) => Food | undefined;
  getSummary: (date: string, caloriesBurned?: number) => NutritionSummary;
  getLogs: (date: string, meal?: MealSlot) => FoodLog[];
  addFoodLog: (input: AddFoodLogInput) => void;
  addMultipleFoodLogs?: (inputs: AddFoodLogInput[]) => void;
  updateFoodLog: (id: string, changes: Partial<Pick<FoodLog, 'grams' | 'meal'>>) => void;
  deleteFoodLog: (id: string) => void;
  copyMeal: (sourceDate: string, targetDate: string, meal: MealSlot) => void;
  addWater: (date: string, amountMl: number) => boolean;
  addWeight: (date: string, weightKg: number) => boolean;
  saveCustomFood: (food: Omit<Food, 'id' | 'isCustom'> & { id?: string }) => string;
  setSelectedDate: (date: string) => void;
  setWalkthroughSeen: () => void;
};
