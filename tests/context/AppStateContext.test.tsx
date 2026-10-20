// Test plan for src/context/AppStateContext.tsx

// useAppState()
// - throws 'useAppState must be used within an AppStateProvider' when called outside a
//   provider (render a small test component with no wrapping AppStateProvider)
// - returns exactly the `value` object passed into AppStateProvider when called inside one
//   (render a test component wrapped in <AppStateProvider value={fixture}>, assert the hook
//   result matches the fixture reference/shape)

// AppStateProvider
// - renders its children unchanged (it's a pass-through wrapper around context)
// - a value update (re-render with a new `value` prop) is reflected by consumers on next render
