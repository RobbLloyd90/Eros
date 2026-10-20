// Test plan for src/components/DeleteChartModal.tsx
// Simple confirmation dialog -- straightforward interaction tests only.

// - renders the chart's title in the confirmation message
// - clicking BACK closes the modal without calling handleConfirm
// - clicking REMOVE calls handleConfirm (with the chart id) and closes the modal
// - renders nothing / stays hidden when modal.isOpen is false
