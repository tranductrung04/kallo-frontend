import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'StreakDetail'>;

export function StreakDetailModal({ navigation }: Props) {
  const theme = useTheme();
  const { streak, freezeStreak } = useGamification();

  const isAchievedMilestone = streak.currentStreak >= 7;
  const isFrozen = streak.isFrozenToday;

  const bgImage = isFrozen
    ? images.streakFreezeBg
    : isAchievedMilestone
    ? images.streakAchievedBg
    : streak.isMaintainedToday
    ? images.streakActiveBg
    : images.streakInactiveBg;

  const chainImage = isFrozen
    ? images.streakProtectedBg
    : isAchievedMilestone
    ? images.streakAchieveChainBg
    : images.streakChainBg;

  const artImage = isFrozen
    ? images.streakFreezeArt1
    : isAchievedMilestone
    ? images.streakAchievedArt1
    : null;

  const handleFreeze = () => {
    if (streak.freezeDaysRemaining <= 0) {
      Alert.alert('Hết lượt bảo vệ', 'Bạn đã sử dụng hết ngày đóng băng chuỗi.');
      return;
    }
    const success = freezeStreak();
    if (success) {
      Alert.alert(
        'Đã bảo vệ chuỗi! 🛡️',
        'Chuỗi Streak của bạn hôm nay đã được bảo vệ an toàn ngay cả khi bạn bận rộn.'
      );
    }
  };

  const handleShare = () => {
    Alert.alert(
      'Chia sẻ thành tích 🎉',
      `Tôi đã duy trì thói quen sống khỏe ${streak.currentStreak} ngày liên tiếp cùng Kallo! #KalloHealth #Streak${streak.currentStreak}`
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <View style={styles.container}>
        {/* ── Background Wall ─────────────────────────────────────────── */}
        <Image
          source={bgImage}
          style={styles.bgCover}
          resizeMode="cover"
        />

        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Đóng modal streak"
          >
            <AppText variant="headlineSm" color="#FFFFFF">✕</AppText>
          </TouchableOpacity>
          <AppText variant="headlineSm" color="#FFFFFF">
            Chuỗi ngày Kallo Streak
          </AppText>
          <TouchableOpacity
            style={styles.shareHeaderBtn}
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ chuỗi ngày"
          >
            <AppText variant="headlineSm" color="#FFFFFF">↗</AppText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ── Main Streak Display ───────────────────────────────────── */}
          <View style={styles.streakHero}>
            <Image
              source={chainImage}
              style={styles.chainImage}
              resizeMode="contain"
            />

            {artImage && (
              <Image
                source={artImage}
                style={styles.artImage}
                resizeMode="contain"
              />
            )}

            <View style={styles.counterWrap}>
              <AppText variant="display" color="#FFFFFF" style={styles.streakNumber}>
                {streak.currentStreak}
              </AppText>
              <AppText variant="headlineSm" color="rgba(255,255,255,0.9)">
                NGÀY LIÊN TIẾP 🔥
              </AppText>
              <AppText variant="bodySm" color="rgba(255,255,255,0.8)">
                {isFrozen
                  ? 'Chuỗi đang được bảo vệ hôm nay 🛡️'
                  : streak.isMaintainedToday
                  ? 'Bạn đã hoàn thành mục tiêu hôm nay!'
                  : 'Hãy ghi đủ nhật ký để duy trì chuỗi nhé!'}
              </AppText>
            </View>
          </View>

          {/* ── Streak Statistics ─────────────────────────────────────── */}
          <AppCard style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Kỷ lục cao nhất
                </AppText>
                <AppText variant="headlineLg" color={theme.colors.brandPrimary}>
                  {streak.longestStreak} ngày
                </AppText>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Lượt đóng băng còn
                </AppText>
                <AppText variant="headlineLg" color={theme.colors.calorieBurned}>
                  {streak.freezeDaysRemaining} lượt
                </AppText>
              </View>
            </View>
          </AppCard>

          {/* ── Freeze Protection Action Card ─────────────────────────── */}
          <AppCard style={styles.card}>
            <AppText variant="headlineSm">Khiên đóng băng Streak</AppText>
            <AppText variant="bodySm" color={theme.colors.textSecondary}>
              Bảo vệ chuỗi thành tích không bị ngắt quãng vào những ngày bạn bận rộn hoặc đi du lịch.
            </AppText>

            <AppButton
              label={
                isFrozen
                  ? 'Đã bảo vệ chuỗi hôm nay ✓'
                  : `Kích hoạt đóng băng (${streak.freezeDaysRemaining} lượt còn lại)`
              }
              variant={isFrozen ? 'secondary' : 'primary'}
              onPress={handleFreeze}
              disabled={isFrozen || streak.freezeDaysRemaining <= 0}
            />
          </AppCard>

          {/* ── Streak Rules Card ─────────────────────────────────────── */}
          <AppCard style={styles.card}>
            <AppText variant="headlineSm">Quy tắc tính Streak (FR-GAM-01)</AppText>
            <View style={styles.rulesList}>
              <AppText variant="bodySm">
                ✓ Ghi nhận ít nhất <AppText variant="headlineSm">2 bữa ăn</AppText> trong ngày.
              </AppText>
              <AppText variant="bodySm">
                ✓ Tổng calo nạp nằm trong sai số <AppText variant="headlineSm">±10% mục tiêu</AppText>.
              </AppText>
              <AppText variant="bodySm">
                ✓ Hệ thống tự động kiểm tra vào 23:59 mỗi đêm.
              </AppText>
            </View>
          </AppCard>

          {/* ── Share Chain Banner ────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.shareBanner}
            onPress={handleShare}
            activeOpacity={0.88}
          >
            <Image
              source={images.streakShareChainBg}
              style={styles.shareBannerImage}
              resizeMode="cover"
            />
            <View style={styles.shareBannerOverlay}>
              <AppText variant="headlineSm" color="#FFFFFF">
                Chia sẻ lên Facebook / Zalo
              </AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.85)">
                Lan tỏa tinh thần sống khỏe cùng bạn bè
              </AppText>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  bgCover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  streakHero: {
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  chainImage: {
    width: '100%',
    height: 180,
    position: 'absolute',
    top: 10,
    opacity: 0.8,
  },
  artImage: {
    width: 140,
    height: 140,
    marginBottom: 8,
  },
  counterWrap: {
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  streakNumber: {
    fontSize: 72,
    lineHeight: 78,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  card: { gap: 12 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', gap: 4 },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(128,128,128,0.2)',
  },
  rulesList: { gap: 6 },
  shareBanner: {
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  shareBannerImage: {
    width: '100%',
    height: '100%',
  },
  shareBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 18, 30, 0.45)',
    padding: 16,
    justifyContent: 'center',
    gap: 4,
  },
});
