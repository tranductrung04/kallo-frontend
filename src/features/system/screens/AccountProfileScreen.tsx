import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { images } from "@/assets/images";
import {
  AppButton,
  AppCard,
  AppInput,
  AppSwitch,
  AppText,
  useAlert,
} from "@/components/common";
import {
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CloseXIcon,
  CutleryIcon,
  DropletIcon,
  DumbbellIcon,
  FlameIcon,
  FootprintsIcon,
  GearSettingsIcon,
  GlobeIcon,
  LightningIcon,
  LockClosedIcon,
  LogOutIcon,
  MessageSquareIcon,
  MoonIcon,
  PenLineIcon,
  RefreshCwIcon,
  ScaleIcon,
  SearchIcon,
  SunIcon,
  TriangleAlertIcon,
  WheatIcon,
} from "@/components/icons";
import type { MainTabParamList, RootStackParamList } from "@/navigation/types";
import { useTheme } from "@/theme";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  deleteAccount,
  getApiErrorMessage,
  updateAvatar,
  updateMe,
} from "@/features/auth/api";
import { API_BASE_URL } from "@/services/api/client";
import { useNutrition } from "@/features/nutrition/NutritionProvider";
import { useOfflineSync } from "@/services/offline";
import {
  calculateBmi,
  bmiCategory,
  calculateBmr,
  calculateTdee,
} from "@/features/profile/utils/calculations";
import {
  saveHealthProfile,
  getHealthProfile,
  recalculateHealthProfile,
  getSystemChronicConditions,
  getUserChronicConditions,
  updateUserChronicConditions,
  getUserAllergies,
  updateUserAllergies,
} from "@/features/health-profile/api";
import {
  toBackendGender,
  toBackendActivityLevel,
  toBackendGoalType,
  fromBackendGender,
  fromBackendActivityLevel,
  fromBackendGoalType,
  STANDARD_ALLERGENS,
  type HealthProfileRequestPayload,
  type HealthProfileResponse,
  type ChronicConditionResponse,
  type UserChronicConditionResponse,
  type UserAllergyResponse,
  type ActivityLevel,
} from "@/features/health-profile/types";

