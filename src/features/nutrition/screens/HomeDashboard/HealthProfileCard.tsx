import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppCard, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import {
  ChevronRightIcon,
  HeartIcon,
  LightningIcon,
  ScaleOutlineIcon,
  TargetIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import type {
  HealthProfileResponse,
  UserChronicConditionResponse,
  UserAllergyResponse,
} from '@/features/health-profile/types';
import { formatNumber } from '../../utils';

export function getGoalTypeLabel(goalType?: string): string {
  switch (goalType) {
    case 'LOSE_WEIGHT':
      return 'Giảm cân';
    case 'GAIN_WEIGHT':
      return 'Tăng cân';
    case 'MAINTAIN_WEIGHT':
      return 'Duy trì cân nặng';
    default:
      return 'Duy trì cân nặng';
  }
}

export function getActivityLevelLabel(level?: string): string {
  switch (level) {
    case 'SEDENTARY':
      return 'Ít vận động (văn phòng)';
    case 'LIGHTLY_ACTIVE':
      return 'Vận động nhẹ (1–3 buổi/tuần)';
    case 'MODERATELY_ACTIVE':
      return 'Vận động vừa (3–5 buổi/tuần)';
    case 'VERY_ACTIVE':
      return 'Vận động nhiều (6–7 buổi/tuần)';
    case 'EXTRA_ACTIVE':
      return 'Cực nhiều (vận động viên)';
    default:
      return 'Vận động vừa';
  }
}

export function getBmiCategoryInfo(bmi: number, backendVi?: string): { label: string; color: string; bg: string } {
  const label =
    backendVi ||
    (bmi < 18.5 ? 'Thiếu cân' : bmi < 23 ? 'Bình thường' : bmi < 25 ? 'Thừa cân' : 'Béo phì');

  if (label.includes('Bình thường')) {
    return { label, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' };
  }
  if (label.includes('Thiếu cân')) {
    return { label, color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' };
  }
  if (label.includes('Thừa cân')) {
    return { label, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
  }
  return { label, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' };
}

interface HealthProfileCardProps {
  profile: HealthProfileResponse | null;
  conditions?: UserChronicConditionResponse[];
  allergies?: UserAllergyResponse[];
  onPressDetail?: () => void;
  onPressSetup?: () => void;
}

export function HealthProfileCard({
  profile,
  conditions = [],
  allergies = [],
  onPressDetail,
  onPressSetup,
}: HealthProfileCardProps) {
  const theme = useTheme();
  const { colors, spacing } = theme;

  // Trường hợp người dùng chưa thiết lập hồ sơ sức khỏe
  if (!profile) {
    return (
      <AppCard style={styles.card}>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconBox, { backgroundColor: colors.brandSoftTint }]}>
            <HeartIcon size={26} color={colors.brandPrimary} />
          </View>
          <View style={styles.emptyTextGroup}>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Chưa thiết lập hồ sơ sức khỏe
            </AppText>
            <AppText variant="bodySm" color={colors.textSecondary} align="center">
              Thiết lập hồ sơ để Kallo tính toán mục tiêu Calo, BMR, TDEE và thực đơn cá nhân hóa.
            </AppText>
          </View>
          {onPressSetup && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thiết lập hồ sơ ngay"
              onPress={onPressSetup}
              style={[styles.setupButton, { backgroundColor: colors.brandPrimary }]}
            >
              <AppText variant="labelMd" color="#FFFFFF" style={{ fontWeight: '700' }}>
                Thiết lập hồ sơ ngay
              </AppText>
            </Pressable>
          )}
        </View>
      </AppCard>
    );
  }

  const currentWeight = profile.latestLoggedWeightKg ?? profile.weightKg ?? 0;
  const targetWeight = profile.targetWeightKg;
  const height = profile.heightCm ?? 0;
  const bmiVal = profile.bmi > 0 ? profile.bmi : height > 0 ? currentWeight / Math.pow(height / 100, 2) : 0;
  const bmiInfo = getBmiCategoryInfo(bmiVal, profile.bmiCategoryVi);
  const bmrVal = Math.round(profile.bmr ?? 0);
  const tdeeVal = Math.round(profile.tdee ?? 0);
  const goalLabel = getGoalTypeLabel(profile.goalType);
  const activityLabel = getActivityLevelLabel(profile.activityLevel);

  return (
    <AppCard style={styles.card}>
      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconBox, { backgroundColor: colors.brandSoftTint }]}>
            <HeartIcon size={20} color={colors.brandPrimary} />
          </View>
          <View>
            <AppText variant="headlineSm" color={colors.textPrimary}>
              Hồ sơ sức khỏe
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Chỉ số sinh học & thể trạng
            </AppText>
          </View>
        </View>

        {onPressDetail && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Xem chi tiết hồ sơ sức khỏe"
            onPress={onPressDetail}
            style={({ pressed }) => [styles.detailButton, pressed && { opacity: 0.7 }]}
          >
            <AppText variant="labelSm" color={colors.brandPrimary} style={{ fontWeight: '700' }}>
              Chi tiết
            </AppText>
            <ChevronRightIcon size={16} color={colors.brandPrimary} />
          </Pressable>
        )}
      </View>

      {/* 2. Target & Body Specs Banner */}
      <View
        style={[
          styles.targetBanner,
          {
            backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.03)' : colors.surfaceHigh,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <View style={styles.targetItem}>
          <AppText variant="caption" color={colors.textSecondary}>
            Hiện tại
          </AppText>
          <AppText variant="headlineSm" color={colors.textPrimary}>
            {currentWeight} <AppText variant="caption" color={colors.textSecondary}>kg</AppText>
          </AppText>
        </View>

        <View style={styles.targetArrowWrap}>
          <TargetIcon size={16} color={colors.brandPrimary} />
          <AppText variant="caption" color={colors.brandPrimary} style={{ fontWeight: '700' }}>
            {goalLabel}
          </AppText>
        </View>

        <View style={styles.targetItem}>
          <AppText variant="caption" color={colors.textSecondary}>
            Mục tiêu
          </AppText>
          <AppText variant="headlineSm" color={colors.brandSecondary}>
            {targetWeight ? targetWeight : 'Duy trì'}{' '}
            {targetWeight ? <AppText variant="caption" color={colors.textSecondary}>kg</AppText> : null}
          </AppText>
        </View>

        <View style={styles.targetDivider} />

        <View style={styles.targetItem}>
          <AppText variant="caption" color={colors.textSecondary}>
            Chiều cao
          </AppText>
          <AppText variant="headlineSm" color={colors.textPrimary}>
            {height} <AppText variant="caption" color={colors.textSecondary}>cm</AppText>
          </AppText>
        </View>
      </View>

      {/* 3. Three Core Biometric Pillars (BMI, BMR, TDEE) */}
      <View style={styles.metricsRow}>
        {/* BMI Column */}
        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.03)' : colors.surfaceHigh,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <AppText variant="caption" color={colors.textSecondary}>
            Chỉ số BMI
          </AppText>
          <AppText variant="headlineSm" style={{ color: colors.textPrimary, marginTop: 2 }}>
            {bmiVal > 0 ? bmiVal.toFixed(1) : '--'}
          </AppText>
          <View style={[styles.bmiPill, { backgroundColor: bmiInfo.bg }]}>
            <AppText variant="caption" style={{ color: bmiInfo.color, fontWeight: '700', fontSize: 10 }}>
              {bmiInfo.label}
            </AppText>
          </View>
        </View>

        {/* BMR Column */}
        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.03)' : colors.surfaceHigh,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <AppText variant="caption" color={colors.textSecondary}>
            Nghỉ ngơi (BMR)
          </AppText>
          <AppText variant="headlineSm" style={{ color: colors.textPrimary, marginTop: 2 }}>
            {bmrVal > 0 ? formatNumber(bmrVal) : '--'}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>
            kcal / ngày
          </AppText>
        </View>

        {/* TDEE Column */}
        <View
          style={[
            styles.metricBox,
            {
              backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.03)' : colors.surfaceHigh,
              borderColor: colors.surfaceBorder,
            },
          ]}
        >
          <AppText variant="caption" color={colors.textSecondary}>
            Tiêu thụ (TDEE)
          </AppText>
          <AppText variant="headlineSm" style={{ color: colors.brandPrimary, marginTop: 2 }}>
            {tdeeVal > 0 ? formatNumber(tdeeVal) : '--'}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>
            kcal / ngày
          </AppText>
        </View>
      </View>

      {/* 4. Activity Level Tag */}
      <View
        style={[
          styles.activityRow,
          {
            backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.02)' : colors.surfaceHigh,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <LightningIcon size={15} color={colors.brandPrimary} />
        <AppText variant="caption" color={colors.textSecondary}>
          Mức độ vận động:{' '}
          <AppText variant="caption" color={colors.textPrimary} style={{ fontWeight: '700' }}>
            {activityLabel}
          </AppText>
        </AppText>
      </View>

      {/* 5. Health Conditions (nếu có) */}
      {conditions.length > 0 && (
        <View style={styles.tagsContainer}>
          <AppText variant="caption" color={colors.textSecondary} style={{ fontWeight: '600' }}>
            🩺 Bệnh lý quan tâm:
          </AppText>
          <View style={styles.tagWrap}>
            {conditions.map((item) => (
              <View
                key={item.conditionId}
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor:
                      theme.scheme === 'dark' ? 'rgba(139, 87, 232, 0.15)' : 'rgba(139, 87, 232, 0.08)',
                    borderColor: colors.brandPrimary,
                  },
                ]}
              >
                <AppText variant="caption" color={colors.brandPrimary} style={{ fontWeight: '600', fontSize: 11 }}>
                  {item.name}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 6. Allergies (nếu có) */}
      {allergies.length > 0 && (
        <View style={styles.tagsContainer}>
          <AppText variant="caption" color={colors.textSecondary} style={{ fontWeight: '600' }}>
            ⚠️ Dị ứng thực phẩm:
          </AppText>
          <View style={styles.tagWrap}>
            {allergies.map((item) => (
              <View
                key={item.ingredientId}
                style={[
                  styles.tagBadge,
                  {
                    backgroundColor:
                      theme.scheme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
                    borderColor: '#EF4444',
                  },
                ]}
              >
                <AppText variant="caption" color="#EF4444" style={{ fontWeight: '600', fontSize: 11 }}>
                  {item.name}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 7. Goal Advice (Lời khuyên mục tiêu) */}
      {Boolean(profile.goalAdvice) && (
        <View
          style={[
            styles.adviceBanner,
            {
              backgroundColor: colors.brandSoftTint,
              borderColor: colors.brandPrimary,
            },
          ]}
        >
          <AppText variant="caption" color={colors.brandPrimary} style={{ lineHeight: 18 }}>
            💡 <AppText variant="caption" color={colors.brandPrimary} style={{ fontWeight: '700' }}>Lời khuyên: </AppText>
            {profile.goalAdvice}
          </AppText>
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  targetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  targetItem: {
    alignItems: 'center',
    gap: 2,
  },
  targetArrowWrap: {
    alignItems: 'center',
    gap: 2,
  },
  targetDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  bmiPill: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagsContainer: {
    gap: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 0.8,
  },
  adviceBanner: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  emptyIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTextGroup: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
  },
  setupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 4,
  },
});
