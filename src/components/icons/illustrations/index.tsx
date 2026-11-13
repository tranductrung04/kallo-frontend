import React from 'react';
import { Image } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { images } from '@/assets/images';
import { useTheme } from '@/theme';
import type {
  BowlFoodPlusIconProps,
  CelebrationPopperBadgeProps,
  EmptyFolderIllustrationProps,
  KalloShieldIconProps,
  MilestoneCalendarBadgeProps,
  RecipeBookPlusIconProps,
  SaladBowlIconProps,
} from '../types';

// ─── Illustrations & Empty States ────────────────────────────────────────────

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

  const resolvedAccent = accentColor ?? (isDark ? '#9E64F7' : (c.brandPrimary || '#7B4FE0'));
  const resolvedBack = folderBack ?? (isDark ? '#1D1929' : '#EDE7F9');
  const resolvedBackStroke = isDark ? '#2E2740' : '#DCD2F2';
  const resolvedFront = folderFront ?? (isDark ? '#2A243A' : '#FFFFFF');
  const resolvedFrontStroke = isDark ? '#3D3554' : '#DDD4F4';

  return (
    <Svg width={size} height={size * 0.88} viewBox="0 0 160 140" fill="none">
      <Path
        d="M 44 32 C 43 23 52 19 57 24 C 58 33 49 37 44 32 Z"
        fill={resolvedAccent}
      />
      <Path
        d="M 62 48 C 74 48 82 43 86 37 C 91 28 85 22 81 25 C 77 28 78 35 85 34 C 92 33 99 25 104 14"
        stroke={resolvedAccent}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
      <Path
        d="M 110 35 C 111 27 120 25 123 30 C 122 38 114 40 110 35 Z"
        fill={resolvedAccent}
      />
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

/** Icon Bát cơm thêm món (+) — Dùng cho trạng thái trống của Nhật ký gần đây (Recent Diary) */
export function BowlFoodPlusIcon({
  size = 40,
  color,
  cutoutColor = '#0D0B14',
}: BowlFoodPlusIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 640 640" fill="none">
      <Path
        fill={color}
        d="M64 240c0-35.3 28.7-64 64-64h1.6c7.4-36.5 39.7-64 78.4-64c15 0 29 4.1 40.9 11.2C262.2 97.5 289 80 320 80s57.8 17.6 71.1 43.2c12-7.1 26-11.2 40.9-11.2c38.7 0 71 27.5 78.4 64h1.6c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H72.6c-5.5-9.4-8.6-20.3-8.6-32z"
      />
      <Path
        fill={color}
        d="M64 379.4c0-15.1 12.3-27.4 27.4-27.4h457.1c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1l-1.7 14.5c-2 16-15.6 28-31.8 28H204.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C108.4 478.1 64 417.9 64 347.4z"
      />
      <Circle cx={460} cy={460} r={140} fill={cutoutColor} />
      <Circle cx={460} cy={460} r={112} fill={color} />
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
      <Rect x={110} y={80} width={420} height={480} rx={48} fill={color} />
      <Line
        x1={175}
        y1={80}
        x2={175}
        y2={560}
        stroke={cutoutColor}
        strokeWidth={16}
        strokeLinecap="round"
      />
      <Rect x={265} y={325} width={130} height={24} rx={8} fill={cutoutColor} />
      <Path d="M272 290 L272 320 L388 320 L388 290 Z" fill={cutoutColor} />
      <Circle cx={330} cy={235} r={48} fill={cutoutColor} />
      <Circle cx={280} cy={260} r={38} fill={cutoutColor} />
      <Circle cx={380} cy={260} r={38} fill={cutoutColor} />
      <Circle cx={460} cy={460} r={140} fill={cutoutColor} />
      <Circle cx={460} cy={460} r={112} fill={color} />
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
      <Path
        d="M48 18 C46 12 52 8 56 12 C57 18 51 21 48 18 Z"
        fill="#7A7398"
      />
      <Path
        d="M58 20 C60 14 67 13 69 17 C68 23 62 25 58 20 Z"
        fill="#7A7398"
      />
      <Line
        x1="64"
        y1="22"
        x2="78"
        y2="8"
        stroke="#5D557B"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Circle cx="38" cy="36" r="10" fill="#7D759C" />
      <Circle cx="50" cy="32" r="12" fill="#8F86B0" />
      <Circle cx="64" cy="35" r="10" fill="#7D759C" />
      <Circle cx="44" cy="40" r="10" fill="#7D759C" />
      <Circle cx="58" cy="40" r="10" fill="#7D759C" />
      <Path
        d="M26 42 C26 39 28 37 31 37 L71 37 C74 37 76 39 76 42 C76 60 66 70 51 70 C36 70 26 60 26 42 Z"
        fill="#4A4266"
      />
      <Rect x="42" y="70" width="18" height="4" rx="2" fill="#3D3654" />
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

// ─── Gamification Badges & Brand Shields ─────────────────────────────────────

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
      <Path
        d={silhouettePath}
        fill={baseColor}
        stroke={outerBorderColor}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
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
      <Rect
        x={5}
        y={15}
        width={26}
        height={19}
        rx={4}
        fill={innerCardColor}
      />
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
