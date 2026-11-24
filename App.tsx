import 'react-native-gesture-handler';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';

WebBrowser.maybeCompleteAuthSession();
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/navigation/RootNavigator';
import { ThemeProvider, useTheme } from '@/theme';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ActivityProvider } from '@/features/activity';
import { NutritionProvider } from '@/features/nutrition/NutritionProvider';
import { MealPlanProvider } from '@/features/meal-plan';
import { GamificationProvider } from '@/features/gamification';
import { OfflineSyncProvider } from '@/services/offline';
import { SystemProvider } from '@/features/system';
import { AlertProvider, OfflineBanner, ToastProvider } from '@/components/common';

function AppContent() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <OfflineBanner />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AlertProvider>
            <ToastProvider>
              <AuthProvider>
                <OfflineSyncProvider>
                  <SystemProvider>
                    <ActivityProvider>
                      <NutritionProvider>
                        <MealPlanProvider>
                          <GamificationProvider>
                            <AppContent />
                          </GamificationProvider>
                        </MealPlanProvider>
                      </NutritionProvider>
                    </ActivityProvider>
                  </SystemProvider>
                </OfflineSyncProvider>
              </AuthProvider>
            </ToastProvider>
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
