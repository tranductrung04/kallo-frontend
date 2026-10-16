export type BoundingBox = { x: number; y: number; w: number; h: number };

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

export type RecognitionItem = {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: BoundingBox;
  portion: RecognitionPortion;
  nutrition: RecognitionNutrition;
};

export type RecognitionResponse = {
  request_id?: string;
  model_version?: string;
  inference_ms?: number;
  items: RecognitionItem[];
};
