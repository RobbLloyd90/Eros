// Test plan for src/components/LiquidBackground.tsx
// Purely decorative animated background -- low unit-test value beyond a couple of branch checks.

// - renders without crashing for each theme id (aero_g3, cybercore, nothing_os, nothing_glow, etc.)
// - the dotted-grid overlay only renders for "nothing" themes (isNothingTheme(theme) === true)
// - root container has pointerEvents: 'none' so it never intercepts touch/click input
//
// Other testing to consider outside unit tests:
// - visual/manual QA for the actual float animation smoothness and color palette per theme,
//   since Jest/jsdom can't meaningfully assert on CSS animation appearance
