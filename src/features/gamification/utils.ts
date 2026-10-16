import type { Badge, Challenge, Friend, LeaderboardEntry, LeaderboardMetric, StreakInfo } from './types';

// Rule per REQUIREMENT.md (line 453):
// Daily goal achieved if >= 2 meals logged AND calories within +-10% of goal
export function checkDailyGoalAchieved(
  mealsLoggedCount: number,
  caloriesIn: number,
  caloriesGoal: number
): boolean {
  if (mealsLoggedCount < 2 || caloriesGoal <= 0) return false;
  const tolerance = caloriesGoal * 0.1;
  return Math.abs(caloriesIn - caloriesGoal) <= tolerance;
}

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-log',
    code: 'FIRST_LOG',
    title: 'Khởi đầu xanh',
    description: 'Ghi nhận bữa ăn đầu tiên vào nhật ký Kallo',
    category: 'nutrition',
    isUnlocked: true,
    unlockedAt: '2026-10-10',
    iconGlyph: '🌱',
  },
  {
    id: 'badge-streak-7',
    code: 'STREAK_7',
    title: 'Chiến binh 7 ngày',
    description: 'Duy trì chuỗi hoàn thành mục tiêu 7 ngày liên tiếp',
    category: 'streak',
    isUnlocked: true,
    unlockedAt: '2026-10-15',
    iconGlyph: '🔥',
  },
  {
    id: 'badge-streak-30',
    code: 'STREAK_30',
    title: 'Bền bỉ 30 ngày',
    description: 'Duy trì chuỗi hoàn thành mục tiêu 30 ngày liên tiếp',
    category: 'streak',
    isUnlocked: false,
    iconGlyph: '🏆',
  },
  {
    id: 'badge-water-hero',
    code: 'WATER_HERO',
    title: 'Thủy thần Kallo',
    description: 'Uống đủ 2.000 ml nước trong ngày',
    category: 'nutrition',
    isUnlocked: true,
    unlockedAt: '2026-10-14',
    iconGlyph: '💧',
  },
  {
    id: 'badge-steps-10k',
    code: 'STEPS_10K',
    title: 'Vạn bước chân',
    description: 'Chinh phục 10.000 bước chân trong một ngày',
    category: 'activity',
    isUnlocked: false,
    iconGlyph: '👟',
  },
  {
    id: 'badge-macro-master',
    code: 'MACRO_MASTER',
    title: 'Bậc thầy Macro',
    description: 'Đạt chuẩn tỷ lệ Protein, Carbs, Fat trong sai số 5%',
    category: 'milestone',
    isUnlocked: false,
    iconGlyph: '⚖️',
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-water-7d',
    title: 'Uống đủ 2L nước 7 ngày',
    description: 'Thanh lọc cơ thể và tăng cường trao đổi chất với 2.000ml nước mỗi ngày.',
    durationDays: 7,
    currentDay: 4,
    targetProgress: 7,
    currentProgress: 4,
    unit: 'ngày',
    rewardPoints: 150,
    isJoined: true,
    isCompleted: false,
  },
  {
    id: 'challenge-steps-50k',
    title: 'Tuần lễ 50.000 bước chân',
    description: 'Tích lũy vận động hàng ngày để tiêu hao calo và cải thiện sức khỏe tim mạch.',
    durationDays: 7,
    currentDay: 3,
    targetProgress: 50000,
    currentProgress: 24800,
    unit: 'bước',
    rewardPoints: 200,
    isJoined: true,
    isCompleted: false,
  },
  {
    id: 'challenge-clean-eating',
    title: 'Ăn lành mạnh 14 ngày',
    description: 'Ghi nhật ký đủ 3 bữa chính và không vượt calo mục tiêu liên tục 2 tuần.',
    durationDays: 14,
    currentDay: 1,
    targetProgress: 14,
    currentProgress: 0,
    unit: 'ngày',
    rewardPoints: 500,
    isJoined: false,
    isCompleted: false,
  },
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    name: 'Minh Hoàng',
    username: 'hoang_runner',
    avatarGlyph: '🏃‍♂️',
    streak: 14,
    challengeScore: 420,
    weeklySteps: 56200,
    isSharing: true,
    status: 'friend',
  },
  {
    id: 'friend-2',
    name: 'Thảo My',
    username: 'my_healthy',
    avatarGlyph: '🥗',
    streak: 9,
    challengeScore: 310,
    weeklySteps: 42100,
    isSharing: true,
    status: 'friend',
  },
  {
    id: 'friend-3',
    name: 'Tuấn Anh',
    username: 'tuan_fit',
    avatarGlyph: '🏋️‍♂️',
    streak: 7,
    challengeScore: 280,
    weeklySteps: 38400,
    isSharing: true,
    status: 'friend',
  },
  {
    id: 'friend-4',
    name: 'Phương Linh',
    username: 'linh_pilates',
    avatarGlyph: '🧘‍♀️',
    streak: 5,
    challengeScore: 210,
    weeklySteps: 31000,
    isSharing: false, // User chose not to share (FR-GAM-07)
    status: 'friend',
  },
];

export function buildLeaderboard(
  metric: LeaderboardMetric,
  friends: Friend[],
  currentUser: { name: string; streak: number; challengeScore: number; weeklySteps: number; isSharing: boolean }
): LeaderboardEntry[] {
  const visibleFriends = friends.filter((f) => f.status === 'friend' && f.isSharing);

  const rawList: Array<{ id: string; name: string; avatarGlyph: string; score: number; isCurrentUser?: boolean }> = [];

  // Add current user if sharing enabled
  if (currentUser.isSharing) {
    const userScore =
      metric === 'streak'
        ? currentUser.streak
        : metric === 'challenge'
        ? currentUser.challengeScore
        : currentUser.weeklySteps;

    rawList.push({
      id: 'current-user',
      name: `${currentUser.name} (Bạn)`,
      avatarGlyph: '⭐',
      score: userScore,
      isCurrentUser: true,
    });
  }

  // Add friends
  for (const f of visibleFriends) {
    const score =
      metric === 'streak'
        ? f.streak
        : metric === 'challenge'
        ? f.challengeScore
        : f.weeklySteps;

    rawList.push({
      id: f.id,
      name: f.name,
      avatarGlyph: f.avatarGlyph,
      score,
      isCurrentUser: false,
    });
  }

  // Sort descending
  rawList.sort((a, b) => b.score - a.score);

  const unit =
    metric === 'streak' ? 'ngày' : metric === 'challenge' ? 'điểm' : 'bước';

  return rawList.map((item, index) => ({
    rank: index + 1,
    id: item.id,
    name: item.name,
    avatarGlyph: item.avatarGlyph,
    score: item.score,
    unit,
    isCurrentUser: item.isCurrentUser,
  }));
}
