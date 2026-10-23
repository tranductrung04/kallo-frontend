import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import type { ActivityItemMeta } from '../extendedActivities';

export type ActivityRowItemProps = {
  item: ActivityItemMeta;
  onPress: (item: ActivityItemMeta) => void;
};

export const ActivityRowItem = React.memo(function ActivityRowItem({
  item,
  onPress,
}: ActivityRowItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item)}
      style={styles.activityRowItem}
      accessibilityRole="button"
      accessibilityLabel={item.name}
    >
      <Text style={styles.activityNameText} numberOfLines={1}>
        {item.name}
      </Text>
      <ChevronRightIcon size={18} color="#C4C0D4" />
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityNameText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    marginRight: 10,
  },
});
