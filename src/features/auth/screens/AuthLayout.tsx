import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme';
import { AuthLightBackground } from './AuthLightBackground';

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function passwordError(password: string) {
  return password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)
    ? 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.'
    : undefined;
}

export function AuthLayout({ children }: React.PropsWithChildren) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[authStyles.safe, { backgroundColor: isDark ? theme.colors.canvasBase : '#EDE9FA' }]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {!isDark && <AuthLightBackground />}
      <ScrollView
        contentContainerStyle={authStyles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={authStyles.innerContainer}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const authStyles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: 20,
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  headerTitle: {
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14.5,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Form Card
  formCard: {
    padding: 22,
    gap: 20,
  },
  inputStack: {
    gap: 16,
  },
  passwordFieldContainer: {
    gap: 8,
  },
  forgotPasswordPressable: {
    alignSelf: 'flex-end',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },

  // Error / Message Banner
  errorBanner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorBannerText: {
    lineHeight: 18,
  },

  // Button Stack
  buttonStack: {
    gap: 12,
    marginTop: 4,
  },

  // Secondary Actions
  secondaryActions: {
    gap: 12,
  },

  // Footer Link Row
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    paddingVertical: 6,
  },
  underlinedLink: {
    textDecorationLine: 'underline',
  },
  linkPressed: {
    opacity: 0.7,
  },
});
