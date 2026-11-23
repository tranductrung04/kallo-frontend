import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ChevronLeftIcon, ClockIcon, FlameIcon, PlusIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { todayKey } from '@/features/nutrition/utils';
import { useActivity } from '../ActivityProvider';
import type { ActivityLog } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutLog'>;

function formatDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function getRelativeDateLabel(dateStr: string): string {
  const today = todayKey();
  if (dateStr === today) return 'Hôm nay';

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
  if (dateStr === yesterdayStr) return 'Hôm qua';

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return dateStr;
}

function getMonthYearHeader(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length >= 2) {
      const monthNum = parseInt(parts[1], 10);
      const yearNum = parts[0];
      return `tháng ${monthNum} năm ${yearNum}`;
    }
  } catch { }
  return 'tháng 11 năm 2026';
}

export function WorkoutLogScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';
  const { state: activityState } = useActivity();

  // 100% real activity logs from ActivityProvider
  const logs = useMemo<ActivityLog[]>(() => {
    if (!activityState.activityLogs || activityState.activityLogs.length === 0) {
      return [];
    }
    return [...activityState.activityLogs].sort((a, b) => {
      const timeA = a.timestamp || a.date;
      const timeB = b.timestamp || b.date;
      return timeB.localeCompare(timeA);
    });
  }, [activityState.activityLogs]);

  // Group logs by Month
  const groupedSections = useMemo(() => {
    const groups: { title: string; data: ActivityLog[] }[] = [];
    const map = new Map<string, ActivityLog[]>();

    logs.forEach((log) => {
      const header = getMonthYearHeader(log.date);
      if (!map.has(header)) {
        map.set(header, []);
      }
      map.get(header)!.push(log);
    });

    map.forEach((data, title) => {
      groups.push({ title, data });
    });

    return groups;
  }, [logs]);

  // Theme-aware styles
  const containerBg = isDark ? '#100C1A' : c.canvasBase;
  const headerBg = isDark ? '#100C1A' : c.surfaceMid;
  const headerBorderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : c.surfaceBorder;
  const headerTextColor = isDark ? '#FFFFFF' : c.textPrimary;
  const backIconColor = isDark ? '#FFFFFF' : c.textPrimary;

  const tipBannerBg = isDark ? '#0D271D' : '#ECFDF5';
  const tipBannerBorder = isDark ? 'rgba(52, 211, 153, 0.2)' : '#A7F3D0';
  const tipTextColor = isDark ? '#4ADE80' : '#065F46';

  const sectionTitleColor = isDark ? '#FFFFFF' : c.textPrimary;

  const cardBg = isDark ? '#1C162E' : c.surfaceMid;
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.06)' : c.surfaceBorder;
  const cardTitleColor = isDark ? '#FFFFFF' : c.textPrimary;
  const cardSubColor = isDark ? '#A79BBF' : c.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: containerBg, paddingTop: Math.max(8, insets.top) }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={headerBg}
      />

      {/* ── Header ────────────────────────────────────────── */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: headerBg,
            borderBottomColor: headerBorderColor,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <ChevronLeftIcon size={24} color={backIconColor} strokeWidth={2.2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: headerTextColor }]}>
          Nhật ký luyện tập
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(24, insets.bottom + 16) },
        ]}
      >
        {/* ── Tip Banner ────────────────────────────────────── */}
        <View
          style={[
            styles.tipBanner,
            {
              backgroundColor: tipBannerBg,
              borderColor: tipBannerBorder,
            },
          ]}
        >
          <Text style={[styles.tipText, { color: tipTextColor }]}>
            👉 Lượng calo bạn đốt qua tập luyện sẽ không ảnh hưởng vào lượng calo mà bạn đã ăn.
          </Text>
        </View>

        {/* ── Empty State khi chưa có hoạt động nào ──────────── */}
        {logs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: isDark ? '#1C162E' : c.surfaceHigh },
              ]}
            >
              <FlameIcon size={36} color={c.brandPrimary} />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: isDark ? '#FFFFFF' : c.textPrimary },
              ]}
            >
              Chưa có hoạt động luyện tập
            </Text>

            <Text
              style={[
                styles.emptySubtitle,
                { color: isDark ? '#8A849F' : c.textSecondary },
              ]}
            >
              Các buổi tập bạn ghi nhận hoặc tự động đồng bộ từ Health Connect sẽ được lưu trữ tại đây.
            </Text>

            <TouchableOpacity
              style={[styles.addActivityBtn, { backgroundColor: c.brandPrimary }]}
              onPress={() => navigation.navigate('AddActivity')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Thêm hoạt động"
            >
              <PlusIcon size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.addActivityBtnText}>Thêm hoạt động</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Grouped Activity List ──────────────────────────── */
          groupedSections.map((section) => (
            <View key={section.title} style={styles.sectionContainer}>
              <Text
                style={[
                  styles.monthSectionTitle,
                  { color: sectionTitleColor },
                ]}
              >
                {section.title}
              </Text>

              {section.data.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.workoutCard,
                    {
                      backgroundColor: cardBg,
                      borderColor: cardBorderColor,
                    },
                  ]}
                >
                  {/* Row 1: Activity Name & Relative Date */}
                  <View style={styles.cardHeaderRow}>
                    <Text
                      style={[
                        styles.activityNameText,
                        { color: cardTitleColor },
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.activityDateLabel,
                        { color: cardSubColor },
                      ]}
                    >
                      {getRelativeDateLabel(item.date)}
                    </Text>
                  </View>

                  {/* Row 2: Calories & Duration */}
                  <View style={styles.cardMetricsRow}>
                    <View style={styles.metricItem}>
                      <FlameIcon size={16} color="#FB923C" />
                      <Text
                        style={[
                          styles.metricValueText,
                          { color: cardSubColor },
                        ]}
                      >
                        {item.caloriesBurned} cal
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <ClockIcon size={15} color={cardSubColor} />
                      <Text
                        style={[
                          styles.metricValueText,
                          { color: cardSubColor },
                        ]}
                      >
                        {formatDuration(item.durationMinutes)} phút
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingTop: 16,
  },
  tipBanner: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  tipText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  monthSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  workoutCard: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityNameText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    flex: 1,
    marginRight: 10,
  },
  activityDateLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  cardMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricValueText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'PlusJakartaSans_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  addActivityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addActivityBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_700Bold',
  },
});
