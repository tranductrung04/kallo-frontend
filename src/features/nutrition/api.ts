import { api } from '@/services/api/client';
import type { AddFoodLogInput, Food, FoodLog, WaterLog, WeightLog } from './types';
import type { RecognitionResponse } from './scanTypes';

export type BarcodeFoodResponse = Food | { data?: Food };

export function getDashboard(date: string) { return api.get(`/reports/dashboard?date=${encodeURIComponent(date)}`); }
export function getFoodLogs(date: string) { return api.get<{ data?: FoodLog[] }>(`/food-logs?date=${encodeURIComponent(date)}`); }
export function createFoodLog(payload: AddFoodLogInput) { return api.post('/food-logs', payload); }
export function getWaterLogs(date: string) { return api.get<{ data?: WaterLog[] }>(`/water-logs?date=${encodeURIComponent(date)}`); }
export function getWeightLogs(from: string, to: string) { return api.get<{ data?: WeightLog[] }>(`/weight-logs?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`); }
export function searchFoods(query: string) { return api.get<{ data?: Food[] }>(`/foods?query=${encodeURIComponent(query)}`); }
export function getFood(id: string) { return api.get<{ data?: Food }>(`/foods/${encodeURIComponent(id)}`); }
export function getFoodByBarcode(code: string) { return api.get<BarcodeFoodResponse>(`/foods/barcode/${encodeURIComponent(code)}`); }

export async function recognizeFood(imageUri: string) {
  const form = new FormData();
  form.append('image', { uri: imageUri, name: 'meal.jpg', type: 'image/jpeg' } as unknown as Blob);
  const response = await api.post<RecognitionResponse>('/food-logs/recognize', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;
}
