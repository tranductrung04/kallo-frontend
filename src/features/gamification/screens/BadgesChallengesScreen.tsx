import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { ChallengesScreen } from './ChallengesScreen';
import { BadgesScreen } from './BadgesScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'BadgesChallenges'>;

export function BadgesChallengesScreen({ navigation, route }: Props) {
  const initialTab = route?.params?.initialTab ?? 'challenges';

  if (initialTab === 'badges') {
    return <BadgesScreen navigation={navigation} />;
  }

  return <ChallengesScreen navigation={navigation} />;
}
