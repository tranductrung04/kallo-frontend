// ─── HomeIcons — SVG icons for the Home Dashboard ─────────────────────────────
// Màu luôn được truyền từ theme (theme.colors.*) thay vì hardcode hex.
// Có thể dùng lại ở các màn khác (Diary, Report...) hoặc chuyển sang
// src/components/icons/ nếu muốn dùng chung toàn app.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

export type IconProps = {
  size?: number;
  color: string;
};

export function FlameIcon({ size = 16, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 23c-4.97 0-9-3.8-9-8.5C3 8.5 9 2 9 2s-.5 4.5 2 6c1.6-2.5 3-5 3-5s6 6.5 6 11.5c0 4.7-4.03 8.5-9 8.5zm0-4c2.21 0 4-1.79 4-4 0-2.5-2.5-4.5-2.5-4.5s-.5 1.5-1.5 2c-1.5 1-2 2-2 3.5 0 1.66 1.34 3 2 3z" />
    </Svg>
  );
}

export function CalendarIcon({ size = 18, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x={3} y={4} width={18} height={18} rx={4} />
      <Line x1={16} y1={2} x2={16} y2={6} />
      <Line x1={8} y1={2} x2={8} y2={6} />
      <Line x1={3} y1={10} x2={21} y2={10} />
    </Svg>
  );
}

export function FlagIcon({ size = 13, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
    </Svg>
  );
}

export function CutleryIcon({ size = 14, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M7.5 2c-1.9 0-3 1.9-3 4.5 0 2.4 1.1 3.9 1.9 4.8v9.7c0 .6.4 1 1 1s1-.4 1-1v-9.7c.8-.9 1.9-2.4 1.9-4.8C10.3 3.9 9.2 2 7.5 2z" />
      <Path d="M13.8 2.5v4.2c0 .4.3.7.6.7s.6-.3.6-.7V2.5c0-.3.3-.5.6-.5s.6.2.6.5v4.2c0 .4.3.7.6.7s.6-.3.6-.7V2.5c0-.3.3-.5.6-.5s.6.2.6.5v4.8c0 1.9-1 3.1-1.7 3.9v9.8c0 .6-.4 1-1 1s-1-.4-1-1v-9.8c-.7-.8-1.7-2-1.7-3.9v-4.8c0-.3.3-.5.6-.5s.7.2.7.5z" />
    </Svg>
  );
}

export function LightningIcon({ size = 13, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M13 2L4.5 13h5.5l-1 9 9.5-11.5h-5.5L13 2z" />
    </Svg>
  );
}

export function WheatIcon({ size = 15, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(45, 12, 12)">
        {/* Short stem stalk */}
        <Path d="M 12 16 L 12 21.6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        {/* 3 delicate awn whiskers at the apex */}
        <Path d="M 12 3.2 L 12 1.0" stroke={color} strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 11.2 3.8 L 9.4 1.8" stroke={color} strokeWidth={0.7} strokeLinecap="round" />
        <Path d="M 12.8 3.8 L 14.6 1.8" stroke={color} strokeWidth={0.7} strokeLinecap="round" />

        {/* Plump scalloped grain spike silhouette */}
        <Path
          d="M 12 3.2 C 13.0 4.2 14.4 5.2 15.0 6.6 C 15.4 7.6 14.8 8.6 14.0 9.0 C 15.6 9.8 17.0 11.0 16.8 12.6 C 16.6 13.8 15.5 14.4 14.5 14.6 C 15.2 15.2 15.4 16.2 14.5 16.8 C 13.6 17.4 12.6 17.2 12.0 17.0 C 11.4 17.2 10.4 17.4 9.5 16.8 C 8.6 16.2 8.8 15.2 9.5 14.6 C 8.5 14.4 7.4 13.8 7.2 12.6 C 7.0 11.0 8.4 9.8 10.0 9.0 C 9.2 8.6 8.6 7.6 9.0 6.6 C 9.6 5.2 11.0 4.2 12 3.2 Z"
          fill={color}
        />

        {/* Depth crease lines between grains */}
        <Path d="M 12 6.8 L 12 16.8" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 12 8.6 C 10.8 7.8 9.8 7.2 8.8 7.0" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 12 8.6 C 13.2 7.8 14.2 7.2 15.2 7.0" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 12 12.0 C 10.5 11.2 9.0 10.6 7.4 10.4" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 12 12.0 C 13.5 11.2 15.0 10.6 16.6 10.4" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 12 15.0 C 10.8 14.4 9.8 13.8 8.8 13.6" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
        <Path d="M 12 15.0 C 13.2 14.4 14.2 13.8 15.2 13.6" stroke="#1D4ED8" strokeWidth={0.8} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

export const LeafIcon = WheatIcon;

export function DropletIcon({ size = 13, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </Svg>
  );
}

export function CloudAddIcon({ size = 38, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      <Line x1={12} y1={11} x2={12} y2={17} />
      <Line x1={9} y1={14} x2={15} y2={14} />
    </Svg>
  );
}

export function RunningIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={13.5} cy={4.5} r={2.2} />
      <Path d="M13.5 8c-.6 0-1.2.2-1.7.5L8.5 10.8c-.5.3-.8.9-.7 1.5.1.6.6 1.1 1.2 1.1.2 0 .4 0 .6-.1l2.4-1.3v4.2l-3.3 2c-.6.3-.8 1.1-.5 1.7.3.6 1.1.8 1.7.5l4-2.4c.4-.2.6-.6.6-1.1V12l2.3 2.3c.4.4 1 .5 1.5.2.5-.3.8-.9.6-1.5l-1.3-3.6c-.4-.9-1.2-1.4-2.2-1.4h-1.3z" />
    </Svg>
  );
}

