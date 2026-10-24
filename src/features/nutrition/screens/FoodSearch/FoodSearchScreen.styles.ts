import { StyleSheet } from 'react-native';
import { colors, type ColorTokens } from '@/theme/colors';
import type { ThemeContextValue } from '@/theme';

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
    headerCenterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    headerTitleText: {
      fontSize: 17.5,
      fontWeight: '700',
      color: c.textPrimary,
      letterSpacing: 0.2,
    },
    headerCaret: {
      fontSize: 10,
      color: c.textPrimary,
      opacity: 0.8,
      marginTop: 2,
    },

    // 2. Search Bar
    searchBarWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 10,
      gap: 12,
    },
    searchBarContainer: {
      flex: 1,
      height: 48,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: c.brandPrimary,
      backgroundColor: c.surfaceMid,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 10,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      fontSize: 14.5,
      color: c.textPrimary,
      paddingVertical: 0,
    },
    barcodeIconBtn: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // 3. Tabs (Centered)
    tabsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 20,
      marginBottom: 16,
      gap: 32,
    },
    tabItem: {
      alignItems: 'center',
      paddingBottom: 4,
      paddingHorizontal: 4,
    },
    tabLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: c.textSecondary,
    },
    tabLabelActive: {
      color: c.textPrimary,
      fontWeight: '700',
    },
    activeTabIndicator: {
      width: '100%',
      height: 2.5,
      borderRadius: 1.5,
      backgroundColor: c.textPrimary,
      marginTop: 6,
    },

    // 4. Action Cards
    actionCardsRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 10,
    },
    actionCard: {
      flex: 1,
      backgroundColor: c.surfaceMid,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    actionCardTitle: {
      fontSize: 12.5,
      fontWeight: '600',
      color: c.textPrimary,
      textAlign: 'center',
      lineHeight: 16,
    },

    // 5. Body Area & Empty State
    scrollBody: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 32,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 48,
      paddingHorizontal: 24,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      marginTop: 18,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      marginTop: 8,
    },
    createCustomBtn: {
      marginTop: 20,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: c.brandSoftTint,
      borderWidth: 1,
      borderColor: c.brandSecondary,
    },
    createCustomBtnText: {
      fontSize: 13.5,
      fontWeight: '600',
      color: c.brandSecondary,
    },

    // Search results list
    resultsList: {
      gap: 8,
    },
    foodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: c.surfaceHigh,
    },
    foodRowInfo: {
      flex: 1,
      gap: 3,
    },
    foodRowName: {
      fontSize: 14,
      fontWeight: '600',
      color: c.textPrimary,
    },
    foodRowSubtitle: {
      fontSize: 12,
      color: c.textSecondary,
    },
    foodRowAction: {
      paddingLeft: 8,
    },
    foodRowActionText: {
      fontSize: 18,
      color: c.brandPrimary,
      fontWeight: '700',
    },

    // 6. Hour Picker Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(9, 7, 15, 0.72)',
      justifyContent: 'flex-end',
    },
    hourSheetContent: {
      backgroundColor: c.surfaceMid,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 20,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
    },
    modalHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    modalHeaderPlaceholder: {
      width: 36,
    },
    modalHeaderTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      textAlign: 'center',
      flex: 1,
      letterSpacing: 0.2,
    },
    modalCloseBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pickerColumnsContainer: {
      height: 220,
      flexDirection: 'row',
      position: 'relative',
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    pickerHighlightBar: {
      position: 'absolute',
      top: 88,
      left: 0,
      right: 0,
      height: 44,
      borderRadius: 14,
      backgroundColor: c.surfaceBorder,
    },
    dateColumnWrapper: {
      flex: 1.6,
      alignItems: 'center',
    },
    hourColumnWrapper: {
      flex: 1,
      alignItems: 'center',
    },
    wheelContentContainer: {
      paddingTop: 88,
      paddingBottom: 88,
    },
    wheelItemBtn: {
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    wheelItemText: {
      textAlign: 'center',
      color: c.textSecondary,
    },
    wheelItemTextSelected: {
      color: c.textPrimary,
      fontSize: 16.5,
      fontWeight: '700',
    },
    wheelItemTextAdjacent: {
      color: c.textSecondary,
      fontSize: 15,
      fontWeight: '500',
    },
    wheelItemTextDistant: {
      color: c.textDisabled,
      fontSize: 14,
      fontWeight: '400',
    },
    confirmChoiceBtn: {
      height: 52,
      borderRadius: 26,
      backgroundColor: c.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
      marginTop: 20,
      shadowColor: c.brandPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 4,
    },
    confirmChoiceText: {
      color: c.onBrand,
      fontSize: 16.5,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });
}

// Default export for backwards compatibility
export const styles = createStyles({
  colors: colors.dark,
});
