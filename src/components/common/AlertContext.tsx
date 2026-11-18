// ─── AlertContext & AlertProvider — Global Imperative Alert System ───────────
// Cung cấp hook `useAlert()` toàn cục thay thế cho React Native Alert.alert
// Đồng bộ 100% theme Nocturne & Daylight, typography Plus Jakarta Sans & AppButton
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertModal,
  type AlertModalButton,
  type AlertModalVariant,
} from './AlertModal';

export type ShowAlertOptions = {
  title: string;
  message?: string;
  variant?: AlertModalVariant;
  icon?: React.ReactNode | false;
  buttons?: AlertModalButton[];
  dismissible?: boolean;
  autoDismissMs?: number;
  onDismiss?: () => void;
  testID?: string;
};

export type ShowConfirmOptions = {
  title: string;
  message?: string;
  variant?: AlertModalVariant;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  dismissible?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  testID?: string;
};

export type AlertContextValue = {
  showAlert: (options: ShowAlertOptions) => void;
  showConfirm: (options: ShowConfirmOptions) => void;
  hideAlert: () => void;
  isAlertVisible: boolean;
};

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [modalProps, setModalProps] = useState<ShowAlertOptions | null>(null);
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissCallback = useRef<(() => void) | undefined>(undefined);

  const clearTimer = useCallback(() => {
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }
  }, []);

  const hideAlert = useCallback(() => {
    clearTimer();
    const callback = onDismissCallback.current;
    onDismissCallback.current = undefined;
    setModalProps(null);
    callback?.();
  }, [clearTimer]);

  const showAlert = useCallback(
    (options: ShowAlertOptions) => {
      clearTimer();
      onDismissCallback.current = options.onDismiss;
      setModalProps(options);

      if (options.autoDismissMs && options.autoDismissMs > 0) {
        autoDismissTimer.current = setTimeout(() => {
          hideAlert();
        }, options.autoDismissMs);
      }
    },
    [clearTimer, hideAlert]
  );

  const showConfirm = useCallback(
    ({
      title,
      message,
      variant,
      confirmText = 'Xác nhận',
      cancelText = 'Hủy',
      destructive = false,
      dismissible = false,
      onConfirm,
      onCancel,
      testID,
    }: ShowConfirmOptions) => {
      showAlert({
        title,
        message,
        variant: variant ?? (destructive ? 'danger' : 'warning'),
        dismissible,
        testID,
        buttons: [
          {
            text: cancelText,
            variant: 'secondary',
            onPress: () => {
              hideAlert();
              onCancel?.();
            },
          },
          {
            text: confirmText,
            variant: destructive ? 'danger' : 'primary',
            onPress: async () => {
              await onConfirm();
              hideAlert();
            },
          },
        ],
      });
    },
    [showAlert, hideAlert]
  );

  const contextValue = useMemo<AlertContextValue>(
    () => ({
      showAlert,
      showConfirm,
      hideAlert,
      isAlertVisible: Boolean(modalProps),
    }),
    [showAlert, showConfirm, hideAlert, modalProps]
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {modalProps ? (
        <AlertModal
          visible={Boolean(modalProps)}
          title={modalProps.title}
          message={modalProps.message}
          variant={modalProps.variant}
          icon={modalProps.icon}
          buttons={modalProps.buttons}
          dismissible={modalProps.dismissible}
          onRequestClose={hideAlert}
          testID={modalProps.testID}
        />
      ) : null}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
