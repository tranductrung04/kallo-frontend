import type { ActivityLog, HealthSyncLog, WhrRiskLevel } from './types';

export function calculateCaloriesBurned(met: number, weightKg: number, durationMinutes: number): number {
  if (!Number.isFinite(met) || !Number.isFinite(weightKg) || !Number.isFinite(durationMinutes)) return 0;
  if (met <= 0 || weightKg <= 0 || durationMinutes <= 0) return 0;
  const hours = durationMinutes / 60;
  return Math.round(met * weightKg * hours);
}

export function estimateStepCalories(steps: number, weightKg: number, heightCm = 170): number {
  if (!Number.isFinite(steps) || steps <= 0 || !Number.isFinite(weightKg) || weightKg <= 0) return 0;
  const strideMeters = (heightCm * 0.414) / 100;
  const distanceKm = (steps * strideMeters) / 1000;
  // ~0.75 kcal per kg per km walked
  return Math.round(distanceKm * weightKg * 0.75);
}

export function calculateWhr(waistCm: number, hipCm: number): number {
  if (!Number.isFinite(waistCm) || !Number.isFinite(hipCm) || waistCm <= 0 || hipCm <= 0) return 0;
  const ratio = waistCm / hipCm;
  return Math.round(ratio * 100) / 100;
}

export function classifyWhrRisk(
  whr: number,
  gender: 'male' | 'female' | 'other' = 'male'
): { riskLevel: WhrRiskLevel; riskLabel: string } {
  if (gender === 'female') {
    if (whr < 0.80) return { riskLevel: 'low', riskLabel: 'Bình thường (Ít nguy cơ)' };
    if (whr < 0.85) return { riskLevel: 'moderate', riskLabel: 'Tăng nhẹ (Cần chú ý)' };
    return { riskLevel: 'high', riskLabel: 'Nguy cơ cao về chuyển hóa & tim mạch' };
  }
  // Male and default
  if (whr < 0.90) return { riskLevel: 'low', riskLabel: 'Bình thường (Ít nguy cơ)' };
  if (whr < 1.00) return { riskLevel: 'moderate', riskLabel: 'Tăng nhẹ (Cần chú ý)' };
  return { riskLevel: 'high', riskLabel: 'Nguy cơ cao về chuyển hóa & tim mạch' };
}

export function deduplicateSyncLogs(
  existing: HealthSyncLog[],
  incoming: HealthSyncLog
): { updated: HealthSyncLog[]; isDuplicate: boolean; deltaSteps: number; deltaCalories: number } {
  const matchIndex = existing.findIndex(
    (item) => item.source === incoming.source && (item.externalId === incoming.externalId || item.date === incoming.date)
  );

  if (matchIndex >= 0) {
    const prev = existing[matchIndex];
    if (prev.steps === incoming.steps && prev.caloriesBurned === incoming.caloriesBurned) {
      return { updated: existing, isDuplicate: true, deltaSteps: 0, deltaCalories: 0 };
    }
    const updated = [...existing];
    updated[matchIndex] = { ...incoming, id: prev.id };
    return {
      updated,
      isDuplicate: false,
      deltaSteps: Math.max(0, incoming.steps - prev.steps),
      deltaCalories: Math.max(0, incoming.caloriesBurned - prev.caloriesBurned),
    };
  }

  return {
    updated: [incoming, ...existing],
    isDuplicate: false,
    deltaSteps: incoming.steps,
    deltaCalories: incoming.caloriesBurned,
  };
}

export function aggregateDailyActivity(
  activityLogs: ActivityLog[],
  syncLogs: HealthSyncLog[],
  date: string
) {
  const dayManual = activityLogs.filter((log) => log.date === date);
  const manualCalories = dayManual.reduce((sum, item) => sum + item.caloriesBurned, 0);

  // Group sync logs by source for this date and pick latest/highest per source to avoid overcounting
  const daySyncs = syncLogs.filter((log) => log.date === date && log.status === 'SUCCESS');
  const syncSteps = daySyncs.reduce((max, s) => Math.max(max, s.steps), 0);
  const syncCalories = daySyncs.reduce((max, s) => Math.max(max, s.caloriesBurned), 0);

  // Total calories burned = manual workouts + passive synced calories
  const totalCaloriesBurned = manualCalories + syncCalories;

  return {
    date,
    manualCalories,
    syncCalories,
    totalCaloriesBurned,
    totalSteps: syncSteps,
    workoutCount: dayManual.length,
    manualLogs: dayManual,
  };
}
