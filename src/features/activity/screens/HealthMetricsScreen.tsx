import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '@/assets/images';
import { AppButton, AppText } from '@/components/common';
import { ChevronLeftIcon, InfoIcon } from '@/components/icons';
import { useTheme } from '@/theme';
import { todayKey } from '@/features/nutrition/utils';
import { useActivity } from '../ActivityProvider';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthMetrics'>;

const HEALTH_METRICS_INTRO_KEY = '@kallo:health_metrics_intro_seen';

type Metric = {
  id: string;
  label: string;
  unit: string;
};

const METRICS: Metric[] = [
  { id: 'weight', label: 'Cân nặng', unit: 'kg' },
  { id: 'bodyFat', label: 'Tỉ lệ mỡ', unit: '%' },
  { id: 'muscle', label: 'Khối lượng cơ', unit: '%' },
  { id: 'neck', label: 'Vòng cổ', unit: 'cm' },
  { id: 'chest', label: 'Vòng ngực', unit: 'cm' },
  { id: 'arm', label: 'Bắp tay', unit: 'cm' },
  { id: 'waist', label: 'Vòng eo', unit: 'cm' },
  { id: 'hip', label: 'Vòng hông', unit: 'cm' },
  { id: 'glute', label: 'Vòng mông', unit: 'cm' },
  { id: 'thigh', label: 'Bắp đùi', unit: 'cm' },
];

