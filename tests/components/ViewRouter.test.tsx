// Test plan for src/components/ViewRouter.tsx
// Reads `view` via useAppState() -- mock it to control which view fixture renders.

// - renders Dashboard when view === 'dashboard'
// - renders YearView when view === 'year'
// - renders MonthLedger when view === 'month'
// - renders FoodView when view === 'food'
// - renders SettingsView when view === 'settings'
// - only one view is mounted at a time (AnimatePresence mode="wait" -- assert the previous
//   view's content is gone once the new one's transition completes, not both simultaneously)
