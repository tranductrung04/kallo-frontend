import { api } from '@/services/api/client';
import { getApiErrorMessage, getApiErrorCode, type ApiResponse } from '@/features/auth/api';
import type {
  HealthProfileRequestPayload,
  HealthProfileResponse,
} from './types';

export { getApiErrorMessage, getApiErrorCode };
export type { HealthProfileResponse };
export type HealthProfile = HealthProfileResponse;

function unwrapResponse<T>(response: { data: any }): T {
  if (response.data && typeof response.data === 'object') {
    if ('data' in response.data && response.data.data !== undefined && response.data.data !== null) {
      return response.data.data;
    }
    return response.data;
  }
  return response.data;
}

/**
 * Lấy thông tin hồ sơ sức khỏe hiện tại của người dùng.
 * Endpoint: GET /api/users/me/profile
 * Trả về 404 (PROFILE_NOT_FOUND) nếu chưa tạo hồ sơ.
 */
export async function getHealthProfile(): Promise<HealthProfileResponse> {
  const response = await api.get<ApiResponse<HealthProfileResponse>>('/users/me/profile');
  return unwrapResponse<HealthProfileResponse>(response);
}

/**
 * Tạo mới hoặc cập nhật toàn diện hồ sơ sức khỏe.
 * Endpoint: PUT /api/users/me/profile
 */
export async function saveHealthProfile(
  payload: HealthProfileRequestPayload
): Promise<HealthProfileResponse> {
  const response = await api.put<ApiResponse<HealthProfileResponse>>('/users/me/profile', payload);
  return unwrapResponse<HealthProfileResponse>(response);
}

/**
 * Áp dụng đề xuất cập nhật calo/TDEE từ cân nặng mới nhất.
 * Endpoint: POST /api/users/me/profile/recalculate
 */
export async function recalculateHealthProfile(): Promise<HealthProfileResponse> {
  const response = await api.post<ApiResponse<HealthProfileResponse>>(
    '/users/me/profile/recalculate'
  );
  return unwrapResponse<HealthProfileResponse>(response);
}
