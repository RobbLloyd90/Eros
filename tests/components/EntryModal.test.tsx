// Test plan for src/components/EntryModal.tsx
// This is the most complex modal -- polymorphic form rendering based on modal.bladeId.

// Section routing
// - bladeId === 'savings' renders SavingsSection (and not DebtSection/GoalSection/etc.)
// - bladeId === 'debt' renders DebtSection
// - bladeId === 'goals' (or isGoal) renders GoalSection
// - bladeId === 'inflows' renders RecurringIncomeSection + CategoryPicker
// - bladeId === 'outflows' renders CategoryPicker only (no recurring-income section)

// Mode-dependent behavior
// - the blade/section selector is disabled (or hidden) when modal.mode === 'edit', but
//   enabled when mode === 'add'

// Linked food entry special-casing
// - when modal.id === 'fluid-food', the name and actual-amount inputs are disabled and a
//   "LINKED" badge is shown, since this entry is derived from FoodView totals

// Save flow
// - clicking SAVE calls handleModalSave with the current modal state
// - required-field validation (e.g. blank name) prevents save or surfaces an error, per
//   whatever the actual current validation behavior is -- verify against real behavior first
