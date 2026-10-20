// Test plan for src/components/Header.tsx

// Nav button visibility per view
// - the "home" icon only renders when currentView !== 'dashboard'
// - the "add entry" button only renders on 'month' and 'food' views (not dashboard/year/settings)

// currentMargin (profit/loss) display
// - renders as "+£X" (positive/pos color) when currentMargin >= 0
// - renders as "-£X" (negative/neg color) when currentMargin < 0

// Navigation actions
// - clicking the back/home button calls the corresponding navigation handler
// - clicking the settings icon calls the settings navigation handler
// - clicking the add-entry button calls its handler (only reachable on month/food views)

// Title / date display
// - the header title reflects the current view and, where applicable, the current month/year
//   (e.g. "MAY 2026" using MONTH_NAMES from config.ts)
