import React, { useMemo } from 'react';
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppSwitch, AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  ClipboardCopyIcon,
  ShareNodesIcon,
  ShieldSecurityIcon,
  UserSingleIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type ThemeContextValue } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSettings'>;

export function GameSettingsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { gameSettings, updateGameSettings } = useGamification();

  const handleCopyCode = async () => {
    try {
      await Share.share({
        message: gameSettings.friendCode,
      });
    } catch {
      // Ignored
    }
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Mã kết bạn Kallo của mình là: ${gameSettings.friendCode}. Cùng kết bạn để thi đua sống khỏe nhé!`,
      });
    } catch {
      // Ignored
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <ChevronLeftIcon size={24} color={c.textPrimary} />
          </TouchableOpacity>
          <AppText variant="headlineSm" color={c.textPrimary} numberOfLines={1} style={styles.boldText}>
            Cài đặt trò chơi & Riêng tư
          </AppText>
        </View>

        <View style={[styles.avatarCircle, { backgroundColor: c.brandPrimary }]}>
          <UserSingleIcon size={16} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── 1. Friend Code Bento Card ───────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
            Mã kết bạn cá nhân
          </AppText>
          <AppText variant="bodySm" color={c.textSecondary}>
            Dùng để kết nối trực tiếp với bạn bè
          </AppText>
        </View>

        <View
          style={[
            styles.cardBento,
            {
              backgroundColor: c.surfaceMid,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <AppText variant="caption" color={c.textSecondary} style={{ letterSpacing: 1.2 }}>
            MÃ KẾT BẠN CỦA BẠN (DUY NHẤT)
          </AppText>

          <View style={[styles.codeDisplayBox, { backgroundColor: c.surfaceMuted }]}>
            <AppText variant="headlineXl" color={c.brandPrimary} style={styles.friendCodeText}>
              {gameSettings.friendCode}
            </AppText>
          </View>

          <AppText variant="bodySm" color={c.textSecondary} align="center" style={styles.codeDesc}>
            Chia sẻ mã này để bạn bè có thể tìm kiếm và kết nối ngay cả khi bạn tắt chế độ tìm kiếm công khai.
          </AppText>

          <View style={styles.codeButtonRow}>
            <TouchableOpacity
              style={[
                styles.codeBtn,
                { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder },
              ]}
              onPress={handleCopyCode}
              activeOpacity={0.8}
            >
              <ClipboardCopyIcon size={18} color={c.textPrimary} />
              <AppText variant="labelMd" color={c.textPrimary} style={styles.boldText}>
                Sao chép mã
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.codeBtn,
                { backgroundColor: c.brandAction, borderColor: c.brandAction },
              ]}
              onPress={handleShareCode}
              activeOpacity={0.8}
            >
              <ShareNodesIcon size={18} color="#FFFFFF" />
              <AppText variant="labelMd" color="#FFFFFF" style={styles.boldText}>
                Chia sẻ ngay
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 2. Privacy Settings Bento Card ─────────────────────────── */}
        <View style={styles.sectionHeader}>
          <AppText variant="headlineSm" color={c.textPrimary} style={styles.boldText}>
            Quyền riêng tư bảng xếp hạng
          </AppText>
          <AppText variant="bodySm" color={c.textSecondary}>
            Kiểm soát thông tin hiển thị trên bảng thi đua bạn bè
          </AppText>
        </View>

        <View
          style={[
            styles.cardBento,
            {
              backgroundColor: c.surfaceMid,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          {/* Toggle 1: Discoverable */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.boldText}>
                Cho phép tìm kiếm qua tên
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Người dùng khác có thể tìm thấy bạn qua tên hiển thị
              </AppText>
            </View>
            <AppSwitch
              value={gameSettings.discoverable}
              onValueChange={(val) => updateGameSettings({ discoverable: val })}
              accessibilityLabel="Cho phép tìm kiếm qua tên"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.surfaceBorder }]} />

          {/* Toggle 2: Share Streak */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.boldText}>
                Chia sẻ chuỗi Streak
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hiển thị số ngày duy trì chuỗi trên bảng xếp hạng bạn bè
              </AppText>
            </View>
            <AppSwitch
              value={gameSettings.shareStreak}
              onValueChange={(val) => updateGameSettings({ shareStreak: val })}
              accessibilityLabel="Chia sẻ chuỗi Streak"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.surfaceBorder }]} />

          {/* Toggle 3: Share Points */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.boldText}>
                Chia sẻ điểm Thử thách
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hiển thị điểm tích lũy tuần trên bảng xếp hạng
              </AppText>
            </View>
            <AppSwitch
              value={gameSettings.sharePoints}
              onValueChange={(val) => updateGameSettings({ sharePoints: val })}
              accessibilityLabel="Chia sẻ điểm Thử thách"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.surfaceBorder }]} />

          {/* Toggle 4: Share Steps */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.boldText}>
                Chia sẻ số bước chân tuần
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hiển thị số bước chân đồng bộ trên bảng xếp hạng
              </AppText>
            </View>
            <AppSwitch
              value={gameSettings.shareSteps}
              onValueChange={(val) => updateGameSettings({ shareSteps: val })}
              accessibilityLabel="Chia sẻ số bước chân tuần"
            />
          </View>
        </View>

        {/* ── 3. Security Commitment Bento Card ──────────────────────── */}
        <View
          style={[
            styles.securityCard,
            {
              backgroundColor: c.surfaceMid,
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <View style={[styles.shieldIconBox, { backgroundColor: c.brandSoftTint }]}>
            <ShieldSecurityIcon size={24} color={c.brandPrimary} />
          </View>
          <View style={styles.securityTextWrap}>
            <AppText variant="labelLg" color={c.textPrimary} style={styles.boldText}>
              Cam kết bảo mật dữ liệu sức khỏe
            </AppText>
            <AppText variant="bodySm" color={c.textSecondary} style={styles.securityDesc}>
              Kallo cam kết tuyệt đối không bao giờ chia sẻ chỉ số cân nặng, số đo cơ thể hoặc email cá nhân lên bất kỳ bảng xếp hạng cộng đồng nào.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemeContextValue) {
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';

  return StyleSheet.create({
    safe: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    topBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    avatarCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 2,
      elevation: 2,
    },
    content: {
      padding: 16,
      gap: 14,
      paddingBottom: 40,
    },
    sectionHeader: {
      gap: 2,
      marginTop: 4,
    },
    cardBento: {
      borderRadius: 20,
      padding: 18,
      gap: 14,
      borderWidth: 1,
      shadowColor: isDark ? '#000000' : 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    },
    codeDisplayBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 14,
      marginVertical: 4,
    },
    friendCodeText: {
      letterSpacing: 4,
      fontWeight: '800',
    },
    codeDesc: {
      lineHeight: 20,
      paddingHorizontal: 8,
    },
    codeButtonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 6,
      width: '100%',
    },
    codeBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    settingTextCol: {
      flex: 1,
      paddingRight: 16,
      gap: 3,
    },
    divider: {
      height: 1,
      width: '100%',
    },
    securityCard: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      gap: 14,
      alignItems: 'flex-start',
      shadowColor: isDark ? '#000000' : 'rgba(123, 79, 224, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
      marginTop: 4,
    },
    shieldIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    securityTextWrap: {
      flex: 1,
      gap: 4,
    },
    securityDesc: {
      lineHeight: 20,
    },
    boldText: {
      fontWeight: '700',
    },
  });
}
