import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/features/auth/AuthProvider';
import { LOCAL_DEMO_ENABLED } from '@/features/auth/localAccount';
import {
  saveHealthProfile,
  getApiErrorMessage,
} from '../api';
import type {
  HealthProfileCalculationResult,
  HealthProfileDraft,
  MacroName,
} from '../types';
import {
  calculateHealthProfile,
  defaultMacroPercentages,
  isValidAge,
  isValidHeight,
  isValidWeight,
  isValidWeeklyRate,
  updateMacroPercentage,
} from '../utils/calculations';

export const HEALTH_PROFILE_DRAFT_KEY = '@kallo/onboarding-draft';

export const initialHealthProfileDraft: HealthProfileDraft = {
  nickname: '',
  dependent: 'me',
  gender: 'female',
  age: '25',
  height: '160',
  weight: '53',
  activity: 'moderate',
  goal: 'maintain',
  targetWeight: '53',
  weeklyRate: '0',
  allergies: [],
  customAllergy: '',
  dietaryPreference: 'standard',
  healthConditions: [],
  macros: defaultMacroPercentages('maintain'),
};

export function useHealthProfileDraft(draftStorageKey = HEALTH_PROFILE_DRAFT_KEY) {
  const { completeOnboarding, refreshProfileStatus } = useAuth();
  const [draft, setDraft] = useState<HealthProfileDraft>(initialHealthProfileDraft);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    void AsyncStorage.getItem(draftStorageKey)
      .then((value) => {
        if (!value) return;
        try {
          const parsed = JSON.parse(value);
          setDraft({
            ...initialHealthProfileDraft,
            ...parsed,
            age: parsed.age && isValidAge(Number(parsed.age)) ? String(parsed.age) : '25',
            height:
              parsed.height && isValidHeight(Number(parsed.height))
                ? String(parsed.height)
                : initialHealthProfileDraft.height,
            weight:
              parsed.weight && isValidWeight(Number(parsed.weight))
                ? String(parsed.weight)
                : initialHealthProfileDraft.weight,
          });
        } catch {
          setDraft(initialHealthProfileDraft);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, [draftStorageKey]);

  useEffect(() => {
    if (loaded) {
      void AsyncStorage.setItem(draftStorageKey, JSON.stringify(draft)).catch(() => undefined);
    }
  }, [draft, loaded, draftStorageKey]);

  const parsedAge = parseInt(draft.age, 10);
  const age = !isNaN(parsedAge) && isValidAge(parsedAge) ? parsedAge : 25;

  const parsedHeight = parseFloat(draft.height);
  const height = !isNaN(parsedHeight) && isValidHeight(parsedHeight) ? parsedHeight : 160;

  const parsedWeight = parseFloat(draft.weight);
  const weight = !isNaN(parsedWeight) && isValidWeight(parsedWeight) ? parsedWeight : 53;

  const parsedTargetWeight = parseFloat(draft.targetWeight);
  const targetWeight =
    !isNaN(parsedTargetWeight) && isValidWeight(parsedTargetWeight) ? parsedTargetWeight : weight;

  const parsedWeeklyRate = parseFloat(draft.weeklyRate);
  const weeklyRate =
    !isNaN(parsedWeeklyRate) && isValidWeeklyRate(parsedWeeklyRate)
      ? parsedWeeklyRate
      : draft.goal === 'maintain'
      ? 0
      : 0.5;

  const result = useMemo(() => {
    if (
      isValidAge(age) &&
      isValidHeight(height) &&
      isValidWeight(weight) &&
      isValidWeight(targetWeight) &&
      isValidWeeklyRate(weeklyRate)
    ) {
      return calculateHealthProfile({
        gender: draft.gender || 'female',
        age,
        heightCm: height,
        weightKg: weight,
        activityLevel: draft.activity || 'moderate',
        goalType: draft.goal || 'maintain',
        weeklyRateKg: weeklyRate,
        macroPercentages: draft.macros || defaultMacroPercentages(draft.goal || 'maintain'),
      });
    }
    return undefined;
  }, [
    age,
    height,
    weight,
    targetWeight,
    weeklyRate,
    draft.gender,
    draft.activity,
    draft.goal,
    draft.macros,
  ]);

  const updateDraft = <K extends keyof HealthProfileDraft>(key: K, value: HealthProfileDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateMacro = (name: MacroName, value: number) => {
    setDraft((current) => ({
      ...current,
      macros: updateMacroPercentage(current.macros, name, value),
    }));
  };

  const toggleAllergy = (allergy: string) => {
    setDraft((current) => ({
      ...current,
      allergies: current.allergies.includes(allergy)
        ? current.allergies.filter((item) => item !== allergy)
        : [...current.allergies, allergy],
    }));
  };

  const addCustomAllergy = () => {
    const trimmed = draft.customAllergy.trim();
    if (trimmed && !draft.allergies.includes(trimmed)) {
      setDraft((current) => ({
        ...current,
        allergies: [...current.allergies, trimmed],
        customAllergy: '',
      }));
    }
  };

  const toggleHealthCondition = (conditionKey: string) => {
    setDraft((current) => {
      const existing = current.healthConditions || [];
      if (conditionKey === 'none') {
        return { ...current, healthConditions: existing.includes('none') ? [] : ['none'] };
      }
      const filtered = existing.filter((item) => item !== 'none');
      return {
        ...current,
        healthConditions: filtered.includes(conditionKey)
          ? filtered.filter((item) => item !== conditionKey)
          : [...filtered, conditionKey],
      };
    });
  };

  const setDietaryPreference = (pref: string) => {
    setDraft((current) => ({ ...current, dietaryPreference: pref }));
  };

  const validateHealthMetrics = (): string | undefined => {
    if (!isValidAge(age)) return 'Tuổi phải từ 13 đến 120.';
    if (!isValidHeight(height)) return 'Chiều cao phải từ 100 đến 250 cm.';
    if (!isValidWeight(weight)) return 'Cân nặng phải từ 20 đến 300 kg.';
    if (!isValidWeight(targetWeight) || !isValidWeeklyRate(weeklyRate)) {
      return 'Cân nặng mục tiêu hoặc tốc độ thay đổi không hợp lệ.';
    }
    return undefined;
  };

  const saveProfile = async (
    overrideResult?: HealthProfileCalculationResult
  ): Promise<{ ok: boolean; error?: string }> => {
    const finalResult = overrideResult || result;
    if (!finalResult) {
      const msg = 'Vui lòng hoàn tất thông tin hồ sơ hợp lệ.';
      setError(msg);
      return { ok: false, error: msg };
    }
    setSaving(true);
    setError(undefined);
    try {
      const profilePayload = {
        nickname: draft.nickname?.trim() || undefined,
        gender: draft.gender || 'female',
        birthDate: `${new Date().getFullYear() - age}-01-01`,
        heightCm: height,
        weightKg: weight,
        activityLevel: draft.activity || 'moderate',
        goalType: draft.goal || 'maintain',
        targetWeightKg: targetWeight,
        weeklyRateKg: weeklyRate,
        allergies: draft.allergies || [],
        dietaryPreference: draft.dietaryPreference || 'standard',
        healthConditions: draft.healthConditions || [],
        bmi: finalResult.bmi,
        bmr: finalResult.bmr,
        tdee: finalResult.tdee,
        dailyCalorieGoal: finalResult.dailyCalorieGoal,
        proteinGoalGrams: finalResult.macros.proteinGrams,
        carbsGoalGrams: finalResult.macros.carbsGrams,
        fatGoalGrams: finalResult.macros.fatGrams,
        waterGoalMl: Math.round(weight * 35),
      };

      // Always persist the completed health profile locally
      await AsyncStorage.setItem('@kallo/health-profile', JSON.stringify(profilePayload));

      try {
        await saveHealthProfile(profilePayload);
      } catch (saveError: any) {
        // Backend /users/me/profile endpoint may not be implemented on server yet; local profile is already saved
        console.warn('[saveProfile] Server sync fallback to local profile:', saveError?.message ?? saveError);
      }
      await AsyncStorage.removeItem(draftStorageKey);
      if (completeOnboarding) {
        await completeOnboarding();
      } else {
        await refreshProfileStatus();
      }
      return { ok: true };
    } catch (requestError) {
      const msg = getApiErrorMessage(requestError);
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    draft,
    setDraft,
    loaded,
    saving,
    error,
    setError,
    age,
    height,
    weight,
    targetWeight,
    weeklyRate,
    result,
    updateDraft,
    updateMacro,
    toggleAllergy,
    addCustomAllergy,
    toggleHealthCondition,
    setDietaryPreference,
    validateHealthMetrics,
    saveProfile,
  };
}
