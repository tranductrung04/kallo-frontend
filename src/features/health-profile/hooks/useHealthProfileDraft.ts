import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/features/auth/AuthProvider";
import { IS_DEMO_MODE } from "@/features/auth/localAccount";
import {
  saveHealthProfile,
  updateUserChronicConditions,
  updateUserAllergies,
  getApiErrorMessage,
} from "../api";
import {
  toBackendGender,
  toBackendActivityLevel,
  toBackendGoalType,
  fromBackendGender,
  fromBackendActivityLevel,
  fromBackendGoalType,
  STANDARD_ALLERGENS,
  type HealthProfileCalculationResult,
  type HealthProfileDraft,
  type HealthProfileRequestPayload,
  type HealthProfileResponse,
  type MacroName,
} from "../types";
import {
  calculateHealthProfile,
  defaultMacroPercentages,
  isValidAge,
  isValidHeight,
  isValidWeight,
  isValidWeeklyRate,
  updateMacroPercentage,
} from "../utils/calculations";

export const HEALTH_PROFILE_DRAFT_KEY = "@kallo/onboarding-draft";

export const initialHealthProfileDraft: HealthProfileDraft = {
  nickname: "",
  dependent: "me",
  gender: "female",
  age: "25",
  height: "160",
  weight: "53",
  activity: "moderate",
  goal: "maintain",
  targetWeight: "53",
  weeklyRate: "0",
  allergies: [],
  customAllergy: "",
  dietaryPreference: "standard",
  healthConditions: [],
  macros: defaultMacroPercentages("maintain"),
};

