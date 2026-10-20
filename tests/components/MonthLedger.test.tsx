// Test plan for src/components/MonthLedger.tsx
// Reads state via useAppState() + useMonthPagination() -- mock both.

// Blade stacking layout
// - blades above the active index compute a topPosition that stacks them from the top
// - the active blade's computed height/position expands it to fill the available space
// - blades below the active index stack from the bottom
// - toggling a different blade active recomputes all positions accordingly

// Month-swipe reset behavior
// - swiping to a new month resets the active blade index back to 0 (first blade), even if a
//   different blade was expanded before the swipe

// Rendering
// - renders one Blade per entry in BLADE_CONFIG, passing that blade's slice of activeData/activeGoals
