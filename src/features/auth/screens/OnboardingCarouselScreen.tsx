import React, { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { MoonIcon, SunIcon } from '@/components/icons';
import { AuthLightBackground } from './AuthLightBackground';
import {
  ChampionMascotRNPro,
  KalloWelcome2Mascot,
  KalloWelcome3Mascot,
} from '@/features/onboarding/components';
import type { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export interface OnboardingSlideItem {
  id: string;
  image: (typeof images)[keyof typeof images];
  title: string;
  subtitle: string;
}

export const ONBOARDING_SLIDES: OnboardingSlideItem[] = [
  {
    id: 'top1_app',
    image: images.welcome1,
    title: 'Ứng dụng dinh dưỡng top #1\nApp Store',
    subtitle: 'Ứng dụng cá nhân hoá món ăn, thói quen và lối sống dành cho người Việt.',
  },
  {
    id: 'nutrition_calc',
    image: images.welcome2,
    title: 'Tính calo và dinh dưỡng\nmón Việt cực chuẩn',
    subtitle: 'Theo đúng cách nấu & khẩu phần bạn chọn',
  },
  {
    id: 'community_expert',
    image: images.welcome3,
    title: 'Có cộng đồng &\nchuyên gia dinh dưỡng',
    subtitle: 'Đồng hành cùng bạn mỗi ngày',
  },
];

export function OnboardingCarouselScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { width, height } = useWindowDimensions();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / width);
    if (pageIndex >= 0 && pageIndex < ONBOARDING_SLIDES.length) {
      setActiveSlide(pageIndex);
    }
  };

  const handleDotPress = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveSlide(index);
  };

  const handleNext = () => {
    if (activeSlide < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = activeSlide + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveSlide(nextIndex);
    } else {
      navigation.navigate('SocialLogin');
    }
  };

  // Chiều cao khu vực minh họa co dãn tỷ lệ theo màn hình
  const illustrationHeight = Math.min(Math.max(height * 0.34, 220), 310);
  const mascot1Size = Math.min(illustrationHeight / 1.04, width * 0.72, 280);
  const mascotSquareSize = Math.min(illustrationHeight, width * 0.74, 290);

  const renderIllustration = (index: number) => {
    switch (index) {
      case 0:
        return (
          <ChampionMascotRNPro
            size={mascot1Size}
            mode="idle"
            interactive={true}
            accessibilityLabel="Linh vật Champion Kallo với hiệu ứng động"
          />
        );
      case 1:
        return (
          <KalloWelcome2Mascot
            size={mascotSquareSize}
            mode="idle"
            interactive={true}
            accessibilityLabel="Linh vật Kallo tính calo và dinh dưỡng món Việt"
          />
        );
      case 2:
        return (
          <KalloWelcome3Mascot
            size={mascotSquareSize}
            mode="idle"
            interactive={true}
            accessibilityLabel="Linh vật Kallo chuyên gia dinh dưỡng"
          />
        );
      default:
        return null;
    }
  };

  const isLastSlide = activeSlide === ONBOARDING_SLIDES.length - 1;
  const buttonLabel = isLastSlide ? 'Bắt đầu ngay' : 'Tiếp tục';

  const renderContent = () => (
    <>
      {/* Top Header with Kallo Logo & Theme Toggle */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={styles.headerSpacer} />
        <Image
          source={isDark ? images.logoWhite : images.kalloLogo}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Kallo"
        />
        <Pressable
          onPress={theme.toggleScheme}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          accessibilityRole="button"
          accessibilityLabel={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          style={({ pressed }) => [styles.themeButton, pressed && styles.pressed]}
        >
          {isDark ? <SunIcon size={20} color="#FACC15" /> : <MoonIcon size={20} color={theme.colors.brandPrimary} />}
        </Pressable>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
      >
        {ONBOARDING_SLIDES.map((slide, index) => {
          return (
            <View key={slide.id} style={[styles.slide, { width }]}>
              {/* Illustration Area */}
              <View style={[styles.illustrationContainer, { height: illustrationHeight }]}>
                {renderIllustration(index)}
              </View>

              {/* Text Area */}
              <View style={styles.textContainer}>
                <AppText style={[styles.title, { color: isDark ? '#FFFFFF' : theme.colors.textPrimary }]}>
                  {slide.title}
                </AppText>
                <AppText style={[styles.subtitle, { color: isDark ? 'rgba(255, 255, 255, 0.72)' : theme.colors.textSecondary }]}>
                  {slide.subtitle}
                </AppText>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {ONBOARDING_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;
          return (
            <Pressable
              key={slide.id}
              onPress={() => handleDotPress(index)}
              hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={`Chuyển đến trang ${index + 1}`}
              style={[
                styles.dot,
                isActive
                  ? { backgroundColor: isDark ? '#FFFFFF' : theme.colors.brandPrimary }
                  : { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.26)' : theme.colors.surfaceBorder },
              ]}
            />
          );
        })}
      </View>

      {/* Primary CTA Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 12, 28) }]}>
        <Pressable
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: theme.colors.brandAction,
              shadowColor: theme.colors.brandPrimary,
            },
            pressed && styles.buttonPressed,
          ]}
        >
          <AppText style={styles.buttonText}>{buttonLabel}</AppText>
        </Pressable>
      </View>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0D0B14' : '#FFFFFF' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {isDark ? (
        <ImageBackground
          source={images.onboardingV2Bg}
          style={styles.background}
          resizeMode="cover"
        >
          {renderContent()}
        </ImageBackground>
      ) : (
        <View style={[styles.background, { backgroundColor: '#FFFFFF' }]}>
          <AuthLightBackground />
          {renderContent()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.65,
  },
  logo: {
    width: 108,
    height: 40,
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: '86%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 33,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.26)',
  },
  footer: {
    paddingHorizontal: 20,
  },
  primaryButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#9E64F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9E64F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
