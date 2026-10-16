import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';
const REFRESH_PATH = '/auth/refresh';

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
  if (error.response?.status !== 401 || !config || config._retry || config.url?.includes(REFRESH_PATH)) throw error;
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
  const response = await refreshClient.post<RefreshResponse>(REFRESH_PATH, { refreshToken });
  if (!response.data.accessToken) throw new Error('Refresh response missing access token');
  await setTokens(response.data);
  return response.data.accessToken;
}
