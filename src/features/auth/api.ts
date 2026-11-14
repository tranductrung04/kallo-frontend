import { api } from '@/services/api/client';
import { setTokens, clearTokens } from '@/services/api/tokenStorage';

export type AuthTokens = { accessToken: string; refreshToken?: string };
type AuthPayload = { accessToken?: string; refreshToken?: string; user?: { id: string; email: string; displayName?: string }; needsProfile?: boolean };
type ApiEnvelope<T> = { data?: T; message?: string };
export type AuthResponse = AuthPayload & ApiEnvelope<AuthPayload>;

export function getApiErrorMessage(error: unknown) {
  const response = (error as { response?: { data?: { message?: string } } })?.response;
  return response?.data?.message ?? (error instanceof Error ? error.message : 'Không thể kết nối máy chủ. Vui lòng thử lại.');
}

function unwrapAuthResponse(response: AuthResponse) {
  return response.data ?? response;
}

export async function login(email: string, password: string) {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  const payload = unwrapAuthResponse(response.data);
  if (!payload.accessToken) throw new Error('Login response missing access token');
  await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
  return payload;
}

export async function register(email: string, password: string, displayName: string) {
  const response = await api.post<AuthResponse>('/auth/register', { email, password, displayName });
  const payload = unwrapAuthResponse(response.data);
  if (!payload.accessToken) throw new Error('Register response missing access token');
  await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
  return payload;
}

export async function verifyEmailOtp(email: string, otp: string) {
  const response = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
  const payload = unwrapAuthResponse(response.data);
  if (payload.accessToken) {
    await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
  }
  return payload;
}

export async function resendEmailOtp(email: string) {
  return api.post('/auth/resend-otp', { email });
}

export async function requestPasswordReset(email: string) {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string) {
  await api.post('/auth/reset-password', { token, password });
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await api.post<AuthResponse>('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  const payload = unwrapAuthResponse(response.data);
  if (payload.accessToken) {
    await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
  }
  return payload;
}

export function formatChangePasswordError(error: unknown): string {
  const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  if (msg === 'Current password is invalid') {
    return 'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.';
  }
  if (msg === 'New password must differ from current password') {
    return 'Mật khẩu mới phải khác mật khẩu hiện tại.';
  }
  if (msg === 'Password is not set') {
    return 'Tài khoản này chưa thiết lập mật khẩu (đăng nhập bằng tài khoản xã hội).';
  }
  if (msg === 'Validation failed') {
    return 'Mật khẩu mới không thỏa mãn yêu cầu bảo mật (tối thiểu 8 ký tự, gồm chữ và số).';
  }
  return getApiErrorMessage(error);
}

export async function logout() {
  try { await api.post('/auth/logout'); }
  catch { /* Keep local session cleanup when server is unavailable. */ }
  finally { await clearTokens(); }
}

export type HealthProfile = { heightCm?: number; weightKg?: number };
export type HealthProfileResponse = ApiEnvelope<HealthProfile> & HealthProfile;

export async function getHealthProfile() {
  return api.get<HealthProfileResponse>('/users/me/profile');
}

export async function saveHealthProfile(payload: object) {
  return api.put<HealthProfileResponse>('/users/me/profile', payload);
}
