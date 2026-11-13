import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '@/components/common';
import {
  CloseXIcon,
  FlameIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
} from '@/components/icons';
import { useTheme } from '@/theme';
import { useGamification } from '../GamificationProvider';

export function GameEventToast() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const navigation = useNavigation<any>();
  const { activeToast, dismissToast } = useGamification();

  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeToast) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: insets.top + 8,
          useNativeDriver: true,
          bounciness: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      slideAnim.setValue(-120);
      opacityAnim.setValue(0);
    }
  }, [activeToast, insets.top]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dismissToast();
    });
  };

  const handlePress = () => {
    if (!activeToast) return;
    const type = activeToast.type;
    handleDismiss();

    if (type === 'BADGE_EARNED') {
      navigation.navigate('BadgesChallenges');
    } else if (type === 'CHALLENGE_COMPLETED') {
      const challengeId = activeToast.payload?.challengeId as string;
      if (challengeId) {
        navigation.navigate('ChallengeDetail', { challengeId });
      } else {
        navigation.navigate('BadgesChallenges');
      }
    } else if (type === 'STREAK_UPDATED') {
      navigation.navigate('StreakDetail');
    } else if (type === 'FRIEND_REQUEST_RECEIVED') {
      navigation.navigate('FriendRequests');
    } else if (type === 'FRIEND_REQUEST_ACCEPTED') {
      navigation.navigate('FriendsLeaderboard');
    }
  };

  if (!activeToast) return null;

  const renderIcon = () => {
    switch (activeToast.type) {
      case 'BADGE_EARNED':
        return <TrophyIcon size={24} color={c.brandPrimary} />;
      case 'CHALLENGE_COMPLETED':
        return <SparklesIcon size={24} color={c.vipStreak} />;
      case 'STREAK_UPDATED':
        return <FlameIcon size={24} color={c.macroProtein} />;
      case 'FRIEND_REQUEST_RECEIVED':
      case 'FRIEND_REQUEST_ACCEPTED':
        return <UsersIcon size={24} color={c.brandPrimary} />;
      default:
        return <SparklesIcon size={24} color={c.brandPrimary} />;
    }
  };

  const renderContent = () => {
    const payload = activeToast.payload ?? {};
    switch (activeToast.type) {
      case 'BADGE_EARNED':
        return {
          title: 'Huy hiệu mới!',
          message: `Bạn vừa mở khóa: ${payload.badgeTitle ?? 'Huy hiệu vinh danh'}`,
        };
      case 'CHALLENGE_COMPLETED':
        return {
          title: 'Thử thách hoàn thành!',
          message: `${payload.challengeTitle ?? 'Thử thách sức khỏe'} (+${payload.points ?? 100}đ)`,
        };
      case 'STREAK_UPDATED':
        return {
          title: 'Chuỗi Streak cập nhật!',
          message: `Chúc mừng bạn đạt ${payload.currentStreak ?? 1} ngày liên tiếp!`,
        };
      case 'FRIEND_REQUEST_RECEIVED':
        return {
          title: 'Lời mời kết bạn',
          message: `${(payload.user as any)?.displayName ?? 'Một người dùng'} vừa gửi lời mời kết bạn!`,
        };
      case 'FRIEND_REQUEST_ACCEPTED':
        return {
          title: 'Đã chấp nhận kết bạn!',
          message: `${(payload.user as any)?.displayName ?? 'Bạn bè'} đã chấp nhận lời mời của bạn.`,
        };
      default:
        return {
          title: 'Thông báo trò chơi',
          message: 'Bạn có hoạt động mới trong Kallo!',
        };
    }
  };

  const info = renderContent();

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={[
          styles.toastCard,
          {
            backgroundColor: c.surfaceMid,
            borderColor: c.brandPrimary,
          },
        ]}
        activeOpacity={0.9}
        onPress={handlePress}
      >
        <View style={[styles.iconBox, { backgroundColor: c.brandSoftTint }]}>
          {renderIcon()}
        </View>

        <View style={styles.textBox}>
          <AppText variant="headlineSm" color={c.brandPrimary} numberOfLines={1}>
            {info.title}
          </AppText>
          <AppText variant="bodySm" color={c.textSecondary} numberOfLines={1}>
            {info.message}
          </AppText>
        </View>

        <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <CloseXIcon size={16} color={c.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#9E64F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  textBox: {
    flex: 1,
    gap: 2,
  },
});

