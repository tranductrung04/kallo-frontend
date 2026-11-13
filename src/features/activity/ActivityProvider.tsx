import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api/client';
import { todayKey } from '@/features/nutrition/utils';
import { findActivityMeta } from './catalog';
import {
  aggregateDailyActivity,
  calculateCaloriesBurned,
  calculateWhr,
  classifyWhrRisk,
  deduplicateSyncLogs,
  estimateStepCalories,
} from './utils';
import type {
  ActivityContextValue,
  ActivityLog,
  ActivityState,
  BodyMetricLog,
  HealthSyncLog,
  HealthSyncStatus,
} from './types';

const STORAGE_KEY = '@kallo/activity-v1';

const initialState: ActivityState = {
  activityLogs: [],
  syncLogs: [],
  bodyMetricLogs: [],
  syncStatus: {
    healthConnect: 'NOT_GRANTED',
    appleHealth: 'NOT_GRANTED',
  },
  stepGoal: 3000,
};

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<ActivityState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((val) => {
        if (!val) return;
        try {
          const parsed = JSON.parse(val);
          setState({ ...initialState, ...parsed });
        } catch {
          // ignore corrupted local state
        }
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }
  }, [ready, state]);

  const addActivityLog = useCallback(
    (input: Omit<ActivityLog, 'id' | 'caloriesBurned'> & { caloriesBurned?: number }) => {
      const meta = findActivityMeta(input.type);
      const calories =
        input.caloriesBurned ??
        calculateCaloriesBurned(meta.met, 65, input.durationMinutes); // default weight 65kg if not provided
      const log: ActivityLog = {
        ...input,
        id: generateId('act'),
        name: input.name || meta.name,
        caloriesBurned: calories,
        source: input.source || 'MANUAL',
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        activityLogs: [log, ...prev.activityLogs],
      }));

      void api.post('/activities', log).catch(() => undefined);
      return log;
    },
    []
  );

  const deleteActivityLog = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activityLogs: prev.activityLogs.filter((item) => item.id !== id),
    }));
    void api.delete(`/activities/${id}`).catch(() => undefined);
  }, []);

  const getActivitiesForDate = useCallback(
    (date: string) => state.activityLogs.filter((item) => item.date === date),
    [state.activityLogs]
  );

  const getTotalCaloriesBurnedForDate = useCallback(
    (date: string) => {
      const summary = aggregateDailyActivity(state.activityLogs, state.syncLogs, date);
      return summary.totalCaloriesBurned;
    },
    [state.activityLogs, state.syncLogs]
  );

  const getTotalStepsForDate = useCallback(
    (date: string) => {
      const summary = aggregateDailyActivity(state.activityLogs, state.syncLogs, date);
      return summary.totalSteps;
    },
    [state.activityLogs, state.syncLogs]
  );

  const requestHealthPermission = useCallback(
    async (source: 'HEALTH_CONNECT' | 'APPLE_HEALTH'): Promise<HealthSyncStatus> => {
      // In mobile environment or simulator, update permission status
      const key = source === 'HEALTH_CONNECT' ? 'healthConnect' : 'appleHealth';
      setState((prev) => ({
        ...prev,
        syncStatus: {
          ...prev.syncStatus,
          [key]: 'CONNECTED',
        },
      }));
      return 'CONNECTED';
    },
    []
  );

  const syncHealthData = useCallback(
    async (
      preferredSource?: 'HEALTH_CONNECT' | 'APPLE_HEALTH'
    ): Promise<{ success: boolean; newSteps: number; newCalories: number; duplicate: boolean }> => {
      const source: 'HEALTH_CONNECT' | 'APPLE_HEALTH' =
        preferredSource || (Platform.OS === 'ios' ? 'APPLE_HEALTH' : 'HEALTH_CONNECT');
      const date = todayKey();

      // Fixed daily external ID based on date and provider to guarantee idempotency (AC2)
      const externalId = `sync-${source.toLowerCase()}-${date}`;
      const existingToday = state.syncLogs.find(
        (l) => l.date === date && l.source === source && l.externalId === externalId
      );

      // Stable demo sync: default 6,540 steps, heart rate 72 bpm
      const baseSteps = existingToday ? existingToday.steps : 6540;
      const baseCalories = existingToday ? existingToday.caloriesBurned : estimateStepCalories(baseSteps, 65);

      const incoming: HealthSyncLog = {
        id: existingToday ? existingToday.id : generateId('sync'),
        date,
        source,
        externalId,
        steps: baseSteps,
        caloriesBurned: baseCalories,
        heartRateAvg: 72,
        syncedAt: new Date().toISOString(),
        status: 'SUCCESS',
      };

      const result = deduplicateSyncLogs(state.syncLogs, incoming);

      setState((prev) => ({
        ...prev,
        syncLogs: result.updated,
        syncStatus: {
          ...prev.syncStatus,
          [source === 'HEALTH_CONNECT' ? 'healthConnect' : 'appleHealth']: 'CONNECTED',
        },
      }));

      void api.post('/health-sync', incoming).catch(() => undefined);

      return {
        success: true,
        newSteps: result.deltaSteps,
        newCalories: result.deltaCalories,
        duplicate: result.isDuplicate,
      };
    },
    [state.syncLogs]
  );

  const addBodyMetricLog = useCallback(
    (
      waistCm: number,
      hipCm: number,
      gender: 'male' | 'female' | 'other' = 'male',
      date: string = todayKey()
    ): BodyMetricLog | null => {
      if (waistCm <= 0 || hipCm <= 0) return null;
      const whr = calculateWhr(waistCm, hipCm);
      const risk = classifyWhrRisk(whr, gender);

      const log: BodyMetricLog = {
        id: generateId('whr'),
        date,
        waistCm,
        hipCm,
        whr,
        riskLevel: risk.riskLevel,
        riskLabel: risk.riskLabel,
      };

      setState((prev) => ({
        ...prev,
        bodyMetricLogs: [log, ...prev.bodyMetricLogs.filter((item) => item.date !== date)],
      }));

      void api.post('/body-metrics', log).catch(() => undefined);
      return log;
    },
    []
  );

  const getLatestBodyMetric = useCallback(() => {
    if (state.bodyMetricLogs.length === 0) return undefined;
    return [...state.bodyMetricLogs].sort((a, b) => b.date.localeCompare(a.date))[0];
  }, [state.bodyMetricLogs]);

  const updateStepGoal = useCallback((goal: number) => {
    setState((prev) => ({
      ...prev,
      stepGoal: goal,
    }));
  }, []);

  const value = useMemo<ActivityContextValue>(
    () => ({
      state,
      ready,
      addActivityLog,
      deleteActivityLog,
      getActivitiesForDate,
      getTotalCaloriesBurnedForDate,
      getTotalStepsForDate,
      syncHealthData,
      addBodyMetricLog,
      getLatestBodyMetric,
      requestHealthPermission,
      updateStepGoal,
    }),
    [
      state,
      ready,
      addActivityLog,
      deleteActivityLog,
      getActivitiesForDate,
      getTotalCaloriesBurnedForDate,
      getTotalStepsForDate,
      syncHealthData,
      addBodyMetricLog,
      getLatestBodyMetric,
      requestHealthPermission,
      updateStepGoal,
    ]
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}
