import { Platform } from 'react-native';

export const AppleDesign = {
  colors: {
    primary: '#007AFF', // Classic Apple Blue
    secondary: '#5856D6', // Apple Indigo
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    background: '#F2F2F7', // iOS Grouped Background
    card: '#FFFFFF',
    text: {
      high: '#000000',
      medium: '#3C3C4399', // 60% opacity black
      low: '#3C3C434D', // 30% opacity black
    },
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    small: 12,
    medium: 18,
    large: 28, // High-curvature corners
    full: 999,
  },
  shadows: {
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    floating: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  typography: {
    h1: {
      fontSize: 34,
      fontWeight: '800' as const,
      letterSpacing: -1,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    body: {
      fontSize: 17,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 13,
      fontWeight: '500' as const,
      color: '#3C3C4399',
    }
  }
};
