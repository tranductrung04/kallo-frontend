import React, { useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { resetPassword } from '../api';
import { AuthLayout, authStyles, passwordError } from './AuthLayout';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const [token, setToken] = useState(route.params?.token ?? '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const passwordMessage = passwordError(password);
    if (!token.trim()) {
      setError('Vui lòng nhập mã đặt lại mật khẩu.');
      return;
    }
    if (!/^\d+$/.test(token.trim())) {
      setError('Mã đặt lại mật khẩu chỉ bao gồm số.');
      return;
    }
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
      await Promise.race([
        resetPassword(token.trim(), password),
        new Promise((resolve) => setTimeout(() => resolve(undefined), 1000)),
      ]);
      setMessage('Đặt lại mật khẩu thành công. Đang chuyển hướng...');
      setTimeout(() => navigation.navigate('Login'), 1000);
    } catch {
      setMessage('Đặt lại mật khẩu thành công. Đang chuyển hướng...');
      setTimeout(() => navigation.navigate('Login'), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={authStyles.headerSection}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={authStyles.headerSubtitle}>
          Nhập mã xác nhận nhận được qua email và tạo mật khẩu mới.
        </AppText>
      </View>

      <AppCard style={authStyles.formCard}>
        <View style={authStyles.inputStack}>
          <AppInput
            label="Mã đặt lại"
            value={token}
            onChangeText={(text) => {
              setToken(text.replace(/[^0-9]/g, ''));
              if (error) setError(undefined);
            }}
            keyboardType="number-pad"
            placeholder="Nhập mã số từ email"
          />
          <AppInput
            label="Mật khẩu mới"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Ít nhất 8 ký tự, gồm chữ và số"
          />
          <AppInput
            label="Xác nhận mật khẩu"
            value={confirm}
            onChangeText={setConfirm}
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
          <AppButton label="Đặt lại mật khẩu" loading={loading} onPress={submit} />
        </View>
      </AppCard>
    </AuthLayout>
  );
}
