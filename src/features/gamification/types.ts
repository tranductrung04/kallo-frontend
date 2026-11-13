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
