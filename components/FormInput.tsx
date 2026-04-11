import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Spacing } from '@/constants/DesignSystem';

interface FormInputProps extends TextInputProps {
  label: string;
}

export function FormInput({ label, ...props }: FormInputProps) {
  const theme = Colors.light;

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: theme.textLow }]}>{label}</Text>
      <TextInput
        style={[styles.input, { color: theme.textHigh, backgroundColor: '#F2F2F7' }]}
        placeholderTextColor={theme.textLow}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
});
