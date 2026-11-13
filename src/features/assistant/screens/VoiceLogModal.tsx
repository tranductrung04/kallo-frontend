import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import { ChevronLeftIcon, InfoIcon } from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceLogModal'>;
const VOICE_GUIDE_KEY = '@kallo/voice-log-intro-seen';

const SAMPLE_VOICE_RESULTS = [
  {
    transcript: 'Tôi vừa ăn một bát phở bò khoảng 450 gam',
    foodId: 'pho-bo',
    foodName: 'Phở bò',
    grams: 450,
    meal: 'breakfast' as const,
    calories: 405,
  },
  {
    transcript: 'Trưa nay ăn một đĩa cơm tấm sườn nướng',
    foodId: 'com-tam',
    foodName: 'Cơm tấm sườn',
    grams: 350,
    meal: 'lunch' as const,
    calories: 630,
  },
  {
    transcript: 'Chiều vừa ăn 1 cái bánh mì thịt chả',
    foodId: 'banh-mi',
    foodName: 'Bánh mì thịt',
    grams: 180,
    meal: 'snack' as const,
    calories: 468,
  },
];

export function VoiceLogModal({ navigation, route }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { addFoodLog } = useNutrition();

  const [introVisible, setIntroVisible] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);
  const [hasResult, setHasResult] = useState(false);

  const currentResult = SAMPLE_VOICE_RESULTS[resultIndex];

  // Dynamic theme colors
  const primaryBrand = colors.brandPrimary || '#9E64F7';

  // Check if first time opening Voice Log
  useEffect(() => {
    void AsyncStorage.getItem(VOICE_GUIDE_KEY)
      .then((val) => {
        if (val === 'true') {
          setIntroSeen(true);
        } else {
          setIntroVisible(true);
        }
      })
      .catch(() => undefined);
  }, []);

  const closeIntro = () => {
    setIntroSeen(true);
    setIntroVisible(false);
    void AsyncStorage.setItem(VOICE_GUIDE_KEY, 'true').catch(() => undefined);
  };

  const handleIntroBack = () => {
    if (introSeen) {
      setIntroVisible(false);
    } else {
      navigation.goBack();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasResult(false);
    setTimeout(() => {
      setIsRecording(false);
      setHasResult(true);
    }, 1800);
  };

  const handleSaveToDiary = () => {
    const date = route.params?.date || todayKey();
    const meal = route.params?.meal || currentResult.meal;

    addFoodLog({
      date,
      meal,
      foodId: currentResult.foodId,
      foodName: currentResult.foodName,
      grams: currentResult.grams,
      source: 'VOICE',
      nutritionSnapshot: {
        calories: currentResult.calories,
        protein: 20,
        carbs: 45,
        fat: 12,
      },
    });

    Alert.alert(
      'Ghi nhận thành công! 🎙️',
      `Đã thêm ${currentResult.foodName} (${currentResult.grams}g - ${currentResult.calories} kcal) vào nhật ký.`,
      [{ text: 'Đóng', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.canvasBase }]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.canvasBase}
      />

      {/* ── Main Voice Log Screen ─────────────────────────────────────── */}
      <View style={styles.container}>
        {/* Background Art */}
        <Image
          source={images.voiceLogBg}
          style={[styles.bgImage, { opacity: isDark ? 0.85 : 0.45 }]}
          resizeMode="cover"
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon
              size={24}
              color={isDark ? '#FFFFFF' : colors.textPrimary}
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? '#FFFFFF' : colors.textPrimary },
            ]}
          >
            Ghi món ăn bằng giọng nói
          </Text>

          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setIntroVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Hướng dẫn"
          >
            <InfoIcon
              size={22}
              color={isDark ? '#FFFFFF' : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Mascot Artwork */}
        <View style={styles.mascotWrap}>
          <Image
            source={images.voiceLogMascot}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Speech Recognition Display Card */}
        <AppCard style={styles.displayCard}>
          {isRecording ? (
            <View style={styles.recordingState}>
              <View
                style={[
                  styles.pulseRing,
                  { borderColor: primaryBrand },
                ]}
              />
              <AppText variant="headlineSm" color={primaryBrand}>
                Đang nghe bạn nói...
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Hãy nói: "Tôi vừa ăn một bát phở bò"
              </AppText>
            </View>
          ) : hasResult ? (
            <View style={styles.resultState}>
              <AppText variant="caption" color={primaryBrand}>
                KẾT QUẢ NHẬN DIỆN GIỌNG NÓI
              </AppText>
              <AppText variant="headlineSm">"{currentResult.transcript}"</AppText>

              <View
                style={[
                  styles.foodParsedRow,
                  {
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
              >
                <View style={styles.parsedItem}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Món ăn
                  </AppText>
                  <AppText variant="bodySm">{currentResult.foodName}</AppText>
                </View>
                <View style={styles.parsedItem}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Khẩu phần
                  </AppText>
                  <AppText variant="bodySm">{currentResult.grams} g</AppText>
                </View>
                <View style={styles.parsedItem}>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Calo
                  </AppText>
                  <AppText variant="bodySm" color={primaryBrand}>
                    ~{currentResult.calories} kcal
                  </AppText>
                </View>
              </View>

              <AppButton
                label="Lưu vào nhật ký bữa ăn"
                variant="primary"
                onPress={handleSaveToDiary}
              />
            </View>
          ) : (
            <View style={styles.idleState}>
              <AppText variant="headlineSm" align="center">
                Nhấn micro để nói
              </AppText>
              <AppText
                variant="bodySm"
                color={colors.textSecondary}
                align="center"
              >
                Ví dụ: "200g thịt bò xào rau" hoặc "1 chén cơm và 100g cá hồi"
              </AppText>
            </View>
          )}
        </AppCard>

        {/* Microphone Action Button */}
        <View style={styles.micActionWrap}>
          <TouchableOpacity
            style={[
              styles.micButton,
              {
                backgroundColor: isRecording
                  ? colors.calorieIn
                  : primaryBrand,
              },
            ]}
            onPress={() => {
              if (isRecording) {
                setIsRecording(false);
              } else {
                setResultIndex(
                  (prev) => (prev + 1) % SAMPLE_VOICE_RESULTS.length
                );
                handleStartRecording();
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Ghi âm"
          >
            <AppText variant="headlineLg" color="#FFFFFF">
              {isRecording ? '⏹' : '🎙️'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── First-time Intro Screen Modal (Theme Adaptive) ─────────────── */}
      <Modal
        visible={introVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={handleIntroBack}
      >
        <View
          style={[
            styles.introContainer,
            {
              backgroundColor: isDark ? '#110D1D' : colors.canvasBase,
            },
          ]}
        >
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={isDark ? '#110D1D' : colors.canvasBase}
          />

          <SafeAreaView style={styles.introSafe} edges={['top']}>
            {/* Header: < Back */}
            <View style={styles.introHeader}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleIntroBack}
                accessibilityLabel="Quay lại"
              >
                <ChevronLeftIcon
                  size={24}
                  color={isDark ? '#FFFFFF' : colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Mascot Artwork */}
            <View
              style={[
                styles.introMascotGraphicWrap,
                {
                  backgroundColor: isDark ? '#1C162E' : '#EDE8F8',
                  borderColor: isDark ? '#2D2348' : '#DDD5F3',
                  borderWidth: 1,
                },
              ]}
            >
              <Image
                source={images.voiceLogMascot}
                style={styles.introMascotImage}
                resizeMode="contain"
              />
            </View>

            {/* Title & Description */}
            <View style={styles.introTextSection}>
              <Text
                style={[
                  styles.introTitle,
                  {
                    color: isDark ? '#FFFFFF' : colors.textPrimary,
                  },
                ]}
              >
                Ghi món ăn bằng giọng nói
              </Text>
              <Text
                style={[
                  styles.introSubtitle,
                  {
                    color: isDark ? '#C4BED7' : colors.textSecondary,
                  },
                ]}
              >
                {'Nhấn nút mic và đọc rõ ràng tên món và\nkhối lượng nếu cần để Wao tìm cho bạn\nnhé'}
              </Text>
            </View>

            {/* Example Quotes with Purple Badges */}
            <View style={styles.quotesSection}>
              {/* Quote 1: “ 200g thịt bò xào rau”, */}
              <View style={styles.quoteRow}>
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                >
                  “
                </Text>
                <View
                  style={[
                    styles.gramBadge,
                    {
                      backgroundColor: isDark ? '#8B5CF6' : primaryBrand,
                    },
                  ]}
                >
                  <Text style={styles.gramBadgeText}>200g</Text>
                </View>
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                >
                  thịt bò xào rau”,
                </Text>
              </View>

              {/* Quote 2: “1 chén cơm và 100g cá hồi” */}
              <View style={styles.quoteRow}>
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                >
                  “1 chén cơm và
                </Text>
                <View
                  style={[
                    styles.gramBadge,
                    {
                      backgroundColor: isDark ? '#8B5CF6' : primaryBrand,
                    },
                  ]}
                >
                  <Text style={styles.gramBadgeText}>100g</Text>
                </View>
                <Text
                  style={[
                    styles.quoteText,
                    {
                      color: isDark ? '#FFFFFF' : colors.textPrimary,
                    },
                  ]}
                >
                  cá hồi”
                </Text>
              </View>
            </View>

            {/* Bottom CTA Button: Sử dụng ngay */}
            <View
              style={[
                styles.introCtaWrapper,
                { paddingBottom: Math.max(insets.bottom, 16) + 12 },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.introCtaBtn,
                  {
                    backgroundColor: primaryBrand,
                    shadowColor: primaryBrand,
                  },
                ]}
                activeOpacity={0.85}
                onPress={closeIntro}
                accessibilityLabel="Sử dụng ngay"
              >
                <Text style={styles.introCtaBtnText}>Sử dụng ngay</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotImage: {
    width: 170,
    height: 170,
  },
  displayCard: {
    padding: 20,
    borderRadius: 20,
  },
  recordingState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  pulseRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    marginBottom: 4,
  },
  resultState: {
    gap: 12,
  },
  foodParsedRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  parsedItem: {
    alignItems: 'center',
  },
  idleState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  micActionWrap: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  // ── First-time Intro Screen Styles ────────────────────────────────────────
  introContainer: {
    flex: 1,
  },
  introSafe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  introHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  introMascotGraphicWrap: {
    width: 280,
    height: 240,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 20,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introMascotImage: {
    width: 190,
    height: 190,
  },
  introTextSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
    letterSpacing: -0.2,
  },
  introSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  quotesSection: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quoteText: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  gramBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gramBadgeText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  introCtaWrapper: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  introCtaBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  introCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
