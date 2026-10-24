import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceLogModal'>;

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
  const { addFoodLog } = useNutrition();
  const [isRecording, setIsRecording] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);
  const [hasResult, setHasResult] = useState(false);

  const currentResult = SAMPLE_VOICE_RESULTS[resultIndex];

  const handleStartRecording = () => {
    setIsRecording(true);
    setHasResult(false);
    // Simulate speech-to-text recognition
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
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <View style={styles.container}>
        {/* ── Background Art ─────────────────────────────────────────── */}
        <Image
          source={images.voiceLogBg}
          style={styles.bgImage}
          resizeMode="cover"
        />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Đóng"
          >
            <AppText variant="headlineSm" color="#FFFFFF">✕</AppText>
          </TouchableOpacity>
          <AppText variant="headlineSm" color="#FFFFFF">
            Ghi nhanh bằng giọng nói
          </AppText>
          <View style={styles.placeholder} />
        </View>

        {/* ── Mascot Artwork ─────────────────────────────────────────── */}
        <View style={styles.mascotWrap}>
          <Image
            source={images.voiceLogMascot}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* ── Speech Recognition Display Card ─────────────────────────── */}
        <AppCard style={styles.displayCard}>
          {isRecording ? (
            <View style={styles.recordingState}>
              <View style={[styles.pulseRing, { borderColor: theme.colors.brandPrimary }]} />
              <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
                Đang nghe bạn nói...
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Hãy nói: "Tôi vừa ăn một bát phở bò"
              </AppText>
            </View>
          ) : hasResult ? (
            <View style={styles.resultState}>
              <AppText variant="caption" color={theme.colors.brandPrimary}>
                KẾT QUẢ NHẬN DIỆN GIỌNG NÓI
              </AppText>
              <AppText variant="headlineSm">"{currentResult.transcript}"</AppText>

              <View style={styles.foodParsedRow}>
                <View style={styles.parsedItem}>
                  <AppText variant="caption" color={theme.colors.textSecondary}>Món ăn</AppText>
                  <AppText variant="bodySm">{currentResult.foodName}</AppText>
                </View>
                <View style={styles.parsedItem}>
                  <AppText variant="caption" color={theme.colors.textSecondary}>Khẩu phần</AppText>
                  <AppText variant="bodySm">{currentResult.grams} g</AppText>
                </View>
                <View style={styles.parsedItem}>
                  <AppText variant="caption" color={theme.colors.textSecondary}>Calo</AppText>
                  <AppText variant="bodySm" color={theme.colors.brandPrimary}>
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
                Nhấn giữ micro để nói
              </AppText>
              <AppText variant="bodySm" color={theme.colors.textSecondary} align="center">
                Ví dụ: "Trưa nay tôi ăn một suất cơm sườn" hoặc "Sáng ăn 1 cái bánh mì"
              </AppText>
            </View>
          )}
        </AppCard>

        {/* ── Microphone Action Button ───────────────────────────────── */}
        <View style={styles.micActionWrap}>
          <TouchableOpacity
            style={[
              styles.micButton,
              {
                backgroundColor: isRecording
                  ? theme.colors.calorieIn
                  : theme.colors.brandPrimary,
              },
            ]}
            onPress={() => {
              if (isRecording) {
                setIsRecording(false);
              } else {
                setResultIndex((prev) => (prev + 1) % SAMPLE_VOICE_RESULTS.length);
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
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: { width: 36 },
  mascotWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotImage: {
    width: 160,
    height: 160,
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
    borderColor: 'rgba(128,128,128,0.15)',
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
});
