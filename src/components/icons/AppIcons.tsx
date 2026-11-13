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

// ─── Header, Macro & Metabolic Icons ─────────────────────────────────────────

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

