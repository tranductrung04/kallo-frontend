import { api } from "@/services/api/client";
import {
  getApiErrorMessage,
  getApiErrorCode,
  type ApiResponse,
} from "@/features/auth/api";
import type {
  HealthProfileRequestPayload,
  HealthProfileResponse,
  ChronicConditionResponse,
  UserChronicConditionResponse,
  UpdateUserChronicConditionsRequest,
  UserAllergyResponse,
  UpdateUserAllergiesRequest,
} from "./types";

export { getApiErrorMessage, getApiErrorCode };
export type { HealthProfileResponse };
export type HealthProfile = HealthProfileResponse;

function unwrapResponse<T>(response: { data: any }): T {
  if (response.data && typeof response.data === "object") {
    if (
      "data" in response.data &&
      response.data.data !== undefined &&
      response.data.data !== null
    ) {
      return response.data.data;
    }
    return response.data;
  }
  return response.data;
}

function normalizeProfile(raw: any): HealthProfileResponse {
  if (!raw || typeof raw !== "object") return raw;
  const dob = raw.dob || raw.birthDate;
  const waterLiters =
    raw.waterLiters ?? (raw.waterGoalMl ? raw.waterGoalMl / 1000 : 2.0);
  const rateClamped = raw.rateClamped ?? raw.safetyClamped ?? false;

  const proteinGrams =
    raw.macronutrients?.proteinGrams ?? raw.proteinGoalG ?? 100;
  const carbGrams = raw.macronutrients?.carbGrams ?? raw.carbsGoalG ?? 150;
  const fatGrams = raw.macronutrients?.fatGrams ?? raw.fatGoalG ?? 45;

  return {
    ...raw,
    dob,
    birthDate: dob,
    waterLiters,
    waterGoalMl: raw.waterGoalMl ?? Math.round(waterLiters * 1000),
    rateClamped,
    safetyClamped: rateClamped,
    macronutrients: raw.macronutrients || {
      proteinGrams,
      fatGrams,
      carbGrams,
    },
    proteinGoalG: proteinGrams,
    carbsGoalG: carbGrams,
    fatGoalG: fatGrams,
  };
}

/**
 * 1. Lấy thông tin hồ sơ sức khỏe hiện tại của người dùng.
 * Endpoint: GET /api/v1/users/me/profile
 * Trả về 404 (PROFILE_NOT_FOUND) nếu chưa tạo hồ sơ.
 */
export async function getHealthProfile(): Promise<HealthProfileResponse> {
  const response = await api.get<ApiResponse<HealthProfileResponse>>(
    "/v1/users/me/profile",
  );
  const data = unwrapResponse<HealthProfileResponse>(response);
  return normalizeProfile(data);
}

/**
 * 2. Tạo mới hoặc cập nhật toàn diện hồ sơ sức khỏe.
 * Endpoint: PUT /api/v1/users/me/profile
 */
export async function saveHealthProfile(
  payload: HealthProfileRequestPayload,
): Promise<HealthProfileResponse> {
  // Chuẩn hoá payload khớp với ProfileRequestDto Spring Boot
  const cleanPayload = {
    gender: payload.gender,
    dob: payload.dob || payload.birthDate,
    heightCm: payload.heightCm,
    weightKg: payload.weightKg,
    activityLevel: payload.activityLevel,
    goalType: payload.goalType,
    targetWeightKg:
      payload.goalType === "MAINTAIN_WEIGHT" ? null : payload.targetWeightKg,
    weeklyRateKg:
      payload.goalType === "MAINTAIN_WEIGHT" ? 0.0 : payload.weeklyRateKg,
  };

  const response = await api.put<ApiResponse<HealthProfileResponse>>(
    "/v1/users/me/profile",
    cleanPayload,
  );
  const data = unwrapResponse<HealthProfileResponse>(response);
  return normalizeProfile(data);
}

/**
 * 3. Áp dụng đề xuất cập nhật calo/TDEE từ cân nặng mới nhất.
 * Endpoint: POST /api/v1/users/me/profile/recalculate
 */
export async function recalculateHealthProfile(): Promise<HealthProfileResponse> {
  const response = await api.post<ApiResponse<HealthProfileResponse>>(
    "/v1/users/me/profile/recalculate",
  );
  const data = unwrapResponse<HealthProfileResponse>(response);
  return normalizeProfile(data);
}

/**
 * 4. Lấy danh mục bệnh mạn tính hệ thống.
 * Endpoint: GET /api/v1/chronic-conditions
 */
export async function getSystemChronicConditions(): Promise<
  ChronicConditionResponse[]
> {
  const response = await api.get<ApiResponse<ChronicConditionResponse[]>>(
    "/v1/chronic-conditions",
  );
  return unwrapResponse<ChronicConditionResponse[]>(response);
}

/**
 * 5. Lấy danh sách bệnh mạn tính của người dùng hiện tại.
 * Endpoint: GET /api/v1/users/me/chronic-conditions
 */
export async function getUserChronicConditions(): Promise<
  UserChronicConditionResponse[]
> {
  const response = await api.get<ApiResponse<UserChronicConditionResponse[]>>(
    "/v1/users/me/chronic-conditions",
  );
  return unwrapResponse<UserChronicConditionResponse[]>(response);
}

/**
 * 6. Cập nhật danh sách bệnh mạn tính của người dùng.
 * Endpoint: PUT /api/v1/users/me/chronic-conditions
 */
export async function updateUserChronicConditions(
  payload: UpdateUserChronicConditionsRequest,
): Promise<UserChronicConditionResponse[]> {
  const response = await api.put<ApiResponse<UserChronicConditionResponse[]>>(
    "/v1/users/me/chronic-conditions",
    payload,
  );
  return unwrapResponse<UserChronicConditionResponse[]>(response);
}

/**
 * 7. Lấy danh sách dị ứng nguyên liệu của người dùng hiện tại.
 * Endpoint: GET /api/v1/users/me/allergies
 */
export async function getUserAllergies(): Promise<UserAllergyResponse[]> {
  const response = await api.get<ApiResponse<UserAllergyResponse[]>>(
    "/v1/users/me/allergies",
  );
  return unwrapResponse<UserAllergyResponse[]>(response);
}

/**
 * 8. Cập nhật danh sách dị ứng nguyên liệu của người dùng.
 * Endpoint: PUT /api/v1/users/me/allergies
 */
export async function updateUserAllergies(
  payload: UpdateUserAllergiesRequest,
): Promise<UserAllergyResponse[]> {
  const response = await api.put<ApiResponse<UserAllergyResponse[]>>(
    "/v1/users/me/allergies",
    payload,
  );
  return unwrapResponse<UserAllergyResponse[]>(response);
}
