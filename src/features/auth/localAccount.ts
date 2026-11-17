export type AppDataMode = 'demo' | 'backend';

/**
 * Chế độ dữ liệu của ứng dụng:
 * - 'demo': Dùng dữ liệu giả lập offline (LOCAL_ACCOUNT, không gọi backend)
 * - 'backend': Kết nối trực tiếp với Spring Boot backend qua EXPO_PUBLIC_API_URL
 */
export const APP_DATA_MODE: AppDataMode =
  process.env.EXPO_PUBLIC_DATA_MODE === 'demo' || process.env.EXPO_PUBLIC_USE_LOCAL_DEMO === 'true'
    ? 'demo'
    : 'backend';

export const IS_DEMO_MODE = APP_DATA_MODE === 'demo';

// LOCAL_DEMO_ENABLED kích hoạt khi và chỉ khi chế độ demo được bật qua biến môi trường
export const LOCAL_DEMO_ENABLED = IS_DEMO_MODE;

export const LOCAL_ACCOUNT = {
  email: 'demo@kallo.local',
  password: 'Kallo1234',
  displayName: 'Kallo Demo',
} as const;

export const LOCAL_SESSION_KEY = '@kallo/local-session';
