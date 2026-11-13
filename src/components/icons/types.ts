// ─── Shared Icon Types ───────────────────────────────────────────────────────

export type IconProps = {
  size?: number;
  color: string;
  strokeWidth?: number;
  focused?: boolean;
  coreColor?: string;
  cutoutColor?: string;
};

export const ICON_STROKE_DEFAULT = 2;

export type PlusIconProps = IconProps;

export type FlameIconProps = IconProps;
export type QuickVoiceIconProps = IconProps;

export type SaltIconProps = IconProps & {
  capColor?: string;
};

export type WheatIconProps = IconProps & {
  creaseColor?: string;
};

export type FiberIconProps = IconProps & {
  stalkColor?: string;
  creaseColor?: string;
};

export type ScaleIconProps = IconProps & {
  innerColor?: string;
};

export type BowlFoodPlusIconProps = IconProps & {
  cutoutColor?: string;
};

export type RecipeBookPlusIconProps = IconProps & {
  cutoutColor?: string;
};

export type ActivityIconProps = IconProps & {
  cutoutColor?: string;
};

export type EmptyFolderIllustrationProps = {
  size?: number;
  folderBack?: string;
  folderFront?: string;
  accentColor?: string;
};

export type SaladBowlIconProps = {
  size?: number;
  bgCircleColor?: string;
};

export type CelebrationPopperBadgeProps = {
  size?: number;
};

export type KalloShieldIconProps = {
  size?: number;
};

export type WaoShieldIconProps = KalloShieldIconProps;

export type CirclePlusIconProps = {
  size?: number;
  circleColor?: string;
  plusColor?: string;
  strokeWidth?: number;
  color?: string;
};

export type MilestoneCalendarBadgeProps = {
  days: number;
  isActive?: boolean;
  isAchieved?: boolean;
  width?: number;
  height?: number;
};

