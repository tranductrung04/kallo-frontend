import { StyleSheet, type ViewStyle } from 'react-native';
import type { ThemeContextValue } from '@/theme';

export function createStyles(theme: ThemeContextValue, screenWidth: number) {
  const { colors: c, spacing: s, radii: r, shadows: sh } = theme;

  // Khoảng cách trung gian giữa spacing.sm (8) và spacing.md (16)
  const gapMid = s.sm + s.xs; // 12

  // Pill vàng "Nâng cấp gói" — glow nhẹ theo màu accent
  const upgradeGlow: ViewStyle = {
    shadowColor: c.upgradeAccent,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  };

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.surfaceMid,
    },
    scrollView: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },
    scrollContent: {
      paddingBottom: s.xl + s.md,
    },
    topHeroContainer: {
      backgroundColor: c.surfaceMid,
      paddingHorizontal: s.lg,
      paddingTop: s.md,
      paddingBottom: s.md,
      borderColor: c.surfaceBorder,
      marginBottom: gapMid,
      ...sh.level1,
    },
    mainContent: {
      paddingHorizontal: s.lg,
    },
    pressedOpacity: {
      opacity: 0.8,
    },

    // Sticky Header khi cuộn trang
    stickyHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      backgroundColor: c.surfaceMid,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: s.lg,
      zIndex: 100,
      elevation: 6,
    },
    stickyDateBtn: {
      paddingVertical: 6,
      paddingRight: 12,
    },
    stickyDateText: {
      fontSize: 15,
      lineHeight: 20,
      fontFamily: 'PlusJakartaSans_800ExtraBold',
      fontWeight: '800',
      color: c.textPrimary,
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    aiAssistantButton: {
      minWidth: 48,
      height: 48,
      borderRadius: r.full,
      // backgroundColor: c.brandSoftTint,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 10,
      gap: 6,
      overflow: 'hidden',
    },
    aiAssistantImage: {
      width: 44,
      height: 44,
      borderRadius: r.full,
    },

    // 1. Top Header
    topHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s.md,
    },
    headerRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 4,
    },
    streakText: {
      fontSize: 16,
      lineHeight: 20,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
    },
    calendarBtn: {
      width: 38,
      height: 38,
      borderRadius: r.full,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // 2. Weekday / Date Section
    weekSection: {
      marginBottom: 24,
    },
    weekDateTitle: {
      fontSize: 14.5,
      lineHeight: 19,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: gapMid,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: s.xs,
    },
    dayItem: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dayText: {
      fontSize: 15,
      lineHeight: 19,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
    },
    daySelectedOuter: {
      width: 44,
      height: 44,
      borderRadius: r.full,
      borderWidth: 1.5,
      borderColor: c.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    daySelectedInner: {
      width: 34,
      height: 34,
      borderRadius: r.full,
      backgroundColor: c.brandAction,
      alignItems: 'center',
      justifyContent: 'center',
      ...sh.accentShadow,
    },
    daySelectedCircle: {
      width: 38,
      height: 38,
      borderRadius: r.full,
      backgroundColor: c.brandAction,
      alignItems: 'center',
      justifyContent: 'center',
      ...sh.accentShadow,
    },
    dayTodayOutline: {
      width: 42,
      height: 42,
      borderRadius: r.full,
      borderWidth: 1.5,
      borderColor: c.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },

    // 3. Calorie Goal Section
    calorieSection: {
      marginBottom: 0,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s.sm,
    },
    gaugeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: s.sm,
      marginBottom: 24,
    },
    gaugeSubRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: s.sm - 2,
      marginBottom: s.lg,
      paddingHorizontal: 2,
    },
    gaugeSubDateText: {
      textTransform: 'uppercase',
    },
    upgradePillSmall: {
      backgroundColor: c.upgradeAccent,
      paddingHorizontal: s.md,
      paddingVertical: s.xs,
      borderRadius: r.full,
      ...upgradeGlow,
    },
    calorieStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: s.xs,
    },
    calorieStatCol: {
      alignItems: 'center',
      flex: 1,
    },
    statColNumber: {
      fontSize: 21,
      lineHeight: 26,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
      marginBottom: 6,
    },
    statColLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statColFireIcon: {
      width: 16,
      height: 16,
    },
    statColLabel: {
      fontSize: 13.5,
      lineHeight: 18,
      fontWeight: '500',
    },

    // 4. Macro Nutrients Card
    macroCard: {
      overflow: 'hidden',
      padding: 0,
      marginTop: s.xl,
      marginBottom: 12,
    },
    macroColsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: gapMid,
      paddingHorizontal: s.md + 2,
      paddingVertical: 20,
    },
    macroCol: {
      flex: 1,
    },
    macroHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    macroColTitle: {
      fontSize: 13.5,
      lineHeight: 18,
      flexShrink: 1,
    },
    macroBarWrap: {
      height: 12,
      justifyContent: 'center',
      marginBottom: 10,
    },
    macroThumb: {
      position: 'absolute',
      width: 3.5,
      height: 12,
      backgroundColor: c.textPrimary,
      borderRadius: r.full,
    },
    macroValuesRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 3,
    },
    macroCurrentValue: {
      fontSize: 17,
      lineHeight: 22,
      fontFamily: 'PlusJakartaSans_700Bold',
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    macroGoalValue: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '500',
    },

    // Pagination Dots
    paginationRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      marginTop: 2,
      marginBottom: s.md,
    },
    dotActive: {
      width: 7,
      height: 7,
      borderRadius: r.full,
      backgroundColor: c.brandPrimary,
    },
    dotInactive: {
      width: 7,
      height: 7,
      borderRadius: r.full,
      backgroundColor: c.textDisabled,
    },

    // 5. Section Blocks
    sectionBlock: {
      marginBottom: s.md,
    },
    emptyDiaryCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: s.xl,
      gap: s.sm,
    },
    recentDiarySeeAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingVertical: 4,
      paddingLeft: 8,
    },
    recentDiaryCard: {
      overflow: 'hidden',
      marginTop: s.xs,
    },
    recentDiaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: s.md,
      paddingVertical: 12,
      gap: s.sm + 4,
    },
    recentDiaryRowBorder: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.surfaceBorder,
    },
    recentDiaryThumb: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
    },
    recentDiaryIconBox: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: c.brandSoftTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recentDiaryInfo: {
      flex: 1,
      gap: 2,
    },
    recentDiaryRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    recentDiaryFooterBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: c.surfaceBorder,
    },

    // 6. Workout Grid (AppCard + style)
    activityGridCard: {
      paddingVertical: s.lg,
      paddingHorizontal: gapMid,
      gap: s.lg,
      marginTop: s.sm,
    },
    activityRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    activityItem: {
      alignItems: 'center',
      // màn hình − padding 2 bên − padding card 2 bên − viền card, chia 3 cột
      width: (screenWidth - s.lg * 2 - gapMid * 2 - 2) / 3,
    },
    activityCircle: {
      width: 50,
      height: 50,
      borderRadius: r.full,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityLabel: {
      marginTop: s.sm,
    },

    // 7. Two Column Cards: Bước chân & Tập luyện
    twoColRow: {
      flexDirection: 'row',
      gap: gapMid,
      marginBottom: s.md,
    },
    subCard: {
      flex: 1,
      justifyContent: 'space-between',
      minHeight: 116,
    },
    healthConnectRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
      marginTop: s.md,
    },
    healthIconBox: {
      width: 38,
      height: 38,
      borderRadius: r.DEFAULT,
      backgroundColor: c.surfaceMid,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
    healthConnectImage: {
      width: 28,
      height: 28,
    },
    healthConnectText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 16,
    },
    stepConnectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.quickScanner,
    },
    stepCountValue: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: s.xs,
    },
    healthConnectMiniIcon: {
      width: 16,
      height: 16,
    },
    workoutTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    plusCircleBtn: {
      width: 28,
      height: 28,
      borderRadius: r.full,
      backgroundColor: c.brandSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    workoutMiddle: {
      marginTop: s.sm - 2,
    },
    workoutEmptyText: {
      marginBottom: s.xs + 2,
    },
    workoutDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.surfaceBorder,
    },
    workoutBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs + 2,
      marginTop: s.xs,
    },
    workoutFireIcon: {
      width: 16,
      height: 16,
    },

    // 8. Water Card (AppCard + style)
    waterCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s.md,
    },
    waterLeftCol: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.md,
    },
    waterDropletImage: {
      width: 26,
      height: 26,
    },
    waterTextGroup: {
      gap: 2,
    },
    waterControlsCapsule: {
      backgroundColor: c.canvasBase,
      borderRadius: r.full,
      paddingHorizontal: s.md,
      paddingVertical: s.sm + 2,
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.md,
    },
    waterCupBtn: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    waterCupImage: {
      width: 24,
      height: 26,
    },
    waterCapsuleDivider: {
      width: 1.5,
      height: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },

    // 9. Weight Card
    weightCard: {
      marginBottom: s.md,
    },
    weightHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
      marginBottom: s.md - 2,
    },
    weightIconImage: {
      width: 24,
      height: 24,
    },
    weightTitleText: {
      fontSize: 16,
      fontWeight: '700',
    },
    weightMiddleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s.sm,
    },
    weightValuesGroup: {
      justifyContent: 'center',
    },
    weightDateText: {
      marginTop: 2,
    },
    weightUpdatePillBtn: {
      backgroundColor: c.brandPrimary,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: r.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    weightUpdateBtnText: {
      fontSize: 14,
      fontWeight: '600',
    },
    weightChartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },

    // 10. Community & Gamification Cards
    communityGrid: {
      gap: 12,
    },
    communityCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: s.md,
      gap: s.md,
    },
    communityIconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    communityEmoji: {
      fontSize: 22,
    },
    communityTextWrap: {
      flex: 1,
      justifyContent: 'center',
      gap: 3,
    },
    communityRightWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs + 2,
    },
    incomingBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: r.full,
    },
    incomingBadgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    bold: {
      fontWeight: '700',
    },
    gameHubHeroCard: {
      borderRadius: 20,
      padding: s.md,
      borderWidth: 1.5,
      position: 'relative',
      overflow: 'hidden',
      gap: 12,
      shadowColor: '#7B4FE0',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    gameHubGlowCircle: {
      position: 'absolute',
      top: -24,
      right: -24,
      width: 96,
      height: 96,
      borderRadius: 48,
    },
    gameHubHeroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    gameHubIconAndTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm + 4,
      flex: 1,
    },
    gameHubIconBox: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gameHubTitleWrap: {
      flex: 1,
      gap: 2,
    },
    gameHubStandingPill: {
      paddingHorizontal: 7,
      paddingVertical: 1.5,
      borderRadius: r.full,
    },
    gameHubPointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: r.full,
      backgroundColor: c.vipStreakBg,
    },
    gameHubHeroDivider: {
      height: 1,
      width: '100%',
    },
    gameHubHeroBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    gameHubHeroGapWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flex: 1,
      marginRight: 8,
    },
    gameHubCtaAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },

    // 10. Floating "Quay lại hôm nay" Button
    floatingTodayWrapper: {
      position: 'absolute',
      bottom: 104,
      alignSelf: 'center',
      zIndex: 99,
    },
    floatingTodayBtn: {
      backgroundColor: c.brandSecondary,
      paddingHorizontal: s.lg + s.xs,
      paddingVertical: gapMid,
      borderRadius: r.full,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 6,
    },

    // 11. Floating Quick Utility Dock
    floatingDock: {
      position: 'absolute',
      left: s.md,
      right: s.md,
      bottom: 12,
      zIndex: 90,
    },
    floatingGrid: {
      gap: 12,
    },
  });
}

export type HomeDashboardStyles = ReturnType<typeof createStyles>;
