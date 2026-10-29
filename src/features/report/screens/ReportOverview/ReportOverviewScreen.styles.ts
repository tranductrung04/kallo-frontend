import { StyleSheet } from 'react-native';
import { colors, type ColorTokens } from '@/theme/colors';
import { useTheme, type ThemeContextValue } from '@/theme';
import { useMemo } from 'react';

export function createStyles(theme: ThemeContextValue | { colors: ColorTokens }) {
  const { colors: c } = theme;

  return StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },

    // ── Header ──
    headerContainer: {
      backgroundColor: c.canvasBase,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: -0.2,
    },
    headerSpacer: {
      width: 36,
    },
    tabBarRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginTop: 4,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      position: 'relative',
    },
    tabButtonActive: {},
    tabButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    tabButtonTextActive: {
      color: c.textPrimary,
      fontWeight: '700',
    },
    tabButtonTextInactive: {
      color: c.textSecondary,
    },
    activeTabIndicator: {
      position: 'absolute',
      bottom: 0,
      left: '10%',
      right: '10%',
      height: 3,
      backgroundColor: c.brandPrimary,
      borderRadius: 2,
    },
    headerBorderBottom: {
      height: 1,
      backgroundColor: c.surfaceBorder,
    },

    // ── Scroll Content ──
    scrollArea: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 40,
    },

    // ── Date Navigator ──
    dateNavigatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 20,
    },
    dateNavChevron: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceMid,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateNavText: {
      fontSize: 17,
      fontWeight: '700',
      color: c.textPrimary,
      minWidth: 70,
      textAlign: 'center',
    },

    // ── Section ──
    sectionContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 12,
      letterSpacing: -0.3,
    },

    // ── Card Surface ──
    cardSurface: {
      backgroundColor: c.surfaceMid,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      padding: 16,
      marginBottom: 12,
    },

    // ── Calorie In Card ──
    calorieTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardLabelText: {
      fontSize: 13,
      color: c.textSecondary,
      marginBottom: 4,
    },
    calorieValuesRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    calorieCurrentText: {
      fontSize: 26,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: -0.5,
    },
    calorieGoalText: {
      fontSize: 14,
      color: c.textSecondary,
      marginLeft: 2,
      fontWeight: '500',
    },
    logFoodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    logFoodText: {
      fontSize: 13,
      color: c.textSecondary,
      fontWeight: '500',
    },
    plusButtonCircle: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.brandSoftTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressBarWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    flameCircleBadge: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.brandSoftTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressTrack: {
      flex: 1,
      height: 14,
      backgroundColor: c.progressTrack,
      borderRadius: 7,
      overflow: 'hidden',
      position: 'relative',
      justifyContent: 'center',
    },
    progressFill: {
      height: '100%',
      backgroundColor: c.brandPrimary,
      borderRadius: 7,
    },
    progressTargetLine: {
      position: 'absolute',
      right: '25%',
      width: 3,
      height: 14,
      backgroundColor: c.surfaceBorder,
      borderRadius: 1.5,
    },

    // ── Insight Card ──
    insightCard: {
      paddingVertical: 14,
      backgroundColor: c.surfaceHigh,
    },
    insightHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    insightTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textPrimary,
    },
    insightSubtitle: {
      fontSize: 13,
      color: c.textSecondary,
      lineHeight: 19,
    },

    // ── Macro 3 Columns ──
    macroColumnsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    macroColumn: {
      flex: 1,
      alignItems: 'center',
    },
    macroColHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 6,
    },
    macroColTitle: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    macroColValue: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 8,
    },
    macroPillBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surfaceHigh,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    pillNumWhite: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textPrimary,
    },
    pillNumPurple: {
      fontSize: 12,
      fontWeight: '600',
      color: c.brandPrimary,
    },

    // ── Expand Button ──
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceHigh,
      borderRadius: 20,
      paddingVertical: 10,
      marginTop: 16,
      gap: 6,
    },
    expandButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textSecondary,
    },
    expandedNutrientsContainer: {
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: c.surfaceBorder,
      gap: 10,
    },
    nutrientRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    nutrientLabelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    nutrientLabel: {
      fontSize: 13,
      color: c.textSecondary,
    },
    nutrientValue: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textPrimary,
    },

    // ── Meal Optimization Card ──
    optimizationCard: {
      marginTop: 2,
    },
    optBadgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.brandSoftTint,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 14,
      alignSelf: 'flex-start',
      gap: 6,
      marginBottom: 10,
    },
    optBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: c.brandPrimary,
    },
    optimizationTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 6,
    },
    optimizationSubtitle: {
      fontSize: 13,
      color: c.textSecondary,
      lineHeight: 19,
    },

    // ── Section 3: Filter Pills ──
    filterPillsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 14,
    },
    filterPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: c.surfaceHigh,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    filterPillActive: {
      backgroundColor: c.brandPrimary,
      borderColor: c.brandPrimary,
    },
    filterPillText: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textSecondary,
    },
    filterPillTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },

    // ── Empty Dashed Box ──
    emptyDashedBox: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.surfaceBorder,
      backgroundColor: c.surfaceHigh,
      borderRadius: 18,
      paddingVertical: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyDashedText: {
      fontSize: 13,
      color: c.textSecondary,
      marginTop: 12,
    },

    // ── Food Contributors List ──
    contributorsCard: {
      backgroundColor: c.surfaceMid,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      padding: 16,
      gap: 14,
    },
    contribItemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    contribItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    contribRank: {
      fontSize: 13,
      fontWeight: '700',
      color: c.brandPrimary,
      width: 26,
    },
    contribName: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textPrimary,
      flex: 1,
    },
    contribItemRight: {
      alignItems: 'flex-end',
      width: 90,
    },
    contribAmount: {
      fontSize: 12,
      fontWeight: '600',
      color: c.textSecondary,
      marginBottom: 4,
    },
    contribMiniTrack: {
      width: '100%',
      height: 4,
      backgroundColor: c.progressTrack,
      borderRadius: 2,
      overflow: 'hidden',
    },
    contribMiniFill: {
      height: '100%',
      borderRadius: 2,
    },

    // ── Weekly View Styles ──
    weeklyContainer: {
      gap: 16,
    },
    weeklySummaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    weeklySummaryCard: {
      flex: 1,
      minWidth: '46%',
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      padding: 14,
      gap: 4,
    },
    weeklyCardLabel: {
      fontSize: 12,
      color: c.textSecondary,
    },
    weeklyCardValue: {
      fontSize: 22,
      fontWeight: '700',
      color: c.textPrimary,
    },
    weeklyCardSub: {
      fontSize: 11,
      color: c.textSecondary,
    },
  });
}

// Fallback styles for static imports
export const styles = createStyles({ colors: colors.dark });

export function useReportStyles() {
  const theme = useTheme();
  const reportStyles = useMemo(() => createStyles(theme), [theme]);
  return { theme, styles: reportStyles };
}
