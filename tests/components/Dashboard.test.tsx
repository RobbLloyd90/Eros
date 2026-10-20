// Test plan for src/components/Dashboard.tsx
// Reads state via useAppState() -- mock that hook's return value to control ledger/theme fixtures
// rather than wrapping in a real provider tree for most cases.

// Outflows total (food inclusion fix)
// - the displayed outflows metric includes the food total added on top of raw outflow entries
//   (per the 'CRITICAL FIX' comment), so it matches what MonthLedger shows

// Missing-data resilience
// - renders without crashing when activeMonthData is undefined/missing for the current month
//   (optional chaining + Number() casting should prevent NaN/crash)

// PrivacyRow hold-to-reveal behavior
// - the metric renders blurred/masked by default when the corresponding privacy setting is on
// - pointerDown on the eye icon reveals the real value; pointerUp re-masks it
// - when the privacy setting is off, the value is always shown unmasked (no hold interaction needed)

// Navigation
// - clicking each quick-access button calls setView with the corresponding view name
//   (year/month/food)

// Chart widgets
// - renders one ChartWidget per entry in `charts`
// - clicking a chart widget's edit/delete affordance calls the corresponding modal setter
