import React from 'react';
import { Image } from 'react-native';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import Svg, {
  Circle,
  Ellipse,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type {
  ActivityIconProps,
  BowlFoodPlusIconProps,
  CelebrationPopperBadgeProps,
  EmptyFolderIllustrationProps,
  FiberIconProps,
  IconProps,
  KalloShieldIconProps,
  MilestoneCalendarBadgeProps,
  RecipeBookPlusIconProps,
  SaladBowlIconProps,
  SaltIconProps,
  ScaleIconProps,
  WaoShieldIconProps,
  WheatIconProps,
} from './types';

// ─── Navigation & Tab Icons ──────────────────────────────────────────────────

/** Icon Trang chủ trên bottom tab bar */
export function HomeTabIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2.3c1.5 0 2.8.8 3.8 1.7l4.4 4.3c.8.7 1.3 1.7 1.3 2.7v8.5c0 1.1-.9 2-2 2h-2.5c-1.1 0-2-.9-2-2v-5.5c0-1.4-1.2-2.5-3-2.5s-3 1.1-3 2.5V19.5c0 1.1-.9 2-2 2H4.5c-1.1 0-2-.9-2-2v-8.5c0-1 .5-2 1.3-2.7l4.4-4.3c1-.9 2.3-1.7 3.8-1.7z" />
    </Svg>
  );
}
export const HomeIcon = HomeTabIcon;

/** Icon Nhật ký dinh dưỡng (thìa & dĩa) trên bottom tab bar */
export function DiaryTabIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {/* Muỗng / Spoon */}
      <Path d="M8 2c-2.2 0-3.5 2.2-3.5 5.2 0 2.8 1.3 4.6 2.2 5.6v7.9c0 .7.6 1.3 1.3 1.3s1.3-.6 1.3-1.3v-7.9c.9-1 2.2-2.8 2.2-5.6C11.5 4.2 10.2 2 8 2z" />
      {/* Nĩa 3 răng / Fork */}
      <Path d="M14.1 2c.4 0 .7.3.7.7v4.8c0 .5.3.8.65.8s.65-.3.65-.8V2.7c0-.4.3-.7.6-.7s.6.3.6.7v4.8c0 .5.3.8.65.8s.65-.3.65-.8V2.7c0-.4.3-.7.7-.7s.5.3.5.7v5.5c0 2.3-1 3.6-1.8 4.6v7.9c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3v-7.9c-.8-1-1.8-2.3-1.8-4.6V2.7c0-.4.2-.7.5-.7z" />
    </Svg>
  );
}
export const DiaryIcon = DiaryTabIcon;

/** Icon Thực đơn / Kế hoạch bữa ăn trên bottom tab bar */
export function MealPlanTabIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 2h3c.8 0 1.5.7 1.5 1.5V4.5h2c1.7 0 3 1.3 3 3v11c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3v-11c0-1.7 1.3-3 3-3h2V3.5c0-.8.7-1.5 1.5-1.5zM9.8 5.6h4.4c.3 0 .6.3.6.6s-.3.6-.6.6H9.8c-.3 0-.6-.3-.6-.6s.3-.6.6-.6zM7.2 10c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm3.6.2h5.9c.4 0 .8.4.8.8s-.4.8-.8.8h-5.9c-.4 0-.8-.4-.8-.8s.4-.8.8-.8zm-3.6 4.3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm3.6.2h5.9c.4 0 .8.4.8.8s-.4.8-.8.8h-5.9c-.4 0-.8-.4-.8-.8s.4-.8.8-.8z"
      />
    </Svg>
  );
}
export const MealPlanIcon = MealPlanTabIcon;

/** Icon Tài khoản cá nhân trên bottom tab bar */
export function ProfileTabIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={7} r={4.5} />
      <Path d="M12 13.5c3.5 0 6.5 1.3 8 3 .5.6.7 1.3.7 2v2c0 .7-.6 1.3-1.3 1.3H4.6c-.7 0-1.3-.6-1.3-1.3v-2c0-.7.2-1.4.7-2 1.5-1.7 4.5-3 8-3z" />
    </Svg>
  );
}
export const ProfileIcon = ProfileTabIcon;

// ─── Header, Macro & Metabolic Icons ─────────────────────────────────────────

