import React, { useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { getApiErrorMessage, resetPassword } from '../api';
import { AuthLayout, authStyles, emailPattern, passwordError } from './AuthLayout';
import { LOCAL_DEMO_ENABLED } from '../localAccount';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState(route.params?.email ?? '');
  const [token, setToken] = useState(route.params?.token ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !emailPattern.test(email.trim())) {
      setError('Vui lòng nhập email hợp lệ.');
      return;
    }
    if (!token.trim() || token.trim().length !== 6) {
      setError('Mã đặt lại mật khẩu phải gồm đúng 6 chữ số.');
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
      await resetPassword(email.trim(), token.trim(), password);
      setMessage('Đặt lại mật khẩu thành công! Đang chuyển hướng...');
      setTimeout(() => navigation.navigate('Login'), 1200);
    } catch (err: any) {
      if (err?.response?.status) {
        setError(getApiErrorMessage(err));
      } else if (LOCAL_DEMO_ENABLED && !err?.response) {
        // Fallback cho chế độ dev / demo khi không có server
        setMessage('Đặt lại mật khẩu thành công! Đang chuyển hướng...');
        setTimeout(() => navigation.navigate('Login'), 1200);
      } else {
        setError(getApiErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={authStyles.headerSection}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={authStyles.headerSubtitle}>
          Nhập mã 6 số từ email và tạo mật khẩu mới để bảo vệ tài khoản.
        </AppText>
      </View>

      <AppCard style={authStyles.formCard}>
        <View style={authStyles.inputStack}>
          {!route.params?.email ? (
            <AppInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(undefined);
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
          ) : null}

          <AppInput
            label="Mã đặt lại (6 chữ số)"
            value={token}
            maxLength={6}
            onChangeText={(text) => {
              setToken(text.replace(/[^0-9]/g, ''));
              if (error) setError(undefined);
            }}
            keyboardType="number-pad"
            placeholder="Ví dụ: 123456"
          />

          <AppInput
            label="Mật khẩu mới"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError(undefined);
            }}
            secureTextEntry
            placeholder="Ít nhất 8 ký tự, gồm chữ và số"
          />

          <AppInput
            label="Xác nhận mật khẩu"
            value={confirm}
            onChangeText={(text) => {
              setConfirm(text);
              if (error) setError(undefined);
            }}
            secureTextEntry
            placeholder="Nhập lại mật khẩu mới"
          />
        </View>

        {message ? (
          <View
            style={[
              authStyles.errorBanner,
              {
                backgroundColor: theme.scheme === 'dark' ? 'rgba(34, 197, 94, 0.12)' : '#DCFCE7',
                borderColor: theme.scheme === 'dark' ? 'rgba(34, 197, 94, 0.35)' : '#86EFAC',
              },
            ]}
          >
            <AppText variant="bodySm" color={theme.scheme === 'dark' ? '#4ADE80' : '#15803D'}>
              {message}
            </AppText>
          </View>
        ) : null}

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
            <AppText variant="bodySm" color={theme.colors.error}>
              {error}
            </AppText>
          </View>
        ) : null}

        <View style={authStyles.buttonStack}>
          <AppButton label="Cập nhật mật khẩu" loading={loading} onPress={submit} />
        </View>
      </AppCard>
    </AuthLayout>
  );
}
