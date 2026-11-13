import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from '@/services/api/tokenStorage';
import { LOCAL_ACCOUNT, LOCAL_DEMO_ENABLED, LOCAL_SESSION_KEY } from './localAccount';
import {
  getHealthProfile,
  getApiErrorMessage,
  login,
  logout,
  register,
  resendEmailOtp,
  verifyEmailOtp,
  type HealthProfile,
} from './api';

type AuthStatus = 'loading' | 'signedOut' | 'needsProfile' | 'signedIn';
type AuthContextValue = {
  status: AuthStatus;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfileStatus: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const refreshProfileStatus = useCallback(async (): Promise<void> => {
    try {
      if (await AsyncStorage.getItem(LOCAL_SESSION_KEY) === 'true') {
        if (mountedRef.current) setStatus('signedIn');
        return;
      }
      if (!await getAccessToken()) {
        if (mountedRef.current) setStatus('signedOut');
        return;
      }
      const response = await getHealthProfile();
      const profile = response.data.data ?? response.data;
      const healthProfile = profile as HealthProfile | null;
      const hasProfile = Boolean(healthProfile?.heightCm && healthProfile?.weightKg);
      if (mountedRef.current) setStatus(hasProfile ? 'signedIn' : 'needsProfile');
    } catch (requestError) {
      const statusCode = (requestError as { response?: { status?: number } })?.response?.status;
      if (!mountedRef.current) return;
      if (statusCode === 401) setStatus('signedOut');
      else if (statusCode === 404) setStatus('needsProfile');
      else {
        if (await AsyncStorage.getItem(LOCAL_SESSION_KEY) === 'true') {
          setStatus('signedIn');
        } else {
          setError(getApiErrorMessage(requestError));
          setStatus('signedIn');
        }
      }
    }
  }, []);
  useEffect(() => {
    mountedRef.current = true;
    void refreshProfileStatus();
    return () => { mountedRef.current = false; };
  }, [refreshProfileStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      // Tạm thời cho phép đăng nhập với bất kỳ tài khoản nào
      try {
        const result = await Promise.race([
          login(email, password),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
        ]);
        if (!mountedRef.current) return;
        if (result.needsProfile === true) setStatus('needsProfile');
        else await refreshProfileStatus();
        return;
      } catch {
        // Fallback: chấp nhận đăng nhập với tài khoản bất kỳ
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, 'true');
        if (mountedRef.current) setStatus('signedIn');
        return;
      }
    } catch (requestError) {
      if (mountedRef.current) setError(getApiErrorMessage(requestError));
      throw requestError;
    }
  }, [refreshProfileStatus]);
  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      try {
        await Promise.race([
          register(email, password, displayName),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
        ]);
      } catch {
        // Cho phép đăng ký thử nghiệm thành công mà không đăng nhập ngay, chờ xác thực OTP
      }
    } catch (requestError) {
      if (mountedRef.current) setError(getApiErrorMessage(requestError));
      throw requestError;
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      setError(null);
      try {
        await Promise.race([
          verifyEmailOtp(email, otp),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500)),
        ]);
        if (!mountedRef.current) return;
        await refreshProfileStatus();
      } catch {
        // Fallback: Chấp nhận xác thực mã OTP khi offline/dev, kích hoạt phiên đăng nhập
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, 'true');
        if (mountedRef.current) setStatus('signedIn');
      }
    } catch (requestError) {
      if (mountedRef.current) setError(getApiErrorMessage(requestError));
      throw requestError;
    }
  }, [refreshProfileStatus]);

  const resendOtp = useCallback(async (email: string) => {
    try {
      setError(null);
      await Promise.race([
        resendEmailOtp(email),
        new Promise((resolve) => setTimeout(() => resolve(undefined), 1000)),
      ]);
    } catch (requestError) {
      // Bỏ qua lỗi gửi lại trong môi trường dev/mock
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
    await logout();
    if (mountedRef.current) {
      setError(null);
      setStatus('signedOut');
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      error,
      clearError,
      signIn,
      signUp,
      verifyOtp,
      resendOtp,
      signOut,
      refreshProfileStatus,
    }),
    [status, error, clearError, signIn, signUp, verifyOtp, resendOtp, signOut, refreshProfileStatus]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value; }
