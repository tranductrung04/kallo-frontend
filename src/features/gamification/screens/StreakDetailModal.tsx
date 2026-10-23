import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { ChevronLeftIcon, InfoIcon } from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useGamification } from '../GamificationProvider';
import {
  StreakActionCardWidget,
  StreakBottomStatsWidget,
  StreakChallengeWidget,
  StreakHeroWidget,
  StreakWeekWidget,
} from './StreakWidgets';
import { StreakRulesModal } from './StreakRulesModal';

type Props = NativeStackScreenProps<RootStackParamList, 'StreakDetail'>;

export function StreakDetailModal({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [heroHeight, setHeroHeight] = useState<number>(0);
  const [isRulesVisible, setIsRulesVisible] = useState(false);
  const { streak, freezeStreak } = useGamification();

  // Danh sách các ngày trong tuần (T2 -> CN)
  const weekDays = useMemo(
    () => ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    []
  );

  // Chỉ số ngày hôm nay trong tuần (0: T2 ... 6: CN)
  const todayDayIndex = useMemo(() => {
    const day = new Date().getDay();
    return (day + 6) % 7;
  }, []);

  const currentStreak = streak.currentStreak || 0;
  const challengeTargetDays = currentStreak >= 7 ? 14 : currentStreak >= 3 ? 7 : 3;

  const handleInfoPress = () => {
    setIsRulesVisible(true);
  };

  const handleAddMealPress = () => {
    const today = new Date().toISOString().slice(0, 10);
    (navigation as any).navigate('FoodSearch', {
      date: today,
      meal: 'snack',
    });
  };

  const handleShieldPress = () => {
    if (streak.isFrozenToday) {
      Alert.alert(
        'Khiên Kallo đang bật 🛡️',
        'Chuỗi Streak của bạn hôm nay đã được bảo vệ an toàn!'
      );
      return;
    }

    if (streak.freezeDaysRemaining <= 0) {
      Alert.alert(
        'Hết Khiên Kallo',
        'Bạn đã sử dụng hết lượt khiên bảo vệ chuỗi.'
      );
      return;
    }

    Alert.alert(
      'Kích hoạt Khiên Kallo 🛡️',
      `Bạn còn ${streak.freezeDaysRemaining} lượt khiên. Kích hoạt để bảo vệ chuỗi hôm nay ngay cả khi bạn chưa kịp ghi món?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Kích hoạt ngay',
          onPress: () => {
            const ok = freezeStreak();
            if (ok) {
              Alert.alert('Thành công 🎉', 'Chuỗi của bạn hôm nay đã được bảo vệ!');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. Top Hero Card with Background ────────────────────────── */}
        <View
          style={[
            styles.topHeroCard,
            {
              paddingTop: insets.top + 6,
              backgroundColor: currentStreak > 0 ? '#8A5AEB' : '#1D172D',
            },
          ]}
          onLayout={(e) => {
            const h = Math.round(e.nativeEvent.layout.height);
            if (h > 0 && h !== heroHeight) {
              setHeroHeight(h);
            }
          }}
        >
          <Image
            source={currentStreak > 0 ? images.streakActiveBg : images.streakInactiveBg}
            style={[
              styles.topCardBgImage,
              {
                width: screenWidth,
                height: heroHeight > 0 ? heroHeight : Math.round(screenHeight * 0.42),
              },
            ]}
            resizeMode="cover"
          />

          <View style={styles.topHeroContent}>
            {/* Navigation Bar */}
            <View style={styles.navBar}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                accessibilityLabel="Quay lại"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <ChevronLeftIcon size={26} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navButton}
                onPress={handleInfoPress}
                accessibilityRole="button"
                accessibilityLabel="Thông tin quy tắc chuỗi"
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <InfoIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Top Streak Hero Section */}
            <StreakHeroWidget currentStreak={currentStreak} />

            {/* Callout Action Card (streak=0: fooddefault; streak>0: celebration card) */}
            <StreakActionCardWidget
              streak={currentStreak}
              onLogMeal={handleAddMealPress}
            />
          </View>
        </View>

        {/* ── 2. Lower Body on Dark Background ──────────────────────────── */}
        <View style={styles.bodyWrap}>
          {/* Section: Thử thách của bạn */}
          <StreakChallengeWidget
            currentStreak={currentStreak}
            targetDays={challengeTargetDays}
          />

          {/* Section: Mục tiêu chuỗi */}
          <StreakWeekWidget
            currentStreak={currentStreak}
            todayDayIndex={todayDayIndex}
            weekDays={weekDays}
            targetDays={challengeTargetDays}
          />

          {/* Cặp thẻ tóm tắt dưới cùng & Chuỗi tốt nhất */}
          <StreakBottomStatsWidget
            currentStreak={currentStreak}
            longestStreak={streak.longestStreak ?? currentStreak}
            freezeDaysRemaining={streak.freezeDaysRemaining ?? 0}
            onShieldPress={handleShieldPress}
          />
        </View>
      </ScrollView>

      {/* Trang giải thích quy tắc chuỗi ngày khi bấm InfoIcon */}
      <StreakRulesModal
        visible={isRulesVisible}
        onClose={() => setIsRulesVisible(false)}
      />
    </SafeAreaView>
  );
}

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#14111E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topHeroCard: {
    width: '100%',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    paddingHorizontal: 0,
    paddingBottom: 16,
    position: 'relative',
  },
  topHeroContent: {
    width: '100%',
    paddingHorizontal: 16,
  },
  topCardBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyWrap: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
});
