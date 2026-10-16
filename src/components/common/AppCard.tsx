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
  /** Level 1 = surfaceMid (primary containers); Level 2 = surfaceHigh (nested wells) */
  level?: CardLevel;
}>;

export function AppCard({
  children,
  onPress,
  style,
  padding,
  accessibilityLabel,
  testID,
  level = 1,
}: AppCardProps) {
  const theme = useTheme();

  const bg = level === 1 ? theme.colors.surfaceMid : theme.colors.surfaceHigh;
  const shadow = level === 1 ? theme.shadows.level1 : {};

  const cardStyle: StyleProp<ViewStyle> = [
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
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: false }}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} style={cardStyle}>
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