export function FlameIcon({
  size = 16,
  color = "#F44E42",
  coreColor = "#FA9A91"
}: IconProps & { coreColor?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Flame Path (Ngọn lửa ngoài) */}
      <Path
        d="M12 21.8C6.5 21.8 4.1 19.2 4.1 15C4.1 11.2 7.3 6.8 8.9 6.8C9.5 6.8 9.9 7.3 10.1 7.5C10.8 6.1 12.2 4.4 13.3 4.4C14.4 4.4 15.1 6.3 15.5 7.3C15.7 7 15.9 7 16.4 7C17.9 7 19.8 11.2 19.8 15C19.8 19.2 17.4 21.8 12 21.8Z"
        fill={color}
      />

      {/* Core Path (Lõi lửa bên trong) */}
      <Path
        d="M11.8 20.6C8.4 20.6 6.9 18.7 6.9 16C6.9 13.6 9.9 10.4 12 10.4C14.2 10.4 16.5 13.6 16.5 16C16.5 18.7 15.1 20.6 11.8 20.6Z"
        fill={coreColor}
      />
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

/** Icon Chất đạm (Protein) — tia sét */
export function LightningIcon({ size = 13, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M13 2L4.5 13h5.5l-1 9 9.5-11.5h-5.5L13 2z" />
    </Svg>
  );
}

/** Icon Đường bột (Carbs) — bông lúa mì nghiêng 45°, các hạt tách rời */
export function WheatIcon({ size = 15, color = '#3B82F6', creaseColor }: WheatIconProps) {
  const crease = creaseColor || '#1D4ED8';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(45, 12, 12)">
        {/* Cuống + trục bông */}
        <Path d="M 12 8.5 L 12 21.8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />

        {/* Hạt trên cùng (chóp) */}
        <Path
          d="M 12 2.2 C 13.5 3.8 13.7 6 12 8.2 C 10.3 6 10.5 3.8 12 2.2 Z"
          fill={color}
        />

        {/* Cặp hạt 1 */}
        <Path d="M 11.5 10.6 C 8.8 10.2 7.6 8 7.8 6 C 10.2 6.4 11.7 8.2 11.5 10.6 Z" fill={color} />
        <Path d="M 12.5 10.6 C 15.2 10.2 16.4 8 16.2 6 C 13.8 6.4 12.3 8.2 12.5 10.6 Z" fill={color} />

        {/* Cặp hạt 2 */}
        <Path d="M 11.5 14 C 8.8 13.6 7.6 11.4 7.8 9.4 C 10.2 9.8 11.7 11.6 11.5 14 Z" fill={color} />
        <Path d="M 12.5 14 C 15.2 13.6 16.4 11.4 16.2 9.4 C 13.8 9.8 12.3 11.6 12.5 14 Z" fill={color} />

        {/* Cặp hạt 3 */}
        <Path d="M 11.5 17.4 C 8.8 17 7.6 14.8 7.8 12.8 C 10.2 13.2 11.7 15 11.5 17.4 Z" fill={color} />
        <Path d="M 12.5 17.4 C 15.2 17 16.4 14.8 16.2 12.8 C 13.8 13.2 12.3 15 12.5 17.4 Z" fill={color} />

        {/* Gân mảnh trong từng hạt */}
        <Path d="M 12 3.6 L 12 7" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M 11 10 L 8.8 7" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M 13 10 L 15.2 7" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M 11 13.4 L 8.8 10.4" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M 13 13.4 L 15.2 10.4" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M 11 16.8 L 8.8 13.8" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
        <Path d="M 13 16.8 L 15.2 13.8" stroke={crease} strokeWidth={0.6} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

/** Icon Chất béo (Fats) — giọt dầu */
export function DropletIcon({ size = 13, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </Svg>
  );
}

/** Icon Muối (Salt) — lọ rắc muối nghiêng với nắp và hạt muối rơi */
export function SaltIcon({ size = 15, color, capColor = '#FFFFFF' }: SaltIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G transform="rotate(-45, 12, 12)">
        {/* Thân lọ rắc */}
        <Rect x="7.9" y="3.2" width="8.2" height="11.0" rx="2.2" fill={color} />
        {/* Nắp lọ */}
        <Rect x="8.6" y="15.3" width="6.8" height="3.4" rx="1.2" fill={capColor} />
        {/* 3 hạt muối rơi */}
        <Circle cx="9.6" cy="21.0" r="0.95" fill={capColor} />
        <Circle cx="14.4" cy="21.0" r="0.95" fill={capColor} />
        <Circle cx="12.0" cy="23.4" r="1.05" fill={capColor} />
      </G>
    </Svg>
  );
}

/** Icon Đường (Sugar) — viên kẹo bọc giấy xoắn hai đầu */
export function SugarIcon({ size = 15, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <G transform="rotate(-45, 12, 12)">
        {/* Xoắn giấy bên trái */}
        <Path
          d="M 6.8 10.8 C 5.8 10.2 4.2 9.0 3.0 8.4 C 2.4 8.1 1.8 8.6 2.0 9.2 L 2.4 10.6 C 1.8 11.2 1.8 12.8 2.4 13.4 L 2.0 14.8 C 1.8 15.4 2.4 15.9 3.0 15.6 C 4.2 15.0 5.8 13.8 6.8 13.2 Z"
        />
        {/* Xoắn giấy bên phải */}
        <Path
          d="M 17.2 10.8 C 18.2 10.2 19.8 9.0 21.0 8.4 C 21.6 8.1 22.2 8.6 22.0 9.2 L 21.6 10.6 C 22.2 11.2 22.2 12.8 21.6 13.4 L 22.0 14.8 C 22.2 15.4 21.6 15.9 21.0 15.6 C 19.8 15.0 18.2 13.8 17.2 13.2 Z"
        />
        {/* Thân viên kẹo bo tròn */}
        <Rect x="6.0" y="7.4" width="12.0" height="9.2" rx="4.6" />
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
      {/* Cuống súp lơ */}
      <Path
        d="M5.2 13.5 L2.8 18.6 C2.5 19.3 2.7 20.1 3.2 20.6 L4.6 21.6 C5.2 22.0 6.0 21.9 6.4 21.3 L10.2 15.4 C8.5 15.0 6.8 14.4 5.2 13.5 Z"
        fill={stalkColor}
      />
      {/* Tán súp lơ bông xốp */}
      <Path
        d="M5.2 13.5 C2.8 13.0 2.0 10.5 2.4 8.5 C2.8 6.8 4.2 5.4 6.0 5.8 C6.8 3.8 8.8 2.4 10.8 2.5 C13.2 2.6 15.0 4.0 15.8 5.5 C18.2 5.8 21.4 7.2 21.2 9.8 C21.2 11.8 19.8 13.6 18.5 14.8 C17.2 16.2 15.0 16.5 13.5 16.0 C11.8 15.6 10.8 15.4 10.2 15.4 C8.5 15.0 6.8 14.4 5.2 13.5 Z"
        fill={color}
      />
      {/* Đường nếp nhăn tạo khối bông */}
      <Path d="M11.2 8.4 C12.8 7.5 14.8 8.0 15.8 10.0" stroke={creaseColor} strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M4.8 9.6 C5.6 10.8 6.6 11.6 7.8 11.8" stroke={creaseColor} strokeWidth={1.1} strokeLinecap="round" />
      <Path d="M7.0 14.8 C8.0 15.4 9.2 15.4 10.2 14.8" stroke={creaseColor} strokeWidth={1.1} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Tracking & Utility Icons ────────────────────────────────────────────────

export function ScaleIcon({ size = 22, color, innerColor }: ScaleIconProps) {
  const fillColor = color || '#F59E0B';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Scale body */}
      <Rect x={2} y={2} width={20} height={20} rx={6} fill={fillColor} />
      {/* Dark display cutout */}
      <Rect x={6} y={5} width={12} height={6} rx={2.5} fill={innerColor || '#181524'} />
      {/* Light dial strip */}
      <Rect x={7.5} y={6.5} width={9} height={3} rx={1} fill="#FEF3C7" />
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

/** Icon Bát cơm thêm món (+) — Dùng cho trạng thái trống của Nhật ký gần đây (Recent Diary) */
export function BowlFoodPlusIcon({
  size = 40,
  color,
  cutoutColor = '#0D0B14',
}: BowlFoodPlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 640 640" fill="none">
      {/* Cơm vun chóp 3 múi tròn đầy */}
      <Path
        fill={color}
        d="M64 240c0-35.3 28.7-64 64-64h1.6c7.4-36.5 39.7-64 78.4-64c15 0 29 4.1 40.9 11.2C262.2 97.5 289 80 320 80s57.8 17.6 71.1 43.2c12-7.1 26-11.2 40.9-11.2c38.7 0 71 27.5 78.4 64h1.6c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H72.6c-5.5-9.4-8.6-20.3-8.6-32z"
      />
      {/* Thân bát bo cong đều thu về đáy */}
      <Path
        fill={color}
        d="M64 379.4c0-15.1 12.3-27.4 27.4-27.4h457.1c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1l-1.7 14.5c-2 16-15.6 28-31.8 28H204.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C108.4 478.1 64 417.9 64 347.4z"
      />
      {/* Vòng đệm cutout tách biệt huy hiệu dấu cộng và thân bát */}
      <Circle cx={460} cy={460} r={140} fill={cutoutColor} />
      {/* Huy hiệu tròn dấu cộng */}
      <Circle cx={460} cy={460} r={112} fill={color} />
      {/* Dấu cộng nét đậm bo tròn bên trong huy hiệu */}
      <Line
        x1={405}
        y1={460}
        x2={515}
        y2={460}
        stroke={cutoutColor}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <Line
        x1={460}
        y1={405}
        x2={460}
        y2={515}
        stroke={cutoutColor}
        strokeWidth={30}
        strokeLinecap="round"
      />
    </Svg>
  );
}
export const BowlAddIcon = BowlFoodPlusIcon;

/** Icon Cuốn sổ công thức thêm món (+) — Dùng cho Tạo công thức */
export function RecipeBookPlusIcon({
  size = 28,
  color,
  cutoutColor = '#22C55E',
}: RecipeBookPlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 640 640" fill="none">
      {/* Thân cuốn sách bìa bo góc */}
      <Rect x={110} y={80} width={420} height={480} rx={48} fill={color} />

      {/* Đường gáy sách / rãnh gấp bìa */}
      <Line
        x1={175}
        y1={80}
        x2={175}
        y2={560}
        stroke={cutoutColor}
        strokeWidth={16}
        strokeLinecap="round"
      />

      {/* Mũ đầu bếp (Chef Hat) trên bìa sách */}
      {/* Vành mũ */}
      <Rect x={265} y={325} width={130} height={24} rx={8} fill={cutoutColor} />
      {/* Thân mũ */}
      <Path d="M272 290 L272 320 L388 320 L388 290 Z" fill={cutoutColor} />
      {/* 3 múi tròn của mũ đầu bếp */}
      <Circle cx={330} cy={235} r={48} fill={cutoutColor} />
      <Circle cx={280} cy={260} r={38} fill={cutoutColor} />
      <Circle cx={380} cy={260} r={38} fill={cutoutColor} />

      {/* Vòng đệm cutout tách biệt huy hiệu dấu cộng và thân sách */}
      <Circle cx={460} cy={460} r={140} fill={cutoutColor} />
      {/* Huy hiệu tròn dấu cộng */}
      <Circle cx={460} cy={460} r={112} fill={color} />
      {/* Dấu cộng nét đậm bo tròn bên trong huy hiệu */}
      <Line
        x1={405}
        y1={460}
        x2={515}
        y2={460}
        stroke={cutoutColor}
        strokeWidth={30}
        strokeLinecap="round"
      />
      <Line
        x1={460}
        y1={405}
        x2={460}
        y2={515}
        stroke={cutoutColor}
        strokeWidth={30}
        strokeLinecap="round"
      />
    </Svg>
  );
}
export const RecipeAddIcon = RecipeBookPlusIcon;

/** Icon Tia sao lấp lánh / Bật tắt flash cho máy quét mã vạch */
export function ScannerSparkleFlashIcon({
  size = 24,
  color = '#FFFFFF',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 4-point diamond star */}
      <Path
        d="M10 2 C10 6.5 6.5 10 2 10 C6.5 10 10 13.5 10 18 C10 13.5 13.5 10 18 10 C13.5 10 10 6.5 10 2 Z"
        fill={color}
      />
      {/* Tia sáng phụ góc trên phải */}
      <Line x1="16" y1="4" x2="21" y2="4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="18.5" y1="1.5" x2="18.5" y2="6.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="19" cy="11" r="1" fill={color} />
      <Circle cx="14" cy="16" r="0.8" fill={color} />
    </Svg>
  );
}

