// Test plan for src/components/YearView.tsx
// Reads state via useAppState() -- mock ledger/currentYear/setCurrentMonth/setView.

// Active-month highlighting
// - a month with a corresponding ledger[monthKey] entry renders with the "ACTIVE" badge/green
//   border
// - a month with no ledger entry renders as a plain/inactive tile

// Navigation
// - clicking a month tile calls setCurrentMonth with that month's number and setView('month')
// - clicking a month with no data still navigates (a month can be viewed even before any
//   entries exist for it), unless the actual component intentionally blocks this -- verify
//   against real behavior first

// Layout
// - renders exactly 12 month tiles in a 3-column grid for the given currentYear
