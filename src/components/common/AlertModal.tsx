// ─── AlertModal — Nocturne & Daylight Vitality ───────────────────────────────
// DESIGN.md: "Modals and Overlays"
//   Frosted overlay: Dark rgba(13, 11, 20, 0.75) / Light rgba(19, 18, 27, 0.45)
//   Container: Level 1 surfaceMid, border 1px surfaceBorder, rounded-lg (20px)
//   Top badge: 56px circular indicator with status alpha background
//   Buttons: AppButton (primary / secondary / destructive)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  Modal,
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
  InfoIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export type AlertModalVariant = 'info' | 'success' | 'warning' | 'error' | 'danger';

export type AlertModalButton = {
  text: string;
  onPress?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  testID?: string;
};

export type AlertModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  variant?: AlertModalVariant;
  icon?: React.ReactNode | false;
  buttons?: AlertModalButton[];
  dismissible?: boolean;
  onRequestClose?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function AlertModal({
  visible,
  title,
  message,
  children,
  variant = 'info',
  icon = true,
  buttons,
  dismissible = false,
  onRequestClose,
  style,
  testID,
}: AlertModalProps) {
  const theme = useTheme();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  if (!visible) return null;

  const normalizedVariant: AlertModalVariant = variant === 'danger' ? 'error' : variant;

  const getVariantConfig = () => {
    switch (normalizedVariant) {
      case 'success':
        return {
          color: theme.colors.quickScanner,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(34, 197, 94, 0.18)'
              : 'rgba(22, 163, 74, 0.14)',
          defaultIcon: <CircleCheckIcon size={28} color={theme.colors.quickScanner} />,
          roleLabel: 'Thành công',
        };
      case 'warning':
        return {
          color: theme.colors.statusWarning,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(251, 146, 60, 0.18)'
              : 'rgba(194, 65, 12, 0.14)',
          defaultIcon: <TriangleAlertIcon size={28} color={theme.colors.statusWarning} />,
          roleLabel: 'Cảnh báo',
        };
      case 'error':
        return {
          color: theme.colors.statusDanger,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(255, 90, 95, 0.18)'
              : 'rgba(217, 45, 32, 0.14)',
          defaultIcon: <CircleAlertIcon size={28} color={theme.colors.statusDanger} />,
          roleLabel: 'Lỗi',
        };
      case 'info':
      default:
        return {
          color: theme.colors.macroCarbs,
          bgAlpha:
            theme.scheme === 'dark'
              ? 'rgba(59, 130, 246, 0.18)'
              : 'rgba(37, 99, 235, 0.14)',
          defaultIcon: <InfoIcon size={28} color={theme.colors.macroCarbs} />,
          roleLabel: 'Thông tin',
        };
    }
  };

  const { color: statusColor, bgAlpha, defaultIcon, roleLabel } = getVariantConfig();

  const handleButtonPress = async (btn: AlertModalButton, index: number) => {
    if (loadingIndex !== null) return;
    if (!btn.onPress) {
      onRequestClose?.();
      return;
    }

    try {
      const result = btn.onPress();
      if (result instanceof Promise) {
        setLoadingIndex(index);
        await result;
      }
      onRequestClose?.();
    } catch (err) {
      console.error('AlertModal button error:', err);
    } finally {
      setLoadingIndex(null);
    }
  };

  const renderIconBadge = () => {
    if (icon === false) return null;
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: bgAlpha,
            borderColor: statusColor,
          },
        ]}
      >
        {icon && icon !== true ? icon : defaultIcon}
      </View>
    );
  };

  const renderButtons = () => {
    const actionButtons: AlertModalButton[] =
      buttons && buttons.length > 0
        ? buttons
        : [
            {
              text: 'Đóng',
              variant: 'primary',
              onPress: onRequestClose,
            },
          ];

    const isDouble = actionButtons.length === 2;

    return (
      <View style={isDouble ? styles.buttonRow : styles.buttonCol}>
        {actionButtons.map((btn, index) => {
          const isDestructive = btn.variant === 'danger';
          const isButtonLoading = btn.loading || loadingIndex === index;
          const isDisabled = loadingIndex !== null && loadingIndex !== index;

          return (
            <AppButton
              key={`${btn.text}-${index}`}
              label={btn.text}
              variant={
                isDestructive
                  ? 'primary'
                  : btn.variant === 'outline'
                  ? 'outline'
                  : btn.variant === 'secondary'
                  ? 'secondary'
                  : 'primary'
              }
              loading={isButtonLoading}
              disabled={isDisabled}
              testID={btn.testID}
              onPress={() => handleButtonPress(btn, index)}
              style={[
                isDouble ? styles.flexButton : styles.fullButton,
                isDestructive
                  ? {
                      backgroundColor: theme.colors.statusDanger,
                      borderColor: theme.colors.statusDanger,
                    }
                  : undefined,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      accessibilityViewIsModal
      accessibilityRole="alert"
      accessibilityLabel={`${roleLabel}: ${title}`}
      onRequestClose={dismissible ? onRequestClose : undefined}
    >
      <Pressable
        style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
        onPress={dismissible ? onRequestClose : undefined}
      >
        <Pressable
          testID={testID}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surfaceMid,
              borderColor: theme.colors.surfaceBorder,
            },
            style,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {renderIconBadge()}

          <AppText
            variant="headlineSm"
            color={theme.colors.textPrimary}
            align="center"
            style={styles.title}
          >
            {title}
          </AppText>

          {message ? (
            <AppText
              variant="bodyMd"
              color={theme.colors.textSecondary}
              align="center"
              style={styles.message}
            >
              {message}
            </AppText>
          ) : null}

          {children}

          {renderButtons()}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  buttonCol: {
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  flexButton: {
    flex: 1,
  },
  fullButton: {
    width: '100%',
  },
});