/** Icon Minh họa bát ăn kèm thìa và lá nổi — Dùng làm placeholder cho Tạo công thức & Tạo thực phẩm */
export function RecipeBowlPlaceholderIcon({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 0.85} viewBox="0 0 100 85" fill="none">
      {/* 2 Floating leaves above bowl */}
      <Path
        d="M48 18 C46 12 52 8 56 12 C57 18 51 21 48 18 Z"
        fill="#7A7398"
      />
      <Path
        d="M58 20 C60 14 67 13 69 17 C68 23 62 25 58 20 Z"
        fill="#7A7398"
      />

      {/* Spoon handle sticking out */}
      <Line
        x1="64"
        y1="22"
        x2="78"
        y2="8"
        stroke="#5D557B"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Food puffs in the bowl */}
      <Circle cx="38" cy="36" r="10" fill="#7D759C" />
      <Circle cx="50" cy="32" r="12" fill="#8F86B0" />
      <Circle cx="64" cy="35" r="10" fill="#7D759C" />
      <Circle cx="44" cy="40" r="10" fill="#7D759C" />
      <Circle cx="58" cy="40" r="10" fill="#7D759C" />

      {/* Bowl body */}
      <Path
        d="M26 42 C26 39 28 37 31 37 L71 37 C74 37 76 39 76 42 C76 60 66 70 51 70 C36 70 26 60 26 42 Z"
        fill="#4A4266"
      />

      {/* Bowl foot */}
      <Rect x="42" y="70" width="18" height="4" rx="2" fill="#3D3654" />
    </Svg>
  );
}

