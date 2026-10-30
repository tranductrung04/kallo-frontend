import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CameraView,
  scanFromURLAsync,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  ChevronLeftIcon,
  GalleryAddIcon,
  ScannerSparkleFlashIcon,
} from '@/components/icons';
import { useTheme } from '@/theme';
import { getFoodByBarcode, type BarcodeFoodResponse } from '../api';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'BarcodeScanner'>;

export function BarcodeScannerScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const primaryBrand = colors.brandPrimary;
  const secondaryBrand = isDark ? '#B488FC' : colors.brandSecondary;

  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [busy, setBusy] = useState(false);
  const scannedRef = useRef(false);

  // Animated laser beam moving smoothly up & down
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [laserAnim]);

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 126],
  });

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    const code = data.trim().replace(/\s/g, '');
    if (scannedRef.current || busy || !/^\d{6,16}$/.test(code)) return;

    scannedRef.current = true;
    setBusy(true);

    try {
      const response = await getFoodByBarcode(code);
      const body: BarcodeFoodResponse = response.data;
      const food = 'id' in body ? body : body.data;

      if (food) {
        navigation.replace('FoodDetail', {
          foodId: food.id,
          date: route.params.date,
          meal: route.params.meal,
          source: 'BARCODE',
        });
      } else {
        navigation.replace('CustomFoodForm', {
          date: route.params.date,
          meal: route.params.meal,
          barcode: code,
        });
      }
    } catch (requestError) {
      const status = (requestError as { response?: { status?: number } }).response
        ?.status;
      if (status === 404) {
        navigation.replace('CustomFoodForm', {
          date: route.params.date,
          meal: route.params.meal,
          barcode: code,
        });
      } else {
        Alert.alert(
          'Không tìm thấy',
          'Không thể tìm thấy thông tin sản phẩm với mã vạch này. Bạn có muốn tạo món ăn mới?',
          [
            {
              text: 'Thử lại',
              style: 'cancel',
              onPress: () => {
                scannedRef.current = false;
              },
            },
            {
              text: 'Tạo món mới',
              onPress: () => {
                navigation.replace('CustomFoodForm', {
                  date: route.params.date,
                  meal: route.params.meal,
                  barcode: code,
                });
              },
            },
          ]
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const chooseImageFromGallery = async () => {
    if (busy) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const imageUri = result.assets[0].uri;
        try {
          const barcodeResults = await scanFromURLAsync(imageUri, [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'qr',
            'code128',
          ]);

          if (barcodeResults && barcodeResults.length > 0) {
            handleBarcodeScanned(barcodeResults[0]);
          } else {
            Alert.alert(
              'Không tìm thấy mã vạch',
              'Không thể nhận diện được mã vạch trong ảnh bạn đã chọn. Vui lòng thử lại với ảnh rõ nét hơn.'
            );
          }
        } catch {
          Alert.alert(
            'Không tìm thấy mã vạch',
            'Không nhận diện được mã vạch trong ảnh đã chọn. Vui lòng kiểm tra lại.'
          );
        }
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
    }
  };

  const permissionDenied = permission && !permission.granted;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: permissionDenied ? colors.canvasBase : '#000000',
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={permissionDenied && !isDark ? 'dark-content' : 'light-content'}
      />

      {/* Camera Preview */}
      {!permissionDenied && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flash}
          onBarcodeScanned={busy ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'ean13',
              'ean8',
              'upc_a',
              'upc_e',
              'code128',
              'code39',
              'qr',
            ],
          }}
        />
      )}

      <SafeAreaView
        edges={['top', 'bottom']}
        style={styles.safeContainer}
        pointerEvents="box-none"
      >
        {/* ── Top Area: Header + Quota Banner ──────────────────────────── */}
        <View style={styles.topSection}>
          {/* ── 1. Header Bar: <  Quét mã barcode  ⚡ ────────────────────── */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={[
                styles.headerIconButton,
                !permissionDenied && {
                  backgroundColor: isDark
                    ? 'rgba(25, 22, 38, 0.72)'
                    : 'rgba(255, 255, 255, 0.88)',
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                  borderWidth: 1,
                },
              ]}
              onPress={() => navigation.goBack()}
              accessibilityLabel="Quay lại"
            >
              <ChevronLeftIcon
                size={24}
                color={
                  permissionDenied && !isDark
                    ? colors.textPrimary
                    : isDark
                    ? '#FFFFFF'
                    : colors.textPrimary
                }
              />
            </TouchableOpacity>

            <View
              style={[
                styles.titleBadge,
                !permissionDenied && {
                  backgroundColor: isDark
                    ? 'rgba(25, 22, 38, 0.72)'
                    : 'rgba(255, 255, 255, 0.88)',
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color:
                      permissionDenied && !isDark
                        ? colors.textPrimary
                        : isDark
                        ? '#FFFFFF'
                        : colors.textPrimary,
                  },
                ]}
              >
                Quét mã barcode
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.headerIconButton,
                !permissionDenied && {
                  backgroundColor: isDark
                    ? 'rgba(25, 22, 38, 0.72)'
                    : 'rgba(255, 255, 255, 0.88)',
                  borderColor: isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
                  borderWidth: 1,
                },
              ]}
              onPress={() => setFlash((prev) => (prev === 'on' ? 'off' : 'on'))}
              accessibilityLabel={
                flash === 'on' ? 'Tắt đèn flash' : 'Bật đèn flash'
              }
            >
              <ScannerSparkleFlashIcon
                size={24}
                color={
                  flash === 'on'
                    ? isDark
                      ? '#FBBF24'
                      : '#F59E0B'
                    : permissionDenied && !isDark
                    ? colors.textPrimary
                    : isDark
                    ? '#FFFFFF'
                    : colors.textPrimary
                }
              />
            </TouchableOpacity>
          </View>

          {/* ── 2. Top Banner: Bạn còn 3 lượt quét cho hôm nay [Premium] ──── */}
          <View
            style={[
              styles.quotaBanner,
              {
                backgroundColor: isDark
                  ? 'rgba(32, 27, 46, 0.88)'
                  : 'rgba(255, 255, 255, 0.92)',
                borderColor: isDark
                  ? 'rgba(60, 52, 80, 0.6)'
                  : 'rgba(228, 224, 240, 0.9)',
              },
            ]}
          >
            <Text
              style={[
                styles.quotaText,
                { color: isDark ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              Bạn còn 3 lượt quét cho hôm nay
            </Text>
            <TouchableOpacity
              style={[
                styles.premiumBadge,
                { backgroundColor: colors.upgradeAccent || '#FBBF24' },
              ]}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Gói Kallo Premium',
                  'Nâng cấp Premium để sử dụng tính năng quét mã vạch không giới hạn!'
                )
              }
              accessibilityLabel="Gói Premium"
            >
              <Text
                style={[
                  styles.premiumBadgeText,
                  { color: colors.onUpgradeAccent || '#13121B' },
                ]}
              >
                Premium
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Permission Denied State ────────────────────────────────────── */}
        {permissionDenied ? (
          <View style={styles.permissionCard}>
            <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
              Cần quyền camera
            </Text>
            <Text
              style={[styles.permissionMessage, { color: colors.textSecondary }]}
            >
              Cho phép truy cập máy ảnh để quét mã vạch trên bao bì sản phẩm.
            </Text>
            <TouchableOpacity
              style={[styles.permissionBtn, { backgroundColor: primaryBrand }]}
              onPress={() => {
                void requestPermission();
              }}
            >
              <Text style={[styles.permissionBtnText, { color: colors.onBrand }]}>
                Cho phép camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.galleryFallbackBtn}
              onPress={chooseImageFromGallery}
            >
              <GalleryAddIcon size={20} color={primaryBrand} />
              <Text style={[styles.galleryFallbackText, { color: primaryBrand }]}>
                Chọn ảnh từ thư viện
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ── 3. Scanning Viewport Area (Center) ─────────────────────────── */}
            <View style={styles.scannerCenterSection} pointerEvents="box-none">
              {/* The Reticle Box (4 purple corners + laser line) */}
              <View style={styles.reticleBox}>
                {/* Corner brackets */}
                <View
                  style={[styles.cornerTopLeft, { borderColor: primaryBrand }]}
                />
                <View
                  style={[styles.cornerTopRight, { borderColor: primaryBrand }]}
                />
                <View
                  style={[styles.cornerBottomLeft, { borderColor: primaryBrand }]}
                />
                <View
                  style={[
                    styles.cornerBottomRight,
                    { borderColor: primaryBrand },
                  ]}
                />

                {/* Animated Glowing Laser Beam */}
                <Animated.View
                  style={[
                    styles.laserContainer,
                    { transform: [{ translateY }] },
                  ]}
                  pointerEvents="none"
                >
                  <Svg
                    width="100%"
                    height={32}
                    viewBox="0 0 270 32"
                    preserveAspectRatio="none"
                  >
                    <Defs>
                      <LinearGradient id="laserGlow" x1="0" y1="0" x2="0" y2="1">
                        <Stop
                          offset="0"
                          stopColor={primaryBrand}
                          stopOpacity="0.0"
                        />
                        <Stop
                          offset="0.8"
                          stopColor={primaryBrand}
                          stopOpacity="0.45"
                        />
                        <Stop
                          offset="1"
                          stopColor={secondaryBrand}
                          stopOpacity="0.9"
                        />
                      </LinearGradient>
                    </Defs>
                    <Rect
                      width="100%"
                      height={28}
                      fill="url(#laserGlow)"
                    />
                    <Rect
                      y={28}
                      width="100%"
                      height={4}
                      rx={2}
                      fill={secondaryBrand}
                    />
                  </Svg>
                </Animated.View>
              </View>

              {/* Instruction badge positioned under reticle */}
              <View
                style={[
                  styles.instructionBadge,
                  {
                    backgroundColor: isDark
                      ? 'rgba(25, 22, 38, 0.82)'
                      : 'rgba(255, 255, 255, 0.92)',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.instructionText,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {busy
                    ? 'Đang tìm kiếm sản phẩm...'
                    : 'Di chuyển camera vào mã vạch để quét.'}
                </Text>
              </View>
            </View>

            {/* ── 4. Bottom Controls: Gallery & Switch ─────────────────────── */}
            <View style={styles.bottomSection}>
              {/* Gallery Action Button */}
              <TouchableOpacity
                style={[
                  styles.galleryButton,
                  {
                    backgroundColor: isDark
                      ? 'rgba(25, 22, 38, 0.85)'
                      : 'rgba(255, 255, 255, 0.94)',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
                activeOpacity={0.8}
                onPress={chooseImageFromGallery}
                accessibilityLabel="Chọn ảnh từ thư viện"
              >
                <GalleryAddIcon
                  size={22}
                  color={isDark ? '#FFFFFF' : primaryBrand}
                />
                <Text
                  style={[
                    styles.galleryButtonText,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  Chọn ảnh từ thư viện
                </Text>
              </TouchableOpacity>

              {/* Switch to AIMealScan */}
              <TouchableOpacity
                style={[
                  styles.aiSwitchBtn,
                  {
                    backgroundColor: isDark
                      ? 'rgba(25, 22, 38, 0.72)'
                      : 'rgba(255, 255, 255, 0.88)',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
                onPress={() => navigation.navigate('AIMealScan', route.params)}
                accessibilityLabel="Chuyển sang nhận diện món ăn"
              >
                <Text
                  style={[
                    styles.aiSwitchText,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  Nhận diện món ăn AI
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
    zIndex: 10,
  },

  // 1. Header Bar
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  titleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  // 2. Quota Banner
  quotaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  quotaText: {
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  premiumBadge: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
  },
  premiumBadgeText: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // 3. Scanner Center Section
  scannerCenterSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleBox: {
    width: 270,
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    borderTopWidth: 4.5,
    borderLeftWidth: 4.5,
    borderTopLeftRadius: 18,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 44,
    height: 44,
    borderTopWidth: 4.5,
    borderRightWidth: 4.5,
    borderTopRightRadius: 18,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 44,
    height: 44,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderBottomLeftRadius: 18,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderBottomWidth: 4.5,
    borderRightWidth: 4.5,
    borderBottomRightRadius: 18,
  },
  laserContainer: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: 0,
    height: 32,
  },

  instructionBadge: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 22,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  instructionText: {
    fontSize: 14.5,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // 4. Bottom Section & Controls
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 24,
    gap: 12,
    zIndex: 10,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  galleryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // 5. Switch to AI Scan
  aiSwitchBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  aiSwitchText: {
    fontSize: 13.5,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // Permission Prompt
  permissionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permissionBtn: {
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 24,
    marginBottom: 16,
  },
  permissionBtnText: {
    fontSize: 15.5,
    fontWeight: '700',
  },
  galleryFallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  galleryFallbackText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
