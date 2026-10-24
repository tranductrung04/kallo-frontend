import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/common';
import { ACTIVITY_OPTIONS, GOAL_OPTIONS, type ActivityLevel, type GoalType } from '../types';
import { ChoicePills } from './ChoicePills';

interface ActivityGoalStepProps {
  activity: ActivityLevel;
  goal: GoalType;
  onActivityChange: (activity: ActivityLevel) => void;
  onGoalChange: (goal: GoalType) => void;
}

export function ActivityGoalStep({
  activity,
  goal,
  onActivityChange,
  onGoalChange,
}: ActivityGoalStepProps) {
  return (
    <View style={styles.section}>
      <AppText variant="heading">Mức độ vận động</AppText>
      <ChoicePills
        options={ACTIVITY_OPTIONS}
        value={activity}
        onChange={(value) => onActivityChange(value as ActivityLevel)}
      />

      <AppText variant="heading">Mục tiêu</AppText>
      <ChoicePills
        options={GOAL_OPTIONS}
        value={goal}
        onChange={(value) => onGoalChange(value as GoalType)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
});
