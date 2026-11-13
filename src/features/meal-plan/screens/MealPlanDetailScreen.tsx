import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import type { MealPlanItem } from '../types';
import { useMealPlan } from '../MealPlanProvider';
import { findSwapCandidates, formatVnd } from '../utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MealPlanDetailScreen() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const navigation = useNavigation<NavigationProp>();
  const { currentPlan, swapItem, savePlan, applyPlanToDiary } = useMealPlan();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [swappingItem, setSwappingItem] = useState<MealPlanItem | null>(null);

  if (!currentPlan) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
        <StatusBar
          barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.canvasBase}
        />
        <View style={styles.emptyContainer}>
          <AppText variant="headlineMd">Chưa có thực đơn nào</AppText>
          <AppButton
            label="Tạo thực đơn mới"
            onPress={() => navigation.navigate('MealPlanWizard')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const activeDay = currentPlan.days[selectedDayIndex] || currentPlan.days[0];
  const targetCal = currentPlan.goal.targetCalories;
  const caloDiff = Math.abs(activeDay.totalCalories - targetCal);
  const isWithinTolerance = caloDiff <= targetCal * 0.05;

  const handleApplyToDiary = () => {
    const count = applyPlanToDiary(selectedDayIndex);
    Alert.alert(
      'Áp dụng thành công! 🎉',
      `Đã thêm ${count} món ăn của ${activeDay.dayLabel} vào Nhật ký dinh dưỡng hôm nay.`,
      [
        {
          text: 'Về Nhật ký xem',
          onPress: () => {
            (navigation.getParent() as any)?.navigate('Diary');
          },
        },
        { text: 'Ở lại đây', style: 'cancel' },
      ]
    );
  };

  const handleSave = () => {
    savePlan(currentPlan);
    Alert.alert('Đã lưu', 'Thực đơn đã được lưu vào danh sách của bạn.');
  };

  const swapCandidates = swappingItem
    ? findSwapCandidates(swappingItem, currentPlan.goal.excludedAllergens)
    : [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.canvasBase}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Day Selector (if 7 days) ────────────────────────────────── */}
        {currentPlan.days.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelectorStrip}
          >
            {currentPlan.days.map((day, idx) => (
              <TouchableOpacity
                key={day.dayIndex}
                style={[
                  styles.dayTab,
                  selectedDayIndex === idx
                    ? {
                        backgroundColor: theme.colors.brandPrimary,
                        borderColor: theme.colors.brandPrimary,
                      }
                    : {
                        backgroundColor: theme.colors.surfaceHigh,
                        borderColor: theme.colors.surfaceBorder,
                      },
                ]}
                onPress={() => setSelectedDayIndex(idx)}
              >
                <AppText
                  variant="bodySm"
                  color={selectedDayIndex === idx ? theme.colors.onBrand : theme.colors.textPrimary}
                >
                  {day.dayLabel}
                </AppText>
                <AppText
                  variant="caption"
                  color={selectedDayIndex === idx ? theme.colors.onBrand : theme.colors.textSecondary}
                  style={selectedDayIndex === idx ? { opacity: 0.85 } : undefined}
                >
                  {day.totalCalories} kcal
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Daily Summary Card ─────────────────────────────────────── */}
        <AppCard style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View>
              <AppText variant="headlineSm" color={theme.colors.textPrimary}>{activeDay.dayLabel}</AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>
                Mục tiêu: {targetCal} kcal • Ngân sách: {formatVnd(currentPlan.goal.dailyBudgetVnd)}
              </AppText>
            </View>
            <View
              style={[
                styles.toleranceBadge,
                {
                  backgroundColor: isWithinTolerance
                    ? theme.colors.brandSoftTint
                    : 'rgba(239, 68, 68, 0.15)',
                },
              ]}
            >
              <AppText
                variant="caption"
                color={isWithinTolerance ? theme.colors.brandPrimary : theme.colors.statusDanger}
              >
                {isWithinTolerance ? '✓ Chuẩn ±5%' : 'Chênh lệch'}
              </AppText>
            </View>
          </View>

          <View style={styles.calorieRow}>
            <View style={styles.calorieItem}>
              <AppText variant="caption" color={theme.colors.textSecondary}>Tổng Calo</AppText>
              <AppText variant="headlineLg" color={theme.colors.brandPrimary}>
                {activeDay.totalCalories}
              </AppText>
              <AppText variant="caption" color={theme.colors.textSecondary}>kcal</AppText>
            </View>

            <View style={styles.calorieItem}>
              <AppText variant="caption" color={theme.colors.textSecondary}>Chi phí</AppText>
              <AppText variant="headlineMd">
                {formatVnd(activeDay.totalCostVnd)}
              </AppText>
              <AppText variant="caption" color={theme.colors.brandPrimary}>
                {activeDay.totalCostVnd <= currentPlan.goal.dailyBudgetVnd
                  ? 'Trong ngân sách'
                  : 'Vượt nhẹ'}
              </AppText>
            </View>
          </View>

          <View style={styles.macroPills}>
            <View style={[styles.macroPill, { backgroundColor: theme.scheme === 'dark' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(239, 68, 68, 0.12)' }]}>
              <AppText variant="caption" color={theme.colors.macroProtein}>
                Đạm: {activeDay.totalProtein}g
              </AppText>
            </View>
            <View style={[styles.macroPill, { backgroundColor: theme.scheme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.12)' }]}>
              <AppText variant="caption" color={theme.colors.macroCarbs}>
                Carb: {activeDay.totalCarbs}g
              </AppText>
            </View>
            <View style={[styles.macroPill, { backgroundColor: theme.scheme === 'dark' ? 'rgba(251, 191, 36, 0.18)' : 'rgba(217, 119, 6, 0.15)' }]}>
              <AppText variant="caption" color={theme.colors.macroFats}>
                Béo: {activeDay.totalFat}g
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* ── 4 Meal Slots ───────────────────────────────────────────── */}
        {activeDay.items.map((item) => {
          const mealLabels: Record<string, string> = {
            breakfast: 'Bữa sáng (25%)',
            lunch: 'Bữa trưa (35%)',
            dinner: 'Bữa tối (30%)',
            snack: 'Bữa phụ (10%)',
          };
          return (
            <AppCard key={item.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <AppText variant="caption" color={theme.colors.brandPrimary}>
                  {mealLabels[item.meal] || item.meal}
                </AppText>
                <TouchableOpacity
                  style={[
                    styles.swapBtn,
                    {
                      borderColor: theme.colors.brandPrimary,
                      backgroundColor: theme.colors.brandSoftTint,
                    },
                  ]}
                  onPress={() => setSwappingItem(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Đổi món cho ${item.name}`}
                >
                  <AppText variant="caption" color={theme.colors.brandPrimary}>
                    ⇄ Đổi món
                  </AppText>
                </TouchableOpacity>
              </View>

              <View style={styles.foodInfo}>
                <AppText variant="headlineSm">{item.name}</AppText>
                <AppText variant="bodySm" color={theme.colors.textSecondary}>
                  {item.grams}g • {item.calories} kcal • {formatVnd(item.estimatedPriceVnd)}
                </AppText>
              </View>

              <View style={styles.foodMacros}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                </AppText>
                {item.allergens.length > 0 && (
                  <View style={styles.allergenTag}>
                    <AppText variant="caption" color={theme.colors.calorieIn}>
                      {item.allergens.join(', ')}
                    </AppText>
                  </View>
                )}
              </View>
            </AppCard>
          );
        })}

        {/* ── Action Buttons ─────────────────────────────────────────── */}
        <View style={styles.actionSection}>
          <AppButton
            label="Áp dụng vào Nhật ký ngày (Ghi hàng loạt)"
            variant="primary"
            onPress={handleApplyToDiary}
            accessibilityLabel="Áp dụng 4 món vào nhật ký dinh dưỡng"
          />
          <AppButton
            label="Lưu thực đơn này"
            variant="secondary"
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      {/* ── Swap Modal Sheet ─────────────────────────────────────────── */}
      <Modal
        visible={Boolean(swappingItem)}
        animationType="slide"
        transparent
        onRequestClose={() => setSwappingItem(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surfaceMid }]}>
            <View style={styles.modalHeader}>
              <View>
                <AppText variant="headlineSm">Đổi món tương đương</AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Món hiện tại: {swappingItem?.name} ({swappingItem?.calories} kcal)
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setSwappingItem(null)}>
                <AppText variant="headlineSm">✕</AppText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.candidateList}>
              {swapCandidates.map((candidate) => (
                <TouchableOpacity
                  key={candidate.id}
                  style={[styles.candidateItem, { borderColor: theme.colors.surfaceBorder }]}
                  onPress={() => {
                    if (swappingItem) {
                      swapItem(selectedDayIndex, swappingItem.id, candidate.id);
                      setSwappingItem(null);
                    }
                  }}
                >
                  <View style={styles.flex}>
                    <AppText variant="bodyMd">{candidate.name}</AppText>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      ~{Math.round(candidate.calories * (candidate.defaultGrams / 100))} kcal •{' '}
                      {formatVnd(candidate.priceVnd)}
                    </AppText>
                  </View>
                  <AppText variant="bodySm" color={theme.colors.brandPrimary}>
                    Chọn
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;

  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.canvasBase },
    content: { padding: 16, gap: 14, paddingBottom: 40 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
    daySelectorStrip: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
    dayTab: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      gap: 2,
    },
    summaryCard: { gap: 12 },
    summaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    toleranceBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    calorieRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: c.surfaceBorder,
    },
    calorieItem: { alignItems: 'center' },
    macroPills: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    macroPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    mealCard: { gap: 8 },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    swapBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
    },
    foodInfo: { gap: 4 },
    foodMacros: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    allergenTag: {
      backgroundColor: theme.scheme === 'dark' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(239, 68, 68, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    actionSection: { gap: 10, marginTop: 8 },
    flex: { flex: 1 },
    modalBackdrop: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'flex-end',
    },
    modalSheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: '65%',
      gap: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    candidateList: { maxHeight: 350 },
    candidateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
  });
}
