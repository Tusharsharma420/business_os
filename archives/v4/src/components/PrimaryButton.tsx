import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
}

export function PrimaryButton({ label, onPress, color }: PrimaryButtonProps) {
  const theme = Colors.light;
  const bg = color ?? theme.primary;

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 14,
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
