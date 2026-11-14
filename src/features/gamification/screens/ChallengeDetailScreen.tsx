import React, { useMemo } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText, ProgressBar } from '@/components/common';
import {
  CheckIcon,
  ChevronLeftIcon,
  LightningBoltIcon,
  LockClosedIcon,
  SparklesIcon,
  TrophyIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'ChallengeDetail'>;

export function ChallengeDetailScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const { challengeId } = route.params;
  const { getChallengeById, joinChallenge, triggerGameEvent } = useGamification();

  const challenge = useMemo(() => {
    return getChallengeById(challengeId);
  }, [getChallengeById, challengeId]);

  if (!challenge) {
    return (
      <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
        <View style={styles.notFoundContainer}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            Không tìm thấy thông tin thử thách
          </AppText>
          <AppButton label="Quay lại" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const progressRatio = Math.min(
    1,
    challenge.currentProgress / (challenge.targetProgress || 1)
  );

  const percent = Math.round(progressRatio * 100);

  const handleJoin = () => {
    joinChallenge(challenge.id);
    Alert.alert(
      'Tham gia thành công!',
      `Bạn đã tham gia thử thách "${challenge.title}". Hãy cố gắng hoàn thành mỗi ngày nhé!`
    );
    triggerGameEvent({
      type: 'CHALLENGE_COMPLETED',
      version: 1,
      ts: new Date().toISOString(),
      payload: {
        challengeTitle: challenge.title,
        points: challenge.rewardPoints,
      },
    });
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={c.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={c.textPrimary} numberOfLines={1} style={styles.topBarTitle}>
          Chi tiết thử thách
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Banner Artwork ────────────────────────────────────────── */}
        <View style={styles.bannerWrap}>
          <Image
            source={images.courseArtwork}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <View style={[styles.tagPill, { backgroundColor: c.brandAction }]}>
              <AppText variant="caption" color="#FFFFFF">
                Thử thách cộng đồng
              </AppText>
            </View>
            <AppText variant="headlineLg" color="#FFFFFF">
              {challenge.title}
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.85)">
              Thời hạn {challenge.durationDays} ngày • Phần thưởng hấp dẫn
            </AppText>
          </View>
        </View>

        {/* ── Progress Card ─────────────────────────────────────────── */}
        <AppCard style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <AppText variant="headlineSm" color={c.textPrimary}>
              Tiến độ của bạn
            </AppText>
            <AppText variant="headlineSm" color={c.brandPrimary}>
              {percent}%
            </AppText>
          </View>

          <ProgressBar value={progressRatio} color={c.brandPrimary} />

          <View style={styles.progressStatsRow}>
            <View>
              <AppText variant="caption" color={c.textSecondary}>
                Hiện tại
              </AppText>
              <AppText variant="headlineSm" color={c.textPrimary}>
                {challenge.currentProgress.toLocaleString()} {challenge.unit}
              </AppText>
            </View>

            <View style={styles.alignRight}>
              <AppText variant="caption" color={c.textSecondary}>
                Mục tiêu
              </AppText>
              <AppText variant="headlineSm" color={c.textPrimary}>
                {challenge.targetProgress.toLocaleString()} {challenge.unit}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* ── Description & Rules ───────────────────────────────────── */}
        <AppCard style={styles.card}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            Mô tả thử thách
          </AppText>
          <AppText variant="bodyMd" color={c.textSecondary} style={styles.descText}>
            {challenge.description}
          </AppText>

          <View style={[styles.ruleItem, { backgroundColor: c.surfaceHigh }]}>
            <LightningBoltIcon size={22} color={c.brandPrimary} />
            <View style={styles.flex}>
              <AppText variant="bodySm" color={c.textPrimary} style={styles.bold}>
                Duy trì liên tục
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hệ thống tự động ghi nhận số liệu từ nhật ký dinh dưỡng và vận động của bạn.
              </AppText>
            </View>
          </View>

          <View style={[styles.ruleItem, { backgroundColor: c.surfaceHigh }]}>
            <LockClosedIcon size={22} color={c.vipStreak} />
            <View style={styles.flex}>
              <AppText variant="bodySm" color={c.textPrimary} style={styles.bold}>
                Công bằng & Minh bạch
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Chỉ tính kết quả kể từ thời điểm bạn bấm tham gia thử thách.
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* ── Rewards Section ───────────────────────────────────────── */}
        <AppCard style={styles.card}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            Phần thưởng hoàn thành
          </AppText>

          <View style={styles.rewardsRow}>
            <View style={[styles.rewardBox, { backgroundColor: c.brandSoftTint, borderColor: c.brandPrimary }]}>
              <TrophyIcon size={32} color={c.brandPrimary} />
              <AppText variant="bodySm" color={c.brandPrimary} style={styles.bold}>
                Huy hiệu danh giá
              </AppText>
              <AppText variant="caption" color={c.textSecondary} align="center">
                Mở khóa huy hiệu kỷ niệm vào hồ sơ cá nhân
              </AppText>
            </View>

            <View style={[styles.rewardBox, { backgroundColor: c.brandSoftTint, borderColor: c.vipStreak }]}>
              <SparklesIcon size={32} color={c.vipStreak} />
              <AppText variant="bodySm" color={c.vipStreak} style={styles.bold}>
                +{challenge.rewardPoints} Điểm Kallo
              </AppText>
              <AppText variant="caption" color={c.textSecondary} align="center">
                Thăng hạng trên bảng xếp hạng Bạn bè
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* ── CTA Action ────────────────────────────────────────────── */}
        <View style={styles.actionWrap}>
          {challenge.isCompleted ? (
            <View style={[styles.statusBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }]}>
              <CheckIcon size={16} color={c.quickScanner} />
              <AppText variant="bodyMd" color={c.quickScanner} style={styles.bold}>
                Bạn đã hoàn thành thử thách này!
              </AppText>
            </View>
          ) : challenge.isJoined ? (
            <View style={[styles.statusBox, { backgroundColor: c.brandSoftTint }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <CheckIcon size={16} color={c.brandPrimary} />
                <AppText variant="bodyMd" color={c.brandPrimary} style={styles.bold}>
                  Bạn đang tham gia thử thách này
                </AppText>
              </View>
              <AppText variant="caption" color={c.textSecondary} align="center">
                Hãy tiếp tục ghi chép để hoàn thành mục tiêu!
              </AppText>
            </View>
          ) : (
            <AppButton
              label="Tham gia thử thách ngay"
              variant="primary"
              onPress={handleJoin}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  bannerWrap: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 12, 25, 0.55)',
    padding: 20,
    justifyContent: 'flex-end',
    gap: 6,
  },
  tagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  card: {
    gap: 14,
    padding: 18,
    borderRadius: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  descText: {
    lineHeight: 22,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
  },
  flex: { flex: 1, gap: 2 },
  bold: { fontWeight: '700' },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rewardBox: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  rewardIcon: {
    fontSize: 32,
    marginBottom: 2,
  },
  actionWrap: {
    marginTop: 8,
  },
  statusBox: {
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    gap: 4,
  },
});
