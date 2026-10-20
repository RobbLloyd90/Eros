// Test plan for src/components/GoalCard.tsx

// currentlySaved calculation
// - sums (balance + contribution + interest) across all savings entries whose id appears in
//   goal.linkedSavings, ignoring unrelated savings accounts
// - returns 0 when linkedSavings is empty or none of the ids match any savingsData entry

// Progress percentage
// - clamps to 100% when currentlySaved exceeds targetAmount (never renders over 100%)
// - clamps to 0% (not negative) when currentlySaved is 0 or targetAmount is 0
//   (guard against divide-by-zero producing NaN/Infinity)

// amountLeft calculation
// - equals targetAmount - currentlySaved when currentlySaved is below target
// - clamps to 0 (never negative) once the goal is fully/over funded

// Theming
// - border style is dotted under the 'nothing_os' theme, solid otherwise
// - accent color respects isLight and the 'nothing_glow' override

// Actions
// - clicking edit (pencil) calls onEdit with this goal
// - clicking remove (X) calls onRemove with this goal
