import React, { useMemo } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppButton, AppText } from '@/components/common';
import { ChevronLeftIcon } from '@/components/icons';
import { useHealthProfileDraft } from '../hooks/useHealthProfileDraft';
import { calculateBmi, bmiCategory } from '../utils/calculations';

interface ProfileSummaryScreenProps {
  navigation?: any;
  onNext?: () => void;
  onBack?: () => void;
  hideHeader?: boolean;
}

export function ProfileSummaryScreen({
  navigation,
  onNext,
  onBack,
  hideHeader = false,
}: ProfileSummaryScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    draft,
    saving,
    error,
    saveProfile,
  } = useHealthProfileDraft();

  const currentWeight = useMemo(() => {
    const parsed = parseFloat(draft.weight);
    return !isNaN(parsed) && parsed > 0 ? parsed : 53;
  }, [draft.weight]);

  const heightCm = useMemo(() => {
    const parsed = parseFloat(draft.height);
    return !isNaN(parsed) && parsed > 0 ? parsed : 175;
  }, [draft.height]);

  const targetWeight = useMemo(() => {
    const parsed = parseFloat(draft.targetWeight);
    return !isNaN(parsed) && parsed > 0 ? parsed : 61;
  }, [draft.targetWeight]);

  // Current BMI
  const bmiVal = useMemo(() => {
    const rawBmi = calculateBmi(currentWeight, heightCm);
    return parseFloat(rawBmi.toFixed(1));
  }, [currentWeight, heightCm]);

  const category = useMemo(() => bmiCategory(bmiVal), [bmiVal]);

  const bmiMeta = useMemo(() => {
    if (bmiVal < 18.5) {
      return {
        badgeBg: '#2563EB',
        badgeColor: '#FFFFFF',
        valueColor: '#3B82F6',
        advice: 'Bạn đang thiếu cân đấy, cơ thể có thể bị suy nhược, mất cơ và rối loạn nội tiết. Hãy tăng cường dinh dưỡng nhé!',
      };
    }
    if (bmiVal < 23) {
      return {
        badgeBg: '#16A34A',
        badgeColor: '#FFFFFF',
        valueColor: '#22C55E',
        advice: 'Bạn đang ở mức cân nặng hợp lý. Hãy duy trì thói quen lành mạnh để bảo vệ sức khỏe lâu dài.',
      };
    }
    if (bmiVal < 25) {
      return {
        badgeBg: '#F59E0B',
        badgeColor: '#FFFFFF',
        valueColor: '#FBBF24',
        advice: 'Bạn đang ở mức thừa cân nhẹ. Kallo sẽ đồng hành giúp bạn lấy lại vóc dáng săn chắc nhất.',
      };
    }
    return {
      badgeBg: '#EF4444',
      badgeColor: '#FFFFFF',
      valueColor: '#FF6B6B',
      advice: 'Chỉ số BMI đang ở mức cảnh báo. Chúng mình sẽ xây dựng thực đơn thâm hụt an toàn và bền vững cho bạn.',
    };
  }, [bmiVal]);

  // Calculate indicator percentage on the BMI bar (range ~12 to 35)
  const markerPercent = useMemo(() => {
    if (bmiVal < 18.5) {
      return Math.max(3, Math.min(23, ((bmiVal - 12) / (18.5 - 12)) * 24));
    }
    if (bmiVal < 22.9) {
      return 24 + ((bmiVal - 18.5) / (22.9 - 18.5)) * 22;
    }
    if (bmiVal < 24.9) {
      return 46 + ((bmiVal - 22.9) / (24.9 - 22.9)) * 14;
    }
    if (bmiVal < 29.9) {
      return 60 + ((bmiVal - 24.9) / (29.9 - 24.9)) * 22;
    }
    return Math.min(96, 82 + ((bmiVal - 29.9) / (35 - 29.9)) * 18);
  }, [bmiVal]);

  // Readable labels
  const goalLabel = useMemo(() => {
    if (draft.goal === 'lose') return 'Giảm cân';
    if (draft.goal === 'gain') return 'Tăng cân';
    return 'Duy trì cân nặng';
  }, [draft.goal]);

  const activityLabel = useMemo(() => {
    if (draft.activity === 'sedentary') return 'Không tập luyện, ít vận động';
    if (draft.activity === 'light') return 'Vận động nhẹ nhàng';
    if (draft.activity === 'moderate') return 'Chăm chỉ luyện tập';
    return 'Vận động cường độ cao';
  }, [draft.activity]);

  const dietPrefLabel = useMemo(() => {
    const map: Record<string, string> = {
      standard: 'Ăn đa dạng',
      eat_clean: 'Eat Clean',
      flexitarian: 'Ăn chay linh hoạt',
      vegan: 'Ăn chay thuần',
      keto: 'Keto / Low-Carb',
      mediterranean: 'Địa Trung Hải',
    };
    return map[draft.dietaryPreference || 'standard'] || 'Ăn đa dạng';
  }, [draft.dietaryPreference]);

  const conditionLabels = useMemo(() => {
    const map: Record<string, string> = {
      none: 'Không có bệnh lý nền',
      gerd: 'Đau dạ dày / Trào ngược',
      diabetes: 'Đái tháo đường',
      hypertension: 'Huyết áp cao',
      hyperlipidemia: 'Mỡ máu cao',
      gout: 'Bệnh Gút',
      fatty_liver: 'Gan nhiễm mỡ',
    };
    const list = draft.healthConditions || [];
    if (list.length === 0 || list.includes('none')) return 'Không có bệnh lý nền';
    return list.map((k) => map[k] || k).join(', ');
  }, [draft.healthConditions]);

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (navigation?.navigate) {
      navigation.navigate('CalculatingPlan');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation?.canGoBack?.() && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── Top Bar ────────────────────────────────────────────── */}
      {!hideHeader && (
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar & Speech Bubble Row ─────────────────────────── */}
        <View style={styles.bubbleRow}>
          <View style={styles.avatarWrap}>
            <Image
              source={images.mascotAvatar}
              style={styles.avatarImage}
              resizeMode="cover"
              accessibilityLabel="Mascot Kallo"
            />
          </View>
          <View style={styles.bubble}>
            <View style={styles.bubbleTail} />
            <AppText style={styles.bubbleText}>
              Kallo tổng hợp lại thông tin giúp bạn nha
            </AppText>
          </View>
        </View>

        {/* ── Main Top Summary Card ──────────────────────────────── */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <View style={styles.metricsCol}>
              {/* Mục tiêu */}
              <View style={styles.metricItem}>
                <AppText style={styles.metricLabel}>🎯 MỤC TIÊU</AppText>
                <AppText style={styles.metricValue}>{goalLabel}</AppText>
              </View>

              {/* Cân nặng mục tiêu */}
              <View style={styles.metricItem}>
                <AppText style={styles.metricLabel}>📍 CÂN NẶNG MỤC TIÊU</AppText>
                <AppText style={styles.metricValue}>
                  {Math.round(targetWeight)} kg
                </AppText>
              </View>

              {/* Cường độ tập luyện */}
              <View style={styles.metricItem}>
                <AppText style={styles.metricLabel}>🔥 CƯỜNG ĐỘ TẬP LUYỆN</AppText>
                <AppText style={styles.metricValue}>{activityLabel}</AppText>
              </View>
            </View>

            {/* Illustration */}
            <View style={styles.illustrationWrap}>
              <Image
                source={images.onboardingWaiting}
                style={styles.illustrationImage}
                resizeMode="contain"
                accessibilityLabel="Tổng hợp thông tin"
              />
            </View>
          </View>

          {/* Detailed Info Expansion (Nickname, Height/Weight, Diet, Allergies, Health) */}
          <View style={styles.detailsDivider} />
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>👤 Người dùng:</AppText>
              <AppText style={styles.detailVal}>
                {draft.nickname ? `${draft.nickname} • ` : ''}
                {draft.gender === 'female' ? 'Nữ' : 'Nam'} ({draft.height} cm, {draft.weight} kg)
              </AppText>
            </View>

            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>🥗 Chế độ ăn:</AppText>
              <AppText style={styles.detailVal}>{dietPrefLabel}</AppText>
            </View>

            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>⚠️ Dị ứng:</AppText>
              <AppText style={styles.detailVal}>
                {draft.allergies.length > 0
                  ? draft.allergies.join(', ')
                  : 'Không có dị ứng'}
              </AppText>
            </View>

            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel}>🩺 Tiền sử bệnh:</AppText>
              <AppText style={styles.detailVal}>{conditionLabels}</AppText>
            </View>
          </View>
        </View>

        {/* ── BMI Spectrum Bar ───────────────────────────────────── */}
        <View style={styles.spectrumSection}>
          <View style={styles.barContainer}>
            {/* 5 colored segments */}
            <View style={[styles.barSegment, { flex: 24, backgroundColor: '#38BDF8' }]} />
            <View style={[styles.barSegment, { flex: 22, backgroundColor: '#22C55E' }]} />
            <View style={[styles.barSegment, { flex: 14, backgroundColor: '#FBBF24' }]} />
            <View style={[styles.barSegment, { flex: 22, backgroundColor: '#FB7185' }]} />
            <View style={[styles.barSegment, { flex: 18, backgroundColor: '#EF4444' }]} />

            {/* Floating Marker Circle */}
            <View
              style={[
                styles.spectrumMarker,
                { left: `${markerPercent}%` },
              ]}
            >
              <View
                style={[
                  styles.markerInner,
                  { backgroundColor: bmiMeta.badgeBg },
                ]}
              />
            </View>
          </View>

          {/* Scale numbers below bar */}
          <View style={styles.scaleLabelsRow}>
            <AppText style={styles.scaleText}>&lt; 15</AppText>
            <AppText style={styles.scaleText}>18.5</AppText>
            <AppText style={styles.scaleText}>22.9</AppText>
            <AppText style={styles.scaleText}>24.9</AppText>
            <AppText style={styles.scaleText}>29.9</AppText>
            <AppText style={styles.scaleText}>≥ 35</AppText>
          </View>
        </View>

        {/* ── BMI Result Card ────────────────────────────────────── */}
        <View style={styles.bmiCard}>
          <View style={styles.bmiHeaderRow}>
            <AppText style={styles.bmiTitle}>BMI của bạn: </AppText>
            <AppText style={[styles.bmiValue, { color: bmiMeta.valueColor }]}>
              {bmiVal.toFixed(1)}
            </AppText>
            <View style={[styles.bmiBadge, { backgroundColor: bmiMeta.badgeBg }]}>
              <AppText style={[styles.bmiBadgeText, { color: bmiMeta.badgeColor }]}>
                {category}
              </AppText>
            </View>
          </View>
          <AppText style={styles.bmiAdvice}>{bmiMeta.advice}</AppText>
        </View>

        {error ? (
          <AppText style={styles.errorText}>{error}</AppText>
        ) : null}
      </ScrollView>

      {/* ── Bottom Action Button ───────────────────────────────── */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
        >
          <AppText style={styles.buttonText}>
            Tiếp tục
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 12,
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2E2654',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#4A3D7E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 52,
    height: 52,
  },
  bubble: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexShrink: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bubbleTail: {
    position: 'absolute',
    left: -6,
    top: 18,
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  bubbleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 22,
  },
  mainCard: {
    backgroundColor: '#1D1736',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#302554',
    marginHorizontal: 20,
    marginTop: 22,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  mainCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsCol: {
    flex: 1,
    gap: 14,
  },
  metricItem: {
    gap: 2,
  },
  metricLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#9C94BC',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  illustrationWrap: {
    width: 130,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#2D2350',
    marginVertical: 16,
  },
  detailsSection: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#AEA6CC',
    width: 105,
  },
  detailVal: {
    fontSize: 12.5,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 17,
  },
  spectrumSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  barContainer: {
    position: 'relative',
    height: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'visible',
    marginHorizontal: 4,
  },
  barSegment: {
    height: 10,
  },
  spectrumMarker: {
    position: 'absolute',
    top: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -11 }],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scaleLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  scaleText: {
    fontSize: 11,
    color: '#8E87AA',
    fontWeight: '600',
  },
  bmiCard: {
    backgroundColor: '#1C1635',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2D2350',
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  bmiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bmiValue: {
    fontSize: 17,
    fontWeight: '800',
    marginRight: 8,
  },
  bmiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bmiBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bmiAdvice: {
    fontSize: 13,
    color: '#C7BFE0',
    lineHeight: 19,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  bottomArea: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  actionButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9358F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9358F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
