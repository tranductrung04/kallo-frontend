import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '../AuthProvider';
import { getApiErrorMessage, requestPasswordReset, resetPassword } from '../api';
import { LOCAL_ACCOUNT, LOCAL_DEMO_ENABLED } from '../localAccount';

type Props<Route extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, Route>;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function passwordError(password: string) { return password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password) ? 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số.' : undefined; }
function AuthLayout({ children }: React.PropsWithChildren) { const theme = useTheme(); return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.safe, { backgroundColor: theme.colors.background }]}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView></KeyboardAvoidingView>; }

export { OnboardingCarouselScreen, OnboardingCarouselScreen as WelcomeScreen } from './OnboardingCarouselScreen';

export function LoginScreen({ navigation }: Props<'Login'>) {
  const { signIn } = useAuth(); const [email, setEmail] = useState(LOCAL_DEMO_ENABLED ? LOCAL_ACCOUNT.email : ''); const [password, setPassword] = useState(LOCAL_DEMO_ENABLED ? LOCAL_ACCOUNT.password : ''); const [error, setError] = useState<string>(); const [loading, setLoading] = useState(false);
  const submit = async () => { if (!emailPattern.test(email.trim())) { setError('Email không đúng định dạng.'); return; } const passwordMessage = passwordError(password); if (passwordMessage) { setError(passwordMessage); return; } setError(undefined); setLoading(true); try { await signIn(email.trim(), password); } catch (requestError) { setError(getApiErrorMessage(requestError)); } finally { setLoading(false); } };
  const useDemo = () => { setEmail(LOCAL_ACCOUNT.email); setPassword(LOCAL_ACCOUNT.password); setError(undefined); };
  return <AuthLayout><AppText variant="title">Chào mừng trở lại</AppText><AppText color="#607168">Đăng nhập để tiếp tục hành trình sức khỏe.</AppText><AppCard><AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" /><AppInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="Nhập mật khẩu" />{error ? <AppText variant="caption" color="#D63031" accessibilityLiveRegion="polite">{error}</AppText> : null}<AppButton label="Đăng nhập" loading={loading} onPress={submit} />{LOCAL_DEMO_ENABLED ? <AppButton label="Dùng tài khoản mặc định" variant="secondary" onPress={useDemo} accessibilityLabel="Điền tài khoản mặc định" /> : null}<AppButton label="Quên mật khẩu?" variant="ghost" onPress={() => navigation.navigate('ForgotPassword')} /></AppCard><AppText align="center" color="#607168">Hoặc</AppText><AppButton label="Đăng nhập bằng Google" variant="outline" onPress={() => setError('Đăng nhập Google cần cấu hình OAuth2 của ứng dụng.')} /><AppButton label="Tạo tài khoản mới" variant="secondary" onPress={() => navigation.navigate('Register')} /></AuthLayout>;
}

export function RegisterScreen({ navigation }: Props<'Register'>) {
  const { signUp } = useAuth(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [error, setError] = useState<string>(); const [loading, setLoading] = useState(false);
  const submit = async () => { if (!name.trim()) { setError('Vui lòng nhập tên hiển thị.'); return; } if (!emailPattern.test(email.trim())) { setError('Email không đúng định dạng.'); return; } const passwordMessage = passwordError(password); if (passwordMessage) { setError(passwordMessage); return; } if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; } setError(undefined); setLoading(true); try { await signUp(email.trim(), password, name.trim()); } catch (requestError) { setError(getApiErrorMessage(requestError)); } finally { setLoading(false); } };
  return <AuthLayout><AppText variant="title">Tạo tài khoản</AppText><AppText color="#607168">Bắt đầu thiết lập hồ sơ sức khỏe cá nhân.</AppText><AppCard><AppInput label="Tên hiển thị" value={name} onChangeText={setName} placeholder="Tên của bạn" /><AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" /><AppInput label="Mật khẩu" value={password} onChangeText={setPassword} secureTextEntry placeholder="Ít nhất 8 ký tự" /><AppInput label="Xác nhận mật khẩu" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Nhập lại mật khẩu" />{error ? <AppText variant="caption" color="#D63031" accessibilityLiveRegion="polite">{error}</AppText> : null}<AppButton label="Đăng ký" loading={loading} onPress={submit} /></AppCard><AppButton label="Đăng nhập" variant="ghost" onPress={() => navigation.navigate('Login')} /></AuthLayout>;
}

export function ForgotPasswordScreen({ navigation }: Props<'ForgotPassword'>) {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState<string>(); const [error, setError] = useState<string>(); const [loading, setLoading] = useState(false);
  const submit = async () => { if (!emailPattern.test(email.trim())) { setError('Email không đúng định dạng.'); return; } setError(undefined); setLoading(true); try { await requestPasswordReset(email.trim()); setMessage('Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.'); } catch (requestError) { setError(getApiErrorMessage(requestError)); } finally { setLoading(false); } };
  return <AuthLayout><AppText variant="title">Quên mật khẩu?</AppText><AppText color="#607168">Nhập email để nhận liên kết đặt lại mật khẩu có hiệu lực 15 phút.</AppText><AppCard><AppInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />{message ? <AppText color="#27AE60">{message}</AppText> : null}{error ? <AppText variant="caption" color="#D63031">{error}</AppText> : null}<AppButton label="Gửi yêu cầu" loading={loading} onPress={submit} /></AppCard><AppButton label="Quay lại đăng nhập" variant="ghost" onPress={() => navigation.navigate('Login')} /><AppButton label="Đã có mã đặt lại?" variant="outline" onPress={() => navigation.navigate('ResetPassword')} /></AuthLayout>;
}

export function ResetPasswordScreen({ navigation, route }: Props<'ResetPassword'>) {
  const [token, setToken] = useState(route.params?.token ?? ''); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [message, setMessage] = useState<string>(); const [error, setError] = useState<string>(); const [loading, setLoading] = useState(false);
  const submit = async () => { const passwordMessage = passwordError(password); if (!token.trim()) { setError('Vui lòng nhập mã đặt lại mật khẩu.'); return; } if (passwordMessage) { setError(passwordMessage); return; } if (password !== confirm) { setError('Mật khẩu xác nhận không khớp.'); return; } setError(undefined); setLoading(true); try { await resetPassword(token.trim(), password); setMessage('Đặt lại mật khẩu thành công.'); setTimeout(() => navigation.navigate('Login'), 800); } catch (requestError) { setError(getApiErrorMessage(requestError)); } finally { setLoading(false); } };
  return <AuthLayout><AppText variant="title">Đặt lại mật khẩu</AppText><AppCard><AppInput label="Mã đặt lại" value={token} onChangeText={setToken} placeholder="Nhập mã trong email" /><AppInput label="Mật khẩu mới" value={password} onChangeText={setPassword} secureTextEntry /><AppInput label="Xác nhận mật khẩu" value={confirm} onChangeText={setConfirm} secureTextEntry />{message ? <AppText color="#27AE60">{message}</AppText> : null}{error ? <AppText variant="caption" color="#D63031">{error}</AppText> : null}<AppButton label="Đặt lại mật khẩu" loading={loading} onPress={submit} /></AppCard></AuthLayout>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 20, gap: 18, flexGrow: 1 }, welcome: { flex: 1, justifyContent: 'center', gap: 14 }, welcomeImage: { width: '100%', height: 280 }, dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 8 }, dot: { width: 8, height: 8, borderRadius: 4 } });
