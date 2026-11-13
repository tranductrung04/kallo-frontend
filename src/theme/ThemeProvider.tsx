import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { colors, type ColorScheme, type ColorTokens } from './colors';
import { radii, spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

// Elevation object is theme-aware: dark gets glow, light gets tinted shadows
type ThemeShadows = typeof shadows.dark | typeof shadows.light;

export type Theme = {
  scheme: ColorScheme;
  colors: ColorTokens;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: ThemeShadows;
  typography: typeof typography;
  fontsLoaded: boolean;
};
export type ThemeContextValue = Theme & { toggleScheme: () => void; setScheme: (scheme: ColorScheme) => void };

const THEME_KEY = '@kallo/theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [scheme, setScheme] = useState<ColorScheme>(systemScheme === 'dark' ? 'dark' : 'light');

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    void AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') setScheme(stored);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(THEME_KEY, scheme).catch(() => undefined);
  }, [scheme]);

  const theme = useMemo<Theme>(() => ({
    scheme,
    colors: colors[scheme],
    spacing,
    radii,
    // Provide theme-aware shadows: dark glows vs light tinted
    shadows: scheme === 'dark' ? shadows.dark : shadows.light,
    typography,
    fontsLoaded: Boolean(fontsLoaded),
  }), [scheme, fontsLoaded]);

  const value = useMemo(() => ({
    ...theme,
    toggleScheme: () => setScheme((current) => current === 'light' ? 'dark' : 'light'),
    setScheme,
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
