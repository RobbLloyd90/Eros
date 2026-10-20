// Test plan for src/components/charts/CustomPieChart.tsx

// Slice geometry
// - cumulative stroke-dashoffset correctly positions each slice in sequence (slice N starts
//   where slice N-1 ended)
// - percentages across all slices sum to (approximately) the full circle

// Legend
// - renders a scrollable legend when there are more than 4 data entries
// - renders a static (non-scrolling) legend when there are 4 or fewer entries

// Empty state
// - renders an empty-state message when `data` is []
