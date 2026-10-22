// ─── HomeDashboardScreen styles — theme-aware ─────────────────────────────────
// Chỉ còn layout + khoảng cách + nền/viền riêng của màn hình này.
//   • Chữ      → <AppText variant color /> (typography nằm trong theme)
//   • Card     → <AppCard />  (surface, viền, bo góc, shadow level1)
//   • Nút      → <AppButton />
//   • Thanh/vòng tiến độ → <ProgressBar /> / <CircularProgress />
//
// StyleSheet.create là static nên không gọi được useTheme(); dùng factory:
//   const styles = useMemo(() => createStyles(theme, width), [theme, width]);
// ─────────────────────────────────────────────────────────────────────────────

import { StyleSheet, type ViewStyle } from 'react-native';
import type { ThemeContextValue } from '@/theme';

export function createStyles(theme: ThemeContextValue, screenWidth: number) {
  const { colors: c, spacing: s, radii: r, shadows: sh } = theme;

  // Khoảng cách trung gian giữa spacing.sm (8) và spacing.md (16)
  const gapMid = s.sm + s.xs; // 12

  // Pill vàng "Nâng cấp gói" — glow nhẹ theo màu accent
  const upgradeGlow: ViewStyle = {
    shadowColor: c.upgradeAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  };

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },
    scrollContent: {
      paddingHorizontal: s.lg,
      paddingTop: s.md,
      paddingBottom: s.xxl,
    },
    pressedOpacity: {
      opacity: 0.8,
    },

    // 1. Top Header
    topHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s.md,
    },
    upgradePillTop: {
      backgroundColor: c.upgradeAccent,
      paddingHorizontal: s.md,
      paddingVertical: s.sm,
      borderRadius: r.full,
      ...upgradeGlow,
    },
    headerRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.md,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs,
    },
    calendarBtn: {
      padding: 2,
    },

    // 2. Weekday / Date Section
    weekSection: {
      marginBottom: s.lg,
    },
    weekDateTitle: {
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      marginBottom: s.md,
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
      marginBottom: s.md,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: gapMid,
    },
    gaugeContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: s.md,
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
      paddingVertical: s.sm,
    },
    calorieStatCol: {
      alignItems: 'center',
      flex: 1,
    },
    statColNumber: {
      marginBottom: s.xs,
    },
    statColLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs,
    },

    // 4. Macro Nutrients Card
    macroCard: {
      marginBottom: s.sm,
    },
    macroColsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: gapMid,
    },
    macroCol: {
      flex: 1,
    },
    macroHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs,
      marginBottom: s.sm,
    },
    macroBarWrap: {
      height: 9,
      justifyContent: 'center',
      marginBottom: s.sm,
    },
    macroThumb: {
      position: 'absolute',
      width: 2.5,
      height: 9,
      backgroundColor: c.textPrimary,
      borderRadius: r.full,
    },
    macroValuesRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 2,
    },

    // Pagination Dots
    paginationRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: s.sm - 2,
      marginBottom: s.md,
    },
    dotActive: {
      width: 6,
      height: 6,
      borderRadius: r.full,
      backgroundColor: c.brandAction,
    },
    dotInactive: {
      width: 6,
      height: 6,
      borderRadius: r.full,
      backgroundColor: c.surfaceBorder,
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

    // 6. Workout Grid (AppCard + style)
    activityGridCard: {
      paddingVertical: s.md,
      paddingHorizontal: gapMid,
      gap: s.md,
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
      minHeight: 110,
    },
    healthConnectRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
      marginTop: s.sm,
    },
    healthIconBox: {
      width: 34,
      height: 34,
      borderRadius: r.DEFAULT,
      backgroundColor: c.onBrand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    healthConnectText: {
      flex: 1,
    },
    workoutTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    plusCircleBtn: {
      width: 24,
      height: 24,
      borderRadius: r.full,
      backgroundColor: c.brandAction,
      alignItems: 'center',
      justifyContent: 'center',
    },
    workoutEmptyText: {
      marginVertical: s.sm - 2,
    },
    workoutBottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.xs,
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
      gap: gapMid,
    },
    waterTextGroup: {
      gap: 2,
    },
    waterControlsCapsule: {
      backgroundColor: c.canvasBase,
      borderRadius: r.full,
      paddingHorizontal: gapMid,
      paddingVertical: s.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    waterCupBtn: {
      padding: s.xs,
    },
    waterCapsuleDivider: {
      width: 1,
      height: 16,
      backgroundColor: c.surfaceBorder,
    },

    // 9. Weight Card
    weightTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: s.sm,
    },
    weightTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: s.sm,
    },
    // AppButton primary mặc định cao 52px → thu nhỏ cho nút "Cập nhật"
    weightUpdateBtn: {
      minHeight: 30,
      paddingVertical: s.xs,
      paddingHorizontal: s.md,
    },
    weightValuesGroup: {
      marginBottom: s.sm,
    },
    weightDateText: {
      marginTop: 2,
    },
    weightChartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: s.sm - 2,
    },

    // 10. Floating "Quay lại hôm nay" Button
    floatingTodayBtn: {
      position: 'absolute',
      bottom: 84,
      alignSelf: 'center',
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
      zIndex: 99,
    },
  });
}

export type HomeDashboardStyles = ReturnType<typeof createStyles>;
