import React from 'react';
import {
  AlertTriangle,
  CircleAlert,
  CircleCheck,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react-native';
import { ICON_STROKE_DEFAULT, type IconProps } from './types';

export interface LucideAdapterOptions {
  strokeWidth?: number;
  defaultSize?: number;
  fillOnFocused?: boolean;
  activeStrokeWidth?: number;
}

export function fromLucide<P extends IconProps = IconProps>(
  Icon: LucideIcon,
  options?: LucideAdapterOptions
) {
  const Wrapped = ({
    size = options?.defaultSize ?? 24,
    color,
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

