export const LOCAL_ACCOUNT = {
  email: 'demo@kallo.local',
  password: 'Kallo1234',
  displayName: 'Kallo Demo',
} as const;

export const LOCAL_SESSION_KEY = '@kallo/local-session';
export const LOCAL_DEMO_ENABLED = process.env.EXPO_PUBLIC_USE_LOCAL_DEMO === 'true' || __DEV__;
