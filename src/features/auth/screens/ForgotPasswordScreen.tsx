import React, { useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { getApiErrorMessage, requestPasswordReset } from '../api';
import { AuthLayout, authStyles, emailPattern } from './AuthLayout';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!emailPattern.test(email.trim())) {
      setError('Email không đúng định dạng.');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await requestPasswordReset(email.trim());
      navigation.navigate('ResetPassword', { email: email.trim() });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={authStyles.headerSection}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={authStyles.headerSubtitle}>
          Nhập email của bạn để nhận mã đặt lại mật khẩu có hiệu lực 15 phút.
        </AppText>
      </View>

      <AppCard style={authStyles.formCard}>
        <View style={authStyles.inputStack}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
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
            <AppText variant="bodySm" color={theme.colors.error}>
              {error}
            </AppText>
          </View>
        ) : null}

        <View style={authStyles.buttonStack}>
          <AppButton label="Gửi yêu cầu đặt lại" loading={loading} onPress={submit} />
        </View>
      </AppCard>
    </AuthLayout>
  );
}
