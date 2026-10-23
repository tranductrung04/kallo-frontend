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
  defaultMacroPercentages,
  isValidAge,
  isValidHeight,
  isValidWeight,
  isValidWeeklyRate,
  useHealthProfileDraft,
  type ActivityLevel,
  type GoalType,
} from '@/features/health-profile';
import {
  WelcomeMascotStep,
  DependentChoiceStep,
  CalorieDeficitIntroStep,
  NotificationPermissionStep,
} from '../components';

export function OnboardingFlowScreen() {
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

  const validateStep = () => {
    if (step === 2 && !isValidAge(age)) return 'Tuổi phải từ 13 đến 120.';
    if (step === 3 && !isValidHeight(height)) return 'Chiều cao phải từ 100 đến 250 cm.';
    if (step === 3 && !isValidWeight(weight)) return 'Cân nặng phải từ 20 đến 300 kg.';
    if (step === 5 && (!isValidWeight(targetWeight) || !isValidWeeklyRate(weeklyRate))) {
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
    setStep((current) => Math.min(9, current + 1));
  };

  const handleSave = async () => {
    await saveProfile();
  };

  if (!loaded) {
    return <View style={[styles.safe, { backgroundColor: theme.colors.background }]} />;
  }

  return (
    <ScrollView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <ProgressBar value={(step + 1) / 10} />
      <AppText variant="caption" color={theme.colors.textMuted}>
        Bước {step + 1}/10
      </AppText>

      {/* Step 0: Welcome Mascot (Onboarding) */}
      {step === 0 && <WelcomeMascotStep />}

      {/* Step 1: Who are you setting up for (Onboarding) */}
      {step === 1 && (
        <DependentChoiceStep
          value={draft.dependent}
          onChange={(val) => updateDraft('dependent', val)}
        />
      )}

      {/* Step 2: Gender & Age (Health Profile) */}
      {step === 2 && (
        <BasicInfoStep
          gender={draft.gender}
          age={draft.age}
          onGenderChange={(val) => updateDraft('gender', val)}
          onAgeChange={(val) => updateDraft('age', val)}
        />
      )}

      {/* Step 3: Height & Weight (Health Profile) */}
      {step === 3 && (
        <BodyMeasureStep
          height={draft.height}
          weight={draft.weight}
          onHeightChange={(val) => updateDraft('height', val)}
          onWeightChange={(val) => updateDraft('weight', val)}
        />
      )}

      {/* Step 4: Activity & Goal (Health Profile) */}
      {step === 4 && (
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

      {/* Step 5: Target Weight & Weekly Rate (Health Profile) */}
      {step === 5 && (
        <TargetWeightStep
          goal={draft.goal}
          targetWeight={draft.targetWeight}
          weeklyRate={draft.weeklyRate}
          onTargetWeightChange={(val) => updateDraft('targetWeight', val)}
          onWeeklyRateChange={(val) => updateDraft('weeklyRate', val)}
        />
      )}

      {/* Step 6: Calorie Deficit Concept (Onboarding) */}
      {step === 6 && <CalorieDeficitIntroStep />}

      {/* Step 7: Allergies & Dietary Restrictions (Health Profile) */}
      {step === 7 && (
        <AllergiesStep
          allergies={draft.allergies}
          customAllergy={draft.customAllergy}
          onToggleAllergy={toggleAllergy}
          onCustomAllergyChange={(val) => updateDraft('customAllergy', val)}
          onAddCustomAllergy={addCustomAllergy}
        />
      )}

      {/* Step 8: Permissions & Reminders (Onboarding) */}
      {step === 8 && <NotificationPermissionStep />}

      {/* Step 9: Summary & Macro Percentages (Health Profile) */}
      {step === 9 && (
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
        {step > 0 ? (
          <AppButton
            label="Quay lại"
            variant="ghost"
            onPress={() => {
              setError(undefined);
              setStep((current) => current - 1);
            }}
          />
        ) : null}

        {step < 9 ? (
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
