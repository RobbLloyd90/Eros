// Test plan for src/components/SettingsView.tsx
// Reads state via useAuth() + useAppState() -- mock export/import/delete/biometric methods, and
// mock @capacitor/filesystem + @capacitor/share + the Capacitor.isNativePlatform() check since
// native plugins don't exist in a jsdom/CI environment.

// Theme picker
// - selecting a different theme calls the theme-update handler with the new value

// Privacy toggles
// - toggling the savings/credit blur switches updates privacySettings accordingly

// Biometric enrollment
// - clicking "enroll" shows an "Awaiting..." pending state, then success/failure feedback based
//   on what enrollBiometrics() resolves to

// Export/import (branch by platform)
// - on native (Capacitor.isNativePlatform() === true): writes the export payload via
//   @capacitor/filesystem and triggers the native share sheet
// - on web (isNativePlatform() === false): builds a Blob and triggers a browser download instead
// - import: selecting a valid backup file calls importUserData and shows a success status message
// - import: selecting a corrupted/invalid file surfaces an error status message (from the
//   'Invalid or corrupted backup file.' error db.importUser throws)

// Account deletion
// - the delete button requires an explicit confirmation step/toggle before actually calling
//   deleteAccount (shouldn't fire on a single accidental click)

// Logout
// - clicking logout calls the logout handler
