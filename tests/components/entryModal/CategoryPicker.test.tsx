// Test plan for src/components/entryModal/CategoryPicker.tsx

// Custom category detection
// - a category already in INFLOW_CATEGORIES/OUTFLOW_CATEGORIES (matching modal.bladeId) renders
//   as a selected preset, no custom input shown
// - a category NOT in the relevant preset list is detected as custom, and the custom text
//   input renders pre-filled with that value

// Preset list per blade type
// - bladeId === 'inflows' shows INFLOW_CATEGORIES options
// - bladeId === 'outflows' shows OUTFLOW_CATEGORIES options

// Interaction
// - selecting 'Custom' from the dropdown animates in the free-text input and focuses it
// - typing in the custom input updates modal.category on each change
