import axios from 'axios';
import { randomUUID } from 'expo-crypto';
import { api } from '@/services/api/client';
import type { ActivityType } from './types';

export type ActivityIntensity = 'LIGHT' | 'MODERATE' | 'VIGOROUS';
export type ActivitySource = 'MANUAL' | 'GPS' | 'SENSOR' | 'HEALTH_CONNECT' | 'HEALTHKIT';

export type ActivityTypeResponse = {
  code: string;
  nameVi: string;
  category: string;
  metLight: number | null;
  metModerate: number;
  metVigorous: number | null;
  hasDistance: boolean;
  sortOrder: number;
};

export type ActivityResponse = {
  id: string;
  userId: string;
  clientUuid: string;
  activityType: string;
  intensity: ActivityIntensity;
  met: number;
  weightKgUsed: number;
  durationMin: number;
  distanceKm: number | null;
  caloriesBurned: number;
  source: ActivitySource;
  startedAt: string;
  endedAt: string;
  supersededBy?: string | null;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  routePolyline?: string | null;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CreateActivityInput = {
  clientUuid?: string;
  activityType: string;
  intensity?: ActivityIntensity;
  startedAt: string;
  durationMin: number;
  distanceKm?: number;
  note?: string;
  source?: 'MANUAL' | 'GPS' | 'SENSOR';
  externalId?: string;
  routePolyline?: string;
};

export type UpdateActivityInput = {
  activityType: string;
  intensity?: ActivityIntensity;
  startedAt: string;
  durationMin: number;
  distanceKm?: number;
  note?: string;
  clientUpdatedAt?: string;
  routePolyline?: string;
};

export type DailyActivityStats = {
  date: string;
  totalSteps: number;
  activityCalories: number;
  stepCalories: number;
  totalCaloriesBurned: number;
  activeMinutes: number;
  averageHeartRate: number | null;
  maxHeartRate: number | null;
  weightKg: number | null;
  stepsSource: string | null;
};

export type HealthProvider = 'HEALTH_CONNECT' | 'HEALTHKIT' | 'DEVICE_SENSOR';
export type HealthDataType = 'STEPS' | 'HEART_RATE';

export type HealthSyncRecordInput = {
  dataType: HealthDataType;
  externalId: string;
  startTime: string;
  endTime: string;
  value: number;
  valueMin?: number;
  valueMax?: number;
  dataOrigin?: string;
};

export type HealthSyncInput = {
  provider: HealthProvider;
  records: HealthSyncRecordInput[];
};

export type HealthSyncResponse = {
  received: number;
  created: number;
  updated: number;
  unchanged: number;
  rejected: Array<{ index: number; reason: string }>;
};

export type HealthSyncStatusResponse = {
  provider: HealthProvider;
  dataType: HealthDataType;
  lastEndTime: string | null;
  lastSyncedAt: string | null;
};

export type WeightLogResponse = {
  id: string;
  userId: string;
  clientUuid: string;
  weightKg: number;
  loggedAt: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type CreateWeightLogInput = {
  clientUuid?: string;
  weightKg: number;
  loggedAt?: string;
  note?: string;
};

export type UpdateWeightLogInput = {
  weightKg: number;
  loggedAt: string;
  note?: string;
  clientUpdatedAt?: string;
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

export function normalizeIntensity(
  intensity?: 'low' | 'moderate' | 'high' | 'LIGHT' | 'MODERATE' | 'VIGOROUS' | string
): ActivityIntensity {
  if (!intensity) return 'MODERATE';
  const lower = intensity.toLowerCase();
  if (lower === 'low' || lower === 'light') return 'LIGHT';
  if (lower === 'high' || lower === 'vigorous') return 'VIGOROUS';
  return 'MODERATE';
}

// ── Activities API ──────────────────────────────────────────────

export function getActivities(params?: {
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  includeSuperseded?: boolean;
}): Promise<PageResponse<ActivityResponse>> {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  if (params?.page !== undefined) query.set('page', String(params.page));
  if (params?.size !== undefined) query.set('size', String(params.size));
  if (params?.includeSuperseded !== undefined) query.set('includeSuperseded', String(params.includeSuperseded));
  const queryString = query.toString();
  return api
    .get<ApiEnvelope<PageResponse<ActivityResponse>>>(`/activities${queryString ? `?${queryString}` : ''}`)
    .then(unwrap);
}

export function getActivityById(id: string): Promise<ActivityResponse> {
  return api.get<ApiEnvelope<ActivityResponse>>(`/activities/${encodeURIComponent(id)}`).then(unwrap);
}

export function createActivity(input: CreateActivityInput): Promise<ActivityResponse> {
  const payload = {
    ...input,
    clientUuid: input.clientUuid ?? randomUUID(),
    intensity: normalizeIntensity(input.intensity),
    source: input.source ?? 'MANUAL',
  };
  return api.post<ApiEnvelope<ActivityResponse>>('/activities', payload).then(unwrap);
}

export function updateActivity(id: string, input: UpdateActivityInput): Promise<ActivityResponse> {
  const payload = {
    ...input,
    intensity: normalizeIntensity(input.intensity),
  };
  return api.put<ApiEnvelope<ActivityResponse>>(`/activities/${encodeURIComponent(id)}`, payload).then(unwrap);
}

export function deleteActivity(id: string): Promise<void> {
  return api.delete(`/activities/${encodeURIComponent(id)}`).then(() => undefined);
}

export function getActivitySummary(params?: {
  date?: string;
  from?: string;
  to?: string;
}): Promise<DailyActivityStats[]> {
  const query = new URLSearchParams();
  if (params?.date) query.set('date', params.date);
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  const queryString = query.toString();
  return api
    .get<ApiEnvelope<DailyActivityStats[]>>(`/activities/summary${queryString ? `?${queryString}` : ''}`)
    .then(unwrap);
}

// ── Activity Types API ──────────────────────────────────────────

export function getActivityTypes(): Promise<ActivityTypeResponse[]> {
  return api.get<ApiEnvelope<ActivityTypeResponse[]>>('/activity-types').then(unwrap);
}

// ── Health Sync API ─────────────────────────────────────────────

export function syncHealth(input: HealthSyncInput): Promise<HealthSyncResponse> {
  return api.post<ApiEnvelope<HealthSyncResponse>>('/health-sync', input).then(unwrap);
}

export function getHealthSyncStatus(): Promise<HealthSyncStatusResponse[]> {
  return api.get<ApiEnvelope<HealthSyncStatusResponse[]>>('/health-sync/status').then(unwrap);
}

// ── Weight Logs API ─────────────────────────────────────────────

export function getWeightLogs(params?: { from?: string; to?: string }): Promise<WeightLogResponse[]> {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  const queryString = query.toString();
  return api
    .get<ApiEnvelope<WeightLogResponse[]>>(`/weight-logs${queryString ? `?${queryString}` : ''}`)
    .then(unwrap);
}

export function getWeightLogById(id: string): Promise<WeightLogResponse> {
  return api.get<ApiEnvelope<WeightLogResponse>>(`/weight-logs/${encodeURIComponent(id)}`).then(unwrap);
}

export function createWeightLog(input: CreateWeightLogInput): Promise<WeightLogResponse> {
  const payload = {
    clientUuid: input.clientUuid ?? randomUUID(),
    weightKg: input.weightKg,
    loggedAt: input.loggedAt ?? new Date().toISOString(),
    note: input.note,
  };
  return api.post<ApiEnvelope<WeightLogResponse>>('/weight-logs', payload).then(unwrap);
}

export function updateWeightLog(id: string, input: UpdateWeightLogInput): Promise<WeightLogResponse> {
  return api.put<ApiEnvelope<WeightLogResponse>>(`/weight-logs/${encodeURIComponent(id)}`, input).then(unwrap);
}

export function deleteWeightLog(id: string): Promise<void> {
  return api.delete(`/weight-logs/${encodeURIComponent(id)}`).then(() => undefined);
}

// ── Error Message Formatter ─────────────────────────────────────

export function getActivityApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại.';
  }
  if (!error.response) {
    return 'Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng rồi thử lại nhé.';
  }
  const status = error.response.status;
  const data = error.response.data as ApiEnvelope<unknown> | undefined;
  const code = data?.error?.code;
  const serverMsg = data?.error?.message ?? data?.message;

  if (code) {
    switch (code) {
      case 'WEIGHT_REQUIRED':
        return 'Vui lòng cập nhật cân nặng trong hồ sơ hoặc ghi nhận cân nặng trước khi lưu hoạt động.';
      case 'ACTIVITY_TYPE_UNKNOWN':
        return 'Loại hoạt động không hợp lệ hoặc chưa được hỗ trợ.';
      case 'RECORD_DELETED':
        return 'Bản ghi này đã bị xoá.';
      case 'INVALID_PARAMETER':
        return serverMsg || 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại.';
      case 'INVALID_TIME_RANGE':
        return 'Khoảng thời gian không hợp lệ (tối đa 30 ngày cho tóm tắt).';
      case 'TIMESTAMP_OUT_OF_RANGE':
        return 'Thời gian bắt đầu hoạt động không hợp lệ (vượt quá thời gian cho phép).';
      case 'SYNC_BATCH_TOO_LARGE':
        return 'Dữ liệu đồng bộ vượt quá số lượng tối đa cho phép.';
      case 'DISTANCE_NOT_ALLOWED':
        return 'Loại hoạt động này không hỗ trợ ghi nhận quãng đường.';
      case 'DISTANCE_REQUIRED':
        return 'Vui lòng nhập quãng đường cho hoạt động này.';
      case 'NOT_FOUND':
        return 'Không tìm thấy dữ liệu yêu cầu.';
      case 'UNAUTHORIZED':
        return 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.';
    }
  }

  if (serverMsg) return serverMsg;

  switch (status) {
    case 400:
      return 'Dữ liệu gửi lên không đúng định dạng.';
    case 401:
      return 'Phiên đăng nhập đã hết hạn.';
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này.';
    case 404:
      return 'Không tìm thấy dữ liệu.';
    case 409:
      return 'Bản ghi bị xung đột hoặc đã tồn tại.';
    case 500:
    case 502:
    case 503:
      return 'Máy chủ đang bận, vui lòng thử lại sau ít phút.';
    default:
      return 'Có lỗi xảy ra khi xử lý hoạt động. Vui lòng thử lại.';
  }
}
