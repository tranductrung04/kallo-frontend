import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';
import { getApiErrorStatus, isUuid } from '@/services/api/apiUtils';
import { useOfflineSync } from '@/services/offline';
import { createWeightLog, getWeightLogs } from '@/features/activity/api';
import { useAuth } from '@/features/auth/AuthProvider';
import { getHealthProfile, type HealthProfileResponse } from '@/features/health-profile/api';
import {
  copyMealApi,
  createFoodLogApi,
  createWaterLogApi,
  deleteFoodLogApi,
  deleteWaterLogApi,
  getDailyFoodLogsApi,
  getDailySummaryApi,
  getDailyWaterLogsApi,
  getRecentFoodsApi,
  getTodayDailySummaryApi,
  recalculateDailySummaryApi,
  updateFoodLogApi,
} from './api';
import {
  createCustomFoodApi,
  createRecipeFoodApi,
  deleteCustomFoodApi,
  getFoodDetailApi,
  updateCustomFoodApi,
  uploadCustomFoodImageApi,
} from './foodApi';
import { isLocalImageUri } from './imageUploadUtils';
import {
  flattenDailyFoodLogs,
  mapFoodLogResponseToFoodLog,
  mapFoodResponseToFood,
  mapFoodSearchItemToFood,
  mapWaterLogResponseToWaterLog,
  toApiLogSource,
  toApiMealType,
  type CopyMealResponse,
  type CreateFoodLogRequest,
  type CreateWaterLogRequest,
  type CustomFoodRequest,
  type DailySummaryResponse,
  type FoodResponse,
  type RecipeFoodRequest,
} from './types';
import { starterFoods } from './catalog';
import { latestWeight, summarizeLogs, todayKey } from './utils';
import type { AddFoodLogInput, Food, FoodLog, MealSlot, NutritionContextValue, NutritionState, WaterLog } from './types';

const STORAGE_KEY = '@kallo/nutrition-v1';
const initialState: NutritionState = {
  foodLogs: [],
  waterLogs: [],
  weightLogs: [],
  customFoods: [],
  recentFoodIds: [],
  favoriteFoodIds: [],
  selectedDate: todayKey(),
  walkthroughSeen: false,
  goals: { calories: 2000, protein: 150, carbs: 225, fat: 56, waterMl: 2000, targetWeightKg: 60 },
};

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildLoggedAtIso(date: string, time?: string): string {
  if (time && /^\d{2}:\d{2}$/.test(time)) {
    const dt = new Date(`${date}T${time}:00`);
    if (!Number.isNaN(dt.getTime())) return dt.toISOString();
  }
  if (date === todayKey()) {
    return new Date().toISOString();
  }
  const fallback = new Date(`${date}T12:00:00`);
  return Number.isNaN(fallback.getTime()) ? new Date().toISOString() : fallback.toISOString();
}

function isTransientNetworkError(error: unknown): boolean {
  const status = getApiErrorStatus(error);
  return status === undefined || status >= 500;
}

export const NutritionContext = createContext<NutritionContextValue | null>(null);