type Props = BottomTabScreenProps<MainTabParamList, "Profile">;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function AccountProfileScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isDark = theme.scheme === "dark";
  const { signOut, user, refreshUser, isDemoMode } = useAuth();
  const { state: nutritionState } = useNutrition();
  const { isOnline, pendingCount, syncNow, toggleOnlineStatus } =
    useOfflineSync();
  const { showAlert, showConfirm } = useAlert();
  const root = navigation.getParent() as RootNavigation | undefined;

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  // Modals state
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHealthMetricsModal, setShowHealthMetricsModal] = useState(false);
  const [showCustomizeGoalsModal, setShowCustomizeGoalsModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditPhysicalModal, setShowEditPhysicalModal] = useState(false);
  const [showChronicModal, setShowChronicModal] = useState(false);
  const [showAllergiesModal, setShowAllergiesModal] = useState(false);

  // User Profile State
  const displayName = user?.displayName || "Nam";
  const email = user?.email || "";
  const [editDisplayName, setEditDisplayName] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [age, setAge] = useState(22);
  const [heightCm, setHeightCm] = useState(160);
  const [weightKg, setWeightKg] = useState(60);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");

  // Backend Health Profile State
  const [profileData, setProfileData] = useState<HealthProfileResponse | null>(
    null,
  );
  const [recalculating, setRecalculating] = useState(false);

  // Form states for Edit Physical Profile
  const [editGender, setEditGender] = useState<"male" | "female">("male");
  const [editHeight, setEditHeight] = useState("160");
  const [editWeight, setEditWeight] = useState("60");
  const [editGoal, setEditGoal] = useState<"lose" | "maintain" | "gain">(
    "maintain",
  );
  const [editTargetWeight, setEditTargetWeight] = useState("60");
  const [editWeeklyRate, setEditWeeklyRate] = useState("0.5");
  const [editActivity, setEditActivity] = useState<ActivityLevel>("moderate");
  const [savingPhysical, setSavingPhysical] = useState(false);

  // Chronic conditions & allergies states
  const [systemConditions, setSystemConditions] = useState<
    ChronicConditionResponse[]
  >([]);
  const [userConditions, setUserConditions] = useState<
    UserChronicConditionResponse[]
  >([]);
  const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>(
    [],
  );
  const [savingConditions, setSavingConditions] = useState(false);

  const [userAllergies, setUserAllergies] = useState<UserAllergyResponse[]>([]);
  const [selectedAllergyIds, setSelectedAllergyIds] = useState<string[]>([]);
  const [savingAllergies, setSavingAllergies] = useState(false);

  const applyProfileData = (p: any) => {
    if (!p) return;
    setProfileData(p);
    if (p.age) setAge(Number(p.age));
    if (p.heightCm) {
      setHeightCm(Number(p.heightCm));
      setEditHeight(String(p.heightCm));
    }
    if (p.weightKg) {
      setWeightKg(Number(p.weightKg));
      setEditWeight(String(p.weightKg));
    }
    if (p.gender) {
      const g =
        p.gender === "female" || p.gender === "FEMALE" ? "female" : "male";
      setGender(g);
      setEditGender(g);
    }
    if (p.activityLevel) {
      const act = fromBackendActivityLevel(p.activityLevel);
      setActivityLevel(act);
      setEditActivity(act);
    }
    if (p.goalType) {
      const gType = fromBackendGoalType(p.goalType);
      setEditGoal(gType);
    }
    if (p.targetWeightKg) {
      setEditTargetWeight(String(p.targetWeightKg));
    }
    if (p.weeklyRateKg !== undefined && p.weeklyRateKg !== null) {
      setEditWeeklyRate(String(p.weeklyRateKg));
    }
    if (p.dailyCalorieGoal) setTargetCalories(Math.round(p.dailyCalorieGoal));

    // Handle macros from response
    if (p.macronutrients) {
      const {
        proteinGrams: pG,
        carbGrams: cG,
        fatGrams: fG,
      } = p.macronutrients;
      const totalKcal = p.dailyCalorieGoal || pG * 4 + cG * 4 + fG * 9;
      if (totalKcal > 0) {
        setProteinPercent(Math.round(((pG * 4) / totalKcal) * 100));
        setCarbsPercent(Math.round(((cG * 4) / totalKcal) * 100));
        setFatPercent(Math.round(((fG * 9) / totalKcal) * 100));
      }
    }
  };

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem("@kallo/health-profile");
      if (raw) {
        applyProfileData(JSON.parse(raw));
      }
      const fresh = await getHealthProfile().catch(() => null);
      if (fresh) {
        applyProfileData(fresh);
        await AsyncStorage.setItem(
          "@kallo/health-profile",
          JSON.stringify(fresh),
        );
      }
    } catch {
      // ignore
    }

    try {
      const [sys, userConds, userAllerg] = await Promise.all([
        getSystemChronicConditions().catch(() => []),
        getUserChronicConditions().catch(() => []),
        getUserAllergies().catch(() => []),
      ]);
      setSystemConditions(sys || []);
      setUserConditions(userConds || []);
      setSelectedConditionIds((userConds || []).map((c) => c.conditionId));
      setUserAllergies(userAllerg || []);
      setSelectedAllergyIds((userAllerg || []).map((a) => a.ingredientId));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Nutrition goals & Macro State
  const [targetCalories, setTargetCalories] = useState(1794);
  const [proteinPercent, setProteinPercent] = useState(20);
  const [carbsPercent, setCarbsPercent] = useState(50);
  const [fatPercent, setFatPercent] = useState(30);

  // Calculated grams
  const proteinGrams = Math.round(
    (targetCalories * (proteinPercent / 100)) / 4,
  );
  const carbsGrams = Math.round((targetCalories * (carbsPercent / 100)) / 4);
  const fatGrams = Math.round((targetCalories * (fatPercent / 100)) / 9);

  // Health calculations (BMI, BMR, TDEE)
  const bmiVal = calculateBmi(weightKg, heightCm);
  const bmiDesc = bmiCategory(bmiVal);
  const bmrVal = Math.round(calculateBmr(gender, weightKg, heightCm, age));
  const tdeeVal = Math.round(calculateTdee(bmrVal, activityLevel));

  // SVG Segmented Ring Dimensions
  const ringSize = 130;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment stroke dashes with gaps
  const proteinLength = (circumference * proteinPercent) / 100;
  const carbsLength = (circumference * carbsPercent) / 100;
  const fatLength = (circumference * fatPercent) / 100;

  const proteinOffset = 0;
  const carbsOffset = -proteinLength;
  const fatOffset = -(proteinLength + carbsLength);

  const handlePickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setAvatarLoading(true);
        const asset = result.assets[0];
        await updateAvatar(asset.uri, asset.mimeType || "image/jpeg");
        await refreshUser();
        showAlert({
          title: "Thành công",
          message: "Đã cập nhật ảnh đại diện mới.",
          variant: "success",
        });
      }
    } catch (err) {
      showAlert({
        title: "Lỗi tải ảnh",
        message: getApiErrorMessage(err),
        variant: "error",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveDisplayName = async () => {
    if (!editDisplayName.trim()) return;
    try {
      await updateMe(
        editDisplayName.trim(),
        user?.timezone || "Asia/Ho_Chi_Minh",
      );
      await refreshUser();
      setShowEditNameModal(false);
      showAlert({
        title: "Thành công",
        message: "Đã cập nhật tên hiển thị.",
        variant: "success",
      });
    } catch (err) {
      showAlert({
        title: "Lỗi cập nhật",
        message: getApiErrorMessage(err),
        variant: "error",
      });
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError("Vui lòng nhập mật khẩu xác nhận.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteAccount(deletePassword.trim());
      setShowDeleteModal(false);
      await signOut();
      showAlert({
        title: "Đã xóa tài khoản",
        message:
          "Tài khoản của bạn đã được xóa thành công khỏi hệ thống Kallo.",
        variant: "success",
      });
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowSettingsModal(false);
    setDeletePassword("");
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleSaveGoals = async () => {
    if (proteinPercent + carbsPercent + fatPercent !== 100) {
      showAlert({
        title: "Chưa cân bằng tỷ lệ",
        message: "Tổng tỷ lệ % của Đạm, Carb và Béo phải bằng đúng 100%.",
        variant: "warning",
      });
      return;
    }
    try {
      const raw = await AsyncStorage.getItem("@kallo/health-profile");
      if (raw) {
        const existing = JSON.parse(raw);
        if (existing.gender && (existing.dob || existing.birthDate)) {
          const birthDateVal = existing.dob || existing.birthDate;
          const isMaintain =
            toBackendGoalType(existing.goalType) === "MAINTAIN_WEIGHT";
          const updatePayload: HealthProfileRequestPayload = {
            gender: toBackendGender(existing.gender),
            dob: birthDateVal,
            birthDate: birthDateVal,
            heightCm: existing.heightCm || heightCm,
            weightKg: existing.weightKg || weightKg,
            activityLevel: toBackendActivityLevel(existing.activityLevel),
            goalType: toBackendGoalType(existing.goalType),
            targetWeightKg: isMaintain ? null : existing.targetWeightKg,
            weeklyRateKg: isMaintain ? 0.0 : existing.weeklyRateKg,
            customProteinPct: proteinPercent,
            customCarbsPct: carbsPercent,
            customFatPct: fatPercent,
            customWaterGoalMl: (existing.weightKg || weightKg) * 35,
            allergies: existing.allergies,
          };
          const updated = await saveHealthProfile(updatePayload);
          await AsyncStorage.setItem(
            "@kallo/health-profile",
            JSON.stringify({ ...existing, ...updated }),
          );
          if (updated.dailyCalorieGoal) {
            setTargetCalories(updated.dailyCalorieGoal);
          }
        }
      }
    } catch {
      // Backend sync fallback
    }
    setShowCustomizeGoalsModal(false);
    showAlert({
      title: "Cập nhật thành công!",
      message: "Mục tiêu dinh dưỡng của bạn đã được cập nhật.",
      variant: "success",
    });
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      const updated = await recalculateHealthProfile();
      applyProfileData(updated);
      await AsyncStorage.setItem(
        "@kallo/health-profile",
        JSON.stringify(updated),
      );

      if (updated.goalAdvice === "TARGET_REACHED") {
        showAlert({
          variant: "success",
          title: "🎉 Chúc mừng bạn đã chạm đích!",
          message:
            'Bạn đã đạt mốc cân nặng mục tiêu thành công! Kallo đã tự động điều chỉnh kế hoạch sang "Duy trì cân nặng" để bảo toàn vóc dáng.',
        });
      } else {
        showAlert({
          variant: "success",
          title: "Tối ưu lại Calo thành công",
          message: `Mục tiêu dinh dưỡng mới: ${Math.round(updated.dailyCalorieGoal)} kcal/ngày (TDEE: ${Math.round(updated.tdee)} kcal).`,
        });
      }
    } catch (err) {
      showAlert({
        variant: "danger",
        title: "Lỗi",
        message: "Không thể tính toán lại lúc này. Vui lòng thử lại sau.",
      });
    } finally {
      setRecalculating(false);
    }
  };

  const handleSavePhysicalProfile = async () => {
    const h = parseFloat(editHeight);
    const w = parseFloat(editWeight);
    const targetW = parseFloat(editTargetWeight);
    const rate = parseFloat(editWeeklyRate);

    if (isNaN(h) || h < 50 || h > 250) {
      showAlert({
        variant: "danger",
        title: "Lỗi",
        message: "Chiều cao phải từ 50 đến 250 cm.",
      });
      return;
    }
    if (isNaN(w) || w < 20 || w > 300) {
      showAlert({
        variant: "danger",
        title: "Lỗi",
        message: "Cân nặng phải từ 20 đến 300 kg.",
      });
      return;
    }

    if (age < 18 && editGoal !== "maintain") {
      showAlert({
        variant: "danger",
        title: "Quy chuẩn an toàn y sinh",
        message:
          "Người dưới 18 tuổi chỉ được chọn Duy trì cân nặng để đảm bảo phát triển thể chất.",
      });
      return;
    }

    if (editGoal !== "maintain") {
      if (isNaN(targetW) || targetW < 20 || targetW > 300) {
        showAlert({
          variant: "danger",
          title: "Lỗi",
          message: "Cân nặng mục tiêu phải từ 20 đến 300 kg.",
        });
        return;
      }
      const targetBmi = targetW / ((h / 100) * (h / 100));
      if (editGoal === "lose" && targetBmi < 18.5) {
        showAlert({
          variant: "danger",
          title: "Mục tiêu chưa an toàn",
          message: `Mục tiêu cân nặng khiến BMI đạt ${targetBmi.toFixed(1)} (< 18.5 - thiếu cân nghiêm trọng). Vui lòng chọn mục tiêu an toàn hơn.`,
        });
        return;
      }
      if (editGoal === "gain" && targetBmi > 35) {
        showAlert({
          variant: "danger",
          title: "Mục tiêu quá cao",
          message: `Mục tiêu cân nặng khiến BMI đạt ${targetBmi.toFixed(1)} (> 35 - béo phì nguy hiểm).`,
        });
        return;
      }
      if (isNaN(rate) || rate <= 0 || rate > 1.5) {
        showAlert({
          variant: "danger",
          title: "Lỗi",
          message:
            "Tốc độ thay đổi cân nặng mỗi tuần phải từ 0.01 đến 1.5 kg/tuần.",
        });
        return;
      }
    }

    setSavingPhysical(true);
    try {
      const computedDob =
        profileData?.dob || `${new Date().getFullYear() - age}-01-01`;
      const isMaintain = editGoal === "maintain";

      const payload: HealthProfileRequestPayload = {
        gender: toBackendGender(editGender),
        dob: computedDob,
        birthDate: computedDob,
        heightCm: h,
        weightKg: w,
        activityLevel: toBackendActivityLevel(editActivity),
        goalType: toBackendGoalType(editGoal),
        targetWeightKg: isMaintain ? null : targetW,
        weeklyRateKg: isMaintain ? 0.0 : rate,
      };

      const updated = await saveHealthProfile(payload);
      applyProfileData(updated);
      await AsyncStorage.setItem(
        "@kallo/health-profile",
        JSON.stringify(updated),
      );
      setShowEditPhysicalModal(false);
      showAlert({
        variant: "success",
        title: "Cập nhật thành công",
        message:
          "Hồ sơ thể chất và chỉ số dinh dưỡng đã được đồng bộ với máy chủ.",
      });
    } catch (err) {
      showAlert({
        variant: "danger",
        title: "Lỗi cập nhật",
        message: getApiErrorMessage(err),
      });
    } finally {
      setSavingPhysical(false);
    }
  };

  const handleSaveChronicConditions = async () => {
    setSavingConditions(true);
    try {
      const res = await updateUserChronicConditions({
        conditions: selectedConditionIds.map((id) => ({ conditionId: id })),
      });
      setUserConditions(res || []);
      setShowChronicModal(false);
      showAlert({
        variant: "success",
        title: "Cập nhật thành công",
        message: "Danh sách bệnh mạn tính đã được lưu vào hồ sơ.",
      });
    } catch (err) {
      showAlert({
        variant: "danger",
        title: "Lỗi",
        message: getApiErrorMessage(err),
      });
    } finally {
      setSavingConditions(false);
    }
  };

  const handleSaveAllergies = async () => {
    setSavingAllergies(true);
    try {
      const res = await updateUserAllergies({
        allergies: selectedAllergyIds.map((id) => ({ ingredientId: id })),
      });
      setUserAllergies(res || []);
      setShowAllergiesModal(false);
      showAlert({
        variant: "success",
        title: "Cập nhật thành công",
        message: "Danh sách dị ứng thực phẩm đã được lưu vào hồ sơ.",
      });
    } catch (err) {
      showAlert({
        variant: "danger",
        title: "Lỗi",
        message: getApiErrorMessage(err),
      });
    } finally {
      setSavingAllergies(false);
    }
  };

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}
    >
      {/* ── Top Header Row ────────────────────────────────────────────── */}
      <View
        style={[styles.topHeader, { paddingTop: Math.max(insets.top, 12) + 8 }]}
      >
        <AppText variant="headlineLg" style={styles.headerTitle}>
          Hồ sơ cá nhân
        </AppText>
        <TouchableOpacity
          onPress={() => setShowSettingsModal(true)}
          style={[
            styles.settingsButton,
            { backgroundColor: theme.colors.surfaceHigh },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Cài đặt tài khoản"
        >
          <GearSettingsIcon size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User Avatar & Display Name ───────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              {avatarLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <AppText
                  variant="dataDisplay"
                  color="#FFFFFF"
                  style={styles.avatarLetter}
                >
                  {displayName.charAt(0).toUpperCase()}
                </AppText>
              )}
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.addPhotoButton,
                {
                  backgroundColor: isDark ? "#221D34" : "#FFFFFF",
                  borderColor: theme.colors.canvasBase,
                },
              ]}
              onPress={handlePickAvatar}
              accessibilityRole="button"
              accessibilityLabel="Thay đổi ảnh đại diện"
            >
              <AppText variant="labelLg" color={theme.colors.textPrimary}>
                +
              </AppText>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 10,
            }}
          >
            <AppText variant="headlineMd" style={styles.userName}>
              {displayName}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                setEditDisplayName(displayName);
                setShowEditNameModal(true);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Chỉnh sửa tên hiển thị"
            >
              <PenLineIcon size={18} color={theme.colors.brandPrimary} />
            </TouchableOpacity>
          </View>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {email || "Chăm sóc sức khỏe mỗi ngày"}
          </AppText>
        </View>

        {/* ── VIP / Trial Banner ───────────────────────────────────────── */}
        <View style={styles.vipBannerCard}>
          <View style={styles.vipBannerContent}>
            <AppText variant="labelLg" style={styles.vipBannerTitle}>
              Đua top bảng xếp hạng cùng bạn bè
            </AppText>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.vipBannerButton}
              onPress={() => root?.navigate("GameHub")}
            >
              <AppText variant="labelMd" style={styles.vipBannerButtonText}>
                Trải nghiệm ngay
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.vipBannerGraphic}>
            <Image
              source={images.paywallTrophy}
              style={styles.vipBannerTrophy}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Recalculate Recommendation Banner ────────────────────────── */}
        {profileData?.recalculationRecommended && (
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 16,
              padding: 14,
              borderRadius: 16,
              backgroundColor: isDark ? "rgba(139, 87, 232, 0.15)" : "#F3E8FF",
              borderWidth: 1,
              borderColor: theme.colors.brandPrimary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <LightningIcon size={16} color={theme.colors.brandPrimary} />
                <AppText
                  variant="labelLg"
                  style={{
                    color: theme.colors.brandPrimary,
                    fontWeight: "700",
                  }}
                >
                  Đề xuất cập nhật Calo & TDEE
                </AppText>
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Cân nặng mới ({profileData.latestLoggedWeightKg} kg) đã được ghi
                nhận. Đề xuất:{" "}
                {profileData.recommendedDailyCalorieGoal || "tối ưu"} kcal/ngày.
              </AppText>
            </View>
            <TouchableOpacity
              onPress={handleRecalculate}
              disabled={recalculating}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                backgroundColor: theme.colors.brandPrimary,
                borderRadius: 10,
                opacity: recalculating ? 0.7 : 1,
              }}
            >
              <AppText
                variant="labelMd"
                style={{ color: "#FFFFFF", fontWeight: "600" }}
              >
                {recalculating ? "Đang tính..." : "Áp dụng"}
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Physical Metrics Pill & Sub-actions ──────────────────────── */}
        <View style={styles.metricsCapsuleWrapper}>
          <View
            style={[
              styles.metricsCapsule,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.surfaceBorder,
              },
            ]}
          >
            <View style={styles.metricItemCol}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <CalendarIcon size={14} color={theme.colors.textSecondary} />
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {age} tuổi
                </AppText>
              </View>
            </View>
            <View
              style={[
                styles.capsuleDivider,
                { backgroundColor: theme.colors.surfaceBorder },
              ]}
            />
            <View style={styles.metricItemCol}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <FootprintsIcon size={14} color={theme.colors.textSecondary} />
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {heightCm} cm
                </AppText>
              </View>
            </View>
            <View
              style={[
                styles.capsuleDivider,
                { backgroundColor: theme.colors.surfaceBorder },
              ]}
            />
            <View style={styles.metricItemCol}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <ScaleIcon size={14} color={theme.colors.textSecondary} />
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {weightKg} kg
                </AppText>
              </View>
            </View>
          </View>

          <View style={[styles.metricsPillsRow, { flexWrap: "wrap", gap: 8 }]}>
            <AppButton
              label="Chỉ số sức khỏe"
              variant="outline"
              style={[
                styles.subActionPill,
                {
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.brandAction,
                },
              ]}
              onPress={() => setShowHealthMetricsModal(true)}
            />

            <AppButton
              label="Sửa thể chất"
              variant="outline"
              style={[
                styles.subActionPill,
                {
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.brandAction,
                },
              ]}
              onPress={() => setShowEditPhysicalModal(true)}
            />

            <AppButton
              label={`Bệnh nền (${userConditions.length})`}
              variant="outline"
              style={[
                styles.subActionPill,
                {
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: theme.colors.surface,
                  borderColor:
                    userConditions.length > 0
                      ? theme.colors.macroFats
                      : theme.colors.surfaceBorder,
                },
              ]}
              onPress={() => setShowChronicModal(true)}
            />

            <AppButton
              label={`Dị ứng (${userAllergies.length})`}
              variant="outline"
              style={[
                styles.subActionPill,
                {
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: theme.colors.surface,
                  borderColor:
                    userAllergies.length > 0
                      ? theme.colors.macroProtein
                      : theme.colors.surfaceBorder,
                },
              ]}
              onPress={() => setShowAllergiesModal(true)}
            />
          </View>
        </View>

        {/* ── Hành trình của bạn (Your Journey Card) ───────────────────── */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeaderClickable}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Report")}
          >
            <AppText variant="headlineSm">Hành trình của bạn</AppText>
            <AppText variant="headlineSm" color={theme.colors.textSecondary}>
              ›
            </AppText>
          </TouchableOpacity>

          <AppCard style={styles.journeyCard}>
            <View style={styles.targetIconWrapper}>
              <Image
                source={images.accountTarget}
                style={styles.targetIcon}
                resizeMode="contain"
              />
            </View>
            <AppText
              variant="headlineSm"
              align="center"
              style={styles.journeyTitle}
            >
              Bạn đang duy trì cân nặng rất tốt!
            </AppText>
            <AppText
              variant="caption"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.journeySubtitle}
            >
              Cập nhật lại cân nặng để xem tiến trình
            </AppText>

            {/* Visual Weight Slider Bar */}
            <View style={styles.weightTrackContainer}>
              <View
                style={[
                  styles.weightTrackBg,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "#E4E0F0",
                  },
                ]}
              >
                <View
                  style={[
                    styles.weightTrackFill,
                    { backgroundColor: theme.colors.brandPrimary },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.weightIndicatorDot,
                  { borderColor: theme.colors.brandPrimary },
                ]}
              >
                <View
                  style={[
                    styles.weightIndicatorInner,
                    { backgroundColor: theme.colors.brandPrimary },
                  ]}
                />
              </View>
              <AppText
                variant="labelMd"
                color={theme.colors.textPrimary}
                style={styles.weightIndicatorLabel}
              >
                {weightKg} kg
              </AppText>
            </View>
          </AppCard>
        </View>

        {/* ── Mục tiêu dinh dưỡng & đa lượng ────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AppText variant="headlineSm" style={styles.sectionHeaderTitle}>
            Mục tiêu dinh dưỡng & đa lượng
          </AppText>

          <AppCard style={styles.macroCard}>
            <View style={styles.macroRowContent}>
              {/* Left: Segmented Calorie Ring */}
              <View style={styles.calorieRingContainer}>
                <Svg
                  width={ringSize}
                  height={ringSize}
                  style={{ transform: [{ rotate: "-90deg" }] }}
                >
                  {/* Background Track */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={isDark ? "#221D34" : "#F1EFF9"}
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  {/* Protein Arc (Red / Coral) */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={theme.colors.macroProtein}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${proteinLength - 2} ${circumference}`}
                    strokeDashoffset={proteinOffset}
                    strokeLinecap="round"
                  />
                  {/* Carbs Arc (Blue / Cobalt) */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={theme.colors.macroCarbs}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${carbsLength - 2} ${circumference}`}
                    strokeDashoffset={carbsOffset}
                    strokeLinecap="round"
                  />
                  {/* Fat Arc (Yellow / Amber) */}
                  <Circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={radius}
                    stroke={theme.colors.macroFats}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${fatLength - 2} ${circumference}`}
                    strokeDashoffset={fatOffset}
                    strokeLinecap="round"
                  />
                </Svg>

                {/* Center of Ring: Flame + Calorie Number */}
                <View style={styles.ringCenterContent}>
                  <FlameIcon size={18} color={theme.colors.macroProtein} />
                  <AppText
                    variant="headlineSm"
                    style={styles.calorieNumberText}
                  >
                    {targetCalories.toLocaleString("vi-VN")}
                  </AppText>
                </View>
              </View>

              {/* Right: Macro breakdown list */}
              <View style={styles.macroListCol}>
                <View style={styles.macroItemRow}>
                  <LightningIcon size={16} color={theme.colors.macroProtein} />
                  <AppText
                    variant="bodyMd"
                    color={theme.colors.textSecondary}
                    style={styles.flex}
                  >
                    Chất đạm{" "}
                    <AppText variant="labelLg" color={theme.colors.textPrimary}>
                      {proteinPercent}%
                    </AppText>{" "}
                    ({proteinGrams}g)
                  </AppText>
                </View>

                <View style={styles.macroItemRow}>
                  <WheatIcon size={16} color={theme.colors.macroCarbs} />
                  <AppText
                    variant="bodyMd"
                    color={theme.colors.textSecondary}
                    style={styles.flex}
                  >
                    Đường bột{" "}
                    <AppText variant="labelLg" color={theme.colors.textPrimary}>
                      {carbsPercent}%
                    </AppText>{" "}
                    ({carbsGrams}g)
                  </AppText>
                </View>

                <View style={styles.macroItemRow}>
                  <DropletIcon size={16} color={theme.colors.macroFats} />
                  <AppText
                    variant="bodyMd"
                    color={theme.colors.textSecondary}
                    style={styles.flex}
                  >
                    Chất béo{" "}
                    <AppText variant="labelLg" color={theme.colors.textPrimary}>
                      {fatPercent}%
                    </AppText>{" "}
                    ({fatGrams}g)
                  </AppText>
                </View>
              </View>
            </View>

            {/* Bottom Button inside Macro Card */}
            <AppButton
              label="Tuỳ chỉnh mục tiêu"
              variant="outline"
              onPress={() => setShowCustomizeGoalsModal(true)}
              style={styles.customizeGoalBtn}
            />
          </AppCard>
        </View>

        {/* ── Trợ lý dinh dưỡng ─────────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={[
              styles.chatEntryCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.82}
            onPress={() => root?.navigate("NutritionChat")}
            accessibilityRole="button"
            accessibilityLabel="Mở trợ lý Kallo AI"
          >
            <View
              style={[
                styles.chatEntryIcon,
                { backgroundColor: theme.colors.brandPrimary },
              ]}
            >
              <Image
                source={images.mascotAvatar}
                style={styles.chatEntryImage}
                accessibilityLabel="Trợ lý Kallo AI"
              />
            </View>
            <View style={styles.chatEntryCopy}>
              <AppText variant="headlineSm">Trợ lý Kallo AI</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Hỏi về calo, thực đơn và dinh dưỡng hôm nay
              </AppText>
            </View>
            <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
              ›
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Xem báo cáo thống kê ──────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AppText variant="headlineSm" style={styles.sectionHeaderTitle}>
            Xem báo cáo thống kê
          </AppText>

          <View style={styles.statsIconsRow}>
            {/* Dinh dưỡng */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Report")}
            >
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: isDark ? "#2E2619" : "#FEF3C7" },
                ]}
              >
                <CutleryIcon size={20} color="#F59E0B" />
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Dinh dưỡng
              </AppText>
            </TouchableOpacity>

            {/* Tập luyện */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => root?.navigate("ActivityTracker")}
            >
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: isDark ? "#30182C" : "#FFE4E6" },
                ]}
              >
                <DumbbellIcon size={20} color="#EC4899" />
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Tập luyện
              </AppText>
            </TouchableOpacity>

            {/* Số bước */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => root?.navigate("HealthSync")}
            >
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: isDark ? "#162C22" : "#DCFCE7" },
                ]}
              >
                <FootprintsIcon size={20} color="#10B981" />
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Số bước
              </AppText>
            </TouchableOpacity>

            {/* Cân nặng */}
            <TouchableOpacity
              style={styles.statIconCol}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Report")}
            >
              <View
                style={[
                  styles.statIconCircle,
                  { backgroundColor: isDark ? "#1C2538" : "#E0F2FE" },
                ]}
              >
                <ScaleIcon size={20} color="#3B82F6" />
              </View>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Cân nặng
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Cộng đồng và hỗ trợ ───────────────────────────────────────── */}
        <View style={styles.sectionContainer}>
          <AppText variant="headlineSm" style={styles.sectionHeaderTitle}>
            Cộng đồng và hỗ trợ
          </AppText>

          {/* Community & Support Banner */}
          <TouchableOpacity
            style={styles.communityBannerWrap}
            activeOpacity={0.88}
            onPress={() =>
              showAlert({
                variant: "info",
                title: "Cộng đồng Kallo",
                message:
                  "Đang kết nối tới nhóm Facebook và Zalo Cộng đồng Healthy Kallo Việt Nam!",
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Gia nhập cộng đồng Kallo ngay"
          >
            <Image
              source={images.congDongHoTro}
              style={styles.communityBannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Social media tiles */}
          <AppCard style={styles.socialCard}>
            <View style={styles.socialSearchHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <SearchIcon size={14} color={theme.colors.textSecondary} />
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Tìm Kallo trên trang mạng xã hội
                </AppText>
              </View>
            </View>

            <View style={styles.socialTilesRow}>
              {/* TikTok */}
              <TouchableOpacity
                style={[
                  styles.socialTile,
                  { backgroundColor: theme.colors.surfaceHigh },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  showAlert({
                    variant: "info",
                    title: "Kallo TikTok",
                    message: "Theo dõi @kallo.health trên TikTok",
                  })
                }
              >
                <Image
                  source={images.tiktokLogo}
                  style={styles.socialLogoImg}
                  resizeMode="contain"
                />
                <AppText variant="caption" color={theme.colors.textPrimary}>
                  Tiktok
                </AppText>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                style={[
                  styles.socialTile,
                  { backgroundColor: theme.colors.surfaceHigh },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  showAlert({
                    variant: "info",
                    title: "Kallo Facebook",
                    message: "Theo dõi Fanpage Kallo Healthy",
                  })
                }
              >
                <Image
                  source={images.facebookLogo}
                  style={styles.socialLogoImg}
                  resizeMode="contain"
                />
                <AppText variant="caption" color={theme.colors.textPrimary}>
                  Facebook
                </AppText>
              </TouchableOpacity>

              {/* Instagram */}
              <TouchableOpacity
                style={[
                  styles.socialTile,
                  { backgroundColor: theme.colors.surfaceHigh },
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  showAlert({
                    variant: "info",
                    title: "Kallo Instagram",
                    message: "Theo dõi @kallo.vietnam trên Instagram",
                  })
                }
              >
                <Image
                  source={images.instagramLogo}
                  style={styles.socialLogoImg}
                  resizeMode="contain"
                />
                <AppText variant="caption" color={theme.colors.textPrimary}>
                  Instagram
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.menuDivider} />

            {/* Support center link */}
            <TouchableOpacity
              style={styles.supportCenterRow}
              activeOpacity={0.8}
              onPress={() =>
                showAlert({
                  variant: "info",
                  title: "Trung tâm hỗ trợ Kallo",
                  message:
                    "Hotline: 1900-KALLO\nEmail: support@kallo.health\nGiờ hỗ trợ: 08:00 - 21:00 hằng ngày",
                })
              }
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <GlobeIcon size={18} color={theme.colors.brandPrimary} />
                <AppText variant="bodyMd">Trung tâm hỗ trợ</AppText>
              </View>
              <AppText variant="bodySm" color={theme.colors.textSecondary}>
                ›
              </AppText>
            </TouchableOpacity>
          </AppCard>
        </View>

        {/* ── Footer Branding & Disclaimer ──────────────────────────────── */}
        <View style={styles.footerBranding}>
          <AppText variant="headlineXl" style={styles.footerLogoText}>
            kallo
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Phiên bản: 1.0.0 (52)
          </AppText>
          <AppText variant="caption" color={theme.colors.textSecondary}>
            Mã thiết bị: kallo-rn-android-77a4c
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textSecondary}
            style={styles.copyrightText}
          >
            © Kallo Healthy 2026, All Rights Reserved
          </AppText>
          <AppText
            variant="bodySm"
            align="center"
            color={theme.colors.textSecondary}
            style={styles.disclaimerText}
          >
            Mọi thông tin trên Kallo chỉ mang tính chất tham khảo, không thể
            thay thế đánh giá y tế chuyên sâu từ bác sĩ.
          </AppText>
        </View>
      </ScrollView>

      {/* ── 1. Settings & System Actions Modal ────────────────────────── */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Cài đặt & Tài khoản</AppText>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalList}>
              {/* Theme Toggle */}
              <View style={styles.settingsRowItem}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {theme.scheme === "dark" ? (
                    <MoonIcon size={18} color={theme.colors.brandPrimary} />
                  ) : (
                    <SunIcon size={18} color="#FACC15" />
                  )}
                  <AppText variant="bodyMd">
                    {theme.scheme === "dark"
                      ? "Chế độ ban đêm (Tối)"
                      : "Chế độ ban ngày (Sáng)"}
                  </AppText>
                </View>
                <AppSwitch
                  value={theme.scheme === "dark"}
                  onValueChange={theme.toggleScheme}
                  accessibilityLabel="Chế độ ban đêm"
                />
              </View>

              {/* Reminders */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  root?.navigate("ReminderSettings");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <ClockIcon size={18} color={theme.colors.brandPrimary} />
                  <AppText variant="bodyMd">
                    Cài đặt nhắc nhở thông minh
                  </AppText>
                </View>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  ›
                </AppText>
              </TouchableOpacity>

              {/* Notifications */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  root?.navigate("NotificationCenter");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <BellIcon size={18} color={theme.colors.brandPrimary} />
                  <AppText variant="bodyMd">Trung tâm thông báo</AppText>
                </View>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  ›
                </AppText>
              </TouchableOpacity>

              {/* Data Mode Info */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  showAlert({
                    variant: "info",
                    title: "Chế độ dữ liệu ứng dụng",
                    message: isDemoMode
                      ? "Ứng dụng đang chạy ở Chế độ Demo (Offline) với dữ liệu giả lập.\nĐể chuyển sang backend thật, chạy: npm run env:dev"
                      : `Ứng dụng đang kết nối với máy chủ Backend thật:\n${API_BASE_URL}\n\nĐể chuyển sang demo, chạy: npm run env:demo`,
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <GlobeIcon size={18} color={theme.colors.brandPrimary} />
                  <AppText variant="bodyMd">Chế độ dữ liệu</AppText>
                </View>
                <AppText
                  variant="caption"
                  color={
                    isDemoMode
                      ? theme.colors.vipStreak
                      : theme.colors.quickScanner
                  }
                  style={{ fontWeight: "600" }}
                >
                  {isDemoMode ? "Bản Demo (Offline)" : "Backend Thật"}
                </AppText>
              </TouchableOpacity>

              {/* Offline & Sync */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  void syncNow();
                  showAlert({
                    variant: isOnline ? "success" : "warning",
                    title: "Đồng bộ dữ liệu",
                    message: isOnline
                      ? "Đang trực tuyến. Đã gửi các bản ghi."
                      : "Đang ở chế độ ngoại tuyến.",
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <RefreshCwIcon size={18} color={theme.colors.brandPrimary} />
                  <AppText variant="bodyMd">
                    Trạng thái đồng bộ ngoại tuyến
                  </AppText>
                </View>
                <AppText
                  variant="caption"
                  color={
                    isOnline
                      ? theme.colors.quickScanner
                      : theme.colors.macroProtein
                  }
                >
                  {isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                </AppText>
              </TouchableOpacity>

              {/* Change Password */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  root?.navigate("ChangePassword");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <LockClosedIcon size={18} color={theme.colors.brandPrimary} />
                  <AppText variant="bodyMd">Đổi mật khẩu</AppText>
                </View>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  ›
                </AppText>
              </TouchableOpacity>

              {/* Sign out */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={() => {
                  setShowSettingsModal(false);
                  showConfirm({
                    title: "Đăng xuất",
                    message:
                      "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Kallo?",
                    confirmText: "Đăng xuất",
                    cancelText: "Ở lại",
                    destructive: true,
                    onConfirm: async () => {
                      await signOut();
                    },
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <LogOutIcon size={18} color={theme.colors.brandPrimary} />
                  <AppText variant="bodyMd" color={theme.colors.brandPrimary}>
                    Đăng xuất tài khoản
                  </AppText>
                </View>
              </TouchableOpacity>

              {/* Delete Account */}
              <TouchableOpacity
                style={styles.settingsRowItem}
                onPress={handleDeleteAccount}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <TriangleAlertIcon
                    size={18}
                    color={theme.colors.macroProtein}
                  />
                  <AppText variant="bodyMd" color={theme.colors.macroProtein}>
                    Xóa vĩnh viễn tài khoản
                  </AppText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 2. Health Metrics Modal (Chỉ số sức khỏe) ─────────────────── */}
      <Modal
        visible={showHealthMetricsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowHealthMetricsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Chỉ số sức khỏe cá nhân</AppText>
              <TouchableOpacity
                onPress={() => setShowHealthMetricsModal(false)}
              >
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.metricsModalList}>
              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Chỉ số khối cơ thể (BMI)
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
                  {bmiVal.toFixed(1)} — {bmiDesc}
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Khuyến nghị người châu Á: 18.5 - 22.9
                </AppText>
              </View>

              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Năng lượng chuyển hoá cơ bản (BMR)
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.macroCarbs}>
                  {bmrVal} kcal/ngày
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Năng lượng cơ thể tiêu thụ khi nghỉ ngơi hoàn toàn
                </AppText>
              </View>

              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Tổng năng lượng tiêu hao (TDEE)
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.macroFats}>
                  {tdeeVal} kcal/ngày
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Bao gồm hoạt động nhẹ và sinh hoạt thường nhật
                </AppText>
              </View>

              <View style={styles.metricModalCard}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Mục tiêu nước mỗi ngày
                </AppText>
                <AppText variant="headlineSm" color={theme.colors.water}>
                  {weightKg * 35} ml
                </AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Tiêu chuẩn 35 ml trên mỗi kg cân nặng
                </AppText>
              </View>
            </View>

            <AppButton
              label="Đóng"
              variant="primary"
              onPress={() => setShowHealthMetricsModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* ── 3. Customize Goals Modal (Tuỳ chỉnh mục tiêu) ─────────────── */}
      <Modal
        visible={showCustomizeGoalsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomizeGoalsModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">
                Tuỳ chỉnh mục tiêu dinh dưỡng
              </AppText>
              <TouchableOpacity
                onPress={() => setShowCustomizeGoalsModal(false)}
              >
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.customizeGoalSection}>
              {/* Calorie stepper */}
              <View style={styles.goalAdjustRow}>
                <AppText variant="labelLg">Mục tiêu Calo hàng ngày:</AppText>
                <View style={styles.stepperWrap}>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() =>
                      setTargetCalories((c) => Math.max(1200, c - 50))
                    }
                  >
                    <AppText variant="headlineSm">-</AppText>
                  </TouchableOpacity>
                  <AppText variant="headlineSm" style={styles.stepperVal}>
                    {targetCalories}
                  </AppText>
                  <TouchableOpacity
                    style={styles.stepperBtn}
                    onPress={() =>
                      setTargetCalories((c) => Math.min(3500, c + 50))
                    }
                  >
                    <AppText variant="headlineSm">+</AppText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Macro ratios */}
              <View style={styles.macroAdjustSection}>
                <AppText variant="labelLg" style={styles.macroAdjustTitle}>
                  Phân bổ 3 nhóm chất (Tổng:{" "}
                  {proteinPercent + carbsPercent + fatPercent}%):
                </AppText>

                {/* Protein */}
                <View style={styles.macroAdjustRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <LightningIcon
                      size={14}
                      color={theme.colors.macroProtein}
                    />
                    <AppText variant="bodyMd" color={theme.colors.macroProtein}>
                      Chất đạm: {proteinPercent}% ({proteinGrams}g)
                    </AppText>
                  </View>
                  <View style={styles.stepperSmallWrap}>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() =>
                        setProteinPercent((p) => Math.max(10, p - 5))
                      }
                    >
                      <AppText>-</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() =>
                        setProteinPercent((p) => Math.min(50, p + 5))
                      }
                    >
                      <AppText>+</AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Carbs */}
                <View style={styles.macroAdjustRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <WheatIcon size={14} color={theme.colors.macroCarbs} />
                    <AppText variant="bodyMd" color={theme.colors.macroCarbs}>
                      Đường bột: {carbsPercent}% ({carbsGrams}g)
                    </AppText>
                  </View>
                  <View style={styles.stepperSmallWrap}>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() =>
                        setCarbsPercent((c) => Math.max(10, c - 5))
                      }
                    >
                      <AppText>-</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() =>
                        setCarbsPercent((c) => Math.min(70, c + 5))
                      }
                    >
                      <AppText>+</AppText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Fat */}
                <View style={styles.macroAdjustRow}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <DropletIcon size={14} color={theme.colors.macroFats} />
                    <AppText variant="bodyMd" color={theme.colors.macroFats}>
                      Chất béo: {fatPercent}% ({fatGrams}g)
                    </AppText>
                  </View>
                  <View style={styles.stepperSmallWrap}>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setFatPercent((f) => Math.max(10, f - 5))}
                    >
                      <AppText>-</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.stepperSmallBtn}
                      onPress={() => setFatPercent((f) => Math.min(50, f + 5))}
                    >
                      <AppText>+</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <AppButton
              label="Lưu mục tiêu"
              variant="primary"
              onPress={handleSaveGoals}
            />
          </View>
        </View>
      </Modal>

      {/* ── 4. Edit Display Name Modal ─────────────────────────────────── */}
      <Modal
        visible={showEditNameModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditNameModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Chỉnh sửa tên hiển thị</AppText>
              <TouchableOpacity onPress={() => setShowEditNameModal(false)}>
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              <AppInput
                label="Tên hiển thị mới"
                placeholder="Nhập tên của bạn"
                value={editDisplayName}
                onChangeText={setEditDisplayName}
              />
            </View>

            <View style={{ marginTop: 14 }}>
              <AppButton
                label="Lưu thay đổi"
                variant="primary"
                disabled={!editDisplayName.trim()}
                onPress={handleSaveDisplayName}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 5. Delete Account Confirmation Modal ───────────────────────── */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <TriangleAlertIcon
                  size={20}
                  color={theme.colors.macroProtein}
                />
                <AppText variant="headlineSm" color={theme.colors.macroProtein}>
                  Xác nhận xóa tài khoản
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <AppText
              variant="bodySm"
              color={theme.colors.textSecondary}
              style={{ marginTop: 4, lineHeight: 20 }}
            >
              Hành động này sẽ xóa vĩnh viễn toàn bộ dữ liệu nhật ký, cân nặng
              và chỉ số sức khỏe của bạn khỏi hệ thống Kallo. Không thể hoàn
              tác.
            </AppText>

            <View style={{ marginTop: 10 }}>
              <AppInput
                label="Mật khẩu của bạn"
                placeholder="Nhập mật khẩu để xác nhận xóa"
                secureTextEntry
                value={deletePassword}
                onChangeText={(text) => {
                  setDeletePassword(text);
                  if (deleteError) setDeleteError(null);
                }}
                error={deleteError || undefined}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <AppButton
                  label="Hủy bỏ"
                  variant="secondary"
                  onPress={() => setShowDeleteModal(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton
                  label="Xóa vĩnh viễn"
                  variant="primary"
                  loading={deleteLoading}
                  onPress={handleConfirmDeleteAccount}
                  style={{ backgroundColor: theme.colors.macroProtein }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* ── 6. Edit Physical Profile Modal (Chỉnh sửa hồ sơ thể chất) ─── */}
      <Modal
        visible={showEditPhysicalModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditPhysicalModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid, maxHeight: "90%" },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">
                Chỉnh sửa thể chất & Mục tiêu
              </AppText>
              <TouchableOpacity onPress={() => setShowEditPhysicalModal(false)}>
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginVertical: 8 }}
            >
              {/* Giới tính */}
              <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                Giới tính sinh học
              </AppText>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
                <TouchableOpacity
                  onPress={() => setEditGender("male")}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor:
                      editGender === "male"
                        ? theme.colors.brandPrimary
                        : theme.colors.surface,
                    borderWidth: 1,
                    borderColor:
                      editGender === "male"
                        ? theme.colors.brandPrimary
                        : theme.colors.surfaceBorder,
                  }}
                >
                  <AppText
                    variant="bodyMd"
                    style={{
                      color:
                        editGender === "male"
                          ? "#FFFFFF"
                          : theme.colors.textPrimary,
                    }}
                  >
                    Nam (MALE)
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditGender("female")}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor:
                      editGender === "female"
                        ? theme.colors.brandPrimary
                        : theme.colors.surface,
                    borderWidth: 1,
                    borderColor:
                      editGender === "female"
                        ? theme.colors.brandPrimary
                        : theme.colors.surfaceBorder,
                  }}
                >
                  <AppText
                    variant="bodyMd"
                    style={{
                      color:
                        editGender === "female"
                          ? "#FFFFFF"
                          : theme.colors.textPrimary,
                    }}
                  >
                    Nữ (FEMALE)
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Chiều cao & Cân nặng */}
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
                <View style={{ flex: 1 }}>
                  <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                    Chiều cao (cm)
                  </AppText>
                  <AppInput
                    value={editHeight}
                    onChangeText={setEditHeight}
                    keyboardType="numeric"
                    placeholder="160"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                    Cân nặng (kg)
                  </AppText>
                  <AppInput
                    value={editWeight}
                    onChangeText={setEditWeight}
                    keyboardType="numeric"
                    placeholder="60"
                  />
                </View>
              </View>

              {/* Mức độ vận động */}
              <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                Mức độ vận động
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 14,
                }}
              >
                {[
                  ["sedentary", "Ít vận động"],
                  ["light", "Nhẹ (1-3 ngày/tuần)"],
                  ["moderate", "Vừa (3-5 ngày/tuần)"],
                  ["high", "Nhiều (6-7 ngày/tuần)"],
                  ["veryHigh", "Rất nhiều (VĐV)"],
                ].map(([lvl, label]) => {
                  const isSel = editActivity === lvl;
                  return (
                    <TouchableOpacity
                      key={lvl}
                      onPress={() => setEditActivity(lvl as ActivityLevel)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: isSel
                          ? theme.colors.brandPrimary
                          : theme.colors.surface,
                        borderWidth: 1,
                        borderColor: isSel
                          ? theme.colors.brandPrimary
                          : theme.colors.surfaceBorder,
                      }}
                    >
                      <AppText
                        variant="caption"
                        style={{
                          color: isSel ? "#FFFFFF" : theme.colors.textPrimary,
                          fontWeight: isSel ? "700" : "400",
                        }}
                      >
                        {label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Mục tiêu */}
              <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                Mục tiêu vóc dáng
              </AppText>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                {[
                  ["lose", "Giảm cân"],
                  ["maintain", "Giữ cân"],
                  ["gain", "Tăng cân"],
                ].map(([g, label]) => {
                  const isSel = editGoal === g;
                  const isDis = age < 18 && g !== "maintain";
                  return (
                    <TouchableOpacity
                      key={g}
                      disabled={isDis}
                      onPress={() => setEditGoal(g as any)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 10,
                        alignItems: "center",
                        backgroundColor: isSel
                          ? theme.colors.brandPrimary
                          : theme.colors.surface,
                        borderWidth: 1,
                        borderColor: isSel
                          ? theme.colors.brandPrimary
                          : theme.colors.surfaceBorder,
                        opacity: isDis ? 0.4 : 1,
                      }}
                    >
                      <AppText
                        variant="bodySm"
                        style={{
                          color: isSel ? "#FFFFFF" : theme.colors.textPrimary,
                          fontWeight: isSel ? "700" : "400",
                        }}
                      >
                        {label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Cân nặng mục tiêu & Tốc độ nếu không phải maintain */}
              {editGoal !== "maintain" && (
                <View
                  style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}
                >
                  <View style={{ flex: 1 }}>
                    <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                      Mục tiêu (kg)
                    </AppText>
                    <AppInput
                      value={editTargetWeight}
                      onChangeText={setEditTargetWeight}
                      keyboardType="numeric"
                      placeholder="55"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="labelLg" style={{ marginBottom: 6 }}>
                      Tốc độ (kg/tuần)
                    </AppText>
                    <AppInput
                      value={editWeeklyRate}
                      onChangeText={setEditWeeklyRate}
                      keyboardType="numeric"
                      placeholder="0.5"
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            <AppButton
              label="Lưu hồ sơ thể chất"
              variant="primary"
              loading={savingPhysical}
              onPress={handleSavePhysicalProfile}
            />
          </View>
        </View>
      </Modal>

      {/* ── 7. Chronic Conditions Modal (Quản lý bệnh mạn tính) ───────── */}
      <Modal
        visible={showChronicModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChronicModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid, maxHeight: "85%" },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Quản lý bệnh mạn tính</AppText>
              <TouchableOpacity onPress={() => setShowChronicModal(false)}>
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <AppText
              variant="caption"
              color={theme.colors.textSecondary}
              style={{ marginBottom: 12 }}
            >
              Chọn các bệnh lý bạn đang theo dõi để Kallo tự động tối ưu hóa chế
              độ dinh dưỡng và cảnh báo món ăn phù hợp.
            </AppText>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginVertical: 8 }}
            >
              {(systemConditions.length > 0
                ? systemConditions
                : [
                    {
                      id: "e6f98765-4321-4321-4321-fedcba987654",
                      code: "DIABETES_T2",
                      name: "Tiểu đường tuýp 2",
                      description: "Đái tháo đường không phụ thuộc insulin",
                    },
                    {
                      id: "d5e87654-3210-3210-3210-edcba9876543",
                      code: "HYPERTENSION",
                      name: "Tăng huyết áp",
                      description:
                        "Huyết áp tâm thu >= 140 hoặc tâm trương >= 90 mmHg",
                    },
                    {
                      id: "c4d76543-2109-2109-2109-dcba98765432",
                      code: "GERD",
                      name: "Trào ngược dạ dày thực quản (GERD)",
                      description: "Ợ chua, đau rát thượng vị",
                    },
                    {
                      id: "b3c65432-1098-1098-1098-cba987654321",
                      code: "HYPERLIPIDEMIA",
                      name: "Rối loạn lipid máu (Mỡ máu cao)",
                      description: "Cholesterol hoặc Triglyceride tăng cao",
                    },
                    {
                      id: "a2b54321-0987-0987-0987-ba9876543210",
                      code: "GOUT",
                      name: "Bệnh Gút (Gout)",
                      description: "Axit uric máu tăng cao, lắng đọng khớp",
                    },
                  ]
              ).map((c: any) => {
                const isSelected = selectedConditionIds.includes(c.id);
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => {
                      setSelectedConditionIds((prev) =>
                        prev.includes(c.id)
                          ? prev.filter((id) => id !== c.id)
                          : [...prev, c.id],
                      );
                    }}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 8,
                      backgroundColor: isSelected
                        ? isDark
                          ? "#2D1B4E"
                          : "#F3E8FF"
                        : theme.colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? theme.colors.brandPrimary
                        : theme.colors.surfaceBorder,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <AppText
                        variant="bodyMd"
                        style={{
                          fontWeight: "600",
                          color: isSelected
                            ? theme.colors.brandPrimary
                            : theme.colors.textPrimary,
                        }}
                      >
                        {c.name}
                      </AppText>
                      {c.description ? (
                        <AppText
                          variant="caption"
                          color={theme.colors.textSecondary}
                          style={{ marginTop: 2 }}
                        >
                          {c.description}
                        </AppText>
                      ) : null}
                    </View>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 1.5,
                        borderColor: isSelected
                          ? theme.colors.brandPrimary
                          : theme.colors.surfaceBorder,
                        backgroundColor: isSelected
                          ? theme.colors.brandPrimary
                          : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <CheckIcon
                          size={14}
                          color="#FFFFFF"
                          strokeWidth={2.5}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <AppButton
              label="Lưu bệnh mạn tính"
              variant="primary"
              loading={savingConditions}
              onPress={handleSaveChronicConditions}
            />
          </View>
        </View>
      </Modal>

      {/* ── 8. Allergies Modal (Quản lý dị ứng thực phẩm) ─────────────── */}
      <Modal
        visible={showAllergiesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllergiesModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surfaceMid, maxHeight: "85%" },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <AppText variant="headlineSm">Quản lý dị ứng thực phẩm</AppText>
              <TouchableOpacity onPress={() => setShowAllergiesModal(false)}>
                <CloseXIcon size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <AppText
              variant="caption"
              color={theme.colors.textSecondary}
              style={{ marginBottom: 12 }}
            >
              Các nguyên liệu được chọn sẽ được Kallo tự động gắn cờ cảnh báo an
              toàn y sinh khi quét món ăn hoặc gợi ý thực đơn.
            </AppText>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ marginVertical: 8 }}
            >
              {STANDARD_ALLERGENS.map((a) => {
                const isSelected = selectedAllergyIds.includes(a.id);
                return (
                  <TouchableOpacity
                    key={a.id}
                    onPress={() => {
                      setSelectedAllergyIds((prev) =>
                        prev.includes(a.id)
                          ? prev.filter((id) => id !== a.id)
                          : [...prev, a.id],
                      );
                    }}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 8,
                      backgroundColor: isSelected
                        ? isDark
                          ? "#2D1B4E"
                          : "#F3E8FF"
                        : theme.colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? theme.colors.brandPrimary
                        : theme.colors.surfaceBorder,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <AppText
                        variant="bodyMd"
                        style={{
                          fontWeight: "600",
                          color: isSelected
                            ? theme.colors.brandPrimary
                            : theme.colors.textPrimary,
                        }}
                      >
                        {a.nameVi}
                      </AppText>
                      <AppText
                        variant="caption"
                        color={theme.colors.textSecondary}
                        style={{ marginTop: 2 }}
                      >
                        {a.name}
                      </AppText>
                    </View>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 1.5,
                        borderColor: isSelected
                          ? theme.colors.brandPrimary
                          : theme.colors.surfaceBorder,
                        backgroundColor: isSelected
                          ? theme.colors.brandPrimary
                          : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <CheckIcon
                          size={14}
                          color="#FFFFFF"
                          strokeWidth={2.5}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <AppButton
              label="Lưu danh sách dị ứng"
              variant="primary"
              loading={savingAllergies}
              onPress={handleSaveAllergies}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 20,
  },

  // ── Top Header ──────────────────────────────────────────────────────
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── User Avatar Section ─────────────────────────────────────────────
  avatarSection: {
    alignItems: "center",
    marginTop: 4,
  },
  avatarWrapper: {
    position: "relative",
    width: 90,
    height: 90,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#0284C7",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarLetter: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: "700",
  },
  addPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },

  // ── VIP / Trial Banner ──────────────────────────────────────────────
  vipBannerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FDE68A",
    borderRadius: 18,
    padding: 16,
    overflow: "hidden",
  },
  vipBannerContent: {
    flex: 1,
    gap: 8,
  },
  vipBannerTitle: {
    color: "#13121B",
    fontSize: 15,
    fontWeight: "700",
  },
  vipBannerButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  vipBannerButtonText: {
    color: "#0D0B14",
    fontSize: 13,
    fontWeight: "700",
  },
  vipBannerGraphic: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  vipBannerTrophy: {
    width: 76,
    height: 76,
  },

  // ── Metrics Capsule (Thước đo thể trạng) ─────────────────────────────
  metricsCapsuleWrapper: {
    gap: 12,
  },
  metricsCapsule: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
  },
  metricItemCol: {
    flex: 1,
    alignItems: "center",
  },
  capsuleDivider: {
    width: 1,
    height: 18,
  },
  metricsPillsRow: {
    flexDirection: "row",
    gap: 12,
  },
  subActionPill: {
    flex: 1,
    height: 40,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Hành trình của bạn ──────────────────────────────────────────────
  sectionContainer: {
    gap: 12,
  },
  sectionHeaderClickable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  chatEntryCard: {
    minHeight: 78,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chatEntryIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  chatEntryImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  chatEntryCopy: {
    flex: 1,
    gap: 3,
  },
  journeyCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  targetIconWrapper: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  targetIcon: {
    width: 48,
    height: 48,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  journeySubtitle: {
    fontSize: 13,
  },
  weightTrackContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    position: "relative",
    height: 40,
    justifyContent: "center",
  },
  weightTrackBg: {
    width: "80%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  weightTrackFill: {
    width: "50%",
    height: "100%",
  },
  weightIndicatorDot: {
    position: "absolute",
    top: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  weightIndicatorInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  weightIndicatorLabel: {
    position: "absolute",
    bottom: -4,
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Mục tiêu dinh dưỡng & đa lượng ──────────────────────────────────
  macroCard: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
  },
  macroRowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  calorieRingContainer: {
    position: "relative",
    width: 130,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenterContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  calorieNumberText: {
    fontSize: 20,
    fontWeight: "800",
  },
  macroListCol: {
    flex: 1,
    gap: 12,
  },
  macroItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customizeGoalBtn: {
    minHeight: 44,
  },

  // ── Xem báo cáo thống kê ────────────────────────────────────────────
  statsIconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statIconCol: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  statIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
  },
  statEmoji: {
    fontSize: 26,
  },

  // ── Cộng đồng và hỗ trợ ─────────────────────────────────────────────
  communityBannerWrap: {
    width: "100%",
    aspectRatio: 2862 / 1472,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1E1435",
  },
  communityBannerImage: {
    width: "100%",
    height: "100%",
  },
  socialCard: {
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  socialSearchHeader: {
    paddingBottom: 2,
  },
  socialTilesRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialTile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 14,
  },
  socialLogoImg: {
    width: 22,
    height: 22,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(128,128,128,0.12)",
  },
  supportCenterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },

  // ── Footer Branding ─────────────────────────────────────────────────
  footerBranding: {
    alignItems: "center",
    paddingTop: 12,
    gap: 4,
  },
  footerLogoText: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  copyrightText: {
    marginTop: 4,
  },
  disclaimerText: {
    lineHeight: 18,
    marginTop: 6,
    paddingHorizontal: 12,
  },

  // ── Modals Common ───────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    gap: 16,
    maxHeight: "80%",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalList: {
    gap: 8,
  },
  settingsRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128,128,128,0.1)",
  },
  metricsModalList: {
    gap: 10,
  },
  metricModalCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(128,128,128,0.06)",
    gap: 4,
  },
  customizeGoalSection: {
    gap: 16,
  },
  goalAdjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepperWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(128,128,128,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperVal: {
    minWidth: 50,
    textAlign: "center",
  },
  macroAdjustSection: {
    gap: 12,
  },
  macroAdjustTitle: {
    marginBottom: 4,
  },
  macroAdjustRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepperSmallWrap: {
    flexDirection: "row",
    gap: 8,
  },
  stepperSmallBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(128,128,128,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
