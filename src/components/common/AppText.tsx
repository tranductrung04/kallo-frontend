import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme, type TypographyVariant } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  testID?: string;
};

export function AppText({ variant = 'bodyLg', color, align, style, testID, ...props }: AppTextProps) {
  const theme = useTheme();
  const baseStyle = theme.typography[variant];
  const flattened = StyleSheet.flatten(style);

  // Prevent vertical text clipping on Android & iOS when custom fontSize is provided without matching lineHeight
  const targetFontSize = flattened?.fontSize ?? baseStyle?.fontSize;
  const targetLineHeight = flattened?.lineHeight ?? (flattened?.fontSize ? undefined : baseStyle?.lineHeight);

  let safeLineHeight = targetLineHeight;
  if (targetFontSize && (!safeLineHeight || safeLineHeight < targetFontSize * 1.15)) {
    safeLineHeight = Math.ceil(targetFontSize * 1.28);
  }

  return (
    <Text
      testID={testID}
      maxFontSizeMultiplier={1.3}
      {...props}
      style={[
        baseStyle,
        { color: color ?? theme.colors.textPrimary, textAlign: align },
        style,
        safeLineHeight ? { lineHeight: safeLineHeight } : undefined,
      ]}
    />
  );
}
