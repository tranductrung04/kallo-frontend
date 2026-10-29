import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '@/assets/images';
import { AppText } from '@/components/common';
import { CloseXIcon } from '@/components/icons';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

// ─── 1. Core Rules Content ───────────────────────────────────────────────────

export type StreakRulesContentProps = {
  onClose: () => void;
};

export function StreakRulesContent({ onClose }: StreakRulesContentProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.canvasBase }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar
        barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={c.canvasBase}
      />

      {/* Top Bar with Close Button (✕) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Đóng quy tắc chuỗi"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <CloseXIcon size={24} color={c.textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 36 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section 1: Chuỗi ngày là gì? ───────────────────────────── */}
        <Image
          source={images.streakRuleTrophy}
          style={styles.trophyImage}
          resizeMode="contain"
        />

        <AppText style={styles.sectionHeading} color={c.textPrimary}>Chuỗi ngày là gì?</AppText>

        <AppText style={styles.bodyParagraph} color={c.textSecondary}>
          Chuỗi ngày là số ngày bạn liên tục ghi lại bữa ăn vào nhật ký.
        </AppText>
        <AppText style={styles.bodyParagraph} color={c.textSecondary}>
          Bạn ghi đều mỗi ngày → chuỗi tiếp tục tăng.
        </AppText>
        <AppText style={styles.bodyParagraph} color={c.textSecondary}>
          Bạn bỏ quên một ngày → chuỗi sẽ quay về 0 và bắt đầu lại từ đầu.
        </AppText>

        {/* ── Section 2: Làm sao để giữ chuỗi? ───────────────────────── */}
        <Image
          source={images.streakRuleCalendar}
          style={styles.calendarImage}
          resizeMode="contain"
        />

        <AppText style={styles.sectionHeading} color={c.textPrimary}>Làm sao để giữ chuỗi?</AppText>

        <AppText style={[styles.bodyParagraph, { marginBottom: 14 }]} color={c.textSecondary}>
          Chuỗi ngày chỉ được tính khi bạn ghi món trong ngày hôm nay.
        </AppText>

        <View style={styles.bulletItem}>
          <AppText style={styles.bulletDot} color={c.brandPrimary}>•</AppText>
          <AppText style={styles.bulletText} color={c.textSecondary}>
            Ghi bù cho hôm qua, không tính vào chuỗi.
          </AppText>
        </View>

        <View style={styles.bulletItem}>
          <AppText style={styles.bulletDot} color={c.brandPrimary}>•</AppText>
          <AppText style={styles.bulletText} color={c.textSecondary}>
            Ghi trước cho ngày mai, không tính vào chuỗi.
          </AppText>
        </View>

        <View style={styles.bulletItem}>
          <AppText style={styles.bulletDot} color={c.brandPrimary}>•</AppText>
          <AppText style={styles.bulletText} color={c.textSecondary}>
            Chỉ cần bạn ghi ít nhất một món trong hôm nay, chuỗi ngày sẽ tiếp tục 🔥
          </AppText>
        </View>

        {/* ── Section 3: Khiên Kallo là gì? ───────────────────────────── */}
        <Image
          source={images.streakRuleShield}
          style={styles.shieldImage}
          resizeMode="contain"
        />

        <AppText style={styles.sectionHeading} color={c.textPrimary}>Khiên Kallo là gì?</AppText>

        <View style={styles.bulletItem}>
          <AppText style={styles.bulletDot} color={c.brandPrimary}>•</AppText>
          <AppText style={styles.bulletText} color={c.textSecondary}>
            Giúp bạn nghỉ 1 ngày mà không làm gián đoạn cả hành trình.
          </AppText>
        </View>

        <View style={styles.bulletItem}>
          <AppText style={styles.bulletDot} color={c.brandPrimary}>•</AppText>
          <AppText style={styles.bulletText} color={c.textSecondary}>
            Bạn có thể có tối đa 2 Khiên Kallo.
          </AppText>
        </View>

        <View style={styles.bulletItem}>
          <AppText style={styles.bulletDot} color={c.brandPrimary}>•</AppText>
          <AppText style={styles.bulletText} color={c.textSecondary}>
            Khi Khiên được kích hoạt, chuỗi vẫn an toàn. Tự tin tiếp tục giữ chuỗi khi bạn quay lại.
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── 2. Modal Wrapper ────────────────────────────────────────────────────────

export type StreakRulesModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function StreakRulesModal({ visible, onClose }: StreakRulesModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StreakRulesContent onClose={onClose} />
    </Modal>
  );
}

// ─── 3. Navigation Screen Wrapper ────────────────────────────────────────────

type ScreenProps = NativeStackScreenProps<RootStackParamList, any>;

export function StreakRulesScreen({ navigation }: ScreenProps) {
  return <StreakRulesContent onClose={() => navigation.goBack()} />;
}

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13111C',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  trophyImage: {
    width: 104,
    height: 104,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  calendarImage: {
    width: 106,
    height: 112,
    alignSelf: 'flex-start',
    marginTop: 36,
  },
  shieldImage: {
    width: 98,
    height: 110,
    alignSelf: 'flex-start',
    marginTop: 36,
  },
  sectionHeading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  bodyParagraph: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletDot: {
    fontSize: 18,
    lineHeight: 22,
    marginRight: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
});
