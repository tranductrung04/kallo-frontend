import React from 'react';
import { images } from '@/assets/images';
import { IntroStep } from './IntroStep';

export function WelcomeMascotStep() {
  return (
    <IntroStep
      image={images.onboardingMascot}
      title="Chào mừng bạn đến Kallo"
      text="Cùng xây dựng thói quen khỏe mạnh từng ngày."
    />
  );
}
