// Test plan for src/utils/webauthn.ts
// Wraps the browser WebAuthn API -- `navigator.credentials` and `window.PublicKeyCredential`
// don't exist in jsdom by default, so these all need mocks/stubs rather than real device hardware.
// Consider whether this file is better suited to a thin wrapper you trust visually/manually on a
// real device (Android biometric prompt) rather than deeply unit testing the browser API shape.

// WebAuthnAPI.register(userId, userName)
// - throws a clear error when window.PublicKeyCredential is undefined (unsupported device)
// - calls navigator.credentials.create with the expected publicKey options shape
//   (rp.id === window.location.hostname, authenticatorAttachment: 'platform', etc.)
// - on success, returns { id, rawId (base64), publicKey } built from the mocked credential
// - on navigator.credentials.create rejecting, the error propagates (doesn't swallow it)

// WebAuthnAPI.authenticate(credentialId)
// - throws when window.PublicKeyCredential is undefined
// - decodes the base64 credentialId correctly into allowCredentials[0].id
// - returns true when navigator.credentials.get resolves with a truthy assertion
// - returns false (not a thrown error) when navigator.credentials.get rejects/throws

// Other testing to consider outside unit tests:
// - manual/exploratory testing on a real Android device for actual FaceID/fingerprint prompts,
//   since jsdom mocks can't validate real platform authenticator behavior
