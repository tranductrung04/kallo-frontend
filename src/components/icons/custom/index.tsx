import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import type {
  ActivityIconProps,
  FiberIconProps,
  IconProps,
  SaltIconProps,
  ScaleIconProps,
} from '../types';

// ─── Macro & Nutrition Icons (D3: Custom multi-tone) ──────────────────────────

/** Icon Muối (Salt) — lọ rắc muối nghiêng với nắp và hạt muối rơi */
export function SaltIcon({ size = 15, color, capColor = '#FFFFFF' }: SaltIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(-45, 12, 12)">
        <Rect x="7.9" y="3.2" width="8.2" height="11.0" rx="2.2" fill={color} />
        <Rect x="8.6" y="15.3" width="6.8" height="3.4" rx="1.2" fill={capColor} />
        <Circle cx="9.6" cy="21.0" r="0.95" fill={capColor} />
        <Circle cx="14.4" cy="21.0" r="0.95" fill={capColor} />
        <Circle cx="12.0" cy="23.4" r="1.05" fill={capColor} />
      </G>
    </Svg>
  );
}

/** Icon Chất xơ (Fiber) — bông súp lơ xanh hai tông màu */
export function FiberIcon({
  size = 15,
  color,
  stalkColor = '#86EFAC',
  creaseColor = '#15803D',
}: FiberIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.2 13.5 L2.8 18.6 C2.5 19.3 2.7 20.1 3.2 20.6 L4.6 21.6 C5.2 22.0 6.0 21.9 6.4 21.3 L10.2 15.4 C8.5 15.0 6.8 14.4 5.2 13.5 Z"
        fill={stalkColor}
      />
      <Path
        d="M5.2 13.5 C2.8 13.0 2.0 10.5 2.4 8.5 C2.8 6.8 4.2 5.4 6.0 5.8 C6.8 3.8 8.8 2.4 10.8 2.5 C13.2 2.6 15.0 4.0 15.8 5.5 C18.2 5.8 21.4 7.2 21.2 9.8 C21.2 11.8 19.8 13.6 18.5 14.8 C17.2 16.2 15.0 16.5 13.5 16.0 C11.8 15.6 10.8 15.4 10.2 15.4 C8.5 15.0 6.8 14.4 5.2 13.5 Z"
        fill={color}
      />
      <Path d="M11.2 8.4 C12.8 7.5 14.8 8.0 15.8 10.0" stroke={creaseColor} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M4.8 9.6 C5.6 10.8 6.6 11.6 7.8 11.8" stroke={creaseColor} strokeWidth={1.1} strokeLinecap="round" />
      <Path d="M7.0 14.8 C8.0 15.4 9.2 15.4 10.2 14.8" stroke={creaseColor} strokeWidth={1.1} strokeLinecap="round" />
    </Svg>
  );
}

/** Icon Cân sức khỏe cá nhân */
export function ScaleIcon({ size = 22, color, innerColor }: ScaleIconProps) {
  const fillColor = color || '#F59E0B';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2} y={2} width={20} height={20} rx={6} fill={fillColor} />
      <Rect x={6} y={5} width={12} height={6} rx={2.5} fill={innerColor || '#181524'} />
      <Rect x={7.5} y={6.5} width={9} height={3} rx={1} fill="#FEF3C7" />
    </Svg>
  );
}

// ─── Activity Icons (D4: Thể thao đặc thù giữ custom) ─────────────────────────

/** Icon Chạy bộ — Người chạy nghiêng về phía trước kèm 3 vạch gió tốc độ bên trái */
export function RunningIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="1.5" y="7.6" width="4.6" height="1.5" rx="0.75" fill={color} />
      <Rect x="0.8" y="11" width="6.4" height="1.5" rx="0.75" fill={color} />
      <Rect x="2.2" y="14.4" width="4.2" height="1.5" rx="0.75" fill={color} />
      <Circle cx="17.6" cy="4.6" r="2.1" fill={color} />
      <G stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14.8 8.4 L12.6 13.4" />
        <Path d="M14.8 8.8 L17.8 11 L20 9.2" />
        <Path d="M14.6 8.8 L11.4 9.6 L9.8 12" />
        <Path d="M12.6 13.4 L16.2 15.6 L14.8 20" />
        <Path d="M12.6 13.4 L10.4 16.6 L7.4 18.6" />
      </G>
    </Svg>
  );
}

