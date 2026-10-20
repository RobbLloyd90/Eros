// Test plan for src/components/dashboard/ChartWidget.tsx
// Long-press timing logic is the highest-value target here -- use jest.useFakeTimers() to
// control the 2s long-press window rather than real setTimeout delays.

// Chart type routing
// - chart.type === 'pie' renders CustomPieChart
// - chart.type === 'bar' renders CustomBarChart
// - chart.type === 'line' renders CustomLineChart (fed by getLineChartData())

// Long-press-to-delete gesture
// - a pointerDown held for >= 2s (advance fake timers) triggers onDelete, and calls
//   navigator.vibrate() for haptic feedback (mock navigator.vibrate)
// - a pointerDown released before 2s elapses does NOT trigger onDelete
// - releasing pointerUp right after a completed long-press does NOT also trigger a click/edit
//   (the "prevents double-trigger" flag)

// Click-to-edit gesture
// - a quick pointerDown+pointerUp (well under 2s) calls onEdit instead of onDelete

// Context menu / text selection
// - the widget suppresses the native context menu (oncontextmenu prevented) during long-press
