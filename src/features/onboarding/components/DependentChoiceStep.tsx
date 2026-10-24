import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { images } from '@/assets/images';
import { ChoiceStep } from './ChoiceStep';

interface DependentChoiceStepProps {
  value: string;
  onChange: (value: string) => void;
}

const dependentOptions: Array<[string, ImageSourcePropType, string]> = [
  ['me', images.dependentMe, 'Cho tôi'],
  ['sister', images.dependentSister, 'Người thân'],
  ['son', images.dependentSon, 'Con của tôi'],
];

export function DependentChoiceStep({ value, onChange }: DependentChoiceStepProps) {
  return (
    <ChoiceStep
      title="Bạn đang thiết lập cho ai?"
      options={dependentOptions}
      value={value}
      onChange={onChange}
    />
  );
}
