// Test plan for src/components/entryModal/GoalSection.tsx

// linkedSavings safety
// - renders correctly (no crash) when modal.linkedSavings is undefined, per the "SAFE CHECK"
//   guard before calling .includes()

// Checkbox toggling
// - checking a savings account's checkbox adds its id to modal.linkedSavings
// - unchecking removes its id from modal.linkedSavings
// - toggling one account doesn't affect other already-linked accounts

// Empty state
// - renders an empty-state message (e.g. "no savings accounts yet") when savingsData is []

// Field wiring
// - editing target amount / target date (month picker) updates the corresponding modal field
