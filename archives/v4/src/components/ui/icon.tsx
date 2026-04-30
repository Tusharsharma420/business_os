import { LucideIcon, LucideProps } from 'lucide-react-native';
import React from 'react';
import { Colors } from '@/constants/DesignSystem';

/**
 * A central SVG icon component that wraps Lucide icons.
 * Provides consistent defaults for size, color, and stroke width for a premium look.
 */
interface IconProps extends LucideProps {
  icon: LucideIcon;
}

export function Icon({
  icon: IconComponent,
  size = 24,
  color = Colors.light.textHigh,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
