import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CircleAlertIcon,
  CircleCheckIcon,
  CloseXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from '@/components/icons';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top' | 'bottom';

export type ToastAction = {
  label: string;
  onPress: () => void;
  testID?: string;
};

export type ToastItem = {
  id: string;
  type?: ToastType | 'danger';
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  icon?: React.ReactNode | false;
  action?: ToastAction;
  onPress?: () => void;
  onDismiss?: () => void;
  showProgress?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export type AppToastProps = {
  toast: ToastItem | null;
  onDismiss: (id?: string) => void;
};

export function AppToast({ toast, onDismiss }: AppToastProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { colors, shadows } = theme;

  const position = toast?.position ?? 'top';
  const duration = toast?.duration ?? (toast?.type === 'loading' ? 0 : toast?.type === 'error' || toast?.type === 'danger' ? 4500 : 3500);
  const showProgress = (toast?.showProgress ?? true) && duration > 0;

  // Animation values
  const initialOffset = position === 'top' ? -140 : 140;
  const targetOffset = position === 'top' ? insets.top + 8 : -(insets.bottom + 16);

  const translateY = useRef(new Animated.Value(initialOffset)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Timer & pause tracking
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(duration);
  const startTimeRef = useRef<number>(Date.now());
  const isPausedRef = useRef<boolean>(false);
  const progressAnimInstance = useRef<Animated.CompositeAnimation | null>(null);

  // Normalize variant
  const normalizedType: ToastType =
    toast?.type === 'danger' ? 'error' : (toast?.type ?? 'info');

  const variantConfig = useMemo(() => {
    const isDark = theme.scheme === 'dark';
    switch (normalizedType) {
      case 'success':
        return {
          color: colors.quickScanner,
          bgAlpha: isDark ? 'rgba(34, 197, 94, 0.16)' : 'rgba(22, 163, 74, 0.12)',
          defaultIcon: <CircleCheckIcon size={20} color={colors.quickScanner} />,
          roleLabel: 'Thành công',
        };
      case 'error':
        return {
          color: colors.statusDanger,
          bgAlpha: isDark ? 'rgba(255, 90, 95, 0.16)' : 'rgba(217, 45, 32, 0.12)',
          defaultIcon: <CircleAlertIcon size={20} color={colors.statusDanger} />,
          roleLabel: 'Lỗi',
        };
      case 'warning':
        return {
          color: colors.statusWarning,
          bgAlpha: isDark ? 'rgba(251, 146, 60, 0.16)' : 'rgba(194, 65, 12, 0.12)',
          defaultIcon: <TriangleAlertIcon size={20} color={colors.statusWarning} />,
          roleLabel: 'Cảnh báo',
        };
      case 'loading':
        return {
          color: colors.brandPrimary,
          bgAlpha: isDark ? 'rgba(158, 100, 247, 0.16)' : 'rgba(123, 79, 224, 0.12)',
          defaultIcon: <ActivityIndicator size="small" color={colors.brandPrimary} />,
          roleLabel: 'Đang tải',
        };
      case 'info':
      default:
        return {
          color: colors.brandPrimary,
          bgAlpha: isDark ? 'rgba(158, 100, 247, 0.16)' : 'rgba(123, 79, 224, 0.12)',
          defaultIcon: <InfoIcon size={20} color={colors.brandPrimary} />,
          roleLabel: 'Thông tin',
        };
    }
  }, [normalizedType, theme.scheme, colors]);

  const clearCurrentTimer = () => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    if (progressAnimInstance.current) {
      progressAnimInstance.current.stop();
      progressAnimInstance.current = null;
    }
  };

  const handleDismiss = (callOnDismiss = true) => {
    clearCurrentTimer();
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: initialOffset,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callOnDismiss && toast) {
        toast.onDismiss?.();
        onDismiss(toast.id);
      }
    });
  };

  const startAutoDismissTimer = (ms: number) => {
    if (ms <= 0) return;
    clearCurrentTimer();
    remainingTimeRef.current = ms;
    startTimeRef.current = Date.now();
    isPausedRef.current = false;

    // Start progress bar animation
    progressAnimInstance.current = Animated.timing(progressAnim, {
      toValue: 0,
      duration: ms,
      useNativeDriver: false, // width/flex uses JS driver
    });
    progressAnimInstance.current.start();

    dismissTimer.current = setTimeout(() => {
      handleDismiss(true);
    }, ms);
  };

  const pauseTimer = () => {
    if (duration <= 0 || isPausedRef.current) return;
    isPausedRef.current = true;
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    if (progressAnimInstance.current) {
      progressAnimInstance.current.stop();
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const resumeTimer = () => {
    if (duration <= 0 || !isPausedRef.current) return;
    if (remainingTimeRef.current > 0) {
      startAutoDismissTimer(remainingTimeRef.current);
    } else {
      handleDismiss(true);
    }
  };

  // Entry animation
  useEffect(() => {
    if (toast) {
      translateY.setValue(initialOffset);
      opacity.setValue(0);
      progressAnim.setValue(1);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: targetOffset,
          useNativeDriver: true,
          friction: 8,
          tension: 50,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      startAutoDismissTimer(duration);

      return () => {
        clearCurrentTimer();
      };
    } else {
      clearCurrentTimer();
      translateY.setValue(initialOffset);
      opacity.setValue(0);
    }
  }, [toast?.id, targetOffset]);

  // Swipe gesture via PanResponder
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Detect vertical swipes
          if (position === 'top') {
            return gestureState.dy < -5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
          } else {
            return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
          }
        },
        onPanResponderGrant: () => {
          pauseTimer();
        },
        onPanResponderMove: (_, gestureState) => {
          if (position === 'top') {
            if (gestureState.dy < 0) {
              translateY.setValue(targetOffset + gestureState.dy);
            }
          } else {
            if (gestureState.dy > 0) {
              translateY.setValue(targetOffset + gestureState.dy);
            }
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const dismissThreshold = 35;
          const shouldDismiss =
            position === 'top'
              ? gestureState.dy < -dismissThreshold || gestureState.vy < -0.5
              : gestureState.dy > dismissThreshold || gestureState.vy > 0.5;

          if (shouldDismiss) {
            handleDismiss(true);
          } else {
            // Spring back to target
            Animated.spring(translateY, {
              toValue: targetOffset,
              useNativeDriver: true,
              friction: 7,
            }).start(() => {
              resumeTimer();
            });
          }
        },
      }),
    [position, targetOffset]
  );

  if (!toast) return null;

  const renderIcon = () => {
    if (toast.icon === false) return null;
    if (toast.icon && toast.icon !== true) {
      return <View style={[styles.iconBox, { backgroundColor: variantConfig.bgAlpha }]}>{toast.icon}</View>;
    }
    return (
      <View style={[styles.iconBox, { backgroundColor: variantConfig.bgAlpha }]}>
        {variantConfig.defaultIcon}
      </View>
    );
  };

  const shadowStyle = shadows.level2;
  const accessibilityLabel = `${variantConfig.roleLabel}: ${toast.title ? `${toast.title}. ` : ''}${toast.message}`;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.toastWrapper,
        position === 'top' ? styles.wrapperTop : styles.wrapperBottom,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        {...panResponder.panHandlers}
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.surfaceMid,
            borderColor: colors.surfaceBorder,
          },
          shadowStyle,
          toast.style,
        ]}
      >
        <Pressable
          testID={toast.testID ?? 'app-toast-container'}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessibilityLabel={accessibilityLabel}
          onPressIn={pauseTimer}
          onPressOut={resumeTimer}
          onPress={() => {
            if (toast.onPress) {
              toast.onPress();
              handleDismiss(true);
            }
          }}
          style={styles.cardInner}
        >
          {renderIcon()}

          <View style={styles.textContainer}>
            {toast.title ? (
              <AppText
                variant="labelLg"
                color={variantConfig.color}
                numberOfLines={1}
                style={styles.titleText}
              >
                {toast.title}
              </AppText>
            ) : null}
            <AppText
              variant="bodySm"
              color={colors.textSecondary}
              numberOfLines={3}
              style={styles.messageText}
            >
              {toast.message}
            </AppText>
          </View>

          {toast.action ? (
            <TouchableOpacity
              testID={toast.action.testID ?? 'toast-action-button'}
              onPress={() => {
                toast.action?.onPress();
                handleDismiss(true);
              }}
              style={[
                styles.actionButton,
                { backgroundColor: variantConfig.bgAlpha, borderColor: variantConfig.color },
              ]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AppText variant="labelMd" color={variantConfig.color}>
                {toast.action.label}
              </AppText>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            testID="toast-close-button"
            onPress={() => handleDismiss(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Đóng thông báo"
          >
            <CloseXIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </Pressable>

        {showProgress ? (
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                  backgroundColor: variantConfig.color,
                },
              ]}
            />
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99999,
    alignItems: 'center',
  },
  wrapperTop: {
    top: 0,
  },
  wrapperBottom: {
    bottom: 0,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: '700',
  },
  messageText: {
    lineHeight: 18,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    height: 2.5,
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
});
