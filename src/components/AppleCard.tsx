import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { AppleDesign } from '@/constants/AppleDesign';

interface AppleCardProps extends ViewProps {
  variant?: 'subtle' | 'floating';
  glass?: boolean;
}

export function AppleCard({ children, style, variant = 'subtle', glass = false, ...props }: AppleCardProps) {
  return (
    <View 
      style={[
        styles.card, 
        AppleDesign.shadows[variant], 
        glass && styles.glass,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppleDesign.colors.card,
    borderRadius: AppleDesign.radius.large,
    padding: AppleDesign.spacing.lg,
    overflow: 'hidden',
  },
  glass: {
    backgroundColor: AppleDesign.colors.glass,
    ...Platform.select({
      ios: {
        // Blur is usually handled by BlurView on iOS, but we use high opacity for now
      }
    })
  }
});
