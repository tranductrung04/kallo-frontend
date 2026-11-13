import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { images } from '@/assets/images';
import { AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import type { Gender } from '../types';
import { ChoicePills } from './ChoicePills';

interface BasicInfoStepProps {
  gender: Gender;
  age: string;
  onGenderChange: (gender: Gender) => void;
  onAgeChange: (age: string) => void;
}

const genderOptions: Array<[string, string]> = [
  ['female', 'Nữ'],
  ['male', 'Nam'],
  ['other', 'Khác'],
];

export function BasicInfoStep({
  gender,
  age,
  onGenderChange,
  onAgeChange,
}: BasicInfoStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.intro}>
        <Image
          source={gender === 'female' ? images.genderFemale : images.genderMale}
          style={styles.stepImage}
          resizeMode="contain"
          accessibilityLabel="Thông tin cơ bản"
        />
        <AppText variant="title" align="center">
          Thông tin cơ bản
        </AppText>
        <AppText align="center" color={theme.colors.textMuted}>
          Chọn giới tính và nhập tuổi của bạn.
        </AppText>
      </View>

      <ChoicePills
        options={genderOptions}
        value={gender}
        onChange={(value) => onGenderChange(value as Gender)}
      />

      <AppInput
        label="Tuổi"
        value={age}
        onChangeText={onAgeChange}
        keyboardType="number-pad"
        placeholder="Ví dụ: 28"
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
