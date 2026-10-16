import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppCard, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';
import type { MacroItemReport, MacroReportData } from '../types';

export function MacroReportChart({
  macroData,
}: {
  macroData: MacroReportData;
}) {
  const theme = useTheme();

  // Donut chart parameters
  const size = 110;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc lengths
  const pLength = (macroData.protein.percentage / 100) * circumference;
  const cLength = (macroData.carbs.percentage / 100) * circumference;
  const fLength = (macroData.fat.percentage / 100) * circumference;

  const pOffset = 0;
  const cOffset = -pLength;
  const fOffset = -(pLength + cLength);

  return (
    <AppCard style={styles.card} accessibilityLabel="Biểu đồ tỷ lệ macro">
      <View style={styles.header}>
        <AppText variant="heading">Cân đối Chất đa lượng (Macro)</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Tỷ lệ năng lượng từ Đạm, Tinh bột và Chất béo
        </AppText>
      </View>

      <View style={styles.donutRow}>
        {/* SVG Multi-segment Donut */}
        <View style={{ width: size, height: size }}>
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Background track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.surfaceMuted}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Protein arc */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.protein}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${pLength} ${circumference}`}
              strokeDashoffset={pOffset}
            />
            {/* Carbs arc */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.carbs}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${cLength} ${circumference}`}
              strokeDashoffset={cOffset}
            />
            {/* Fat arc */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.fat}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${fLength} ${circumference}`}
              strokeDashoffset={fOffset}
            />
          </Svg>
          <View style={styles.donutCenter}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Tổng
            </AppText>
            <AppText variant="heading">{formatNumber(macroData.totalCalories)}</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              kcal
            </AppText>
          </View>
        </View>

        {/* Legend / Percentages */}
        <View style={styles.legendCol}>
          <MacroLegendItem
            name="Protein"
            pct={macroData.protein.percentage}
            grams={macroData.protein.actualGrams}
            color={theme.colors.protein}
          />
          <MacroLegendItem
            name="Carbs"
            pct={macroData.carbs.percentage}
            grams={macroData.carbs.actualGrams}
            color={theme.colors.carbs}
          />
          <MacroLegendItem
            name="Fat"
            pct={macroData.fat.percentage}
            grams={macroData.fat.actualGrams}
            color={theme.colors.fat}
          />
        </View>
      </View>

      {/* Detailed Macro Comparison Rows with Target & Status */}
      <View style={styles.detailList}>
        <MacroDetailRow
          label="Chất đạm (Protein)"
          color={theme.colors.protein}
          item={macroData.protein}
        />
        <MacroDetailRow
          label="Tinh bột (Carbs)"
          color={theme.colors.carbs}
          item={macroData.carbs}
        />
        <MacroDetailRow
          label="Chất béo (Fat)"
          color={theme.colors.fat}
          item={macroData.fat}
        />
      </View>
    </AppCard>
  );
}

function MacroLegendItem({
  name,
  pct,
  grams,
  color,
}: {
  name: string;
  pct: number;
  grams: number;
  color: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.legendTexts}>
        <AppText variant="caption" style={{ fontWeight: '700' }}>
          {name}: {pct}%
        </AppText>
        <AppText variant="caption" color="#888">
          {formatNumber(grams)}g
        </AppText>
      </View>
    </View>
  );
}

function MacroDetailRow({
  label,
  color,
  item,
}: {
  label: string;
  color: string;
  item: MacroItemReport;
}) {
  const theme = useTheme();
  const progress = item.targetGrams > 0 ? item.actualGrams / item.targetGrams : 0;

  const statusLabel =
    item.status === 'ok'
      ? 'Đạt mục tiêu'
      : item.status === 'over'
      ? 'Vượt mục tiêu'
      : 'Thiếu so với mục tiêu';

  const statusColor =
    item.status === 'ok'
      ? theme.colors.primary
      : item.status === 'over'
      ? theme.colors.warning
      : theme.colors.textMuted;

  return (
    <View style={styles.detailRow}>
      <View style={styles.detailHeader}>
        <View style={styles.titleWithDot}>
          <View style={[styles.smallDot, { backgroundColor: color }]} />
          <AppText variant="caption" style={{ fontWeight: '600' }}>
            {label}
          </AppText>
        </View>
        <AppText variant="caption" color={statusColor}>
          {statusLabel}
        </AppText>
      </View>
      <View style={styles.detailSub}>
        <AppText variant="caption">
          {formatNumber(item.actualGrams)} / {formatNumber(item.targetGrams)}g
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {item.percentage}% (mục tiêu {item.targetPercentage}%)
        </AppText>
      </View>
      <ProgressBar value={progress} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14 },
  header: { gap: 2 },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  donutCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCol: { flex: 1, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendTexts: { flexDirection: 'row', gap: 8, alignItems: 'baseline' },
  detailList: { gap: 12, marginTop: 4 },
  detailRow: { gap: 4 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleWithDot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallDot: { width: 8, height: 8, borderRadius: 4 },
  detailSub: { flexDirection: 'row', justifyContent: 'space-between' },
});
