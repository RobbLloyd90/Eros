// Test plan for src/utils/chartDataEngine.ts

// getChartSourceLabel(source)
// - returns the mapped label for every known ChartSource value
// - returns the 'Chart' fallback for an unrecognized/invalid source string

// getChartData(source, activeMonthData, theme)
// - returns [] when activeMonthData is null/undefined
// - source === 'food': groups entries by category (falling back to 'Other' when category is
//   missing), sums price per category, computes percentage of total spend, sorts descending by value
// - source === 'food' with zero total spend: percentage should be 0 for all entries, not NaN/Infinity
// - source === 'outflows' / 'inflows': sums `actual` per entry, computes percentage of total, sorts descending
// - unrecognized source string returns []
// - color assignment: first slice gets the neon override color under 'nothing_glow' theme;
//   'nothing_os' theme alternates white/gray; other themes cycle through the fixed color palette

// getLineChartData(chart, ledger, theme, tStyle, isLight)
// - returns null when chart.source is not one of the valid trend/line sources
// - returns null when the ledger has no month keys
// - labels are built as "MON 'YY" for every month key, sorted chronologically
// - source 'netWorth': builds three datasets (Total Savings, Total Debt, Net Worth) where
//   Net Worth = Total Savings - Total Debt for each month
// - source 'savings_trend' / 'debt_trend': single dataset summing the relevant blade per month
// - debt total per month uses interestAccrued when defined, otherwise falls back to
//   currentBalance * (interestRate/100) / 12
// - source 'inflows_trend' / 'outflows_trend' / 'food_trend': sums `actual`/`price` per month
// - source 'goal_trend': currently short-circuited (the goal-progress engine is commented out) --
//   verify current actual behavior (likely empty/zeroed series) and flag this as a known gap
//   rather than assuming the commented-out logic runs
// - each source produces the correct dataset `label` and `color` (e.g. inflows -> tStyle.colors.pos,
//   outflows -> tStyle.colors.neg)
