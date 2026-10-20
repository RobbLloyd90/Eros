// Test plan for src/components/DeleteGoalModal.tsx

// - renders the goal's name in the confirmation message
// - clicking "remove from this month forward" calls onRemoveFromHere (not onRemoveEverywhere)
// - clicking "delete permanently" calls onRemoveEverywhere (not onRemoveFromHere)
// - both buttons close the modal after their respective callback fires
// - renders nothing / stays hidden when modal.isOpen is false
