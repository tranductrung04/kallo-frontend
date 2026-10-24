import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  ChevronDownIcon,
  DropletIcon,
  LightningIcon,
  SparklesIcon,
  WheatIcon,
} from '@/components/icons';
import { styles } from './ReportOverviewScreen.styles';
import { NutrientComparisonModal } from './NutrientComparisonModal';
import {
  CarbGuideModal,
  FatGuideModal,
  ProteinGuideModal,
} from '@/features/nutrition/components';

export type DayMacroSectionProps = {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
  targetProteinPct: number;
  targetCarbsPct: number;
  targetFatPct: number;
  saltCurrent: number;
  saltGoal: number;
  sugarCurrent: number;
  sugarGoal: number;
  fiberCurrent: number;
  fiberGoal: number;
  waterCurrent: number;
  waterGoal: number;
  hasLogs: boolean;
  calories?: number;
  goalCalories?: number;
  goalProtein?: number;
  goalCarbs?: number;
  goalFat?: number;
  cholesterolCurrent?: number;
};

export function DayMacroSection({
  proteinGrams,
  carbsGrams,
  fatGrams,
  proteinPct,
  carbsPct,
  fatPct,
  targetProteinPct,
  targetCarbsPct,
  targetFatPct,
  saltCurrent,
  saltGoal,
  sugarCurrent,
  sugarGoal,
  fiberCurrent,
  fiberGoal,
  waterCurrent,
  waterGoal,
  hasLogs,
  calories,
  goalCalories,
  goalProtein,
  goalCarbs,
  goalFat,
  cholesterolCurrent,
}: DayMacroSectionProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isProteinModalVisible, setIsProteinModalVisible] = useState<boolean>(false);
  const [isCarbModalVisible, setIsCarbModalVisible] = useState<boolean>(false);
  const [isFatModalVisible, setIsFatModalVisible] = useState<boolean>(false);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Tổng quan dinh dưỡng & đa lượng</Text>

      {/* 3 Macro Columns Card */}
      <View style={styles.cardSurface}>
        <View style={styles.macroColumnsRow}>
          {/* Column 1: Đạm */}
          <TouchableOpacity
            style={styles.macroColumn}
            onPress={() => setIsProteinModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Xem hướng dẫn chất đạm"
          >
            <View style={styles.macroColHeader}>
              <LightningIcon size={13} color="#FF6B6B" />
              <Text style={[styles.macroColTitle, { color: '#FF6B6B' }]}>
                CHẤT ĐẠM
              </Text>
            </View>
            <Text style={styles.macroColValue}>{proteinGrams} g</Text>
            <View style={styles.macroPillBadge}>
              <Text style={styles.pillNumWhite}>{proteinPct}</Text>
              <Text style={styles.pillNumPurple}> / {targetProteinPct}%</Text>
            </View>
          </TouchableOpacity>

          {/* Column 2: Đường bột */}
          <TouchableOpacity
            style={styles.macroColumn}
            onPress={() => setIsCarbModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Xem hướng dẫn đường bột"
          >
            <View style={styles.macroColHeader}>
              <WheatIcon size={14} color="#3B82F6" />
              <Text style={[styles.macroColTitle, { color: '#3B82F6' }]}>
                ĐƯỜNG BỘT
              </Text>
            </View>
            <Text style={styles.macroColValue}>{carbsGrams} g</Text>
            <View style={styles.macroPillBadge}>
              <Text style={styles.pillNumWhite}>{carbsPct}</Text>
              <Text style={styles.pillNumPurple}> / {targetCarbsPct}%</Text>
            </View>
          </TouchableOpacity>

          {/* Column 3: Chất béo */}
          <TouchableOpacity
            style={styles.macroColumn}
            onPress={() => setIsFatModalVisible(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Xem hướng dẫn chất béo"
          >
            <View style={styles.macroColHeader}>
              <DropletIcon size={13} color="#FBBF24" />
              <Text style={[styles.macroColTitle, { color: '#FBBF24' }]}>
                CHẤT BÉO
              </Text>
            </View>
            <Text style={styles.macroColValue}>{fatGrams} g</Text>
            <View style={styles.macroPillBadge}>
              <Text style={styles.pillNumWhite}>{fatPct}</Text>
              <Text style={styles.pillNumPurple}> / {targetFatPct}%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Button: So sánh các chỉ số khác -> Mở bảng so sánh dinh dưỡng */}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={styles.expandButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="So sánh các chỉ số khác"
        >
          <Text style={styles.expandButtonText}>So sánh các chỉ số khác</Text>
          <ChevronDownIcon size={16} color="#A59EBD" />
        </TouchableOpacity>
      </View>

      {/* Meal Optimization Card */}
      <View style={[styles.cardSurface, styles.optimizationCard]}>
        <View style={styles.optBadgeContainer}>
          <SparklesIcon size={14} color="#7C3AED" />
          <Text style={styles.optBadgeText}>Tối ưu bữa ăn</Text>
        </View>

        <Text style={styles.optimizationTitle}>
          {!hasLogs ? 'Hôm nay vẫn chưa có gì' : 'Phân bổ calo bữa ăn'}
        </Text>
        <Text style={styles.optimizationSubtitle}>
          {!hasLogs
            ? 'Thêm món ăn vào nhật ký để Kallo có thể hiểu rõ hơn thói quen ăn uống của bạn.'
            : 'Bữa ăn hôm nay đã phân bổ hợp lý theo mục tiêu calo.'}
        </Text>
      </View>

      {/* Nutrient Comparison Modal (Khuyến nghị vs Tổng) */}
      <NutrientComparisonModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        calories={calories}
        goalCalories={goalCalories}
        carbsGrams={carbsGrams}
        goalCarbs={goalCarbs}
        fiberCurrent={fiberCurrent}
        fiberGoal={fiberGoal}
        sugarCurrent={sugarCurrent}
        sugarGoal={sugarGoal}
        fatGrams={fatGrams}
        goalFat={goalFat}
        proteinGrams={proteinGrams}
        goalProtein={goalProtein}
        cholesterolCurrent={cholesterolCurrent}
        saltCurrent={saltCurrent}
        saltGoal={saltGoal}
        hasLogs={hasLogs}
      />

      {/* Protein Guide Modal (Chất đạm) */}
      <ProteinGuideModal
        visible={isProteinModalVisible}
        onClose={() => setIsProteinModalVisible(false)}
      />

      {/* Carb Guide Modal (Đường bột) */}
      <CarbGuideModal
        visible={isCarbModalVisible}
        onClose={() => setIsCarbModalVisible(false)}
      />

      {/* Fat Guide Modal (Chất béo) */}
      <FatGuideModal
        visible={isFatModalVisible}
        onClose={() => setIsFatModalVisible(false)}
      />
    </View>
  );
}
