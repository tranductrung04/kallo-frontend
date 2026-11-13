import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { colors, type ColorTokens } from '@/theme/colors';
import { useTheme, type ThemeContextValue } from '@/theme';

export function useFoodDiaryStyles() {
  const theme = useTheme();
  return useMemo(() => createStyles(theme), [theme]);
}

export function createStyles(theme: ThemeContextValue | { colors: ColorTokens }) {
  const { colors: c } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.canvasBase,
    },

    // 1. Header Bar
    headerBar: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    headerIconButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateNavigator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    chevronButton: {
      padding: 6,
    },
    dateTitleContainer: {
      paddingHorizontal: 4,
    },
    dateTitleText: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: 0.2,
    },

    // 2. Macro Strip
    macroStripContainer: {
      paddingTop: 14,
      paddingBottom: 8,
    },
    macroSlide: {
      paddingHorizontal: 20,
    },

    macroItemsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    macroItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    macroText: {
      fontSize: 12.5,
      fontWeight: '500',
      color: c.textSecondary,
      letterSpacing: 0.1,
    },
    progressBarsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    progressTrack: {
      flex: 1,
      height: 3.5,
      borderRadius: 2,
      backgroundColor: c.surfaceBorder,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
    },
    carouselDotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 10,
      marginBottom: 4,
    },
    carouselDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    carouselDotActive: {
      backgroundColor: c.brandPrimary,
    },
    carouselDotInactive: {
      backgroundColor: c.surfaceBorder,
    },

    // 3. Timeline / Hourly Schedule
    timelineScrollContent: {
      paddingTop: 10,
      paddingBottom: 24,
    },
    hourBlock: {
      marginBottom: 8,
    },
    hourRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      height: 42,
    },
    timePill: {
      paddingHorizontal: 12,
      paddingVertical: 5.5,
      borderRadius: 14,
      backgroundColor: c.surfaceHigh,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timePillCurrent: {
      backgroundColor: c.brandSoftTint,
      borderColor: c.brandSecondary,
    },
    timeText: {
      fontSize: 12.5,
      fontWeight: '600',
      color: c.textSecondary,
      letterSpacing: 0.2,
    },
    timeTextCurrent: {
      color: c.brandSecondary,
    },
    connectingLine: {
      flex: 1,
      height: 1,
      backgroundColor: c.surfaceBorder,
      marginHorizontal: 12,
    },
    hourCaloriesBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      backgroundColor: c.brandSoftTint,
      marginRight: 8,
    },
    hourCaloriesText: {
      fontSize: 11,
      fontWeight: '600',
      color: c.brandSecondary,
    },
    plusButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Nested food items inside an hour
    foodListContainer: {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 4,
      gap: 6,
    },
    foodItemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
      borderLeftWidth: 3,
      borderLeftColor: c.brandPrimary,
      marginLeft: 14,
    },
    foodItemMain: {
      flex: 1,
      gap: 2,
    },
    foodItemName: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textPrimary,
    },
    foodItemSubtitle: {
      fontSize: 11.5,
      color: c.textSecondary,
    },
    foodItemMacros: {
      flexDirection: 'row',
      gap: 6,
      marginRight: 10,
    },
    foodMacroText: {
      fontSize: 11,
      color: c.textSecondary,
    },
    deleteLogButton: {
      padding: 6,
    },
    deleteLogText: {
      color: c.statusDanger,
      fontSize: 14,
      fontWeight: '700',
    },

    // 4. Modals & Action Sheets
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(13, 11, 20, 0.75)',
      justifyContent: 'flex-end',
    },
    actionSheetContent: {
      backgroundColor: c.surfaceMid,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 32,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    drawerSheetContent: {
      backgroundColor: c.surfaceMid,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 32,
      maxHeight: '85%',
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    settingsSheetContent: {
      backgroundColor: c.surfaceMid,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      paddingTop: 12,
      paddingBottom: 36,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    settingsHandle: {
      width: 44,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: c.surfaceBorder,
      alignSelf: 'center',
      marginBottom: 18,
    },
    settingsTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: c.textPrimary,
      paddingHorizontal: 20,
      marginBottom: 20,
      letterSpacing: -0.3,
    },
    settingMainRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      gap: 14,
    },
    settingMainTextCol: {
      flex: 1,
    },
    settingMainTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 4,
    },
    settingMainDesc: {
      fontSize: 13,
      color: c.textSecondary,
      lineHeight: 18,
    },
    settingsDivider: {
      height: 1,
      backgroundColor: c.surfaceBorder,
      marginVertical: 14,
      marginHorizontal: 20,
    },
    settingOptionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    settingOptionLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: c.textPrimary,
    },
    toggleSwitchContainer: {
      width: 52,
      height: 30,
      borderRadius: 15,
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    toggleSwitchThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: c.onBrand,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 2,
      elevation: 3,
    },
    sheetHandle: {
      width: 38,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.surfaceBorder,
      alignSelf: 'center',
      marginBottom: 16,
    },
    sheetHeader: {
      marginBottom: 16,
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.textPrimary,
    },
    sheetSubtitle: {
      fontSize: 12.5,
      color: c.textSecondary,
      marginTop: 2,
    },
    actionOptionsList: {
      gap: 10,
      marginBottom: 16,
    },
    actionOptionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.surfaceHigh,
      gap: 12,
    },
    actionIconBox: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionEmoji: {
      fontSize: 18,
    },
    actionTextWrap: {
      flex: 1,
    },
    actionOptionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textPrimary,
    },
    actionOptionDesc: {
      fontSize: 11.5,
      color: c.textSecondary,
      marginTop: 1,
    },
    closeSheetButton: {
      height: 44,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeSheetText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textSecondary,
    },

    // Full Month Calendar Dropdown
    calendarModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'flex-start',
    },
    calendarCard: {
      backgroundColor: c.surfaceMid,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingBottom: 28,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 12,
    },
    calendarHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    calendarHeaderTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: -0.2,
    },
    calendarMonthNavRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 36,
      marginTop: 8,
      marginBottom: 16,
    },
    calendarMonthNavText: {
      fontSize: 17,
      fontWeight: '700',
      color: c.textPrimary,
    },
    calendarMonthArrowBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarWeekdaysRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    calendarWeekdayCol: {
      flex: 1,
      alignItems: 'center',
    },
    calendarWeekdayText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textSecondary,
    },
    calendarDivider: {
      height: 1,
      backgroundColor: c.surfaceBorder,
      marginHorizontal: 16,
      marginBottom: 12,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 16,
    },
    calendarDayCell: {
      width: '14.285%',
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarDayNumber: {
      fontSize: 16,
      fontWeight: '500',
      color: c.textPrimary,
    },
    calendarSelectedOuterRing: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: c.brandSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarSelectedInnerCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarSelectedSolid: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    calendarTodayOutline: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: c.brandSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    calendarTodayDayNumber: {
      fontSize: 16,
      fontWeight: '700',
      color: c.textPrimary,
    },
    calendarSelectedDayNumber: {
      fontSize: 16,
      fontWeight: '700',
      color: c.onBrand,
    },

    // Date picker strip
    weekStripRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 14,
    },
    weekDayPill: {
      width: 42,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      gap: 4,
    },
    weekDayPillSelected: {
      backgroundColor: c.brandPrimary,
    },
    weekDayLabel: {
      fontSize: 11,
      color: c.textSecondary,
      fontWeight: '600',
    },
    weekDayLabelSelected: {
      color: c.onBrand,
    },
    weekDayNum: {
      fontSize: 14,
      color: c.textPrimary,
      fontWeight: '700',
    },
    weekDayNumSelected: {
      color: c.onBrand,
    },
    jumpTodayButton: {
      height: 40,
      borderRadius: 10,
      backgroundColor: c.brandSoftTint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    jumpTodayText: {
      fontSize: 13,
      fontWeight: '600',
      color: c.brandSecondary,
    },

    // Quick water & weight buttons
    waterButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 14,
      gap: 8,
    },
    waterQuickBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: c.surfaceHigh,
      alignItems: 'center',
      gap: 4,
    },
    waterQuickEmoji: {
      fontSize: 22,
    },
    waterQuickLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: c.textPrimary,
    },
    weightSubLabel: {
      fontSize: 11,
      color: c.textSecondary,
    },
  });
}

// Default export for backward compatibility
export const styles = createStyles({
  colors: colors.dark,
});
