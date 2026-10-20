// Test plan for src/components/entryModal/SavingsSection.tsx

// Fixed-interest-rate toggle
// - checking "Fixed Interest Rate" recalculates interestEarned via
//   calculateMonthlySavingsInterest(currentBalance, interestRate) and makes the field read-only
// - unchecking it makes interestEarned manually editable again (value preserved, not reset)
// - while fixed-rate is on, changing balance or rate live-recalculates interestEarned

// Recurring contribution toggle
// - toggling "Recurring Contribution" updates modal.isRecurringContribution, which
//   useSavingsCarryoverEffect later reads to decide whether contribution carries into next month

// Field wiring
// - editing balance/contribution/interestRate updates the corresponding modal field directly
