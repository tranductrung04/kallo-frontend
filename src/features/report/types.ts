export type PeriodType = 'day' | 'week' | 'month';

export type DailyReportItem = {
  date: string;
  label: string;
  caloriesIn: number;
  caloriesBurned: number;
  caloriesGoal: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  steps: number;
  weightKg?: number;
};

export type MacroStatus = 'ok' | 'over' | 'under';

export type MacroItemReport = {
  actualGrams: number;
  targetGrams: number;
  percentage: number;
  targetPercentage: number;
  status: MacroStatus;
};

export type MacroReportData = {
  protein: MacroItemReport;
  carbs: MacroItemReport;
  fat: MacroItemReport;
  totalCalories: number;
};

export type WeightTrendPoint = {
  date: string;
  label: string;
  weightKg?: number;
  targetKg: number;
  trendKg?: number;
};

export type WeightForecast = {
  hasEnoughData: boolean;
  loggedDaysCount: number;
  requiredDays: number;
  weeklyRateKg: number;
  slope: number;
  isCorrectDirection: boolean;
  currentWeightKg?: number;
  targetWeightKg: number;
  estimatedWeeks?: number;
  estimatedDate?: string;
  message: string;
};

export type PeriodSummary = {
  period: PeriodType;
  title: string;
  totalCaloriesIn: number;
  totalCaloriesBurned: number;
  avgCaloriesIn: number;
  avgCaloriesBurned: number;
  avgWaterMl: number;
  avgSteps: number;
  days: DailyReportItem[];
};
