import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0D0B14',
  },

  // ── Header ──
  headerContainer: {
    backgroundColor: '#0D0B14',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabButtonTextInactive: {
    color: '#7E7998',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 3,
    backgroundColor: '#9E64F7',
    borderRadius: 2,
  },
  headerBorderBottom: {
    height: 1,
    backgroundColor: '#1E192D',
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
    backgroundColor: '#181524',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNavText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  // ── Card Surface ──
  cardSurface: {
    backgroundColor: '#181524',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#262038',
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
    color: '#A5A0B8',
    marginBottom: 4,
  },
  calorieValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  calorieCurrentText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  calorieGoalText: {
    fontSize: 14,
    color: '#A5A0B8',
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
    color: '#C4C0D8',
    fontWeight: '500',
  },
  plusButtonCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2A243D',
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
    backgroundColor: '#2C1F45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#262035',
    borderRadius: 7,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9E64F7',
    borderRadius: 7,
  },
  progressTargetLine: {
    position: 'absolute',
    right: '25%',
    width: 3,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
  },

  // ── Insight Card ──
  insightCard: {
    paddingVertical: 14,
    backgroundColor: '#191526',
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
    color: '#FFFFFF',
  },
  insightSubtitle: {
    fontSize: 13,
    color: '#9B96B0',
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
    color: '#FFFFFF',
    marginBottom: 8,
  },
  macroPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#241E33',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillNumWhite: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pillNumPurple: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E64F7',
  },

  // ── Expand Button ──
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#241E33',
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 16,
    gap: 6,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A59EBD',
  },
  expandedNutrientsContainer: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#252035',
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
    color: '#A59EBD',
  },
  nutrientValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ── Meal Optimization Card ──
  optimizationCard: {
    marginTop: 2,
  },
  optBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#2A1A4A',
  },
  optimizationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  optimizationSubtitle: {
    fontSize: 13,
    color: '#9B96B0',
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
    backgroundColor: '#1C182A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#262038',
  },
  filterPillActive: {
    backgroundColor: '#4B1E85',
    borderColor: '#7C3AED',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A59EBD',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Empty Dashed Box ──
  emptyDashedBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2E2742',
    backgroundColor: '#13101E',
    borderRadius: 18,
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDashedText: {
    fontSize: 13,
    color: '#7E7998',
    marginTop: 12,
  },

  // ── Food Contributors List ──
  contributorsCard: {
    backgroundColor: '#181524',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#262038',
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
    color: '#9E64F7',
    width: 26,
  },
  contribName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  contribItemRight: {
    alignItems: 'flex-end',
    width: 90,
  },
  contribAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A59EBD',
    marginBottom: 4,
  },
  contribMiniTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#262035',
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
    backgroundColor: '#181524',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#262038',
    padding: 14,
    gap: 4,
  },
  weeklyCardLabel: {
    fontSize: 12,
    color: '#7E7998',
  },
  weeklyCardValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  weeklyCardSub: {
    fontSize: 11,
    color: '#7E7998',
  },
});
