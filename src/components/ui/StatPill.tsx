import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/DesignSystem';

interface StatPillProps {
  label: string;
  value: string;
  bgColor: string;
  color: string;
  icon?: any;
}

export function StatPill({ label, value, bgColor, color, icon }: StatPillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: bgColor }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        {icon && <Icon icon={icon} size={12} color={color} style={{ marginRight: 4 }} />}
        <Text style={[styles.pillLabel, { color }]}>{label}</Text>
      </View>
      <Text style={[styles.pillValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { 
    flex: 1, 
    padding: Spacing.md, 
    borderRadius: 14, 
    alignItems: 'center' 
  },
  pillLabel: { 
    fontSize: 11, 
    fontWeight: '700', 
    textTransform: 'uppercase' 
  },
  pillValue: { 
    fontSize: 16, 
    fontWeight: '800' 
  },
});
