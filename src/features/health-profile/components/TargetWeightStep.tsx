import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import type { GoalType } from '../types';

interface TargetWeightStepProps {
  goal: GoalType;
  targetWeight: string;
  weeklyRate: string;
  onTargetWeightChange: (weight: string) => void;
  onWeeklyRateChange: (rate: string) => void;
}

export function TargetWeightStep({
  goal,
  targetWeight,
  weeklyRate,
  onTargetWeightChange,
  onWeeklyRateChange,
}: TargetWeightStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.intro}>
        <Image
          source={goal === 'gain' ? images.weightGain : images.weightLoss}
          style={styles.stepImage}
          resizeMode="contain"
          accessibilityLabel="Đặt mục tiêu cụ thể"
        />
        <AppText variant="title" align="center">
          Đặt mục tiêu cụ thể
        </AppText>
        <AppText align="center" color={theme.colors.textMuted}>
          Tốc độ thay đổi an toàn tối đa là 1 kg mỗi tuần.
        </AppText>
      </View>

      <AppInput
        label="Cân nặng mục tiêu (kg)"
        value={targetWeight}
        onChangeText={onTargetWeightChange}
        keyboardType="decimal-pad"
        placeholder="Ví dụ: 60"
      />
      <AppInput
        label="Tốc độ thay đổi mỗi tuần (kg)"
        value={weeklyRate}
        onChangeText={onWeeklyRateChange}
        keyboardType="decimal-pad"
        placeholder="0 - 1"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  intro: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepImage: {
    width: '100%',
    height: 180,
  },
});