/** Icon Cầu lông — Quả cầu lông nghiêng: đế bấc ở dưới trái, tán lông vũ xòe lên phải */
export function ShuttlecockIcon({
  size = 24,
  color,
  cutoutColor = '#221D34',
}: ActivityIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(45, 12, 12)">
        <Path d="M10.2 18.2 C10.2 19.8 11 21 12 21 C13 21 13.8 19.8 13.8 18.2 Z" fill={color} />
        <Path d="M9.8 17.2 L6.2 4.8 C10 3.6 14 3.6 17.8 4.8 L14.2 17.2 Z" fill={color} />
        <Line x1="12" y1="4" x2="12" y2="17.2" stroke={cutoutColor} strokeWidth={1.1} />
        <Line x1="9.2" y1="4.4" x2="10.8" y2="17.2" stroke={cutoutColor} strokeWidth={0.9} />
        <Line x1="14.8" y1="4.4" x2="13.2" y2="17.2" stroke={cutoutColor} strokeWidth={0.9} />
        <Path d="M7.8 12 C10.5 11.5 13.5 11.5 16.2 12" stroke={cutoutColor} strokeWidth={1.1} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

/** Icon Pickleball — Vợt mặt thuôn về cán, nghiêng 45°, quả bóng tách viền ở góc trên trái */
export function PickleballIcon({
  size = 24,
  color,
  cutoutColor = '#221D34',
}: ActivityIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(45, 12, 12)">
        <Rect x="10.9" y="16" width="2.2" height="5.6" rx="1.1" fill={color} />
        <Path
          d="M7.2 8.2 C7.2 5.2 9.2 3.2 12 3.2 C14.8 3.2 16.8 5.2 16.8 8.2 C16.8 11 15.6 13 14 14.6 L13.4 16 L10.6 16 L10 14.6 C8.4 13 7.2 11 7.2 8.2 Z"
          fill={color}
        />
        <Line x1="10.2" y1="15.9" x2="13.8" y2="15.9" stroke={cutoutColor} strokeWidth={0.9} />
      </G>
      <Circle cx="6.2" cy="6.2" r="3.4" fill={cutoutColor} />
      <Circle cx="6.2" cy="6.2" r="2.4" fill={color} />
    </Svg>
  );
}

/** Icon Yoga — Người ngồi thiền khoanh chân, hai tay dang ngang đặt trên gối */
export function YogaIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="5" r="2.3" fill={color} />
      <Path
        d="M9.4 8.8 H14.6 L14 14.6 H10 Z"
        fill={color}
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path
        d="M9.8 9.8 L4.6 12.6 M14.2 9.8 L19.4 12.6"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.5 18.8 L19.5 16.2 M4.5 16.2 L19.5 18.8"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Icon Khác — Trang ghi chú có 3 dòng kèm huy hiệu 3 chấm ở góc dưới phải */
export function MoreActivitiesIcon({
  size = 24,
  color,
  cutoutColor = '#221D34',
}: ActivityIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4.5" y="3" width="14" height="15" rx="2.6" fill={color} />
      <Line x1="8" y1="7" x2="15.5" y2="7" stroke={cutoutColor} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="10.5" x2="15.5" y2="10.5" stroke={cutoutColor} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="14" x2="12" y2="14" stroke={cutoutColor} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="18" cy="18" r="4.6" fill={cutoutColor} />
      <Circle cx="18" cy="18" r="3.5" fill={color} />
      <Circle cx="16.4" cy="18" r="0.65" fill={cutoutColor} />
      <Circle cx="18" cy="18" r="0.65" fill={cutoutColor} />
      <Circle cx="19.6" cy="18" r="0.65" fill={cutoutColor} />
    </Svg>
  );
}

// ─── Brand & Gamification Custom Icons ───────────────────────────────────────

/** Logo của bên thứ ba (Health Connect) — giữ màu thương hiệu cố định theo spec của Google */
export function HealthConnectIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="#0284C7"
      />
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-1.8 0.8-3.5 2.2-4.5 1.5 2.5 4.5 5 7.8 7.5z"
        fill="#10B981"
        opacity={0.9}
      />
      <Path
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 5.42 3 3.65 4.15 2.8 5.8 4 9 7 12 12 16c3-2.5 6-5 7-8-0.3-2.8-2.5-5-5-5z"
        fill="#EF4444"
        opacity={0.85}
      />
    </Svg>
  );
}

