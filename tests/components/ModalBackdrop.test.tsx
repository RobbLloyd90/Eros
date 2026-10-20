// Test plan for src/components/ModalBackdrop.tsx
// Shared presentational wrapper -- mostly framer-motion animation plumbing, low logic surface.

// - renders children when isOpen is true
// - renders nothing (AnimatePresence unmounts) when isOpen is false
// - applies the expected frosted-glass/backdrop styling difference between isLight true/false
// - respects a custom maxWidth/panelStyle override when provided
//
// Other testing to consider outside unit tests:
// - visual regression test (e.g. Playwright screenshot) for the blur/frosted-glass look across
//   themes, since CSS backdrop-filter rendering isn't meaningfully verifiable in jsdom
