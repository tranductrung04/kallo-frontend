import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Badge,
  Challenge,
  Friend,
  LeaderboardEntry,
  LeaderboardMetric,
  StreakInfo,
} from './types';
import {
  buildLeaderboard,
  INITIAL_BADGES,
  INITIAL_CHALLENGES,
  INITIAL_FRIENDS,
} from './utils';

const STORAGE_KEY = '@kallo/gamification-v1';

export type GamificationContextValue = {
  streak: StreakInfo;
  badges: Badge[];
  challenges: Challenge[];
  friends: Friend[];
  isSharingPrivacy: boolean;
  freezeStreak: () => boolean;
  unlockBadge: (badgeId: string) => void;
  joinChallenge: (challengeId: string) => void;
  sendFriendRequest: (username: string) => boolean;
  acceptFriendRequest: (friendId: string) => void;
  toggleSharingPrivacy: () => void;
  getLeaderboard: (metric: LeaderboardMetric) => LeaderboardEntry[];
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
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [isSharingPrivacy, setIsSharingPrivacy] = useState<boolean>(true);

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
        if (typeof parsed.isSharingPrivacy === 'boolean') {
          setIsSharingPrivacy(parsed.isSharingPrivacy);
        }
      } catch {
        /* Ignore invalid cache */
      }
    });
  }, []);

  // Save changes
  useEffect(() => {
    void AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ streak, badges, challenges, friends, isSharingPrivacy })
    ).catch(() => undefined);
  }, [streak, badges, challenges, friends, isSharingPrivacy]);

  const freezeStreak = useCallback((): boolean => {
    if (streak.freezeDaysRemaining <= 0 || streak.isFrozenToday) return false;
    setStreak((prev) => ({
      ...prev,
      freezeDaysRemaining: prev.freezeDaysRemaining - 1,
      isFrozenToday: true,
    }));
    return true;
  }, [streak.freezeDaysRemaining, streak.isFrozenToday]);

  const unlockBadge = useCallback((badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId && !b.isUnlocked
          ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() }
          : b
      )
    );
  }, []);

  const joinChallenge = useCallback((challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, isJoined: true } : c
      )
    );
  }, []);

  const sendFriendRequest = useCallback((username: string): boolean => {
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
    };

    setFriends((prev) => [...prev, newFriend]);
    return true;
  }, [friends]);

  const acceptFriendRequest = useCallback((friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, status: 'friend' } : f))
    );
  }, []);

  const toggleSharingPrivacy = useCallback(() => {
    setIsSharingPrivacy((prev) => !prev);
  }, []);

  const getLeaderboard = useCallback(
    (metric: LeaderboardMetric): LeaderboardEntry[] => {
      return buildLeaderboard(metric, friends, {
        name: 'Tôi',
        streak: streak.currentStreak,
        challengeScore: 350,
        weeklySteps: 48500,
        isSharing: isSharingPrivacy,
      });
    },
    [friends, streak.currentStreak, isSharingPrivacy]
  );

  const value: GamificationContextValue = {
    streak,
    badges,
    challenges,
    friends,
    isSharingPrivacy,
    freezeStreak,
    unlockBadge,
    joinChallenge,
    sendFriendRequest,
    acceptFriendRequest,
    toggleSharingPrivacy,
    getLeaderboard,
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