export function NutritionProvider({ children }: React.PropsWithChildren) {
  const { status } = useAuth();
  const { enqueueItem } = useOfflineSync();
  const [state, setState] = useState<NutritionState>(initialState);
  const [ready, setReady] = useState(false);
  const [serverFoods, setServerFoods] = useState<Food[]>([]);
  const [recentServerFoods, setRecentServerFoods] = useState<Food[]>([]);
  const [dailySummaries, setDailySummaries] = useState<Record<string, DailySummaryResponse>>({});

  const foodLogsRef = useRef<FoodLog[]>(state.foodLogs);
  foodLogsRef.current = state.foodLogs;

  const waterLogsRef = useRef<WaterLog[]>(state.waterLogs);
  waterLogsRef.current = state.waterLogs;

  const selectedDateRef = useRef<string>(state.selectedDate);
  selectedDateRef.current = state.selectedDate;

  const recentServerFoodsRef = useRef<Food[]>(recentServerFoods);
  recentServerFoodsRef.current = recentServerFoods;

  const lastDateFetchRef = useRef<Record<string, number>>({});
  const inFlightDateRef = useRef<Record<string, Promise<void> | undefined>>({});
  const lastRecentFetchRef = useRef<number>(0);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then(async (value) => {
        let baseState = initialState;
        if (value) {
          try {
            baseState = { ...initialState, ...JSON.parse(value) };
          } catch {
            /* Ignore invalid local cache. */
          }
        }
        try {
          const profileRaw = await AsyncStorage.getItem('@kallo/health-profile');
          if (profileRaw) {
            const p = JSON.parse(profileRaw);
            baseState = {
              ...baseState,
              goals: {
                calories: p.dailyCalorieGoal || p.dailyCalories || baseState.goals.calories,
                protein: p.proteinGoalG || p.proteinGoalGrams || baseState.goals.protein,
                carbs: p.carbsGoalG || p.carbsGoalGrams || baseState.goals.carbs,
                fat: p.fatGoalG || p.fatGoalGrams || baseState.goals.fat,
                waterMl: p.waterGoalMl || baseState.goals.waterMl,
                targetWeightKg: p.targetWeightKg || baseState.goals.targetWeightKg,
              },
            };
          }
        } catch {
          /* Ignore profile parse errors. */
        }
        setState(baseState);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }
  }, [ready, state]);

  const cacheFood = useCallback((input: Food | Food[]) => {
    const items = Array.isArray(input) ? input : [input];
    setServerFoods((prev) => {
      const existingMap = new Map(prev.map((f) => [f.id, f]));
      let hasChanges = false;
      for (const item of items) {
        const existing = existingMap.get(item.id);
        if (!existing || (item.ingredients && !existing.ingredients)) {
          existingMap.set(item.id, item);
          hasChanges = true;
        }
      }
      return hasChanges ? Array.from(existingMap.values()) : prev;
    });
  }, []);

  const refreshSummaryOnly = useCallback(async (date: string) => {
    if (status !== 'signedIn') return;
    try {
      const summaryRes =
        date === todayKey() ? await getTodayDailySummaryApi() : await getDailySummaryApi(date);
      if (summaryRes?.date) {
        setDailySummaries((prev) => ({ ...prev, [summaryRes.date]: summaryRes }));
      }
    } catch {
      /* Ignore offline / summary fetch errors */
    }
  }, [status]);

  const refreshDateData = useCallback(
    async (targetDate?: string, force = false) => {
      if (status !== 'signedIn') return;
      const date = targetDate || selectedDateRef.current || todayKey();

      const existingInFlight = inFlightDateRef.current[date];
      if (!force && existingInFlight) {
        return existingInFlight;
      }
      const lastFetched = lastDateFetchRef.current[date] ?? 0;
      if (!force && Date.now() - lastFetched < 5000) {
        return;
      }

      const promise = (async () => {
        try {
          const [foodRes, waterRes, summaryRes] = await Promise.allSettled([
            getDailyFoodLogsApi(date),
            getDailyWaterLogsApi(date),
            date === todayKey() ? getTodayDailySummaryApi() : getDailySummaryApi(date),
          ]);

          if (foodRes.status === 'fulfilled' && foodRes.value) {
            const serverLogs = flattenDailyFoodLogs(foodRes.value);
            const serverClientUuids = new Set(
              serverLogs.map((l) => l.clientUuid).filter((v): v is string => Boolean(v))
            );
            setState((current) => {
              const localImageByKey = new Map<string, string>();
              for (const existing of current.foodLogs) {
                if (existing.date === date && existing.imageUri) {
                  localImageByKey.set(existing.id, existing.imageUri);
                  if (existing.clientUuid) {
                    localImageByKey.set(existing.clientUuid, existing.imageUri);
                  }
                }
              }
              const mergedServerLogs = serverLogs.map((l) => {
                if (l.imageUri) return l;
                const fallbackUri =
                  localImageByKey.get(l.id) ??
                  (l.clientUuid ? localImageByKey.get(l.clientUuid) : undefined);
                return fallbackUri ? { ...l, imageUri: fallbackUri } : l;
              });
              const otherDates = current.foodLogs.filter((l) => l.date !== date);
              const pendingLocal = current.foodLogs.filter(
                (l) =>
                  l.date === date &&
                  l.synced === false &&
                  (!l.clientUuid || !serverClientUuids.has(l.clientUuid))
              );
              return {
                ...current,
                foodLogs: [...otherDates, ...mergedServerLogs, ...pendingLocal],
              };
            });
          }

          if (waterRes.status === 'fulfilled' && waterRes.value) {
            const serverWaterLogs = (waterRes.value.logs ?? []).map(mapWaterLogResponseToWaterLog);
            const serverClientUuids = new Set(
              serverWaterLogs.map((w) => w.clientUuid).filter((v): v is string => Boolean(v))
            );
            setState((current) => {
              const otherDates = current.waterLogs.filter((w) => w.date !== date);
              const pendingLocal = current.waterLogs.filter(
                (w) =>
                  w.date === date &&
                  !isUuid(w.id) &&
                  (!w.clientUuid || !serverClientUuids.has(w.clientUuid))
              );
              return {
                ...current,
                waterLogs: [...otherDates, ...serverWaterLogs, ...pendingLocal],
              };
            });
          }

          if (summaryRes.status === 'fulfilled' && summaryRes.value?.date) {
            const s = summaryRes.value;
            setDailySummaries((prev) => ({ ...prev, [s.date]: s }));
          }
          lastDateFetchRef.current[date] = Date.now();
        } finally {
          delete inFlightDateRef.current[date];
        }
      })();

      inFlightDateRef.current[date] = promise;
      return promise;
    },
    [status]
  );

  const refreshRecentFoods = useCallback(
    async (limit = 10): Promise<Food[]> => {
      if (status !== 'signedIn') return [];
      if (Date.now() - lastRecentFetchRef.current < 5000 && recentServerFoodsRef.current.length > 0) {
        return recentServerFoodsRef.current;
      }
      lastRecentFetchRef.current = Date.now();
      try {
        const items = await getRecentFoodsApi(limit);
        const mapped = (items ?? []).map(mapFoodSearchItemToFood);
        setRecentServerFoods(mapped);
        cacheFood(mapped);
        return mapped;
      } catch {
        return recentServerFoodsRef.current;
      }
    },
    [status, cacheFood]
  );

  const recalculateSummary = useCallback(
    async (date?: string): Promise<DailySummaryResponse | undefined> => {
      if (status !== 'signedIn') return undefined;
      const target = date || selectedDateRef.current || todayKey();
      const res = await recalculateDailySummaryApi(target);
      if (res?.date) {
        setDailySummaries((prev) => ({ ...prev, [res.date]: res }));
      }
      return res;
    },
    [status]
  );

  useEffect(() => {
    if (ready && status === 'signedIn') {
      void refreshDateData(state.selectedDate);
    }
  }, [ready, status, state.selectedDate, refreshDateData]);

  useEffect(() => {
    if (ready && status === 'signedIn') {
      void refreshRecentFoods(10);
    }
  }, [ready, status, refreshRecentFoods]);

  useEffect(() => {
    if (ready && status === 'signedIn') {
      void (async () => {
        try {
          let p: HealthProfileResponse | null = null;
          const raw = await AsyncStorage.getItem('@kallo/health-profile');
          if (raw) {
            p = JSON.parse(raw);
          }
          const fresh = await getHealthProfile().catch(() => null);
          if (fresh) {
            p = fresh;
            await AsyncStorage.setItem('@kallo/health-profile', JSON.stringify(fresh));
          }
          if (p) {
            const pG = p.macronutrients?.proteinGrams ?? p.proteinGoalG ?? 100;
            const cG = p.macronutrients?.carbGrams ?? p.carbsGoalG ?? 150;
            const fG = p.macronutrients?.fatGrams ?? p.fatGoalG ?? 45;
            const wMl = p.waterGoalMl ?? (p.waterLiters ? Math.round(p.waterLiters * 1000) : 2000);
            setState((prev) => ({
              ...prev,
              goals: {
                calories: p.dailyCalorieGoal ? Math.round(p.dailyCalorieGoal) : prev.goals.calories,
                protein: Math.round(pG),
                carbs: Math.round(cG),
                fat: Math.round(fG),
                waterMl: Math.round(wMl),
                targetWeightKg: p.targetWeightKg ?? prev.goals.targetWeightKg,
              },
            }));
          }
        } catch {
          // ignore
        }
      })();
    }
  }, [ready, status]);

  useEffect(() => {
    if (ready && status === 'signedIn') {
      void getWeightLogs()
        .then((serverWeights) => {
          if (Array.isArray(serverWeights) && serverWeights.length > 0) {
            setState((current) => {
              const serverLogs = serverWeights.map((w) => ({
                id: w.id,
                date: w.loggedAt ? w.loggedAt.split('T')[0] : todayKey(),
                weightKg: Number(w.weightKg),
              }));
              const serverDateSet = new Set(serverLogs.map((l) => l.date));
              const localRemaining = current.weightLogs.filter((l) => !serverDateSet.has(l.date));
              return { ...current, weightLogs: [...serverLogs, ...localRemaining] };
            });
          }
        })
        .catch(() => undefined);
    }
  }, [ready, status]);

  const foods = useMemo(() => {
    const map = new Map<string, Food>();
    for (const f of starterFoods) map.set(f.id, f);
    for (const f of serverFoods) map.set(f.id, f);
    for (const f of state.customFoods) map.set(f.id, f);
    return Array.from(map.values());
  }, [state.customFoods, serverFoods]);

  const findFood = useCallback((foodId: string) => foods.find((food) => food.id === foodId), [foods]);

  const fetchFoodDetail = useCallback(
    async (foodId: string): Promise<Food | undefined> => {
      const found = foods.find((f) => f.id === foodId);
      if (found && found.allergens && (found.caloriesPer100g !== undefined || found.ingredients)) {
        return found;
      }
      try {
        const res = await getFoodDetailApi(foodId);
        const converted = mapFoodResponseToFood(res);
        cacheFood(converted);
        return converted;
      } catch {
        return found;
      }
    },
    [foods, cacheFood]
  );

  const getLogs = useCallback(
    (date: string, meal?: MealSlot) =>
      state.foodLogs.filter((log) => log.date === date && (!meal || log.meal === meal)),
    [state.foodLogs]
  );

  const getSummary = useCallback(
    (date: string, caloriesBurned = 0) => {
      const logsForDate = getLogs(date);
      const waterLogsForDate = state.waterLogs.filter((log) => log.date === date);
      const waterTotal = waterLogsForDate.reduce((sum, log) => sum + log.amountMl, 0);
      const localSummary = summarizeLogs(
        logsForDate,
        foods,
        waterTotal,
        latestWeight(date, state.weightLogs),
        state.goals,
        caloriesBurned
      );

      const serverSummary = dailySummaries[date];
      if (!serverSummary) {
        return localSummary;
      }

      const hasPendingLocalFood = logsForDate.some((l) => l.synced === false);
      const hasPendingLocalWater = waterLogsForDate.some((w) => !isUuid(w.id));

      if (hasPendingLocalFood || hasPendingLocalWater) {
        return {
          ...localSummary,
          steps: serverSummary.steps,
          goalAchieved: serverSummary.goalAchieved,
          sugarExceeded: serverSummary.sugarExceeded,
          proteinExceeded: serverSummary.proteinExceeded,
          mealsLoggedCount: Math.max(serverSummary.mealsLoggedCount, logsForDate.length),
        };
      }

      const caloriesGoal = serverSummary.targetCalories ?? localSummary.caloriesGoal;
      const waterGoalMl = serverSummary.targetWaterMl ?? localSummary.waterGoalMl;
      return {
        ...localSummary,
        calories: serverSummary.caloriesConsumed,
        protein: serverSummary.proteinG,
        carbs: serverSummary.carbsG,
        fat: serverSummary.fatG,
        sugar: serverSummary.sugarG,
        fiber: serverSummary.fiberG,
        caloriesGoal,
        caloriesRemaining:
          serverSummary.remainingCalories ?? Math.max(0, caloriesGoal - serverSummary.caloriesConsumed),
        waterMl: serverSummary.waterMl,
        waterGoalMl,
        weightKg: serverSummary.weightKg ?? localSummary.weightKg,
        caloriesBurned: caloriesBurned || serverSummary.caloriesBurned,
        steps: serverSummary.steps,
        goalAchieved: serverSummary.goalAchieved,
        sugarExceeded: serverSummary.sugarExceeded,
        proteinExceeded: serverSummary.proteinExceeded,
        mealsLoggedCount: serverSummary.mealsLoggedCount,
      };
    },
    [foods, getLogs, state.goals, state.waterLogs, state.weightLogs, dailySummaries]
  );

  const syncFoodLogItem = useCallback(
    async (
      input: AddFoodLogInput,
      clientUuid: string,
      servingQuantity: number
    ): Promise<FoodLog | undefined> => {
      if (status !== 'signedIn' || !isUuid(input.foodId)) return undefined;

      const payload: CreateFoodLogRequest = {
        foodId: input.foodId,
        mealType: toApiMealType(input.meal),
        servingGrams: input.grams,
        servingQuantity,
        source: toApiLogSource(input.source),
        loggedDate: input.date,
        loggedAt: input.loggedAt ?? buildLoggedAtIso(input.date, input.time),
        clientUuid,
        tempImageKey: input.tempImageKey ?? null,
        aiPredictedClassId: input.aiPredictedClassId ?? null,
      };

      try {
        const res = await createFoodLogApi(payload);
        const mapped = mapFoodLogResponseToFoodLog(res);
        const effectiveMapped: FoodLog =
          !mapped.imageUri && input.imageUri ? { ...mapped, imageUri: input.imageUri } : mapped;
        setState((current) => ({
          ...current,
          foodLogs: current.foodLogs.map((l) =>
            l.id === clientUuid || l.clientUuid === clientUuid ? effectiveMapped : l
          ),
        }));
        void refreshSummaryOnly(input.date);
        void refreshRecentFoods(10);
        return effectiveMapped;
      } catch (err) {
        if (isTransientNetworkError(err)) {
          enqueueItem('FOOD_LOG', payload, clientUuid);
        }
        return undefined;
      }
    },
    [status, enqueueItem, refreshSummaryOnly, refreshRecentFoods]
  );

  const addFoodLogAsync = useCallback(
    async (input: AddFoodLogInput): Promise<FoodLog | undefined> => {
      const food = foods.find((item) => item.id === input.foodId);
      if ((!food && !input.foodName) || input.grams <= 0) return undefined;

      const clientUuid = input.clientUuid ?? randomUUID();
      const foodName = input.foodName ?? food?.name ?? 'Món ăn';
      const baseServing = food?.servingGrams && food.servingGrams > 0 ? food.servingGrams : 100;
      const servingQuantity =
        input.servingQuantity ?? Math.max(0.01, Math.round((input.grams / baseServing) * 100) / 100);

      const log: FoodLog = {
        ...input,
        id: clientUuid,
        clientUuid,
        foodName,
        servingQuantity,
        imageUri: input.imageUri ?? food?.imageUrl ?? undefined,
        synced: false,
      };

      setState((current) => {
        const recentFoodIds = food
          ? [food.id, ...current.recentFoodIds.filter((value) => value !== food.id)].slice(0, 12)
          : current.recentFoodIds;
        return { ...current, foodLogs: [...current.foodLogs, log], recentFoodIds };
      });

      const serverLog = await syncFoodLogItem(input, clientUuid, servingQuantity);
      return serverLog ?? log;
    },
    [foods, syncFoodLogItem]
  );

  const addFoodLog = useCallback(
    (input: AddFoodLogInput) => {
      void addFoodLogAsync(input);
    },
    [addFoodLogAsync]
  );

  const addMultipleFoodLogs = useCallback(
    (inputs: AddFoodLogInput[]) => {
      const validEntries: Array<{
        log: FoodLog;
        input: AddFoodLogInput;
        clientUuid: string;
        servingQuantity: number;
      }> = [];

      for (const input of inputs) {
        const food = foods.find((item) => item.id === input.foodId);
        if ((!food && !input.foodName) || input.grams <= 0) continue;
        const clientUuid = input.clientUuid ?? randomUUID();
        const foodName = input.foodName ?? food?.name ?? 'Món ăn';
        const baseServing = food?.servingGrams && food.servingGrams > 0 ? food.servingGrams : 100;
        const servingQuantity =
          input.servingQuantity ?? Math.max(0.01, Math.round((input.grams / baseServing) * 100) / 100);
        validEntries.push({
          log: {
            ...input,
            id: clientUuid,
            clientUuid,
            foodName,
            servingQuantity,
            imageUri: input.imageUri ?? food?.imageUrl ?? undefined,
            synced: false,
          },
          input,
          clientUuid,
          servingQuantity,
        });
      }

      if (validEntries.length === 0) return;

      setState((current) => ({
        ...current,
        foodLogs: [...current.foodLogs, ...validEntries.map((e) => e.log)],
      }));

      for (const entry of validEntries) {
        void syncFoodLogItem(entry.input, entry.clientUuid, entry.servingQuantity);
      }
    },
    [foods, syncFoodLogItem]
  );

  const updateFoodLog = useCallback(
    (logId: string, changes: Partial<Pick<FoodLog, 'grams' | 'meal'>>) => {
      const existing = foodLogsRef.current.find((l) => l.id === logId);

      setState((current) => ({
        ...current,
        foodLogs: current.foodLogs.map((log) => {
          if (log.id !== logId) return log;
          const ratio = changes.grams && log.grams > 0 ? changes.grams / log.grams : 1;
          const nutritionSnapshot =
            log.nutritionSnapshot && changes.grams && log.grams > 0
              ? {
                  ...log.nutritionSnapshot,
                  calories: log.nutritionSnapshot.calories * ratio,
                  protein: log.nutritionSnapshot.protein * ratio,
                  carbs: log.nutritionSnapshot.carbs * ratio,
                  fat: log.nutritionSnapshot.fat * ratio,
                }
              : log.nutritionSnapshot;
          const servingQuantity =
            changes.grams && log.grams > 0 && log.servingQuantity
              ? Math.max(0.01, Math.round(log.servingQuantity * ratio * 100) / 100)
              : log.servingQuantity;
          return {
            ...log,
            ...changes,
            servingQuantity,
            nutritionSnapshot,
            sugarG: log.sugarG !== undefined && changes.grams ? log.sugarG * ratio : log.sugarG,
            fiberG: log.fiberG !== undefined && changes.grams ? log.fiberG * ratio : log.fiberG,
            synced: false,
          };
        }),
      }));

      if (status === 'signedIn' && isUuid(logId) && existing) {
        const nextMeal = changes.meal ?? existing.meal;
        const nextGrams = changes.grams ?? existing.grams;
        const ratio = existing.grams > 0 ? nextGrams / existing.grams : 1;
        const nextQuantity = existing.servingQuantity
          ? Math.max(0.01, Math.round(existing.servingQuantity * ratio * 100) / 100)
          : 1.0;

        void updateFoodLogApi(logId, {
          mealType: toApiMealType(nextMeal),
          servingGrams: nextGrams,
          servingQuantity: nextQuantity,
          clientUpdatedAt: new Date().toISOString(),
        })
          .then((res) => {
            const mapped = mapFoodLogResponseToFoodLog(res);
            setState((current) => ({
              ...current,
              foodLogs: current.foodLogs.map((l) => (l.id === logId ? mapped : l)),
            }));
            void refreshSummaryOnly(res.loggedDate);
          })
          .catch(() => undefined);
      }
    },
    [status, refreshSummaryOnly]
  );

  const deleteFoodLog = useCallback(
    (logId: string) => {
      const existing = foodLogsRef.current.find((l) => l.id === logId);
      setState((current) => ({
        ...current,
        foodLogs: current.foodLogs.filter((log) => log.id !== logId),
      }));

      if (status === 'signedIn' && isUuid(logId)) {
        void deleteFoodLogApi(logId)
          .then(() => {
            if (existing?.date) void refreshSummaryOnly(existing.date);
          })
          .catch(() => undefined);
      }
    },
    [status, refreshSummaryOnly]
  );

  const copyMeal = useCallback(
    async (sourceDate: string, targetDate: string, meal: MealSlot): Promise<CopyMealResponse | void> => {
      if (status === 'signedIn') {
        try {
          const res = await copyMealApi({
            sourceDate,
            targetDate,
            mealType: toApiMealType(meal),
          });
          const copied = (res.copiedLogs ?? []).map(mapFoodLogResponseToFoodLog);
          if (copied.length > 0) {
            setState((current) => {
              const existingIds = new Set(current.foodLogs.map((l) => l.id));
              const newItems = copied.filter((l) => !existingIds.has(l.id));
              return { ...current, foodLogs: [...current.foodLogs, ...newItems] };
            });
          }
          void refreshSummaryOnly(targetDate);
          return res;
        } catch (err) {
          if (!isTransientNetworkError(err)) {
            throw err;
          }
          // Fall through to local copy when offline
        }
      }

      setState((current) => ({
        ...current,
        foodLogs: [
          ...current.foodLogs,
          ...current.foodLogs
            .filter((log) => log.date === sourceDate && log.meal === meal)
            .map((log) => ({
              ...log,
              id: randomUUID(),
              clientUuid: randomUUID(),
              date: targetDate,
              source: 'COPY' as const,
              synced: false,
            })),
        ],
      }));
    },
    [status, refreshSummaryOnly]
  );

  const addWater = useCallback(
    (date: string, amountMl: number): boolean => {
      if (!Number.isFinite(amountMl) || amountMl === 0 || Math.abs(amountMl) > 5000) return false;

      if (amountMl < 0) {
        const logsForDate = waterLogsRef.current.filter((log) => log.date === date);
        const totalWater = logsForDate.reduce((sum, log) => sum + log.amountMl, 0);
        if (totalWater <= 0) return true;

        let rem = Math.min(totalWater, Math.abs(amountMl));
        const deletedServerIds: string[] = [];
        let partialReplace: { oldServerId?: string; remainderMl: number } | null = null;
        const remainingDateLogs: WaterLog[] = [];
        const reversed = [...logsForDate].reverse();

        for (const log of reversed) {
          if (rem <= 0) {
            remainingDateLogs.unshift(log);
          } else if (log.amountMl <= rem) {
            rem -= log.amountMl;
            if (isUuid(log.id)) deletedServerIds.push(log.id);
          } else {
            const remainderMl = log.amountMl - rem;
            rem = 0;
            const replacementUuid = randomUUID();
            remainingDateLogs.unshift({
              ...log,
              id: isUuid(log.id) ? replacementUuid : log.id,
              clientUuid: isUuid(log.id) ? replacementUuid : log.clientUuid,
              amountMl: remainderMl,
            });
            if (isUuid(log.id)) {
              partialReplace = { oldServerId: log.id, remainderMl };
            }
          }
        }

        setState((current) => ({
          ...current,
          waterLogs: [
            ...current.waterLogs.filter((log) => log.date !== date),
            ...remainingDateLogs,
          ],
        }));

        if (status === 'signedIn') {
          void (async () => {
            for (const delId of deletedServerIds) {
              await deleteWaterLogApi(delId).catch(() => undefined);
            }
            if (partialReplace?.oldServerId) {
              await deleteWaterLogApi(partialReplace.oldServerId).catch(() => undefined);
              const clientUuid = randomUUID();
              const loggedAt = buildLoggedAtIso(date);
              const payload: CreateWaterLogRequest = {
                amountMl: Math.round(partialReplace.remainderMl),
                loggedDate: date,
                loggedAt,
                clientUuid,
              };
              try {
                const res = await createWaterLogApi(payload);
                const mapped = mapWaterLogResponseToWaterLog(res);
                setState((current) => ({
                  ...current,
                  waterLogs: current.waterLogs.map((w) =>
                    w.amountMl === partialReplace?.remainderMl && w.date === date && !isUuid(w.id)
                      ? mapped
                      : w
                  ),
                }));
              } catch (err) {
                if (isTransientNetworkError(err)) {
                  enqueueItem('WATER_LOG', payload, clientUuid);
                }
              }
            }
            await refreshSummaryOnly(date);
          })();
        }
        return true;
      }

      const clientUuid = randomUUID();
      const loggedAt = buildLoggedAtIso(date);
      const roundedMl = Math.round(amountMl);

      setState((current) => ({
        ...current,
        waterLogs: [
          ...current.waterLogs,
          { id: clientUuid, clientUuid, date, amountMl: roundedMl, loggedAt },
        ],
      }));

      if (status === 'signedIn') {
        const payload: CreateWaterLogRequest = {
          amountMl: roundedMl,
          loggedDate: date,
          loggedAt,
          clientUuid,
        };
        void createWaterLogApi(payload)
          .then((res) => {
            const mapped = mapWaterLogResponseToWaterLog(res);
            setState((current) => ({
              ...current,
              waterLogs: current.waterLogs.map((w) =>
                w.id === clientUuid || w.clientUuid === clientUuid ? mapped : w
              ),
            }));
            void refreshSummaryOnly(date);
          })
          .catch((err) => {
            if (isTransientNetworkError(err)) {
              enqueueItem('WATER_LOG', payload, clientUuid);
            }
          });
      }
      return true;
    },
    [status, enqueueItem, refreshSummaryOnly]
  );

  const addWeight = useCallback((date: string, weightKg: number) => {
    if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 300) return false;
    const clientUuid = randomUUID();
    const loggedAt = date.includes('T') ? date : `${date}T12:00:00.000Z`;
    setState((current) => ({
      ...current,
      weightLogs: [
        ...current.weightLogs.filter((log) => log.date !== date),
        { id: clientUuid, date, weightKg },
      ],
    }));
    void createWeightLog({ clientUuid, weightKg, loggedAt }).catch(() => undefined);
    return true;
  }, []);

  const finalizeCustomFoodWithImage = useCallback(
    async (res: FoodResponse, originalImageUrl?: string | null): Promise<Food> => {
      let food = mapFoodResponseToFood(res);
      if (isLocalImageUri(originalImageUrl)) {
        try {
          const uploaded = await uploadCustomFoodImageApi(res.id, originalImageUrl);
          if (uploaded.food) {
            food = mapFoodResponseToFood(uploaded.food);
          } else if (uploaded.imageUrl) {
            food = { ...food, imageUrl: uploaded.imageUrl };
          }
        } catch {
          // Giữ lại URI ảnh cục bộ nếu upload thất bại để không mất bản ghi vừa tạo
        }
      }
      return !food.imageUrl && originalImageUrl ? { ...food, imageUrl: originalImageUrl } : food;
    },
    []
  );

  const saveCustomFood = useCallback((food: Omit<Food, 'id' | 'isCustom'> & { id?: string }) => {
    const foodId = food.id ?? id('custom');
    const fullFood: Food = { ...food, id: foodId, isCustom: true };
    setState((current) => ({
      ...current,
      customFoods: [...current.customFoods.filter((item) => item.id !== foodId), fullFood],
    }));
    const localImageUri = isLocalImageUri(food.imageUrl) ? food.imageUrl : null;
    const payload: CustomFoodRequest = {
      name: food.name,
      category: food.category ?? 'OTHER',
      defaultServingName: food.defaultServingName ?? `${food.servingGrams}g`,
      defaultServingGrams: food.servingGrams || 100,
      caloriesPer100g: food.calories,
      proteinPer100g: food.protein,
      carbsPer100g: food.carbs,
      fatPer100g: food.fat,
      sugarPer100g: food.sugar ?? 0,
      fiberPer100g: food.fiber ?? 0,
      suitableMealTypes: food.suitableMealTypes ?? ['LUNCH', 'DINNER'],
      imageUrl: localImageUri ? null : (food.imageUrl ?? null),
    };
    const handleCreatedOrUpdated = async (res: FoodResponse) => {
      const mapped = await finalizeCustomFoodWithImage(res, food.imageUrl);
      cacheFood(mapped);
      setState((current) => ({
        ...current,
        customFoods: current.customFoods.map((item) =>
          item.id === foodId || item.id === mapped.id ? mapped : item
        ),
      }));
    };
    if (isUuid(food.id)) {
      void updateCustomFoodApi(food.id, payload)
        .then(handleCreatedOrUpdated)
        .catch(() => undefined);
    } else {
      void createCustomFoodApi(payload)
        .then(handleCreatedOrUpdated)
        .catch(() => undefined);
    }
    return foodId;
  }, [cacheFood, finalizeCustomFoodWithImage]);

  const saveCustomFoodAsync = useCallback(
    async (payload: CustomFoodRequest, foodId?: string): Promise<Food> => {
      const requestPayload: CustomFoodRequest = isLocalImageUri(payload.imageUrl)
        ? { ...payload, imageUrl: null }
        : payload;

      const res = isUuid(foodId)
        ? await updateCustomFoodApi(foodId, requestPayload)
        : await createCustomFoodApi(requestPayload);

      const effectiveFood = await finalizeCustomFoodWithImage(res, payload.imageUrl);
      cacheFood(effectiveFood);
      setState((current) => ({
        ...current,
        customFoods: [
          ...current.customFoods.filter((item) => item.id !== (foodId || effectiveFood.id)),
          effectiveFood,
        ],
      }));
      return effectiveFood;
    },
    [cacheFood, finalizeCustomFoodWithImage]
  );

  const deleteCustomFoodAsync = useCallback(async (foodId: string): Promise<void> => {
    if (isUuid(foodId)) {
      await deleteCustomFoodApi(foodId);
    }
    setState((current) => ({
      ...current,
      customFoods: current.customFoods.filter((item) => item.id !== foodId),
      recentFoodIds: current.recentFoodIds.filter((item) => item !== foodId),
      favoriteFoodIds: current.favoriteFoodIds.filter((item) => item !== foodId),
    }));
  }, []);

  const saveRecipeAsync = useCallback(
    async (payload: RecipeFoodRequest): Promise<Food> => {
      const requestPayload: RecipeFoodRequest = isLocalImageUri(payload.imageUrl)
        ? { ...payload, imageUrl: null }
        : payload;

      const res = await createRecipeFoodApi(requestPayload);
      const effectiveFood = await finalizeCustomFoodWithImage(res, payload.imageUrl);
      cacheFood(effectiveFood);
      setState((current) => ({
        ...current,
        customFoods: [...current.customFoods.filter((item) => item.id !== effectiveFood.id), effectiveFood],
      }));
      return effectiveFood;
    },
    [cacheFood, finalizeCustomFoodWithImage]
  );

  const value = useMemo<NutritionContextValue>(
    () => ({
      state,
      ready,
      foods,
      recentServerFoods,
      dailySummaries,
      findFood,
      fetchFoodDetail,
      cacheFood,
      refreshDateData,
      refreshRecentFoods,
      recalculateSummary,
      getSummary,
      getLogs,
      addFoodLog,
      addFoodLogAsync,
      addMultipleFoodLogs,
      updateFoodLog,
      deleteFoodLog,
      copyMeal,
      addWater,
      addWeight,
      saveCustomFood,
      saveCustomFoodAsync,
      deleteCustomFoodAsync,
      saveRecipeAsync,
      setSelectedDate: (date) => setState((current) => ({ ...current, selectedDate: date })),
      setWalkthroughSeen: () => setState((current) => ({ ...current, walkthroughSeen: true })),
    }),
    [
      state,
      ready,
      foods,
      recentServerFoods,
      dailySummaries,
      findFood,
      fetchFoodDetail,
      cacheFood,
      refreshDateData,
      refreshRecentFoods,
      recalculateSummary,
      getSummary,
      getLogs,
      addFoodLog,
      addFoodLogAsync,
      addMultipleFoodLogs,
      updateFoodLog,
      deleteFoodLog,
      copyMeal,
      addWater,
      addWeight,
      saveCustomFood,
      saveCustomFoodAsync,
      deleteCustomFoodAsync,
      saveRecipeAsync,
    ]
  );

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
}

export function useNutrition() {
  const value = useContext(NutritionContext);
  if (!value) throw new Error('useNutrition must be used inside NutritionProvider');
  return value;
}
