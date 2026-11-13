import React from 'react';
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Flag,
  Info,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react-native';
import { ICON_STROKE_DEFAULT, type CirclePlusIconProps, type IconProps } from './types';

export interface LucideAdapterOptions {
  strokeWidth?: number;
  defaultSize?: number;
  defaultColor?: string;
  fillOnFocused?: boolean;
  activeStrokeWidth?: number;
}

export function fromLucide<P extends Partial<IconProps> = IconProps>(
  Icon: LucideIcon,
  options?: LucideAdapterOptions
) {
  const Wrapped = ({
    size = options?.defaultSize ?? 24,
    color = options?.defaultColor ?? '#FFFFFF',
    strokeWidth,
    focused,
    ...rest
  }: P) => {
    const effectiveStrokeWidth =
      strokeWidth ??
      (focused && options?.activeStrokeWidth
        ? options.activeStrokeWidth
        : options?.strokeWidth ?? ICON_STROKE_DEFAULT);

    const fill = options?.fillOnFocused && focused ? color : 'none';

    return (
      <Icon
        size={size}
        color={color}
        strokeWidth={effectiveStrokeWidth}
        fill={fill}
        {...rest}
      />
    );
  };

  Wrapped.displayName = `AppIcon(${Icon.displayName ?? 'Lucide'})`;
  return Wrapped;
}

// ─── Status & Feedback Icons (D5) ────────────────────────────────────────────

export const TriangleAlertIcon = fromLucide(TriangleAlert ?? AlertTriangle);
export const CircleAlertIcon = fromLucide(CircleAlert);
export const CircleCheckIcon = fromLucide(CircleCheck);

// ─── Wave 1: Common Glyphs & Navigation Controls ─────────────────────────────

export const ChevronLeftIcon = fromLucide(ChevronLeft, { defaultSize: 20 });
export const ChevronRightIcon = fromLucide(ChevronRight, { defaultSize: 20 });
export const ChevronDownIcon = fromLucide(ChevronDown, { defaultSize: 20 });
export const ChevronUpIcon = fromLucide(ChevronUp, { defaultSize: 20 });

export const CloseXIcon = fromLucide(X, { defaultSize: 20, strokeWidth: 2.2 });
export const PlusIcon = fromLucide(Plus, { defaultSize: 14, strokeWidth: 2.4 });

export function CirclePlusIcon({
  size = 20,
  color,
  circleColor,
  plusColor,
  strokeWidth = 2,
}: CirclePlusIconProps) {
  const stroke = color ?? plusColor ?? '#FFFFFF';
  const fill = circleColor ?? 'none';
  return <CirclePlus size={size} color={stroke} fill={fill} strokeWidth={strokeWidth} />;
}

export const CheckIcon = fromLucide(Check, { defaultSize: 20, strokeWidth: 2.2 });
export const InfoIcon = fromLucide(Info, { defaultSize: 22 });
export const MenuIcon = fromLucide(Menu, { defaultSize: 22 });

export const SearchIcon = fromLucide(Search, { defaultSize: 20, strokeWidth: 2.2 });
export const QuickSearchIcon = fromLucide(Search, { defaultSize: 26, strokeWidth: 2.6 });

export const SunIcon = fromLucide(Sun, { defaultSize: 20, defaultColor: '#FACC15' });
export const MoonIcon = fromLucide(Moon, { defaultSize: 20, defaultColor: '#9E64F7' });

export const CalendarIcon = fromLucide(Calendar, { defaultSize: 18 });
export const FlagIcon = fromLucide(Flag, { defaultSize: 13 });
