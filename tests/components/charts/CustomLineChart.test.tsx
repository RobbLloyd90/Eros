// Test plan for src/components/charts/CustomLineChart.tsx
// This file has the most defensive/guard logic of the chart components -- prioritize the
// safety-guard cases since a regression here would previously have crashed with NaN/undefined.

// Safety guards
// - renders an empty/fallback state (not a crash) when data.labels is empty
// - renders an empty/fallback state when data.datasets is empty or datasets have no values
// - targetValue falls back to 0 (validTarget) when it's undefined or NaN, rather than breaking
//   the target-line rendering

// Y-axis scaling
// - the Y-axis range dynamically scales from the min to the max value across all datasets

// Target line
// - the dotted target-value line only renders when targetValue is defined AND greater than 0

// Multi-dataset rendering
// - renders one polyline + circle-marker set per dataset in data.datasets
// - the legend lists every dataset's label with its corresponding color swatch

// Theming
// - stroke-width differs by theme (confirm the specific themes that opt into a bolder line)
