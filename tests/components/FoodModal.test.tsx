// Test plan for src/components/FoodModal.tsx

// Category selection
// - selecting a preset category (e.g. 'Coffee') sets modal.category directly, no custom input shown
// - selecting 'Custom' animates in an additional text input for a free-typed category
// - editing an existing entry whose category ISN'T in DEFAULT_CATEGORIES auto-detects it as
//   custom and pre-fills the custom input with that value

// Defaults
// - opening in 'add' mode defaults the date field to today's date (YYYY-MM-DD)
// - opening in 'edit' mode pre-fills all fields from the existing FoodEntry

// Save
// - clicking save calls handleSave with the current modal state
// - price is parsed as a number (not left as a raw string) before saving, per handleFoodSave's
//   parseFloat usage in useLedgerData
