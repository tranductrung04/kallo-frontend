import type {
  FoodRecognitionResponse,
  NutriBoundingBox,
  RecognizedFoodItem,
} from './nutriTypes';

export type BoundingBox = NutriBoundingBox;

export type RecognitionNutrition = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type RecognitionPortion = {
  grams: number;
  size_factor: number;
  unit: string;
};

export type RecognitionItem = RecognizedFoodItem;

export type RecognitionResponse = FoodRecognitionResponse;

type LegacyRecognitionItem = {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox?: BoundingBox | null;
  portion?: Partial<RecognitionPortion>;
  nutrition?: Partial<RecognitionNutrition>;
};

export function normalizeFoodRecognitionResponse(
  raw: FoodRecognitionResponse | { data?: FoodRecognitionResponse } | { items?: Array<RecognizedFoodItem | LegacyRecognitionItem>; request_id?: string; model_version?: string }
): FoodRecognitionResponse {
  const body = (raw && typeof raw === 'object' && 'data' in raw && raw.data
    ? raw.data
    : raw) as Partial<FoodRecognitionResponse> & {
    model_version?: string;
    items?: Array<RecognizedFoodItem | LegacyRecognitionItem>;
  };

  const items: RecognizedFoodItem[] = (body?.items ?? []).map((item) => {
    if ('classId' in item || 'className' in item) {
      return item as RecognizedFoodItem;
    }
    const legacy = item as LegacyRecognitionItem;
    return {
      classId: legacy.class_id,
      className: legacy.class_name,
      confidence: legacy.confidence,
      bbox: legacy.bbox ?? null,
      foodId: null,
      foodName: legacy.class_name,
      defaultServingName: legacy.portion?.unit ?? '1 phần',
      defaultServingGrams: legacy.portion?.grams ?? 100,
      estimatedServingGrams: legacy.portion?.grams ?? 100,
      sizeFactor: legacy.portion?.size_factor ?? 1,
      caloriesPerServing: legacy.nutrition?.calories ?? 0,
      proteinPerServing: legacy.nutrition?.protein_g ?? 0,
      carbsPerServing: legacy.nutrition?.carbs_g ?? 0,
      fatPerServing: legacy.nutrition?.fat_g ?? 0,
      hasAllergyWarning: false,
      allergicIngredients: [],
    };
  });

  return {
    tempImageKey: body?.tempImageKey ?? '',
    tempImageUrl: body?.tempImageUrl ?? null,
    modelVersion: body?.modelVersion ?? body?.model_version ?? null,
    items,
  };
}
