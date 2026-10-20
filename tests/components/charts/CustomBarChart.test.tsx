// Test plan for src/components/charts/CustomBarChart.tsx

// Bar height normalization
// - each bar's height is a percentage of the maximum value in `data`
// - the bar with the max value renders at 100% height
// - guards against a max value of 0 across all data (shouldn't divide by zero / render NaN heights)

// Labels
// - the £ value is displayed above each bar
// - x-axis labels longer than 5 characters are truncated

// Empty state
// - renders an empty-state message (not a broken/empty chart) when `data` is []
