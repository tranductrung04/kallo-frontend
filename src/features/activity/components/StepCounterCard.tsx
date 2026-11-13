import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';

export function StepCounterCard({
  steps,
  goal = 10000,
  caloriesBurned = 0,
  distanceKm = 0,
}: {
  steps: number;
  goal?: number;
  caloriesBurned?: number;
  distanceKm?: number;
}) {
  const theme = useTheme();
  const progress = goal > 0 ? Math.min(1, steps / goal) : 0;

  return (
    <AppCard style={styles.card} accessibilityLabel="Thẻ theo dõi bước chân">
      <View style={styles.header}>
        <View>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Bước chân hôm nay
          </AppText>
          <View style={styles.stepRow}>
            <AppText variant="display">{formatNumber(steps)}</AppText>
            <AppText variant="caption" color={theme.colors.textMuted} style={styles.goalText}>
              / {formatNumber(goal)} bước
            </AppText>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.colors.primarySurface }]}>
          <AppText variant="caption" color={theme.colors.primary}>
            {Math.round(progress * 100)}%
          </AppText>
        </View>
      </View>

      <ProgressBar value={progress} color={theme.colors.primary} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Quãng đường
          </AppText>
          <AppText variant="heading">{formatNumber(distanceKm || (steps * 0.00075), 1)} km</AppText>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.stat}>
          <AppText variant="caption" color={theme.colors.textMuted}>
            Tiêu hao
          </AppText>
          <AppText variant="heading">{formatNumber(caloriesBurned)} kcal</AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  goalText: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 24,
  },
});

