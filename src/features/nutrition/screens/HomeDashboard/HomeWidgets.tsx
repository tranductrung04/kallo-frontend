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
  color?: string;
};

export function MacroColumn({ styles, title, icon, current, goal, color }: MacroColumnProps) {
  const { colors } = useTheme();
  // ProgressBar tự clamp 0–1; ở đây chỉ cần chặn chia cho 0
  const ratio = goal > 0 ? current / goal : 0;
  const thumbPercent = Math.min(95, Math.max(0, ratio * 100));

  return (
    <View style={styles.macroCol}>
      <View style={styles.macroHeaderRow}>
        {icon}
        <AppText variant="labelMd" numberOfLines={1} style={styles.macroColTitle}>
          {title}
        </AppText>
      </View>
      <View style={styles.macroBarWrap}>
        <ProgressBar value={ratio} height={8} color={color ?? colors.brandAction} />
        <View style={[styles.macroThumb, { left: `${thumbPercent}%` }]} />
      </View>
      <View style={styles.macroValuesRow}>
        <AppText variant="headlineSm" style={styles.macroCurrentValue}>
          {formatNumber(current)}
        </AppText>
        <AppText variant="bodySm" color={colors.textSecondary} style={styles.macroGoalValue}>
          / {formatNumber(goal)}g
        </AppText>
      </View>
    </View>
  );
}

// ─── ActivityGrid ─────────────────────────────────────────────────────────────

type ActivityEntry = {
  label: string;
  Icon: React.ComponentType<any>;
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
              style={({ pressed }) => [styles.activityItem, pressed && styles.pressedOpacity]}
            >
              <View style={styles.activityCircle}>
                <Icon size={24} color={colors.textPrimary} cutoutColor={colors.surfaceHigh} />
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

const CHART_HEIGHT = 98;
const PLOT_LEFT = 36;
const GRID_TOP = 6;
const GRID_BOTTOM = 96;
const GRID_ROWS = [6, 24, 42, 60, 78, 96];
const WEIGHT_LINE_Y = 78;
const NUM_GRID_COLS = 7;

type WeightChartProps = {
  width: number;
  weight: number;
};

export function WeightChart({ width, weight }: WeightChartProps) {
  const { colors, typography } = useTheme();
  const plotRight = Math.max(PLOT_LEFT + 60, width - 4);
  const colStep = (plotRight - PLOT_LEFT) / NUM_GRID_COLS;

  // 8 vertical grid lines bounding the 7 grid columns
  const gridCols: number[] = [];
  for (let i = 0; i <= NUM_GRID_COLS; i++) {
    gridCols.push(PLOT_LEFT + i * colStep);
  }

  return (
    <Svg width={width} height={CHART_HEIGHT}>
      {/* Horizontal grid lines */}
      {GRID_ROWS.map((y) => (
        <Line
          key={`h-${y}`}
          x1={PLOT_LEFT}
          y1={y}
          x2={plotRight}
          y2={y}
          stroke={colors.surfaceBorder}
          strokeOpacity={0.65}
          strokeWidth={1}
        />
      ))}

      {/* Vertical grid lines */}
      {gridCols.map((x, idx) => (
        <Line
          key={`v-${idx}`}
          x1={x}
          y1={GRID_TOP}
          x2={x}
          y2={GRID_BOTTOM}
          stroke={colors.surfaceBorder}
          strokeOpacity={0.65}
          strokeWidth={1}
        />
      ))}

      {/* Weight label next to the circle */}
      <SvgText
        x={PLOT_LEFT - 8}
        y={WEIGHT_LINE_Y + 4}
        fill={colors.brandSecondary}
        fontSize={12}
        fontWeight="600"
        textAnchor="end"
        fontFamily={typography.labelLg.fontFamily}
      >
        {weight}
      </SvgText>

      {/* Solid white weight baseline across the grid */}
      <Line
        x1={PLOT_LEFT}
        y1={WEIGHT_LINE_Y}
        x2={plotRight}
        y2={WEIGHT_LINE_Y}
        stroke="#FFFFFF"
        strokeWidth={2}
      />

      {/* Open ring indicator at the baseline start */}
      <Circle
        cx={PLOT_LEFT}
        cy={WEIGHT_LINE_Y}
        r={5.5}
        stroke="#FFFFFF"
        strokeWidth={2}
        fill={colors.surfaceMid}
      />
    </Svg>
  );
}
