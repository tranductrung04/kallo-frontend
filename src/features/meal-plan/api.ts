import { api } from '@/services/api/client';
import { unwrapApiResponse } from '@/services/api/apiUtils';
import type { ApiResponse } from '@/features/nutrition/foodTypes';
import type {
  GenerateMealPlanRequest,
  MealPlanResponse,
  PageResponseMealPlanSummary,
  SwapMealPlanItemRequest,
} from './types';

/**
 * 1. Sinh thực đơn cá nhân hóa (1..7 ngày) ở trạng thái DRAFT (POST /api/meal-plans/generate)
 */
export async function generateMealPlanApi(
  payload: GenerateMealPlanRequest
): Promise<MealPlanResponse> {
  const response = await api.post<ApiResponse<MealPlanResponse>>('/meal-plans/generate', payload);
  return unwrapApiResponse(response);
}

/**
 * 2. Lưu thực đơn (DRAFT -> SAVED) (POST /api/meal-plans/{id}/save)
 */
export async function saveMealPlanApi(id: string): Promise<MealPlanResponse> {
  const response = await api.post<ApiResponse<MealPlanResponse>>(
    `/meal-plans/${encodeURIComponent(id)}/save`
  );
  return unwrapApiResponse(response);
}

/**
 * 3. Lấy danh sách thực đơn của người dùng (phân trang) (GET /api/meal-plans)
 */
export async function getMealPlansApi(
  page = 0,
  size = 20
): Promise<PageResponseMealPlanSummary> {
  const response = await api.get<ApiResponse<PageResponseMealPlanSummary>>(
    `/meal-plans?page=${page}&size=${size}`
  );
  return unwrapApiResponse(response);
}

/**
 * 4. Lấy chi tiết thực đơn theo từng ngày và từng buổi ăn (GET /api/meal-plans/{id})
 */
export async function getMealPlanDetailApi(id: string): Promise<MealPlanResponse> {
  const response = await api.get<ApiResponse<MealPlanResponse>>(
    `/meal-plans/${encodeURIComponent(id)}`
  );
  return unwrapApiResponse(response);
}

/**
 * 5. Xóa thực đơn (DELETE /api/meal-plans/{id})
 */
export async function deleteMealPlanApi(id: string): Promise<void> {
  await api.delete(`/meal-plans/${encodeURIComponent(id)}`);
}

/**
 * 6. Đổi 1 món ăn trong thực đơn sang ứng viên tương đương hợp lệ
 * (POST /api/meal-plans/{id}/items/{itemId}/swap)
 */
export async function swapMealPlanItemApi(
  planId: string,
  itemId: string,
  payload?: SwapMealPlanItemRequest
): Promise<MealPlanResponse> {
  const response = await api.post<ApiResponse<MealPlanResponse>>(
    `/meal-plans/${encodeURIComponent(planId)}/items/${encodeURIComponent(itemId)}/swap`,
    payload ?? {}
  );
  return unwrapApiResponse(response);
}

/**
 * 7. Áp dụng thực đơn SAVED vào nhật ký NUTRI (POST /api/meal-plans/{id}/apply)
 */
export async function applyMealPlanApi(
  id: string,
  params?: { date?: string; dayIndex?: number }
): Promise<MealPlanResponse> {
  const query = new URLSearchParams();
  if (params?.date) query.set('date', params.date);
  if (params?.dayIndex !== undefined) query.set('dayIndex', String(params.dayIndex));
  const qs = query.toString();
  const url = `/meal-plans/${encodeURIComponent(id)}/apply${qs ? `?${qs}` : ''}`;
  const response = await api.post<ApiResponse<MealPlanResponse>>(url);
  return unwrapApiResponse(response);
}
