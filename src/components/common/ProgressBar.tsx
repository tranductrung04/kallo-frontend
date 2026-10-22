// ─── ProgressBar — Nocturne & Daylight Vitality ──────────────────────────────
// DESIGN.md: "Macro Progress Sliders"
//   Track: surfaceHigh (dark) / #ECE9F6 (light), height 8px, rounded-full
//   Fill: macroProtein / macroCarbs / macroFats (respective color)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';

export type ProgressBarProps = {
  value: number;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export const clampProgress = (value: number) =>
  Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

export function ProgressBar({ value, color, height = 8, style, testID }: ProgressBarProps) {
  const theme = useTheme();
  const progress = clampProgress(value);

  const trackColor = theme.colors.progressTrack;

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      style={[
        styles.track,
        { height, backgroundColor: trackColor, borderRadius: height / 2 },
        style,
      ]}
    >
      <View
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: color ?? theme.colors.brandPrimary,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden' },
});
