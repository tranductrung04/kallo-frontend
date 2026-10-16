import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { images } from '@/assets/images';
import { AppCard, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';
import type { WeightTrendPoint } from '../types';

export function WeightTrendChart({
  points,
  targetWeightKg = 60,
}: {
  points: WeightTrendPoint[];
  targetWeightKg?: number;
}) {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    points.length ? points.length - 1 : null
  );

  const chartHeight = 150;
  const paddingBottom = 24;
  const paddingTop = 20;
  const availableHeight = chartHeight - paddingTop - paddingBottom;

  // Filter points that have weight values
  const validPoints = points.filter((p) => typeof p.weightKg === 'number');

  if (validPoints.length === 0) {
    return (
      <AppCard style={styles.card}>
        <AppText variant="heading">Xu hướng Cân nặng</AppText>
        <View style={styles.emptyBox}>
          <AppText color={theme.colors.textMuted} align="center">
            Chưa có đủ bản ghi cân nặng để vẽ biểu đồ xu hướng.
          </AppText>
        </View>
      </AppCard>
    );
  }

  // Min and max weight for scaling
  const allWeights = validPoints.map((p) => p.weightKg as number);
  if (targetWeightKg) allWeights.push(targetWeightKg);
  validPoints.forEach((p) => {
    if (typeof p.trendKg === 'number') allWeights.push(p.trendKg);
  });

  const minW = Math.max(20, Math.floor(Math.min(...allWeights) - 2));
  const maxW = Math.ceil(Math.max(...allWeights) + 2);
  const rangeW = Math.max(1, maxW - minW);

  const getY = (val: number) => {
    return chartHeight - paddingBottom - ((val - minW) / rangeW) * availableHeight;
  };

  const targetY = getY(targetWeightKg);

  const widthPerPoint = Math.max(34, 300 / Math.max(1, validPoints.length));
  const totalSvgWidth = Math.max(300, validPoints.length * widthPerPoint);

  // Build actual weight path (solid line)
  let actualPathD = '';
  validPoints.forEach((p, idx) => {
    const x = idx * widthPerPoint + widthPerPoint / 2;
    const y = getY(p.weightKg as number);
    if (idx === 0) {
      actualPathD += `M ${x} ${y}`;
    } else {
      actualPathD += ` L ${x} ${y}`;
    }
  });

  // Build trendline path (dotted line)
  let trendPathD = '';
  const trendPoints = validPoints.filter((p) => typeof p.trendKg === 'number');
  trendPoints.forEach((p, idx) => {
    const x = idx * widthPerPoint + widthPerPoint / 2;
    const y = getY(p.trendKg as number);
    if (idx === 0) {
      trendPathD += `M ${x} ${y}`;
    } else {
      trendPathD += ` L ${x} ${y}`;
    }
  });

  const selectedPoint =
    selectedIndex !== null && validPoints[selectedIndex]
      ? validPoints[selectedIndex]
      : validPoints[validPoints.length - 1];

  return (
    <AppCard style={styles.card} accessibilityLabel="Biểu đồ xu hướng cân nặng">
      <ImageBackground
        source={images.reportWlCardBg}
        style={styles.bgImage}
        imageStyle={styles.bgInner}
      >
        <View style={styles.header}>
          <AppText variant="heading">Lộ trình & Xu hướng Cân nặng</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Nét liền: Cân nặng thực tế • Nét đứt: Mục tiêu • Chấm mờ: Xu hướng EMA
          </AppText>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.solidLine, { backgroundColor: theme.colors.primary }]} />
            <AppText variant="caption">Thực tế</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dashedLine, { borderColor: theme.colors.textMuted }]} />
            <AppText variant="caption">Mục tiêu ({formatNumber(targetWeightKg, 1)} kg)</AppText>
          </View>
          {trendPathD ? (
            <View style={styles.legendItem}>
              <View style={[styles.dottedLine, { borderColor: theme.colors.calorieIn }]} />
              <AppText variant="caption">Xu hướng</AppText>
            </View>
          ) : null}
        </View>

        {/* Active Tooltip */}
        {selectedPoint ? (
          <View style={[styles.tooltipBox, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <AppText variant="caption" style={{ fontWeight: '700' }}>
              Ngày {selectedPoint.date}
            </AppText>
            <View style={styles.tooltipRow}>
              <AppText variant="caption" color={theme.colors.primary}>
                Cân nặng: {formatNumber(selectedPoint.weightKg as number, 1)} kg
              </AppText>
              {typeof selectedPoint.trendKg === 'number' ? (
                <AppText variant="caption" color={theme.colors.calorieIn}>
                  Xu hướng: {formatNumber(selectedPoint.trendKg, 1)} kg
                </AppText>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* SVG Chart */}
        <View style={styles.chartContainer}>
          <Svg width="100%" height={chartHeight} viewBox={`0 0 ${totalSvgWidth} ${chartHeight}`}>
            {/* Target line */}
            <Line
              x1="0"
              y1={targetY}
              x2={totalSvgWidth}
              y2={targetY}
              stroke={theme.colors.textMuted}
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Dotted Trendline (Linear Regression / EMA) */}
            {trendPathD ? (
              <Path
                d={trendPathD}
                stroke={theme.colors.calorieIn}
                strokeDasharray="3 3"
                strokeWidth="2"
                fill="none"
              />
            ) : null}

            {/* Solid Line (Actual weight) */}
            <Path
              d={actualPathD}
              stroke={theme.colors.primary}
              strokeWidth="2.5"
              fill="none"
            />

            {/* Dots on actual weight points */}
            {validPoints.map((p, idx) => {
              const x = idx * widthPerPoint + widthPerPoint / 2;
              const y = getY(p.weightKg as number);
              const isSelected = selectedIndex === idx;

              return (
                <React.Fragment key={p.date}>
                  <Circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? theme.colors.primary : '#FFFFFF'}
                    stroke={theme.colors.primary}
                    strokeWidth="2"
                  />
                  <SvgText
                    x={x}
                    y={chartHeight - 6}
                    fontSize="9"
                    fill={isSelected ? theme.colors.primary : theme.colors.textMuted}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {p.label}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Touch Overlay */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <View style={styles.touchRow}>
              {validPoints.map((_, i) => (
                <Pressable
                  key={i}
                  style={styles.touchCol}
                  onPress={() => setSelectedIndex(i)}
                  accessibilityRole="button"
                  accessibilityLabel="Chọn điểm cân nặng"
                />
              ))}
            </View>
          </View>
        </View>
      </ImageBackground>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
  bgImage: { padding: 16, gap: 12 },
  bgInner: { opacity: 0.1 },
  header: { gap: 2 },
  emptyBox: { padding: 24, alignItems: 'center' },
  legendRow: { flexDirection: 'row', gap: 14, alignItems: 'center', flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  solidLine: { width: 14, height: 3, borderRadius: 2 },
  dashedLine: { width: 14, height: 0, borderTopWidth: 2, borderStyle: 'dashed' },
  dottedLine: { width: 14, height: 0, borderTopWidth: 2, borderStyle: 'dotted' },
  tooltipBox: { padding: 8, borderRadius: 8, borderWidth: 1, gap: 4 },
  tooltipRow: { flexDirection: 'row', gap: 14 },
  chartContainer: { position: 'relative', marginTop: 4 },
  touchRow: { flexDirection: 'row', height: '100%' },
  touchCol: { flex: 1, height: '100%' },
});
