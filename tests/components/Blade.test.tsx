// Test plan for src/components/Blade.tsx

// Total calculation per blade type
// - 'savings' blade total sums (currentBalance + contribution + interestEarned) across entries
// - 'debt' blade total includes the monthly accrued interest calculation, not just raw balance
// - 'inflows'/'outflows' blade total sums `actual` across entries

// Outflow filtering
// - entries tagged 'fluid' are hidden from the outflows blade list (they're surfaced in FoodView
//   instead) -- verify 'fixed' tagged entries still render normally

// Active/inactive toggle behavior
// - clicking the tab header when inactive calls the toggle handler to make it active
// - clicking the tab header when already active collapses it back down
// - topPosition/bladeHeight props correctly drive the rendered inline styles (spring values
//   can be asserted on the style attribute rather than animated motion internals)

// Row-level actions
// - clicking edit on an entry/goal calls the passed edit handler with that entry's id/data
// - clicking remove calls the passed remove handler with the correct bladeId + id
