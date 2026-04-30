import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useOSStore } from '@/store/useOSStore';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const syncWithCloud = useOSStore(state => (state as any).syncWithCloud);

  useEffect(() => {
    const initApp = async () => {
      try {
        // For local backend, we use a fixed local-user ID or generate one
        if (syncWithCloud) {
          await syncWithCloud('local-user');
        }
      } catch (e) {
        console.error("Initialization Sync Error", e);
      } finally {
        setIsReady(true);
      }
    };

    initApp();
  }, []);

  if (!isReady) return null; // Or a splash screen

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="invoice/[txId]" options={{ title: 'Invoice' }} />
        <Stack.Screen name="contact/[contactId]" options={{ title: 'Contact' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