export function BicycleIcon({ size = 22, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx={5.5} cy={17.5} r={3.5} />
      <Circle cx={18.5} cy={17.5} r={3.5} />
      <Path d="M15 6h-3l-3 7h6.5l2-4.5H19" />
      <Path d="M12 17.5V14l-3-3" />
      <Circle cx={12} cy={5} r={1} fill={color} />
    </Svg>
  );
}

export function ShuttlecockIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={18} r={3.5} />
      <Path d="M8.5 15.5L6 6.5l4 1.5 2-4.5 2 4.5 4-1.5-2.5 9h-7z" fill="none" stroke={color} strokeWidth={1.8} />
      <Line x1={8} y1={11} x2={16} y2={11} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function PickleballIcon({ size = 22, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x={5} y={3} width={12} height={13} rx={5} />
      <Path d="M11 16v6" strokeWidth={3} />
      <Circle cx={18.5} cy={6.5} r={2} fill={color} stroke="none" />
    </Svg>
  );
}

export function YogaIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={4} r={2.5} />
      <Path d="M12 8c-1.5 0-2.8.8-3.5 2l-3 5.5c-.3.5-.1 1.2.4 1.5.5.3 1.2.1 1.5-.4l2.6-4.8V16l-3.5 1.5c-.5.2-.8.8-.6 1.3.2.5.8.8 1.3.6L12 17.5l4.4 1.9c.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3L13.5 16v-4.2l2.6 4.8c.3.5 1 .7 1.5.4.5-.3.7-1 .4-1.5l-3-5.5C14.3 8.8 13.5 8 12 8z" />
    </Svg>
  );
}

export function MoreActivitiesIcon({ size = 22, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x={4} y={4} width={16} height={16} rx={3} />
      <Line x1={8} y1={9} x2={16} y2={9} />
      <Line x1={8} y1={13} x2={16} y2={13} />
      <Line x1={8} y1={17} x2={12} y2={17} />
    </Svg>
  );
}

/** Logo của bên thứ ba (Health Connect) — giữ màu thương hiệu cố định, không theo theme. */
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

