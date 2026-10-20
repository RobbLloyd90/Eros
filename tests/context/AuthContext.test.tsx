// Test plan for src/context/AuthContext.tsx
// Needs localStorage cleared between tests (db.ts wraps it) and WebAuthnAPI mocked via
// jest.mock('../../src/utils/webauthn') since real biometric calls can't run in jsdom.
// Also note: this module auto-seeds a DEV_USER + demo ledger on import.meta.env.DEV -- may need
// to account for that side effect running once per test file, or mock import.meta.env for prod-like tests.

// useAuth()
// - throws 'useAuth must be used within an AuthProvider' when called outside a provider

// loginWithPin(userId, pin)
// - returns true and sets currentUser/isAuthenticated when the pin hash matches the stored user
// - returns false and leaves state unchanged when the userId doesn't exist
// - returns false when the pin is wrong (hash mismatch)

// loginWithBiometrics(userId)
// - returns false immediately when the user has no fidoCredential on file
// - returns true and authenticates when WebAuthnAPI.authenticate resolves true
// - returns false when WebAuthnAPI.authenticate resolves false or rejects (catch branch)

// logout()
// - clears currentUser to null and isAuthenticated to false

// registerUser(name, pin, theme)
// - creates a new UserProfile with a unique 'usr_' + timestamp id and hashed pin
// - persists the user via db.saveUser and refreshes the `users` state from storage

// deleteAccount(userId)
// - removes the user via db.deleteUser, refreshes `users`, and calls logout()

// enrollBiometrics()
// - returns false immediately when there's no currentUser
// - on WebAuthnAPI.register success: merges the returned credential into currentUser, persists
//   via db.saveUser, and returns true
// - on WebAuthnAPI.register rejecting: returns false without throwing

// removeBiometrics()
// - no-ops when there's no currentUser
// - sets fidoCredential to null on the current user and persists the change

// updateTheme(newTheme) / updateCharts(newCharts)
// - both no-op when there's no currentUser
// - both persist the updated user via db.saveUser and update currentUser/users state

// exportUserData(userId) / importUserData(payload)
// - exportUserData delegates to db.exportUser and returns its result
// - importUserData delegates to db.importUser, refreshes `users` state, and returns the profile
