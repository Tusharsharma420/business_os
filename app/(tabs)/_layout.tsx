import { Tabs } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/DesignSystem';
import { Icon } from '@/components/ui/icon';
import { 
  House, 
  History, 
  Users, 
  Package, 
  BarChart3, 
  Settings 
} from 'lucide-react-native';

export default function TabLayout() {
  const theme = Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLow,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 6 },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: '#F2F2F7',
          height: 64,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon icon={House} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Ledger',
          tabBarIcon: ({ color }) => <Icon icon={History} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Icon icon={Users} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color }) => <Icon icon={Package} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <Icon icon={BarChart3} size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Identity',
          tabBarIcon: ({ color }) => <Icon icon={Settings} size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