/** Biểu tượng cờ mục tiêu kèm dấu tick trong Mục tiêu chuỗi */
export function StreakGoalFlagIcon({
  width = 34,
  height = 38,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 38" fill="none">
      <Circle cx={8} cy={6.5} r={2.5} fill="#757088" />
      <Rect x={6.75} y={7} width={2.5} height={24} rx={1.25} fill="#757088" />
      <Path
        d="M 21 11 C 23.5 11 25.5 12.5 25.5 15.5 L 25.5 18 C 25.5 21 23.5 22.5 21 22.5 Z"
        fill="#59546B"
      />
      <Rect x={8} y={9.5} width={14} height={14} rx={2.5} fill="#C4C0D4" />
      <Path
        d="M 11.8 16.5 L 14.2 19 L 18.8 13.5"
        stroke="#2D293E"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export interface CampfireFlameIconProps {
  size?: number;
  streak?: number;
  isLit?: boolean;
}

const FLAME_PATH =
  'M50 78 C32.1 78 24.4 69.2 24.4 55.5 C24.4 42.6 34.9 28.1 39.8 28.1 C41.9 28.1 43.3 29.8 44.1 30.6 C46.1 25.8 51.1 20.1 54.6 20.1 C58.1 20.1 60.2 26.6 61.6 29.8 C62.3 28.9 62.9 28.9 64.4 28.9 C69.4 28.9 75.6 42.6 75.6 55.5 C75.6 69.2 67.9 78 50 78 Z';

const CORE_PATH =
  'M49.6 74 C38.4 74 33.5 67.6 33.5 58.7 C33.5 50.7 43.3 40.2 50.4 40.2 C57.4 40.2 65.1 50.7 65.1 58.7 C65.1 67.6 60.2 74 49.6 74 Z';

export function CampfireFlameIcon({
  size = 116,
  streak = 0,
  isLit: isLitProp,
}: CampfireFlameIconProps) {
  const isLit = isLitProp !== undefined ? isLitProp : streak > 0;

  const glowLayers = isLit
    ? [
      { scale: 1.24, fill: '#C9B6F5', opacity: 0.35 },
      { scale: 1.15, fill: '#DCCDFB', opacity: 0.5 },
      { scale: 1.07, fill: '#F3ECFF', opacity: 0.75 },
    ]
    : [
      { scale: 1.24, fill: '#7A7396', opacity: 0.18 },
      { scale: 1.15, fill: '#857FA0', opacity: 0.28 },
      { scale: 1.07, fill: '#938DAE', opacity: 0.4 },
    ];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient id="fireOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FF5F52" />
          <Stop offset="100%" stopColor="#F23F3A" />
        </LinearGradient>
        <LinearGradient id="fireCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFA89D" />
          <Stop offset="100%" stopColor="#FF8278" />
        </LinearGradient>
        <LinearGradient id="ghostOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#9C97B6" />
          <Stop offset="100%" stopColor="#7E7898" />
        </LinearGradient>
      </Defs>

      <Ellipse
        cx={50}
        cy={86}
        rx={30}
        ry={4.5}
        fill={isLit ? '#3B3A6E' : '#2E2A42'}
        opacity={isLit ? 0.45 : 0.7}
      />

      {glowLayers.map((layer, i) => (
        <G
          key={i}
          transform={`translate(50 72) scale(${layer.scale}) translate(-50 -72)`}
        >
          <Path d={FLAME_PATH} fill={layer.fill} opacity={layer.opacity} />
        </G>
      ))}

      <Path
        d={FLAME_PATH}
        fill={isLit ? 'url(#fireOuterGrad)' : 'url(#ghostOuterGrad)'}
      />

      <Path
        d={CORE_PATH}
        fill={isLit ? 'url(#fireCoreGrad)' : '#E3E0EC'}
      />

      <Rect
        x={15}
        y={73.5}
        width={70}
        height={9}
        rx={4.5}
        fill={isLit ? '#6B4338' : '#5A5575'}
        transform="rotate(10 50 78)"
      />
      <Rect
        x={15}
        y={73.5}
        width={70}
        height={9}
        rx={4.5}
        fill={isLit ? '#80503F' : '#6A6585'}
        transform="rotate(-10 50 78)"
      />
      <Circle cx={20.5} cy={83.2} r={4.4} fill={isLit ? '#8E5D49' : '#716C8E'} />
      <Circle cx={79.5} cy={83.2} r={4.4} fill={isLit ? '#8E5D49' : '#716C8E'} />
    </Svg>
  );
}
