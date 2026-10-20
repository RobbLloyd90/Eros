// Test plan for src/hooks/useMonthPagination.ts
// Use @testing-library/react-hooks (or React's `renderHook` if using RTL's built-in support)
// to drive this hook in isolation.

// paginateMonth(newDirection)
// - direction +1 from a mid-year month (e.g. June) just increments the month, year unchanged
// - direction +1 from December rolls over to January of the NEXT year
// - direction -1 from January rolls back to December of the PREVIOUS year
// - direction -1 from a mid-year month just decrements the month, year unchanged
// - swipeDirection state updates to match the direction passed in
// - the optional onPaginate callback is invoked exactly once per call, when provided
// - setCurrentMonth/setCurrentYear are called with the expected computed values (these are
//   passed in as mocks/spies since the hook doesn't own the state itself)

// handleDragEnd(_e, { offset, velocity })
// - a swipe power (offset.x * velocity.x) below the negative confidence threshold triggers
//   paginateMonth(1) (swipe left = next month)
// - a swipe power above the positive confidence threshold triggers paginateMonth(-1)
//   (swipe right = previous month)
// - a swipe power within the threshold band (a soft/slow drag) triggers no pagination at all

// swipeVariants export
// - sanity check the exported animation variants object still has enter/center/exit keys
//   (cheap regression guard against accidental breakage, not core logic)
