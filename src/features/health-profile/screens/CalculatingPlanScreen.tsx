import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '@/components/common';
import { CircleCheckIcon, StarIcon } from '@/components/icons';
import { useTheme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  title: string;
  content: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Bôngg bé',
    rating: 5,
    title: 'Yêu Kallo',
    content:
      'App hay cực kỳ tính calo khá chuẩn cho mục tiêu của tuỳ người, có cả phần bỏ thành phần trong món ăn để bỏ bớt calo quá hayyy nên tải nhé mngg',
  },
  {
    id: '2',
    name: 'Minh Thư',
    rating: 5,
    title: 'Giảm cân khoa học không mệt',
    content:
      'Lần đầu tiên mình thấy có app tính toán calo chi tiết và chế độ ăn cân bằng phù hợp người Việt Nam thế này. Giao diện trực quan, dễ dùng lắm ạ.',
  },
  {
    id: '3',
    name: 'Huy Trần',
    rating: 5,
    title: 'Thay đổi vóc dáng tuyệt vời',
    content:
      'Nhờ Kallo mà mình kiểm soát được lượng calo nạp vào mỗi ngày. Đã tăng được 3kg cơ bắp trong 2 tháng mà không bị mỡ thừa. Rất đáng dùng!',
  },
  {
    id: '4',
    name: 'Phương Thảo',
    rating: 5,
    title: 'Đồng hành mỗi bữa ăn',
    content:
      'Thích nhất tính năng cá nhân hóa dị ứng và bệnh lý. Cảm giác app được thiết kế riêng cho chính mình vậy đó.',
  },
];

interface CalculatingPlanScreenProps {
  navigation?: any;
  onFinished?: () => void;
}

