import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import type { MealSlot } from '@/features/nutrition/types';
import { useNutrition } from '@/features/nutrition/NutritionProvider';
import { todayKey } from '@/features/nutrition/utils';
import { useTheme } from '@/theme';
import { TILE_CONFIG } from '@/components/common';
import {
  AppleScanIcon,
  BodyStickFigureIcon,
  BowlFoodPlusIcon,
  FlameIcon,
  QuickBarcodeIcon,
  QuickSearchIcon,
  QuickSparklesIcon,
  QuickVoiceIcon,
  RecipeBookPlusIcon,
  ScaleIcon,
  WaterGlassPlusIcon,
} from '@/components/icons';

export type DashboardQuickActionsModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate?: string;
  bottomOffset?: number;
};

export function DashboardQuickActionsModal({
  visible,
  onClose,
  selectedDate: propDate,
  bottomOffset = 64,
}: DashboardQuickActionsModalProps) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors } = theme;
  const primaryBrand = colors.brandPrimary;

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state, addWater } = useNutrition();

  const selectedDate = propDate || state.selectedDate || todayKey();

  // Semantic card surface & border tokens from active theme
  const cardBg = isDark ? colors.surfaceHigh : colors.canvasBase;
  const cardBorder = colors.surfaceBorder;

  // 4 quick tiles matching Dashboard config exactly
  const searchCfg = isDark ? TILE_CONFIG.search.dark : TILE_CONFIG.search.light;
  const barcodeCfg = isDark ? TILE_CONFIG.barcode.dark : TILE_CONFIG.barcode.light;
  const aiScanCfg = isDark ? TILE_CONFIG.aiScan.dark : TILE_CONFIG.aiScan.light;
  const voiceCfg = isDark ? TILE_CONFIG.voice.dark : TILE_CONFIG.voice.light;

  // Animation values for smooth entrance & exit
  const [mounted, setMounted] = useState(visible);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(animValue, {
        toValue: 1,
        friction: 8,
        tension: 48,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setMounted(false);
        }
      });
    }
  }, [visible, animValue]);

  // Handle hardware back button on Android
  useEffect(() => {
    if (!visible) return;
    const onBackPress = () => {
      onClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [visible, onClose]);

  if (!mounted) {
    return null;
  }

  // Determine current meal slot from system hour
  const currentHour = new Date().getHours();
  const currentMeal: MealSlot =
    currentHour < 11
      ? 'breakfast'
      : currentHour < 14
        ? 'lunch'
        : currentHour < 18
          ? 'snack'
          : 'dinner';

  // ── Action Handlers ────────────────────────────────────────────────────────
  const handleRecordMeal = () => {
    onClose();
    navigation.navigate('FoodSearch', {
      date: selectedDate,
      meal: currentMeal,
    });
  };

  const handleBarcodeScan = () => {
    onClose();
    navigation.navigate('BarcodeScanner', {
      date: selectedDate,
      meal: currentMeal,
    });
  };

  const handleAIMealScan = () => {
    onClose();
    navigation.navigate('AIMealScan', {
      date: selectedDate,
      meal: currentMeal,
    });
  };

  const handleVoiceLog = () => {
    onClose();
    navigation.navigate('VoiceLogModal');
  };

  const handleAddWater = () => {
    onClose();
    addWater(selectedDate, 250);
    Alert.alert('Đã ghi nhận', 'Đã thêm 250ml nước vào nhật ký hôm nay.');
  };

  const handleRecipeSuggestion = () => {
    onClose();
    navigation.navigate('MealPlanWizard');
  };

  const handleActivityLog = () => {
    onClose();
    navigation.navigate('AddActivity', { date: selectedDate });
  };

  const handleRecordWeight = () => {
    onClose();
    navigation.navigate('RecordWeight');
  };

  const handleCreateRecipe = () => {
    onClose();
    navigation.navigate('CreateRecipe', {
      date: selectedDate,
      meal: currentMeal,
    });
  };

  const handleCreateFood = () => {
    onClose();
    navigation.navigate('CustomFoodForm', {
      date: selectedDate,
      meal: currentMeal,
    });
  };

  const handleBodyMetric = () => {
    onClose();
    navigation.navigate('BodyMetric');
  };

  // Interpolated animations
  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const sheetTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View
      style={[
        styles.overlayRoot,
        { bottom: bottomOffset },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* ── Dimmed Backdrop above tab bar ─────────────────────────────── */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: colors.overlay,
            opacity: backdropOpacity,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* ── Animated Bottom Sheet Container ───────────────────────────── */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            backgroundColor: colors.surfaceMid,
            borderTopColor: colors.surfaceBorder,
            transform: [{ translateY: sheetTranslateY }],
          },
        ]}
      >
        <View style={styles.sheetContent}>
          {/* ── Row 1: 4 Square Cards (Màu sắc đồng bộ 100% với Dashboard) ─ */}
          <View style={styles.quickTilesRow}>
            {/* 1. Ghi lại bữa ăn (Search) */}
            <TouchableOpacity
              style={styles.quickTileItem}
              activeOpacity={0.8}
              onPress={handleRecordMeal}
              accessibilityLabel="Ghi lại bữa ăn"
            >
              <View
                style={[
                  styles.tileBox,
                  {
                    backgroundColor: searchCfg.bg,
                    borderColor: isDark ? 'transparent' : (searchCfg as any).border,
                    borderWidth: isDark ? 0 : 1,
                  },
                ]}
              >
                <QuickSearchIcon size={28} color={searchCfg.glyph} />
              </View>
              <Text
                style={[
                  styles.tileLabel,
                  { color: colors.textPrimary },
                ]}
              >
                {'Ghi lại\nbữa ăn'}
              </Text>
            </TouchableOpacity>

            {/* 2. Quét mã vạch (Barcode) — dùng QuickBarcodeIcon chung */}
            <TouchableOpacity
              style={styles.quickTileItem}
              activeOpacity={0.8}
              onPress={handleBarcodeScan}
              accessibilityLabel="Quét mã vạch"
            >
              <View
                style={[
                  styles.tileBox,
                  {
                    backgroundColor: barcodeCfg.bg,
                    borderColor: isDark ? 'transparent' : (barcodeCfg as any).border,
                    borderWidth: isDark ? 0 : 1,
                  },
                ]}
              >
                <QuickBarcodeIcon size={26} color={barcodeCfg.glyph} />
              </View>
              <Text
                style={[
                  styles.tileLabel,
                  { color: colors.textPrimary },
                ]}
              >
                {'Quét mã\nvạch'}
              </Text>
            </TouchableOpacity>

            {/* 3. Nhận diện món ăn (AIScan) */}
            <TouchableOpacity
              style={styles.quickTileItem}
              activeOpacity={0.8}
              onPress={handleAIMealScan}
              accessibilityLabel="Nhận diện món ăn"
            >
              <View
                style={[
                  styles.tileBox,
                  {
                    backgroundColor: aiScanCfg.bg,
                    borderColor: isDark ? 'transparent' : (aiScanCfg as any).border,
                    borderWidth: isDark ? 0 : 1,
                  },
                ]}
              >
                <QuickSparklesIcon size={28} color={aiScanCfg.glyph} />
              </View>
              <Text
                style={[
                  styles.tileLabel,
                  { color: colors.textPrimary },
                ]}
              >
                {'Nhận diện\nmón ăn'}
              </Text>
            </TouchableOpacity>

            {/* 4. Ghi bằng giọng nói (Voice) */}
            <TouchableOpacity
              style={styles.quickTileItem}
              activeOpacity={0.8}
              onPress={handleVoiceLog}
              accessibilityLabel="Ghi bằng giọng nói"
            >
              <View
                style={[
                  styles.tileBox,
                  {
                    backgroundColor: voiceCfg.bg,
                    borderColor: isDark ? 'transparent' : (voiceCfg as any).border,
                    borderWidth: isDark ? 0 : 1,
                  },
                ]}
              >
                <QuickVoiceIcon
                  size={28}
                  color={voiceCfg.glyph}
                  cutoutColor={voiceCfg.bg}
                />
              </View>
              <Text
                style={[
                  styles.tileLabel,
                  { color: colors.textPrimary },
                ]}
              >
                {'Ghi bằng\ngiọng nói'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Row 2: Uống nước & Gợi ý công thức ────────────────── */}
          <View style={styles.twoColumnRow}>
            {/* Uống nước */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleAddWater}
              accessibilityLabel="Uống nước"
            >
              <WaterGlassPlusIcon
                size={22}
                color={colors.textPrimary}
              />
              <Text
                style={[
                  styles.cardItemText,
                  { color: colors.textPrimary },
                ]}
              >
                Uống nước
              </Text>
            </TouchableOpacity>

            {/* Gợi ý công thức */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleRecipeSuggestion}
              accessibilityLabel="Gợi ý công thức"
            >
              <View style={styles.appleScanIconWrapper}>
                <AppleScanIcon
                  size={24}
                  color={colors.textPrimary}
                />
                {/* <View
                  style={[
                    styles.betaBadge,
                    {
                      backgroundColor: isDark ? '#FFFFFF' : primaryBrand,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.betaText,
                      { color: isDark ? '#12111A' : colors.onBrand },
                    ]}
                  >
                    BETA
                  </Text>
                </View> */}
              </View>
              <Text
                style={[
                  styles.cardItemText,
                  { color: colors.textPrimary },
                ]}
              >
                Gợi ý công thức
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Row 3: Ghi lại hoạt động & Cân nặng ───────────────── */}
          <View style={styles.twoColumnRow}>
            {/* Ghi lại hoạt động */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleActivityLog}
              accessibilityLabel="Ghi lại hoạt động"
            >
              <FlameIcon
                size={22}
                color={colors.textPrimary}
              />
              <Text
                style={[
                  styles.cardItemText,
                  { color: colors.textPrimary },
                ]}
              >
                Ghi lại hoạt động
              </Text>
            </TouchableOpacity>

            {/* Cân nặng */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleRecordWeight}
              accessibilityLabel="Cân nặng"
            >
              <ScaleIcon
                size={22}
                color={colors.textPrimary}
                innerColor={cardBg}
              />
              <Text
                style={[
                  styles.cardItemText,
                  { color: colors.textPrimary },
                ]}
              >
                Cân nặng
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Row 4: Tạo công thức & Tạo thực phẩm ───────────────── */}
          <View style={styles.twoColumnRow}>
            {/* Tạo công thức */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleCreateRecipe}
              accessibilityLabel="Tạo công thức"
            >
              <RecipeBookPlusIcon
                size={22}
                color={colors.textPrimary}
              />
              <Text
                style={[
                  styles.cardItemText,
                  { color: colors.textPrimary },
                ]}
              >
                Tạo công thức
              </Text>
            </TouchableOpacity>

            {/* Tạo thực phẩm */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                {
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleCreateFood}
              accessibilityLabel="Tạo thực phẩm"
            >
              <BowlFoodPlusIcon
                size={22}
                color={colors.textPrimary}
              />
              <Text
                style={[
                  styles.cardItemText,
                  { color: colors.textPrimary },
                ]}
              >
                Tạo thực phẩm
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Row 5: Chỉ số sức khỏe (Full-width) ───────────────── */}
          <TouchableOpacity
            style={[
              styles.fullWidthCard,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleBodyMetric}
            accessibilityLabel="Chỉ số sức khỏe"
          >
            <View
              style={[
                styles.newBadge,
                { backgroundColor: primaryBrand },
              ]}
            >
              <Text style={[styles.newBadgeText, { color: colors.onBrand }]}>Mới</Text>
            </View>
            <BodyStickFigureIcon
              size={24}
              color={colors.textPrimary}
            />
            <Text
              style={[
                styles.fullWidthCardText,
                { color: colors.textPrimary },
              ]}
            >
              Chỉ số sức khỏe
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
  },

  // ── Row 1: 4 Square Tiles ──────────────────────────────────────────────
  quickTilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickTileItem: {
    alignItems: 'center',
    width: 76,
  },
  tileBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 17,
  },

  // ── Row 2, 3, 4: Two-column cards ──────────────────────────────────────
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  cardItem: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
  },
  cardItemText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  appleScanIconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  betaBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  betaText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // ── Row 5: Full-width card ─────────────────────────────────────────────
  fullWidthCard: {
    height: 58,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    marginBottom: 4,
  },
  fullWidthCardText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  newBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
