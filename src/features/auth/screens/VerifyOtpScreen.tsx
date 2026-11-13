import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '../AuthProvider';
import { getApiErrorMessage } from '../api';
import { AuthLayout, authStyles } from './AuthLayout';

type Props = NativeStackScreenProps<AuthStackParamList, 'VerifyOtp'>;

export function VerifyOtpScreen({ route }: Props) {
  const theme = useTheme();
  const { verifyOtp, resendOtp } = useAuth();
  const isDark = theme.scheme === 'dark';
  const email = route.params?.email ?? '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRef = useRef<TextInput>(null);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (codeToVerify?: string) => {
    const finalOtp = codeToVerify ?? otp;
    if (finalOtp.length < 6) {
      setError('Vui lòng nhập đủ 6 chữ số mã xác thực.');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await verifyOtp(email, finalOtp);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError(undefined);
    setResendSuccess(false);
    try {
      await resendOtp(email);
      setResendSuccess(true);
      setCountdown(60);
      setOtp('');
      inputRef.current?.focus();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(cleaned);
    if (error) setError(undefined);
    if (cleaned.length === 6) {
      void handleVerify(cleaned);
    }
  };

  return (
    <AuthLayout>
      {/* Header section */}
      <View style={authStyles.headerSection}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={authStyles.headerSubtitle}>
          Nhập mã xác thực gồm 6 chữ số đã được gửi tới email của bạn:
        </AppText>
        <View
          style={[
            styles.emailBadge,
            {
              backgroundColor: isDark ? 'rgba(158, 100, 247, 0.15)' : '#EDE5FF',
              borderColor: isDark ? 'rgba(158, 100, 247, 0.3)' : '#D8C5FD',
            },
          ]}
        >
          <AppText variant="labelMd" color={theme.colors.brandPrimary} style={styles.emailText}>
            {email || 'you@example.com'}
          </AppText>
        </View>
      </View>

      {/* Main card with OTP input */}
      <AppCard style={authStyles.formCard}>
        {/* Hidden TextInput for keyboard input */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={handleOtpChange}
          keyboardType="number-pad"
          maxLength={6}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
          style={styles.hiddenInput}
          accessibilityLabel="Nhập mã xác thực OTP 6 số"
        />

        {/* 6 Visual OTP Digits Boxes */}
        <Pressable
          onPress={() => inputRef.current?.focus()}
          accessibilityRole="button"
          accessibilityLabel="Bấm để nhập mã OTP"
          style={styles.otpContainer}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const digit = otp[index] ?? '';
            const isActive = isFocused && (index === otp.length || (index === 5 && otp.length === 6));
            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: isDark ? theme.colors.surfaceHigh : theme.colors.surfaceMid,
                    borderColor: isActive
                      ? theme.colors.brandPrimary
                      : digit
                        ? theme.colors.brandSecondary
                        : theme.colors.surfaceBorder,
                  },
                  isActive && styles.otpBoxActive,
                ]}
              >
                <AppText style={[styles.otpDigit, { color: theme.colors.textPrimary }]}>
                  {digit}
                </AppText>
              </View>
            );
          })}
        </Pressable>

        {/* Resend status feedback */}
        {resendSuccess && (
          <View
            style={[
              authStyles.errorBanner,
              {
                backgroundColor: isDark ? 'rgba(34, 197, 94, 0.12)' : '#DCFCE7',
                borderColor: isDark ? 'rgba(34, 197, 94, 0.35)' : '#86EFAC',
              },
            ]}
          >
            <AppText variant="bodySm" color={isDark ? '#4ADE80' : '#15803D'} style={styles.centerText}>
              Đã gửi lại mã OTP mới. Vui lòng kiểm tra hòm thư!
            </AppText>
          </View>
        )}

        {/* Error Feedback */}
        {error ? (
          <View
            style={[
              authStyles.errorBanner,
              {
                backgroundColor: isDark ? 'rgba(255, 90, 95, 0.12)' : '#FEE2E2',
                borderColor: isDark ? 'rgba(255, 90, 95, 0.35)' : '#FCA5A5',
              },
            ]}
          >
            <AppText
              variant="bodySm"
              color={theme.colors.error}
              accessibilityLiveRegion="polite"
              style={styles.centerText}
            >
              {error}
            </AppText>
          </View>
        ) : null}

        {/* Action Button */}
        <View style={authStyles.buttonStack}>
          <AppButton
            label="Xác thực & Tiếp tục"
            loading={loading}
            disabled={otp.length < 6}
            onPress={() => handleVerify()}
            testID="verify-otp-button"
          />
        </View>

        {/* Resend OTP timer */}
        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <AppText variant="bodySm" color={theme.colors.textSecondary}>
              Gửi lại mã sau{' '}
              <AppText variant="labelMd" color={theme.colors.brandPrimary}>
                {countdown}s
              </AppText>
            </AppText>
          ) : (
            <Pressable
              onPress={handleResend}
              accessibilityRole="button"
              accessibilityLabel="Gửi lại mã xác thực OTP"
              style={({ pressed }) => pressed && authStyles.linkPressed}
            >
              <AppText variant="bodySm" color={theme.colors.textSecondary}>
                Chưa nhận được mã?{' '}
                <AppText variant="labelMd" color={theme.colors.brandPrimary} style={authStyles.underlinedLink}>
                  Gửi lại ngay
                </AppText>
              </AppText>
            </Pressable>
          )}
        </View>
      </AppCard>

    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  emailBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
  },
  emailText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    transform: [{ scale: 1.05 }],
  },
  otpDigit: {
    fontSize: 22,
    fontWeight: '700',
  },
  centerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  resendRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    paddingVertical: 4,
  },
  helperSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  helperText: {
    textAlign: 'center',
    lineHeight: 18,
  },
});

