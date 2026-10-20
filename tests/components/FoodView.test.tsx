// Test plan for src/components/FoodView.tsx
// Reads state via useAppState() and useMonthPagination() -- mock both to control fixtures.

// Sorting / rendering
// - entries render sorted by date descending (most recent purchase first)
// - renders an empty-state message when activeFood is an empty array

// Month navigation
// - a left/right swipe drag (simulated via the drag handler prop, not real pointer events)
//   triggers month pagination the same way useMonthPagination's own tests verify
// - the container sets touchAction: 'pan-y' so vertical scrolling isn't hijacked by the
//   horizontal swipe gesture (assert on the rendered style)

// Row actions
// - clicking edit on a food entry calls onEdit with that entry
// - clicking delete calls onRemove with that entry's id
