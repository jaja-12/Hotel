// Design Token System for Premium Room Booking SaaS
export const colors = {
  // Primary Navy
  navy: {
    50: '#F0F4F8',
    100: '#D9E2F0',
    200: '#B3C5E1',
    300: '#8DA8D2',
    400: '#678BC3',
    500: '#0F172A', // Deep navy - main
    600: '#0D1425',
    700: '#0B0D1F',
    800: '#070919',
    900: '#030410',
  },
  // Gold Accent
  gold: {
    50: '#FFFDF5',
    100: '#FFFBEB',
    200: '#FEF5D6',
    300: '#FDD89F',
    400: '#FCBB66',
    500: '#D4AF37', // Gold - main
    600: '#A8862D',
    700: '#7C5F23',
    800: '#503719',
    900: '#2D200F',
  },
  // Warm Gray
  warm: {
    50: '#FAFAF8',
    100: '#F3F4F6',
    200: '#E7E8EA',
    300: '#DDDEE2',
    400: '#C5C7CC',
    500: '#9DA0A8', // Warm gray - secondary
    600: '#757A83',
    700: '#4D5059',
    800: '#2D303A',
    900: '#151619',
  },
  // Soft Blue
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C2D6B',
  },
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};

export const gradients = {
  luxuryGold: 'linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)',
  luxuryNavy: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
  skyGradient: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
  warmGradient: 'linear-gradient(135deg, #F3F4F6 0%, #E7E8EA 100%)',
  premiumGrad: 'linear-gradient(135deg, #0F172A 0%, #D4AF37 100%)',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

export const typography = {
  h1: {
    size: '48px',
    weight: 700,
    lineHeight: '1.1',
  },
  h2: {
    size: '36px',
    weight: 700,
    lineHeight: '1.2',
  },
  h3: {
    size: '24px',
    weight: 600,
    lineHeight: '1.3',
  },
  h4: {
    size: '20px',
    weight: 600,
    lineHeight: '1.4',
  },
  body: {
    size: '16px',
    weight: 400,
    lineHeight: '1.6',
  },
  small: {
    size: '14px',
    weight: 400,
    lineHeight: '1.5',
  },
};

export const transitionDuration = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};
