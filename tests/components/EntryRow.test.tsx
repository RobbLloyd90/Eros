// Test plan for src/components/EntryRow.tsx

// Metric set per blade type
// - bladeId 'inflows'/'outflows': shows expected, actual, and a diff figure
// - bladeId 'savings': shows balance, contribution, interest, computed total, and rate
// - bladeId 'debt': shows balance, minimum payment, actual payment, accrued interest,
//   the "extra" paid over minimum, and the resulting new balance

// Diff coloring (flows)
// - diff renders in the "positive" color when actual is under/equal to expected (under budget)
// - diff renders in the "negative" color when actual exceeds expected (over budget)

// Category badge coloring
// - inflow entries render the category badge in a green/positive tone
// - outflow entries render the category badge in a red/negative tone

// Actions
// - clicking the edit (pencil) icon calls onEdit with this entry
// - clicking the delete (X) icon calls onRemove with this entry's bladeId + id
