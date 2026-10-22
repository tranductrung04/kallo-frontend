// ─── AppButton — Nocturne & Daylight Vitality ────────────────────────────────
// DESIGN.md spec:
//   Primary CTA: 52px height, pill (9999px), pressed scale 0.98 / opacity 0.85
//   Secondary:   36px height, surfaceHigh bg, surfaceBorder border
//   Outline/Ghost: kept for layout compatibility
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export type AppButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function AppButton({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  testID,
  ...props
}: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = Boolean(disabled || loading);

  const palette = isDisabled
    ? {
        backgroundColor: theme.colors.surfaceHigh,
        borderColor: theme.colors.surfaceBorder,
        text: theme.colors.textDisabled,
      }
    : {
        primary: {
          backgroundColor: theme.colors.brandAction,
          borderColor: theme.colors.brandAction,
          text: theme.colors.onBrand,
        },
        secondary: {
          backgroundColor: theme.colors.surfaceHigh,
          borderColor: theme.colors.surfaceBorder,
          text: theme.colors.textPrimary,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: theme.colors.brandPrimary,
          text: theme.colors.brandPrimary,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          text: theme.colors.brandPrimary,
        },
      }[variant];

  const buttonHeight = variant === 'primary' ? styles.primaryHeight : styles.secondaryHeight;
  const buttonRadius = variant === 'primary' ? styles.primaryRadius : styles.secondaryRadius;
  const buttonShadow = variant === 'primary' && !isDisabled ? theme.shadows.primaryButton : undefined;

  return (
    <Pressable
      testID={testID}
      {...props}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        buttonHeight,
        buttonRadius,
        buttonShadow,
        { backgroundColor: palette.backgroundColor, borderColor: palette.borderColor },
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={palette.text} accessibilityLabel="Đang tải" />
        : <AppText variant="labelLg" color={palette.text} align="center">{label}</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Primary CTA: 52px, fully pill-rounded
  primaryHeight: { minHeight: 52, paddingVertical: 14 },
  primaryRadius: { borderRadius: 9999 },
  // Secondary Pill: 36px
  secondaryHeight: { minHeight: 36, paddingVertical: 8, paddingHorizontal: 16 },
  secondaryRadius: { borderRadius: 9999 },
  // Press state: scale 0.98, opacity 0.85 per DESIGN.md
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
});
