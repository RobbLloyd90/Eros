// Test plan for src/components/AddChartModal.tsx
// Render with React Testing Library, wrapped in ModalBackdrop's real markup (or shallow-mock it).

// Chart type / source interdependency
// - selecting chart type 'line' auto-resets source to 'netWorth' (even if a pie/bar-only
//   source was previously selected)
// - selecting 'pie' or 'bar' does NOT force-reset an already-valid source

// Goal multiselect (source === 'goal_trend')
// - the goal picker only renders when the selected source is 'goal_trend'
// - toggling a goal checkbox adds/removes its id from the modal's targetIds array
// - renders correctly (no crash) when a goal has an undefined/NaN targetAmount, per the
//   'CRITICAL FIX' comment guarding toFixed() calls

// Save / close
// - clicking save calls handleSave with the current modal state
// - clicking the close (X) button closes the modal without calling handleSave
