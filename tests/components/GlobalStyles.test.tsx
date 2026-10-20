// Test plan for src/components/GlobalStyles.tsx
// Static CSS injection only (font-face declarations, scrollbar styling, float keyframes) --
// there is no branching logic or props to unit test here.
//
// - a single smoke test asserting the component renders without throwing is likely the only
//   unit-test value; anything beyond that (do the fonts actually load offline in the Android
//   WebView, do the animations look right) belongs in manual/visual QA, not Jest.
