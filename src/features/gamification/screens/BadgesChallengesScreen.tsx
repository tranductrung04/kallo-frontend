import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '@/components/common';
import {
  BellIcon,
  ChevronLeftIcon,
  FlameIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import { ChallengesScreen } from './ChallengesScreen';
import { BadgesScreen } from './BadgesScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'BadgesChallenges'>;

export function BadgesChallengesScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'badges'>(
    route?.params?.initialTab ?? 'challenges'
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar (Unified Game Header with Segmented Tabs) ──────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={22} color={c.textPrimary} />
          </TouchableOpacity>

          <View style={[styles.fireCircle, { backgroundColor: c.brandAction }]}>
            <FlameIcon size={18} color="#FFFFFF" />
          </View>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
            Game
          </AppText>
        </View>

        {/* Segmented Tab Pill: [ Thử thách | Huy hiệu ] */}
        <View style={[styles.headerSegmentedPill, { backgroundColor: c.surfaceHigh }]}>
          <TouchableOpacity
            style={[
              styles.headerSegmentItem,
              activeTab === 'challenges' && [
                styles.headerSegmentItemActive,
                { backgroundColor: c.surfaceMid },
              ],
            ]}
            onPress={() => setActiveTab('challenges')}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelSm"
              color={activeTab === 'challenges' ? c.brandPrimary : c.textSecondary}
              style={activeTab === 'challenges' ? styles.boldText : undefined}
            >
              Thử thách
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.headerSegmentItem,
              activeTab === 'badges' && [
                styles.headerSegmentItemActive,
                { backgroundColor: c.surfaceMid },
              ],
            ]}
            onPress={() => setActiveTab('badges')}
            activeOpacity={0.8}
          >
            <AppText
              variant="labelSm"
              color={activeTab === 'badges' ? c.brandPrimary : c.textSecondary}
              style={activeTab === 'badges' ? styles.boldText : undefined}
            >
              Huy hiệu
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: c.surfaceHigh }]}
            onPress={() => navigation.navigate('FriendRequests')}
            accessibilityRole="button"
            accessibilityLabel="Thông báo"
          >
            <BellIcon size={18} color={c.textSecondary} />
            <View style={[styles.notificationDot, { backgroundColor: c.brandAction }]} />
          </TouchableOpacity>

          <View style={[styles.avatarCircle, { backgroundColor: c.brandPrimary }]}>
            <UserSingleIcon size={15} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Screen Body */}
      {activeTab === 'challenges' ? (
        <ChallengesScreen navigation={navigation} hideTopBar onTabChange={setActiveTab} />
      ) : (
        <BadgesScreen navigation={navigation} hideTopBar onTabChange={setActiveTab} />
      )}
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;

  return StyleSheet.create({
    safe: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
    },
    topBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    fireCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerSegmentedPill: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      padding: 3,
    },
    headerSegmentItem: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 16,
    },
    headerSegmentItemActive: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    notificationDot: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: 3.5,
    },
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 2,
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 18,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
