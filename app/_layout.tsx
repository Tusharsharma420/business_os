import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
    // 1. Monitor Auth State
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // 2. Sign in Anonymously if not logged in
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error("Auth Error", e);
        }
      } else {
        // 3. User is ready, trigger cloud sync
        if (syncWithCloud) {
          await syncWithCloud(user.uid);
        }
        setIsReady(true);
      }
    });

    return unsubscribe;
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
