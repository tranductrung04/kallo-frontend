import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@/features/auth/AuthProvider';
import { IS_DEMO_MODE } from '@/features/auth/localAccount';
import { NutritionContext } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import { getAccessToken } from '@/services/api/tokenStorage';
import { getStreak, getStreakApiErrorMessage } from './api';
import type {
  Badge,
  Challenge,
  Friend,
  FriendRequest,
  GameEvent,
  GameSettings,
  LeaderboardEntry,
  LeaderboardMetric,
  StreakInfo,
  UserSearchResult,
} from './types';
import {
  buildLeaderboard,
  INITIAL_BADGES,
  INITIAL_CHALLENGES,
  INITIAL_FRIENDS,
  INITIAL_GAME_SETTINGS,
  INITIAL_INCOMING_REQUESTS,
  INITIAL_OUTGOING_REQUESTS,
  MOCK_SEARCH_USERS,
} from './utils';

const STORAGE_KEY = IS_DEMO_MODE ? '@kallo/gamification-demo-v1' : '@kallo/gamification-prod-v1';

const DEMO_STREAK: StreakInfo = {
  currentStreak: 7,
  longestStreak: 12,
  freezeDaysRemaining: 2,
  isMaintainedToday: true,
  isFrozenToday: false,
  lastCompletedDate: '2026-10-15',
  todayCompleted: true,
  atRisk: false,
};

const INITIAL_STREAK: StreakInfo = {
  currentStreak: 0,
  longestStreak: 0,
  freezeDaysRemaining: 2,
  isMaintainedToday: false,
  isFrozenToday: false,
  lastCompletedDate: undefined,
  todayCompleted: false,
  atRisk: false,
};

