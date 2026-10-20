// Test plan for src/storage/database.ts
// All methods wrap localStorage -- use jsdom's built-in localStorage and call
// localStorage.clear() in beforeEach so tests don't leak state into each other.

// db.getUsers()
// - returns {} when nothing has been saved yet
// - returns the parsed users object after saveUser() has been called

// db.saveUser(user)
// - persists the user under the shared users key, keyed by user.id
// - saving a brand-new user also initializes an empty (or DEV-seeded) ledger for them
// - saving a user that already has a ledger in storage does NOT overwrite that existing ledger
// - dev vs prod seeding: verify behavior differs based on import.meta.env.DEV
//   (may need to mock/stub import.meta.env for this branch)

// db.deleteUser(userId)
// - removes the user from the users object
// - removes that user's ledger entry from localStorage entirely

// db.getLedger(userId) / db.saveLedger(userId, ledger)
// - getLedger returns {} for a user with no saved ledger
// - saveLedger followed by getLedger round-trips the same ledger object (deep equal)
// - ledgers for different userIds don't collide/overwrite each other

// db.exportUser(userId)
// - throws a descriptive error when no user exists with that id
// - returns an object with version, exportedAt (ISO string), profile, and ledger populated
//   from the current storage state

// db.importUser(payload)
// - throws 'Invalid or corrupted backup file.' when payload is not an object
// - throws when payload.profile is missing required string fields (id/name/pinHash)
// - throws when payload.ledger is missing/not an object
// - valid payload: saves the profile into users and the ledger under that profile's id,
//   and returns the profile
