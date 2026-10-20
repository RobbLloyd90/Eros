// Test plan for src/useEffects/useLedgerDataEffects.ts
// Render each hook via renderHook() with mocked db.getLedger/saveLedger and a controllable
// `Date` (e.g. jest.useFakeTimers().setSystemTime(...)) since several of these depend on "today".

// useCurrentUserEffect(currentUser, setLedger, setCurrentYear, setCurrentMonth)
// - on mount with a currentUser, loads the ledger via db.getLedger and calls setLedger with it
// - when there's no recurring income entry for the current month, sets currentYear/Month to
//   today's actual year/month (no rollover)
// - when a 'monthly_last_day' recurring income exists and today >= getLastWorkingDayOfMonth,
//   rolls currentMonth forward by one (and currentYear forward if rolling from December)
// - when a 'monthly_last_friday' / 'weekly' / 'fortnightly' recurring income exists and today >=
//   getLastWorkingFridayOfMonth, rolls forward the same way
// - does nothing when currentUser is null

// useTrackingEngineEffect(ledger)
// - computes totalSavings as the sum of currentBalance + contribution + interestEarned across
//   every month's savings entries
// - computes totalDebt using interestAccrued when present, else falls back to
//   currentBalance * (interestRate/100)/12, then adds accrued and subtracts actualPayment
// - this effect currently only console.logs its results (no return value / no UI state) --
//   tests should spy on console.log or refactor is out of scope; at minimum verify it doesn't throw
//   on an empty ledger ({}) and computes correct totals for a populated fixture ledger

// useSaveLedgerEffect(ledger, currentUser)
// - calls db.saveLedger(currentUser.id, ledger) whenever ledger changes, but only when
//   currentUser is set AND ledger has at least one month key
// - does NOT call db.saveLedger when currentUser is null
// - does NOT call db.saveLedger when ledger is an empty object (avoids overwriting real data with {})

// useRecurringInjectorEffect(...)
// - injects recurring inflow entries from the previous month into the active month when they're
//   missing there (matched by id)
// - does NOT re-inject an entry whose id is present in removedIds for either the previous or
//   current month (tombstone respected)
// - does nothing when the previous month has no ledger data, or none of its inflows are recurring
// - injected entries are shallow clones (not the same object reference as the previous month's)

// useSavingsCarryoverEffect(...)
// - rolls forward savings accounts missing from the active month, computing
//   currentBalance = prevBalance + prevContribution + prevInterestEarned
// - contribution carries forward only when isRecurringContribution is true, otherwise resets to 0
// - interestEarned is recalculated via calculateMonthlySavingsInterest when isFixedInterestRate
//   is true, otherwise resets to 0
// - respects removedIds tombstones from both the previous and current month
// - does nothing when the previous month has no savings entries

// useGoalCarryoverEffect(...)
// - rolls forward goals missing from the active month as shallow clones
// - respects removedIds tombstones (a goal removed via handleRemoveGoal stops propagating forward)
// - does nothing when the previous month has no goals

// useDebtCarryoverEffect(...)
// - rolls forward debts missing from the active month, computing
//   endingBalance = prevBalance + prevInterestAccrued - prevActualPayment
// - advances paymentDate by one month via addOneMonthPreservingCadence when a paymentDate exists
// - recalculates interestAccrued from the new balance and the day-gap between old/new payment
//   dates, falling back to FALLBACK_DEBT_ACCRUAL_DAYS when there's no prior paymentDate
// - respects removedIds tombstones from both the previous and current month
