import type { Food, FoodLog, NutritionGoals, WeightLog } from '@/features/nutrition/types';
import { formatNumber, scaleNutrition, todayKey } from '@/features/nutrition/utils';
import type { ActivityLog, HealthSyncLog } from '@/features/activity/types';
import { aggregateDailyActivity } from '@/features/activity/utils';
import type {
  DailyReportItem,
  MacroItemReport,
  MacroReportData,
  PeriodSummary,
  PeriodType,
  WeightForecast,
  WeightTrendPoint,
} from './types';

export function getPeriodDates(period: PeriodType, centerDate: string = todayKey()): string[] {
  const center = new Date(`${centerDate}T12:00:00`);
  if (period === 'day') {
    return [centerDate];
  }
  if (period === 'week') {
    // 7 days Monday to Sunday
    const day = center.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(center);
      d.setDate(center.getDate() + mondayOffset + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateNum = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${dateNum}`;
    });
  }
  // Month: 30 days ending at centerDate
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(center);
    d.setDate(center.getDate() - (29 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${dateNum}`;
  });
}

export function aggregatePeriodSummary(
  period: PeriodType,
  dates: string[],
  foodLogs: FoodLog[],
  activityLogs: ActivityLog[],
  syncLogs: HealthSyncLog[],
  waterLogs: Array<{ date: string; amountMl: number }>,
  weightLogs: WeightLog[],
  foods: Food[],
  goals: NutritionGoals
): PeriodSummary {
  const days: DailyReportItem[] = dates.map((date) => {
    const dateObj = new Date(`${date}T12:00:00`);
    const label =
      period === 'month'
        ? `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
        : dateObj.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });

    // Calories In & Macros from food logs
    const dayFoods = foodLogs.filter((l) => l.date === date);
    const nutrition = dayFoods.reduce(
      (sum, log) => {
        const food = foods.find((f) => f.id === log.foodId);
        const vals = log.nutritionSnapshot || (food ? scaleNutrition(food, log.grams) : null);
        if (!vals) return sum;
        return {
          calories: sum.calories + vals.calories,
          protein: sum.protein + vals.protein,
          carbs: sum.carbs + vals.carbs,
          fat: sum.fat + vals.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Calories burned and steps from activity
    const actSummary = aggregateDailyActivity(activityLogs, syncLogs, date);

    // Water
    const dayWater = waterLogs
      .filter((w) => w.date === date)
      .reduce((sum, w) => sum + w.amountMl, 0);

    // Latest weight on or before this date
    const weight = weightLogs
      .filter((w) => w.date <= date)
      .sort((a, b) => b.date.localeCompare(a.date))[0]?.weightKg;

    return {
      date,
      label,
      caloriesIn: Math.round(nutrition.calories),
      caloriesBurned: Math.round(actSummary.totalCaloriesBurned),
      caloriesGoal: goals.calories,
      protein: Math.round(nutrition.protein),
      carbs: Math.round(nutrition.carbs),
      fat: Math.round(nutrition.fat),
      waterMl: dayWater,
      steps: actSummary.totalSteps,
      weightKg: weight,
    };
  });

  const totalCaloriesIn = days.reduce((sum, d) => sum + d.caloriesIn, 0);
  const totalCaloriesBurned = days.reduce((sum, d) => sum + d.caloriesBurned, 0);
  const totalWater = days.reduce((sum, d) => sum + d.waterMl, 0);
  const totalSteps = days.reduce((sum, d) => sum + d.steps, 0);

  const len = Math.max(1, days.length);

  const periodTitle =
    period === 'day'
      ? 'Hôm nay'
      : period === 'week'
      ? 'Tuần này'
      : '30 ngày qua';

  return {
    period,
    title: periodTitle,
    totalCaloriesIn,
    totalCaloriesBurned,
    avgCaloriesIn: Math.round(totalCaloriesIn / len),
    avgCaloriesBurned: Math.round(totalCaloriesBurned / len),
    avgWaterMl: Math.round(totalWater / len),
    avgSteps: Math.round(totalSteps / len),
    days,
  };
}

export function calculateMacroReport(days: DailyReportItem[], goals: NutritionGoals): MacroReportData {
  const totals = days.reduce(
    (acc, d) => ({
      protein: acc.protein + d.protein,
      carbs: acc.carbs + d.carbs,
      fat: acc.fat + d.fat,
      calories: acc.calories + d.caloriesIn,
    }),
    { protein: 0, carbs: 0, fat: 0, calories: 0 }
  );

  const len = Math.max(1, days.length);
  const avgProtein = totals.protein / len;
  const avgCarbs = totals.carbs / len;
  const avgFat = totals.fat / len;

  const totalMacroCalories = avgProtein * 4 + avgCarbs * 4 + avgFat * 9;
  const pPct = totalMacroCalories > 0 ? Math.round((avgProtein * 4 * 100) / totalMacroCalories) : 0;
  const cPct = totalMacroCalories > 0 ? Math.round((avgCarbs * 4 * 100) / totalMacroCalories) : 0;
  const fPct = totalMacroCalories > 0 ? Math.max(0, 100 - pPct - cPct) : 0;

  const getStatus = (actual: number, target: number): 'ok' | 'over' | 'under' => {
    if (!target) return 'ok';
    const ratio = actual / target;
    if (ratio > 1.15) return 'over';
    if (ratio < 0.85) return 'under';
    return 'ok';
  };

  const createItem = (
    actual: number,
    target: number,
    pct: number,
    targetPct: number
  ): MacroItemReport => ({
    actualGrams: Math.round(actual),
    targetGrams: Math.round(target),
    percentage: pct,
    targetPercentage: targetPct,
    status: getStatus(actual, target),
  });

  return {
    protein: createItem(avgProtein, goals.protein, pPct, 30),
    carbs: createItem(avgCarbs, goals.carbs, cPct, 45),
    fat: createItem(avgFat, goals.fat, fPct, 25),
    totalCalories: Math.round(totals.calories / len),
  };
}

export function calculateWeightTrendAndForecast(
  weightLogs: WeightLog[],
  targetWeightKg: number,
  today: string = todayKey()
): { trendPoints: WeightTrendPoint[]; forecast: WeightForecast } {
  // Sort distinct dates
  const sorted = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
  const uniqueDateMap = new Map<string, number>();
  for (const log of sorted) {
    uniqueDateMap.set(log.date, log.weightKg);
  }

  const distinctCount = uniqueDateMap.size;
  const requiredDays = 14;

  if (distinctCount < requiredDays) {
    const points: WeightTrendPoint[] = Array.from(uniqueDateMap.entries()).map(([d, w]) => ({
      date: d,
      label: d.slice(5),
      weightKg: w,
      targetKg: targetWeightKg,
    }));

    return {
      trendPoints: points,
      forecast: {
        hasEnoughData: false,
        loggedDaysCount: distinctCount,
        requiredDays,
        weeklyRateKg: 0,
        slope: 0,
        isCorrectDirection: false,
        targetWeightKg,
        message: `Cần ghi nhận thêm ${requiredDays - distinctCount}/14 ngày cân nặng để AI mở khóa dự báo xu hướng.`,
      },
    };
  }

  // Linear Regression on sorted data
  const entries = Array.from(uniqueDateMap.entries());
  const N = entries.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < N; i++) {
    const y = entries[i][1];
    sumX += i;
    sumY += y;
    sumXY += i * y;
    sumXX += i * i;
  }

  const denom = N * sumXX - sumX * sumX;
  const slope = denom !== 0 ? (N * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / N;

  const currentWeight = entries[N - 1][1];
  const weeklyRateKg = Math.abs(slope * 7);

  // Check if trend direction matches goal
  // Goal: lose weight -> slope should be < -0.01
  // Goal: gain weight -> slope should be > 0.01
  const isLossGoal = targetWeightKg < currentWeight;
  const isCorrectDirection = isLossGoal ? slope < -0.01 : slope > 0.01;

  let estimatedWeeks: number | undefined;
  let estimatedDate: string | undefined;
  let message = '';

  if (isCorrectDirection && weeklyRateKg > 0.05) {
    const weightDiff = Math.abs(currentWeight - targetWeightKg);
    estimatedWeeks = Math.max(1, Math.round((weightDiff / weeklyRateKg) * 10) / 10);

    const targetDateObj = new Date(`${today}T12:00:00`);
    targetDateObj.setDate(targetDateObj.getDate() + Math.round(estimatedWeeks * 7));
    estimatedDate = `${String(targetDateObj.getDate()).padStart(2, '0')}/${String(
      targetDateObj.getMonth() + 1
    ).padStart(2, '0')}/${targetDateObj.getFullYear()}`;

    const verb = isLossGoal ? 'giảm' : 'tăng';
    message = `Với tốc độ ${verb} ${formatNumber(weeklyRateKg, 2)} kg/tuần, dự kiến bạn sẽ đạt mục tiêu ${formatNumber(
      targetWeightKg,
      1
    )} kg vào ngày ${estimatedDate}.`;
  } else {
    message = isLossGoal
      ? 'Xu hướng hiện tại đang tăng nhẹ hoặc đi ngang. Hãy điều chỉnh calo thâm hụt để bắt đầu lộ trình.'
      : 'Xu hướng cân nặng đang đi ngang. Hãy tăng lượng calo nạp để đạt mục tiêu tăng cân.';
  }

  const trendPoints: WeightTrendPoint[] = entries.map(([d, w], i) => ({
    date: d,
    label: d.slice(5),
    weightKg: w,
    targetKg: targetWeightKg,
    trendKg: Math.round((slope * i + intercept) * 10) / 10,
  }));

  return {
    trendPoints,
    forecast: {
      hasEnoughData: true,
      loggedDaysCount: distinctCount,
      requiredDays,
      weeklyRateKg: Math.round(weeklyRateKg * 100) / 100,
      slope,
      isCorrectDirection,
      currentWeightKg: currentWeight,
      targetWeightKg,
      estimatedWeeks,
      estimatedDate,
      message,
    },
  };
}
