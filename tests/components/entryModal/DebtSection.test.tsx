// Test plan for src/components/entryModal/DebtSection.tsx

// Auto-calculated accrued interest
// - changing balance, interest rate, or payment date recalculates interestAccrued via
//   calculateDailyDebtInterest + getDaysBetweenDates
// - when there's no previousPaymentDate, the day count falls back to FALLBACK_DEBT_ACCRUAL_DAYS
// - the accrued-interest input is always disabled/read-only (never directly user-editable)

// Derived display
// - the "remaining after this payment" metric equals currentBalance + interestAccrued - actualPayment

// Field wiring
// - editing balance/minimumPayment/actualPayment/interestRate updates the corresponding modal field
