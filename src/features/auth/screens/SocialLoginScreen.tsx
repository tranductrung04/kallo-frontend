import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import Svg, { Line, Path, Rect } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { MoonIcon, SunIcon } from '@/components/icons';
import { AuthLightBackground } from './AuthLightBackground';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useAuth } from '../AuthProvider';

// Hoàn tất phiên redirect nếu đang quay lại từ trình duyệt đăng nhập
WebBrowser.maybeCompleteAuthSession();

type Props = NativeStackScreenProps<AuthStackParamList, 'SocialLogin'>;

const isIOS = Platform.OS === 'ios';

// ─── Vector Icons matching design ────────────────────────────────────────────

function CloseIcon({ color = '#FFFFFF' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" stroke={color} strokeWidth={2.2} strokeLinecap="round">
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

function AppleIcon({ isDark }: { isDark: boolean }) {
  return (
    <Image
      source={images.appleIcon}
      style={[styles.brandIcon, { tintColor: isDark ? '#FFFFFF' : '#000000' }]}
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

function EmailIcon({ color = '#FFFFFF' }: { color?: string }) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect width={20} height={16} x={2} y={4} rx={2} />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
}

// ─── Social Login Screen ─────────────────────────────────────────────────────

export function SocialLoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { signInWithGoogle, isDemoMode } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() || '';
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim() || webClientId;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim() || webClientId;

  // Fallback an toàn (không bao giờ để undefined) để useIdTokenAuthRequest không crash màn hình khi chưa có Client ID trong .env
  const fallbackClientId = 'kallo-google-auth-placeholder';

  // Cấu hình Google Auth Request lấy ID Token
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId || fallbackClientId,
    webClientId: webClientId || fallbackClientId,
    androidClientId: androidClientId || webClientId || fallbackClientId,
    iosClientId: iosClientId || webClientId || fallbackClientId,
  });

  // In ra Redirect URI chính xác để người dùng copy vào Google Cloud Console
  useEffect(() => {
    if (request?.redirectUri) {
      console.log('\n=======================================================');
      console.log('[Google OAuth] URI chuyển hướng cần thêm vào Google Cloud:');
      console.log(request.redirectUri);
      console.log('=======================================================\n');
    }
  }, [request?.redirectUri]);

  // Lắng nghe kết quả trả về từ Google OAuth
  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = (response as any).authentication?.idToken || response.params?.id_token;
      if (idToken) {
        setGoogleLoading(true);
        signInWithGoogle(idToken)
          .catch((err) => {
            console.error('[Google Sign-In] Backend verification failed:', err);
            // Tự động chuyển sang màn hình đăng nhập thường nếu xảy ra lỗi xác thực backend
            navigation.navigate('Login');
          })
          .finally(() => {
            setGoogleLoading(false);
          });
      } else if (response.params?.code) {
        // Đang đợi quá trình trao đổi Authorization Code lấy ID Token (PKCE auto-exchange)
        setGoogleLoading(true);
      } else {
        // Không nhận được idToken -> Tự động chuyển sang đăng nhập thường
        navigation.navigate('Login');
      }
    } else if (response.type === 'error') {
      console.warn('[Google Sign-In] OAuth error:', response.error);
      // Đăng nhập Google lỗi -> Tự động chuyển ngay sang đăng nhập thường
      navigation.navigate('Login');
    }
  }, [navigation, response, signInWithGoogle]);

  const handleAppleLogin = () => {
    Alert.alert(
      'Đăng nhập với Apple',
      'Tính năng đăng nhập với Apple đang được hoàn thiện. Bạn có muốn chuyển sang đăng nhập bằng tài khoản email/mật khẩu?',
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    // 1. Chế độ Demo: Đăng nhập giả lập ngay mà không cần gọi Google OAuth
    if (isDemoMode) {
      setGoogleLoading(true);
      try {
        await signInWithGoogle('demo-google-id-token');
      } catch {
        navigation.navigate('Login');
      } finally {
        setGoogleLoading(false);
      }
      return;
    }

    // 2. Chế độ Backend thật: Kích hoạt trực tiếp luồng đăng nhập Google
    try {
      setGoogleLoading(true);
      await promptAsync();
    } catch {
      navigation.navigate('Login');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = () => {
    navigation.navigate('Login');
  };

  const handleOpenTerms = () => {
    Alert.alert(
      'Điều khoản sử dụng',
      'Kallo cam kết bảo vệ quyền riêng tư và dữ liệu sức khỏe của người dùng. Mọi thông tin dinh dưỡng và calo chỉ mang tính chất tham khảo, hỗ trợ xây dựng lối sống lành mạnh.'
    );
  };

  const handleOpenPrivacy = () => {
    Alert.alert(
      'Chính sách bảo mật',
      'Dữ liệu cá nhân của bạn được mã hóa an toàn và chỉ sử dụng cho mục đích cá nhân hóa thực đơn và theo dõi sức khỏe theo quy định bảo mật của Kallo.'
    );
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderContent = () => (
    <>
      {/* Top Header with Theme Toggle & Close Button */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <Pressable
          onPress={theme.toggleScheme}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressed]}
        >
          {isDark ? <SunIcon size={20} color="#FACC15" /> : <MoonIcon size={20} color={theme.colors.brandPrimary} />}
        </Pressable>
        <Pressable
          onPress={handleClose}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          accessibilityRole="button"
          accessibilityLabel="Đóng"
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
        >
          <CloseIcon color={isDark ? '#FFFFFF' : theme.colors.textPrimary} />
        </Pressable>
      </View>

      {/* Center Content Body */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <AppText style={styles.title} color={isDark ? '#FFFFFF' : theme.colors.textPrimary}>
            Bắt đầu hành trình chăm sóc sức khoẻ{'\n'}của bạn với Kallo
          </AppText>
          <AppText style={styles.subtitle} color={isDark ? 'rgba(255, 255, 255, 0.72)' : theme.colors.textSecondary}>
            Đăng nhập vào Kallo thông qua các{'\n'}phương thức dưới đây
          </AppText>
        </View>

        {/* Social Buttons Stack */}
        <View style={styles.buttonsContainer}>
          {/* Apple Sign In — iOS only */}
          {isIOS && (
            <Pressable
              onPress={handleAppleLogin}
              accessibilityRole="button"
              accessibilityLabel="Tiếp tục với Apple"
              style={({ pressed }) => [
                styles.socialButton,
                isDark
                  ? styles.socialButtonDark
                  : [
                      styles.socialButtonLight,
                      {
                        backgroundColor: theme.colors.surfaceMid,
                        borderColor: theme.colors.surfaceBorder,
                      },
                      theme.shadows.level1,
                    ],
                pressed && styles.buttonPressed,
              ]}
            >
              <AppleIcon isDark={isDark} />
              <AppText style={styles.socialButtonText} color={isDark ? '#FFFFFF' : theme.colors.textPrimary}>
                Tiếp tục với Apple
              </AppText>
            </Pressable>
          )}

          {/* Google Sign In */}
          <Pressable
            onPress={handleGoogleLogin}
            disabled={googleLoading}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục với Google"
            style={({ pressed }) => [
              styles.socialButton,
              isDark
                ? styles.socialButtonDark
                : [
                    styles.socialButtonLight,
                    {
                      backgroundColor: theme.colors.surfaceMid,
                      borderColor: theme.colors.surfaceBorder,
                    },
                    theme.shadows.level1,
                  ],
              pressed && styles.buttonPressed,
              googleLoading && { opacity: 0.6 },
            ]}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={isDark ? '#FFFFFF' : theme.colors.brandPrimary} />
            ) : (
              <>
                <GoogleIcon />
                <AppText style={styles.socialButtonText} color={isDark ? '#FFFFFF' : theme.colors.textPrimary}>
                  Tiếp tục với Google
                </AppText>
              </>
            )}
          </Pressable>

          {/* Email Sign In */}
          <Pressable
            onPress={handleEmailLogin}
            accessibilityRole="button"
            accessibilityLabel="Tiếp tục với Email"
            style={({ pressed }) => [
              styles.socialButton,
              isDark
                ? styles.socialButtonDark
                : [
                    styles.socialButtonLight,
                    {
                      backgroundColor: theme.colors.surfaceMid,
                      borderColor: theme.colors.surfaceBorder,
                    },
                    theme.shadows.level1,
                  ],
              pressed && styles.buttonPressed,
            ]}
          >
            <EmailIcon color={isDark ? '#FFFFFF' : theme.colors.textPrimary} />
            <AppText style={styles.socialButtonText} color={isDark ? '#FFFFFF' : theme.colors.textPrimary}>
              Tiếp tục với Email
            </AppText>
          </Pressable>
        </View>

        {/* Terms & Privacy */}
        <View style={styles.termsContainer}>
          <AppText style={styles.termsText} color={isDark ? 'rgba(255, 255, 255, 0.65)' : theme.colors.textSecondary}>
            Bằng việc tiếp tục, bạn đã đồng ý với
          </AppText>
          <View style={styles.termsLinks}>
            <Pressable
              onPress={handleOpenTerms}
              accessibilityRole="link"
              accessibilityLabel="Điều khoản sử dụng"
              style={({ pressed }) => pressed && styles.pressed}
            >
              <AppText style={styles.termsLink} color={isDark ? '#B488FC' : theme.colors.brandPrimary}>
                Điều khoản sử dụng
              </AppText>
            </Pressable>
            <AppText style={styles.termsText} color={isDark ? 'rgba(255, 255, 255, 0.65)' : theme.colors.textSecondary}>
              {' '}và{' '}
            </AppText>
            <Pressable
              onPress={handleOpenPrivacy}
              accessibilityRole="link"
              accessibilityLabel="Chính sách bảo mật"
              style={({ pressed }) => pressed && styles.pressed}
            >
              <AppText style={styles.termsLink} color={isDark ? '#B488FC' : theme.colors.brandPrimary}>
                Chính sách bảo mật
              </AppText>
            </Pressable>
          </View>
        </View>

        {/* Don't have an account -> Navigate to Register screen */}
        <Pressable
          onPress={() => navigation.navigate('Register')}
          accessibilityRole="button"
          accessibilityLabel="Chưa có tài khoản? Đăng ký ngay"
          style={({ pressed }) => [
            styles.existingAccountButton,
            pressed && styles.pressed,
          ]}
        >
          <AppText style={styles.existingAccountText} color={isDark ? 'rgba(255, 255, 255, 0.75)' : theme.colors.textSecondary}>
            Chưa có tài khoản?{' '}
            <AppText style={styles.existingAccountLink} color={isDark ? '#B488FC' : theme.colors.brandPrimary}>
              Đăng ký ngay
            </AppText>
          </AppText>
        </Pressable>
      </View>

      {/* App Version at Bottom */}
      <View style={[styles.versionContainer, { paddingBottom: Math.max(insets.bottom + 8, 18) }]}>
        <AppText style={styles.versionText} color={isDark ? 'rgba(255, 255, 255, 0.42)' : theme.colors.textDisabled}>
          Phiên bản: 1.6.11 (394)
        </AppText>
      </View>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#13101F' : '#EDE9FA' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {isDark ? (
        <ImageBackground
          source={images.loginBackground}
          style={styles.background}
          resizeMode="cover"
        >
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={styles.background}>
          <AuthLightBackground />
          {renderContent()}
        </View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Header with Theme Toggle & Close button
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    zIndex: 10,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  socialButtonDark: {
    backgroundColor: '#272338',
  },
  socialButtonLight: {
    borderWidth: 1,
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
