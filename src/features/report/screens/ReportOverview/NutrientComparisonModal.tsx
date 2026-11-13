import React from 'react';
import {
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';

export type NutrientComparisonModalProps = {
  visible: boolean;
  onClose: () => void;
  calories?: number;
  goalCalories?: number;
  carbsGrams?: number;
  goalCarbs?: number;
  fiberCurrent?: number;
  fiberGoal?: number;
  sugarCurrent?: number;
  sugarGoal?: number;
  fatGrams?: number;
  goalFat?: number;
  proteinGrams?: number;
  goalProtein?: number;
  cholesterolCurrent?: number;
  saltCurrent?: number;
  saltGoal?: number;
  hasLogs?: boolean;
};

type NutrientRow = {
  id: string;
  name: string;
  current: string;
  target: string;
  isMain?: boolean;
  isSub?: boolean;
};

type NutrientSection = {
  title?: string;
  rows: NutrientRow[];
};

export function NutrientComparisonModal({
  visible,
  onClose,
  calories = 0,
  goalCalories = 1794,
  carbsGrams = 0,
  goalCarbs = 224,
  fiberCurrent = 0,
  fiberGoal = 25,
  sugarCurrent = 0,
  sugarGoal = 45,
  fatGrams = 0,
  goalFat = 60,
  proteinGrams = 0,
  goalProtein = 90,
  cholesterolCurrent = 0,
  saltCurrent = 0,
  saltGoal = 5,
  hasLogs = false,
}: NutrientComparisonModalProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;

  // Helper to format current logged value or show '-'
  const formatVal = (val: number, unit: string) => {
    if (!hasLogs || val <= 0) return '-';
    return `${formatNumber(Math.round(val))} ${unit}`;
  };

  // Sections matching the screenshot exactly
  const sections: NutrientSection[] = [
    {
      rows: [
        {
          id: 'energy',
          name: 'Năng lượng',
          current: formatVal(calories, 'cal'),
          target: `${formatNumber(Math.round(goalCalories))} cal`,
          isMain: true,
        },
        {
          id: 'carbs',
          name: 'Đường bột (carb)',
          current: formatVal(carbsGrams, 'g'),
          target: `${formatNumber(Math.round(goalCarbs))} g`,
          isMain: true,
        },
        {
          id: 'fiber',
          name: 'Chất xơ',
          current: formatVal(fiberCurrent, 'g'),
          target: `${formatNumber(Math.round(fiberGoal))} g`,
          isSub: true,
        },
        {
          id: 'sugar',
          name: 'Đường',
          current: formatVal(sugarCurrent, 'g'),
          target: `${formatNumber(Math.round(sugarGoal))} g`,
          isSub: true,
        },
        {
          id: 'fat',
          name: 'Chất béo (fat)',
          current: formatVal(fatGrams, 'g'),
          target: `${formatNumber(Math.round(goalFat))} g`,
          isMain: true,
        },
        {
          id: 'protein',
          name: 'Chất đạm (protein)',
          current: formatVal(proteinGrams, 'g'),
          target: `${formatNumber(Math.round(goalProtein))} g`,
          isMain: true,
        },
        {
          id: 'cholesterol',
          name: 'Cholesterol',
          current: formatVal(cholesterolCurrent, 'mg'),
          target: '299 mg',
          isMain: true,
        },
        {
          id: 'salt',
          name: 'Muối',
          current: formatVal(saltCurrent, 'g'),
          target: `${formatNumber(Math.round(saltGoal))} g`,
          isMain: true,
        },
      ],
    },
    {
      title: 'Vitamin',
      rows: [
        { id: 'vit-a', name: 'Vitamin A', current: '-', target: '850 mcg' },
        { id: 'vit-b1', name: 'Vitamin B1', current: '-', target: '1,3 mg' },
        { id: 'vit-b12', name: 'Vitamin B12', current: '-', target: '2,4 mcg' },
        { id: 'vit-b2', name: 'Vitamin B2', current: '-', target: '1,5 mg' },
        { id: 'vit-b5', name: 'Vitamin B5', current: '-', target: '5 mg' },
        { id: 'vit-b6', name: 'Vitamin B6', current: '-', target: '1,3 mg' },
        { id: 'vit-b9', name: 'Vitamin B9', current: '-', target: '400 mcg' },
        { id: 'vit-c', name: 'Vitamin C', current: '-', target: '100 mg' },
        { id: 'vit-d', name: 'Vitamin D', current: '-', target: '15 mcg' },
        { id: 'vit-e', name: 'Vitamin E', current: '-', target: '6,5 mg' },
        { id: 'vit-h', name: 'Vitamin H', current: '-', target: '30 mcg' },
        { id: 'vit-k', name: 'Vitamin K', current: '-', target: '150 mcg' },
        { id: 'vit-pp', name: 'Vitamin PP', current: '-', target: '16 mg' },
      ],
    },
    {
      title: 'Khoáng chất',
      rows: [
        { id: 'min-alpha-caroten', name: 'Alpha caroten', current: '-', target: '-' },
        { id: 'min-betacarotene', name: 'Betacarotene', current: '-', target: '-' },
        { id: 'min-canxi', name: 'Canxi', current: '-', target: '800 mg' },
        { id: 'min-dong', name: 'Đồng', current: '-', target: '900 mcg' },
        { id: 'min-folat', name: 'Folat', current: '-', target: '400 mcg' },
        { id: 'min-iod', name: 'Iod', current: '-', target: '150 mg' },
        { id: 'min-sat', name: 'Sắt', current: '-', target: '7,9 mg' },
        { id: 'min-lycopen', name: 'Lycopen', current: '-', target: '-' },
        { id: 'min-magie', name: 'Magie', current: '-', target: '340 mg' },
        { id: 'min-mangan', name: 'Mangan', current: '-', target: '2,3 mg' },
        { id: 'min-phot-pho', name: 'Phốt pho', current: '-', target: '700 mg' },
        { id: 'min-kali', name: 'Kali', current: '-', target: '4.000 mg' },
        { id: 'min-selen', name: 'Selen', current: '-', target: '34 mcg' },
        { id: 'min-kem', name: 'Kẽm', current: '-', target: '10 mg' },
      ],
    },
  ];

  // PanResponder to allow pulling down on the handle to dismiss
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        onClose();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheetContainer, { backgroundColor: c.surfaceMid, borderColor: c.surfaceBorder }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Grab Handle area for dragging down or clicking to close */}
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
              accessibilityRole="button"
              accessibilityLabel="Đóng bảng chỉ số"
            >
              <View style={[styles.dragHandle, { backgroundColor: c.surfaceBorder }]} />
            </TouchableOpacity>
          </View>

          {/* Table Header: Tổng | Mục tiêu / Khuyến nghị */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeftSpacer} />
            <Text style={[styles.headerColTotal, { color: c.textSecondary }]}>Tổng</Text>
            <View style={styles.headerColGoalWrapper}>
              <Text style={[styles.headerColGoalLine, { color: c.textSecondary }]}>Mục tiêu/</Text>
              <Text style={[styles.headerColGoalLine, { color: c.textSecondary }]}>Khuyến nghị</Text>
            </View>
          </View>

          {/* Nutrients List */}
          <ScrollView
            style={styles.scrollList}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(30, insets.bottom + 20) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {sections.map((section, secIdx) => (
              <View key={section.title || `section-${secIdx}`}>
                {section.title ? (
                  <Text style={[styles.sectionHeaderTitle, { color: c.textPrimary }]}>{section.title}</Text>
                ) : null}

                {section.rows.map((row) => {
                  const isDashCurrent = row.current === '-';
                  const isDashTarget = row.target === '-';

                  return (
                    <View key={row.id} style={[styles.dataRow, row.isSub && styles.subRow]}>
                      {/* Name / Label */}
                      <View style={styles.nameCol}>
                        <Text
                          style={[
                            styles.rowNameText,
                            { color: c.textSecondary },
                            row.isMain && [styles.rowNameMain, { color: c.textPrimary }],
                            row.isSub && [styles.rowNameSub, { color: c.textSecondary }],
                          ]}
                          numberOfLines={1}
                        >
                          {row.name}
                        </Text>
                      </View>

                      {/* Current (Tổng) */}
                      <Text
                        style={[
                          styles.colTotalValue,
                          { color: c.textPrimary },
                          isDashCurrent && [styles.colDashValue, { color: c.textDisabled }],
                        ]}
                      >
                        {row.current}
                      </Text>

                      {/* Target (Mục tiêu / Khuyến nghị) */}
                      <Text
                        style={[
                          styles.colGoalValue,
                          { color: c.textPrimary },
                          isDashTarget && [styles.colDashValue, { color: c.textDisabled }],
                        ]}
                      >
                        {row.target}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 4, 10, 0.72)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    height: '87%',
    backgroundColor: '#191527',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#2D2743',
    paddingTop: 8,
  },
  handleArea: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 48,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#4B4265',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 14,
  },
  headerLeftSpacer: {
    flex: 1,
  },
  headerColTotal: {
    width: 76,
    textAlign: 'center',
    color: '#B5ADC7',
    fontSize: 13,
    fontWeight: '600',
    paddingBottom: 2,
  },
  headerColGoalWrapper: {
    width: 104,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  headerColGoalLine: {
    textAlign: 'right',
    color: '#B5ADC7',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subRow: {
    paddingVertical: 8,
  },
  nameCol: {
    flex: 1,
    paddingRight: 8,
  },
  rowNameText: {
    color: '#DDD7E8',
    fontSize: 14,
    fontWeight: '500',
  },
  rowNameMain: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  rowNameSub: {
    color: '#C5BCCF',
    fontSize: 14,
    fontWeight: '400',
    paddingLeft: 16,
  },
  colTotalValue: {
    width: 76,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  colGoalValue: {
    width: 104,
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  colDashValue: {
    color: '#8E87A3',
    fontWeight: '500',
  },
});
