import React from 'react';
import {
  BicycleIcon,
  DumbbellIcon,
  FootprintsIcon,
  LightningBoltIcon,
  MoreActivitiesIcon,
  PickleballIcon,
  RunningIcon,
  ShuttlecockIcon,
  TrophyIcon,
  WavesIcon,
  YogaIcon,
} from '@/components/icons';
import type { ActivityType } from '../types';

export interface ActivityTypeIconProps {
  type: ActivityType;
  size?: number;
  color: string;
}

export function ActivityTypeIcon({ type, size = 22, color }: ActivityTypeIconProps) {
  switch (type) {
    case 'walking':
      return <FootprintsIcon size={size} color={color} />;
    case 'running':
      return <RunningIcon size={size} color={color} />;
    case 'cycling':
      return <BicycleIcon size={size} color={color} />;
    case 'swimming':
      return <WavesIcon size={size} color={color} />;
    case 'gym':
      return <DumbbellIcon size={size} color={color} />;
    case 'yoga':
      return <YogaIcon size={size} color={color} />;
    case 'badminton':
      return <ShuttlecockIcon size={size} color={color} />;
    case 'pickleball':
      return <PickleballIcon size={size} color={color} />;
    case 'football':
      return <TrophyIcon size={size} color={color} />;
    case 'jump_rope':
      return <LightningBoltIcon size={size} color={color} />;
    case 'other':
    default:
      return <MoreActivitiesIcon size={size} color={color} />;
  }
}
