import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator, type NativeStackHeaderProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import {
  ForgotPasswordScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  SocialLoginScreen,
  VerifyOtpScreen,
  WelcomeScreen,
} from '@/features/auth/screens';
import { AppText } from '@/components/common';
import { ChevronLeftIcon, MoonIcon, SunIcon } from '@/components/icons';
import { useTheme } from '@/theme';

function AuthHeader({ navigation, options, route, back }: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const title = options.title ?? route.name;
  const canGoBack = Boolean(back) || navigation.canGoBack();
  const isDark = theme.scheme === 'dark';

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 10), backgroundColor: isDark ? theme.colors.canvasBase : '#FFFFFF' }]}>
      <View style={styles.headerRow}>
        {canGoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            style={({ pressed }) => [
              styles.headerButton,
              pressed && styles.headerButtonPressed,
            ]}
          >
            <ChevronLeftIcon size={20} color={theme.colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <AppText style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
          {title}
        </AppText>

        <Pressable
          onPress={theme.toggleScheme}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          {isDark ? (
            <SunIcon size={20} color="#FACC15" />
          ) : (
            <MoonIcon size={20} color={theme.colors.brandPrimary} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const screenBg = isDark ? theme.colors.canvasBase : '#FFFFFF';

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        header: (props) => <AuthHeader {...props} />,
        contentStyle: { backgroundColor: screenBg },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="SocialLogin"
        component={SocialLoginScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: screenBg },
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Tạo tài khoản' }} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ title: 'Xác thực tài khoản' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Quên mật khẩu' }} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Đặt lại mật khẩu' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  headerRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonPressed: {
    opacity: 0.6,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
});
