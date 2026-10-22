import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useMealPlan } from '../MealPlanProvider';
import { formatVnd } from '../utils';
import {
  CURATED_MEAL_PLANS,
  DIET_CATEGORIES,
  buildMealPlanFromCurated,
  type CuratedPlan,
} from '../curatedPlans';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabKey = 'my_plans' | 'explore';

export function MealPlanOverviewScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const isDark = theme.scheme === 'dark';
  const { currentPlan, savedPlans, clearCurrentPlan, setActivePlan, applyPlanToDiary, deletePlan } = useMealPlan();

  const [activeTab, setActiveTab] = useState<TabKey>('my_plans');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCuratedPlans = selectedCategory === 'all'
    ? CURATED_MEAL_PLANS
    : CURATED_MEAL_PLANS.filter((p) => p.category === selectedCategory);

  const handleAdoptCuratedPlan = (curated: CuratedPlan) => {
    const newPlan = buildMealPlanFromCurated(curated);
    if (setActivePlan) {
      setActivePlan(newPlan);
    }
    Alert.alert(
      'Áp dụng thực đơn thành công! 🎉',
      `Đã chọn "${curated.title}" làm thực đơn hiện tại của bạn. Bạn có thể theo dõi và áp dụng các bữa ăn vào Nhật ký dinh dưỡng.`,
      [
        {
          text: 'Xem thực đơn của tôi',
          onPress: () => setActiveTab('my_plans'),
        },
      ]
    );
  };

  const handleApplyTodayToDiary = () => {
    if (!currentPlan) return;
    const count = applyPlanToDiary(0);
    Alert.alert(
      'Áp dụng thành công! 🎉',
      `Đã thêm ${count} món ăn của hôm nay vào Nhật ký dinh dưỡng.`,
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

  const handleResetCurrentPlan = () => {
    Alert.alert(
      'Hủy theo dõi thực đơn?',
      'Bạn có muốn dừng theo dõi thực đơn hiện tại? Dữ liệu các món đã ghi vào nhật ký sẽ không bị ảnh hưởng.',
      [
        { text: 'Giữ lại', style: 'cancel' },
        {
          text: 'Dừng theo dõi',
          style: 'destructive',
          onPress: () => {
            if (clearCurrentPlan) {
              clearCurrentPlan();
            } else if (currentPlan) {
              deletePlan(currentPlan.id);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <View style={styles.topHeader}>
        <View style={styles.titleRow}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backButton,
                { backgroundColor: theme.colors.surfaceHigh },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
            >
              <AppText variant="headlineSm" color={theme.colors.textPrimary}>
                ‹
              </AppText>
            </TouchableOpacity>
          )}
          <AppText variant="headlineLg" style={styles.mainTitle}>
            Thực đơn của bạn
          </AppText>
        </View>

        {/* ── Segmented Pill Tabs (Exact UI from Design) ───────────────── */}
        <View style={styles.tabBarRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('my_plans')}
            style={[
              styles.pillTab,
              activeTab === 'my_plans'
                ? {
                    backgroundColor: isDark ? 'rgba(158, 100, 247, 0.22)' : '#EDE5FF',
                    borderColor: isDark ? 'rgba(158, 100, 247, 0.5)' : '#7B4FE0',
                  }
                : {
                    backgroundColor: theme.colors.surfaceHigh,
                    borderColor: 'transparent',
                  },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'my_plans' }}
          >
            <AppText
              variant="labelLg"
              color={
                activeTab === 'my_plans'
                  ? isDark ? '#D6B8FF' : '#7B4FE0'
                  : theme.colors.textSecondary
              }
            >
              Thực đơn của bạn
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('explore')}
            style={[
              styles.pillTab,
              activeTab === 'explore'
                ? {
                    backgroundColor: isDark ? 'rgba(158, 100, 247, 0.22)' : '#EDE5FF',
                    borderColor: isDark ? 'rgba(158, 100, 247, 0.5)' : '#7B4FE0',
                  }
                : {
                    backgroundColor: theme.colors.surfaceHigh,
                    borderColor: 'transparent',
                  },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'explore' }}
          >
            <AppText
              variant="labelLg"
              color={
                activeTab === 'explore'
                  ? isDark ? '#D6B8FF' : '#7B4FE0'
                  : theme.colors.textSecondary
              }
            >
              Khám phá thực đơn
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── TAB 1: THỰC ĐƠN CỦA BẠN ──────────────────────────────────── */}
      {activeTab === 'my_plans' && (
        <>
          {!currentPlan ? (
            /* ── EMPTY STATE (EXACT 1:1 REPRODUCTION OF SCREENSHOT) ── */
            <View style={styles.emptyContainer}>
              <Image
                source={images.mealPlanEmpty}
                style={styles.emptyIllustration}
                resizeMode="contain"
                accessibilityLabel="Chưa có thực đơn"
              />

              <AppText variant="headlineMd" align="center" style={styles.emptyTitle}>
                Bạn chưa ăn theo thực đơn nào
              </AppText>

              <AppText
                variant="bodyMd"
                align="center"
                color={theme.colors.textSecondary}
                style={styles.emptySubtitle}
              >
                Gợi ý một số thực đơn từ các chuyên gia dinh dưỡng, phù hợp với các mức calo và sở thích ăn kiêng khác nhau.
              </AppText>

              <AppButton
                label="Tham khảo thực đơn"
                variant="primary"
                style={styles.ctaButton}
                onPress={() => setActiveTab('explore')}
                accessibilityLabel="Tham khảo thực đơn ngay"
              />
            </View>
          ) : (
            /* ── ACTIVE PLAN CONTENT (WHEN USER HAS A MEAL PLAN) ── */
            <ScrollView contentContainerStyle={styles.activePlanContent} showsVerticalScrollIndicator={false}>
              {/* Active Plan Card */}
              <AppCard style={styles.activePlanCard}>
                <View style={styles.planCardHeader}>
                  <View style={styles.flex}>
                    <View style={styles.badgeRow}>
                      <View style={[styles.activeBadge, { backgroundColor: theme.colors.brandSoftTint }]}>
                        <AppText variant="labelSm" color={theme.colors.brandPrimary}>
                          ● ĐANG THEO DÕI
                        </AppText>
                      </View>
                      <AppText variant="caption" color={theme.colors.textSecondary}>
                        {currentPlan.days.length} ngày
                      </AppText>
                    </View>
                    <AppText variant="headlineSm" style={styles.planTitleText}>
                      {currentPlan.title}
                    </AppText>
                  </View>
                </View>

                {/* Macro & Target Row */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricBox}>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      Mục tiêu
                    </AppText>
                    <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
                      {currentPlan.goal.targetCalories} kcal
                    </AppText>
                  </View>

                  <View style={styles.metricBox}>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      Chất đạm
                    </AppText>
                    <AppText variant="labelLg" color={theme.colors.macroProtein}>
                      {currentPlan.goal.proteinTarget}g
                    </AppText>
                  </View>

                  <View style={styles.metricBox}>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      Đường bột
                    </AppText>
                    <AppText variant="labelLg" color={theme.colors.macroCarbs}>
                      {currentPlan.goal.carbsTarget}g
                    </AppText>
                  </View>

                  <View style={styles.metricBox}>
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      Chất béo
                    </AppText>
                    <AppText variant="labelLg" color={theme.colors.macroFats}>
                      {currentPlan.goal.fatTarget}g
                    </AppText>
                  </View>
                </View>

                {/* Daily Cost & Allergens */}
                <View style={styles.infoRow}>
                  <AppText variant="bodySm" color={theme.colors.textSecondary}>
                    Ngân sách:{' '}
                    <AppText variant="labelMd" color={theme.colors.textPrimary}>
                      {formatVnd(currentPlan.goal.dailyBudgetVnd)}/ngày
                    </AppText>
                  </AppText>
                  {currentPlan.goal.excludedAllergens.length > 0 && (
                    <AppText variant="bodySm" color={theme.colors.macroProtein}>
                      Tránh: {currentPlan.goal.excludedAllergens.join(', ')}
                    </AppText>
                  )}
                </View>

                {/* Today's Meals Quick Peek */}
                {currentPlan.days[0] && (
                  <View style={styles.mealsPeek}>
                    <AppText variant="labelMd" color={theme.colors.textSecondary}>
                      Hôm nay ({currentPlan.days[0].dayLabel}):
                    </AppText>
                    <View style={styles.peekDishesList}>
                      {currentPlan.days[0].items.slice(0, 4).map((item) => (
                        <View key={item.id} style={styles.peekItem}>
                          <AppText variant="bodySm" numberOfLines={1} style={styles.flex}>
                            • {item.name}
                          </AppText>
                          <AppText variant="caption" color={theme.colors.textSecondary}>
                            {item.calories} kcal
                          </AppText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Actions */}
                <View style={styles.cardActionsStack}>
                  <AppButton
                    label="Xem chi tiết & Đổi món"
                    variant="primary"
                    onPress={() => navigation.navigate('MealPlanDetail')}
                  />
                  <AppButton
                    label="Áp dụng vào Nhật ký hôm nay"
                    variant="secondary"
                    onPress={handleApplyTodayToDiary}
                  />
                  <TouchableOpacity
                    onPress={handleResetCurrentPlan}
                    style={styles.stopPlanButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <AppText variant="caption" color={theme.colors.textSecondary}>
                      Dừng theo dõi thực đơn này
                    </AppText>
                  </TouchableOpacity>
                </View>
              </AppCard>

              {/* ── Saved Plans Section ──────────────────────────────── */}
              <View style={styles.sectionHeader}>
                <AppText variant="headlineSm">Thực đơn đã lưu</AppText>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {savedPlans.length} thực đơn
                </AppText>
              </View>

              {savedPlans.map((plan) => (
                <AppCard key={plan.id} style={styles.savedCard}>
                  <View style={styles.savedCardContent}>
                    <AppText variant="labelLg">{plan.title}</AppText>
                    <AppText variant="bodySm" color={theme.colors.textSecondary}>
                      {plan.goal.targetCalories} kcal • {formatVnd(plan.goal.dailyBudgetVnd)}/ngày
                    </AppText>
                  </View>
                  <AppButton
                    label="Xem"
                    variant="secondary"
                    onPress={() => navigation.navigate('MealPlanDetail')}
                  />
                </AppCard>
              ))}

              {/* Bottom Generator Link */}
              <View style={styles.bottomGeneratorRow}>
                <AppButton
                  label="Lập thực đơn AI mới (3 bước)"
                  variant="outline"
                  onPress={() => navigation.navigate('MealPlanWizard')}
                />
              </View>
            </ScrollView>
          )}
        </>
      )}

      {/* ── TAB 2: KHÁM PHÁ THỰC ĐƠN (EXPLORE) ────────────────────────── */}
      {activeTab === 'explore' && (
        <ScrollView contentContainerStyle={styles.exploreContent} showsVerticalScrollIndicator={false}>
          {/* AI Wizard Hero Banner */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.heroBanner}
            onPress={() => navigation.navigate('MealPlanWizard')}
            accessibilityRole="button"
            accessibilityLabel="Tạo thực đơn AI thông minh"
          >
            <Image
              source={images.mealPlanNewAiBanner}
              style={styles.heroBannerImage}
              resizeMode="cover"
            />
            <View style={styles.heroBannerOverlay}>
              <View style={styles.aiTag}>
                <AppText variant="caption" color="#FFFFFF">
                  ✨ KALLO AI SMART MENU
                </AppText>
              </View>
              <AppText variant="headlineSm" color="#FFFFFF">
                Lập thực đơn thông minh AI
              </AppText>
              <AppText variant="bodySm" color="rgba(255,255,255,0.85)">
                Cá nhân hóa theo Calo, Macro, Ngân sách và Dị ứng
              </AppText>
              <View style={styles.heroBannerCta}>
                <AppText variant="labelSm" color="#FFFFFF">
                  Tạo thực đơn ngay (3 bước) →
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsContainer}
          >
            {DIET_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryChip,
                    isSelected
                      ? {
                          backgroundColor: isDark ? 'rgba(158, 100, 247, 0.25)' : '#EDE5FF',
                          borderColor: theme.colors.brandPrimary,
                        }
                      : {
                          backgroundColor: theme.colors.surfaceHigh,
                          borderColor: 'transparent',
                        },
                  ]}
                >
                  <AppText
                    variant="labelMd"
                    color={isSelected ? theme.colors.brandPrimary : theme.colors.textSecondary}
                  >
                    {cat.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Section Heading */}
          <View style={styles.sectionHeader}>
            <AppText variant="headlineSm">Thực đơn từ chuyên gia</AppText>
            <AppText variant="caption" color={theme.colors.textSecondary}>
              {filteredCuratedPlans.length} gợi ý
            </AppText>
          </View>

          {/* Curated Plans List */}
          {filteredCuratedPlans.map((curated) => (
            <AppCard key={curated.id} style={styles.curatedCard}>
              <View style={styles.curatedHeaderRow}>
                <View style={[styles.curatedTagBadge, { backgroundColor: theme.colors.brandSoftTint }]}>
                  <AppText variant="caption" color={theme.colors.brandPrimary}>
                    {curated.tag}
                  </AppText>
                </View>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  {curated.durationDays} ngày
                </AppText>
              </View>

              <AppText variant="headlineSm" style={styles.curatedTitle}>
                {curated.title}
              </AppText>

              <AppText variant="bodySm" color={theme.colors.textSecondary} style={styles.curatedSubtitle}>
                {curated.subtitle}
              </AppText>

              {/* Nutrition summary bar */}
              <View style={styles.curatedMetricsBar}>
                <View style={styles.curatedMetricItem}>
                  <AppText variant="headlineSm" color={theme.colors.brandPrimary}>
                    {curated.targetCalories}
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    kcal/ngày
                  </AppText>
                </View>

                <View style={styles.curatedMetricItem}>
                  <AppText variant="labelLg" color={theme.colors.macroProtein}>
                    {curated.macros.protein}g
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    Đạm
                  </AppText>
                </View>

                <View style={styles.curatedMetricItem}>
                  <AppText variant="labelLg" color={theme.colors.macroCarbs}>
                    {curated.macros.carbs}g
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    Carb
                  </AppText>
                </View>

                <View style={styles.curatedMetricItem}>
                  <AppText variant="labelLg" color={theme.colors.macroFats}>
                    {curated.macros.fat}g
                  </AppText>
                  <AppText variant="caption" color={theme.colors.textSecondary}>
                    Béo
                  </AppText>
                </View>
              </View>

              {/* Sample dishes */}
              <View style={styles.dishesRow}>
                <AppText variant="caption" color={theme.colors.textSecondary}>
                  Món tiêu biểu:
                </AppText>
                <View style={styles.dishesWrap}>
                  {curated.sampleDishes.map((dish, i) => (
                    <View
                      key={i}
                      style={[styles.dishPill, { backgroundColor: theme.colors.surfaceHigh }]}
                    >
                      <AppText variant="caption" color={theme.colors.textPrimary}>
                        {dish}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.curatedFooterRow}>
                <AppText variant="labelMd" color={theme.colors.textSecondary}>
                  ~{formatVnd(curated.dailyBudgetVnd)} / ngày
                </AppText>
                <AppButton
                  label="Áp dụng thực đơn này"
                  variant="primary"
                  style={styles.adoptButton}
                  onPress={() => handleAdoptCuratedPlan(curated)}
                />
              </View>
            </AppCard>
          ))}
        </ScrollView>
      )}
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

  // ── Top Header & Tab Pills ──────────────────────────────────────────
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
  },
  tabBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pillTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty State Reproduction ─────────────────────────────────────────
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  emptyIllustration: {
    width: 170,
    height: 140,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 320,
    paddingHorizontal: 8,
  },
  ctaButton: {
    minWidth: 260,
    marginTop: 32,
  },

  // ── Active Plan Content ──────────────────────────────────────────────
  activePlanContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  activePlanCard: {
    borderRadius: 20,
    gap: 14,
    padding: 18,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  planTitleText: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(128,128,128,0.15)',
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  mealsPeek: {
    backgroundColor: 'rgba(128,128,128,0.06)',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  peekDishesList: {
    gap: 4,
  },
  peekItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardActionsStack: {
    gap: 10,
    marginTop: 4,
  },
  stopPlanButton: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  savedCardContent: {
    flex: 1,
    gap: 4,
  },
  bottomGeneratorRow: {
    marginTop: 8,
  },

  // ── Explore Tab Content ──────────────────────────────────────────────
  exploreContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  heroBanner: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E1B2E',
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 14, 25, 0.55)',
    padding: 16,
    justifyContent: 'flex-end',
    gap: 4,
  },
  aiTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#8B57E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  heroBannerCta: {
    marginTop: 4,
  },
  categoryChipsContainer: {
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  curatedCard: {
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  curatedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  curatedTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  curatedTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  curatedSubtitle: {
    lineHeight: 18,
  },
  curatedMetricsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(128,128,128,0.12)',
  },
  curatedMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  dishesRow: {
    gap: 6,
  },
  dishesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dishPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  curatedFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  adoptButton: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
