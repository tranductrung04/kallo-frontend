import React, { useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '../AuthProvider';
import { getApiErrorMessage } from '../api';
import { LOCAL_ACCOUNT } from '../localAccount';
import { AuthLayout, authStyles } from './AuthLayout';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signIn, isDemoMode, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập tài khoản hoặc email.');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <View style={authStyles.headerSection}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={authStyles.headerSubtitle}>
          Đăng nhập để tiếp tục hành trình chăm sóc sức khoẻ cùng Kallo.
        </AppText>
      </View>

      {/* Main Form Card */}
      <AppCard style={authStyles.formCard}>
        {/* Demo Mode Notice Badge */}
        {isDemoMode ? (
          <TouchableOpacity
            style={[
              authStyles.errorBanner,
              {
                backgroundColor: theme.scheme === 'dark' ? 'rgba(217, 119, 6, 0.15)' : '#FEF3C7',
                borderColor: theme.scheme === 'dark' ? 'rgba(217, 119, 6, 0.4)' : '#FCD34D',
                marginBottom: 16,
              },
            ]}
            onPress={() => {
              setEmail(LOCAL_ACCOUNT.email);
              setPassword(LOCAL_ACCOUNT.password);
            }}
          >
            <AppText variant="caption" color={theme.colors.macroFats} style={{ fontWeight: '600' }}>
              💡 Chế độ Demo (Offline) đang bật. Nhấn vào đây để tự động điền tài khoản mẫu.
            </AppText>
          </TouchableOpacity>
        ) : null}

        {/* Input Fields */}
        <View style={authStyles.inputStack}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            testID="login-email-input"
          />

          <View style={authStyles.passwordFieldContainer}>
            <AppInput
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Nhập mật khẩu của bạn"
              testID="login-password-input"
            />
            <Pressable
              onPress={() => navigation.navigate('ForgotPassword')}
              accessibilityRole="button"
              accessibilityLabel="Quên mật khẩu?"
              style={({ pressed }) => [
                authStyles.forgotPasswordPressable,
                pressed && authStyles.linkPressed,
              ]}
            >
              <AppText variant="labelMd" color={theme.colors.brandPrimary}>
                Quên mật khẩu?
              </AppText>
            </Pressable>
          </View>
        </View>

        {/* Error Feedback */}
        {error ? (
          <View
            style={[
              authStyles.errorBanner,
              {
                backgroundColor: theme.scheme === 'dark' ? 'rgba(255, 90, 95, 0.12)' : '#FEE2E2',
                borderColor: theme.scheme === 'dark' ? 'rgba(255, 90, 95, 0.35)' : '#FCA5A5',
              },
            ]}
          >
            <AppText
              variant="bodySm"
              color={theme.colors.error}
              accessibilityLiveRegion="polite"
              style={authStyles.errorBannerText}
            >
              {error}
            </AppText>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={authStyles.buttonStack}>
          <AppButton
            label="Đăng nhập"
            loading={loading}
            onPress={submit}
            testID="login-submit-button"
          />

          {/* Nút Demo chỉ hiển thị khi đang chạy Chế độ Demo (isDemoMode = true) */}
          {isDemoMode ? (
            <TouchableOpacity
              style={{
                marginTop: 12,
                paddingVertical: 11,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.scheme === 'dark' ? 'rgba(139, 87, 232, 0.4)' : '#DDD6FE',
                backgroundColor: theme.scheme === 'dark' ? 'rgba(139, 87, 232, 0.12)' : '#F5F3FF',
                alignItems: 'center',
              }}
              onPress={handleQuickDemo}
              disabled={loading}
              activeOpacity={0.7}
            >
              <AppText
                variant="labelMd"
                color={theme.colors.brandPrimary}
                style={{ fontWeight: '600' }}
              >
                ⚡ Trải nghiệm ngay với chế độ Demo (Offline)
              </AppText>
            </TouchableOpacity>
          ) : null}
        </View>
      </AppCard>

      {/* Footer / Switch Screen */}
      <View style={authStyles.footerRow}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary}>
          Chưa có tài khoản?{' '}
        </AppText>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
          accessibilityLabel="Tạo tài khoản mới"
          style={({ pressed }) => pressed && authStyles.linkPressed}
        >
          <AppText variant="labelLg" color={theme.colors.brandPrimary} style={authStyles.underlinedLink}>
            Đăng ký ngay
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

