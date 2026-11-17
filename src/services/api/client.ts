import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

const rawBaseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8080/api';
// Trên máy ảo Android: cả `localhost` và `127.0.0.1` đều trỏ vào máy ảo, cần chuyển sang IP gateway máy host là `10.0.2.2`
// Trên các nền tảng khác: ưu tiên dùng `127.0.0.1` thay vì `localhost` để tránh lỗi phân giải IPv6 (::1) trên Windows
const baseURL = Platform.OS === 'android'
  ? rawBaseURL.replace(/localhost|127\.0\.0\.1/g, '10.0.2.2')
  : rawBaseURL.replace('localhost', '127.0.0.1');
export const API_BASE_URL = baseURL;
const REFRESH_PATH = '/auth/refresh';

const AUTH_NO_RETRY_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
];

function shouldSkipAuthRefresh(url?: string): boolean {
  if (!url) return false;
  return AUTH_NO_RETRY_PATHS.some((path) => url.includes(path));
}

export type RefreshResponse = { accessToken: string; refreshToken?: string };
export const api = axios.create({ baseURL, timeout: 15000, headers: { Accept: 'application/json' } });
const refreshClient = axios.create({ baseURL, timeout: 15000, headers: { Accept: 'application/json' } });
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshPromise: Promise<string> | null = null;

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const config = error.config as RetryConfig | undefined;
  if (error.response?.status !== 401 || !config || config._retry || shouldSkipAuthRefresh(config.url)) {
    throw error;
  }
  config._retry = true;
  try {
    refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
    const accessToken = await refreshPromise;
    config.headers = config.headers ?? {};
    config.headers.set('Authorization', `Bearer ${accessToken}`);
    return api(config);
  } catch (refreshError) {
    await clearTokens();
    throw refreshError;
  }
});

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new Error('Missing refresh token');
  const response = await refreshClient.post<any>(REFRESH_PATH, { refreshToken });
  const payload = response.data?.data ?? response.data;
  if (!payload?.accessToken) throw new Error('Refresh response missing access token');
  await setTokens({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken ?? refreshToken,
  });
  return payload.accessToken;
}
