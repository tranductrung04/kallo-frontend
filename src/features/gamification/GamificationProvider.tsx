import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const STORAGE_KEY = '@kallo/gamification-v2';

export type GamificationContextValue = {
  streak: StreakInfo;
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
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 7,
    longestStreak: 12,
    freezeDaysRemaining: 2,
    isMaintainedToday: true,
    isFrozenToday: false,
    lastCompletedDate: '2026-10-15',
    todayCompleted: true,
    atRisk: false,
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [gameSettings, setGameSettings] = useState<GameSettings>(INITIAL_GAME_SETTINGS);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>(INITIAL_INCOMING_REQUESTS);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>(INITIAL_OUTGOING_REQUESTS);
  const [activeToast, setActiveToast] = useState<GameEvent | null>(null);

  const isSharingPrivacy = gameSettings.sharePoints || gameSettings.shareStreak;

  // Restore cache
  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (!data) return;
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
    });
  }, []);

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
        challengeScore: 350,
        weeklySteps: 48500,
        isSharing: gameSettings.sharePoints,
      });
    },
    [friends, streak.currentStreak, gameSettings.sharePoints]
  );

  const value: GamificationContextValue = {
    streak,
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
