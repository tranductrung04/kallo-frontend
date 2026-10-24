import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton, AppText } from '@/components/common';
import type { RootStackParamList } from '@/navigation/types';
import { images } from '@/assets/images';
import { getFoodByBarcode, type BarcodeFoodResponse } from '../api';
import { useTheme } from '@/theme';

const INTRO_KEY = '@kallo/barcode-scan-intro-seen';
type Props = NativeStackScreenProps<RootStackParamList, 'BarcodeScanner'>;

export function BarcodeScannerScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [introVisible, setIntroVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const scannedRef = useRef(false);
  useEffect(() => { void AsyncStorage.getItem(INTRO_KEY).then((value) => { if (value !== 'true') setIntroVisible(true); }).catch(() => undefined); }, []);
  const closeIntro = () => { setIntroVisible(false); void AsyncStorage.setItem(INTRO_KEY, 'true').catch(() => undefined); };
  const scan = async ({ data }: BarcodeScanningResult) => {
    const code = data.trim().replace(/\s/g, '');
    if (scannedRef.current || busy || !/^\d{8,14}$/.test(code)) return;
    scannedRef.current = true; setBusy(true); setError(undefined);
    try {
      const response = await getFoodByBarcode(code);
      const body: BarcodeFoodResponse = response.data;
      const food = 'id' in body ? body : body.data;
      if (food) navigation.replace('FoodDetail', { foodId: food.id, date: route.params.date, meal: route.params.meal, source: 'BARCODE' });
      else navigation.replace('CustomFoodForm', { date: route.params.date, meal: route.params.meal, barcode: code });
    } catch (requestError) {
      const status = (requestError as { response?: { status?: number } }).response?.status;
      if (status === 404) navigation.replace('CustomFoodForm', { date: route.params.date, meal: route.params.meal, barcode: code });
      else { setError('Không thể tra cứu mã vạch. Kiểm tra mạng và thử lại.'); scannedRef.current = false; }
    } finally { setBusy(false); }
  };
  const denied = permission && !permission.granted;
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.canvasBase }]}>
    {denied ? <View style={[styles.center, { backgroundColor: theme.colors.canvasBase }]}><AppText variant="title" color={theme.colors.textPrimary} align="center">Cần quyền camera</AppText><AppText color={theme.colors.textSecondary} align="center">Cho phép camera để quét mã vạch sản phẩm.</AppText><AppButton label="Cho phép camera" onPress={() => { void requestPermission(); }} /><AppButton label="Quay lại AI Meal Scan" variant="outline" onPress={navigation.goBack} /></View> : <View style={styles.camera}><CameraView style={StyleSheet.absoluteFill} facing="back" flash={flash} onBarcodeScanned={busy ? undefined : scan} barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }} /><ImageBackground source={images.barcodeScanGrid} style={StyleSheet.absoluteFill} resizeMode="cover" imageStyle={styles.grid}><View style={styles.top}><Pressable onPress={navigation.goBack} accessibilityRole="button" accessibilityLabel="Đóng quét mã vạch" style={styles.icon}><AppText color={theme.colors.onBrand}>‹</AppText></Pressable><AppText variant="heading" color={theme.colors.onBrand}>Quét mã vạch</AppText><Pressable onPress={() => setFlash((value) => value === 'on' ? 'off' : 'on')} accessibilityRole="button" accessibilityLabel="Bật hoặc tắt đèn flash" style={styles.icon}><AppText color={theme.colors.onBrand}>⚡</AppText></Pressable></View><View style={[styles.scanArea, { borderColor: theme.colors.quickScanner }]}><Image source={images.barcodeScanLine} style={styles.line} /></View><AppText color={theme.colors.onBrand} align="center">Đưa mã vạch vào vùng quét</AppText>{error ? <AppText color={theme.colors.statusDanger} align="center" accessibilityLiveRegion="polite">{error}</AppText> : null}<AppButton label="Quay lại AI Meal Scan" variant="secondary" onPress={navigation.goBack} style={styles.backButton} /></ImageBackground></View>}
    {introVisible ? <View style={styles.overlay}><View style={[styles.intro, { backgroundColor: theme.colors.surfaceMid }]}><Image source={images.barcodeScanIntro} style={styles.introImage} resizeMode="contain" /><AppText variant="heading" color={theme.colors.textPrimary}>Quét mã sản phẩm</AppText><AppText color={theme.colors.textSecondary}>Giữ mã vạch trong khung để tra cứu món ăn nhanh.</AppText><AppButton label="Đã hiểu" onPress={closeIntro} /></View></View> : null}
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, camera: { flex: 1, backgroundColor: '#101713' }, grid: { opacity: 0.55 }, top: { padding: 18, paddingTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, icon: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, scanArea: { height: 180, marginHorizontal: 30, marginTop: 150, borderWidth: 2, borderColor: '#2ECC71', borderRadius: 16, overflow: 'hidden', alignItems: 'center' }, line: { width: '100%', height: 4, marginTop: 88 }, backButton: { marginHorizontal: 30, marginTop: 18 }, center: { flex: 1, justifyContent: 'center', padding: 24, gap: 14 }, overlay: { ...StyleSheet.absoluteFill, backgroundColor: '#00000099', justifyContent: 'center', padding: 22 }, intro: { borderRadius: 20, padding: 18, gap: 10 }, introImage: { width: '100%', height: 180 } });
