import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import type { ActivityItemMeta } from '../extendedActivities';
import { getSportImageSource } from '../sportImages';

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
      <View style={styles.leftRow}>
        <Image
          source={getSportImageSource(item.id, item.name)}
          style={[styles.activityThumb, { backgroundColor: c.surfaceMid }]}
          resizeMode="cover"
        />
        <Text style={[styles.activityNameText, { color: c.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <ChevronRightIcon size={18} color={c.textSecondary} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  activityRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  activityThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 14,
  },
  activityNameText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});
