import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import type { ActivityItemMeta } from '../extendedActivities';

export type ActivityRowItemProps = {
  item: ActivityItemMeta;
  onPress: (item: ActivityItemMeta) => void;
};

export const ActivityRowItem = React.memo(function ActivityRowItem({
  item,
  onPress,
}: ActivityRowItemProps) {
  const { colors: c } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      style={[styles.activityRowItem, { borderBottomColor: c.surfaceBorder }]}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <Text style={[styles.activityNameText, { color: c.textPrimary }]} numberOfLines={1}>
        {item.name}
      </Text>
      <ChevronRightIcon size={18} color={c.textSecondary} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  activityRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityNameText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginRight: 10,
  },
});