/** Icon Chọn ảnh từ thư viện kèm dấu cộng (+) */
export function GalleryAddIcon({
  size = 22,
  color = '#FFFFFF',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Khung ảnh bo góc */}
      <Path
        d="M15 3.5 H6 C4.34 3.5 3 4.84 3 6.5 V15.5 C3 17.16 4.34 18.5 6 18.5 H15 C16.66 18.5 18 17.16 18 15.5 V6.5 C18 4.84 16.66 3.5 15 3.5 Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chi tiết đồi núi và mặt trời bên trong */}
      <Circle cx="7.5" cy="8" r="1.5" fill={color} />
      <Path
        d="M3.5 15.5 L7.5 11.5 L10.5 14.5 L13 11 L17.5 15.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Huy hiệu dấu cộng (+) góc trên phải */}
      <Circle cx="19" cy="5.5" r="4.5" fill="#13121B" />
      <Line x1="16.5" y1="5.5" x2="21.5" y2="5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="19" y1="3" x2="19" y2="8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Activity Icons ──────────────────────────────────────────────────────────

/** Icon Chạy bộ — Người chạy nghiêng về phía trước kèm 3 vạch gió tốc độ bên trái */
export function RunningIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 3 vạch gió tốc độ */}
      <Rect x="1.5" y="7.6" width="4.6" height="1.5" rx="0.75" fill={color} />
      <Rect x="0.8" y="11" width="6.4" height="1.5" rx="0.75" fill={color} />
      <Rect x="2.2" y="14.4" width="4.2" height="1.5" rx="0.75" fill={color} />
      {/* Đầu */}
      <Circle cx="17.6" cy="4.6" r="2.1" fill={color} />
      {/* Thân, tay, chân */}
      <G stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        {/* Thân */}
        <Path d="M14.8 8.4 L12.6 13.4" />
        {/* Tay trước */}
        <Path d="M14.8 8.8 L17.8 11 L20 9.2" />
        {/* Tay sau */}
        <Path d="M14.6 8.8 L11.4 9.6 L9.8 12" />
        {/* Chân trước */}
        <Path d="M12.6 13.4 L16.2 15.6 L14.8 20" />
        {/* Chân sau */}
        <Path d="M12.6 13.4 L10.4 16.6 L7.4 18.6" />
      </G>
    </Svg>
  );
}

/** Icon Đạp xe — Người đạp xe duỗi một tay về phía trước, hai bánh tròn lớn */
export function BicycleIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Đầu */}
      <Circle cx="12.6" cy="4.8" r="1.8" fill={color} />
      {/* Thân nghiêng ra trước */}
      <Path
        d="M10.6 12.4 L12 8 L14 10"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tay duỗi thẳng về phía trước */}
      <Path
        d="M12.4 8.4 L16 8.2 L20.2 8.2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tay còn lại nắm ghi-đông */}
      <Path
        d="M14 10 L16.4 11.2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Khung xe nối hai bánh */}
      <Path
        d="M6.4 17.6 L10.6 12.4 L12.4 17.6 L16.4 11.2 L17.6 17.6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bánh sau */}
      <Circle cx="6.4" cy="17.6" r="3.6" stroke={color} strokeWidth={1.9} />
      <Circle cx="6.4" cy="17.6" r="0.9" fill={color} />
      {/* Bánh trước */}
      <Circle cx="17.6" cy="17.6" r="3.6" stroke={color} strokeWidth={1.9} />
      <Circle cx="17.6" cy="17.6" r="0.9" fill={color} />
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
      {/* rotate(+45): đế xuống trái, tán lông lên phải */}
      <G transform="rotate(45, 12, 12)">
        {/* Đế bấc */}
        <Path d="M10.2 18.2 C10.2 19.8 11 21 12 21 C13 21 13.8 19.8 13.8 18.2 Z" fill={color} />
        {/* Tán lông vũ */}
        <Path d="M9.8 17.2 L6.2 4.8 C10 3.6 14 3.6 17.8 4.8 L14.2 17.2 Z" fill={color} />
        {/* Rãnh phân lông */}
        <Line x1="12" y1="4" x2="12" y2="17.2" stroke={cutoutColor} strokeWidth={1.1} />
        <Line x1="9.2" y1="4.4" x2="10.8" y2="17.2" stroke={cutoutColor} strokeWidth={0.9} />
        <Line x1="14.8" y1="4.4" x2="13.2" y2="17.2" stroke={cutoutColor} strokeWidth={0.9} />
        {/* Chỉ thắt ngang */}
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
        {/* Cán vợt */}
        <Rect x="10.9" y="16" width="2.2" height="5.6" rx="1.1" fill={color} />
        {/* Mặt vợt thuôn dần về cán */}
        <Path
          d="M7.2 8.2 C7.2 5.2 9.2 3.2 12 3.2 C14.8 3.2 16.8 5.2 16.8 8.2 C16.8 11 15.6 13 14 14.6 L13.4 16 L10.6 16 L10 14.6 C8.4 13 7.2 11 7.2 8.2 Z"
          fill={color}
        />
        {/* Ngấn nối mặt vợt - cán */}
        <Line x1="10.2" y1="15.9" x2="13.8" y2="15.9" stroke={cutoutColor} strokeWidth={0.9} />
      </G>
      {/* Viền tách bóng khỏi vợt */}
      <Circle cx="6.2" cy="6.2" r="3.4" fill={cutoutColor} />
      {/* Quả bóng */}
      <Circle cx="6.2" cy="6.2" r="2.4" fill={color} />
    </Svg>
  );
}

