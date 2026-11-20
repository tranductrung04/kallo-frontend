import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'kallo-access-token';
const REFRESH_TOKEN_KEY = 'kallo-refresh-token';
const LEGACY_ACCESS_TOKEN_KEY = '@kallo/access-token';
const LEGACY_REFRESH_TOKEN_KEY = '@kallo/refresh-token';
export type StoredTokens = { accessToken: string; refreshToken?: string };

const isWeb = Platform.OS === 'web';

async function getToken(key: string, legacyKey: string): Promise<string | null> {
  if (isWeb) {
    return AsyncStorage.getItem(key);
  }
  const secureToken = await SecureStore.getItemAsync(key);
  if (secureToken) return secureToken;
  const legacyToken = await AsyncStorage.getItem(legacyKey);
  if (legacyToken) {
    await SecureStore.setItemAsync(key, legacyToken);
    await AsyncStorage.removeItem(legacyKey);
  }
  return legacyToken;
}

export function getAccessToken() { return getToken(ACCESS_TOKEN_KEY, LEGACY_ACCESS_TOKEN_KEY); }
export function getRefreshToken() { return getToken(REFRESH_TOKEN_KEY, LEGACY_REFRESH_TOKEN_KEY); }
export async function setTokens(tokens: StoredTokens) {
  if (isWeb) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    if (tokens.refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    return;
  }
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  await AsyncStorage.multiRemove([LEGACY_ACCESS_TOKEN_KEY, LEGACY_REFRESH_TOKEN_KEY]);
}
export async function clearTokens() {
  if (isWeb) {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    return;
  }
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    AsyncStorage.multiRemove([LEGACY_ACCESS_TOKEN_KEY, LEGACY_REFRESH_TOKEN_KEY]),
  ]);
}
