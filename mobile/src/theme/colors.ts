import type {Theme} from '@react-navigation/native';

export const colors = {
  primary: '#00E676',
  primaryDim: '#00C853',
  accent: '#7C4DFF',
  accentDim: '#651FFF',
  cyan: '#00E5FF',
  pink: '#FF4081',
  warning: '#FFC107',
  error: '#FF5252',
  white: '#FFFFFF',
};

export const darkColors = {
  background: '#0A0A1A',
  surface: '#141428',
  surfaceGlass: 'rgba(20, 20, 40, 0.7)',
  surfaceElevated: '#1C1C3A',
  text: '#F5F5FF',
  textSecondary: '#9898B8',
  textMuted: '#606080',
  border: 'rgba(255,255,255,0.06)',
  glow: 'rgba(0, 230, 118, 0.15)',
  glowAccent: 'rgba(124, 77, 255, 0.15)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 36,
};

const baseFont = {
  regular: {fontFamily: 'System', fontWeight: '400' as const},
  medium: {fontFamily: 'System', fontWeight: '500' as const},
  bold: {fontFamily: 'System', fontWeight: '700' as const},
  heavy: {fontFamily: 'System', fontWeight: '900' as const},
};

export const lightTheme: Theme = {
  dark: false,
  fonts: baseFont,
  colors: {
    primary: colors.primary,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.text,
    border: darkColors.border,
    notification: colors.error,
  },
};

export const darkTheme: Theme = {
  dark: true,
  fonts: baseFont,
  colors: {
    primary: colors.primary,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.text,
    border: darkColors.border,
    notification: colors.error,
  },
};
