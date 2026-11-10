import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '../AuthProvider';
import { getApiErrorMessage, requestPasswordReset, resetPassword } from '../api';
import { LOCAL_ACCOUNT, LOCAL_DEMO_ENABLED } from '../localAccount';

type Props<Route extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, Route>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordError(password: string) {
  return password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)
    ? 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.'
    : undefined;
}

function AuthLayout({ children }: React.PropsWithChildren) {
  const theme = useTheme();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export { OnboardingCarouselScreen, OnboardingCarouselScreen as WelcomeScreen } from './OnboardingCarouselScreen';

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────

export function LoginScreen({ navigation }: Props<'Login'>) {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState(LOCAL_DEMO_ENABLED ? LOCAL_ACCOUNT.email : '');
  const [password, setPassword] = useState(LOCAL_DEMO_ENABLED ? LOCAL_ACCOUNT.password : '');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!emailPattern.test(email.trim())) {
      setError('Email không đúng định dạng.');
      return;
    }
    const passwordMessage = passwordError(password);
    if (passwordMessage) {
      setError(passwordMessage);
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

  const useDemo = () => {
    setEmail(LOCAL_ACCOUNT.email);
    setPassword(LOCAL_ACCOUNT.password);
    setError(undefined);
  };

  return (
    <AuthLayout>
      {/* Header */}
      <View style={styles.headerSection}>
        <AppText variant="headlineLg" style={styles.headerTitle}>
          Chào mừng trở lại
        </AppText>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.headerSubtitle}>
          Đăng nhập để tiếp tục hành trình chăm sóc sức khoẻ cùng Kallo.
        </AppText>
      </View>

      {/* Main Form Card */}
      <AppCard style={styles.formCard}>
        {/* Input Fields */}
        <View style={styles.inputStack}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            testID="login-email-input"
          />

          <View style={styles.passwordFieldContainer}>
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
                styles.forgotPasswordPressable,
                pressed && styles.linkPressed,
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
              styles.errorBanner,
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
              style={styles.errorBannerText}
            >
              {error}
            </AppText>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.buttonStack}>
          <AppButton
            label="Đăng nhập"
            loading={loading}
            onPress={submit}
            testID="login-submit-button"
          />

          {LOCAL_DEMO_ENABLED ? (
            <AppButton
              label="⚡ Dùng tài khoản mặc định"
              variant="secondary"
              onPress={useDemo}
              accessibilityLabel="Điền tài khoản mặc định"
            />
          ) : null}
        </View>
      </AppCard>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.surfaceBorder }]} />
        <AppText variant="bodySm" color={theme.colors.textSecondary} style={styles.dividerText}>
          Hoặc
        </AppText>
        <View style={[styles.dividerLine, { backgroundColor: theme.colors.surfaceBorder }]} />
      </View>

      {/* Secondary Actions */}
      <View style={styles.secondaryActions}>
        <AppButton
          label="Đăng nhập bằng Mạng xã hội"
          variant="outline"
          onPress={() => navigation.navigate('SocialLogin')}
          accessibilityLabel="Chuyển đến màn hình đăng nhập mạng xã hội"
        />
      </View>

      {/* Footer / Switch Screen */}
      <View style={styles.footerRow}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary}>
          Chưa có tài khoản?{' '}
        </AppText>
        <Pressable
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
          accessibilityLabel="Tạo tài khoản mới"
          style={({ pressed }) => pressed && styles.linkPressed}
        >
          <AppText variant="labelLg" color={theme.colors.brandPrimary} style={styles.underlinedLink}>
            Đăng ký ngay
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

// ─── REGISTER SCREEN ──────────────────────────────────────────────────────────

