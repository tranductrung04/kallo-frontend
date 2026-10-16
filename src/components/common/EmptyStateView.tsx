import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images, type ImageKey } from '@/assets/images';
import { useTheme } from '@/theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export type EmptyVariant = 'empty' | 'search' | 'favorite' | 'mealPlan';
export type EmptyStateViewProps = { variant?: EmptyVariant; title: string; message?: string; actionLabel?: string; onAction?: () => void; testID?: string };
const variantAssets: Record<EmptyVariant, ImageKey> = { empty: 'emptyState', search: 'searchNotFound', favorite: 'favoriteFoodEmpty', mealPlan: 'mealPlanEmpty' };
export function EmptyStateView({ variant = 'empty', title, message, actionLabel, onAction, testID }: EmptyStateViewProps) { const theme = useTheme(); return <View testID={testID} style={styles.container}><Image source={images[variantAssets[variant]]} style={styles.image} resizeMode="contain" accessibilityIgnoresInvertColors accessibilityLabel={title} /><AppText variant="heading" align="center">{title}</AppText>{message ? <AppText color={theme.colors.textMuted} align="center" style={styles.message}>{message}</AppText> : null}{actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} /> : null}</View>; }
const styles = StyleSheet.create({ container: { alignItems: 'center', gap: 12, padding: 24 }, image: { width: 150, height: 110 }, message: { maxWidth: 280 } });
