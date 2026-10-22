// ─── StatusBanner — Nocturne & Daylight Vitality ─────────────────────────────
// DESIGN.md: "Status Banners (Warning / Danger)"
//   Full-width card, rounded-lg (16px), left icon, bold title, body-md message
//   Fill: status color at 15% alpha over surface-mid, border 1px status color
//   Icon & title in status color, message in textPrimary
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type StatusBannerType = 'warning' | 'danger';

export type StatusBannerProps = {
  type?: StatusBannerType;
  title: string;
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function StatusBanner({
  type = 'warning',
  title,
  message,
  style,
  testID,
}: StatusBannerProps) {
  const theme = useTheme();
  const isWarning = type === 'warning';
  const statusColor = isWarning ? theme.colors.statusWarning : theme.colors.statusDanger;

  // 15% alpha over surfaceMid per DESIGN.md L342
  const bgAlpha = isWarning
    ? theme.scheme === 'dark'
      ? 'rgba(251, 146, 60, 0.15)'
      : 'rgba(194, 65, 12, 0.12)'
    : theme.scheme === 'dark'
      ? 'rgba(255, 90, 95, 0.15)'
      : 'rgba(217, 45, 32, 0.12)';

  const icon = isWarning ? '⚠️' : '🚨';

  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      accessibilityLabel={`${title}: ${message}`}
      style={[
        styles.banner,
        {
          backgroundColor: bgAlpha,
          borderColor: statusColor,
        },
        style,
      ]}
    >
      <AppText style={styles.icon}>{icon}</AppText>
      <View style={styles.textContainer}>
        <AppText variant="labelLg" color={statusColor} style={styles.title}>
          {title}
        </AppText>
        <AppText variant="bodyMd" color={theme.colors.textPrimary}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16, // rounded-lg per DESIGN.md
    borderWidth: 1,
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '700',
  },
});
