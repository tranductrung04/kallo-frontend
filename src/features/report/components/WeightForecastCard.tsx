import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppCard, AppText, ProgressBar } from '@/components/common';
import { useTheme } from '@/theme';
import type { WeightForecast } from '../types';

export function WeightForecastCard({
  forecast,
}: {
  forecast: WeightForecast;
}) {
  const theme = useTheme();

  return (
    <AppCard
      style={[
        styles.card,
        {
          backgroundColor: forecast.hasEnoughData
            ? theme.colors.primarySurface
            : theme.colors.surfaceMuted,
          borderColor: forecast.hasEnoughData ? theme.colors.primary : theme.colors.border,
        },
      ]}
      accessibilityLabel="Thẻ dự báo cân nặng AI"
    >
      <View style={styles.header}>
        <Image
          source={images.reportLampIcon}
          style={styles.lampIcon}
          resizeMode="contain"
          accessibilityLabel="Biểu tượng bóng đèn thông minh"
        />
        <View style={styles.titleCol}>
          <AppText variant="heading" color={forecast.hasEnoughData ? theme.colors.primary : theme.colors.text}>
            {forecast.hasEnoughData ? 'Dự báo Xu hướng AI' : 'Mở khóa Dự báo Xu hướng'}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {forecast.hasEnoughData
              ? 'Tính toán bằng hồi quy tuyến tính trên chuỗi dữ liệu thực tế'
              : `Đã ghi ${forecast.loggedDaysCount} / ${forecast.requiredDays} ngày cân nặng`}
          </AppText>
        </View>
      </View>

      {!forecast.hasEnoughData ? (
        <View style={styles.progressSection}>
          <ProgressBar
            value={forecast.loggedDaysCount / forecast.requiredDays}
            color={theme.colors.primary}
          />
          <AppText variant="caption" color={theme.colors.textMuted}>
            {forecast.message}
          </AppText>
        </View>
      ) : (
        <View style={styles.forecastContent}>
          <AppText style={styles.messageText}>
            💡 {forecast.message}
          </AppText>

          {forecast.isCorrectDirection && forecast.estimatedDate ? (
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#FFFFFF' }]}>
                <AppText variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                  🎯 Ngày dự kiến: {forecast.estimatedDate}
                </AppText>
              </View>
              <View style={[styles.badge, { backgroundColor: '#FFFFFF' }]}>
                <AppText variant="caption" color={theme.colors.textMuted}>
                  ⚡ {forecast.weeklyRateKg} kg/tuần
                </AppText>
              </View>
            </View>
          ) : null}
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lampIcon: {
    width: 32,
    height: 32,
  },
  titleCol: {
    flex: 1,
    gap: 2,
  },
  progressSection: {
    gap: 8,
    marginTop: 2,
  },
  forecastContent: {
    gap: 10,
  },
  messageText: {
    lineHeight: 22,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
});
