export type StreakStatus = 'active' | 'inactive' | 'achieved' | 'frozen';

export type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  freezeDaysRemaining: number;
  isMaintainedToday: boolean;
  isFrozenToday: boolean;
  lastCompletedDate?: string;
  todayCompleted?: boolean;
  atRisk?: boolean;
};

export type BadgeCategory = 'streak' | 'nutrition' | 'activity' | 'milestone';

export type BadgeIconName =
  | 'book-open'
  | 'flame'
  | 'users'
  | 'calendar'
  | 'trophy'
  | 'crown'
  | 'badge-check';

export type Badge = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: BadgeCategory;
  isUnlocked: boolean;
  unlockedAt?: string;
  iconGlyph: string;
  points?: number;
  condition?: string;
  iconName?: BadgeIconName | string;
  accentColor?: string;
  secondaryColor?: string;
  darkCanvasColor?: string;
  glowColor?: string;
};

export type ChallengeStatus = 'available' | 'joined' | 'completed' | 'expired';

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
  startDate?: string;
  endDate?: string;
  daysLeft?: number;
  metric?: string;
  badgeReward?: Badge | null;
  status?: ChallengeStatus;
  category?: 'water' | 'steps' | 'log' | 'calorie' | 'eating';
  rewardBadgeTitle?: string;
  highlightBadge?: string;
};

export type FriendStatus = 'friend' | 'pending_sent' | 'pending_received';

export type Friend = {
  id: string;
  name: string;
  username: string;
  avatarGlyph: string;
  avatarUrl?: string;
  streak: number;
  challengeScore: number;
  weeklySteps: number;
  isSharing: boolean;
  status: FriendStatus;
  since?: string;
  tag?: string;
  rankJump?: string;
  activityStatus?: string;
  verified?: boolean;
  online?: boolean;
  mutualFriendsCount?: number;
};

export type LeaderboardMetric = 'streak' | 'challenge' | 'steps';

export type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  avatarGlyph: string;
  avatarUrl?: string;
  score: number;
  unit: string;
  isCurrentUser?: boolean;
  streakDays?: number;
  tag?: string;
  rankChange?: string;
  subtitle?: string;
};

// ── New types for additional screens ──────────────────────────────────────────

export type SearchRelationship = 'NONE' | 'PENDING_OUT' | 'PENDING_IN' | 'FRIENDS';

export type UserSearchResult = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  relationship: SearchRelationship;
};

export type FriendRequest = {
  id: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    mutualFriendsCount?: number;
    verified?: boolean;
    online?: boolean;
  };
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
};

export type GameSettings = {
  friendCode: string;
  discoverable: boolean;
  shareStreak: boolean;
  sharePoints: boolean;
  shareSteps: boolean;
};

export type GameEventType =
  | 'BADGE_EARNED'
  | 'CHALLENGE_COMPLETED'
  | 'STREAK_UPDATED'
  | 'FRIEND_REQUEST_RECEIVED'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'LEADERBOARD_UPDATE';

export type GameEvent = {
  type: GameEventType;
  version: number;
  ts: string;
  payload: Record<string, unknown>;
};
