import React, { useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppText } from '@/components/common';
import {
  CheckIcon,
  ChevronLeftIcon,
  FlameIcon,
  LockClosedIcon,
  RunningIcon,
  TrophyIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'FriendProfile'>;

export function FriendProfileScreen({ route, navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const { friendUserId } = route.params;
  const { getFriendById, unfriend } = useGamification();

  const friend = useMemo(() => {
    return getFriendById(friendUserId);
  }, [getFriendById, friendUserId]);

  if (!friend) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: c.canvasBase }]}>
        <View style={styles.notFoundContainer}>
          <AppText variant="headlineSm" color={c.textPrimary}>
            Không tìm thấy thông tin bạn bè
          </AppText>
          <AppButton label="Quay lại" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleUnfriend = () => {
    Alert.alert(
      'Hủy kết bạn',
      `Bạn có chắc chắn muốn hủy kết bạn với ${friend.name}? Người này sẽ không còn hiển thị trên bảng xếp hạng của bạn.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý hủy',
          style: 'destructive',
          onPress: () => {
            unfriend(friend.id);
            Alert.alert('Đã hủy kết bạn', `Đã hủy kết bạn với ${friend.name}`);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={c.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={c.textPrimary} style={styles.topBarTitle}>
          Hồ sơ bạn bè
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── Hero Profile Card ─────────────────────────────────────── */}
        <AppCard style={styles.heroCard}>
          <View style={[styles.avatarBig, { backgroundColor: c.brandSoftTint }]}>
            <UserSingleIcon size={44} color={c.brandPrimary} />
          </View>
          <AppText variant="headlineLg" color={c.textPrimary} align="center">
            {friend.name}
          </AppText>
          <AppText variant="bodyMd" color={c.textSecondary} align="center">
            @{friend.username} • Bạn bè {friend.since || 'gần đây'}
          </AppText>

          <View style={[styles.friendTag, { backgroundColor: c.brandSoftTint, flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
            <CheckIcon size={12} color={c.brandPrimary} />
            <AppText variant="caption" color={c.brandPrimary} style={styles.bold}>
              Bạn bè chính thức
            </AppText>
          </View>
        </AppCard>

        {/* ── Stats Grid ────────────────────────────────────────────── */}
        <AppText variant="headlineSm" color={c.textPrimary}>
          Thành tích được chia sẻ
        </AppText>

        <View style={styles.statsGrid}>
          <AppCard style={styles.statCard}>
            <FlameIcon size={26} color={c.macroProtein} />
            <AppText variant="caption" color={c.textSecondary}>
              Chuỗi Streak
            </AppText>
            <AppText variant="headlineMd" color={c.macroProtein} style={styles.bold}>
              {friend.streak} ngày
            </AppText>
          </AppCard>

          <AppCard style={styles.statCard}>
            <TrophyIcon size={26} color={c.vipStreak} />
            <AppText variant="caption" color={c.textSecondary}>
              Điểm Thử thách
            </AppText>
            <AppText variant="headlineMd" color={c.vipStreak} style={styles.bold}>
              {friend.challengeScore} đ
            </AppText>
          </AppCard>

          <AppCard style={styles.statCard}>
            <RunningIcon size={26} color={c.brandPrimary} />
            <AppText variant="caption" color={c.textSecondary}>
              Bước chân tuần
            </AppText>
            <AppText variant="headlineMd" color={c.brandPrimary} style={styles.bold}>
              {friend.weeklySteps.toLocaleString()}
            </AppText>
          </AppCard>
        </View>

        {/* ── Privacy Guarantee Card ─────────────────────────────────── */}
        <AppCard style={[styles.privacyCard, { backgroundColor: c.surfaceHigh }]}>
          <View style={styles.privacyHeader}>
            <LockClosedIcon size={22} color={c.brandPrimary} />
            <AppText variant="headlineSm" color={c.textPrimary}>
              Quyền riêng tư & Bảo mật
            </AppText>
          </View>
          <AppText variant="bodySm" color={c.textSecondary} style={styles.privacyDesc}>
            Theo tiêu chuẩn bảo mật dữ liệu sức khỏe của Kallo, thông tin cân nặng, lịch sử bữa ăn chi tiết và địa chỉ email cá nhân hoàn toàn được bảo mật và không bao giờ chia sẻ công khai.
          </AppText>
        </AppCard>

        {/* ── Unfriend Action ───────────────────────────────────────── */}
        <View style={styles.actionWrap}>
          <TouchableOpacity
            style={[styles.unfriendButton, { borderColor: c.statusDanger, backgroundColor: 'rgba(255, 90, 95, 0.12)' }]}
            onPress={handleUnfriend}
          >
            <AppText variant="bodyMd" color={c.statusDanger} style={styles.bold}>
              Hủy kết bạn
            </AppText>
          </TouchableOpacity>
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
  heroCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    gap: 8,
  },
  avatarBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarGlyphText: {
    fontSize: 40,
  },
  friendTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 6,
  },
  bold: { fontWeight: '700' },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    gap: 4,
  },
  statEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  privacyCard: {
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyDesc: {
    lineHeight: 20,
  },
  actionWrap: {
    marginTop: 12,
  },
  unfriendButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
