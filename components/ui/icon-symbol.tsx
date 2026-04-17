// SVG-based IconSymbol using Lucide icons for a premium, consistent look across platforms.

import React from 'react';
import { 
  Home, 
  ArrowLeftRight, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  Send, 
  ChevronRight,
  Code2,
  LucideIcon
} from 'lucide-react-native';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Icon } from './icon';

/**
 * Add your SF Symbols to Lucide icon mappings here.
 */
const MAPPING = {
  // Tabs
  'house.fill': Home,
  'repeat': ArrowLeftRight,
  'person.2.fill': Users,
  'cube.fill': Package,
  'chart.bar.fill': BarChart3,
  'gearshape.fill': Settings,
  // UI Elements
  'paperplane.fill': Send,
  'chevron.left.forwardslash.chevron.right': Code2,
  'chevron.right': ChevronRight,
} as const;

type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses Lucide SVG icons across all platforms.
 * This ensures a premium, high-fidelity look and consistent user experience.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  const IconComponent = MAPPING[name];
  return <Icon icon={IconComponent} size={size} color={color} style={style} />;
}

