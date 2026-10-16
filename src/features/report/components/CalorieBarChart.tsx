import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { images } from '@/assets/images';
import { AppCard, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { formatNumber } from '@/features/nutrition/utils';
import type { DailyReportItem } from '../types';

export function CalorieBarChart({
  days,
  targetCalories = 2000,
}: {
  days: DailyReportItem[];
  targetCalories?: number;
}) {
  const theme = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(days.length ? days.length - 1 : null);

  const chartHeight = 160;
  const paddingBottom = 24;
  const paddingTop = 20;
  const availableHeight = chartHeight - paddingTop - paddingBottom;

  // Max value calculation
  const maxCal = Math.max(
    targetCalories,
    ...days.map((d) => Math.max(d.caloriesIn, d.caloriesBurned, 100))
  );
  const scaleY = availableHeight / (maxCal * 1.15 || 1);
  const targetY = chartHeight - paddingBottom - targetCalories * scaleY;

  const selectedDay = selectedIndex !== null && days[selectedIndex] ? days[selectedIndex] : null;

  return (
    <AppCard style={styles.card} accessibilityLabel="Biểu đồ calo nạp vào và tiêu hao">
      <ImageBackground
        source={images.reportChartBg}
        style={styles.bgImage}
        imageStyle={styles.bgImageInner}
      >
        <View style={styles.header}>
          <View>
            <AppText variant="heading">Năng lượng Nạp vào / Tiêu hao</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              Đường nét đứt là mức calo mục tiêu ({formatNumber(targetCalories)} kcal)
            </AppText>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.calorieIn }]} />
            <AppText variant="caption">Nạp vào</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.calorieBurned }]} />
            <AppText variant="caption">Tiêu hao</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { borderColor: theme.colors.textMuted }]} />
            <AppText variant="caption">Mục tiêu</AppText>
          </View>
        </View>

        {/* Active Day Tooltip */}
        {selectedDay ? (
          <View style={[styles.tooltipBox, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}>
            <AppText variant="caption" style={{ fontWeight: '700' }}>
              {selectedDay.label}
            </AppText>
            <View style={styles.tooltipRow}>
              <AppText variant="caption" color={theme.colors.calorieIn}>
                Nạp: {formatNumber(selectedDay.caloriesIn)} kcal
              </AppText>
              <AppText variant="caption" color={theme.colors.calorieBurned}>
                Tiêu hao: {formatNumber(selectedDay.caloriesBurned)} kcal
              </AppText>
            </View>
          </View>
        ) : null}

        {/* SVG Chart Area */}
        <View style={styles.chartContainer}>
          <Svg width="100%" height={chartHeight} viewBox={`0 0 ${Math.max(1, days.length * 44)} ${chartHeight}`}>
            {/* Target line */}
            <Line
              x1="0"
              y1={targetY}
              x2={days.length * 44}
              y2={targetY}
              stroke={theme.colors.textMuted}
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Bars for each day */}
            {days.map((d, index) => {
              const xCenter = index * 44 + 22;
              const barWidth = 9;
              const inH = Math.max(3, d.caloriesIn * scaleY);
              const burnedH = Math.max(3, d.caloriesBurned * scaleY);

              const inY = chartHeight - paddingBottom - inH;
              const burnedY = chartHeight - paddingBottom - burnedH;

              const isSelected = selectedIndex === index;

              return (
                <React.Fragment key={d.date}>
                  {/* Selection highlight background */}
                  {isSelected ? (
                    <Rect
                      x={index * 44 + 4}
                      y={0}
                      width={36}
                      height={chartHeight - paddingBottom + 4}
                      fill={theme.colors.primary}
                      opacity={0.08}
                      rx={6}
                    />
                  ) : null}

                  {/* Calories In Bar */}
                  <Rect
                    x={xCenter - barWidth - 1}
                    y={inY}
                    width={barWidth}
                    height={inH}
                    fill={theme.colors.calorieIn}
                    rx={3}
                  />

                  {/* Calories Burned Bar */}
                  <Rect
                    x={xCenter + 1}
                    y={burnedY}
                    width={barWidth}
                    height={burnedH}
                    fill={theme.colors.calorieBurned}
                    rx={3}
                  />

                  {/* Label */}
                  <SvgText
                    x={xCenter}
                    y={chartHeight - 6}
                    fontSize="10"
                    fill={isSelected ? theme.colors.primary : theme.colors.textMuted}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {d.label.slice(0, 3)}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Invisible Touchable Overlay for each column */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
            <View style={styles.touchRow}>
              {days.map((d, i) => (
                <Pressable
                  key={d.date}
                  style={styles.touchCol}
                  onPress={() => setSelectedIndex(i)}
                  accessibilityRole="button"
                  accessibilityLabel={`Xem dữ liệu ${d.label}`}
                />
              ))}
            </View>
          </View>
        </View>
      </ImageBackground>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  bgImage: {
    padding: 16,
    gap: 12,
  },
  bgImageInner: {
    opacity: 0.12,
  },
  header: {
    gap: 2,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLine: {
    width: 14,
    height: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  tooltipBox: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  tooltipRow: {
    flexDirection: 'row',
    gap: 14,
  },
  chartContainer: {
    position: 'relative',
    marginTop: 4,
  },
  touchRow: {
    flexDirection: 'row',
    height: '100%',
  },
  touchCol: {
    flex: 1,
    height: '100%',
  },
});