/** Icon Yoga — Người ngồi thiền khoanh chân, hai tay dang ngang đặt trên gối */
export function YogaIcon({ size = 24, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Đầu */}
      <Circle cx="12" cy="5" r="2.3" fill={color} />
      {/* Thân (vai rộng, thu dần xuống eo) */}
      <Path
        d="M9.4 8.8 H14.6 L14 14.6 H10 Z"
        fill={color}
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      {/* Hai tay dang sang hai bên, hơi chếch xuống */}
      <Path
        d="M9.8 9.8 L4.6 12.6 M14.2 9.8 L19.4 12.6"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hai chân khoanh bắt chéo nhau (hình chữ X dẹt) */}
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
      {/* Trang tài liệu */}
      <Rect x="4.5" y="3" width="14" height="15" rx="2.6" fill={color} />
      {/* 3 dòng danh sách */}
      <Line x1="8" y1="7" x2="15.5" y2="7" stroke={cutoutColor} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="10.5" x2="15.5" y2="10.5" stroke={cutoutColor} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="14" x2="12" y2="14" stroke={cutoutColor} strokeWidth={1.5} strokeLinecap="round" />
      {/* Viền tách huy hiệu */}
      <Circle cx="18" cy="18" r="4.6" fill={cutoutColor} />
      {/* Huy hiệu */}
      <Circle cx="18" cy="18" r="3.5" fill={color} />
      {/* Dấu 3 chấm */}
      <Circle cx="16.4" cy="18" r="0.65" fill={cutoutColor} />
      <Circle cx="18" cy="18" r="0.65" fill={cutoutColor} />
      <Circle cx="19.6" cy="18" r="0.65" fill={cutoutColor} />
    </Svg>
  );
}

// ─── Third-Party Brand Icons ─────────────────────────────────────────────────

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

// ─── Quick Utility Dock Icons ───────────────────────────────────────────────

