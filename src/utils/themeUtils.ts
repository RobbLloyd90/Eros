import type { ThemeType } from '../types';

export const isNothingTheme = (theme: ThemeType): boolean => theme.includes('nothing');

/** Font-family for small labels/telemetry text that only special-cases the Nothing themes. */
export const getLabelFontFamily = (theme: ThemeType): string =>
  isNothingTheme(theme) ? "'DotGothic16', sans-serif" : 'inherit';

/** Font-family for numeric/mono telemetry text, falling back to a monospace face outside light mode. */
export const getMonoFontFamily = (theme: ThemeType, isLight: boolean): string =>
  isNothingTheme(theme) ? "'DotGothic16', sans-serif" : isLight ? 'inherit' : "'Share Tech Mono', monospace";

/** Text color that stays readable on top of the theme's "positive" accent color. */
export const getContrastTextColor = (theme: ThemeType): string => (isNothingTheme(theme) ? '#000' : '#fff');
