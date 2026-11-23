import type {
  ActivityIntensity,
  ActivityResponse,
  ActivitySource,
  ActivityTypeResponse,
  DailyActivityStats,
  HealthDataType,
  HealthProvider,
  HealthSyncResponse,
  HealthSyncStatusResponse,
  WeightLogResponse,
} from './api';

export type ActivityType =
  | 'walking'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'gym'
  | 'yoga'
  | 'badminton'
  | 'pickleball'
  | 'football'
  | 'jump_rope'
  | 'other';

export type ActivityCatalogItem = {
  type: ActivityType;
  name: string;
  met: number;
  icon: string;
  category: string;
  defaultDuration: number;
};

export type ActivityLog = {
  id: string;
  date: string;
  type: ActivityType;
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  intensity?: 'low' | 'moderate' | 'high';
  source: 'MANUAL' | 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'SENSOR' | 'GPS' | 'HEALTHKIT';
  externalId?: string;
  timestamp?: string;
  clientUuid?: string;
  remoteId?: string;
  note?: string;
  routePolyline?: string;
};

export type HealthSyncLog = {
  id: string;
  date: string;
  source: 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'SENSOR' | 'HEALTHKIT' | 'DEVICE_SENSOR';
  externalId: string;
  steps: number;
  caloriesBurned: number;
  heartRateAvg?: number;
  heartRateMin?: number;
  heartRateMax?: number;
  syncedAt: string;
  status: 'SUCCESS' | 'FAILED';
};

export type HealthSyncStatus = 'CONNECTED' | 'NOT_GRANTED' | 'NOT_SUPPORTED';

export type WhrRiskLevel = 'low' | 'moderate' | 'high';

export type BodyMetricLog = {
  id: string;
  date: string;
  waistCm: number;
  hipCm: number;
  whr: number;
  riskLevel: WhrRiskLevel;
  riskLabel: string;
};

export type WeightLogItem = {
  id: string;
  clientUuid?: string;
  weightKg: number;
  loggedAt: string;
  date: string;
  note?: string;
};

export type ActivityState = {
  activityLogs: ActivityLog[];
  syncLogs: HealthSyncLog[];
  bodyMetricLogs: BodyMetricLog[];
  weightLogs: WeightLogItem[];
  dailySummary: Record<string, DailyActivityStats>;
  activityTypes: ActivityTypeResponse[];
  syncStatus: {
    healthConnect: HealthSyncStatus;
    appleHealth: HealthSyncStatus;
    deviceSensor?: HealthSyncStatus;
  };
  lastSyncedAt?: {
    healthConnect?: string | null;
    appleHealth?: string | null;
    deviceSensor?: string | null;
  };
  stepGoal: number;
  isLoading: boolean;
  error: string | null;
};

export type ActivityContextValue = {
  state: ActivityState;
  ready: boolean;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'caloriesBurned'> & { caloriesBurned?: number; id?: string }) => ActivityLog;
  deleteActivityLog: (id: string) => void;
  getActivitiesForDate: (date: string) => ActivityLog[];
  getTotalCaloriesBurnedForDate: (date: string) => number;
  getTotalStepsForDate: (date: string) => number;
  syncHealthData: (
    source?: 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'DEVICE_SENSOR',
    options?: { steps?: number; heartRate?: number; date?: string }
  ) => Promise<{
    success: boolean;
    newSteps: number;
    newCalories: number;
    duplicate: boolean;
    response?: HealthSyncResponse;
  }>;
  addBodyMetricLog: (waistCm: number, hipCm: number, gender?: 'male' | 'female' | 'other', date?: string) => BodyMetricLog | null;
  getLatestBodyMetric: () => BodyMetricLog | undefined;
  requestHealthPermission: (source: 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'DEVICE_SENSOR') => Promise<HealthSyncStatus>;
  disconnectHealth: (source: 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'DEVICE_SENSOR') => Promise<void>;
  refreshHealthSyncStatus: () => Promise<HealthSyncStatusResponse[]>;
  isHealthSyncConnected: (source?: 'HEALTH_CONNECT' | 'APPLE_HEALTH') => boolean;
  updateStepGoal: (goal: number) => void;
  // Enhanced API actions
  refreshActivities: () => Promise<void>;
  refreshWeightLogs: () => Promise<void>;
  addWeightLog: (weightKg: number, date?: string, note?: string) => Promise<WeightLogItem | null>;
  deleteWeightLog: (id: string) => Promise<boolean>;
  fetchSummary: (params?: { date?: string; from?: string; to?: string }) => Promise<DailyActivityStats[]>;
  clearError: () => void;
};
