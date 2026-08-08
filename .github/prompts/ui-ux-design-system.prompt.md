# UI & UX Design System Guidelines

## Aesthetic: Cybercore / Visual Y2K
*   **Color Palette:** Deep, neutral/dark backgrounds heavily contrasted with iridescent, multichrome gradients (cyan, magenta, silver, neon green).
*   **Materials:** Liquid-glass overlays, subtle digital glitching, and chrome metallic accents. Use CSS `backdrop-filter: blur()` and inner shadows to simulate glossy, rounded UI cards.
*   **Typography:** Monospace, pixelated, or technical fonts (e.g., DotGothic16, Share Tech Mono) for telemetry and data; clean, extended sans-serifs for headers.

## Spatial Architecture: Mobile XMB / Blade System
*   **No Horizontal Stretching:** Do not use the raw horizontal Xbox 360 blade layout. It fails ergonomically on portrait mobile. 
*   **Z-Axis Stacking:** Blades must stack vertically at the bottom of the screen. Tapping a blade elevates it along the Z-axis, cascading unrelated cards out of the viewport.
*   **Motion:** Use `framer-motion` for spring-physics-based transitions. Swiping left/right navigates chronological time (months), identical to XMB cross-navigation.

## Component Rules
*   Do not inline SVG paths endlessly; use `lucide-react` or centralized icon components.
*   Offload complex 3D or holographic card rendering to `three.js` or `@react-three/fiber` if standard CSS transforms bottleneck mobile rendering.