// Test plan for src/utils/themeUtils.ts

// isNothingTheme(theme)
// - returns true for every theme id containing 'nothing' (e.g. 'nothing_os', 'nothing_glow')
// - returns false for non-"nothing" themes (e.g. 'aero_g3', 'cybercore')

// getLabelFontFamily(theme)
// - returns the DotGothic16 font stack for nothing themes
// - returns 'inherit' for non-nothing themes

// getMonoFontFamily(theme, isLight)
// - returns DotGothic16 for nothing themes regardless of isLight
// - returns 'inherit' for non-nothing themes when isLight is true
// - returns the Share Tech Mono stack for non-nothing themes when isLight is false

// getContrastTextColor(theme)
// - returns '#000' for nothing themes
// - returns '#fff' for all other themes