export function HealthMetricsScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors: c } = theme;
  const isDark = theme.scheme === 'dark';
  const { addBodyMetricLog } = useActivity();

  const currentDate = route.params?.date || todayKey();

  const [introSeen, setIntroSeen] = useState<boolean | null>(null);

  const [values, setValues] = useState<Record<string, string>>({
    weight: '0',
    bodyFat: '0',
    muscle: '0',
    neck: '0',
    chest: '0',
    arm: '0',
    waist: '0',
    hip: '0',
    glute: '0',
    thigh: '0',
  });

  const inputRefs = useRef<Record<string, TextInput | null>>({});

  // Load saved metrics for current date if previously saved
  useEffect(() => {
    const storageKey = `@kallo:health_metrics_${currentDate}`;
    void AsyncStorage.getItem(storageKey).then((saved) => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setValues((prev) => ({ ...prev, ...parsed }));
          }
        } catch {}
      }
    });
  }, [currentDate]);

  // Check whether first time opening health metrics
  useEffect(() => {
    if (route.params?.forceIntro) {
      setIntroSeen(false);
      return;
    }
    void AsyncStorage.getItem(HEALTH_METRICS_INTRO_KEY)
      .then((val) => {
        setIntroSeen(val === 'true');
      })
      .catch(() => {
        setIntroSeen(false);
      });
  }, [route.params?.forceIntro]);

  // Handle hardware back press on Android when on intro view -> returns to metrics
  useEffect(() => {
    if (introSeen === false) {
      const onHardwareBack = () => {
        setIntroSeen(true);
        return true;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
      return () => sub.remove();
    }
  }, [introSeen]);

  const formattedDate = useMemo(() => {
    const today = todayKey();
    let d = new Date();
    if (currentDate) {
      const parts = currentDate.split('-');
      if (parts.length === 3) {
        d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
    const day = d.getDate();
    const month = d.getMonth() + 1;
    if (currentDate === today) {
      return `Hôm nay, ${day} thg ${month}`;
    }
    return `${day} thg ${month}`;
  }, [currentDate]);

  const hasValue = useMemo(() => {
    return METRICS.some((m) => {
      const v = parseFloat(values[m.id]);
      return Number.isFinite(v) && v > 0;
    });
  }, [values]);

  const handleValueChange = (id: string, text: string) => {
    // Convert comma to dot for decimal inputs
    const normalized = text.replace(',', '.');
    // Allow empty string or valid numeric string (integers or decimals)
    if (normalized === '' || /^\d*\.?\d*$/.test(normalized)) {
      setValues((prev) => ({ ...prev, [id]: normalized }));
    }
  };

  const handleSave = () => {
    if (!hasValue) return;
    const storageKey = `@kallo:health_metrics_${currentDate}`;
    void AsyncStorage.setItem(storageKey, JSON.stringify(values)).catch(() => undefined);

    const waist = parseFloat(values.waist);
    const hip = parseFloat(values.hip);
    if (waist > 0 && hip > 0) {
      addBodyMetricLog(waist, hip, 'other', currentDate);
    }
    navigation.goBack();
  };

  const handleStartRecording = () => {
    setIntroSeen(true);
    void AsyncStorage.setItem(HEALTH_METRICS_INTRO_KEY, 'true').catch(() => undefined);
  };

  const handleIntroBack = () => {
    setIntroSeen(true);
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (introSeen === null) {
    return <View style={[styles.safe, { backgroundColor: c.canvasBase }]} />;
  }

  // ─── 1. Mascot Intro Screen ("Trang Ghi ngay") ─────────────────────────────
  if (!introSeen) {
    const screenBg = isDark ? '#110D1D' : c.canvasBase;
    const headingColor = isDark ? '#FFFFFF' : c.textPrimary;
    const subtitleColor = isDark ? '#B6B0CD' : c.textSecondary;
    const chevronColor = isDark ? '#FFFFFF' : c.textPrimary;
    const brandPurple = isDark ? '#7C5CFC' : c.brandPrimary;

    return (
      <View style={[styles.introRoot, { backgroundColor: screenBg }]}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={isDark ? 'light-content' : 'dark-content'}
        />

        {/* Top ambient radial glow */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height={360}>
            <Defs>
              <RadialGradient id="introTopGlow" cx="50%" cy="0%" rx="80%" ry="100%">
                <Stop
                  offset="0%"
                  stopColor={isDark ? '#4A2A82' : '#E8DCFF'}
                  stopOpacity={isDark ? 0.65 : 0.85}
                />
                <Stop
                  offset="100%"
                  stopColor={screenBg}
                  stopOpacity={0}
                />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height={360} fill="url(#introTopGlow)" />
          </Svg>
        </View>

        {/* Top navigation bar */}
        <View style={[styles.introTopBar, { paddingTop: Math.max(insets.top, 12) }]}>
          <TouchableOpacity
            style={styles.introBackBtn}
            onPress={handleIntroBack}
            hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            accessibilityLabel="Quay lại chỉ số sức khỏe"
            accessibilityRole="button"
          >
            <ChevronLeftIcon size={26} color={chevronColor} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>

        {/* Center Graphic & Messaging */}
        <ScrollView
          contentContainerStyle={styles.introScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Mascot with measuring tape */}
          <View style={styles.introMascotWrapper}>
            <Image
              source={images.bodyMetricIntro}
              style={styles.introMascotImage}
              resizeMode="contain"
              accessibilityLabel="Mascot đo chỉ số sức khỏe"
            />
          </View>

          {/* Pill Badge: CHỈ SỐ SỨC KHỎE */}
          <View style={[styles.introPillBadge, { backgroundColor: brandPurple }]}>
            <AppText style={styles.introPillBadgeText}>CHỈ SỐ SỨC KHỎE</AppText>
          </View>

          {/* Headline: ĐỪNG ĐỂ NỖ LỰC BỊ LÃNG QUÊN */}
          <AppText style={[styles.introHeadline, { color: headingColor }]}>
            {'ĐỪNG ĐỂ NỖ LỰC BỊ LÃNG QUÊN'}
          </AppText>

          {/* Subtitle / Description */}
          <AppText style={[styles.introSubtitle, { color: subtitleColor }]}>
            {'Hãy ghi lại số đo mới nhất để Kallo\ncùng bạn lưu trữ từng bước tiến của\ncơ thể nhé!'}
          </AppText>
        </ScrollView>

        {/* Bottom CTA Button: Ghi ngay */}
        <View
          style={[
            styles.introCtaWrapper,
            { paddingBottom: Math.max(insets.bottom, 16) + 6 },
          ]}
        >
          <TouchableOpacity
            style={[styles.introCtaBtn, { backgroundColor: brandPurple }]}
            activeOpacity={0.88}
            onPress={handleStartRecording}
            accessibilityLabel="Ghi ngay"
            accessibilityRole="button"
          >
            <AppText style={styles.introCtaBtnText}>Ghi ngay</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── 2. Health Metrics Input Screen ("Trang chỉ số") ──────────────────────
  const rowBorderColor = isDark ? '#2D273F' : c.surfaceBorder;

  return (
    <View style={[styles.safe, { backgroundColor: c.canvasBase, paddingTop: Math.max(12, insets.top) }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
          accessibilityLabel="Quay lại dashboard"
          accessibilityRole="button"
        >
          <ChevronLeftIcon size={22} color={c.textPrimary} strokeWidth={2.2} />
        </Pressable>
        <AppText variant="headlineMd" color={c.textPrimary} style={styles.date}>
          {formattedDate}
        </AppText>
        <Pressable
          onPress={() => setIntroSeen(false)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.infoBtn}
          accessibilityLabel="Xem hướng dẫn chỉ số"
          accessibilityRole="button"
        >
          <InfoIcon size={20} color={c.textSecondary} strokeWidth={2} />
        </Pressable>
      </View>

      <AppText variant="headlineLg" style={styles.title} color={c.textPrimary}>
        Nhập chỉ số sức khỏe
      </AppText>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {METRICS.map((m) => (
            <Pressable
              key={m.id}
              style={[styles.row, { borderBottomColor: rowBorderColor }]}
              onPress={() => inputRefs.current[m.id]?.focus()}
              accessibilityLabel={`Nhập ${m.label}`}
              accessibilityRole="button"
            >
              <AppText variant="bodyLg" color={c.textPrimary} style={styles.label}>
                {m.label}
              </AppText>
              <View style={styles.valueWrap}>
                <TextInput
                  ref={(el) => {
                    inputRefs.current[m.id] = el;
                  }}
                  value={values[m.id] ?? ''}
                  placeholder="0"
                  placeholderTextColor={c.textSecondary}
                  onChangeText={(text) => handleValueChange(m.id, text)}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                  style={[styles.valueInput, { color: c.textPrimary }]}
                  accessibilityLabel={`${m.label} giá trị`}
                />
                <AppText variant="bodyLg" color={c.textPrimary} style={styles.unit}>
                  {m.unit}
                </AppText>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* ── Fixed bottom area: Hướng dẫn đo & Nút lưu chỉ số ─────────────── */}
        <View
          style={[
            styles.fixedFooter,
            { backgroundColor: c.canvasBase, paddingBottom: Math.max(insets.bottom, 14) },
          ]}
        >
          <Pressable
            onPress={() => navigation.navigate('MeasurementGuide')}
            style={styles.guideRow}
            hitSlop={{ top: 10, bottom: 10, left: 16, right: 16 }}
            accessibilityLabel="Hướng dẫn đo các chỉ số"
            accessibilityRole="button"
          >
            <View style={styles.questionBadge}>
              <AppText style={styles.questionText}>?</AppText>
            </View>
            <AppText style={styles.guideText}>
              Hướng dẫn đo các chỉ số
            </AppText>
          </Pressable>

          <AppButton
            label="Lưu chỉ số"
            variant="primary"
            disabled={!hasValue}
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MASCOT_SIZE = Math.min(SCREEN_W * 0.72, SCREEN_H * 0.36, 270);

const styles = StyleSheet.create({
  // ── First-time Intro Screen Styles ─────────────────────────────────────────
  introRoot: {
    flex: 1,
    justifyContent: 'space-between',
  },
  introTopBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  introBackBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  introMascotWrapper: {
    width: MASCOT_SIZE,
    height: MASCOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  introMascotImage: {
    width: '100%',
    height: '100%',
  },
  introPillBadge: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  introPillBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  introHeadline: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0.4,
    textAlign: 'center',
    marginBottom: 12,
  },
  introSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  introCtaWrapper: {
    paddingHorizontal: 20,
    width: '100%',
  },
  introCtaBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  introCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ── Health Metrics Input Screen Styles ─────────────────────────────────────
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  infoBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  keyboardAvoid: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  valueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    minWidth: 80,
  },
  valueInput: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 44,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  unit: {
    fontSize: 16,
    minWidth: 24,
    textAlign: 'left',
  },
  fixedFooter: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 14,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  questionBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
    lineHeight: 16,
  },
  guideText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#0284C7',
  },
  saveBtn: { borderRadius: 9999, height: 50 },
});
