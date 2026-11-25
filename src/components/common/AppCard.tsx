// ─── AppCard — Nocturne & Daylight Vitality ──────────────────────────────────
// DESIGN.md: "Standard Cards & Modals: rounded-lg (16px)"
//   Level 1: surfaceMid BG, surfaceBorder 1px border, level1 shadow (light)
//   Level 2: surfaceHigh BG, surfaceBorder border
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

export type CardLevel = 1 | 2;

export type AppCardProps = React.PropsWithChildren<{
  onPress?: PressableProps['onPress'];
  style?: StyleProp<ViewStyle>;
  testID?: string;
  padding?: number;
  accessibilityLabel?: string;
  accessibilityRole?: PressableProps['accessibilityRole'];
  /** Level 1 = surfaceMid (primary containers); Level 2 = surfaceHigh (nested wells) */
  level?: CardLevel;
}>;

export function AppCard({
  children,
  onPress,
  style,
  padding,
  accessibilityLabel,
  accessibilityRole,
  testID,
  level = 1,
}: AppCardProps) {
  const theme = useTheme();

  const bg = level === 1 ? theme.colors.surfaceMid : theme.colors.surfaceHigh;
  const shadow = level === 1 ? theme.shadows.level1 : {};

  const baseCardStyle: StyleProp<ViewStyle> = [
    styles.base,
    shadow,
    {
      backgroundColor: bg,
      borderColor: theme.colors.surfaceBorder,
      padding: padding ?? theme.spacing.md,
    },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: false }}
        style={({ pressed }) => [baseCardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={baseCardStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 16, // rounded-lg per DESIGN.md
  },
  pressed: { opacity: 0.8 },
});