export function useHealthProfileDraft(
  draftStorageKey = HEALTH_PROFILE_DRAFT_KEY,
) {
  const { completeOnboarding, refreshProfileStatus } = useAuth();
  const [draft, setDraft] = useState<HealthProfileDraft>(
    initialHealthProfileDraft,
  );
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
            age:
              parsed.age && isValidAge(Number(parsed.age))
                ? String(parsed.age)
                : "25",
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
      void AsyncStorage.setItem(draftStorageKey, JSON.stringify(draft)).catch(
        () => undefined,
      );
    }
  }, [draft, loaded, draftStorageKey]);

  const parsedAge = parseInt(draft.age, 10);
  const age = !isNaN(parsedAge) && isValidAge(parsedAge) ? parsedAge : 25;

  const parsedHeight = parseFloat(draft.height);
  const height =
    !isNaN(parsedHeight) && isValidHeight(parsedHeight) ? parsedHeight : 160;

  const parsedWeight = parseFloat(draft.weight);
  const weight =
    !isNaN(parsedWeight) && isValidWeight(parsedWeight) ? parsedWeight : 53;

  const parsedTargetWeight = parseFloat(draft.targetWeight);
  const targetWeight =
    !isNaN(parsedTargetWeight) && isValidWeight(parsedTargetWeight)
      ? parsedTargetWeight
      : weight;

  const parsedWeeklyRate = parseFloat(draft.weeklyRate);
  const weeklyRate =
    !isNaN(parsedWeeklyRate) && isValidWeeklyRate(parsedWeeklyRate)
      ? parsedWeeklyRate
      : draft.goal === "maintain"
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
        gender: draft.gender || "female",
        age,
        heightCm: height,
        weightKg: weight,
        activityLevel: draft.activity || "moderate",
        goalType: draft.goal || "maintain",
        weeklyRateKg: weeklyRate,
        macroPercentages:
          draft.macros || defaultMacroPercentages(draft.goal || "maintain"),
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

  const updateDraft = <K extends keyof HealthProfileDraft>(
    key: K,
    value: HealthProfileDraft[K],
  ) => {
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
        customAllergy: "",
      }));
    }
  };

  const toggleHealthCondition = (conditionKey: string) => {
    setDraft((current) => {
      const existing = current.healthConditions || [];
      if (conditionKey === "none") {
        return {
          ...current,
          healthConditions: existing.includes("none") ? [] : ["none"],
        };
      }
      const filtered = existing.filter((item) => item !== "none");
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
    if (!isValidAge(age)) return "Tuổi phải từ 13 đến 120.";
    if (!isValidHeight(height)) return "Chiều cao phải từ 100 đến 250 cm.";
    if (!isValidWeight(weight)) return "Cân nặng phải từ 20 đến 300 kg.";
    if (!isValidWeight(targetWeight) || !isValidWeeklyRate(weeklyRate)) {
      return "Cân nặng mục tiêu hoặc tốc độ thay đổi không hợp lệ.";
    }
    return undefined;
  };

  const populateFromProfile = (profile: HealthProfileResponse) => {
    setDraft((current) => ({
      ...current,
      gender: fromBackendGender(profile.gender),
      age: String(
        profile.age ||
          (profile.birthDate
            ? new Date().getFullYear() -
              parseInt(profile.birthDate.split("-")[0], 10)
            : 25),
      ),
      height: String(profile.heightCm),
      weight: String(profile.weightKg),
      targetWeight: String(profile.targetWeightKg),
      weeklyRate: String(profile.weeklyRateKg),
      activity: fromBackendActivityLevel(profile.activityLevel),
      goal: fromBackendGoalType(profile.goalType),
      allergies: profile.allergies || [],
      macros: {
        protein: profile.proteinPct || 20,
        carbs: profile.carbsPct || 50,
        fat: profile.fatPct || 30,
      },
    }));
  };

  const saveProfile = async (
    overrideResult?: HealthProfileCalculationResult,
  ): Promise<{ ok: boolean; error?: string }> => {
    const finalResult = overrideResult || result;
    if (!finalResult) {
      const msg = "Vui lòng hoàn tất thông tin hồ sơ hợp lệ.";
      setError(msg);
      return { ok: false, error: msg };
    }
    setSaving(true);
    setError(undefined);
    try {
      // 1. Prepare backend payload with UPPERCASE enums matching Spring Boot DTO & DB constraint
      const computedDob = `${new Date().getFullYear() - age}-01-01`;
      const isMaintain = (draft.goal || "maintain") === "maintain";

      const backendPayload: HealthProfileRequestPayload = {
        gender: toBackendGender(draft.gender || "female"),
        dob: computedDob,
        birthDate: computedDob,
        heightCm: height,
        weightKg: weight,
        activityLevel: toBackendActivityLevel(draft.activity || "moderate"),
        goalType: toBackendGoalType(draft.goal || "maintain"),
        targetWeightKg: isMaintain ? null : targetWeight,
        weeklyRateKg: isMaintain ? 0.0 : weeklyRate,
      };

      // 2. Prepare local cache fallback
      const localProfile = {
        nickname: draft.nickname?.trim() || undefined,
        gender: draft.gender || "female",
        dob: computedDob,
        birthDate: computedDob,
        heightCm: height,
        weightKg: weight,
        activityLevel: draft.activity || "moderate",
        goalType: draft.goal || "maintain",
        targetWeightKg: isMaintain ? null : targetWeight,
        weeklyRateKg: isMaintain ? 0.0 : weeklyRate,
        allergies: draft.allergies || [],
        dietaryPreference: draft.dietaryPreference || "standard",
        healthConditions: draft.healthConditions || [],
        chronicConditionIds: draft.chronicConditionIds || [],
        allergyIngredientIds: draft.allergyIngredientIds || [],
        bmi: finalResult.bmi,
        bmr: finalResult.bmr,
        tdee: finalResult.tdee,
        dailyCalorieGoal: finalResult.dailyCalorieGoal,
        proteinGoalGrams: finalResult.macros.proteinGrams,
        carbsGoalGrams: finalResult.macros.carbsGrams,
        fatGoalGrams: finalResult.macros.fatGrams,
        waterGoalMl: Math.round(weight * 35),
      };

      if (IS_DEMO_MODE) {
        await AsyncStorage.setItem(
          "@kallo/health-profile",
          JSON.stringify(localProfile),
        );
        await AsyncStorage.removeItem(draftStorageKey);
        if (completeOnboarding) {
          await completeOnboarding();
        } else {
          await refreshProfileStatus();
        }
        return { ok: true };
      }

      // 3. Real backend request - errors will be caught and reported
      const serverProfile = await saveHealthProfile(backendPayload);

      // 4. Sync Chronic Conditions to Backend (nếu có lựa chọn ID)
      try {
        if (draft.chronicConditionIds && draft.chronicConditionIds.length > 0) {
          await updateUserChronicConditions({
            conditions: draft.chronicConditionIds.map((id) => ({
              conditionId: id,
            })),
          });
        }
      } catch (condErr) {
        console.warn("Không thể đồng bộ bệnh mạn tính:", condErr);
      }

      // 5. Sync Allergies to Backend (nếu có lựa chọn ID hoặc tag tiêu chuẩn)
      try {
        const allergyIds: string[] = [];
        if (draft.allergyIngredientIds?.length) {
          allergyIds.push(...draft.allergyIngredientIds);
        } else if (draft.allergies?.length) {
          draft.allergies.forEach((name) => {
            const found = STANDARD_ALLERGENS.find(
              (item) =>
                item.nameVi.toLowerCase().includes(name.toLowerCase()) ||
                item.name.toLowerCase().includes(name.toLowerCase()),
            );
            if (found && !allergyIds.includes(found.id)) {
              allergyIds.push(found.id);
            }
          });
        }

        if (allergyIds.length > 0) {
          await updateUserAllergies({
            allergies: allergyIds.map((id) => ({ ingredientId: id })),
          });
        }
      } catch (allergyErr) {
        console.warn("Không thể đồng bộ dị ứng:", allergyErr);
      }

      // Persist both server response and local attributes
      await AsyncStorage.setItem(
        "@kallo/health-profile",
        JSON.stringify({
          ...localProfile,
          ...serverProfile,
        }),
      );

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
    populateFromProfile,
    saveProfile,
  };
}
