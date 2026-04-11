import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/DesignSystem';
import { useColorScheme } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textLow,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: 'CRM',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.2.fill" color={color} />, // Fallback icon
        }}
      />
      <Tabs.Screen
        name="ledger"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chevron.left.forwardslash.chevron.right" color={color} />, // Fallback to avoid missing icons
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Sales',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Operations',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="briefcase.fill" color={color} />, // Fallback icon
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'Team',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />, // Fallback icon
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />, // Fallback icon
        }}
      />
    </Tabs>
  );
}
