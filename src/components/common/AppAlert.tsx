// ─── AppAlert — Nocturne & Daylight Vitality ─────────────────────────────────
// DESIGN.md: "Status Signals & Feedback Alerts"
//   Full-width card, rounded-lg (16px), left icon, bold title, body-md message
//   4 Variants: success | info | warning | error (or danger)
//   3 StyleTypes: subtle (12-15% alpha) | outline (surfaceMid + 1.5px border) | leftAccent (4px left border)
//   Features: closable (CloseXIcon), action button, accessibility compliance
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CloseXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import { AppText } from './AppText';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertStyleType = 'subtle' | 'outline' | 'leftAccent';

export type AppAlertProps = {
  /** Kiểu trạng thái (mặc định: 'info'). 'danger' được hỗ trợ như alias của 'error'. */
  variant?: AlertVariant | 'danger';
  /** Kiểu hiển thị trực quan (mặc định: 'subtle') */
  styleType?: AlertStyleType;
  /** Tiêu đề alert (in đậm, nhãn trạng thái) */
  title?: string;
  /** Nội dung thông báo */
  message?: string;
  /** Nội dung tùy chỉnh bổ sung hoặc thay thế message */
  children?: React.ReactNode;
  /**
   * Icon bên trái:
   * - true (mặc định): icon tự động theo variant
   * - false: ẩn icon
   * - React.ReactNode: icon tùy chỉnh
   */
  icon?: React.ReactNode | boolean;
  /** Cho phép hiện nút đóng (X) bên phải */
  closable?: boolean;
  /** Callback khi người dùng ấn nút đóng */
  onClose?: () => void;
  /** Nút hành động nhanh */
  action?: {
    label: string;
    onPress: () => void;
  };
  /** Style container ngoài cùng */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function AppAlert({
  variant = 'info',
  styleType = 'subtle',
  title,
  message,
  children,
  icon = true,
  closable = false,
  onClose,
  action,
  style,
  testID,
}: AppAlertProps) {
  const theme = useTheme();
  const [closed, setClosed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Chuẩn hóa alias 'danger' -> 'error'
  const normalizedVariant: AlertVariant = variant === 'danger' ? 'error' : variant;

  const getVariantConfig = () => {
    switch (normalizedVariant) {
      case 'success':
        return {
          color: theme.colors.quickScanner,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(34, 197, 94, 0.15)'
              : 'rgba(22, 163, 74, 0.12)',
          defaultIcon: <CircleCheckIcon size={20} color={theme.colors.quickScanner} />,
          roleLabel: 'Thành công',
        };
      case 'warning':
        return {
          color: theme.colors.statusWarning,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(251, 146, 60, 0.15)'
              : 'rgba(194, 65, 12, 0.12)',
          defaultIcon: <TriangleAlertIcon size={20} color={theme.colors.statusWarning} />,
          roleLabel: 'Cảnh báo',
        };
      case 'error':
        return {
          color: theme.colors.statusDanger,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(255, 90, 95, 0.15)'
              : 'rgba(217, 45, 32, 0.12)',
          defaultIcon: <CircleAlertIcon size={20} color={theme.colors.statusDanger} />,
          roleLabel: 'Lỗi',
        };
      case 'info':
      default:
        return {
          color: theme.colors.macroCarbs,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(59, 130, 246, 0.15)'
              : 'rgba(37, 99, 235, 0.12)',
          defaultIcon: <InfoIcon size={20} color={theme.colors.macroCarbs} />,
          roleLabel: 'Thông tin',
        };
    }
  };

  const { color: statusColor, bgAlpha, defaultIcon, roleLabel } = getVariantConfig();

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setClosed(true);
      onClose?.();
    });
  };

  if (closed) {
    return null;
  }

  // Phân loại kiểu viền & nền theo styleType
  const getContainerStyle = (): ViewStyle => {
    switch (styleType) {
      case 'outline':
        return {
          backgroundColor: theme.colors.surfaceMid,
          borderColor: statusColor,
          borderWidth: 1.5,
        };
      case 'leftAccent':
        return {
          backgroundColor: bgAlpha,
          borderColor: theme.colors.surfaceBorder,
          borderWidth: 1,
          borderLeftColor: statusColor,
          borderLeftWidth: 4,
        };
      case 'subtle':
      default:
        return {
          backgroundColor: bgAlpha,
          borderColor: statusColor,
          borderWidth: 1,
        };
    }
  };

  const renderIcon = () => {
    if (icon === false) return null;
    if (icon && icon !== true) {
      return <View style={styles.iconWrapper}>{icon}</View>;
    }
    return <View style={styles.iconWrapper}>{defaultIcon}</View>;
  };

  const accessibilityLabel = `${roleLabel}: ${title ? `${title}. ` : ''}${message ?? ''}`;

  return (
    <Animated.View
      testID={testID}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.container,
        getContainerStyle(),
        { opacity: fadeAnim },
        style,
      ]}
    >
      {renderIcon()}

      <View style={styles.contentContainer}>
        {title ? (
          <AppText variant="labelLg" color={statusColor} style={styles.title}>
            {title}
          </AppText>
        ) : null}

        {message ? (
          <AppText variant="bodyMd" color={theme.colors.textPrimary}>
            {message}
          </AppText>
        ) : null}

        {children}

        {action ? (
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  borderColor: statusColor,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <AppText
                variant="labelSm"
                color={statusColor}
                style={styles.actionText}
              >
                {action.label}
              </AppText>
            </Pressable>
          </View>
        ) : null}
      </View>

      {closable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng thông báo"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleClose}
          style={({ pressed }) => [
            styles.closeBtn,
            { opacity: pressed ? 0.5 : 0.8 },
          ]}
        >
          <CloseXIcon size={18} color={theme.colors.textSecondary} />
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 16, // rounded-lg per DESIGN.md
  },
  iconWrapper: {
    paddingTop: 2,
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: '700',
  },
  actionRow: {
    marginTop: 6,
    flexDirection: 'row',
  },
  actionBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 9999, // pill
    borderWidth: 1,
  },
  actionText: {
    fontWeight: '600',
  },
  closeBtn: {
    paddingTop: 2,
    paddingLeft: 4,
  },
});
