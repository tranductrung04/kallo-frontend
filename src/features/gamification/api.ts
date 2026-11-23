import axios from 'axios';
import { api } from '@/services/api/client';

export type StreakResponse = {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  todayCompleted: boolean;
  atRisk: boolean;
};

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  error?: { code?: string; message?: string; details?: unknown } | null;
  message?: string;
};

function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const payload = response.data as ApiEnvelope<T>;
  return (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;
}

/**
 * Lấy thông tin streak của người dùng hiện tại từ API backend (`GET /api/streak`).
 */
export function getStreak(): Promise<StreakResponse> {
  return api.get<ApiEnvelope<StreakResponse>>('/streak').then(unwrap);
}

/**
 * Định dạng thông báo lỗi thân thiện cho người dùng từ API streak.
 */
export function getStreakApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy dữ liệu chuỗi ngày.';
  }
  if (!error.response) {
    return 'Không thể kết nối đến máy chủ. Đang sử dụng dữ liệu ngoại tuyến.';
  }
  const status = error.response.status;
  const data = error.response.data as ApiEnvelope<unknown> | undefined;
  const serverMsg = data?.error?.message ?? data?.message;
  if (serverMsg) return serverMsg;

  switch (status) {
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case 403:
      return 'Bạn không có quyền truy cập thông tin chuỗi ngày.';
    case 404:
      return 'Không tìm thấy dữ liệu chuỗi ngày.';
    case 500:
    case 502:
    case 503:
      return 'Máy chủ đang bận, vui lòng thử lại sau.';
    default:
      return 'Có lỗi xảy ra khi tải dữ liệu chuỗi ngày. Vui lòng thử lại.';
  }
}
