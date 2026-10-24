import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppButton, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import {
  BasicInfoStep,
  BodyMeasureStep,
  ActivityGoalStep,
  TargetWeightStep,
  AllergiesStep,
  HealthSummaryStep,
} from '../components';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import {
  defaultMacroPercentages,
  isValidAge,
  isValidHeight,
  isValidWeight,
  isValidWeeklyRate,
} from '../utils/calculations';
import type { ActivityLevel, GoalType } from '../types';

interface HealthProfileSetupScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function HealthProfileSetupScreen({
  onSuccess,
  onCancel,
}: HealthProfileSetupScreenProps) {
  const theme = useTheme();
  const [step, setStep] = useState(0);

  const {
    draft,
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
    saveProfile,
  } = useHealthProfileDraft();

  const totalSteps = 6;

  const validateStep = () => {
    if (step === 0 && !isValidAge(age)) return 'Tuổi phải từ 13 đến 120.';
    if (step === 1 && !isValidHeight(height)) return 'Chiều cao phải từ 100 đến 250 cm.';
    if (step === 1 && !isValidWeight(weight)) return 'Cân nặng phải từ 20 đến 300 kg.';
    if (step === 3 && (!isValidWeight(targetWeight) || !isValidWeeklyRate(weeklyRate))) {
      return 'Cân nặng mục tiêu hoặc tốc độ thay đổi không hợp lệ.';
    }
    return undefined;
  };

  const next = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(undefined);
    setStep((current) => Math.min(totalSteps - 1, current + 1));
  };

  const back = () => {
    setError(undefined);
    if (step > 0) {
      setStep((current) => current - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSave = async () => {
    const ok = await saveProfile();
    if (ok && onSuccess) {
      onSuccess();
    }
  };

  if (!loaded) {
    return <View style={[styles.safe, { backgroundColor: theme.colors.background }]} />;
  }

  return (
    <ScrollView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <ProgressBar value={(step + 1) / totalSteps} />
      <AppText variant="caption" color={theme.colors.textMuted}>
        Bước {step + 1}/{totalSteps}
      </AppText>

      {step === 0 && (
        <BasicInfoStep
          gender={draft.gender}
          age={draft.age}
          onGenderChange={(val) => updateDraft('gender', val)}
          onAgeChange={(val) => updateDraft('age', val)}
        />
      )}

      {step === 1 && (
        <BodyMeasureStep
          height={draft.height}
          weight={draft.weight}
          onHeightChange={(val) => updateDraft('height', val)}
          onWeightChange={(val) => updateDraft('weight', val)}
        />
      )}

      {step === 2 && (
        <ActivityGoalStep
          activity={draft.activity}
          goal={draft.goal}
          onActivityChange={(val) => updateDraft('activity', val as ActivityLevel)}
          onGoalChange={(val) => {
            const goal = val as GoalType;
            updateDraft('goal', goal);
            updateDraft('macros', defaultMacroPercentages(goal));
          }}
        />
      )}

      {step === 3 && (
        <TargetWeightStep
          goal={draft.goal}
          targetWeight={draft.targetWeight}
          weeklyRate={draft.weeklyRate}
          onTargetWeightChange={(val) => updateDraft('targetWeight', val)}
          onWeeklyRateChange={(val) => updateDraft('weeklyRate', val)}
        />
      )}

      {step === 4 && (
        <AllergiesStep
          allergies={draft.allergies}
          customAllergy={draft.customAllergy}
          onToggleAllergy={toggleAllergy}
          onCustomAllergyChange={(val) => updateDraft('customAllergy', val)}
          onAddCustomAllergy={addCustomAllergy}
        />
      )}

      {step === 5 && (
        <HealthSummaryStep
          result={result}
          macros={draft.macros}
          onMacroChange={updateMacro}
        />
      )}

      {error ? (
        <AppText
          variant="caption"
          color={theme.colors.danger}
          accessibilityLiveRegion="polite"
        >
          {error}
        </AppText>
      ) : null}

      <View style={styles.actions}>
        {step > 0 || onCancel ? (
          <AppButton label="Quay lại" variant="ghost" onPress={back} />
        ) : null}
        {step < totalSteps - 1 ? (
          <AppButton label="Tiếp tục" onPress={next} />
        ) : (
          <AppButton
            label="Lưu hồ sơ và bắt đầu"
            loading={saving}
            onPress={handleSave}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, gap: 12, paddingBottom: 36 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 10 },
});
