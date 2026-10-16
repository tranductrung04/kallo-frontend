import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type AppInputProps = TextInputProps & { label?: string; error?: string; left?: React.ReactNode; right?: React.ReactNode; testID?: string };
export function AppInput({ label, error, left, right, secureTextEntry, style, testID, ...props }: AppInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(secureTextEntry));
  return <View style={styles.wrapper}>
    {label ? <AppText variant="labelLg" style={styles.label}>{label}</AppText> : null}
    <View style={[styles.field, { backgroundColor: theme.colors.surfaceHigh, borderColor: error ? theme.colors.error : focused ? theme.colors.brandPrimary : theme.colors.surfaceBorder }]}>
      {left}
      <TextInput {...props} testID={testID} accessibilityLabel={props.accessibilityLabel ?? label} secureTextEntry={secureTextEntry ? hidden : false} onFocus={(event) => { setFocused(true); props.onFocus?.(event); }} onBlur={(event) => { setFocused(false); props.onBlur?.(event); }} placeholderTextColor={theme.colors.textSecondary} maxFontSizeMultiplier={1.3} style={[styles.input, { color: theme.colors.textPrimary }, style]} />
      {secureTextEntry ? <Pressable accessibilityRole="button" accessibilityLabel={hidden ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'} onPress={() => setHidden((value) => !value)} style={styles.action}><AppText variant="labelMd" color={theme.colors.brandPrimary}>{hidden ? 'Hiện' : 'Ẩn'}</AppText></Pressable> : right}
    </View>
    {error ? <AppText accessibilityLiveRegion="polite" accessibilityLabel={`Lỗi: ${error}`} variant="bodySm" color={theme.colors.error} style={styles.error}>{error}</AppText> : null}
  </View>;
}
const styles = StyleSheet.create({ wrapper: { gap: 6 }, label: { marginLeft: 2 }, field: { minHeight: 48, borderWidth: 1, borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }, input: { flex: 1, minHeight: 44, paddingHorizontal: 8, fontSize: 16 }, action: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, error: { marginLeft: 2 } });
