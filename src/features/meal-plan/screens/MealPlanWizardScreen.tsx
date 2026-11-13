import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { useMealPlan } from '../MealPlanProvider';
import { formatVnd } from '../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const COMMON_ALLERGENS = [
  'Hải sản',
  'Tôm',
  'Trứng',
  'Sữa',
  'Gluten',
  'Đậu nành',
  'Đậu phộng / Hạt',
];

const BUDGET_OPTIONS = [50000, 80000, 100000, 150000, 200000];

export function MealPlanWizardScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<NavigationProp>();
  const { state: nutritionState } = useNutrition();
  const { generatePlan, isGenerating } = useMealPlan();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Wizard state
  const [durationDays, setDurationDays] = useState<1 | 7>(1);
  const [targetCalories, setTargetCalories] = useState<number>(
    nutritionState.goals.calories || 2000
  );
  const [dailyBudgetVnd, setDailyBudgetVnd] = useState<number>(100000);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

  const toggleAllergen = (allergen: string) => {
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleCreatePlan = async () => {
    const proteinTarget = Math.round((targetCalories * 0.25) / 4);
    const carbsTarget = Math.round((targetCalories * 0.5) / 4);
    const fatTarget = Math.round((targetCalories * 0.25) / 9);

    await generatePlan({
      durationDays,
      targetCalories,
      proteinTarget,
      carbsTarget,
      fatTarget,
      dailyBudgetVnd,
      excludedAllergens,
    });

    navigation.replace('MealPlanDetail');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.canvasBase}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Step Progress Indicator ─────────────────────────────────── */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor:
                      s <= step ? theme.colors.brandPrimary : theme.colors.surfaceHigh,
                    borderColor:
                      s <= step ? theme.colors.brandPrimary : theme.colors.surfaceBorder,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={s <= step ? theme.colors.onBrand : theme.colors.textSecondary}
                >
                  {s}
                </AppText>
              </View>
              <AppText
                variant="caption"
                color={s === step ? theme.colors.brandPrimary : theme.colors.textSecondary}
              >
                {s === 1 ? 'Mục tiêu' : s === 2 ? 'Ngân sách' : 'Dị ứng & AI'}
              </AppText>
            </View>
          ))}
        </View>

        {/* ── Step 1: Duration & Calories Target ──────────────────────── */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Image
              source={images.mealPlanStep1}
              style={styles.stepImage}
              resizeMode="contain"
              accessibilityLabel="Bước 1: Chọn thời gian và mục tiêu calo"
            />
            <AppText variant="headlineMd" align="center">
              Bước 1: Thời gian & Mục tiêu Calo
            </AppText>
            <AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">
              Chọn chu kỳ thực đơn và kiểm tra mức Calo khuyến nghị cho bạn
            </AppText>

            <AppCard style={styles.card}>
              <AppText variant="headlineSm">Thời gian áp dụng</AppText>
              <View style={styles.durationRow}>
                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    durationDays === 1
                      ? {
                          borderColor: theme.colors.brandPrimary,
                          backgroundColor: theme.colors.brandSoftTint,
                        }
                      : {
                          borderColor: theme.colors.surfaceBorder,
                          backgroundColor: theme.colors.surfaceMid,
                        },
                  ]}
                  onPress={() => setDurationDays(1)}
                >
                  <AppText
                    variant="headlineSm"
                    align="center"
                    color={durationDays === 1 ? theme.colors.brandPrimary : theme.colors.textPrimary}
                  >
                    1 Ngày
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary} align="center">
                    Thử nghiệm linh hoạt
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.durationOption,
                    durationDays === 7
                      ? {
                          borderColor: theme.colors.brandPrimary,
                          backgroundColor: theme.colors.brandSoftTint,
                        }
                      : {
                          borderColor: theme.colors.surfaceBorder,
                          backgroundColor: theme.colors.surfaceMid,
                        },
                  ]}
                  onPress={() => setDurationDays(7)}
                >
                  <AppText
                    variant="headlineSm"
                    align="center"
                    color={durationDays === 7 ? theme.colors.brandPrimary : theme.colors.textPrimary}
                  >
                    7 Ngày
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary} align="center">
                    Kế hoạch trọn tuần
                  </AppText>
                </TouchableOpacity>
              </View>
            </AppCard>

            <AppCard style={styles.card}>
              <AppText variant="headlineSm">Calo mục tiêu mỗi ngày</AppText>
              <View style={styles.calorieAdjuster}>
                <TouchableOpacity
                  style={[
                    styles.adjustBtn,
                    {
                      backgroundColor: theme.colors.surfaceHigh,
                      borderColor: theme.colors.surfaceBorder,
                    },
                  ]}
                  onPress={() => setTargetCalories((c) => Math.max(1200, c - 100))}
                >
                  <AppText variant="headlineMd">-</AppText>
                </TouchableOpacity>
                <View style={styles.calorieDisplay}>
                  <AppText variant="headlineLg" color={theme.colors.brandPrimary}>
                    {targetCalories}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    kcal / ngày
                  </AppText>
                </View>
                <TouchableOpacity
                  style={[
                    styles.adjustBtn,
                    {
                      backgroundColor: theme.colors.surfaceHigh,
                      borderColor: theme.colors.surfaceBorder,
                    },
                  ]}
                  onPress={() => setTargetCalories((c) => Math.min(4000, c + 100))}
                >
                  <AppText variant="headlineMd">+</AppText>
                </TouchableOpacity>
              </View>
            </AppCard>

            <AppButton
              label="Tiếp tục: Chọn ngân sách"
              variant="primary"
              onPress={() => setStep(2)}
            />
          </View>
        )}

        {/* ── Step 2: Budget ─────────────────────────────────────────── */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Image
              source={images.mealPlanStep2}
              style={styles.stepImage}
              resizeMode="contain"
              accessibilityLabel="Bước 2: Ngân sách ăn uống"
            />
            <AppText variant="headlineMd" align="center">
              Bước 2: Ngân sách mỗi ngày
            </AppText>
            <AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">
              AI sẽ tối ưu hóa các nguyên liệu món Việt trong mức chi phí này
            </AppText>

            <AppCard style={styles.card}>
              <AppText variant="headlineSm">Mức ngân sách lựa chọn</AppText>
              <AppText variant="headlineLg" color={theme.colors.brandPrimary} align="center">
                {formatVnd(dailyBudgetVnd)} / ngày
              </AppText>

              <View style={styles.chipsWrap}>
                {BUDGET_OPTIONS.map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.chip,
                      dailyBudgetVnd === val
                        ? {
                            backgroundColor: theme.colors.brandPrimary,
                            borderColor: theme.colors.brandPrimary,
                          }
                        : {
                            backgroundColor: theme.colors.surfaceHigh,
                            borderColor: theme.colors.surfaceBorder,
                          },
                    ]}
                    onPress={() => setDailyBudgetVnd(val)}
                  >
                    <AppText
                      variant="bodySm"
                      color={dailyBudgetVnd === val ? theme.colors.onBrand : theme.colors.textPrimary}
                    >
                      {formatVnd(val)}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </AppCard>

            <View style={styles.btnRow}>
              <AppButton
                label="Quay lại"
                variant="secondary"
                onPress={() => setStep(1)}
                style={styles.btnFlex}
              />
              <AppButton
                label="Tiếp tục: Dị ứng"
                variant="primary"
                onPress={() => setStep(3)}
                style={styles.btnFlex}
              />
            </View>
          </View>
        )}

        {/* ── Step 3: Allergies & Generate ───────────────────────────── */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Image
              source={images.mealPlanStep3}
              style={styles.stepImage}
              resizeMode="contain"
              accessibilityLabel="Bước 3: Dị ứng và tạo thực đơn"
            />
            <AppText variant="headlineMd" align="center">
              Bước 3: Dị ứng & Kiêng kỵ
            </AppText>
            <AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">
              Lọc cứng tuyệt đối các thành phần bạn không ăn được (FR-PLAN-05)
            </AppText>

            <AppCard style={styles.card}>
              <AppText variant="headlineSm">Chọn thành phần kiêng kỵ</AppText>
              <View style={styles.chipsWrap}>
                {COMMON_ALLERGENS.map((allergen) => {
                  const isSelected = excludedAllergens.includes(allergen);
                  return (
                    <TouchableOpacity
                      key={allergen}
                      style={[
                        styles.chip,
                        isSelected
                          ? {
                              backgroundColor: theme.colors.calorieIn,
                              borderColor: theme.colors.calorieIn,
                            }
                          : {
                              backgroundColor: theme.colors.surfaceHigh,
                              borderColor: theme.colors.surfaceBorder,
                            },
                      ]}
                      onPress={() => toggleAllergen(allergen)}
                    >
                      <AppText
                        variant="bodySm"
                        color={isSelected ? theme.colors.onBrand : theme.colors.textPrimary}
                      >
                        {isSelected ? `✕ ${allergen}` : `+ ${allergen}`}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </AppCard>

            <AppCard style={styles.card}>
              <AppText variant="headlineSm">Tóm tắt yêu cầu AI</AppText>
              <View style={styles.summaryList}>
                <AppText variant="bodySm">
                  • Chu kỳ: <AppText variant="headlineSm">{durationDays} ngày</AppText>
                </AppText>
                <AppText variant="bodySm">
                  • Mục tiêu: <AppText variant="headlineSm">{targetCalories} kcal / ngày</AppText>
                </AppText>
                <AppText variant="bodySm">
                  • Ngân sách: <AppText variant="headlineSm">{formatVnd(dailyBudgetVnd)} / ngày</AppText>
                </AppText>
                <AppText variant="bodySm">
                  • Dị ứng loại trừ:{' '}
                  <AppText variant="headlineSm">
                    {excludedAllergens.length > 0 ? excludedAllergens.join(', ') : 'Không có'}
                  </AppText>
                </AppText>
              </View>
            </AppCard>

            <View style={styles.btnRow}>
              <AppButton
                label="Quay lại"
                variant="secondary"
                onPress={() => setStep(2)}
                disabled={isGenerating}
                style={styles.btnFlex}
              />
              <AppButton
                label={isGenerating ? 'AI đang thiết kế...' : 'Tạo thực đơn AI'}
                variant="primary"
                onPress={handleCreatePlan}
                disabled={isGenerating}
                style={styles.btnFlex}
              />
            </View>

            {isGenerating && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={theme.colors.brandPrimary} />
                <AppText variant="bodySm" color={theme.colors.brandPrimary}>
                  Đang cân bằng Calo & Macro theo chuẩn món Việt...
                </AppText>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.canvasBase },
    content: { padding: 16, gap: 16, paddingBottom: 40 },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 8,
    },
    stepItem: {
      alignItems: 'center',
      gap: 4,
    },
    stepDot: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepContainer: {
      gap: 16,
    },
    stepImage: {
      width: '100%',
      height: 140,
      alignSelf: 'center',
    },
    card: {
      gap: 12,
    },
    durationRow: {
      flexDirection: 'row',
      gap: 12,
    },
    durationOption: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceMid,
      alignItems: 'center',
      gap: 4,
    },
    calorieAdjuster: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    adjustBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calorieDisplay: {
      alignItems: 'center',
    },
    chipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceHigh,
    },
    summaryList: {
      gap: 6,
    },
    btnRow: {
      flexDirection: 'row',
      gap: 12,
    },
    btnFlex: {
      flex: 1,
    },
    loadingBox: {
      alignItems: 'center',
      gap: 8,
      marginTop: 8,
    },
  });
}