export function RegisterScreen({ navigation }: Props<'Register'>) {
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
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <View style={styles.headerSection}>
        <AppText variant="headlineLg" style={styles.headerTitle}>
          Tạo tài khoản
        </AppText>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.headerSubtitle}>
          Bắt đầu thiết lập hồ sơ sức khỏe cá nhân của bạn.
        </AppText>
      </View>

      {/* Form Card */}
      <AppCard style={styles.formCard}>
        <View style={styles.inputStack}>
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
              styles.errorBanner,
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
              style={styles.errorBannerText}
            >
              {error}
            </AppText>
          </View>
        ) : null}

        <View style={styles.buttonStack}>
          <AppButton
            label="Đăng ký tài khoản"
            loading={loading}
            onPress={submit}
            testID="register-submit-button"
          />
        </View>
      </AppCard>

      {/* Footer */}
      <View style={styles.footerRow}>
        <AppText variant="bodyMd" color={theme.colors.textSecondary}>
          Đã có tài khoản?{' '}
        </AppText>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập"
          style={({ pressed }) => pressed && styles.linkPressed}
        >
          <AppText variant="labelLg" color={theme.colors.brandPrimary} style={styles.underlinedLink}>
            Đăng nhập
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

// ─── FORGOT PASSWORD SCREEN ───────────────────────────────────────────────────

export function ForgotPasswordScreen({ navigation }: Props<'ForgotPassword'>) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string>();
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
      setMessage('Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={styles.headerSection}>
        <AppText variant="headlineLg" style={styles.headerTitle}>
          Quên mật khẩu?
        </AppText>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.headerSubtitle}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu có hiệu lực 15 phút.
        </AppText>
      </View>

      <AppCard style={styles.formCard}>
        <View style={styles.inputStack}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
        </View>

        {message ? (
          <View
            style={[
              styles.errorBanner,
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
              styles.errorBanner,
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

        <View style={styles.buttonStack}>
          <AppButton label="Gửi yêu cầu đặt lại" loading={loading} onPress={submit} />
        </View>
      </AppCard>

      <View style={styles.secondaryActions}>
        <AppButton
          label="Đã có mã đặt lại mật khẩu?"
          variant="outline"
          onPress={() => navigation.navigate('ResetPassword')}
        />
      </View>

      <View style={styles.footerRow}>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Quay lại đăng nhập"
          style={({ pressed }) => pressed && styles.linkPressed}
        >
          <AppText variant="labelLg" color={theme.colors.brandPrimary} style={styles.underlinedLink}>
            ← Quay lại đăng nhập
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

// ─── RESET PASSWORD SCREEN ───────────────────────────────────────────────────

export function ResetPasswordScreen({ navigation, route }: Props<'ResetPassword'>) {
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
      await resetPassword(token.trim(), password);
      setMessage('Đặt lại mật khẩu thành công. Đang chuyển hướng...');
      setTimeout(() => navigation.navigate('Login'), 1000);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={styles.headerSection}>
        <AppText variant="headlineLg" style={styles.headerTitle}>
          Đặt lại mật khẩu
        </AppText>
        <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.headerSubtitle}>
          Nhập mã xác nhận nhận được qua email và tạo mật khẩu mới.
        </AppText>
      </View>

      <AppCard style={styles.formCard}>
        <View style={styles.inputStack}>
          <AppInput
            label="Mã đặt lại"
            value={token}
            onChangeText={setToken}
            placeholder="Nhập mã từ email"
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
              styles.errorBanner,
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
              styles.errorBanner,
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

        <View style={styles.buttonStack}>
          <AppButton label="Đặt lại mật khẩu" loading={loading} onPress={submit} />
        </View>
      </AppCard>

      <View style={styles.footerRow}>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          accessibilityRole="button"
          accessibilityLabel="Quay lại đăng nhập"
          style={({ pressed }) => pressed && styles.linkPressed}
        >
          <AppText variant="labelLg" color={theme.colors.brandPrimary} style={styles.underlinedLink}>
            ← Quay lại đăng nhập
          </AppText>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    lineHeight: 22,
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

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    letterSpacing: 0.2,
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
