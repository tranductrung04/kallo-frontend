import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import { ForgotPasswordScreen, LoginScreen, RegisterScreen, ResetPasswordScreen, WelcomeScreen } from '@/features/auth/screens/AuthScreens';
import { useTheme } from '@/theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();
export function AuthNavigator() {
  const theme = useTheme();
  return <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerStyle: { backgroundColor: theme.colors.surface }, headerTintColor: theme.colors.text, contentStyle: { backgroundColor: theme.colors.background } }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Tạo tài khoản' }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Quên mật khẩu' }} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Đặt lại mật khẩu' }} />
  </Stack.Navigator>;
}
