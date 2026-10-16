// ─── CalorieSummaryCard — Nocturne & Daylight Vitality ───────────────────────
// DESIGN.md: "Thẻ Tổng quan Năng lượng"
//   CircularProgress: brandPrimary stroke, dataDisplay center text
//   3 MacroRows: macroProtein / macroCarbs / macroFats
//   Card: surfaceMid BG, surfaceBorder 1px, level1 shadow (light)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppCard, AppText, CircularProgress, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '../utils';
import type { NutritionSummary } from '../types';

export function CalorieSummaryCard({ summary }: { summary: NutritionSummary }) {
  const theme = useTheme();
  const progress = summary.caloriesGoal ? summary.calories / summary.caloriesGoal : 0;
  const remaining = summary.caloriesRemaining;

  return (
    <AppCard style={styles.card} accessibilityLabel="Tổng quan năng lượng hôm nay">
      {/* Header */}
      <View style={styles.cardHeader}>
        <AppText variant="headlineMd">Năng lượng hôm nay</AppText>
        <AppText variant="bodySm" color={theme.colors.textSecondary}>
          Mục tiêu {formatNumber(summary.caloriesGoal)} kcal
        </AppText>
      </View>

      {/* Calorie Ring + Stats */}
      <View style={styles.main}>
        <CircularProgress
          value={progress}
          size={140}
          strokeWidth={14}
          color={theme.colors.brandPrimary}
          centerText={String(formatNumber(remaining))}
          label="kcal còn lại"
        />
        <View style={styles.numbers}>
          <View style={styles.statRow}>
            <Image source={images.trackerFire} style={styles.icon} accessibilityLabel="Calo đã nạp" />
            <View>
              <AppText variant="labelMd" color={theme.colors.textSecondary}>Đã nạp</AppText>
              <AppText variant="headlineSm">{formatNumber(summary.calories)}</AppText>
            </View>
          </View>
          <View style={[styles.statRow, styles.statDivider, { borderTopColor: theme.colors.surfaceBorder }]}>
            <AppText style={styles.dot} color={theme.colors.vipStreak}>●</AppText>
            <View>
              <AppText variant="labelMd" color={theme.colors.textSecondary}>Tiêu hao</AppText>
              <AppText variant="headlineSm">{formatNumber(summary.caloriesBurned)}</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Macro Bars */}
      <View style={styles.macros}>
        <MacroRow
          label="Chất đạm"
          value={summary.protein}
          goal={summary.proteinGoal}
          color={theme.colors.macroProtein}
        />
        <MacroRow
          label="Đường bột"
          value={summary.carbs}
          goal={summary.carbsGoal}
          color={theme.colors.macroCarbs}
        />
        <MacroRow
          label="Chất béo"
          value={summary.fat}
          goal={summary.fatGoal}
          color={theme.colors.macroFats}
        />
      </View>
    </AppCard>
  );
}

function MacroRow({
  label,
  value,
  goal,
  color,
}: {
  label: string;
  value: number;
  goal: number;
  color: string;
}) {
  return (
    <View style={styles.macro}>
      <View style={styles.macroHeader}>
        <AppText variant="labelMd">{label}</AppText>
        <AppText variant="labelMd" color="inherit">
          <AppText variant="labelLg">{formatNumber(value, 1)}</AppText>
          <AppText variant="bodySm"> / {formatNumber(goal, 1)} g</AppText>
        </AppText>
      </View>
      <ProgressBar value={goal ? value / goal : 0} color={color} height={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 16 },
  cardHeader: { gap: 2 },
  main: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  numbers: { flex: 1, gap: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statDivider: { paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  dot: { fontSize: 10, lineHeight: 14 },
  icon: { width: 24, height: 24, resizeMode: 'contain' },
  macros: { gap: 10 },
  macro: { gap: 6 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between' },
});
