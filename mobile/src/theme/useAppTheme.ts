import {useMemo} from 'react';
import {useTheme} from '@react-navigation/native';
import {lightColors, darkColors, spacing, borderRadius, fontSize, colors} from './colors';

export function useAppTheme() {
  const theme = useTheme();
  const isDark = theme.dark;
  const c = isDark ? darkColors : lightColors;

  return useMemo(
    () => ({
      isDark,
      colors: c,
      brand: colors,
      spacing,
      radius: borderRadius,
      font: fontSize,
    }),
    [isDark],
  );
}
