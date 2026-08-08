import type { ThemeType } from '../types';
import { getLabelFontFamily, getContrastTextColor } from './themeUtils';

/** Shared frosted-glass text input styling used across all modal forms. */
export const getInputStyle = (tStyle: any, theme: ThemeType, isLight: boolean) => ({
  backgroundColor: tStyle.colors.metricBg,
  color: tStyle.colors.primary,
  border: isLight ? `1px solid rgba(0,0,0,0.1)` : `1px solid rgba(255,255,255,0.1)`,
  padding: '12px',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  fontFamily: getLabelFontFamily(theme),
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
});

/** Shared small uppercase field label styling used across all modal forms. */
export const getLabelStyle = (tStyle: any, theme: ThemeType) => ({
  fontSize: '10px',
  color: tStyle.colors.secondary,
  letterSpacing: '1px',
  fontWeight: 700,
  fontFamily: getLabelFontFamily(theme)
});

/** Shared primary/save action button styling used across all modal forms. */
export const getPrimaryButtonStyle = (tStyle: any, theme: ThemeType, isLight: boolean) => ({
  backgroundColor: tStyle.colors.pos,
  color: getContrastTextColor(theme),
  border: 'none',
  padding: '14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 'bold' as const,
  letterSpacing: '1px',
  cursor: 'pointer',
  marginTop: '8px',
  boxShadow: isLight
    ? 'inset 0 2px 2px rgba(255,255,255,0.4), 0 4px 10px rgba(16, 185, 129, 0.3)'
    : 'inset 0 2px 2px rgba(255,255,255,0.4)',
  fontFamily: getLabelFontFamily(theme)
});
