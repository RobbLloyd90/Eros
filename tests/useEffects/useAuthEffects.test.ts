// Test plan for src/useEffects/useAuthEffects.ts

// useLoadUsersEffect(setUsers, setUsersLoaded)
// - on mount, calls setUsers with the result of db.getUsers() (mock db.getUsers to control the
//   returned fixture)
// - on mount, calls setUsersLoaded(true) exactly once, after setUsers
// - works correctly when setUsersLoaded is omitted (optional param) -- doesn't throw
