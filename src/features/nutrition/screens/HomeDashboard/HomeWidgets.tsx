// ─── HomeWidgets — các khối lặp lại của Home Dashboard ────────────────────────
// MacroColumn   : 1 cột dinh dưỡng (đạm / đường bột / chất béo)
// ActivityGrid  : lưới 2 × 3 nút hoạt động tập luyện
// WeightChart   : biểu đồ cân nặng (lưới + đường + điểm)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { AppCard, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '../../utils';
import type { HomeDashboardStyles } from './HomeDashboardScreen.styles';
import {
  BicycleIcon,
  MoreActivitiesIcon,
  PickleballIcon,
  RunningIcon,
  ShuttlecockIcon,
  YogaIcon,
  type IconProps,
} from '@/components/icons';

// ─── MacroColumn ──────────────────────────────────────────────────────────────

type MacroColumnProps = {
  styles: HomeDashboardStyles;
  title: string;
  icon: React.ReactNode;
  current: number;
  goal: number;
};

export function MacroColumn({ styles, title, icon, current, goal }: MacroColumnProps) {
  const { colors } = useTheme();
  // ProgressBar tự clamp 0–1; ở đây chỉ cần chặn chia cho 0
  const ratio = goal > 0 ? current / goal : 0;
  const thumbPercent = Math.min(95, Math.max(0, ratio * 100));

  return (
    <View style={styles.macroCol}>
      <View style={styles.macroHeaderRow}>
        {icon}
        <AppText variant="labelMd">{title}</AppText>
      </View>
      <View style={styles.macroBarWrap}>
        <ProgressBar value={ratio} height={6} color={colors.brandAction} />
        <View style={[styles.macroThumb, { left: `${thumbPercent}%` }]} />
      </View>
      <View style={styles.macroValuesRow}>
        <AppText variant="labelLg">{formatNumber(current)}</AppText>
        <AppText variant="bodySm" color={colors.textSecondary}>/ {formatNumber(goal)}g</AppText>
      </View>
    </View>
  );
}

// ─── ActivityGrid ─────────────────────────────────────────────────────────────

type ActivityEntry = {
  label: string;
  Icon: React.ComponentType<IconProps>;
};

const ACTIVITIES: ActivityEntry[] = [
  { label: 'Chạy bộ', Icon: RunningIcon },
  { label: 'Đạp xe', Icon: BicycleIcon },
  { label: 'Cầu lông', Icon: ShuttlecockIcon },
  { label: 'Pickleball', Icon: PickleballIcon },
  { label: 'Yoga', Icon: YogaIcon },
  { label: 'Khác', Icon: MoreActivitiesIcon },
];

const ACTIVITY_ROWS: ActivityEntry[][] = [ACTIVITIES.slice(0, 3), ACTIVITIES.slice(3)];

type ActivityGridProps = {
  styles: HomeDashboardStyles;
  onSelect: (activityLabel: string) => void;
};

export function ActivityGrid({ styles, onSelect }: ActivityGridProps) {
  const { colors } = useTheme();

  return (
    <AppCard padding={0} style={styles.activityGridCard}>
      {ACTIVITY_ROWS.map((row, rowIndex) => (
        <View key={`activity-row-${rowIndex}`} style={styles.activityRow}>
          {row.map(({ label, Icon }) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={() => onSelect(label)}
              style={styles.activityItem}
            >
              <View style={styles.activityCircle}>
                <Icon size={22} color={colors.textPrimary} />
              </View>
              <AppText variant="labelMd" align="center" style={styles.activityLabel}>
                {label}
              </AppText>
            </Pressable>
          ))}
        </View>
      ))}
    </AppCard>
  );
}

// ─── WeightChart ──────────────────────────────────────────────────────────────

const CHART_HEIGHT = 80;
const PLOT_LEFT = 25;
const GRID_ROWS = [15, 30, 45, 60, 75];
const GRID_COL_START = 40;
const GRID_COL_STEP = 30;

type WeightChartProps = {
  width: number;
  weight: number;
};

export function WeightChart({ width, weight }: WeightChartProps) {
  const { colors, typography } = useTheme();
  const plotRight = width - 3;

  // Vạch dọc sinh theo bề rộng thực tế, không hardcode vị trí
  const gridCols: number[] = [];
  for (let x = GRID_COL_START; x < plotRight; x += GRID_COL_STEP) gridCols.push(x);

  return (
    <Svg width={width} height={CHART_HEIGHT}>
      {GRID_ROWS.map((y) => (
        <Line
          key={`h-${y}`}
          x1={PLOT_LEFT}
          y1={y}
          x2={plotRight}
          y2={y}
          stroke={colors.surfaceBorder}
          strokeOpacity={0.7}
          strokeWidth={1}
        />
      ))}
      {gridCols.map((x) => (
        <Line
          key={`v-${x}`}
          x1={x}
          y1={10}
          x2={x}
          y2={75}
          stroke={colors.surfaceBorder}
          strokeOpacity={0.7}
          strokeWidth={1}
        />
      ))}
      <SvgText
        x={14}
        y={64}
        fill={colors.textSecondary}
        fontSize={typography.labelSm.fontSize}
        textAnchor="end"
        fontFamily={typography.labelSm.fontFamily}
      >
        {weight}
      </SvgText>
      <Line x1={PLOT_LEFT} y1={60} x2={plotRight} y2={60} stroke={colors.textPrimary} strokeWidth={1.5} />
      <Circle cx={PLOT_LEFT} cy={60} r={4} stroke={colors.textPrimary} strokeWidth={2} fill={colors.surfaceMid} />
    </Svg>
  );
}
