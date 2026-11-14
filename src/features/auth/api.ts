import { api } from '@/services/api/client';
import { setTokens, clearTokens, getRefreshToken } from '@/services/api/tokenStorage';

export type AuthTokens = { accessToken: string; refreshToken?: string };

export type ApiError = {
  code?: string;
  message?: string;
  details?: unknown;
};

export type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
};

export type UserSummary = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  emailVerified: boolean;
};

export type AuthResponse = {
  accessToken?: string;
  refreshToken?: string | null;
  tokenType?: string;
  expiresIn?: number;
  user?: UserSummary;
  profileCompleted?: boolean;
  isNewUser?: boolean;
  needsProfile?: boolean; // backwards compatibility
};

export type UserProfileResponse = {
  id: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  timezone: string;
  avatarUrl: string | null;
  role: string;
};

export type AvatarResponse = {
  avatarUrl: string;
};

export function getApiErrorCode(error: unknown): string | undefined {
  const data = (error as { response?: { data?: { error?: { code?: string }; code?: string } } })?.response?.data;
  return data?.error?.code ?? data?.code;
}

export function getApiErrorMessage(error: unknown): string {
  const resData = (error as { response?: { data?: { error?: { code?: string; message?: string }; message?: string } } })?.response?.data;
  const code = resData?.error?.code;
  const serverMsg = resData?.error?.message ?? resData?.message;

  if (code) {
    switch (code) {
      case 'INVALID_CREDENTIALS':
        return 'Email hoặc mật khẩu không chính xác.';
      case 'EMAIL_ALREADY_EXISTS':
        return 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc chọn email khác.';
      case 'ACCOUNT_DISABLED':
        return 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.';
      case 'REFRESH_TOKEN_INVALID':
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      case 'INVALID_CURRENT_PASSWORD':
        return 'Mật khẩu hiện tại không chính xác. Vui lòng kiểm tra lại.';
      case 'PASSWORD_UNCHANGED':
        return 'Mật khẩu mới phải khác với mật khẩu hiện tại.';
      case 'PASSWORD_NOT_SET':
        return 'Tài khoản chưa thiết lập mật khẩu (đăng nhập qua Google).';
      case 'GOOGLE_TOKEN_INVALID':
        return 'Xác thực tài khoản Google không hợp lệ hoặc đã hết hạn.';
      case 'GOOGLE_ACCOUNT_CONFLICT':
        return 'Email này đã liên kết với một tài khoản Google khác.';
      case 'GOOGLE_PROVIDER_UNAVAILABLE':
        return 'Dịch vụ xác thực Google tạm thời không khả dụng. Vui lòng thử lại sau.';
      case 'VERIFICATION_CODE_INVALID':
        return 'Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.';
      case 'RESET_CODE_INVALID':
        return 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.';
      case 'EMAIL_ALREADY_VERIFIED':
        return 'Email này đã được xác thực trước đó.';
      case 'TOO_MANY_REQUESTS':
        return 'Bạn đã gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau ít phút.';
      case 'EMAIL_NOT_VERIFIED':
        return 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư.';
      case 'UNAUTHORIZED':
        return 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.';
      case 'FORBIDDEN':
        return 'Bạn không có quyền thực hiện thao tác này.';
      case 'INVALID_FILE':
        return 'File ảnh không hợp lệ (chỉ chấp nhận định dạng JPEG hoặc PNG).';
      case 'PAYLOAD_TOO_LARGE':
        return 'Kích thước ảnh vượt quá giới hạn tối đa (2MB).';
      case 'INVALID_DELETE_CONFIRMATION':
        return 'Mật khẩu xác nhận xóa tài khoản không chính xác.';
      case 'VALIDATION_ERROR':
        return 'Dữ liệu nhập vào không hợp lệ. Vui lòng kiểm tra lại.';
    }
  }

  if (serverMsg) return serverMsg;
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.';
    }
    return error.message;
  }
  return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.';
}

export function formatChangePasswordError(error: unknown): string {
  return getApiErrorMessage(error);
}

