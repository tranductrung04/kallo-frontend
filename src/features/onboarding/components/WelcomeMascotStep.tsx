import React from 'react';
import { images } from '@/assets/images';
import { IntroStep } from './IntroStep';
import { ChampionMascotRNPro } from './ChampionMascotRNPro';

export function WelcomeMascotStep() {
  return (
    <IntroStep
      image={images.onboardingMascot}
      title="Chào mừng bạn đến Kallo"
      text="Cùng xây dựng thói quen khỏe mạnh từng ngày."
      renderIllustration={() => (
        <ChampionMascotRNPro
          size={220}
          mode="idle"
          interactive={true}
          accessibilityLabel="Linh vật chào mừng Kallo"
        />
      )}
    />
  );
}
