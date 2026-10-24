import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';

interface BodyMeasureStepProps {
  height: string;
  weight: string;
  onHeightChange: (height: string) => void;
  onWeightChange: (weight: string) => void;
}

export function BodyMeasureStep({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}: BodyMeasureStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.intro}>
        <Image
          source={images.weightScale}
          style={styles.stepImage}
          resizeMode="contain"
          accessibilityLabel="Chiều cao và cân nặng"
        />
        <AppText variant="title" align="center">
          Chiều cao và cân nặng
        </AppText>
        <AppText align="center" color={theme.colors.textMuted}>
          Thông tin giúp tính chỉ số cơ thể chính xác hơn.
        </AppText>
      </View>

      <AppInput
        label="Chiều cao (cm)"
        value={height}
        onChangeText={onHeightChange}
        keyboardType="decimal-pad"
        placeholder="100 - 250"
      />
      <AppInput
        label="Cân nặng (kg)"
        value={weight}
        onChangeText={onWeightChange}
        keyboardType="decimal-pad"
        placeholder="20 - 300"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  intro: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepImage: {
    width: '100%',
    height: 180,
  },
});
