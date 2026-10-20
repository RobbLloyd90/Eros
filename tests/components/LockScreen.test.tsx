// Test plan for src/components/LockScreen.tsx
// Reads state via useAuth() -- mock loginWithPin/loginWithBiometrics/registerUser as jest.fn()s.

// Login vs register toggle
// - shows the registration form by default when there are no existing users
// - shows the login (user list) view by default once users exist
// - manually toggling via the "create account" button switches to the registration form
//   regardless of whether users already exist

// Validation
// - registration is blocked (or shows a validation message) when name.length <= 2
// - registration is blocked when pin.length < 4

// Registration flow
// - submitting a valid name+pin calls registerUser, then auto-logs in, then returns to the
//   login list view afterward (per the "auto-login then switch back to login" comment)
// - new profiles are created with the default 'aero_g3' theme

// Login flow
// - selecting a user and entering a PIN calls loginWithPin with that userId + pin
// - a failed loginWithPin (wrong PIN) surfaces an error/shake state rather than silently
//   proceeding
// - clicking the biometric option (when available) calls loginWithBiometrics with that userId
