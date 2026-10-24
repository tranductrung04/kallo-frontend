import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FlameIcon, PlusIcon, SparklesIcon } from '@/components/icons';
import { formatNumber } from '@/features/nutrition/utils';
import { CalorieIntakeGuideModal } from '@/features/nutrition/components';
import { styles } from './ReportOverviewScreen.styles';

export type DayCalorieSectionProps = {
  calories: number;
  goalCalories: number;
  caloriesRemaining: number;
  progressPercent: number;
  onLogFood: () => void;
};

export function DayCalorieSection({
  calories,
  goalCalories,
  caloriesRemaining,
  progressPercent,
  onLogFood,
}: DayCalorieSectionProps) {
  const [guideModalVisible, setGuideModalVisible] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Lượng calo trong ngày</Text>

      {/* Main Calorie Intake Card */}
      <View style={styles.cardSurface}>
        <View style={styles.calorieTopRow}>
          <TouchableOpacity
            onPress={() => setGuideModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Xem hướng dẫn calo nạp vào"
          >
            <Text style={styles.cardLabelText}>Calo nạp vào</Text>
            <View style={styles.calorieValuesRow}>
              <Text style={styles.calorieCurrentText}>{formatNumber(calories)}</Text>
              <Text style={styles.calorieGoalText}>/{formatNumber(goalCalories)} cal</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.logFoodContainer}>
            <Text style={styles.logFoodText}>Ghi món ăn</Text>
            <TouchableOpacity
              onPress={onLogFood}
              style={styles.plusButtonCircle}
              accessibilityRole="button"
              accessibilityLabel="Ghi món ăn"
            >
              <PlusIcon size={16} color="#9E64F7" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar with Flame & Target Marker */}
        <View style={styles.progressBarWrapper}>
          <View style={styles.flameCircleBadge}>
            <FlameIcon size={16} color="#9E64F7" />
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` },
              ]}
            />
            {/* Goal indicator line mark */}
            <View style={styles.progressTargetLine} />
          </View>
        </View>
      </View>

      {/* Kallo Insight / Motivation Card */}
      <View style={[styles.cardSurface, styles.insightCard]}>
        <View style={styles.insightHeaderRow}>
          <SparklesIcon size={18} color="#9E64F7" />
          <Text style={styles.insightTitle}>
            {calories === 0
              ? 'Bạn chưa ghi món ăn hôm nay!'
              : `Đã nạp ${formatNumber(calories)} cal hôm nay!`}
          </Text>
        </View>
        <Text style={styles.insightSubtitle}>
          {calories === 0
            ? 'Bắt đầu log để Kallo theo dõi lượng calo và xu hướng ăn uống của bạn.'
            : `Bạn còn ${formatNumber(caloriesRemaining)} cal để đạt mục tiêu dinh dưỡng.`}
        </Text>
      </View>

      {/* Calorie Intake Guide Modal */}
      <CalorieIntakeGuideModal
        visible={guideModalVisible}
        onClose={() => setGuideModalVisible(false)}
      />
    </View>
  );
}
