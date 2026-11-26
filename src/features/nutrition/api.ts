import { api } from '@/services/api/client';
import { unwrapApiResponse } from '@/services/api/apiUtils';
import type { WeightLog } from './types';
import type { RecognitionResponse } from './scanTypes';
import type {
  ApiResponse,
  Food,
  FoodResponse,
  FoodSearchItemResponse,
} from './types';
import type {
  CopyMealRequest,
  CopyMealResponse,
  CreateFoodLogRequest,
  CreateWaterLogRequest,
  DailyFoodLogsResponse,
  DailySummaryResponse,
  DailyWaterLogsResponse,
  FoodFeedbackRequest,
  FoodLogResponse,
  FoodRecognitionResponse,
  UpdateFoodLogRequest,
  WaterLogResponse,
} from './nutriTypes';
import {
  searchFoodsApi,
  getFoodDetailApi,
  type SearchFoodsParams,
} from './foodApi';

export * from './foodApi';

export type BarcodeFoodResponse = Food | FoodResponse | { data?: Food | FoodResponse; success?: boolean };

// =========================================================================
// FOOD LOGS ENDPOINTS (nutri.yaml)
// =========================================================================

export async function createFoodLogApi(payload: CreateFoodLogRequest): Promise<FoodLogResponse> {
  const response = await api.post<ApiResponse<FoodLogResponse>>('/food-logs', payload);
  return unwrapApiResponse(response);
}

export async function getDailyFoodLogsApi(date?: string): Promise<DailyFoodLogsResponse> {
  const url = date ? `/food-logs?date=${encodeURIComponent(date)}` : '/food-logs';
  const response = await api.get<ApiResponse<DailyFoodLogsResponse>>(url);
  return unwrapApiResponse(response);
}

export async function getFoodLogDetailApi(id: string): Promise<FoodLogResponse> {
  const response = await api.get<ApiResponse<FoodLogResponse>>(`/food-logs/${encodeURIComponent(id)}`);
  return unwrapApiResponse(response);
}

export async function updateFoodLogApi(
  id: string,
  payload: UpdateFoodLogRequest
): Promise<FoodLogResponse> {
  const response = await api.put<ApiResponse<FoodLogResponse>>(
    `/food-logs/${encodeURIComponent(id)}`,
    payload
  );
  return unwrapApiResponse(response);
}

export async function deleteFoodLogApi(id: string): Promise<void> {
  await api.delete(`/food-logs/${encodeURIComponent(id)}`);
}

export async function copyMealApi(payload: CopyMealRequest): Promise<CopyMealResponse> {
  const response = await api.post<ApiResponse<CopyMealResponse>>('/food-logs/copy', payload);
  return unwrapApiResponse(response);
}

export async function getRecentFoodsApi(limit = 10): Promise<FoodSearchItemResponse[]> {
  const safeLimit = Math.min(50, Math.max(1, Math.round(limit)));
  const response = await api.get<ApiResponse<FoodSearchItemResponse[]>>(
    `/food-logs/recent?limit=${safeLimit}`
  );
  return unwrapApiResponse(response);
}

export async function recognizeFoodV2Api(
  imageUri: string,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg'
): Promise<FoodRecognitionResponse> {
  const form = new FormData();
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  form.append('image', {
    uri: imageUri,
    name: `meal.${ext}`,
    type: mimeType,
  } as unknown as Blob);
  const response = await api.post<ApiResponse<FoodRecognitionResponse>>('/food-logs/recognize', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiResponse(response);
}

export async function sendFoodFeedbackApi(
  id: string,
  payload: FoodFeedbackRequest
): Promise<FoodLogResponse> {
  const response = await api.post<ApiResponse<FoodLogResponse>>(
    `/food-logs/${encodeURIComponent(id)}/feedback`,
    payload
  );
  return unwrapApiResponse(response);
}

// =========================================================================
// WATER LOGS ENDPOINTS (nutri.yaml)
// =========================================================================

export async function createWaterLogApi(payload: CreateWaterLogRequest): Promise<WaterLogResponse> {
  const response = await api.post<ApiResponse<WaterLogResponse>>('/water-logs', payload);
  return unwrapApiResponse(response);
}

export async function getDailyWaterLogsApi(date?: string): Promise<DailyWaterLogsResponse> {
  const url = date ? `/water-logs?date=${encodeURIComponent(date)}` : '/water-logs';
  const response = await api.get<ApiResponse<DailyWaterLogsResponse>>(url);
  return unwrapApiResponse(response);
}

export async function deleteWaterLogApi(id: string): Promise<void> {
  await api.delete(`/water-logs/${encodeURIComponent(id)}`);
}

// =========================================================================
// DAILY SUMMARIES ENDPOINTS (nutri.yaml)
// =========================================================================

export async function getTodayDailySummaryApi(): Promise<DailySummaryResponse> {
  const response = await api.get<ApiResponse<DailySummaryResponse>>('/daily-summaries/today');
  return unwrapApiResponse(response);
}

export async function getDailySummaryApi(date: string): Promise<DailySummaryResponse> {
  const response = await api.get<ApiResponse<DailySummaryResponse>>(
    `/daily-summaries?date=${encodeURIComponent(date)}`
  );
  return unwrapApiResponse(response);
}

export async function getDailySummaryRangeApi(
  from: string,
  to: string
): Promise<DailySummaryResponse[]> {
  const response = await api.get<ApiResponse<DailySummaryResponse[]>>(
    `/daily-summaries/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
  return unwrapApiResponse(response);
}

export async function recalculateDailySummaryApi(date?: string): Promise<DailySummaryResponse> {
  const url = date
    ? `/daily-summaries/recalculate?date=${encodeURIComponent(date)}`
    : '/daily-summaries/recalculate';
  const response = await api.post<ApiResponse<DailySummaryResponse>>(url);
  return unwrapApiResponse(response);
}

// =========================================================================
// LEGACY / COMPATIBILITY EXPORTS
// =========================================================================

export function getDashboard(date: string) {
  return getDailySummaryApi(date);
}
export function getFoodLogs(date: string) {
  return getDailyFoodLogsApi(date);
}
export function createFoodLog(payload: CreateFoodLogRequest) {
  return createFoodLogApi(payload);
}
export function getWaterLogs(date: string) {
  return getDailyWaterLogsApi(date);
}
export function getWeightLogs(from: string, to: string) {
  return api.get<{ data?: WeightLog[] }>(
    `/weight-logs?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
}

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
  return api.get<ApiResponse<FoodResponse>>(
    `/foods/barcode/${encodeURIComponent(code.trim().replace(/\s/g, ''))}`
  );
}

export async function recognizeFood(imageUri: string) {
  const form = new FormData();
  form.append('image', { uri: imageUri, name: 'meal.jpg', type: 'image/jpeg' } as unknown as Blob);
  const response = await api.post<RecognitionResponse>('/food-logs/recognize', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
