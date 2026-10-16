export type StreakStatus = 'active' | 'inactive' | 'achieved' | 'frozen';

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  freezeDaysRemaining: number;
  isMaintainedToday: boolean;
  isFrozenToday: boolean;
  lastCompletedDate?: string;
};

export type BadgeCategory = 'streak' | 'nutrition' | 'activity' | 'milestone';

export type Badge = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: BadgeCategory;
  isUnlocked: boolean;
  unlockedAt?: string;
  iconGlyph: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  currentDay: number;
  targetProgress: number;
  currentProgress: number;
  unit: string;
  rewardPoints: number;
  isJoined: boolean;
  isCompleted: boolean;
};

export type FriendStatus = 'friend' | 'pending_sent' | 'pending_received';

export type Friend = {
  id: string;
  name: string;
  username: string;
  avatarGlyph: string;
  streak: number;
  challengeScore: number;
  weeklySteps: number;
  isSharing: boolean;
  status: FriendStatus;
};

export type LeaderboardMetric = 'streak' | 'challenge' | 'steps';

export type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  avatarGlyph: string;
  score: number;
  unit: string;
  isCurrentUser?: boolean;
};
