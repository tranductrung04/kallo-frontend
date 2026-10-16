import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = '@kallo/access-token';
const REFRESH_TOKEN_KEY = '@kallo/refresh-token';
export type StoredTokens = { accessToken: string; refreshToken?: string };
export function getAccessToken() { return AsyncStorage.getItem(ACCESS_TOKEN_KEY); }
export function getRefreshToken() { return AsyncStorage.getItem(REFRESH_TOKEN_KEY); }
export async function setTokens(tokens: StoredTokens) {
  const entries: Array<[string, string]> = [[ACCESS_TOKEN_KEY, tokens.accessToken]];
  if (tokens.refreshToken) entries.push([REFRESH_TOKEN_KEY, tokens.refreshToken]);
  await AsyncStorage.multiSet(entries);
}
export function clearTokens() { return AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]); }
