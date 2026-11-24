import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppToast,
  type AppToastProps,
  type ToastAction,
  type ToastItem,
  type ToastPosition,
  type ToastType,
} from './AppToast';

export type ToastOptions = {
  id?: string;
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
};

export type PromiseToastMessages<T> = {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: any) => string);
};

export type ToastContextValue = {
  show: (options: ToastOptions | string) => string;
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  loading: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  promise: <T>(
    promise: Promise<T>,
    messages: PromiseToastMessages<T>,
    options?: Partial<ToastOptions>
  ) => Promise<T>;
  dismiss: (id?: string) => void;
  activeToast: ToastItem | null;
  isVisible: boolean;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ─── Imperative Controller Reference ─────────────────────────────────────────
type ToastController = {
  show: (options: ToastOptions | string) => string;
  dismiss: (id?: string) => void;
};

let currentController: ToastController | null = null;
let toastIdCounter = 0;

function generateToastId(): string {
  toastIdCounter += 1;
  return `toast-${Date.now()}-${toastIdCounter}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);
  const queueRef = useRef<ToastItem[]>([]);

  const dismiss = useCallback((id?: string) => {
    setActiveToast((current) => {
      if (!current) return null;
      if (!id || current.id === id) {
        // Check if there is another toast waiting in queue
        if (queueRef.current.length > 0) {
          const next = queueRef.current.shift()!;
          setTimeout(() => setActiveToast(next), 240);
        }
        return null;
      }
      return current;
    });
  }, []);

  const show = useCallback(
    (options: ToastOptions | string): string => {
      const opts: ToastOptions =
        typeof options === 'string' ? { message: options } : options;

      const id = opts.id ?? generateToastId();
      const item: ToastItem = {
        ...opts,
        id,
      };

      setActiveToast((current) => {
        // If updating the current active toast in place (e.g. promise loading -> success)
        if (current && current.id === id) {
          return item;
        }
        // If there's an active toast already, queue it or replace if loading
        if (current) {
          if (current.type === 'loading') {
            // Instantly replace loading toasts
            return item;
          }
          // Replace directly for immediate feedback
          return item;
        }
        return item;
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
      return show({
        ...options,
        type: 'success',
        message,
      });
    },
    [show]
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
      return show({
        ...options,
        type: 'error',
        message,
      });
    },
    [show]
  );

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
      return show({
        ...options,
        type: 'warning',
        message,
      });
    },
    [show]
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
      return show({
        ...options,
        type: 'info',
        message,
      });
    },
    [show]
  );

  const loading = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
      return show({
        ...options,
        type: 'loading',
        duration: 0, // Loading toasts are persistent until resolved/dismissed
        message,
      });
    },
    [show]
  );

  const promiseFn = useCallback(
    async <T,>(
      promiseToWatch: Promise<T>,
      messages: PromiseToastMessages<T>,
      options?: Partial<ToastOptions>
    ): Promise<T> => {
      const id = loading(messages.loading, {
        ...options,
        title: options?.title ?? 'Đang tải...',
      });

      try {
        const data = await promiseToWatch;
        const successMsg =
          typeof messages.success === 'function'
            ? messages.success(data)
            : messages.success;

        show({
          ...options,
          id,
          type: 'success',
          title: options?.title ?? 'Hoàn tất',
          message: successMsg,
        });

        return data;
      } catch (err: any) {
        const errorMsg =
          typeof messages.error === 'function' ? messages.error(err) : messages.error;

        show({
          ...options,
          id,
          type: 'error',
          title: options?.title ?? 'Thất bại',
          message: errorMsg,
        });

        throw err;
      }
    },
    [loading, show]
  );

  // Register controller singleton
  useEffect(() => {
    currentController = {
      show,
      dismiss,
    };
    return () => {
      currentController = null;
    };
  }, [show, dismiss]);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      show,
      success,
      error,
      warning,
      info,
      loading,
      promise: promiseFn,
      dismiss,
      activeToast,
      isVisible: Boolean(activeToast),
    }),
    [show, success, error, warning, info, loading, promiseFn, dismiss, activeToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <AppToast toast={activeToast} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ─── Global Hook ─────────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ─── Imperative Singleton API (`toast.*`) ─────────────────────────────────────
// Cho phép gọi toast từ bất kỳ đâu (trong component hoặc ngoài component,
// ví dụ: axios interceptors, background tasks, store callbacks, utils)
export const toast = {
  show: (options: ToastOptions | string): string => {
    if (currentController) {
      return currentController.show(options);
    }
    return '';
  },

  success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return toast.show({
      ...options,
      type: 'success',
      message,
    });
  },

  error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return toast.show({
      ...options,
      type: 'error',
      message,
    });
  },

  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return toast.show({
      ...options,
      type: 'warning',
      message,
    });
  },

  info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return toast.show({
      ...options,
      type: 'info',
      message,
    });
  },

  loading: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>): string => {
    return toast.show({
      ...options,
      type: 'loading',
      duration: 0,
      message,
    });
  },

  promise: async <T,>(
    promiseToWatch: Promise<T>,
    messages: PromiseToastMessages<T>,
    options?: Partial<ToastOptions>
  ): Promise<T> => {
    const id = toast.loading(messages.loading, {
      ...options,
      title: options?.title ?? 'Đang tải...',
    });

    try {
      const data = await promiseToWatch;
      const successMsg =
        typeof messages.success === 'function' ? messages.success(data) : messages.success;

      toast.show({
        ...options,
        id,
        type: 'success',
        title: options?.title ?? 'Hoàn tất',
        message: successMsg,
      });

      return data;
    } catch (err: any) {
      const errorMsg =
        typeof messages.error === 'function' ? messages.error(err) : messages.error;

      toast.show({
        ...options,
        id,
        type: 'error',
        title: options?.title ?? 'Thất bại',
        message: errorMsg,
      });

      throw err;
    }
  },

  dismiss: (id?: string): void => {
    currentController?.dismiss(id);
  },
};
