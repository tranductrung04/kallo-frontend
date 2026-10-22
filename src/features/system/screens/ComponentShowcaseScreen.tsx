import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '@/assets/images';
import { AppButton, AppCard, AppInput, AppText, CircularProgress, EmptyStateView, LoadingOverlay, ProgressBar, StatusBanner } from '@/components/common';
import { useTheme } from '@/theme';

export function ComponentShowcaseScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const swatches = [
    ['Action', theme.colors.brandAction],
    ['Primary', theme.colors.brandPrimary],
    ['Secondary', theme.colors.brandSecondary],
    ['Protein', theme.colors.macroProtein],
    ['Carbs', theme.colors.macroCarbs],
    ['Fat', theme.colors.macroFats],
    ['Water', theme.colors.trackerWater],
    ['Streak', theme.colors.vipStreak],
    ['Warning', theme.colors.statusWarning],
    ['Danger', theme.colors.statusDanger],
  ] as const;
  return <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}><ScrollView contentContainerStyle={[styles.content, { paddingBottom: 20 + insets.bottom }]}><View style={styles.header}><View style={styles.flex}><AppText variant="title">Component Showcase</AppText><AppText color={theme.colors.textMuted}>Bộ UI Kit Nocturne & Daylight</AppText></View><AppButton label={theme.scheme === 'dark' ? 'Sáng' : 'Tối'} variant="outline" onPress={theme.toggleScheme} accessibilityLabel="Đổi chế độ sáng tối" /></View>
    <Section title="Màu thương hiệu & Trạng thái"><View style={styles.swatches}>{swatches.map(([name, color]) => <View key={name} style={styles.swatch}><View style={[styles.color, { backgroundColor: color }]} /><AppText variant="caption">{name}</AppText></View>)}</View></Section>
    <Section title="Status Banners (Cảnh báo)"><StatusBanner type="warning" title="Cảnh báo thâm hụt calo" message="Mục tiêu calo hàng ngày thấp hơn BMR khuyến nghị." /><StatusBanner type="danger" title="Phát hiện chất gây dị ứng" message="Món ăn chứa đậu phộng, trùng với danh mục dị ứng của bạn." /></Section>
    <Section title="Typography"><AppText variant="display">Display 32</AppText><AppText variant="title">Title 24</AppText><AppText variant="heading">Heading 18</AppText><AppText>Body hỗ trợ tiếng Việt có dấu</AppText><AppText variant="caption" color={theme.colors.textMuted}>Caption / số 123.456</AppText></Section>
    <Section title="Buttons"><View style={styles.row}><AppButton label="Primary" onPress={() => undefined} /><AppButton label="Secondary" variant="secondary" onPress={() => undefined} /></View><View style={styles.row}><AppButton label="Outline" variant="outline" onPress={() => undefined} /><AppButton label="Ghost" variant="ghost" onPress={() => undefined} /></View><AppButton label="Đang tải" loading onPress={() => undefined} /></Section>
    <Section title="Input"><AppInput label="Email" placeholder="you@example.com" keyboardType="email-address" /><AppInput label="Mật khẩu" placeholder="Nhập mật khẩu" secureTextEntry /><AppInput label="Ví dụ lỗi" value="sai dữ liệu" error="Email không đúng định dạng" onChangeText={() => undefined} /></Section>
    <Section title="Cards & Progress"><AppCard><AppText variant="heading">AppCard</AppText><AppText color={theme.colors.textMuted}>Nền surface theo theme.</AppText><ProgressBar value={0.72} color={theme.colors.protein} style={styles.progress} /></AppCard><View style={styles.centerRow}><CircularProgress value={0.72} label="Mục tiêu" color={theme.colors.water} /><CircularProgress value={1.1} label="Clamped" color={theme.colors.primary} /></View></Section>
    <Section title="Empty states"><EmptyStateView variant="empty" title="Chưa có nhật ký" message="Bắt đầu ghi món ăn đầu tiên." /><EmptyStateView variant="search" title="Không tìm thấy" message="Thử từ khóa khác." /><EmptyStateView variant="favorite" title="Chưa có món yêu thích" message="Lưu món thường dùng để truy cập nhanh." /><EmptyStateView variant="mealPlan" title="Chưa có thực đơn" message="Thực đơn AI sẽ có ở Phase 6." /></Section>
    <Section title="Assets"><View style={styles.assetRow}><Image source={images.logoWhite} style={[styles.logo, { backgroundColor: theme.colors.primary }]} /><Image source={images.waoLogo} style={styles.logo} /></View><AppButton label="Hiện LoadingOverlay" onPress={() => setLoading(true)} accessibilityLabel="Hiện trạng thái đang tải" /></Section>
    <LoadingOverlay visible={loading} message="Đang kiểm tra giao diện..." onRequestClose={() => setLoading(false)} /></ScrollView>
  </SafeAreaView>;
}
function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  const theme = useTheme();
  return <View style={styles.section} accessibilityLabel={title}>
    <AppText variant="heading" color={theme.colors.primaryPressed}>{title}</AppText>
    {children}
  </View>;
}
const styles = StyleSheet.create({ safe: { flex: 1 }, content: { padding: 20, gap: 24 }, header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, flex: { flex: 1 }, section: { gap: 12 }, row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' }, swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, swatch: { width: 78, alignItems: 'center', gap: 4 }, color: { width: 48, height: 48, borderRadius: 24 }, progress: { marginTop: 14 }, centerRow: { flexDirection: 'row', justifyContent: 'space-around' }, assetRow: { flexDirection: 'row', alignItems: 'center', gap: 20 }, logo: { width: 92, height: 52, resizeMode: 'contain' } });
