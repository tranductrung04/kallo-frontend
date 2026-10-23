import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { images } from '@/assets/images';
import {
  CampfireFlameIcon,
  CelebrationPopperBadge,
  CirclePlusIcon,
  FlameIcon,
  MilestoneCalendarBadge,
  SaladBowlIcon,
  StreakGoalFlagIcon,
} from '@/components/icons';

// ─── 1. Streak Hero Widget ────────────────────────────────────────────────────

export type StreakHeroWidgetProps = {
  currentStreak: number;
};

export function StreakHeroWidget({ currentStreak }: StreakHeroWidgetProps) {
  return (
    <View style={styles.heroSection}>
      <View style={styles.heroTextWrap}>
        <AppText style={styles.streakBigNumber}>{currentStreak}</AppText>
        <AppText style={styles.streakSubtitle}>Ngày liên tiếp</AppText>
      </View>

      <CampfireFlameIcon size={116} streak={currentStreak} />
    </View>
  );
}

// ─── 2. Streak Action Card Widget ─────────────────────────────────────────────

export type StreakActionCardWidgetProps = {
  streak?: number;
  onLogMeal?: () => void;
};

export function StreakActionCardWidget({
  streak = 0,
  onLogMeal,
}: StreakActionCardWidgetProps) {
  // Khi streak = 0: giữ thẻ hành động ghi món hiện tại và dùng ảnh fooddefault.webp
  if (streak <= 0) {
    return (
      <View style={styles.actionCard}>
        <View style={styles.foodAvatarContainer}>
          <Image
            source={require('@/assets/images/src_assets_images_fooddefault.webp')}
            style={styles.foodAvatar}
            resizeMode="contain"
          />
        </View>

        <View style={styles.actionCardRight}>
          <AppText style={styles.actionCardTitle}>
            Ghi lại món bạn đã ăn hôm nay để tiếp tục duy trì chuỗi ngày của bạn!
          </AppText>

          <TouchableOpacity
            style={styles.logFoodButton}
            onPress={onLogMeal}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Ghi món"
          >
            <CirclePlusIcon size={20} circleColor="#B066FE" plusColor="#1D172D" />
            <AppText style={styles.logFoodButtonText}>Ghi món</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Khi streak > 0: hiển thị thẻ ăn mừng với biểu tượng pháo giấy chúc mừng
  return (
    <View style={styles.celebrationCard}>
      <View style={styles.celebrationBadgeWrap}>
        <CelebrationPopperBadge size={54} />
      </View>

      <View style={styles.celebrationTextWrap}>
        <AppText style={styles.celebrationTitle}>
          Hãy tiếp tục kiên trì để tiến gần hơn tới mục tiêu của bạn.
        </AppText>
      </View>
    </View>
  );
}

// ─── 3. Streak Challenge Widget ───────────────────────────────────────────────

export type StreakChallengeWidgetProps = {
  currentStreak: number;
  targetDays?: number;
};

export function StreakChallengeWidget({
  currentStreak,
  targetDays = 3,
}: StreakChallengeWidgetProps) {
  const progressRatio = Math.min(currentStreak / 14, 1);

  // Mốc đã đạt HOẶC là target thì sáng màu, còn lại tối màu
  const isBadge3Bright = currentStreak >= 3 || targetDays === 3;
  const isBadge7Bright = currentStreak >= 7 || targetDays === 7;
  const isBadge14Bright = currentStreak >= 14 || targetDays === 14;

  return (
    <View style={styles.sectionWrap}>
      <AppText style={styles.sectionHeading}>Thử thách của bạn</AppText>

      <View style={styles.challengeCard}>
        <View style={styles.challengeHeaderRow}>
          <AppText style={styles.challengeLabel}>Chuỗi của bạn</AppText>
          <AppText style={styles.challengeTarget}>
            {currentStreak}/{targetDays} ngày
          </AppText>
        </View>

        <View style={styles.trackContainer}>
          <View style={styles.trackBarBase}>
            <View
              style={[
                styles.trackBarProgress,
                { width: `${Math.max(progressRatio * 100, 0)}%` },
              ]}
            />
          </View>

          {/* Mốc 1: 3 ngày */}
          <View style={[styles.milestoneMarker, { left: '18%' }]}>
            <MilestoneCalendarBadge
              days={3}
              isActive={isBadge3Bright}
              isAchieved={currentStreak >= 3}
            />
          </View>

          {/* Mốc 2: 7 ngày */}
          <View style={[styles.milestoneMarker, { left: '50%' }]}>
            <MilestoneCalendarBadge
              days={7}
              isActive={isBadge7Bright}
              isAchieved={currentStreak >= 7}
            />
          </View>

          {/* Mốc 3: 14 ngày */}
          <View style={[styles.milestoneMarker, { left: '82%' }]}>
            <MilestoneCalendarBadge
              days={14}
              isActive={isBadge14Bright}
              isAchieved={currentStreak >= 14}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── 4. Streak Week Widget ────────────────────────────────────────────────────

export type StreakWeekWidgetProps = {
  currentStreak: number;
  todayDayIndex: number;
  weekDays?: string[];
  targetDays?: number;
};

export function StreakWeekWidget({
  currentStreak,
  todayDayIndex,
  targetDays = 3,
}: StreakWeekWidgetProps) {
  // Danh sách các thứ trong tuần (T2 -> CN)
  const ALL_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  // Xác định ngày bắt đầu của 7 ngày hiển thị:
  // Nếu streak > 0, ngày đầu tiên là ngày bắt đầu streak sao cho hôm nay là ngày thứ currentStreak
  const streakOffset = currentStreak > 0 ? Math.min(currentStreak - 1, 6) : 0;
  const startIndex = (todayDayIndex - streakOffset + 7) % 7;

  const rollingWeek = Array.from({ length: 7 }, (_, i) => {
    const dayLabel = ALL_DAYS[(startIndex + i) % 7];
    const isCompleted = currentStreak > 0 && i < currentStreak;
    const isTarget = i === targetDays - 1 && !isCompleted;
    const isToday = i === streakOffset;

    return {
      index: i,
      dayLabel,
      isCompleted,
      isTarget,
      isToday,
    };
  });

  return (
    <View style={styles.sectionWrap}>
      <AppText style={styles.sectionHeading}>Mục tiêu chuỗi</AppText>

      <View style={styles.weekCard}>
        <View style={styles.weekRow}>
          {rollingWeek.map((item) => (
            <View key={`${item.dayLabel}-${item.index}`} style={styles.dayCol}>
              <View style={styles.dayIconSlot}>
                {item.isCompleted ? (
                  <FlameIcon size={34} color="#F44E42" coreColor="#FA9A91" />
                ) : item.isTarget ? (
                  <StreakGoalFlagIcon width={34} height={38} />
                ) : (
                  <View style={styles.dayCircle} />
                )}
              </View>
              <AppText
                style={[
                  styles.dayText,
                  (item.isCompleted || item.isToday) && styles.dayTextActive,
                ]}
              >
                {item.dayLabel}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── 5. Streak Bottom Stats Widget ────────────────────────────────────────────

export type StreakBottomStatsWidgetProps = {
  currentStreak: number;
  freezeDaysRemaining: number;
  longestStreak?: number;
  onShieldPress: () => void;
};

export function StreakBottomStatsWidget({
  currentStreak,
  freezeDaysRemaining,
  longestStreak = 0,
  onShieldPress,
}: StreakBottomStatsWidgetProps) {
  const displayBestStreak = Math.max(longestStreak, currentStreak);

  return (
    <View style={styles.bottomStatsWrap}>
      <View style={styles.bottomStatsRow}>
        {/* Thẻ Chuỗi hiện tại */}
        <View style={styles.statMiniCard}>
          <View style={styles.statIconWrap}>
            <FlameIcon
              size={34}
              color="#F44E42"
              coreColor="#FA9A91"
            />
          </View>
          <View style={styles.statTextWrap}>
            <AppText style={styles.statLabel}>Chuỗi hiện tại</AppText>
            <AppText style={styles.statValue}>{currentStreak} ngày</AppText>
          </View>
        </View>

        {/* Thẻ Khiên Kallo */}
        <Pressable
          style={({ pressed }) => [
            styles.statMiniCard,
            pressed && { opacity: 0.8 },
          ]}
          onPress={onShieldPress}
          accessibilityRole="button"
          accessibilityLabel="Khiên Kallo bảo vệ"
        >
          <View style={styles.statIconWrap}>
            <Image
              source={images.streakRuleShield}
              style={styles.shieldIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.statTextWrap}>
            <AppText style={styles.statLabel}>Khiên Kallo</AppText>
            <AppText style={styles.statValue}>{freezeDaysRemaining}/2</AppText>
          </View>
        </Pressable>
      </View>

      {/* Thẻ Chuỗi tốt nhất */}
      <View style={styles.bestStreakCard}>
        <View style={styles.statIconWrap}>
          <Image
            source={images.streakBestTrophy}
            style={styles.trophyIcon}
            resizeMode="contain"
          />
        </View>
        <View style={styles.statTextWrap}>
          <AppText style={styles.statLabel}>Chuỗi tốt nhất</AppText>
          <AppText style={styles.statValue}>{displayBestStreak} ngày</AppText>
        </View>
      </View>
    </View>
  );
}

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Hero Section ──
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  heroTextWrap: {
    justifyContent: 'center',
  },
  streakBigNumber: {
    fontSize: 72,
    lineHeight: 76,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    textAlign: 'center',
  },
  streakSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 4,
  },

  // ── Action Card (streak = 0) ──
  actionCard: {
    backgroundColor: '#1F1A2D',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  foodAvatarContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  foodAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
  },
  saladAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F9F2D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionCardRight: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logFoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  logFoodButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B066FE',
    marginLeft: 6,
  },

  // ── Celebration Card (streak > 0) ──
  celebrationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  celebrationBadgeWrap: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  celebrationTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  celebrationTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── Section ──
  sectionWrap: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  // ── Challenge Card ──
  challengeCard: {
    backgroundColor: '#1F1A2D',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  challengeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A09BAF',
  },
  challengeTarget: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trackContainer: {
    height: 52,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  trackBarBase: {
    height: 14,
    backgroundColor: '#3C3B4D',
    borderRadius: 7,
    width: '100%',
    overflow: 'hidden',
  },
  trackBarProgress: {
    height: '100%',
    backgroundColor: '#F7524A',
    borderRadius: 7,
  },
  milestoneMarker: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateX: -18 }, { translateY: -20 }],
  },

  // ── Week Card ──
  weekCard: {
    backgroundColor: '#1F1A2D',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayIconSlot: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#363346',
  },
  dayText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#8A859C',
    textAlign: 'center',
  },
  dayTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Bottom Summary ──
  bottomStatsWrap: {
    marginTop: 6,
    gap: 12,
  },
  bottomStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bestStreakCard: {
    backgroundColor: '#1F1A2D',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: '#1F1A2D',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D2640',
  },
  statIconWrap: {
    width: 38,
    height: 38,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldIcon: {
    width: 36,
    height: 36,
  },
  trophyIcon: {
    width: 58,
    height: 58,
  },
  statTextWrap: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
});
