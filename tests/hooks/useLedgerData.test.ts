// Test plan for src/hooks/useLedgerData.ts
// This hook composes several effects from useLedgerDataEffects.ts (see that test file) plus its
// own derived state and save handlers. Effects can be mocked out with jest.mock() so this file
// focuses purely on the hook's own logic (activeMonthKey derivation, food-total injection into
// outflows, and the handle* mutation functions), rather than re-testing the effects here.

// activeMonthKey derivation
// - formats as `${year}-${paddedMonth}` with a leading zero for single-digit months (e.g. "2026-05")

// activeData / processedOutflows (food-total injection)
// - when a 'fluid-food' outflow entry already exists, its `actual` is overwritten with the sum
//   of all activeFood entry prices for the month
// - when no 'fluid-food' entry exists yet but food entries ARE present, a new synthetic
//   'fluid-food' outflow entry is appended with actual = total food spend
// - when there's no 'fluid-food' entry and no food entries, outflows are left untouched

// handleModalSave(modal)
// - no-op (doesn't touch ledger) when modal.name is falsy
// - goal branch (isGoal or bladeId === 'goals'): 'add' mode appends a new Goal with a
//   Date.now()-based id; 'edit' mode replaces the matching goal by id, others untouched
// - savings branch: interestEarned is computed via calculateMonthlySavingsInterest only when
//   isFixedInterestRate is true; otherwise uses the manually entered interestEarned value
// - debt branch: interestAccrued is always computed via calculateDailyDebtInterest, using
//   FALLBACK_DEBT_ACCRUAL_DAYS when there's no previousPaymentDate
// - inflows/outflows branch: 'tag' is only included on the saved entry when bladeId === 'outflows'
// - each branch correctly initializes a brand-new month bucket when activeMonthKey doesn't
//   exist yet in the ledger

// handleFoodSave(foodModal)
// - no-op when item or price is missing/falsy
// - 'add' mode appends a new FoodEntry with a generated id; 'edit' mode replaces by id
// - category defaults to 'General' when not provided

// handleRemoveEntry(bladeId, id)
// - removes the entry with matching id from the given blade in the active month AND all
//   future months, but leaves months before activeMonthKey completely untouched
// - adds the removed id to `removedIds` for every affected month (tombstone behavior), without
//   duplicating ids already present in removedIds

// handleRemoveFood(id)
// - removes only the matching food entry from the active month; other months unaffected
// - no-op (returns prev unchanged) if activeMonthKey doesn't exist in the ledger yet

// handleRemoveGoal(id) vs handleRemoveGoalEverywhere(id)
// - handleRemoveGoal only strips the goal from activeMonthKey onward (past months keep it) and
//   tombstones the id in removedIds for affected months
// - handleRemoveGoalEverywhere strips the goal from every month in the ledger, past included,
//   and does NOT touch removedIds
