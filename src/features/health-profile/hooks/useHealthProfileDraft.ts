import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/features/auth/AuthProvider';
import {
  saveHealthProfile,
  getApiErrorMessage,
} from '../api';
import type {
  HealthProfileDraft,
  Gender,
  ActivityLevel,
  GoalType,
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
  dependent: 'me',
  gender: 'female',
  age: '',
  height: '',
  weight: '',
  activity: 'moderate',
  goal: 'maintain',
  targetWeight: '',
  weeklyRate: '0',
  allergies: [],
  customAllergy: '',
  macros: defaultMacroPercentages('maintain'),
};

export function useHealthProfileDraft(draftStorageKey = HEALTH_PROFILE_DRAFT_KEY) {
  const { refreshProfileStatus } = useAuth();
  const [draft, setDraft] = useState<HealthProfileDraft>(initialHealthProfileDraft);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    void AsyncStorage.getItem(draftStorageKey)
      .then((value) => {
        if (!value) return;
        try {
          setDraft({ ...initialHealthProfileDraft, ...JSON.parse(value) });
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

  const age = Number(draft.age);
  const height = Number(draft.height);
  const weight = Number(draft.weight);
  const targetWeight = Number(draft.targetWeight || draft.weight);
  const weeklyRate = Number(draft.weeklyRate || 0);

  const result = useMemo(() => {
    if (
      isValidAge(age) &&
      isValidHeight(height) &&
      isValidWeight(weight) &&
      isValidWeight(targetWeight) &&
      isValidWeeklyRate(weeklyRate)
    ) {
      return calculateHealthProfile({
        gender: draft.gender,
        age,
        heightCm: height,
        weightKg: weight,
        activityLevel: draft.activity,
        goalType: draft.goal,
        weeklyRateKg: weeklyRate,
        macroPercentages: draft.macros,
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

  const validateHealthMetrics = (): string | undefined => {
    if (!isValidAge(age)) return 'Tuổi phải từ 13 đến 120.';
    if (!isValidHeight(height)) return 'Chiều cao phải từ 100 đến 250 cm.';
    if (!isValidWeight(weight)) return 'Cân nặng phải từ 20 đến 300 kg.';
    if (!isValidWeight(targetWeight) || !isValidWeeklyRate(weeklyRate)) {
      return 'Cân nặng mục tiêu hoặc tốc độ thay đổi không hợp lệ.';
    }
    return undefined;
  };

  const saveProfile = async (): Promise<boolean> => {
    if (!result) {
      setError('Vui lòng hoàn tất thông tin hồ sơ hợp lệ.');
      return false;
    }
    setSaving(true);
    setError(undefined);
    try {
      await saveHealthProfile({
        gender: draft.gender,
        birthDate: `${new Date().getFullYear() - age}-01-01`,
        heightCm: height,
        weightKg: weight,
        activityLevel: draft.activity,
        goalType: draft.goal,
        targetWeightKg: targetWeight,
        weeklyRateKg: weeklyRate,
        allergies: draft.allergies,
        bmi: result.bmi,
        bmr: result.bmr,
        tdee: result.tdee,
        dailyCalorieGoal: result.dailyCalorieGoal,
        proteinGoalGrams: result.macros.proteinGrams,
        carbsGoalGrams: result.macros.carbsGrams,
        fatGoalGrams: result.macros.fatGrams,
        waterGoalMl: Math.round(weight * 35),
      });
      await AsyncStorage.removeItem(draftStorageKey);
      await refreshProfileStatus();
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
      return false;
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
    validateHealthMetrics,
    saveProfile,
  };
}
