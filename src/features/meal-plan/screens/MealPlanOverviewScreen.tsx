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
  CALORIE_FILTER_TABS,
  buildMealPlanFromCurated,
  type CuratedPlan,
  type CalorieRange,
} from '../curatedPlans';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabKey = 'my_plans' | 'explore' | 'custom';

// Palette tied to the cream premium banner artwork (asset-driven, not theme tokens)
const BANNER_TEXT = '#1D1712';
const BANNER_SUBTEXT = '#43391F';
const BANNER_CTA_BG = '#FFBE3B';
const BANNER_CTA_TEXT = '#1F1A0A';

export function MealPlanOverviewScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const isDark = theme.scheme === 'dark';
  const { currentPlan, savedPlans, clearCurrentPlan, setActivePlan, applyPlanToDiary, deletePlan } = useMealPlan();

  // Default to Explore tab with 2400-2600 Cal range selected to match user mockup exactly
  const [activeTab, setActiveTab] = useState<TabKey>('explore');
  const [selectedCalorieRange, setSelectedCalorieRange] = useState<CalorieRange>('2400-2600 Cal');

  const filteredCuratedPlans = CURATED_MEAL_PLANS.filter(
    (p) => p.calorieRange === selectedCalorieRange,
  );

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
        {
          text: 'Ở lại đây',
          style: 'cancel',
        },
      ],
    );
  };

  const handleViewCuratedDetail = (curated: CuratedPlan) => {
    const newPlan = buildMealPlanFromCurated(curated);
    if (setActivePlan) {
      setActivePlan(newPlan);
    }
    navigation.navigate('MealPlanDetail');
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
      ],
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
      ],
    );
  };

  const getScreenTitle = () => {
    switch (activeTab) {
      case 'explore':
        return 'Khám phá thực đơn';
      case 'custom':
        return 'Thực đơn tự tạo';
      default:
        return 'Thực đơn của bạn';
    }
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
            {getScreenTitle()}
          </AppText>
        </View>

        {/* ── Segmented Pill Tabs (Thực đơn của bạn | Khám phá thực đơn | Thực đơn tự tạo) ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarRow}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('my_plans')}
            style={[
              styles.pillTab,
              activeTab === 'my_plans'
                ? {
                    backgroundColor: isDark ? 'rgba(158, 100, 247, 0.28)' : '#EDE5FF',
                    borderColor: isDark ? '#7C3AED' : '#7B4FE0',
                  }
                : {
                    backgroundColor: isDark ? '#221D34' : theme.colors.surfaceHigh,
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
                  : theme.colors.textPrimary
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
                    backgroundColor: isDark ? 'rgba(158, 100, 247, 0.28)' : '#EDE5FF',
                    borderColor: isDark ? '#7C3AED' : '#7B4FE0',
                  }
                : {
                    backgroundColor: isDark ? '#221D34' : theme.colors.surfaceHigh,
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
                  : theme.colors.textPrimary
              }
            >
              Khám phá thực đơn
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveTab('custom')}
            style={[
              styles.pillTab,
              activeTab === 'custom'
                ? {
                    backgroundColor: isDark ? 'rgba(158, 100, 247, 0.28)' : '#EDE5FF',
                    borderColor: isDark ? '#7C3AED' : '#7B4FE0',
                  }
                : {
                    backgroundColor: isDark ? '#221D34' : theme.colors.surfaceHigh,
                    borderColor: 'transparent',
                  },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'custom' }}
          >
            <AppText
              variant="labelLg"
              color={
                activeTab === 'custom'
                  ? isDark ? '#D6B8FF' : '#7B4FE0'
                  : theme.colors.textPrimary
              }
            >
              Thực đơn tự tạo
            </AppText>
          </TouchableOpacity>
        </ScrollView>
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
              {savedPlans.length > 0 && (
                <>
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
                        onPress={() => {
                          setActivePlan?.(plan);
                          navigation.navigate('MealPlanDetail');
                        }}
                      />
                    </AppCard>
                  ))}
                </>
              )}

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

      {/* ── TAB 2: KHÁM PHÁ THỰC ĐƠN (EXPLORE - 1:1 TO MOCKUP SCREENSHOT) ── */}
      {activeTab === 'explore' && (
        <ScrollView contentContainerStyle={styles.exploreContent} showsVerticalScrollIndicator={false}>
          {/* ── BETA / Premium AI Banner ─────────────────────────────── */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.betaBanner}
            onPress={() => navigation.navigate('MealPlanWizard')}
            accessibilityRole="button"
            accessibilityLabel="Khám phá Premium - AI gợi ý thực đơn"
          >
            <Image
              source={images.mealPlanAiPremiumBanner}
              style={styles.betaBannerImage}
              resizeMode="cover"
            />
            <View style={styles.betaBannerContent}>
              <View style={styles.betaBadge}>
                <AppText variant="labelMd" color={BANNER_TEXT} style={styles.betaBadgeText}>
                  BETA
                </AppText>
              </View>
              <AppText variant="headlineSm" color={BANNER_TEXT} style={styles.betaTitle}>
                AI gợi ý thực đơn
              </AppText>
              <AppText variant="bodySm" color={BANNER_SUBTEXT} style={styles.betaSubtitle}>
                Nâng cấp Premium để trải nghiệm.
              </AppText>
              <View style={styles.betaCta}>
                <AppText variant="labelMd" color={BANNER_CTA_TEXT} style={styles.betaCtaText}>
                  Khám phá Premium
                </AppText>
              </View>
            </View>
          </TouchableOpacity>

          {/* ── Section Title: Đề xuất kế hoạch cho bạn ────────────────── */}
          <View style={styles.sectionHeaderTitleContainer}>
            <AppText variant="headlineMd" style={styles.sectionHeaderTitle}>
              Đề xuất kế hoạch cho bạn
            </AppText>
          </View>

          {/* ── Calorie Range Filter Pills (< 2200 Cal | 2200-2400 Cal | 2400-2600 Cal | > 2600 Cal) ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calorieChipsContainer}
          >
            {CALORIE_FILTER_TABS.map((range) => {
              const isSelected = selectedCalorieRange === range;
              return (
                <TouchableOpacity
                  key={range}
                  onPress={() => setSelectedCalorieRange(range)}
                  style={[
                    styles.calorieChip,
                    isSelected
                      ? {
                          backgroundColor: isDark ? 'rgba(158, 100, 247, 0.28)' : '#EDE5FF',
                          borderColor: isDark ? '#7C3AED' : '#7B4FE0',
                        }
                      : {
                          backgroundColor: isDark ? '#221D34' : theme.colors.surfaceHigh,
                          borderColor: 'transparent',
                        },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Lọc thực đơn ${range}`}
                >
                  <AppText
                    variant="labelLg"
                    color={
                      isSelected
                        ? isDark ? '#D6B8FF' : '#7B4FE0'
                        : theme.colors.textPrimary
                    }
                  >
                    {range}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── Curated Plan Cards Feed ───────────────────────────────── */}
          {filteredCuratedPlans.length === 0 ? (
            <View style={styles.rangeEmpty}>
              <AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">
                Chưa có thực đơn trong khoảng calo này.
              </AppText>
              <AppButton
                label="Xem khoảng 2400 - 2600 Cal"
                variant="secondary"
                onPress={() => setSelectedCalorieRange('2400-2600 Cal')}
              />
            </View>
          ) : (
            filteredCuratedPlans.map((curated) => (
              <View
                key={curated.id}
                style={[
                  styles.explorePlanCard,
                  {
                    backgroundColor: isDark ? '#181524' : theme.colors.surfaceMid,
                    borderColor: isDark ? '#322B48' : theme.colors.surfaceBorder,
                  },
                ]}
              >
                <Image
                  source={curated.coverImage || images.mealPlanCardSample}
                  style={styles.explorePlanImage}
                  resizeMode="cover"
                  accessibilityLabel={`Ảnh minh họa ${curated.title}`}
                />

                <View style={styles.explorePlanBody}>
                  <AppText variant="headlineSm" style={styles.planCardTitle} numberOfLines={2}>
                    {curated.title}
                  </AppText>

                  <AppText
                    variant="bodyMd"
                    color={isDark ? '#A29DB8' : theme.colors.textSecondary}
                    style={styles.planCardSubtitle}
                  >
                    {curated.subtitle}
                  </AppText>

                  {/* Action Buttons Row */}
                  <View style={styles.planActionButtonsRow}>
                    <TouchableOpacity
                      style={[
                        styles.planActionButton,
                        {
                          backgroundColor: isDark ? '#221D34' : theme.colors.surfaceHigh,
                          borderColor: isDark ? '#322B48' : theme.colors.surfaceBorder,
                        },
                      ]}
                      onPress={() => handleAdoptCuratedPlan(curated)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Áp dụng thực đơn này"
                    >
                      <AppText
                        variant="labelMd"
                        color={theme.colors.textPrimary}
                        style={styles.planActionText}
                      >
                        Áp dụng thực đơn này
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.planActionButton,
                        {
                          backgroundColor: isDark ? '#221D34' : theme.colors.surfaceHigh,
                          borderColor: isDark ? '#322B48' : theme.colors.surfaceBorder,
                        },
                      ]}
                      onPress={() => handleViewCuratedDetail(curated)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel="Xem chi tiết thực đơn"
                    >
                      <AppText
                        variant="labelMd"
                        color={theme.colors.textPrimary}
                        style={styles.planActionText}
                      >
                        Xem chi tiết
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* ── TAB 3: THỰC ĐƠN TỰ TẠO (CUSTOM PLAN MAKER) ────────────────── */}
      {activeTab === 'custom' && (
        <ScrollView contentContainerStyle={styles.customContent} showsVerticalScrollIndicator={false}>
          <AppCard style={styles.customHeroCard}>
            <View style={[styles.customBadge, { backgroundColor: theme.colors.brandSoftTint }]}>
              <AppText variant="labelSm" color={theme.colors.brandPrimary}>
                CÁ NHÂN HÓA
              </AppText>
            </View>
            <AppText variant="headlineMd" style={styles.customHeroTitle}>
              Tự tạo thực đơn theo nhu cầu
            </AppText>
            <AppText variant="bodyMd" color={theme.colors.textSecondary} style={styles.customHeroSubtitle}>
              Thiết lập mục tiêu calo, tỷ lệ Macro (Đạm, Đường bột, Chất béo), ngân sách đi chợ món Việt và loại trừ dị ứng thức ăn cá nhân.
            </AppText>
            <AppButton
              label="Bắt đầu tạo thực đơn (3 bước)"
              variant="primary"
              style={styles.customHeroButton}
              onPress={() => navigation.navigate('MealPlanWizard')}
            />
          </AppCard>

          {savedPlans.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <AppText variant="headlineSm">Thực đơn tự tạo đã lưu</AppText>
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
                    onPress={() => {
                      setActivePlan?.(plan);
                      navigation.navigate('MealPlanDetail');
                    }}
                  />
                </AppCard>
              ))}
            </>
          ) : (
            <View style={styles.customEmptyContainer}>
              <AppText variant="bodyMd" color={theme.colors.textSecondary} align="center">
                Bạn chưa lưu thực đơn tự tạo nào. Hãy nhấn nút trên để tạo thực đơn đầu tiên với AI!
              </AppText>
            </View>
          )}
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
    paddingTop: 8,
    paddingBottom: 14,
    gap: 14,
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
    gap: 10,
    paddingVertical: 2,
    paddingRight: 12,
  },
  pillTab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Empty State ──────────────────────────────────────────────────────
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

  // ── Explore Tab Content (1:1 with Mockup) ────────────────────────────
  exploreContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },

  // ── BETA / Premium AI Banner ─────────────────────────────────────────
  betaBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    aspectRatio: 657 / 390,
    minHeight: 180,
  },
  betaBannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  betaBannerContent: {
    flex: 1,
    maxWidth: '58%',
    padding: 16,
    justifyContent: 'space-between',
  },
  betaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  betaBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  betaTitle: {
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 26,
  },
  betaSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  betaCta: {
    alignSelf: 'flex-start',
    backgroundColor: BANNER_CTA_BG,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9999,
  },
  betaCtaText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Section Title ────────────────────────────────────────────────────
  sectionHeaderTitleContainer: {
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  // ── Calorie Range Chips ──────────────────────────────────────────────
  calorieChipsContainer: {
    gap: 10,
    paddingVertical: 2,
    paddingRight: 8,
  },
  calorieChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeEmpty: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },

  // ── Curated Plan Cards Feed ──────────────────────────────────────────
  explorePlanCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 8,
  },
  explorePlanImage: {
    width: '100%',
    height: 190,
  },
  explorePlanBody: {
    padding: 16,
  },
  planCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  planCardSubtitle: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 14,
  },
  planActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planActionText: {
    fontWeight: '600',
    fontSize: 13,
  },

  // ── Custom Tab Content ───────────────────────────────────────────────
  customContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  customHeroCard: {
    borderRadius: 20,
    padding: 20,
    gap: 10,
  },
  customBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  customHeroTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  customHeroSubtitle: {
    lineHeight: 22,
    marginTop: 2,
  },
  customHeroButton: {
    marginTop: 8,
  },
  customEmptyContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});
