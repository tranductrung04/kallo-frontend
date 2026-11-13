import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '../AuthProvider';
import { getApiErrorMessage } from '../api';
import { AuthLayout, authStyles, emailPattern, passwordError } from './AuthLayout';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      setError('Vui lòng nhập tên hiển thị.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError('Email không đúng định dạng.');
      return;
    }
    const passwordMessage = passwordError(password);
    if (passwordMessage) {
      setError(passwordMessage);
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      navigation.navigate('VerifyOtp', { email: email.trim() });
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
          Bắt đầu thiết lập hồ sơ sức khỏe cá nhân của bạn.
        </AppText>
      </View>

      {/* Form Card */}
      <AppCard style={authStyles.formCard}>
        <View style={authStyles.inputStack}>
          <AppInput
            label="Tên hiển thị"
            value={name}
            onChangeText={setName}
            placeholder="Ví dụ: Nguyễn Văn A"
            testID="register-name-input"
          />
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            testID="register-email-input"
          />
          <AppInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Ít nhất 8 ký tự, gồm chữ và số"
            testID="register-password-input"
          />
          <AppInput
            label="Xác nhận mật khẩu"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="Nhập lại mật khẩu"
            testID="register-confirm-input"
          />
        </View>

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

        <View style={authStyles.buttonStack}>
          <AppButton
            label="Đăng ký tài khoản"
            loading={loading}
            onPress={submit}
            testID="register-submit-button"
          />
        </View>
      </AppCard>

      {/* Footer */}
      <View style={authStyles.footerRow}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary}>
          Đã có tài khoản?{' '}
        </AppText>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập"
          style={({ pressed }) => pressed && authStyles.linkPressed}
        >
          <AppText variant="labelLg" color={theme.colors.brandPrimary} style={authStyles.underlinedLink}>
            Đăng nhập
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

