import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/common';
import { useTheme } from '@/theme';
import type { PeriodType } from '../types';

export function PeriodSelector({
  period,
  onChange,
}: {
  period: PeriodType;
  onChange: (period: PeriodType) => void;
}) {
  const theme = useTheme();

  const options: Array<{ key: PeriodType; label: string }> = [
    { key: 'day', label: 'Ngày' },
    { key: 'week', label: 'Tuần' },
    { key: 'month', label: 'Tháng' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
      {options.map((opt) => {
        const isSelected = opt.key === period;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="button"
            accessibilityLabel={`Chọn kỳ ${opt.label}`}
            style={[
              styles.option,
              isSelected && [styles.selectedOption, { backgroundColor: theme.colors.surface }],
            ]}
          >
            <AppText
              variant="caption"
              color={isSelected ? theme.colors.primary : theme.colors.textMuted}
              style={{ fontWeight: isSelected ? '700' : '500' }}
            >
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  selectedOption: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
