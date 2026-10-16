import React, { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppCard, AppInput, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { todayKey } from '@/features/nutrition/utils';
import { ACTIVITY_CATALOG, findActivityMeta } from '../catalog';
import { ActivityItem, StepCounterCard } from '../components';
import { calculateCaloriesBurned } from '../utils';
import { useActivity } from '../ActivityProvider';
import type { ActivityType } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ActivityTracker'>;

const DURATION_PRESETS = [15, 30, 45, 60];

export function ActivityTrackerScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { addActivityLog, deleteActivityLog, getActivitiesForDate, getTotalStepsForDate, getTotalCaloriesBurnedForDate } =
    useActivity();

  const selectedDate = route.params?.date || todayKey();
  const activities = getActivitiesForDate(selectedDate);
  const totalSteps = getTotalStepsForDate(selectedDate);
  const totalCalories = getTotalCaloriesBurnedForDate(selectedDate);

  const [selectedType, setSelectedType] = useState<ActivityType>('running');
  const [durationStr, setDurationStr] = useState('30');
  const [distanceStr, setDistanceStr] = useState('');
  const [showForm, setShowForm] = useState(false);

  const currentMeta = findActivityMeta(selectedType);
  const durationNum = parseInt(durationStr, 10) || 0;
  const userWeight = 65; // kg
  const estimatedCalories = calculateCaloriesBurned(currentMeta.met, userWeight, durationNum);

  const handleSaveActivity = () => {
    if (durationNum <= 0) return;
    const distanceKm = distanceStr ? parseFloat(distanceStr) : undefined;

    addActivityLog({
      date: selectedDate,
      type: selectedType,
      name: currentMeta.name,
      durationMinutes: durationNum,
      distanceKm: Number.isFinite(distanceKm) ? distanceKm : undefined,
      caloriesBurned: estimatedCalories,
      source: 'MANUAL',
    });

    setDurationStr('30');
    setDistanceStr('');
    setShowForm(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <AppText variant="title">Vận động & Thể thao</AppText>
          <AppText color={theme.colors.textMuted}>
            Theo dõi bài tập và bước chân để cân đối thâm hụt calo
          </AppText>
        </View>

        <StepCounterCard
          steps={totalSteps}
          caloriesBurned={totalCalories}
          distanceKm={totalSteps * 0.00075}
        />

        <View style={styles.quickNavRow}>
          <AppButton
            label="Đồng bộ Sức khỏe"
            variant="outline"
            onPress={() => navigation.navigate('HealthSync')}
            style={styles.navButton}
          />
          <AppButton
            label="Chỉ số Vòng eo/Mông"
            variant="outline"
            onPress={() => navigation.navigate('BodyMetric')}
            style={styles.navButton}
          />
        </View>

        {showForm ? (
          <AppCard style={styles.formCard}>
            <View style={styles.formHeader}>
              <AppText variant="heading">Ghi nhận bài tập</AppText>
              <Pressable onPress={() => setShowForm(false)} accessibilityLabel="Đóng biểu mẫu">
                <AppText color={theme.colors.textMuted}>✕</AppText>
              </Pressable>
            </View>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Chọn loại vận động (MET chuẩn):
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeSelector}>
              {ACTIVITY_CATALOG.map((item) => {
                const isSelected = item.type === selectedType;
                return (
                  <Pressable
                    key={item.type}
                    onPress={() => setSelectedType(item.type)}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceMuted,
                        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText>{item.icon}</AppText>
                    <AppText
                      variant="caption"
                      color={isSelected ? '#FFFFFF' : theme.colors.text}
                      style={{ fontWeight: isSelected ? '700' : '400' }}
                    >
                      {item.name}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.durationSection}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Thời lượng (phút):
              </AppText>
              <View style={styles.presetRow}>
                {DURATION_PRESETS.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setDurationStr(String(p))}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: durationNum === p ? theme.colors.primarySurface : theme.colors.surfaceMuted,
                        borderColor: durationNum === p ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={durationNum === p ? theme.colors.primary : theme.colors.text}
                    >
                      {p}p
                    </AppText>
                  </Pressable>
                ))}
              </View>
              <AppInput
                value={durationStr}
                onChangeText={setDurationStr}
                keyboardType="numeric"
                placeholder="Nhập số phút"
              />
            </View>

            {['walking', 'running', 'cycling'].includes(selectedType) ? (
              <AppInput
                label="Quãng đường (km - tùy chọn)"
                value={distanceStr}
                onChangeText={setDistanceStr}
                keyboardType="decimal-pad"
                placeholder="Ví dụ: 3.5"
              />
            ) : null}

            <View style={[styles.previewBox, { backgroundColor: theme.colors.primarySurface }]}>
              <AppText variant="caption" color={theme.colors.textMuted}>
                Ước tính tiêu hao (MET {currentMeta.met}):
              </AppText>
              <AppText variant="heading" color={theme.colors.primary}>
                🔥 {estimatedCalories} kcal
              </AppText>
            </View>

            <AppButton
              label="Lưu bài tập"
              onPress={handleSaveActivity}
              disabled={durationNum <= 0}
            />
          </AppCard>
        ) : (
          <AppButton
            label="＋ Thêm hoạt động tập luyện"
            onPress={() => setShowForm(true)}
          />
        )}

        <View style={styles.listSection}>
          <AppText variant="heading">Bài tập đã ghi hôm nay ({activities.length})</AppText>
          {activities.length === 0 ? (
            <AppCard style={styles.emptyCard}>
              <AppText align="center" color={theme.colors.textMuted}>
                Chưa có bài tập nào hôm nay. Hãy ghi lại để tính năng lượng tiêu hao!
              </AppText>
            </AppCard>
          ) : (
            activities.map((item) => (
              <ActivityItem key={item.id} log={item} onDelete={deleteActivityLog} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  header: { gap: 4 },
  quickNavRow: { flexDirection: 'row', gap: 10 },
  navButton: { flex: 1 },
  formCard: { gap: 14 },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeSelector: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  durationSection: { gap: 8 },
  presetRow: { flexDirection: 'row', gap: 8 },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  previewBox: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listSection: { gap: 10, marginTop: 8 },
  emptyCard: { padding: 20, alignItems: 'center' },
});