export function CalculatingPlanScreen({
  navigation,
  onFinished,
}: CalculatingPlanScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';

  // Progress animation values (0 to 1)
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;

  // Pulse animation for hourglass
  const hourglassScale = useRef(new Animated.Value(1)).current;

  // Completion states for checkmark appearance
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  // Active testimonial carousel index
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-cycle testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % TESTIMONIALS.length;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Gentle pulse for hourglass
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(hourglassScale, {
          toValue: 1.12,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(hourglassScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [hourglassScale]);

  // Sequential calculation progress
  useEffect(() => {
    let isMounted = true;

    // Step 1: 0 - 800ms
    Animated.timing(progress1, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => {
      if (!isMounted) return;
      setStep1Done(true);

      // Step 2: 800 - 1650ms
      Animated.timing(progress2, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start(() => {
        if (!isMounted) return;
        setStep2Done(true);

        // Step 3: 1650 - 2500ms
        Animated.timing(progress3, {
          toValue: 1,
          duration: 850,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }).start(() => {
          if (!isMounted) return;
          setStep3Done(true);

          // Wait 400ms after all done then navigate
          setTimeout(() => {
            if (!isMounted) return;
            if (onFinished) {
              onFinished();
            } else if (navigation?.navigate) {
              navigation.replace ? navigation.replace('PlanResult') : navigation.navigate('PlanResult');
            }
          }, 450);
        });
      });
    });

    return () => {
      isMounted = false;
    };
  }, [navigation, onFinished, progress1, progress2, progress3]);

  // Manual skip handler if user taps anywhere or skip
  const handleSkip = () => {
    if (onFinished) {
      onFinished();
    } else if (navigation?.navigate) {
      navigation.replace ? navigation.replace('PlanResult') : navigation.navigate('PlanResult');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 20),
          backgroundColor: isDark ? '#0F0B1E' : theme.colors.canvasBase,
        },
      ]}
    >
      <View style={styles.content}>
        {/* ── Top Mascot / Hourglass Icon ─────────────────────────── */}
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: hourglassScale }] }]}>
          <AppText style={styles.hourglassEmoji}>⏳</AppText>
        </Animated.View>

        {/* ── Heading ────────────────────────────────────────────── */}
        <AppText
          style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
          ]}
        >
          Kallo đang tính toán cho bạn nè...
        </AppText>

        {/* ── Progress Steps ─────────────────────────────────────── */}
        <View style={styles.stepsContainer}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <AppText
                style={[
                  styles.stepLabel,
                  { color: isDark ? '#F1F5F9' : theme.colors.textPrimary },
                ]}
              >
                Phân tích hồ sơ thể chất
              </AppText>
              {step1Done ? (
                <View style={styles.checkCircle}>
                  <CircleCheckIcon size={20} color="#22C55E" />
                </View>
              ) : (
                <View
                  style={[
                    styles.emptyCircle,
                    {
                      borderColor: isDark
                        ? '#362D59'
                        : theme.colors.surfaceBorder,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.track,
                {
                  backgroundColor: isDark
                    ? '#231B42'
                    : theme.colors.surfaceBorder,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: theme.colors.brandPrimary,
                    width: progress1.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <AppText
                style={[
                  styles.stepLabel,
                  { color: isDark ? '#F1F5F9' : theme.colors.textPrimary },
                ]}
              >
                Tính toán quá trình trao đổi chất
              </AppText>
              {step2Done ? (
                <View style={styles.checkCircle}>
                  <CircleCheckIcon size={20} color="#22C55E" />
                </View>
              ) : (
                <View
                  style={[
                    styles.emptyCircle,
                    {
                      borderColor: isDark
                        ? '#362D59'
                        : theme.colors.surfaceBorder,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.track,
                {
                  backgroundColor: isDark
                    ? '#231B42'
                    : theme.colors.surfaceBorder,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: theme.colors.brandPrimary,
                    width: progress2.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <AppText
                style={[
                  styles.stepLabel,
                  { color: isDark ? '#F1F5F9' : theme.colors.textPrimary },
                ]}
              >
                Tính toán calo mục tiêu
              </AppText>
              {step3Done ? (
                <View style={styles.checkCircle}>
                  <CircleCheckIcon size={20} color="#22C55E" />
                </View>
              ) : step2Done ? (
                <View style={styles.spinCircle}>
                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={theme.colors.brandPrimary}
                      strokeWidth="2.5"
                      strokeDasharray="28 14"
                      fill="none"
                    />
                  </Svg>
                </View>
              ) : (
                <View
                  style={[
                    styles.emptyCircle,
                    {
                      borderColor: isDark
                        ? '#362D59'
                        : theme.colors.surfaceBorder,
                    },
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.track,
                {
                  backgroundColor: isDark
                    ? '#231B42'
                    : theme.colors.surfaceBorder,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: theme.colors.brandPrimary,
                    width: progress3.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* ── Testimonials Section ───────────────────────────────── */}
        <View style={styles.testimonialSection}>
          <AppText
            style={[
              styles.testimonialHeading,
              { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
            ]}
          >
            Đánh giá từ người dùng Kallo
          </AppText>

          <FlatList
            ref={flatListRef}
            data={TESTIMONIALS}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 40)
              );
              setActiveIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.testimonialCard,
                  {
                    backgroundColor: isDark
                      ? '#1E163B'
                      : theme.colors.surfaceMid,
                    borderColor: isDark
                      ? '#34265E'
                      : theme.colors.surfaceBorder,
                  },
                ]}
              >
                <View style={styles.testimonialTopRow}>
                  <View style={styles.starsRow}>
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon key={i} size={15} color="#FACC15" fill="#FACC15" />
                    ))}
                  </View>
                  <AppText
                    style={[
                      styles.reviewerName,
                      { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
                    ]}
                  >
                    {item.name}
                  </AppText>
                </View>

                <AppText
                  style={[
                    styles.reviewTitle,
                    { color: isDark ? '#FFFFFF' : theme.colors.textPrimary },
                  ]}
                >
                  {item.title}
                </AppText>
                <AppText
                  style={[
                    styles.reviewContent,
                    { color: isDark ? '#CBD5E1' : theme.colors.textSecondary },
                  ]}
                >
                  {item.content}
                </AppText>
              </View>
            )}
          />

          {/* Carousel Pagination Dots */}
          <View style={styles.paginationDots}>
            {TESTIMONIALS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  idx === activeIndex
                    ? [
                        styles.activeDot,
                        {
                          backgroundColor: isDark
                            ? '#FFFFFF'
                            : theme.colors.brandPrimary,
                        },
                      ]
                    : [
                        styles.inactiveDot,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.25)'
                            : theme.colors.surfaceBorder,
                        },
                      ],
                ]}
              />
            ))}
          </View>
        </View>

        {/* ── Optional subtle skip button at bottom ──────────────── */}
        <TouchableOpacity
          onPress={handleSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <AppText
            style={[
              styles.skipText,
              { color: theme.colors.brandPrimary },
            ]}
          >
            Xem kết quả ngay ›
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0B1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  hourglassEmoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: -0.2,
  },
  stepsContainer: {
    gap: 22,
  },
  stepItem: {
    width: '100%',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1F5F9',
  },
  checkCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#362D59',
  },
  track: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#231B42',
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#9D6CFA',
    borderRadius: 7,
  },
  testimonialSection: {
    marginTop: 32,
    width: '100%',
  },
  testimonialHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  testimonialCard: {
    width: SCREEN_WIDTH - 40,
    backgroundColor: '#1E163B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#34265E',
  },
  testimonialTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  starText: {
    fontSize: 17,
    color: '#FBBF24',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  reviewTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 22,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  skipText: {
    fontSize: 13,
    color: '#A78BFA',
    fontWeight: '600',
  },
});
