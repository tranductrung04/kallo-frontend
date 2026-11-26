// ─── CircularProgress — Nocturne & Daylight Vitality ─────────────────────────
// DESIGN.md: "Metric Big Numbers (data-display 44px/48px/800)"
//   Track: surfaceHigh
//   Stroke: brandPrimary (or custom color passed via prop)
//   Center: dataDisplay typography for calorie counts
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { clampProgress } from './ProgressBar';

export type CircularProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  labelColor?: string;
  centerText?: string;
  centerTextColor?: string;
  testID?: string;
};

export function CircularProgress({
  value,
  size = 140,
  strokeWidth = 14,
  color,
  label,
  labelColor,
  centerText,
  centerTextColor,
  testID,
}: CircularProgressProps) {
  const theme = useTheme();
  const progress = clampProgress(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeColor = color ?? theme.colors.brandPrimary;
  const trackColor = theme.colors.progressTrack;

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress: chỉ vẽ cung tiến độ khi > 0 để tránh chấm tròn strokeLinecap ở mức 0 */}
        {progress > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - progress)}
          />
        )}
      </Svg>
      <View style={styles.center}>
        {/* dataDisplay typography for big calorie numbers */}
        {centerText !== undefined
          ? <AppText variant="dataDisplay" align="center" color={centerTextColor}>{centerText}</AppText>
          : <AppText variant="headlineMd" align="center" color={centerTextColor}>{Math.round(progress * 100)}%</AppText>}
        {label
          ? <AppText variant="bodySm" color={labelColor ?? theme.colors.textSecondary} align="center">{label}</AppText>
          : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
