export const Colors = {
  light: {
    background: '#FFFFFF', // Pure White
    surface: '#F9F9F9', // Elevated
    primary: '#00C805', // Robinhood Green
    positive: '#00C805',
    negative: '#FF5000', // Vibrant Orange/Red
    textHigh: '#000000',
    textLow: '#8E8E93',
  },
  dark: {
    background: '#09090B',
    surface: '#18181B',
    primary: '#00C805',
    positive: '#00C805',
    negative: '#EF4444',
    textHigh: '#FAFAFA',
    textLow: '#A1A1AA',
  }
};

export const Spacing = {
  base: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 64,
};

export const Typography = {
  fontFamily: 'System', // Uses SF Pro on Apple devices natively
  fontFamilyMono: 'System', // Can be refined to specific monospace if needed
  fontSize: {
    title: 32,
    header: 24,
    body: 16,
    caption: 12,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  }
};
