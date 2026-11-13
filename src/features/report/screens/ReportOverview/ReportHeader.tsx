import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeftIcon } from '@/components/icons';
import { useReportStyles } from './ReportOverviewScreen.styles';

export type ReportHeaderProps = {
  topInset: number;
  activeTab: 'day' | 'week';
  onTabChange: (tab: 'day' | 'week') => void;
  onBack: () => void;
};

export function ReportHeader({
  topInset,
  activeTab,
  onTabChange,
  onBack,
}: ReportHeaderProps) {
  const { theme, styles } = useReportStyles();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(8, topInset) }]}>
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Báo cáo dinh dưỡng</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.tabBarRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'day' && styles.tabButtonActive]}
          onPress={() => onTabChange('day')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'day' }}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'day' ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
            ]}
          >
            Ngày
          </Text>
          {activeTab === 'day' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'week' && styles.tabButtonActive]}
          onPress={() => onTabChange('week')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'week' }}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'week' ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
            ]}
          >
            Tuần
          </Text>
          {activeTab === 'week' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      <View style={styles.headerBorderBottom} />
    </View>
  );
}