export type GamificationContextValue = {
  streak: StreakInfo;
  isStreakLoading: boolean;
  streakError: string | null;
  refreshStreak: () => Promise<StreakInfo | null>;
  badges: Badge[];
  challenges: Challenge[];
  friends: Friend[];
  isSharingPrivacy: boolean;
  gameSettings: GameSettings;
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  activeToast: GameEvent | null;
  freezeStreak: () => boolean;
  unlockBadge: (badgeId: string) => void;
  joinChallenge: (challengeId: string) => void;
  sendFriendRequest: (username: string) => boolean;
  sendFriendRequestToUser: (target: string) => { success: boolean; message: string };
  acceptFriendRequest: (friendId: string) => void;
  respondFriendRequest: (requestId: string, action: 'ACCEPT' | 'DECLINE') => void;
  cancelFriendRequest: (requestId: string) => void;
  unfriend: (friendId: string) => void;
  toggleSharingPrivacy: () => void;
  updateGameSettings: (newSettings: Partial<GameSettings>) => void;
  getLeaderboard: (metric: LeaderboardMetric) => LeaderboardEntry[];
  searchUsers: (query: string) => UserSearchResult[];
  getChallengeById: (id: string) => Challenge | undefined;
  getFriendById: (id: string) => Friend | undefined;
  dismissToast: () => void;
  triggerGameEvent: (event: GameEvent) => void;
};

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: React.PropsWithChildren) {
  const auth = useContext(AuthContext);
  const nutrition = useContext(NutritionContext);
  const [streak, setStreak] = useState<StreakInfo>(IS_DEMO_MODE ? DEMO_STREAK : INITIAL_STREAK);

  const [isStreakLoading, setIsStreakLoading] = useState(false);
  const [streakError, setStreakError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const [badges, setBadges] = useState<Badge[]>(
    IS_DEMO_MODE
      ? INITIAL_BADGES
      : INITIAL_BADGES.map((b) => ({ ...b, isUnlocked: false, unlockedAt: undefined }))
  );
  const [challenges, setChallenges] = useState<Challenge[]>(
    IS_DEMO_MODE
      ? INITIAL_CHALLENGES
      : INITIAL_CHALLENGES.map((c) => ({ ...c, isJoined: false, isCompleted: false, currentProgress: 0 }))
  );
  const [friends, setFriends] = useState<Friend[]>(IS_DEMO_MODE ? INITIAL_FRIENDS : []);
  const [gameSettings, setGameSettings] = useState<GameSettings>(INITIAL_GAME_SETTINGS);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>(
    IS_DEMO_MODE ? INITIAL_INCOMING_REQUESTS : []
  );
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>(
    IS_DEMO_MODE ? INITIAL_OUTGOING_REQUESTS : []
  );
  const [activeToast, setActiveToast] = useState<GameEvent | null>(null);

  const isSharingPrivacy = gameSettings.sharePoints || gameSettings.shareStreak;

  // Tự động kiểm tra và cập nhật streak khi có món ăn được ghi nhận hôm nay (Offline-First)
  useEffect(() => {
    if (!nutrition?.ready) return;
    const today = todayKey();
    const hasMealToday = nutrition.state.foodLogs.some((log) => log.date === today);

    if (hasMealToday) {
      setStreak((prev) => {
        if (prev.todayCompleted && prev.currentStreak > 0) return prev;
        const newCurrent = prev.currentStreak > 0 ? prev.currentStreak : 1;
        return {
          ...prev,
          currentStreak: newCurrent,
          longestStreak: Math.max(prev.longestStreak, newCurrent),
          todayCompleted: true,
          isMaintainedToday: true,
          atRisk: false,
          lastCompletedDate: today,
        };
      });
    }
  }, [nutrition?.ready, nutrition?.state.foodLogs]);

  const refreshStreak = useCallback(async (): Promise<StreakInfo | null> => {
    if (IS_DEMO_MODE) {
      return null;
    }
    try {
      const token = await getAccessToken();
      if (!token) {
        return null;
      }
      setIsStreakLoading(true);
      setStreakError(null);
      const res = await getStreak();
      let updated: StreakInfo | null = null;
      setStreak((prev) => {
        const today = todayKey();
        const hasMealToday = nutrition?.state.foodLogs.some((log) => log.date === today) ?? false;
        const isTodayDone = res.todayCompleted || hasMealToday;
        const current = res.currentStreak > 0 ? res.currentStreak : (hasMealToday ? Math.max(prev.currentStreak, 1) : 0);
        const longest = Math.max(res.longestStreak, current, prev.longestStreak);

        updated = {
          ...prev,
          currentStreak: current,
          longestStreak: longest,
          lastCompletedDate: isTodayDone ? today : (res.lastCompletedDate ?? undefined),
          todayCompleted: isTodayDone,
          isMaintainedToday: isTodayDone,
          atRisk: isTodayDone ? false : res.atRisk,
        };
        return updated;
      });
      return updated;
    } catch (err) {
      const msg = getStreakApiErrorMessage(err);
      setStreakError(msg);
      console.warn('[GamificationProvider] getStreak failed (offline fallback active):', err);
      return null;
    } finally {
      setIsStreakLoading(false);
    }
  }, [nutrition?.state.foodLogs]);

  // Restore cache
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (!data) {
        setIsReady(true);
        return;
      }
      try {
        const parsed = JSON.parse(data);
        if (parsed.streak) setStreak(parsed.streak);
        if (Array.isArray(parsed.badges)) setBadges(parsed.badges);
        if (Array.isArray(parsed.challenges)) setChallenges(parsed.challenges);
        if (Array.isArray(parsed.friends)) setFriends(parsed.friends);
        if (parsed.gameSettings) setGameSettings(parsed.gameSettings);
        if (Array.isArray(parsed.incomingRequests)) setIncomingRequests(parsed.incomingRequests);
        if (Array.isArray(parsed.outgoingRequests)) setOutgoingRequests(parsed.outgoingRequests);
      } catch {
        /* Ignore invalid cache */
      }
      setIsReady(true);
    });
  }, []);

  // Fetch streak once cache is ready and user is signed in
  useEffect(() => {
    if (isReady && (!auth || auth.status === 'signedIn')) {
      void refreshStreak();
    }
  }, [isReady, auth?.status, refreshStreak]);

  // Save changes
  useEffect(() => {
    void AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streak,
        badges,
        challenges,
        friends,
        gameSettings,
        incomingRequests,
        outgoingRequests,
      })
    ).catch(() => undefined);
  }, [streak, badges, challenges, friends, gameSettings, incomingRequests, outgoingRequests]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const triggerGameEvent = useCallback((event: GameEvent) => {
    setActiveToast(event);
  }, []);

  const freezeStreak = useCallback((): boolean => {
    if (streak.freezeDaysRemaining <= 0 || streak.isFrozenToday) return false;
    setStreak((prev) => ({
      ...prev,
      freezeDaysRemaining: prev.freezeDaysRemaining - 1,
      isFrozenToday: true,
      atRisk: false,
    }));
    return true;
  }, [streak.freezeDaysRemaining, streak.isFrozenToday]);

  const unlockBadge = useCallback(
    (badgeId: string) => {
      setBadges((prev) =>
        prev.map((b) => {
          if (b.id === badgeId && !b.isUnlocked) {
            const unlockedBadge = { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() };
            triggerGameEvent({
              type: 'BADGE_EARNED',
              version: 1,
              ts: new Date().toISOString(),
              payload: { badgeTitle: b.title, iconGlyph: b.iconGlyph, points: b.points ?? 50 },
            });
            return unlockedBadge;
          }
          return b;
        })
      );
    },
    [triggerGameEvent]
  );

  const joinChallenge = useCallback((challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, isJoined: true } : c))
    );
  }, []);

  const sendFriendRequest = useCallback(
    (username: string): boolean => {
      const clean = username.trim().toLowerCase();
      if (!clean) return false;
      const exists = friends.some((f) => f.username.toLowerCase() === clean);
      if (exists) return false;

      const newFriend: Friend = {
        id: `friend-${Date.now()}`,
        name: username,
        username: clean,
        avatarGlyph: '👋',
        streak: 1,
        challengeScore: 50,
        weeklySteps: 12000,
        isSharing: true,
        status: 'pending_sent',
        since: 'Hôm nay',
      };

      setFriends((prev) => [...prev, newFriend]);
      setOutgoingRequests((prev) => [
        ...prev,
        {
          id: `req-out-${Date.now()}`,
          user: { id: newFriend.id, displayName: username },
          status: 'PENDING',
          createdAt: 'Vừa xong',
        },
      ]);
      return true;
    },
    [friends]
  );

  const sendFriendRequestToUser = useCallback(
    (target: string): { success: boolean; message: string } => {
      const clean = target.trim();
      if (!clean) return { success: false, message: 'Vui lòng nhập tên hoặc mã kết bạn' };
      if (clean.toUpperCase() === gameSettings.friendCode.toUpperCase()) {
        return { success: false, message: 'Bạn không thể tự kết bạn với chính mình' };
      }
      const existing = friends.find(
        (f) => f.name.toLowerCase() === clean.toLowerCase() || f.username.toLowerCase() === clean.toLowerCase()
      );
      if (existing) {
        return { success: false, message: 'Đã có trong danh sách bạn bè' };
      }
      const ok = sendFriendRequest(clean);
      if (ok) {
        return { success: true, message: `Đã gửi lời mời tới ${clean}` };
      }
      return { success: false, message: 'Gửi lời mời thất bại hoặc đã gửi trước đó' };
    },
    [friends, gameSettings.friendCode, sendFriendRequest]
  );

  const acceptFriendRequest = useCallback((friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, status: 'friend' } : f))
    );
  }, []);

  const respondFriendRequest = useCallback(
    (requestId: string, action: 'ACCEPT' | 'DECLINE') => {
      const req = incomingRequests.find((r) => r.id === requestId);
      if (!req) return;
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
      if (action === 'ACCEPT') {
        const newFriend: Friend = {
          id: req.user.id,
          name: req.user.displayName,
          username: req.user.displayName.toLowerCase().replace(/\s+/g, '_'),
          avatarGlyph: '😊',
          avatarUrl: req.user.avatarUrl,
          streak: 3,
          challengeScore: 120,
          weeklySteps: 25000,
          isSharing: true,
          status: 'friend',
          since: 'Hôm nay',
        };
        setFriends((prev) => [...prev, newFriend]);
        triggerGameEvent({
          type: 'FRIEND_REQUEST_ACCEPTED',
          version: 1,
          ts: new Date().toISOString(),
          payload: { user: req.user },
        });
      }
    },
    [incomingRequests, triggerGameEvent]
  );

  const cancelFriendRequest = useCallback((requestId: string) => {
    setOutgoingRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  const unfriend = useCallback((friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  }, []);

  const toggleSharingPrivacy = useCallback(() => {
    setGameSettings((prev) => ({
      ...prev,
      sharePoints: !prev.sharePoints,
      shareStreak: !prev.shareStreak,
    }));
  }, []);

  const updateGameSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setGameSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const searchUsers = useCallback(
    (query: string): UserSearchResult[] => {
      if (!IS_DEMO_MODE) {
        return [];
      }
      const q = query.trim().toLowerCase();
      if (!q) return [];
      // Match by friend code
      if (q.toUpperCase() === gameSettings.friendCode.toUpperCase()) {
        return [];
      }
      return MOCK_SEARCH_USERS.filter((u) => u.displayName.toLowerCase().includes(q));
    },
    [gameSettings.friendCode]
  );

  const getChallengeById = useCallback(
    (id: string): Challenge | undefined => {
      return challenges.find((c) => c.id === id);
    },
    [challenges]
  );

  const getFriendById = useCallback(
    (id: string): Friend | undefined => {
      return friends.find((f) => f.id === id);
    },
    [friends]
  );

  const getLeaderboard = useCallback(
    (metric: LeaderboardMetric): LeaderboardEntry[] => {
      return buildLeaderboard(metric, friends, {
        name: 'Tôi',
        streak: streak.currentStreak,
        challengeScore: IS_DEMO_MODE ? 350 : 0,
        weeklySteps: IS_DEMO_MODE ? 48500 : 0,
        isSharing: gameSettings.sharePoints,
      });
    },
    [friends, streak.currentStreak, gameSettings.sharePoints]
  );

  const value: GamificationContextValue = {
    streak,
    isStreakLoading,
    streakError,
    refreshStreak,
    badges,
    challenges,
    friends,
    isSharingPrivacy,
    gameSettings,
    incomingRequests,
    outgoingRequests,
    activeToast,
    freezeStreak,
    unlockBadge,
    joinChallenge,
    sendFriendRequest,
    sendFriendRequestToUser,
    acceptFriendRequest,
    respondFriendRequest,
    cancelFriendRequest,
    unfriend,
    toggleSharingPrivacy,
    updateGameSettings,
    getLeaderboard,
    searchUsers,
    getChallengeById,
    getFriendById,
    dismissToast,
    triggerGameEvent,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used inside GamificationProvider');
  return ctx;
}
