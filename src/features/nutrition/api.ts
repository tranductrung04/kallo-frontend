import { api } from '@/services/api/client';
import type { AddFoodLogInput, Food, FoodLog, WaterLog, WeightLog } from './types';
import type { RecognitionResponse } from './scanTypes';
import type { ApiResponse, FoodResponse, PageFoodSearchResponse } from './foodTypes';
import {
  searchFoodsApi,
  getFoodDetailApi,
  getFoodByBarcodeApi,
  type SearchFoodsParams,
} from './foodApi';

export * from './foodApi';

export type BarcodeFoodResponse = Food | FoodResponse | { data?: Food | FoodResponse; success?: boolean };

export function getDashboard(date: string) { return api.get(`/reports/dashboard?date=${encodeURIComponent(date)}`); }
export function getFoodLogs(date: string) { return api.get<{ data?: FoodLog[] }>(`/food-logs?date=${encodeURIComponent(date)}`); }
export function createFoodLog(payload: AddFoodLogInput) { return api.post('/food-logs', payload); }
export function getWaterLogs(date: string) { return api.get<{ data?: WaterLog[] }>(`/water-logs?date=${encodeURIComponent(date)}`); }
export function getWeightLogs(from: string, to: string) { return api.get<{ data?: WeightLog[] }>(`/weight-logs?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`); }

export function searchFoods(params: string | SearchFoodsParams) {
  if (typeof params === 'string') {
    return searchFoodsApi({ q: params });
  }
  return searchFoodsApi(params);
}

export function getFood(id: string) {
  return getFoodDetailApi(id);
}

export function getFoodByBarcode(code: string) {
  return api.get<ApiResponse<FoodResponse>>(`/foods/barcode/${encodeURIComponent(code.trim().replace(/\s/g, ''))}`);
}

export async function recognizeFood(imageUri: string) {
  const form = new FormData();
  form.append('image', { uri: imageUri, name: 'meal.jpg', type: 'image/jpeg' } as unknown as Blob);
  const response = await api.post<RecognitionResponse>('/food-logs/recognize', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;
}