/** `color` là màu nền icon, `innerColor` là màu mặt số bên trong (thường là màu surface của card). */
export function ScaleIcon({ size = 18, color, innerColor }: IconProps & { innerColor: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Rect x={3} y={3} width={18} height={18} rx={5} fill={color} />
      <Circle cx={12} cy={9} r={3} fill={innerColor} />
      <Line x1={12} y1={9} x2={13.5} y2={7.5} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function EmptyCupIcon({ size = 18, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M5 3h14l-2 17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 3z" />
    </Svg>
  );
}

export function FullCupIcon({ size = 18, color }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M5 3h14l-2 17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 3z" />
      <Path d="M6 10h12" stroke={color} strokeWidth={1.5} />
      <Line x1={12} y1={13} x2={12} y2={17} stroke={color} strokeWidth={1.8} />
      <Line x1={10} y1={15} x2={14} y2={15} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

export function PlusIcon({ size = 14, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round">
      <Line x1={12} y1={5} x2={12} y2={19} />
      <Line x1={5} y1={12} x2={19} y2={12} />
    </Svg>
  );
}

export function SaltIcon({ size = 15, color = '#FDE68A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(-45, 12, 12)">
        {/* Shaker body with pale warm yellow fill */}
        <Rect x="7.9" y="3.2" width="8.2" height="11.0" rx="2.2" fill={color} />
        {/* White shaker cap */}
        <Rect x="8.6" y="15.3" width="6.8" height="3.4" rx="1.2" fill="#FFFFFF" />
        {/* 3 falling white salt specks */}
        <Circle cx="9.6" cy="21.0" r="0.95" fill="#FFFFFF" />
        <Circle cx="14.4" cy="21.0" r="0.95" fill="#FFFFFF" />
        <Circle cx="12.0" cy="23.4" r="1.05" fill="#FFFFFF" />
      </G>
    </Svg>
  );
}

export function SugarIcon({ size = 15, color = '#38BDF8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <G transform="rotate(-45, 12, 12)">
        {/* Left twist wrapper (flared fan with scalloped ruffles) */}
        <Path
          d="M 6.8 10.8 C 5.8 10.2 4.2 9.0 3.0 8.4 C 2.4 8.1 1.8 8.6 2.0 9.2 L 2.4 10.6 C 1.8 11.2 1.8 12.8 2.4 13.4 L 2.0 14.8 C 1.8 15.4 2.4 15.9 3.0 15.6 C 4.2 15.0 5.8 13.8 6.8 13.2 Z"
        />
        {/* Right twist wrapper (symmetrical to left) */}
        <Path
          d="M 17.2 10.8 C 18.2 10.2 19.8 9.0 21.0 8.4 C 21.6 8.1 22.2 8.6 22.0 9.2 L 21.6 10.6 C 22.2 11.2 22.2 12.8 21.6 13.4 L 22.0 14.8 C 22.2 15.4 21.6 15.9 21.0 15.6 C 19.8 15.0 18.2 13.8 17.2 13.2 Z"
        />
        {/* Plump rounded candy body */}
        <Rect x="6.0" y="7.4" width="12.0" height="9.2" rx="4.6" />
      </G>
    </Svg>
  );
}

export function FiberIcon({ size = 15, color = '#4ADE80' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Stalk: Pale mint green (#86EFAC), angled towards bottom-left */}
      <Path
        d="M5.2 13.5 L2.8 18.6 C2.5 19.3 2.7 20.1 3.2 20.6 L4.6 21.6 C5.2 22.0 6.0 21.9 6.4 21.3 L10.2 15.4 C8.5 15.0 6.8 14.4 5.2 13.5 Z"
        fill="#86EFAC"
      />
      {/* Crown: Puffy broccoli floret cloud */}
      <Path
        d="M5.2 13.5 C2.8 13.0 2.0 10.5 2.4 8.5 C2.8 6.8 4.2 5.4 6.0 5.8 C6.8 3.8 8.8 2.4 10.8 2.5 C13.2 2.6 15.0 4.0 15.8 5.5 C18.2 5.8 21.4 7.2 21.2 9.8 C21.2 11.8 19.8 13.6 18.5 14.8 C17.2 16.2 15.0 16.5 13.5 16.0 C11.8 15.6 10.8 15.4 10.2 15.4 C8.5 15.0 6.8 14.4 5.2 13.5 Z"
        fill={color}
      />
      {/* Texture crease lines inside florets */}
      <Path
        d="M11.2 8.4 C12.8 7.5 14.8 8.0 15.8 10.0"
        stroke="#15803D"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <Path
        d="M4.8 9.6 C5.6 10.8 6.6 11.6 7.8 11.8"
        stroke="#15803D"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      <Path
        d="M7.0 14.8 C8.0 15.4 9.2 15.4 10.2 14.8"
        stroke="#15803D"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
    </Svg>
  );
}
