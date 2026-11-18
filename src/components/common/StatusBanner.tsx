// ─── StatusBanner — Nocturne & Daylight Vitality ─────────────────────────────
// DESIGN.md: "Status Banners (Warning / Danger)"
//   Wrapper giữ tương thích ngược, ủy quyền hiển thị sang AppAlert
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { AppAlert, type AlertVariant } from './AppAlert';

export type StatusBannerType = 'warning' | 'danger';

export type StatusBannerProps = {
  type?: StatusBannerType;
  title: string;
  message: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function StatusBanner({
  type = 'warning',
  title,
  message,
  style,
  testID,
}: StatusBannerProps) {
  const variant: AlertVariant = type === 'warning' ? 'warning' : 'error';

  return (
    <AppAlert
      testID={testID}
      variant={variant}
      title={title}
      message={message}
      style={style}
    />
  );
}
