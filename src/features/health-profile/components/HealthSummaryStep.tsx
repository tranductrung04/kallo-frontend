import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppCard, AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import type { HealthProfileCalculationResult, MacroName, MacroPercentages } from '../types';

interface HealthSummaryStepProps {
  result: HealthProfileCalculationResult | undefined;
  macros: MacroPercentages;
  onMacroChange: (name: MacroName, value: number) => void;
}

export function HealthSummaryStep({
  result,
  macros,
  onMacroChange,
}: HealthSummaryStepProps) {
  const theme = useTheme();

  if (!result) {
    return <AppText>Chưa đủ dữ liệu để tính kết quả.</AppText>;
  }

  const macroTotal = macros.protein + macros.carbs + macros.fat;

  return (
    <View style={styles.section}>
      <View style={styles.intro}>
        <Image
          source={images.onboardingWaiting}
          style={styles.stepImage}
          resizeMode="contain"
          accessibilityLabel="Hồ sơ của bạn đã sẵn sàng"
        />
        <AppText variant="title" align="center">
          Hồ sơ của bạn đã sẵn sàng
        </AppText>
        <AppText align="center" color={theme.colors.textMuted}>
          Các chỉ số được tính theo thông tin bạn cung cấp.
        </AppText>
      </View>

      <View style={styles.metrics}>
        {[
          ['BMI', result.bmi.toFixed(1)],
          ['BMR', `${Math.round(result.bmr)} kcal`],
          ['TDEE', `${Math.round(result.tdee)} kcal`],
          ['Mục tiêu calo', `${result.dailyCalorieGoal} kcal`],
        ].map(([label, value]) => (
          <AppCard key={label} style={styles.metricCard}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {label}
            </AppText>
            <AppText variant="heading">{value}</AppText>
          </AppCard>
        ))}
      </View>

      {result.unsafe ? (
        <AppText color={theme.colors.warning}>
          Mức giảm đã vượt giới hạn an toàn. Kallo đã điều chỉnh calo tối thiểu.
        </AppText>
      ) : null}

      <AppText variant="heading">Tỷ lệ macro</AppText>
      {(['protein', 'carbs', 'fat'] as MacroName[]).map((name) => (
        <AppInput
          key={name}
          label={`${name === 'protein' ? 'Protein' : name === 'carbs' ? 'Carbs' : 'Fat'} (%)`}
          value={String(Math.round(macros[name]))}
          onChangeText={(value) => onMacroChange(name, Number(value))}
          keyboardType="number-pad"
        />
      ))}

      <AppText variant="caption" color={theme.colors.textMuted}>
        Tổng macro: {Math.round(macroTotal)}%.
      </AppText>
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
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
  },
});
