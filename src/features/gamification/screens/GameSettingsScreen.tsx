import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppCard, AppText } from '@/components/common';
import {
  ChevronLeftIcon,
  ClipboardCopyIcon,
  ShareNodesIcon,
  ShieldSecurityIcon,
} from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { useGamification } from '../GamificationProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSettings'>;

export function GameSettingsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { colors: c } = theme;
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
    <SafeAreaView style={[styles.safe, { backgroundColor: c.canvasBase }]}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: c.surfaceBorder }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeftIcon size={24} color={c.textPrimary} />
        </TouchableOpacity>
        <AppText variant="headlineSm" color={c.textPrimary} style={styles.topBarTitle}>
          Cài đặt trò chơi & Riêng tư
        </AppText>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ── 1. Friend Code Section ─────────────────────────────────── */}
        <AppText variant="headlineSm" color={c.textPrimary}>
          Mã kết bạn cá nhân
        </AppText>

        <AppCard style={styles.codeCard}>
          <AppText variant="caption" color={c.textSecondary}>
            MÃ KẾT BẠN CỦA BẠN (DUY NHẤT)
          </AppText>
          <AppText variant="headlineXl" color={c.brandPrimary} style={styles.friendCodeText}>
            {gameSettings.friendCode}
          </AppText>

          <AppText variant="bodySm" color={c.textSecondary} align="center" style={styles.codeDesc}>
            Chia sẻ mã kết bạn này để bạn bè có thể tìm kiếm và kết nối ngay cả khi bạn tắt chế độ tìm kiếm công khai.
          </AppText>

          <View style={styles.codeButtonRow}>
            <TouchableOpacity
              style={[styles.codeBtn, { backgroundColor: c.surfaceHigh, borderColor: c.surfaceBorder }]}
              onPress={handleCopyCode}
            >
              <ClipboardCopyIcon size={18} color={c.textPrimary} />
              <AppText variant="bodySm" color={c.textPrimary} style={styles.bold}>
                Sao chép mã
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.codeBtn, { backgroundColor: c.brandAction, borderColor: c.brandAction }]}
              onPress={handleShareCode}
            >
              <ShareNodesIcon size={18} color={c.onBrand} />
              <AppText variant="bodySm" color={c.onBrand} style={styles.bold}>
                Chia sẻ ngay
              </AppText>
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* ── 2. Privacy Settings ────────────────────────────────────── */}
        <AppText variant="headlineSm" color={c.textPrimary}>
          Quyền riêng tư bảng xếp hạng
        </AppText>

        <AppCard style={styles.settingsGroupCard}>
          {/* Toggle 1: Discoverable */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.bold}>
                Cho phép tìm kiếm qua tên
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Người dùng khác có thể tìm thấy bạn qua tên hiển thị
              </AppText>
            </View>
            <Switch
              value={gameSettings.discoverable}
              onValueChange={(val) => updateGameSettings({ discoverable: val })}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: c.brandPrimary }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.surfaceBorder }]} />

          {/* Toggle 2: Share Streak */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.bold}>
                Chia sẻ chuỗi Streak
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hiển thị số ngày duy trì chuỗi trên bảng xếp hạng bạn bè
              </AppText>
            </View>
            <Switch
              value={gameSettings.shareStreak}
              onValueChange={(val) => updateGameSettings({ shareStreak: val })}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: c.brandPrimary }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.surfaceBorder }]} />

          {/* Toggle 3: Share Points */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.bold}>
                Chia sẻ điểm Thử thách
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hiển thị điểm tích lũy tuần trên bảng xếp hạng
              </AppText>
            </View>
            <Switch
              value={gameSettings.sharePoints}
              onValueChange={(val) => updateGameSettings({ sharePoints: val })}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: c.brandPrimary }}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: c.surfaceBorder }]} />

          {/* Toggle 4: Share Steps */}
          <View style={styles.settingItem}>
            <View style={styles.settingTextCol}>
              <AppText variant="bodyMd" color={c.textPrimary} style={styles.bold}>
                Chia sẻ số bước chân tuần
              </AppText>
              <AppText variant="caption" color={c.textSecondary}>
                Hiển thị số bước chân đồng bộ trên bảng xếp hạng
              </AppText>
            </View>
            <Switch
              value={gameSettings.shareSteps}
              onValueChange={(val) => updateGameSettings({ shareSteps: val })}
              trackColor={{ false: 'rgba(128,128,128,0.3)', true: c.brandPrimary }}
            />
          </View>
        </AppCard>

        {/* ── 3. Security Commitment Card ────────────────────────────── */}
        <View style={[styles.securityCard, { backgroundColor: c.surfaceHigh, borderColor: c.quickScanner }]}>
          <ShieldSecurityIcon size={28} color={c.quickScanner} />
          <View style={styles.securityTextWrap}>
            <AppText variant="headlineSm" color={c.quickScanner}>
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

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  codeCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 22,
    gap: 8,
  },
  friendCodeText: {
    letterSpacing: 4,
    fontWeight: '800',
    marginVertical: 4,
  },
  codeDesc: {
    lineHeight: 20,
    maxWidth: 300,
  },
  codeButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    width: '100%',
  },
  codeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  bold: { fontWeight: '700' },
  settingsGroupCard: {
    padding: 16,
    borderRadius: 22,
    gap: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 16,
    gap: 2,
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
  },
  shieldEmoji: {
    fontSize: 30,
    marginTop: 2,
  },
  securityTextWrap: {
    flex: 1,
    gap: 4,
  },
  securityDesc: {
    lineHeight: 20,
  },
});
