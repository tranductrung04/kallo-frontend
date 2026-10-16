import React from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type LoadingOverlayProps = { visible: boolean; message?: string; appointment?: boolean; onRequestClose?: () => void; testID?: string };
export function LoadingOverlay({ visible, message = 'Đang tải...', appointment = false, onRequestClose, testID }: LoadingOverlayProps) {
  const theme = useTheme();
  if (!visible) return null;
  return <Modal visible transparent animationType="fade" accessibilityViewIsModal accessibilityLabel="Đang tải" onRequestClose={onRequestClose}>
    <View style={styles.backdrop}>
      <View testID={testID} accessibilityLiveRegion="polite" style={[styles.panel, { backgroundColor: theme.colors.surface }]}>
        <Image source={appointment ? images.appointmentLoading : images.loading} style={styles.image} resizeMode="contain" accessibilityLabel="Đang tải" />
        <ActivityIndicator color={theme.colors.primary} />
        <AppText variant="bodyMedium" align="center">{message}</AppText>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({ backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }, panel: { width: 220, minHeight: 190, borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 12 }, image: { width: 92, height: 72 } });
