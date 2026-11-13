import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppInput, AppText } from '@/components/common';
import { useTheme } from '@/theme';
import { COMMON_ALLERGIES } from '../types';
import { ChoicePills } from './ChoicePills';

interface AllergiesStepProps {
  allergies: string[];
  customAllergy: string;
  onToggleAllergy: (allergy: string) => void;
  onCustomAllergyChange: (value: string) => void;
  onAddCustomAllergy: () => void;
}

const allergyOptions: Array<[string, string]> = COMMON_ALLERGIES.map((item) => [item, item]);

export function AllergiesStep({
  allergies,
  customAllergy,
  onToggleAllergy,
  onCustomAllergyChange,
  onAddCustomAllergy,
}: AllergiesStepProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <AppText variant="heading">Dị ứng hoặc kiêng kỵ</AppText>
      <AppText color={theme.colors.textMuted}>
        Chọn mọi thành phần bạn muốn tránh.
      </AppText>

      <ChoicePills
        options={allergyOptions}
        value=""
        multi
        values={allergies}
        onChange={onToggleAllergy}
      />

      <AppInput
        label="Thành phần khác"
        value={customAllergy}
        onChangeText={onCustomAllergyChange}
        placeholder="Nhập và bấm Thêm"
      />

      <AppButton
        label="Thêm dị ứng"
        variant="outline"
        onPress={onAddCustomAllergy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
});
