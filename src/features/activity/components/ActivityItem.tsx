import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppCard, AppText } from '@/components/common';
import { CloseXIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { ActivityTypeIcon } from './ActivityTypeIcon';
import { findActivityMeta } from '../catalog';
import type { ActivityLog } from '../types';

export function ActivityItem({
  log,
  onDelete,
}: {
  log: ActivityLog;
  onDelete?: (id: string) => void;
}) {
  const theme = useTheme();
  const meta = findActivityMeta(log.type);

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: theme.colors.primarySurface }]}>
          <ActivityTypeIcon type={log.type} size={22} color={theme.colors.brandPrimary} />
        </View>

        <View style={styles.details}>
          <AppText variant="heading">{log.name}</AppText>
          <View style={styles.subRow}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {log.durationMinutes} phút
            </AppText>
            {log.distanceKm ? (
              <>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  •
                </AppText>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  {log.distanceKm} km
                </AppText>
              </>
            ) : null}
            <AppText variant="caption" color={theme.colors.textMuted}>
              •
            </AppText>
            <AppText variant="caption" color={theme.colors.calorieBurned}>
              {log.caloriesBurned} kcal
            </AppText>
          </View>
        </View>

        {onDelete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Xoá ${log.name}`}
            onPress={() => onDelete(log.id)}
            style={styles.deleteButton}
          >
            <CloseXIcon size={14} color={theme.colors.danger} />
          </Pressable>
        ) : null}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 3,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deleteButton: {
    padding: 8,
  },
});