function unwrapResponse<T>(response: { data: any }): T {
  if (response.data && typeof response.data === 'object') {
    if ('data' in response.data && response.data.data !== undefined && response.data.data !== null) {
      return response.data.data;
    }
    return response.data;
  }
  return response.data;
}

// ── Auth Endpoints (/api/auth) ────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
  const payload = unwrapResponse<AuthResponse>(response);
  if (!payload.accessToken) throw new Error('Login response missing access token');
  await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken ?? undefined });
  return payload;
}

export async function register(email: string, password: string, displayName: string): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', { email, password, displayName });
  const payload = unwrapResponse<AuthResponse>(response);
  if (payload.accessToken) {
    await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken ?? undefined });
  }
  return payload;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/google', { idToken });
  const payload = unwrapResponse<AuthResponse>(response);
  if (!payload.accessToken) throw new Error('Google login response missing access token');
  await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken ?? undefined });
  return payload;
}

export async function verifyEmail(code: string): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/verify-email', { code });
  const payload = unwrapResponse<AuthResponse>(response);
  if (payload.accessToken) {
    await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken ?? undefined });
  }
  return payload;
}

export async function resendVerification(): Promise<void> {
  await api.post('/auth/resend-verification');
}

// Compatibility alias for verifyEmailOtp & resendEmailOtp
export async function verifyEmailOtp(_email: string, otp: string): Promise<AuthResponse> {
  return verifyEmail(otp);
}

export async function resendEmailOtp(_email?: string): Promise<void> {
  return resendVerification();
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(emailOrToken: string, passwordOrCode: string, maybePassword?: string): Promise<void> {
  // Support both new (email, code, newPassword) and old (token, password) signatures
  if (maybePassword !== undefined) {
    await api.post('/auth/reset-password', {
      email: emailOrToken,
      code: passwordOrCode,
      newPassword: maybePassword,
    });
  } else {
    // Old fallback
    await api.post('/auth/reset-password', { token: emailOrToken, password: passwordOrCode });
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  const payload = unwrapResponse<AuthResponse>(response);
  if (payload.accessToken) {
    await setTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken ?? undefined });
  }
  return payload;
}

export async function logout(allDevices = false): Promise<void> {
  try {
    const refreshToken = await getRefreshToken();
    await api.post('/auth/logout', {
      refreshToken: refreshToken ?? undefined,
      allDevices,
    });
  } catch {
    /* Keep local session cleanup even when server is unreachable. */
  } finally {
    await clearTokens();
  }
}

// ── User Endpoints (/api/users/me) ────────────────────────────────────────────

export async function getMe(): Promise<UserProfileResponse> {
  const response = await api.get<ApiResponse<UserProfileResponse>>('/users/me');
  return unwrapResponse<UserProfileResponse>(response);
}

export async function updateMe(displayName: string, timezone: string): Promise<UserProfileResponse> {
  const response = await api.put<ApiResponse<UserProfileResponse>>('/users/me', {
    displayName,
    timezone,
  });
  return unwrapResponse<UserProfileResponse>(response);
}

export async function updateAvatar(fileUri: string, mimeType = 'image/jpeg'): Promise<AvatarResponse> {
  const filename = fileUri.split('/').pop() || 'avatar.jpg';
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: filename,
    type: mimeType,
  } as any);

  const response = await api.post<ApiResponse<AvatarResponse>>('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return unwrapResponse<AvatarResponse>(response);
}

export async function deleteAccount(password?: string, idToken?: string): Promise<void> {
  await api.delete('/users/me', {
    data: {
      password: password || undefined,
      idToken: idToken || undefined,
    },
  });
  await clearTokens();
}

// ── Health Profile Endpoints (Profile Wizard) ──────────────────────────────────

export type HealthProfile = { heightCm?: number; weightKg?: number };
type ApiEnvelope<T> = { data?: T; message?: string };
export type HealthProfileResponse = ApiEnvelope<HealthProfile> & HealthProfile;

export async function getHealthProfile() {
  return api.get<HealthProfileResponse>('/users/me/profile');
}

export async function saveHealthProfile(payload: object) {
  return api.put<HealthProfileResponse>('/users/me/profile', payload);
}
