import type { Food, NutritionValues } from './types';

// =========================================================================
// ENUMS
// =========================================================================

export type FoodCategory =
  | 'STAPLE'
  | 'NOODLE'
  | 'RICE'
  | 'SOUP'
  | 'MEAT'
  | 'SEAFOOD'
  | 'VEGETABLE'
  | 'SNACK'
  | 'BEVERAGE'
  | 'OTHER';

export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  STAPLE: 'Món chính / Tinh bột',
  NOODLE: 'Món bún / phở / mì',
  RICE: 'Món cơm',
  SOUP: 'Món canh / súp',
  MEAT: 'Thịt & Gia cầm',
  SEAFOOD: 'Hải sản',
  VEGETABLE: 'Rau & Củ',
  SNACK: 'Ăn vặt',
  BEVERAGE: 'Đồ uống',
  OTHER: 'Khác',
};

export type FoodSource = 'SYSTEM' | 'OFF' | 'USER_CUSTOM';

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

// =========================================================================
// REQUEST SCHEMAS
// =========================================================================

export type CustomIngredientRequest = {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  sugarPer100g?: number;
  fiberPer100g?: number;
};

export type CustomFoodRequest = {
  name: string;
  category: FoodCategory;
  defaultServingName: string;
  defaultServingGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  sugarPer100g?: number;
  fiberPer100g?: number;
  suitableMealTypes?: string[];
  imageUrl?: string | null;
};

export type RecipeItemRequest = {
  ingredientId: string;
  quantityGrams: number;
};

export type RecipeFoodRequest = {
  name: string;
  category: FoodCategory;
  defaultServingName: string;
  items: RecipeItemRequest[];
  suitableMealTypes?: string[];
  imageUrl?: string | null;
};

// =========================================================================
// RESPONSE SCHEMAS
// =========================================================================

export type IngredientResponse = {
  id: string;
  code: string | null;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  sugarPer100g: number;
  fiberPer100g: number;
  isAllergen: boolean;
  source: FoodSource;
  ownerUserId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FoodIngredientItemResponse = {
  ingredientId: string;
  ingredientName: string;
  quantityGrams: number | null;
  isAllergen: boolean;
  caloriesPer100g: number;
};

export type FoodResponse = {
  id: string;
  name: string;
  category: FoodCategory;
  defaultServingName: string;
  defaultServingGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  sugarPer100g: number;
  fiberPer100g: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  sugarPerServing: number;
  fiberPerServing: number;
  imageUrl: string | null;
  barcode: string | null;
  source: FoodSource;
  vietfoodClassId: number | null;
  suitableMealTypes: string[];
  referencePriceVnd: number | null;
  isVerified: boolean;
  ownerUserId: string | null;
  ingredients: FoodIngredientItemResponse[];
  allergens: string[];
  createdAt: string;
  updatedAt: string;
};

export type FoodSearchItemResponse = {
  id: string;
  name: string;
  category: FoodCategory;
  defaultServingName: string;
  defaultServingGrams: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  imageUrl: string | null;
  source: FoodSource;
  isVerified: boolean;
};

export type PageFoodSearchResponse = {
  items: FoodSearchItemResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApiResponseErrorDetail = {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: ApiResponseErrorDetail | null;
};

// =========================================================================
// ADAPTERS & HELPERS
// =========================================================================

export function mapFoodResponseToFood(item: FoodResponse): Food {
  return {
    id: item.id,
    name: item.name,
    servingGrams: item.defaultServingGrams || 100,
    calories: item.caloriesPer100g,
    protein: item.proteinPer100g,
    carbs: item.carbsPer100g,
    fat: item.fatPer100g,
    sugar: item.sugarPer100g,
    fiber: item.fiberPer100g,
    allergens: item.allergens ?? [],
    barcode: item.barcode ?? undefined,
    isCustom: item.source === 'USER_CUSTOM',
    category: item.category,
    defaultServingName: item.defaultServingName,
    imageUrl: item.imageUrl,
    source: item.source,
    caloriesPer100g: item.caloriesPer100g,
    proteinPer100g: item.proteinPer100g,
    carbsPer100g: item.carbsPer100g,
    fatPer100g: item.fatPer100g,
    sugarPer100g: item.sugarPer100g,
    fiberPer100g: item.fiberPer100g,
    caloriesPerServing: item.caloriesPerServing,
    proteinPerServing: item.proteinPerServing,
    carbsPerServing: item.carbsPerServing,
    fatPerServing: item.fatPerServing,
    sugarPerServing: item.sugarPerServing,
    fiberPerServing: item.fiberPerServing,
    isVerified: item.isVerified,
    ownerUserId: item.ownerUserId,
    ingredients: item.ingredients,
    vietfoodClassId: item.vietfoodClassId,
    suitableMealTypes: item.suitableMealTypes,
    referencePriceVnd: item.referencePriceVnd,
  };
}

export function mapFoodSearchItemToFood(item: FoodSearchItemResponse): Food {
  const servingGrams = item.defaultServingGrams > 0 ? item.defaultServingGrams : 100;
  const ratio = 100 / servingGrams;

  const caloriesPer100g = Math.round(item.caloriesPerServing * ratio * 10) / 10;
  const proteinPer100g = Math.round(item.proteinPerServing * ratio * 10) / 10;
  const carbsPer100g = Math.round(item.carbsPerServing * ratio * 10) / 10;
  const fatPer100g = Math.round(item.fatPerServing * ratio * 10) / 10;

  return {
    id: item.id,
    name: item.name,
    servingGrams,
    calories: caloriesPer100g,
    protein: proteinPer100g,
    carbs: carbsPer100g,
    fat: fatPer100g,
    allergens: [],
    isCustom: item.source === 'USER_CUSTOM',
    category: item.category,
    defaultServingName: item.defaultServingName,
    imageUrl: item.imageUrl,
    source: item.source,
    caloriesPer100g,
    proteinPer100g,
    carbsPer100g,
    fatPer100g,
    caloriesPerServing: item.caloriesPerServing,
    proteinPerServing: item.proteinPerServing,
    carbsPerServing: item.carbsPerServing,
    fatPerServing: item.fatPerServing,
    isVerified: item.isVerified,
  };
}