/** Icon Quét mã vạch — khung viewfinder 4 góc, vạch barcode & tia quét ngang */
export function QuickBarcodeIcon({ size = 26, color = '#12111A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 4 khung góc viewfinder bo tròn */}
      <Path
        d="M4 8.5V6C4 4.9 4.9 4 6 4H8.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.5 4H18C19.1 4 20 4.9 20 6V8.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 15.5V18C4 19.1 4.9 20 6 20H8.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.5 20H18C19.1 20 20 19.1 20 18V15.5"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Vạch barcode dọc */}
      <Line x1="8.5" y1="7.5" x2="8.5" y2="16.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="11.5" y1="7.5" x2="11.5" y2="16.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Line x1="14" y1="7.5" x2="14" y2="16.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="16.5" y1="7.5" x2="16.5" y2="16.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      {/* Tia laser quét ngang qua giữa */}
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/** Icon Quét AI (Magic) — 2 ngôi sao lấp lánh (sparkles 4 cánh đều nhau đối xứng hoàn hảo) */
export function QuickSparklesIcon({ size = 28, color = '#12111A' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      {/* Ngôi sao lớn 4 cánh đều nhau ở góc trên phải */}
      <Path d="M 14.20 2.80 Q 15.32 8.68 21.20 9.80 Q 15.32 10.92 14.20 16.80 Q 13.08 10.92 7.20 9.80 Q 13.08 8.68 14.20 2.80 Z" />
      {/* Ngôi sao nhỏ 4 cánh đều nhau ở góc dưới trái */}
      <Path d="M 7.00 12.80 Q 7.64 16.16 11.00 16.80 Q 7.64 17.44 7.00 20.80 Q 6.36 17.44 3.00 16.80 Q 6.36 16.16 7.00 12.80 Z" />
    </Svg>
  );
}

/** Icon Ghi giọng nói — micro viên nhộng với 2 vạch sóng âm vòm, khung chữ U & trục đứng (không có đế ngang) */
export function QuickVoiceIcon({
  size = 26,
  color = '#12111A',
  cutoutColor = '#FB7185',
}: IconProps & { cutoutColor?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Thân micro viên nhộng bo tròn */}
      <Rect x="8.5" y="4" width="7" height="11.5" rx="3.5" fill={color} />
      {/* 2 vạch sóng âm hình vòm phát tín hiệu bên trong micro */}
      <Path
        d="M 10.2 7.2 C 11.1 6.0 12.9 6.0 13.8 7.2"
        stroke={cutoutColor}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <Path
        d="M 11.0 9.2 C 11.5 8.4 12.5 8.4 13.0 9.2"
        stroke={cutoutColor}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      {/* Khung đỡ chữ U ôm quanh nửa dưới micro */}
      <Path
        d="M 5.5 11 C 5.5 15.2 8.4 17.6 12 17.6 C 15.6 17.6 18.5 15.2 18.5 11"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      {/* Trục đứng ngắn ở đáy khung chữ U (không có chân đế ngang) */}
      <Line x1="12" y1="17.6" x2="12" y2="20.6" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Header & Navigation Controls ──────────────────────────────────────────

/** Icon Lấp lánh Sparkles ✨ */
export function SparklesIcon({ size = 18, color = '#9E64F7' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z"
        fill={color}
      />
      <Path
        d="M19 16L19.9 18.9L22.8 19.8L19.9 20.7L19 23.6L18.1 20.7L15.2 19.8L18.1 18.9L19 16Z"
        fill={color}
        opacity={0.85}
      />
    </Svg>
  );
}

/** Icon cuốn sách (kiến thức / cẩm nang) */
export function BookIcon({ size = 16, color = '#A59EBD', strokeWidth = 2 }: IconProps & { strokeWidth?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
  );
}

export const BookOpenIcon = BookIcon;
export const KnowledgeBookIcon = BookIcon;

/** Icon Khung quét mã vạch ở góc thanh tìm kiếm (khung 4 góc, capsule & tia quét ngang chuẩn thiết kế) */
export function ViewfinderBarcodeIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8.5V5.5C4 4.7 4.7 4 5.5 4H8.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M15.5 4H18.5C19.3 4 20 4.7 20 5.5V8.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 15.5V18.5C20 19.3 19.3 20 18.5 20H15.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8.5 20H5.5C4.7 20 4 19.3 4 18.5V15.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x="6.5" y="9" width="11" height="6" rx="3" stroke={color} strokeWidth={2} />
      <Line x1="4.5" y1="12" x2="19.5" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Minh họa thư mục trống kèm 2 lá và nét xoắn tím bay (chuẩn thiết kế, tự động thích ứng Sáng / Tối) */
export function EmptyFolderIllustration({
  size = 140,
  folderBack,
  folderFront,
  accentColor,
}: EmptyFolderIllustrationProps) {
  const theme = useTheme();
  const isDark = theme.scheme === 'dark';
  const { colors: c } = theme;

  // Tự động thích ứng màu sắc theo Theme:
  // - Light theme: Thân sau tím pastel nhạt (#EDE7F9), nắp trước trắng tinh tế (#FFFFFF) với viền pastel mềm (#DDD4F4)
  // - Dark theme: Thân sau tím than (#1D1929), nắp trước tím than (#2A243A) với viền (#3D3554)
  // - Chi tiết lá & nét xoắn bay: Tím thương hiệu nhận diện rõ ràng (Light: #7B4FE0 / Dark: #9E64F7)
  const resolvedAccent = accentColor ?? (isDark ? '#9E64F7' : (c.brandPrimary || '#7B4FE0'));
  const resolvedBack = folderBack ?? (isDark ? '#1D1929' : '#EDE7F9');
  const resolvedBackStroke = isDark ? '#2E2740' : '#DCD2F2';
  const resolvedFront = folderFront ?? (isDark ? '#2A243A' : '#FFFFFF');
  const resolvedFrontStroke = isDark ? '#3D3554' : '#DDD4F4';

  return (
    <Svg width={size} height={size * 0.88} viewBox="0 0 160 140" fill="none">
      {/* 1. Lá tím bên trái */}
      <Path
        d="M 44 32 C 43 23 52 19 57 24 C 58 33 49 37 44 32 Z"
        fill={resolvedAccent}
      />

      {/* 2. Nét xoắn tím lơ lửng ở giữa có vòng lặp loop */}
      <Path
        d="M 62 48 C 74 48 82 43 86 37 C 91 28 85 22 81 25 C 77 28 78 35 85 34 C 92 33 99 25 104 14"
        stroke={resolvedAccent}
        strokeWidth={2.8}
        strokeLinecap="round"
      />

      {/* 3. Lá tím bên phải */}
      <Path
        d="M 110 35 C 111 27 120 25 123 30 C 122 38 114 40 110 35 Z"
        fill={resolvedAccent}
      />

      {/* 4. Thân sau của thư mục (hình chữ nhật bo góc) */}
      <Rect
        x={24}
        y={42}
        width={112}
        height={76}
        rx={14}
        fill={resolvedBack}
        stroke={resolvedBackStroke}
        strokeWidth={1.5}
      />

      {/* 5. Nắp trước của thư mục (vát nhẹ mở ra trước) */}
      <Path
        d="M 20 113 
           L 29 65 C 30 59 35 55 41 55 
           L 126 55 C 134 55 140 61 139 68 
           L 133 114 C 132 119 128 122 123 122 
           L 28 122 C 23 122 19 118 20 113 Z"
        fill={resolvedFront}
        stroke={resolvedFrontStroke}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

/** Minh họa điện thoại hiển thị giao diện Nhật ký theo thời gian */
export function TimelineDiaryPhoneIllustration({ size = 70 }: { size?: number }) {
  return (
    <Image
      source={images.foodDiaryArtwork}
      style={{ width: size, height: size, borderRadius: 16 }}
      resizeMode="contain"
      accessibilityLabel="Nhật ký theo thời gian"
    />
  );
}

// ─── Gamification & Streak Icons ─────────────────────────────────────────────

interface CampfireFlameIconProps {
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

  // Hào quang: 3 lớp phóng to dần quanh tâm đáy ngọn lửa
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
        {/* Sáng */}
        <LinearGradient id="fireOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF5F52" />
          <Stop offset="100%" stopColor="#F23F3A" />
        </LinearGradient>
        <LinearGradient id="fireCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FFA89D" />
          <Stop offset="100%" stopColor="#FF8278" />
        </LinearGradient>
        {/* Tắt */}
        <LinearGradient id="ghostOuterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#9C97B6" />
          <Stop offset="100%" stopColor="#7E7898" />
        </LinearGradient>
      </Defs>

      {/* ── 1. Bóng đổ dưới đống củi ── */}
      <Ellipse
        cx={50}
        cy={86}
        rx={30}
        ry={4.5}
        fill={isLit ? '#3B3A6E' : '#2E2A42'}
        opacity={isLit ? 0.45 : 0.7}
      />

      {/* ── 2. Hào quang (Glow layers) ── */}
      {glowLayers.map((layer, i) => (
        <G
          key={i}
          transform={`translate(50 72) scale(${layer.scale}) translate(-50 -72)`}
        >
          <Path d={FLAME_PATH} fill={layer.fill} opacity={layer.opacity} />
        </G>
      ))}

      {/* ── 3. Ngọn lửa chính ── */}
      <Path
        d={FLAME_PATH}
        fill={isLit ? 'url(#fireOuterGrad)' : 'url(#ghostOuterGrad)'}
      />

      {/* ── 4. Lõi lửa ── */}
      <Path
        d={CORE_PATH}
        fill={isLit ? 'url(#fireCoreGrad)' : '#E3E0EC'}
      />

      {/* ── 5. Củi bắt chéo (vẽ sau để che chân ngọn lửa) ── */}
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

/** Icon Bát Salad / Ghi nhận món ăn */
export function SaladBowlIcon({
  size = 56,
  bgCircleColor = '#F9F2D8',
}: SaladBowlIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx={24} cy={24} r={24} fill={bgCircleColor} />
      <Path
        d="M10 27 C10 37 16 41 24 41 C32 41 38 37 38 27 Z"
        fill="#6D46BA"
      />
      <Path
        d="M19 41 L29 41 C28 42.8 26.5 43.5 24 43.5 C21.5 43.5 20 42.8 19 41 Z"
        fill="#533496"
      />
      <Path
        d="M11 27 C11 21 16 17 24 17 C32 17 37 21 37 27 Z"
        fill="#FBBF24"
      />
      <Path
        d="M27 22 C31 15 38 15 38 15 C38 15 37 21 32 24 Z"
        fill="#22C55E"
      />
      <Path
        d="M32 18 L29 22"
        stroke="#16A34A"
        strokeWidth={1}
        strokeLinecap="round"
      />
      <Circle cx={18} cy={22} r={3.5} fill="#EF4444" />
    </Svg>
  );
}

/** Huy hiệu pháo giấy ăn mừng duy trì chuỗi Streak thành công */
export function CelebrationPopperBadge({ size = 56 }: CelebrationPopperBadgeProps) {
  return (
    <Image
      source={images.streakCelebratePopper}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessibilityLabel="Pháo giấy ăn mừng chuỗi Streak"
    />
  );
}

export const PartyPopperBadge = CelebrationPopperBadge;

/** Icon Khiên Kallo (bảo vệ đóng băng streak) */
export function KalloShieldIcon({ size = 30 }: KalloShieldIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs>
        <LinearGradient id="kalloShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="100%" stopColor="#0284C7" />
        </LinearGradient>
      </Defs>

      {/* Viền và nền khiên */}
      <Path
        d="M16 3
           L27 7
           C27 18 21 26 16 29
           C11 26 5 18 5 7
           L16 3 Z"
        fill="url(#kalloShieldGrad)"
        stroke="#7DD3FC"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Chữ K trong tâm khiên Kallo */}
      <Path
        d="M12 10.5 L12 21.5"
        stroke="#FFFFFF"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <Path
        d="M19.5 11 L13 16.5 L19.5 21.5"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ngôi sao lấp lánh góc trên khiên */}
      <Path
        d="M21 7.5 Q22 7.5 22 6.5 Q22 7.5 23 7.5 Q22 7.5 22 8.5 Q22 7.5 21 7.5 Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export const WaoShieldIcon = KalloShieldIcon;

/** Huy hiệu cuốn lịch mốc ngày phong cách sticker viền trắng / xám (3, 7, 14 ngày) */
export function MilestoneCalendarBadge({
  days,
  isActive = false,
  isAchieved = false,
  width = 36,
  height = 40,
}: MilestoneCalendarBadgeProps) {
  const isOrange = isActive || isAchieved;
  const outerBorderColor = isOrange ? '#FFFFFF' : '#C3C0D0';
  const baseColor = isOrange ? '#FF6422' : '#2D283E';
  const tabStrapColor = isOrange ? '#E64212' : '#4E4960';
  const innerCardColor = isOrange ? '#FFFFFF' : '#C3C0D0';
  const textColor = isOrange ? '#FF5520' : '#2D283E';

  // Đường viền dạng sticker kết hợp thân lịch bo tròn và 2 tai móc treo ở trên đỉnh
  const silhouettePath =
    'M 2 14.5 ' +
    'A 6.5 6.5 0 0 1 8.5 8 ' +
    'L 9 8 ' +
    'L 9 4.75 ' +
    'A 2.75 2.75 0 0 1 14.5 4.75 ' +
    'L 14.5 8 ' +
    'L 21.5 8 ' +
    'L 21.5 4.75 ' +
    'A 2.75 2.75 0 0 1 27 4.75 ' +
    'L 27 8 ' +
    'L 27.5 8 ' +
    'A 6.5 6.5 0 0 1 34 14.5 ' +
    'L 34 31.5 ' +
    'A 6.5 6.5 0 0 1 27.5 38 ' +
    'L 8.5 38 ' +
    'A 6.5 6.5 0 0 1 2 31.5 ' +
    'Z';

  return (
    <Svg width={width} height={height} viewBox="0 0 36 40" fill="none">
      {/* Khối nền và viền ngoài sticker */}
      <Path
        d={silhouettePath}
        fill={baseColor}
        stroke={outerBorderColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* Rãnh khuy móc gáy lịch ở 2 tai treo */}
      <Rect
        x={10.5}
        y={3.5}
        width={2.5}
        height={5.5}
        rx={1.25}
        fill={tabStrapColor}
      />
      <Rect
        x={23}
        y={3.5}
        width={2.5}
        height={5.5}
        rx={1.25}
        fill={tabStrapColor}
      />

      {/* Trang lịch bên trong */}
      <Rect
        x={5}
        y={15}
        width={26}
        height={19}
        rx={4}
        fill={innerCardColor}
      />

      {/* Số mốc ngày */}
      <SvgText
        x={18}
        y={days >= 10 ? 29 : 29.5}
        fill={textColor}
        fontSize={days >= 100 ? 11 : days >= 10 ? 12.5 : 15}
        fontWeight="bold"
        textAnchor="middle"
      >
        {days}
      </SvgText>
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
      {/* Đầu chóp cán cờ */}
      <Circle cx={8} cy={6.5} r={2.5} fill="#757088" />

      {/* Thân cán cờ */}
      <Rect x={6.75} y={7} width={2.5} height={24} rx={1.25} fill="#757088" />

      {/* Nếp gấp bóng phía sau lá cờ */}
      <Path
        d="M 21 11 C 23.5 11 25.5 12.5 25.5 15.5 L 25.5 18 C 25.5 21 23.5 22.5 21 22.5 Z"
        fill="#59546B"
      />

      {/* Lá cờ chính màu tím xám nhạt */}
      <Rect x={8} y={9.5} width={14} height={14} rx={2.5} fill="#C4C0D4" />

      {/* Dấu tick hoàn thành màu tím than đậm */}
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


// ─── Quick Actions Sheet Icons ──────────────────────────────────────────────

/** Icon Ly nước có dấu cộng (+) cho Quick Action Uống nước */
export function WaterGlassPlusIcon({ size = 22, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3.5 L7.8 19 C8 20.7 9.3 22 11 22 H13 C14.7 22 16 20.7 16.2 19 L18 3.5 H6 Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1="12" y1="9" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

/** Icon Quả táo trong khung scan kèm nhãn cho Gợi ý công thức */
export function AppleScanIcon({ size = 22, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8 V5 C4 4.4 4.4 4 5 4 H8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16 4 H19 C19.6 4 20 4.4 20 5 V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M20 16 V19 C20 19.6 19.6 20 19 20 H16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8 20 H5 C4.4 20 4 19.6 4 19 V16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path
        d="M12 9 C10.5 7.5 7.5 8 7.5 11.5 C7.5 15.5 11 17.5 12 17.5 C13 17.5 16.5 15.5 16.5 11.5 C16.5 8 13.5 7.5 12 9 Z"
        fill={color}
      />
      <Path d="M12 9 C12 7.5 13 6.5 14 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

/** Icon Hình nhân người đứng cho Chỉ số sức khỏe */
export function BodyStickFigureIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="4.5" r="2.5" fill={color} />
      <Path
        d="M12 8 V15 M12 15 L9 21.5 M12 15 L15 21.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 11.5 L12 9.5 L18 11.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Icon Barcode khung vuông cho Quick Action Quét mã vạch */
export function BarcodeSquareIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7 V5 C3 4 4 3 5 3 H7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 3 H19 C20 3 21 4 21 5 V7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 17 V19 C21 20 20 21 19 21 H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 21 H5 C4 21 3 20 3 19 V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="7" y1="7" x2="7" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="10.5" y1="7" x2="10.5" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="13.5" y1="7" x2="13.5" y2="17" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="17" y1="7" x2="17" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Gamification & Community Vector Icons ───────────────────────────────────

export function TrophyIcon({ size = 22, color = '#F59E0B' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 21H16M12 17V21M6 4H18V9C18 12.3137 15.3137 15 12 15C8.68629 15 6 12.3137 6 9V4ZM6 6H3C2.44772 6 2 6.44772 2 7V8C2 9.65685 3.34315 11 5 11H6.17071M18 6H21C21.5523 6 22 6.44772 22 7V8C22 9.65685 20.6569 11 19 11H17.8293"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UsersIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9986 18.1068 22.7093 17.2373 22.1742 16.5186C21.6391 15.7999 20.8872 15.2697 20.03 15.01M16 3.13C16.8604 3.3853 17.6139 3.91776 18.1499 4.63989C18.6859 5.36202 18.9749 6.23467 18.9749 7.13C18.9749 8.02533 18.6859 8.89798 18.1499 9.62011C17.6139 10.3422 16.8604 10.8747 16 11.13M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UserSingleIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GearSettingsIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.325 4.317C10.751 2.56 13.249 2.56 13.675 4.317C13.863 5.092 14.654 5.568 15.419 5.37C17.135 4.927 18.9 6.692 18.457 8.408C18.259 9.173 18.735 9.964 19.51 10.152C21.267 10.578 21.267 13.076 19.51 13.502C18.735 13.69 18.259 14.481 18.457 15.246C18.9 16.962 17.135 18.727 15.419 18.284C14.654 18.086 13.863 18.562 13.675 19.337C13.249 21.094 10.751 21.094 10.325 19.337C10.137 18.562 9.346 18.086 8.581 18.284C6.865 18.727 5.1 16.962 5.543 15.246C5.741 14.481 5.265 13.69 4.49 13.502C2.733 13.076 2.733 10.578 4.49 10.152C5.265 9.964 5.741 9.173 5.543 8.408C5.1 6.692 6.865 4.927 8.581 5.37C9.346 5.568 10.137 5.092 10.325 4.317Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function MailInboxIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 6L12 13L2 6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LockClosedIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShieldSecurityIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12L11 14L15 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClipboardCopyIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ShareNodesIcon({ size = 22, color = '#FFFFFF' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth="2" />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth="2" />
      <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function LightningBoltIcon({ size = 22, color = '#F59E0B' }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

