import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAccessToken } from '@/services/api/tokenStorage';
import {
  APP_DATA_MODE,
  IS_DEMO_MODE,
  LOCAL_ACCOUNT,
  LOCAL_SESSION_KEY,
  type AppDataMode,
} from './localAccount';
import {
  getApiErrorMessage,
  getHealthProfile,
  getMe,
  login,
  loginWithGoogle,
  logout,
  register,
  resendVerification,
  verifyEmail,
  type AuthResponse,
  type HealthProfile,
  type UserProfileResponse,
} from './api';

type AuthStatus = 'loading' | 'signedOut' | 'needsProfile' | 'signedIn';

type AuthContextValue = {
  status: AuthStatus;
  user: UserProfileResponse | null;
  error: string | null;
  dataMode: AppDataMode;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse | void>;
  signInWithGoogle: (idToken: string) => Promise<AuthResponse | void>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResponse | void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
  refreshProfileStatus: () => Promise<void>;
  refreshUser: () => Promise<UserProfileResponse | null>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refreshUser = useCallback(async (): Promise<UserProfileResponse | null> => {
    try {
      // In Demo Mode: always return local mock user without any network requests
      if (IS_DEMO_MODE) {
        const isSessionActive = (await AsyncStorage.getItem(LOCAL_SESSION_KEY)) === 'true';
        if (isSessionActive) {
          const demoUser: UserProfileResponse = {
            id: 'demo-user-id',
            email: LOCAL_ACCOUNT.email,
            displayName: LOCAL_ACCOUNT.displayName,
            emailVerified: true,
            timezone: 'Asia/Ho_Chi_Minh',
            avatarUrl: null,
            role: 'USER',
          };
          if (mountedRef.current) setUser(demoUser);
          return demoUser;
        }
        if (mountedRef.current) setUser(null);
        return null;
      }

      // In Backend Mode: clean up any stale demo key and fetch from real server
      await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
      const token = await getAccessToken();
      if (!token) {
        if (mountedRef.current) setUser(null);
        return null;
      }
      const userProfile = await getMe();
      if (mountedRef.current) setUser(userProfile);
      return userProfile;
    } catch {
      return null;
    }
  }, []);

  const refreshProfileStatus = useCallback(async (): Promise<void> => {
    try {
      // In Demo Mode: immediately update status based on local session flag
      if (IS_DEMO_MODE) {
        const isSessionActive = (await AsyncStorage.getItem(LOCAL_SESSION_KEY)) === 'true';
        if (isSessionActive) {
          await refreshUser();
          if (mountedRef.current) setStatus('signedIn');
        } else {
          if (mountedRef.current) {
            setUser(null);
            setStatus('signedOut');
          }
        }
        return;
      }

      // In Backend Mode: strictly check tokens and backend endpoints
      await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
      const token = await getAccessToken();
      if (!token) {
        if (mountedRef.current) {
          setUser(null);
          setStatus('signedOut');
        }
        return;
      }

      // Fetch user profile info
      await refreshUser();

      // Check health profile completion
      try {
        const response = await getHealthProfile();
        const profile = response.data.data ?? response.data;
        const healthProfile = profile as HealthProfile | null;
        const hasProfile = Boolean(healthProfile?.heightCm && healthProfile?.weightKg);
        if (mountedRef.current) setStatus(hasProfile ? 'signedIn' : 'needsProfile');
      } catch (healthErr: any) {
        const statusCode = healthErr?.response?.status;
        if (statusCode === 404) {
          if (mountedRef.current) setStatus('needsProfile');
        } else if (statusCode === 401) {
          if (mountedRef.current) setStatus('signedOut');
        } else {
          if (mountedRef.current) setStatus('signedIn');
        }
      }
    } catch (requestError: any) {
      if (!mountedRef.current) return;
      setUser(null);
      setStatus('signedOut');
    }
  }, [refreshUser]);

  useEffect(() => {
    mountedRef.current = true;
    void refreshProfileStatus();
    return () => {
      mountedRef.current = false;
    };
  }, [refreshProfileStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);

      // In Demo Mode: immediate login with demo user - zero network calls!
      if (IS_DEMO_MODE) {
        const trimmedEmail = email.trim() || LOCAL_ACCOUNT.email;
        const demoUser: UserProfileResponse = {
          id: 'demo-user-id',
          email: trimmedEmail,
          displayName: trimmedEmail.includes('@') ? trimmedEmail.split('@')[0] : LOCAL_ACCOUNT.displayName,
          emailVerified: true,
          timezone: 'Asia/Ho_Chi_Minh',
          avatarUrl: null,
          role: 'USER',
        };
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, 'true');
        if (mountedRef.current) {
          setUser(demoUser);
          setStatus('signedIn');
        }
        return;
      }

      // In Backend Mode: call real Spring Boot endpoint
      const result = await login(email, password);
      await refreshUser();
      if (!mountedRef.current) return;
      if (result.profileCompleted === false || result.needsProfile === true) {
        setStatus('needsProfile');
      } else {
        await refreshProfileStatus();
      }
      return result;
    } catch (requestError) {
      const errorMsg = getApiErrorMessage(requestError);
      if (mountedRef.current) setError(errorMsg);
      throw requestError;
    }
  }, [refreshProfileStatus, refreshUser]);

  const signInWithGoogle = useCallback(async (idToken: string) => {
    try {
      setError(null);
      if (IS_DEMO_MODE) {
        const demoUser: UserProfileResponse = {
          id: 'demo-google-user',
          email: 'google.demo@kallo.local',
          displayName: 'Google Demo User',
          emailVerified: true,
          timezone: 'Asia/Ho_Chi_Minh',
          avatarUrl: null,
          role: 'USER',
        };
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, 'true');
        if (mountedRef.current) {
          setUser(demoUser);
          setStatus('signedIn');
        }
        return;
      }

      const result = await loginWithGoogle(idToken);
      await refreshUser();
      if (!mountedRef.current) return;
      if (result.profileCompleted === false) {
        setStatus('needsProfile');
      } else {
        await refreshProfileStatus();
      }
      return result;
    } catch (requestError) {
      const errorMsg = getApiErrorMessage(requestError);
      if (mountedRef.current) setError(errorMsg);
      throw requestError;
    }
  }, [refreshProfileStatus, refreshUser]);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      if (IS_DEMO_MODE) {
        return;
      }
      const result = await register(email, password, displayName);
      return result;
    } catch (requestError: any) {
      const errorMsg = getApiErrorMessage(requestError);
      if (mountedRef.current) setError(errorMsg);
      throw requestError;
    }
  }, []);

  const verifyOtp = useCallback(async (_email: string, otp: string) => {
    try {
      setError(null);
      if (IS_DEMO_MODE) {
        await AsyncStorage.setItem(LOCAL_SESSION_KEY, 'true');
        await refreshUser();
        if (mountedRef.current) setStatus('signedIn');
        return;
      }
      await verifyEmail(otp);
      if (!mountedRef.current) return;
      await refreshProfileStatus();
    } catch (requestError) {
      const errorMsg = getApiErrorMessage(requestError);
      if (mountedRef.current) setError(errorMsg);
      throw requestError;
    }
  }, [refreshProfileStatus, refreshUser]);

  const resendOtp = useCallback(async (_email: string) => {
    try {
      setError(null);
      if (IS_DEMO_MODE) {
        return;
      }
      await resendVerification();
    } catch (requestError: any) {
      const errorMsg = getApiErrorMessage(requestError);
      if (mountedRef.current) setError(errorMsg);
      throw requestError;
    }
  }, []);

  const loginAsDemo = useCallback(async () => {
    const demoUser: UserProfileResponse = {
      id: 'demo-user-id',
      email: LOCAL_ACCOUNT.email,
      displayName: LOCAL_ACCOUNT.displayName,
      emailVerified: true,
      timezone: 'Asia/Ho_Chi_Minh',
      avatarUrl: null,
      role: 'USER',
    };
    await AsyncStorage.setItem(LOCAL_SESSION_KEY, 'true');
    if (mountedRef.current) {
      setUser(demoUser);
      setStatus('signedIn');
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(LOCAL_SESSION_KEY);
    if (!IS_DEMO_MODE) {
      await logout();
    }
    if (mountedRef.current) {
      setUser(null);
      setError(null);
      setStatus('signedOut');
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      error,
      dataMode: APP_DATA_MODE,
      isDemoMode: IS_DEMO_MODE,
      clearError,
      signIn,
      signInWithGoogle,
      signUp,
      verifyOtp,
      resendOtp,
      signOut,
      loginAsDemo,
      refreshProfileStatus,
      refreshUser,
    }),
    [status, user, error, clearError, signIn, signInWithGoogle, signUp, verifyOtp, resendOtp, signOut, loginAsDemo, refreshProfileStatus, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
