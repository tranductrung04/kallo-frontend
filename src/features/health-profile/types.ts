export type Gender = "male" | "female" | "other";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "high"
  | "veryHigh";
export type GoalType = "lose" | "maintain" | "gain";
export type MacroName = "protein" | "carbs" | "fat";

export type MacroPercentages = Record<MacroName, number>;
export type MacroTargets = MacroPercentages & {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

// ── Backend Enums (exact match with Spring Boot BE) ──────────────────────────
export type BackendGender = "MALE" | "FEMALE" | "OTHER";
export type BackendActivityLevel =
  | "SEDENTARY"
  | "LIGHTLY_ACTIVE"
  | "MODERATELY_ACTIVE"
  | "VERY_ACTIVE"
  | "EXTRA_ACTIVE";
export type BackendGoalType = "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT";
export type BackendBmiCategory =
  | "UNDERWEIGHT"
  | "NORMAL"
  | "OVERWEIGHT"
  | "OBESE";

// ── Bi-directional Mappers (FE UI <-> BE API) ───────────────────────────────
export function toBackendGender(gender?: Gender): BackendGender {
  switch (gender) {
    case "male":
      return "MALE";
    case "female":
      return "FEMALE";
    case "other":
    default:
      return "OTHER";
  }
}

export function fromBackendGender(gender?: BackendGender | string): Gender {
  switch (gender) {
    case "MALE":
      return "male";
    case "FEMALE":
      return "female";
    default:
      return "other";
  }
}

export function toBackendActivityLevel(
  level?: ActivityLevel,
): BackendActivityLevel {
  switch (level) {
    case "sedentary":
      return "SEDENTARY";
    case "light":
      return "LIGHTLY_ACTIVE";
    case "moderate":
      return "MODERATELY_ACTIVE";
    case "high":
      return "VERY_ACTIVE";
    case "veryHigh":
      return "EXTRA_ACTIVE";
    default:
      return "MODERATELY_ACTIVE";
  }
}

export function fromBackendActivityLevel(
  level?: BackendActivityLevel | string,
): ActivityLevel {
  switch (level) {
    case "SEDENTARY":
      return "sedentary";
    case "LIGHTLY_ACTIVE":
      return "light";
    case "MODERATELY_ACTIVE":
      return "moderate";
    case "VERY_ACTIVE":
      return "high";
    case "EXTRA_ACTIVE":
      return "veryHigh";
    default:
      return "moderate";
  }
}

export function toBackendGoalType(goal?: GoalType): BackendGoalType {
  switch (goal) {
    case "lose":
      return "LOSE_WEIGHT";
    case "gain":
      return "GAIN_WEIGHT";
    case "maintain":
    default:
      return "MAINTAIN_WEIGHT";
  }
}

export function fromBackendGoalType(goal?: BackendGoalType | string): GoalType {
  switch (goal) {
    case "LOSE_WEIGHT":
      return "lose";
    case "GAIN_WEIGHT":
      return "gain";
    case "MAINTAIN_WEIGHT":
    default:
      return "maintain";
  }
}

// ── Backend API Request / Response Types ─────────────────────────────────────
export type HealthProfileRequestPayload = {
  gender: BackendGender;
  dob: string; // YYYY-MM-DD (khớp với ProfileRequestDto Spring Boot)
  birthDate?: string; // Tương thích ngược
  heightCm: number;
  weightKg: number;
  activityLevel: BackendActivityLevel;
  goalType: BackendGoalType;
  targetWeightKg?: number | null;
  weeklyRateKg?: number | null;
  customProteinPct?: number;
  customCarbsPct?: number;
  customFatPct?: number;
  customWaterGoalMl?: number;
  allergies?: string[];
};

export type MacronutrientsResponse = {
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
};

export type HealthProfileResponse = {
  id?: string;
  userId: string;
  gender: BackendGender;
  dob: string;
  birthDate?: string;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: BackendActivityLevel;
  goalType: BackendGoalType;
  targetWeightKg: number | null;
  weeklyRateKg: number;
  bmi: number;
  bmiCategory?: BackendBmiCategory;
  bmiCategoryVi?: string;
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  macronutrients?: MacronutrientsResponse;
  waterLiters: number;
  rateClamped: boolean;
  recalculationRecommended: boolean;
  recommendedTdee?: number | null;
  recommendedDailyCalorieGoal?: number | null;
  latestLoggedWeightKg?: number | null;
  goalAdvice?: string | null;
  version?: number;
  // Các thuộc tính tiện ích tương thích UI cũ
  safetyClamped?: boolean;
  proteinGoalG?: number;
  carbsGoalG?: number;
  fatGoalG?: number;
  proteinPct?: number;
  carbsPct?: number;
  fatPct?: number;
  customMacro?: boolean;
  waterGoalMl?: number;
  allergies?: string[];
  createdAt?: string;
  updatedAt?: string;
};

// ── Bệnh mạn tính (Chronic Conditions) Types ─────────────────────────────────
export type ChronicConditionResponse = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export type UserChronicConditionItemRequest = {
  conditionId: string;
  diagnosedAt?: string | null;
  note?: string | null;
};

export type UpdateUserChronicConditionsRequest = {
  conditions: UserChronicConditionItemRequest[];
};

export type UserChronicConditionResponse = {
  conditionId: string;
  code: string;
  name: string;
  description?: string | null;
  diagnosedAt?: string | null;
  note?: string | null;
};

// ── Dị ứng thực phẩm (Allergies) Types ──────────────────────────────────────
export type UserAllergyItemRequest = {
  ingredientId: string;
  note?: string | null;
};

export type UpdateUserAllergiesRequest = {
  allergies: UserAllergyItemRequest[];
};

export type UserAllergyResponse = {
  ingredientId: string;
  name: string;
  note?: string | null;
  active: boolean;
};

// Kept for backward compatibility with local cache/drafts
export type HealthProfilePayload = {
  nickname?: string;
  gender: Gender;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  targetWeightKg: number;
  weeklyRateKg: number;
  allergies: string[];
  dietaryPreference?: string;
  healthConditions?: string[];
  bmi: number;
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  proteinGoalGrams: number;
  carbsGoalGrams: number;
  fatGoalGrams: number;
  waterGoalMl: number;
};

export type HealthProfileCalculationResult = {
  bmi: number;
  bmr: number;
  tdee: number;
  dailyCalorieGoal: number;
  macros: MacroTargets;
  unsafe: boolean;
};

export type HealthProfileDraft = {
  nickname: string;
  dependent: string;
  gender: Gender;
  age: string;
  height: string;
  weight: string;
  activity: ActivityLevel;
  goal: GoalType;
  targetWeight: string;
  weeklyRate: string;
  allergies: string[];
  customAllergy: string;
  dietaryPreference: string;
  healthConditions: string[];
  macros: MacroPercentages;
  chronicConditionIds?: string[];
  allergyIngredientIds?: string[];
};

export const COMMON_ALLERGIES = [
  "Hải sản",
  "Sữa & Chế phẩm sữa",
  "Đậu phộng & Hạt",
  "Trứng gà/vịt",
  "Gluten / Lúa mì",
  "Đậu nành",
];

export const STANDARD_ALLERGENS: Array<{
  id: string;
  name: string;
  nameVi: string;
}> = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Peanuts (Lạc / Đậu phộng)",
    nameVi: "Đậu phộng / Lạc",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Cow's Milk (Sữa bò)",
    nameVi: "Sữa & Chế phẩm sữa bò",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Eggs (Trứng)",
    nameVi: "Trứng gà / Trứng vịt",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Tree Nuts (Hạt cây)",
    nameVi: "Hạt điều, hạnh nhân, óc chó",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "Soybeans (Đậu nành)",
    nameVi: "Đậu nành & Chế phẩm",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Wheat (Lúa mì / Gluten)",
    nameVi: "Gluten / Bột mì",
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "Fish (Cá)",
    nameVi: "Cá biển & Cá nước ngọt",
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    name: "Crustacean Shellfish (Hải sản có vỏ)",
    nameVi: "Tôm, cua, ốc, nghêu, sò",
  },
  {
    id: "00000000-0000-0000-0000-000000000009",
    name: "Sesame (Vừng / Mè)",
    nameVi: "Mè đen / Vừng",
  },
];

export const ACTIVITY_OPTIONS: Array<[ActivityLevel, string]> = [
  ["sedentary", "Ít vận động"],
  ["light", "Nhẹ"],
  ["moderate", "Vừa"],
  ["high", "Nhiều"],
  ["veryHigh", "Rất nhiều"],
];

export const GOAL_OPTIONS: Array<[GoalType, string]> = [
  ["lose", "Giảm cân"],
  ["maintain", "Giữ cân"],
  ["gain", "Tăng cân"],
];
