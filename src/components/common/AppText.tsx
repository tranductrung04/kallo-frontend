import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme, type TypographyVariant } from '@/theme';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  testID?: string;
};

export function AppText({ variant = 'bodyLg', color, align, style, testID, ...props }: AppTextProps) {
  const theme = useTheme();
  return (
    <Text
      testID={testID}
      maxFontSizeMultiplier={1.3}
      {...props}
      style={[
        theme.typography[variant],
        { color: color ?? theme.colors.textPrimary, textAlign: align },
        style,
      ]}
    />
  );
}
