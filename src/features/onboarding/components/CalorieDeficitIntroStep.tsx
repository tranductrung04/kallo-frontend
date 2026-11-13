import React from 'react';
import { images } from '@/assets/images';
import { IntroStep } from './IntroStep';

export function CalorieDeficitIntroStep() {
  return (
    <IntroStep
      image={images.deficitStep0}
      title="Hiểu về thâm hụt calo"
      text="Mục tiêu phù hợp giúp thay đổi bền vững. Kallo luôn ưu tiên giới hạn an toàn."
    />
  );
}
