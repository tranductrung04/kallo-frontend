import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import {
  ChevronLeftIcon,
  GalleryAddIcon,
  InfoIcon,
  ScannerSparkleFlashIcon,
} from '@/components/icons';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'AIMealScan'>;
const GUIDE_KEY = '@kallo/meal-scan-guide-seen';
const MAX_IMAGE_EDGE = 1280;

export function AIMealScanScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<React.ElementRef<typeof CameraView> | null>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [zoom, setZoom] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [guideVisible, setGuideVisible] = useState(false);
  const [guideSeen, setGuideSeen] = useState(false);

  // Check if first time opening AI Meal Scan
  useEffect(() => {
    void AsyncStorage.getItem(GUIDE_KEY)
      .then((value) => {
        if (value === 'true') {
          setGuideSeen(true);
        } else {
          setGuideVisible(true);
        }
      })
      .catch(() => undefined);
  }, []);

  const closeGuide = () => {
    setGuideSeen(true);
    setGuideVisible(false);
    void AsyncStorage.setItem(GUIDE_KEY, 'true').catch(() => undefined);
  };

  const handleIntroBack = () => {
    if (guideSeen) {
      setGuideVisible(false);
    } else {
      navigation.goBack();
    }
  };

  // Animated laser beam for the scanning reticle
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2400,
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
    outputRange: [2, 252],
  });

  const goToResult = async (uri: string, width?: number, height?: number) => {
    setBusy(true);
    setError(undefined);
    try {
      const longEdge = Math.max(width ?? 0, height ?? 0);
      if (!uri) throw new Error('Missing image URI');
      const actions =
        longEdge > MAX_IMAGE_EDGE
          ? [
              {
                resize:
                  width && height && width >= height
                    ? { width: MAX_IMAGE_EDGE }
                    : { height: MAX_IMAGE_EDGE },
              },
            ]
          : [];
      const result = await ImageManipulator.manipulateAsync(
        uri,
        actions as ImageManipulator.Action[],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      if (!result.uri) throw new Error('Missing processed image URI');
      navigation.replace('MealScanResult', {
        imageUri: result.uri,
        date: route.params.date,
        meal: route.params.meal,
      });
    } catch {
      setError('Không thể xử lý ảnh. Hãy thử ảnh khác.');
    } finally {
      setBusy(false);
    }
  };

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setError(undefined);
    try {
      const picture = await (
        cameraRef.current as unknown as {
          takePictureAsync: (options?: { quality?: number }) => Promise<{
            uri: string;
            width?: number;
            height?: number;
          }>;
        }
      ).takePictureAsync({ quality: 0.8 });
      if (!picture.uri) throw new Error('Camera returned no image');
      await goToResult(picture.uri, picture.width, picture.height);
    } catch {
      setError('Không thể chụp ảnh. Hãy thử lại.');
      setBusy(false);
    }
  };

  const chooseImage = async () => {
    if (busy) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        await goToResult(
          result.assets[0].uri,
          result.assets[0].width,
          result.assets[0].height
        );
      }
    } catch {
      setError('Không thể mở thư viện ảnh. Hãy thử lại.');
    }
  };

  const permissionDenied = permission && !permission.granted;

  // Dynamic theme colors
  const primaryBrand = colors.brandPrimary || '#9E64F7';
  const secondaryBrand = colors.brandSecondary || '#B488FC';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: permissionDenied
            ? colors.canvasBase
            : '#000000',
        },
      ]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={permissionDenied && !isDark ? 'dark-content' : 'light-content'}
      />

      {/* ── Main Camera View ────────────────────────────────────────────── */}
      {!permissionDenied && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flash}
          zoom={zoom}
        />
      )}

      <SafeAreaView
        edges={['top', 'bottom']}
        style={styles.safeContainer}
        pointerEvents="box-none"
      >
        {/* Header: <  Nhận diện món ăn  ⚡ ⓘ */}
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
              Nhận diện món ăn
            </Text>
          </View>

          <View style={styles.headerRightGroup}>
            {!permissionDenied && (
              <TouchableOpacity
                style={[
                  styles.headerIconButton,
                  {
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
                  size={22}
                  color={
                    flash === 'on'
                      ? isDark
                        ? '#FBBF24'
                        : '#F59E0B'
                      : isDark
                      ? '#FFFFFF'
                      : colors.textPrimary
                  }
                />
              </TouchableOpacity>
            )}

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
              onPress={() => setGuideVisible(true)}
              accessibilityLabel="Hướng dẫn nhận diện"
            >
              <InfoIcon
                size={22}
                color={
                  permissionDenied && !isDark
                    ? colors.textPrimary
                    : isDark
                    ? '#FFFFFF'
                    : colors.textPrimary
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {permissionDenied ? (
          /* Permission denied prompt adapts to Light/Dark */
          <View style={styles.permissionCard}>
            <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
              Cần quyền camera
            </Text>
            <Text style={[styles.permissionMessage, { color: colors.textSecondary }]}>
              Cho phép truy cập camera để chụp và nhận diện món ăn bằng AI.
            </Text>
            <TouchableOpacity
              style={[styles.permissionBtn, { backgroundColor: primaryBrand }]}
              onPress={() => {
                void requestPermission();
              }}
              accessibilityLabel="Cho phép camera"
            >
              <Text style={styles.permissionBtnText}>Cho phép camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.galleryFallbackBtn}
              onPress={chooseImage}
              accessibilityLabel="Chọn ảnh từ thư viện"
            >
              <GalleryAddIcon size={20} color={primaryBrand} />
              <Text style={[styles.galleryFallbackText, { color: primaryBrand }]}>
                Chọn ảnh từ thư viện
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Viewport Center: Reticle Box + Hint Badge */}
            <View style={styles.scannerCenterSection} pointerEvents="box-none">
              {/* Reticle Viewport with 4 corners in theme brand color & laser */}
              <View style={styles.reticleBox}>
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
                  style={[styles.cornerBottomRight, { borderColor: primaryBrand }]}
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
                    height={34}
                    viewBox="0 0 290 34"
                    preserveAspectRatio="none"
                  >
                    <Defs>
                      <LinearGradient id="laserBeamGlow" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={primaryBrand} stopOpacity="0.0" />
                        <Stop offset="0.75" stopColor={primaryBrand} stopOpacity="0.4" />
                        <Stop offset="1" stopColor={secondaryBrand} stopOpacity="0.95" />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height={30} fill="url(#laserBeamGlow)" />
                    <Rect y={30} width="100%" height={4} rx={2} fill={secondaryBrand} />
                  </Svg>
                </Animated.View>
              </View>

              {/* Hint text badge */}
              <View
                style={[
                  styles.hintBadge,
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
                    styles.hintText,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {busy
                    ? 'Đang nhận diện món ăn...'
                    : error || 'Đặt món ăn vào khung hình'}
                </Text>
              </View>
            </View>

            {/* Bottom Controls Area (Pinned to bottom) */}
            <View style={styles.bottomSection}>
              {/* Controls Row: Zoom -, Gallery, Shutter, Zoom + */}
              <View style={styles.bottomControls}>
                {/* Zoom Out Button */}
                <TouchableOpacity
                  style={[
                    styles.zoomBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(25, 22, 38, 0.75)'
                        : 'rgba(255, 255, 255, 0.88)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                  onPress={() => setZoom((v) => Math.max(0, v - 0.2))}
                  accessibilityLabel="Thu nhỏ"
                >
                  <Text
                    style={[
                      styles.zoomBtnText,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    -
                  </Text>
                </TouchableOpacity>

                {/* Gallery Button */}
                <TouchableOpacity
                  style={[
                    styles.controlGalleryBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(25, 22, 38, 0.75)'
                        : 'rgba(255, 255, 255, 0.88)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                  onPress={chooseImage}
                  accessibilityLabel="Chọn ảnh từ thư viện"
                >
                  <GalleryAddIcon
                    size={24}
                    color={isDark ? '#FFFFFF' : primaryBrand}
                  />
                </TouchableOpacity>

                {/* Shutter Capture Button */}
                <TouchableOpacity
                  style={[
                    styles.shutterBtn,
                    {
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.35)'
                        : '#E4E0F0',
                    },
                    busy && styles.shutterDisabled,
                  ]}
                  disabled={busy}
                  onPress={capture}
                  accessibilityLabel="Chụp ảnh món ăn"
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.shutterInner,
                      { backgroundColor: colors.quickScanner || '#22C55E' },
                    ]}
                  />
                </TouchableOpacity>

                {/* Zoom In Button */}
                <TouchableOpacity
                  style={[
                    styles.zoomBtn,
                    {
                      backgroundColor: isDark
                        ? 'rgba(25, 22, 38, 0.75)'
                        : 'rgba(255, 255, 255, 0.88)',
                      borderColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                  onPress={() => setZoom((v) => Math.min(1, v + 0.2))}
                  accessibilityLabel="Phóng to"
                >
                  <Text
                    style={[
                      styles.zoomBtnText,
                      { color: isDark ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Switch to Barcode button */}
              <TouchableOpacity
                style={[
                  styles.barcodeSwitchBtn,
                  {
                    backgroundColor: isDark
                      ? 'rgba(25, 22, 38, 0.72)'
                      : 'rgba(255, 255, 255, 0.88)',
                    borderColor: isDark
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
                onPress={() => navigation.navigate('BarcodeScanner', route.params)}
                accessibilityLabel="Chuyển sang quét mã vạch"
              >
                <Text
                  style={[
                    styles.barcodeSwitchText,
                    { color: isDark ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  Quét mã vạch
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>

      {/* ── First-time Onboarding / Guide Screen (Light & Dark Theme) ────── */}
      <Modal
        visible={guideVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={handleIntroBack}
      >
        <View
          style={[
            styles.introContainer,
            {
              backgroundColor: isDark ? '#110D1D' : colors.canvasBase,
            },
          ]}
        >
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={isDark ? '#110D1D' : colors.canvasBase}
          />

          <SafeAreaView edges={['top']} style={styles.introSafe}>
            {/* Header: < Back */}
            <View style={styles.introHeader}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleIntroBack}
                accessibilityLabel="Quay lại"
              >
                <ChevronLeftIcon
                  size={24}
                  color={isDark ? '#FFFFFF' : colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Center Graphic: Scan guide illustration */}
            <View
              style={[
                styles.introGraphicWrapper,
                {
                  backgroundColor: isDark ? '#1E192E' : '#EDE8F8',
                  borderColor: isDark ? '#2B2342' : '#DDD5F3',
                  borderWidth: 1,
                },
              ]}
            >
              <Image
                source={images.mealScanGuide01}
                style={styles.introGraphicImage}
                resizeMode="contain"
              />
            </View>

            {/* Content info */}
            <View style={styles.introContentSection}>
              {/* Badge: NHẬN DIỆN MÓN ĂN */}
              <View
                style={[
                  styles.introPillBadge,
                  {
                    backgroundColor: isDark ? '#7B4FE0' : '#EDE5FF',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.introPillBadgeText,
                    {
                      color: isDark ? '#FFFFFF' : '#6A3AC7',
                    },
                  ]}
                >
                  NHẬN DIỆN MÓN ĂN
                </Text>
              </View>

              {/* Main Heading: DỄ ƠI LÀ DỄ */}
              <Text
                style={[
                  styles.introHeading,
                  {
                    color: isDark ? '#FFFFFF' : colors.textPrimary,
                  },
                ]}
              >
                DỄ ƠI LÀ DỄ
              </Text>

              {/* Description paragraph */}
              <Text
                style={[
                  styles.introSubtitle,
                  {
                    color: isDark ? '#D4CEE5' : colors.textSecondary,
                  },
                ]}
              >
                {'Chỉ cần chụp đĩa thức ăn, Kallo sẽ gợi ý món để\nbạn chọn và lưu ngay vào nhật ký!'}
              </Text>
            </View>

            {/* Bottom CTA Button: Thử ngay nào */}
            <View
              style={[
                styles.introCtaWrapper,
                { paddingBottom: Math.max(insets.bottom, 16) + 8 },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.introCtaBtn,
                  {
                    backgroundColor: primaryBrand,
                    shadowColor: primaryBrand,
                  },
                ]}
                activeOpacity={0.85}
                onPress={closeGuide}
                accessibilityLabel="Thử ngay nào"
              >
                <Text style={styles.introCtaBtnText}>Thử ngay nào</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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

  // Header Bar
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraHeaderIconBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  // Scanner Viewport
  scannerCenterSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleBox: {
    width: 290,
    height: 290,
    position: 'relative',
    overflow: 'hidden',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4.5,
    borderLeftWidth: 4.5,
    borderTopLeftRadius: 22,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 4.5,
    borderRightWidth: 4.5,
    borderTopRightRadius: 22,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4.5,
    borderLeftWidth: 4.5,
    borderBottomLeftRadius: 22,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 4.5,
    borderRightWidth: 4.5,
    borderBottomRightRadius: 22,
  },
  laserContainer: {
    position: 'absolute',
    left: 6,
    right: 6,
    top: 0,
    height: 34,
  },

  hintBadge: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  hintText: {
    fontSize: 14.5,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  // Controls at bottom
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 24,
    zIndex: 10,
    width: '100%',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  zoomBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  zoomBtnText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  controlGalleryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  shutterDisabled: {
    opacity: 0.5,
  },
  barcodeSwitchBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  barcodeSwitchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#FFFFFF',
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

  // ── First-time Intro Screen Styles ───────────────────────────────────────
  introContainer: {
    flex: 1,
  },
  introSafe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  introHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  introGraphicWrapper: {
    width: 280,
    height: 240,
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 24,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introGraphicImage: {
    width: 220,
    height: 200,
  },
  introContentSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  introPillBadge: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 18,
  },
  introPillBadgeText: {
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  introHeading: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginTop: 12,
  },
  introSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 14,
    paddingHorizontal: 10,
  },
  introCtaWrapper: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  introCtaBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  introCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
