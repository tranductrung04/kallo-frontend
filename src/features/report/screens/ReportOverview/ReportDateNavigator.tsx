import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { useReportStyles } from './ReportOverviewScreen.styles';

export type ReportDateNavigatorProps = {
  dateLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

export function ReportDateNavigator({
  dateLabel,
  onPrev,
  onNext,
}: ReportDateNavigatorProps) {
  const { theme, styles } = useReportStyles();

  return (
    <View style={styles.dateNavigatorContainer}>
      <TouchableOpacity
        onPress={onPrev}
        style={styles.dateNavChevron}
        accessibilityLabel="Ngày trước"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronLeftIcon size={18} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Text style={styles.dateNavText}>{dateLabel}</Text>

      <TouchableOpacity
        onPress={onNext}
        style={styles.dateNavChevron}
        accessibilityLabel="Ngày sau"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronRightIcon size={18} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}
