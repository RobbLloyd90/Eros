// Test plan for src/components/charts/FoodPieChart.tsx

// Aggregation
// - sums foodEntries by category (grouping entries that share the same category string)
// - computes each category's percentage of total spend correctly
// - sorts categories descending by total spend

// Theming color overrides
// - under 'nothing_glow' theme, the first (largest) category slice uses the neon #CEFF00 override
// - under 'nothing_os' theme, slices alternate white/gray by index
// - other themes cycle through the standard chart color palette

// Empty state
// - renders an empty-state message when foodEntries is []
