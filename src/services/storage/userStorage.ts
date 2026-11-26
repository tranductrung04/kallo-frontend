import AsyncStorage from '@react-native-async-storage/async-storage';

export const LEGACY_USER_STORAGE_KEYS = [
  '@kallo/nutrition-v1',
  '@kallo/activity-v1',
  '@kallo/meal-plans-v1',
  '@kallo/gamification-prod-v1',
  '@kallo/offline-sync-queue-v1',
] as const;

export const SESSION_ARTIFACT_KEYS = [
  '@kallo/health-profile',
  '@kallo/pending-onboarding',
  '@kallo/onboarding-completed',
  '@kallo/onboarding-draft',
] as const;

/**
 * Builds an AsyncStorage key isolated per user ID so local caches never leak across accounts.
 */
export function getUserScopedStorageKey(baseKey: string, userId?: string | null): string | null {
  const trimmed = userId?.trim();
  return trimmed ? `${baseKey}:${trimmed}` : null;
}

/**
 * Removes session-scoped profile/onboarding artifacts and legacy unscoped caches on logout or account switch.
 */
export async function clearSessionStorageArtifacts(): Promise<void> {
  await AsyncStorage.multiRemove([...SESSION_ARTIFACT_KEYS, ...LEGACY_USER_STORAGE_KEYS]).catch(
    () => undefined
  );
}
