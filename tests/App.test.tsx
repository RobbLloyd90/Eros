// Test plan for src/App.tsx
// This is the top-level app shell -- render with React Testing Library, wrapped in real
// AuthProvider/AppStateProvider (or thin fixtures), and mock useLedgerData/useAuth as needed to
// avoid depending on the full effect chain for every test.

// Modal state lifecycle (add vs edit)
// - opening "add entry" for a blade resets the modal to blank/default fields
// - opening "edit entry" pre-fills the modal with the selected entry's existing values
// - saving in 'edit' mode closes the modal afterward
// - saving in 'add' mode clears the fields but leaves the modal open (rapid repeated entry)

// Modal open/close wiring
// - each of the 5 modal types (entry/food/chart/delete-chart/delete-goal) can be opened and
//   closed independently without affecting the others' state

// Goal removal routing
// - choosing "remove from here" calls handleRemoveGoal (this month forward only)
// - choosing "remove everywhere" calls handleRemoveGoalEverywhere (all months)

// First-login chart initialization
// - a brand-new user with no saved chart config gets a sensible default chart seeded
// - an existing user's saved chart config is used as-is, not overwritten

// Other testing to consider outside unit tests:
// - integration/E2E test (Playwright) for the full "add entry -> appears in month ledger ->
//   persists after reload" flow, since this file wires together many hooks/contexts that are
//   individually unit tested elsewhere
