import React from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Path } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'SocialLogin'>;

const isIOS = Platform.OS === 'ios';

// ─── Vector Icons matching design ────────────────────────────────────────────

function CloseIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Image
      source={images.appleIcon}
      style={styles.brandIcon}
      resizeMode="contain"
    />
  );
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

function FacebookIcon() {
  return (
    <Image
      source={images.facebookIcon}
      style={styles.brandIcon}
      resizeMode="contain"
    />
  );
}

// ─── Social Login Screen ─────────────────────────────────────────────────────

export function SocialLoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const handleAppleLogin = () => {
    Alert.alert(
      'Đăng nhập với Apple',
      'Tính năng đăng nhập với mạng xã hội đang được hoàn thiện. Bạn có muốn chuyển sang đăng nhập bằng tài khoản email/mật khẩu?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Đăng nhập với Google',
      'Tính năng đăng nhập với mạng xã hội đang được hoàn thiện. Bạn có muốn chuyển sang đăng nhập bằng tài khoản email/mật khẩu?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  const handleFacebookLogin = () => {
    Alert.alert(
      'Đăng nhập với Facebook',
      'Tính năng đăng nhập với mạng xã hội đang được hoàn thiện. Bạn có muốn chuyển sang đăng nhập bằng tài khoản email/mật khẩu?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ImageBackground
        source={images.loginBackground}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top Header with Close Button */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            accessibilityRole="button"
            accessibilityLabel="Đóng"
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <CloseIcon />
          </Pressable>
        </View>

        {/* Center Content Body */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <AppText style={styles.title} color="#FFFFFF">
              Bắt đầu hành trình chăm sóc sức khoẻ{'\n'}của bạn với Kallo
            </AppText>
            <AppText style={styles.subtitle} color="rgba(255, 255, 255, 0.72)">
              Đăng nhập vào Kallo thông qua tài khoản{'\n'}mạng xã hội dưới đây
            </AppText>
          </View>

          {/* Social Buttons Stack */}
          <View style={styles.buttonsContainer}>
            {/* Apple Sign In — iOS only (Android excluded per requirement) */}
            {isIOS && (
              <Pressable
                onPress={handleAppleLogin}
                accessibilityRole="button"
                accessibilityLabel="Tiếp tục với Apple"
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <AppleIcon />
                <AppText style={styles.socialButtonText} color="#FFFFFF">
                  Tiếp tục với Apple
                </AppText>
              </Pressable>
            )}

            {/* Google Sign In */}
            <Pressable
              onPress={handleGoogleLogin}
              accessibilityRole="button"
              accessibilityLabel="Tiếp tục với Google"
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <GoogleIcon />
              <AppText style={styles.socialButtonText} color="#FFFFFF">
                Tiếp tục với Google
              </AppText>
            </Pressable>

            {/* Facebook Sign In */}
            <Pressable
              onPress={handleFacebookLogin}
              accessibilityRole="button"
              accessibilityLabel="Tiếp tục với Facebook"
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <FacebookIcon />
              <AppText style={styles.socialButtonText} color="#FFFFFF">
                Tiếp tục với Facebook
              </AppText>
            </Pressable>
          </View>

          {/* Terms & Privacy */}
          <View style={styles.termsContainer}>
            <AppText style={styles.termsText} color="rgba(255, 255, 255, 0.65)">
              Bằng việc tiếp tục, bạn đã đồng ý với
            </AppText>
            <View style={styles.termsLinks}>
              <Pressable
                onPress={() => {/* Open Terms */}}
                accessibilityRole="link"
                accessibilityLabel="Điều khoản sử dụng"
                style={({ pressed }) => pressed && styles.pressed}
              >
                <AppText style={styles.termsLink} color="#A57BF5">
                  Điều khoản sử dụng
                </AppText>
              </Pressable>
              <AppText style={styles.termsText} color="rgba(255, 255, 255, 0.65)">
                {' '}và{' '}
              </AppText>
              <Pressable
                onPress={() => {/* Open Privacy Policy */}}
                accessibilityRole="link"
                accessibilityLabel="Chính sách bảo mật"
                style={({ pressed }) => pressed && styles.pressed}
              >
                <AppText style={styles.termsLink} color="#A57BF5">
                  Chính sách bảo mật
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* Already have an account -> Navigate to old login screen */}
          <Pressable
            onPress={() => navigation.navigate('Login')}
            accessibilityRole="button"
            accessibilityLabel="Đã có tài khoản? Đăng nhập"
            style={({ pressed }) => [
              styles.existingAccountButton,
              pressed && styles.pressed,
            ]}
          >
            <AppText style={styles.existingAccountText} color="rgba(255, 255, 255, 0.75)">
              Đã có tài khoản?{' '}
              <AppText style={styles.existingAccountLink} color="#B488FC">
                Đăng nhập
              </AppText>
            </AppText>
          </Pressable>
        </View>

        {/* App Version at Bottom */}
        <View style={[styles.versionContainer, { paddingBottom: Math.max(insets.bottom + 8, 18) }]}>
          <AppText style={styles.versionText} color="rgba(255, 255, 255, 0.42)">
            Phiên bản: 1.6.11 (394)
          </AppText>
        </View>
      </ImageBackground>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#13101F',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Close button (clean minimalist cross matching design)
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 22,
    zIndex: 10,
  },
  closeButton: {
    padding: 6,
  },

  // Main Content
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 5,
  },

  // Title Section
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    lineHeight: 31,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
  },

  // Social Buttons
  buttonsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#272338',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  socialButtonText: {
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Brand icons
  brandIcon: {
    width: 20,
    height: 20,
  },

  // Terms & Policy
  termsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  termsLink: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },

  // Already have account
  existingAccountButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  existingAccountText: {
    fontSize: 13.5,
    fontWeight: '400',
  },
  existingAccountLink: {
    fontSize: 13.5,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  pressed: {
    opacity: 0.65,
  },

  // Version
  versionContainer: {
    alignItems: 'center',
    zIndex: 5,
  },
  versionText: {
    fontSize: 11.5,
    fontWeight: '400',
  },
});
