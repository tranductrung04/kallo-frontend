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
  source: 'MANUAL' | 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'SENSOR';
  externalId?: string;
  timestamp?: string;
};

export type HealthSyncLog = {
  id: string;
  date: string;
  source: 'HEALTH_CONNECT' | 'APPLE_HEALTH' | 'SENSOR';
  externalId: string;
  steps: number;
  caloriesBurned: number;
  heartRateAvg?: number;
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

export type ActivityState = {
  activityLogs: ActivityLog[];
  syncLogs: HealthSyncLog[];
  bodyMetricLogs: BodyMetricLog[];
  syncStatus: {
    healthConnect: HealthSyncStatus;
    appleHealth: HealthSyncStatus;
  };
  stepGoal: number;
};

export type ActivityContextValue = {
  state: ActivityState;
  ready: boolean;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'caloriesBurned'> & { caloriesBurned?: number }) => ActivityLog;
  deleteActivityLog: (id: string) => void;
  getActivitiesForDate: (date: string) => ActivityLog[];
  getTotalCaloriesBurnedForDate: (date: string) => number;
  getTotalStepsForDate: (date: string) => number;
  syncHealthData: (source?: 'HEALTH_CONNECT' | 'APPLE_HEALTH') => Promise<{ success: boolean; newSteps: number; newCalories: number; duplicate: boolean }>;
  addBodyMetricLog: (waistCm: number, hipCm: number, gender?: 'male' | 'female' | 'other', date?: string) => BodyMetricLog | null;
  getLatestBodyMetric: () => BodyMetricLog | undefined;
  requestHealthPermission: (source: 'HEALTH_CONNECT' | 'APPLE_HEALTH') => Promise<HealthSyncStatus>;
  updateStepGoal: (goal: number) => void;
};
