// Test plan for src/components/entryModal/RecurringIncomeSection.tsx

// Conditional frequency UI
// - the frequency dropdown only renders when the "recurring income" checkbox is checked
// - unchecking the recurring checkbox hides the frequency dropdown again (and, ideally,
//   clears/resets the previously chosen frequency -- verify actual behavior)

// Fortnightly-specific UI
// - the cycle-start-week selector only renders when frequency === 'fortnightly'
// - switching away from 'fortnightly' to another frequency hides the cycle-start selector

// Frequency options
// - the dropdown offers weekly / fortnightly / monthly_last_friday / monthly_last_day options
