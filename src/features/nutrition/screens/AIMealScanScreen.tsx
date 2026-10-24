import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Modal, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppButton, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AIMealScan'>;
const GUIDE_KEY = '@kallo/meal-scan-guide-seen';
const MAX_IMAGE_EDGE = 1280;

export function AIMealScanScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<React.ElementRef<typeof CameraView> | null>(null);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [zoom, setZoom] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [guideVisible, setGuideVisible] = useState(false);
  const [guidePage, setGuidePage] = useState(0);

  useEffect(() => {
    void AsyncStorage.getItem(GUIDE_KEY).then((value) => { if (value !== 'true') setGuideVisible(true); }).catch(() => undefined);
  }, []);
  const closeGuide = () => { setGuideVisible(false); void AsyncStorage.setItem(GUIDE_KEY, 'true').catch(() => undefined); };
  const goToResult = async (uri: string, width?: number, height?: number) => {
    setBusy(true); setError(undefined);
    try {
      const longEdge = Math.max(width ?? 0, height ?? 0);
      if (!uri) throw new Error('Missing image URI');
      const actions = longEdge > MAX_IMAGE_EDGE
        ? [
            {
              resize: width && height && width >= height
                ? { width: MAX_IMAGE_EDGE }
                : { height: MAX_IMAGE_EDGE },
            },
          ]
        : [];
      const result = await ImageManipulator.manipulateAsync(
        uri,
        actions as ImageManipulator.Action[],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
      );
      if (!result.uri) throw new Error('Missing processed image URI');
      navigation.replace('MealScanResult', { imageUri: result.uri, date: route.params.date, meal: route.params.meal });
    } catch { setError('Không thể xử lý ảnh. Hãy thử ảnh khác.'); } finally { setBusy(false); }
  };
  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setError(undefined);
    try {
      const picture = await (cameraRef.current as unknown as { takePictureAsync: (options?: { quality?: number }) => Promise<{ uri: string; width?: number; height?: number }> }).takePictureAsync({ quality: 0.8 });
      if (!picture.uri) throw new Error('Camera returned no image');
      await goToResult(picture.uri, picture.width, picture.height);
    } catch { setError('Không thể chụp ảnh. Hãy thử lại.'); setBusy(false); }
  };
  const chooseImage = async () => {
    if (busy) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
      if (!result.canceled && result.assets[0]) await goToResult(result.assets[0].uri, result.assets[0].width, result.assets[0].height);
    } catch { setError('Không thể mở thư viện ảnh. Hãy thử lại.'); }
  };
  const permissionDenied = permission && !permission.granted;
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
    {permissionDenied ? <View style={styles.permission}><AppText variant="title" color={theme.colors.textPrimary} align="center">Cần quyền camera</AppText><AppText color={theme.colors.textSecondary} align="center">Cho phép camera để chụp món ăn. Bạn vẫn có thể chọn ảnh từ thư viện.</AppText><AppButton label="Cho phép camera" onPress={() => { void requestPermission(); }} /><AppButton label="Chọn ảnh từ thư viện" variant="secondary" onPress={() => { void chooseImage(); }} /><AppButton label="Quét mã vạch" variant="outline" onPress={() => navigation.navigate('BarcodeScanner', route.params)} /></View> : <View style={styles.cameraWrap}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" flash={flash} zoom={zoom} />
      <ImageBackground source={images.mealScanBackground} style={StyleSheet.absoluteFill} resizeMode="cover" imageStyle={styles.backgroundImage}>
        <View style={styles.topBar}><Pressable onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Đóng camera" style={styles.iconButton}><AppText color={theme.colors.onBrand}>‹</AppText></Pressable><AppText variant="heading" color={theme.colors.onBrand}>Chụp món ăn</AppText><Pressable onPress={() => setFlash((value) => value === 'on' ? 'off' : 'on')} accessibilityRole="button" accessibilityLabel={flash === 'on' ? 'Tắt đèn flash' : 'Bật đèn flash'} style={styles.iconButton}><AppText color={theme.colors.onBrand}>⚡</AppText></Pressable></View>
        <View style={styles.viewfinder}><Image source={images.mealScanCornerTopLeft} style={[styles.corner, styles.topLeft]} /><Image source={images.mealScanCornerTopRight} style={[styles.corner, styles.topRight]} /><Image source={images.mealScanCornerBottomLeft} style={[styles.corner, styles.bottomLeft]} /><Image source={images.mealScanCornerBottomRight} style={[styles.corner, styles.bottomRight]} /></View>
        <View style={styles.hint}><AppText color={theme.colors.onBrand} align="center">Đặt món ăn vào khung hình</AppText>{error ? <AppText color={theme.colors.statusDanger} align="center" accessibilityLiveRegion="polite">{error}</AppText> : null}</View>
        <View style={styles.controls}><Pressable onPress={() => setZoom((value) => Math.max(0, value - 0.2))} accessibilityRole="button" accessibilityLabel="Thu nhỏ khung ngắm" style={styles.control}><Image source={images.mealScanScaleDown} style={styles.controlImage} /></Pressable><Pressable onPress={chooseImage} accessibilityRole="button" accessibilityLabel="Chọn ảnh từ thư viện" style={styles.gallery}><AppText color={theme.colors.onBrand}>Ảnh</AppText></Pressable><Pressable onPress={capture} disabled={busy} accessibilityRole="button" accessibilityLabel="Chụp ảnh nhận diện món ăn" style={[styles.shutter, { backgroundColor: theme.colors.onBrand }, busy && styles.disabled]}><View style={[styles.shutterInner, { backgroundColor: theme.colors.quickScanner }]} /></Pressable><Pressable onPress={() => setZoom((value) => Math.min(1, value + 0.2))} accessibilityRole="button" accessibilityLabel="Phóng to khung ngắm" style={styles.control}><Image source={images.mealScanScaleUp} style={styles.controlImage} /></Pressable></View>
        <AppButton label="Quét mã vạch" variant="secondary" onPress={() => navigation.navigate('BarcodeScanner', route.params)} style={styles.barcodeButton} />
      </ImageBackground>
    </View>}
    <Modal visible={guideVisible} transparent animationType="fade" onRequestClose={closeGuide}><View style={styles.modalBackdrop}><View style={[styles.guide, { backgroundColor: theme.colors.surfaceMid }]}><Image source={guidePage === 0 ? images.mealScanGuide01 : images.mealScanGuide02} style={styles.guideImage} resizeMode="contain" /><AppText variant="heading" color={theme.colors.textPrimary}>Mẹo chụp món ăn</AppText><AppText color={theme.colors.textSecondary}>{guidePage === 0 ? 'Chụp đủ sáng, nhìn rõ toàn bộ món ăn.' : 'Đặt camera thẳng và giữ điện thoại ổn định.'}</AppText><View style={styles.guideActions}><AppButton label={guidePage === 0 ? 'Tiếp tục' : 'Đã hiểu'} onPress={() => guidePage === 0 ? setGuidePage(1) : closeGuide()} /><AppButton label="Bỏ qua" variant="ghost" onPress={closeGuide} /></View></View></View></Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, cameraWrap: { flex: 1, backgroundColor: '#101713' }, backgroundImage: { opacity: 0.45 }, topBar: { padding: 18, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, viewfinder: { flex: 1, margin: 38, position: 'relative' }, corner: { position: 'absolute', width: 58, height: 58 }, topLeft: { top: 0, left: 0 }, topRight: { top: 0, right: 0 }, bottomLeft: { bottom: 0, left: 0 }, bottomRight: { bottom: 0, right: 0 }, hint: { minHeight: 56, alignItems: 'center', gap: 5 }, controls: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }, control: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, controlImage: { width: 28, height: 28 }, gallery: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }, shutter: { width: 74, height: 74, borderRadius: 37, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }, shutterInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#2ECC71' }, disabled: { opacity: 0.45 }, barcodeButton: { marginHorizontal: 30, marginBottom: 14 }, permission: { flex: 1, justifyContent: 'center', padding: 24, gap: 14 }, modalBackdrop: { flex: 1, backgroundColor: '#00000099', justifyContent: 'center', padding: 22 }, guide: { borderRadius: 20, padding: 18, gap: 10 }, guideImage: { width: '100%', height: 190 }, guideActions: { gap: 4, marginTop: 8 } });
