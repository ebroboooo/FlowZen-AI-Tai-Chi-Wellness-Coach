# FlowZen — Implementation Master Plan

## 1. Current Repository Status

### Completed Systems
- **Practice Player Engine**: Interactive Tai Chi and Qigong form player with playback speed control, mirror mode, audio pacing, and form step navigation.
- **Avatar Skeleton Rendering**: 2D HTML5 canvas skeleton pose renderer depicting real-time biomechanical joint movement.
- **Somatic Curriculum Database**: Structured catalog of Tai Chi and Qigong forms categorized across 4 Elemental Paths (Air, Water, Fire, Earth).
- **Mastery Calculation Engine**: 5-tier mastery progression system (`calculateMasteryLevel`, elemental scores, level tracking, and milestone unlocks).
- **Web Audio Soundscape Synthesizer**: Procedural binaural and environmental soundscape engine for practice and meditation.
- **Testing & Quality Assurance**: Vitest test runner with JSDOM environment achieving 100% test pass rate (42/42 passing unit and integration tests).
- **Application Build Pipeline**: Fully compliant TypeScript, Vite 6, and Tailwind CSS v4 build pipeline running cleanly without linter or type errors.

### Placeholder / Partial Systems
- **Sanctuary Canvas**: Basic 2D garden placeholder canvas requiring expansion into an isometric 12-stage procedural living world.
- **AI Coach Real-Time Pose Estimation**: WebCam pose estimation integration and Gemini GenAI SDK proxy routes.
- **Cloud Persistence & Auth**: Firebase Auth and Firestore schema integration for multi-device sync and cloud backups.
- **In-App Billing & Shop**: Soft currency transaction processing and Google Play Store billing hooks.

### Technical Debt & Maintenance Goals
- Re-architect state management boundaries into modular Zustand stores as UI views expand.
- Establish centralized asset management for particle effects, audio stems, and SVG icon registries.
- Consolidate Tailwind CSS design tokens to enforce mathematical spacing and WCAG AA contrast rules.

### Build & Test Status
- **Linter Status**: `tsc --noEmit` — 0 errors.
- **Build Status**: `vite build` — 0 errors (compiled successfully).
- **Test Status**: `vitest` — 42/42 tests passing.

---

## 2. UI/UX Priority Order

Below is the implementation priority sequence for all core application screens:

1. **Splash Screen**
   - **Priority**: High
   - **Complexity**: 3/10
   - **Estimated Effort**: 2 Days
   - **Dependencies**: Sound Synthesizer, CSS Animation Engine.
2. **Onboarding Journey**
   - **Priority**: High
   - **Complexity**: 5/10
   - **Estimated Effort**: 3 Days
   - **Dependencies**: Splash Screen, User Preference Store.
3. **Home Screen (Dashboard)**
   - **Priority**: Critical
   - **Complexity**: 6/10
   - **Estimated Effort**: 4 Days
   - **Dependencies**: Onboarding, Core Stores, Sound Engine.
4. **Practice Player Screen**
   - **Priority**: Critical
   - **Complexity**: 8/10
   - **Estimated Effort**: 5 Days
   - **Dependencies**: Canvas Skeleton Engine, Curriculum DB, Audio Synthesizer.
5. **Sanctuary View (Living Garden)**
   - **Priority**: Critical
   - **Complexity**: 9/10
   - **Estimated Effort**: 8 Days
   - **Dependencies**: HTML5 Canvas Engine, Weather Engine, Collectible Store.
6. **AI Master & Coaching View**
   - **Priority**: High
   - **Complexity**: 8/10
   - **Estimated Effort**: 5 Days
   - **Dependencies**: Gemini API Proxy, Practice History Store.
7. **Progress & Mastery Dashboard**
   - **Priority**: Medium
   - **Complexity**: 5/10
   - **Estimated Effort**: 3 Days
   - **Dependencies**: Mastery Calculation Engine, Achievement System.
8. **User Profile & Sanctuary Showcase**
   - **Priority**: Medium
   - **Complexity**: 4/10
   - **Estimated Effort**: 2 Days
   - **Dependencies**: Progress Dashboard, Collectibles Store.
9. **Authentication & Cloud Sync**
   - **Priority**: Medium
   - **Complexity**: 6/10
   - **Estimated Effort**: 3 Days
   - **Dependencies**: Firebase SDK Integration.
10. **Settings & Preferences**
    - **Priority**: Low
    - **Complexity**: 3/10
    - **Estimated Effort**: 2 Days
    - **Dependencies**: Core Application Stores.

---

## 3. Sanctuary Implementation Plan

### M1 — Basic Environment
- **Goal**: Render a crisp, 60fps isometric 30-degree courtyard canvas with ground textures, stone paths, and foundational camera controls.
- **Visual Outcome**: Clean 2D/isometric earthen plot with smooth pan and zoom capability.
- **Required Systems**: Isometric math utilities, Canvas rendering loop, gesture listeners.
- **Success Criteria**: Continuous 60fps drag/pan performance on low-tier mobile viewports.

### M2 — Dynamic Lighting
- **Goal**: Implement real-time 24-hour lighting transitions linked to local device time.
- **Visual Outcome**: Dawn golden hues, midday brightness, sunset crimson light, and twilight/nightfall dark canvases.
- **Required Systems**: Solar time calculator, color gradient interpolator, ambient lighting overlay.
- **Success Criteria**: Smooth visual lighting transitions without frame drops or color banding.

### M3 — Atmospheric Weather System
- **Goal**: Render organic weather particle overlays (Rain, Autumn Leaves, Snowfall, Morning Fog, Fireflies).
- **Visual Outcome**: Drifting particle effects layered seamlessly over the courtyard canvas.
- **Required Systems**: Particle system engine, wind velocity state manager, Web Audio weather loops.
- **Success Criteria**: Rendering 200+ active weather particles simultaneously with <5% CPU usage.

### M4 — Interactive Objects
- **Goal**: Enable touch-reactive feedback on placed garden items (lanterns, trees, stone cairns).
- **Visual Outcome**: Tapping lanterns douses or lights flames; tapping trees shakes leaves loose.
- **Required Systems**: Hit-testing spatial quadtree, object state store, haptic feedback hooks.
- **Success Criteria**: Instant visual/auditory response within 100ms of user tap.

### M5 — Garden Wildlife Integration
- **Goal**: Introduce animated wildlife (Koi fish, butterflies, birds, red pandas, foxes).
- **Visual Outcome**: Koi swimming in ponds, birds gliding overhead, and pandas resting in bamboo groves.
- **Required Systems**: Wildlife AI pathfinding scripts, sprite animation renderer, tap interaction handlers.
- **Success Criteria**: Smooth wildlife wander paths without visual clipping or erratic direction changes.

### M6 — Water & Fluid Ripple System
- **Goal**: Render dynamic water surfaces for streams, ponds, and waterfalls with tap ripples.
- **Visual Outcome**: Expanding concentric ripples and flowing water current effects in garden ponds.
- **Required Systems**: Procedural wave displacement shader/canvas math, water splash audio triggers.
- **Success Criteria**: Realistic water ripples expanding smoothly at 60fps.

### M7 — Collectible Placement System
- **Goal**: Allow users to acquire, place, rotate, and arrange unlocked decorations in their garden.
- **Visual Outcome**: Drag-and-drop placement grid allowing custom sanctuary arrangement.
- **Required Systems**: Spatial grid manager, inventory store, collision validator.
- **Success Criteria**: Zero item overlapping glitches; persistence across app restarts.

### M8 — Seasonal Changes
- **Goal**: Implement seasonal visual transformations (Spring Sakura, Summer Greenery, Autumn Gold, Winter Frost).
- **Visual Outcome**: Dynamic tree canopy recoloring and seasonal ground textures based on current month.
- **Required Systems**: Seasonal calendar engine, texture tinting utility.
- **Success Criteria**: Automatic asset adaptation based on real-world calendar dates.

### M9 — Living AI Events
- **Goal**: Trigger dynamic garden events based on AI coach recommendations and practice milestones.
- **Visual Outcome**: Special glowing aura events, blooming flowers after practice, and AI mentor visits in the garden.
- **Required Systems**: Event bus, practice trigger listener, AI recommendation bridge.
- **Success Criteria**: Flawless event triggering upon session completion.

### M10 — Sanctuary Polish & Optimization
- **Goal**: Final performance pass, anti-aliasing, shadow softness adjustments, and soundscape tuning.
- **Visual Outcome**: Pristine, studio-grade visual and auditory presentation.
- **Required Systems**: Canvas buffer caching, Web Audio spatialization, asset compression.
- **Success Criteria**: Fast initial load time (<1.5s), zero memory leaks, smooth 60fps animation.

---

## 4. UI Polish Checklist (100 Items)

### Typography & Hierarchy
- [ ] 1. Ensure all heading font sizes follow the 1.25+ mathematical step ratio scale.
- [ ] 2. Pair Playfair Display for headings with Plus Jakarta Sans for body text consistently.
- [ ] 3. Verify line height is strictly 1.5–1.7 across all body paragraphs.
- [ ] 4. Constrain body text line width to 65–75 characters (`ch`).
- [ ] 5. Eliminate all all-caps text blocks in body copy.
- [ ] 6. Ensure all button and pill labels remain on a single line without wrapping.
- [ ] 7. Verify WCAG AA 4.5:1 color contrast ratio for all text against backgrounds.
- [ ] 8. Ensure subheadings maintain clear visual distinction from body text.
- [ ] 9. Apply tabular numbers (`font-variant-numeric: tabular-nums`) to all counters and timers.
- [ ] 10. Fix any awkward line breaks or orphaned words in card titles.

### Spacing & Layout Math
- [ ] 11. Ensure container outer padding strictly equals or exceeds inner padding.
- [ ] 12. Set minimum container outer padding to 16px across all mobile views.
- [ ] 13. Maintain exact 2:1 horizontal-to-vertical padding ratios on all primary buttons.
- [ ] 14. Enforce mathematically calculated nested border radii (`Inner Radius = Outer Radius - Padding`).
- [ ] 15. Cap all standard card border radii at 16px maximum.
- [ ] 16. Reserve 24px+ pill shapes exclusively for buttons, tags, and chips.
- [ ] 17. Eliminate nested cards (cards inside cards) in favor of whitespace and subtle dividers.
- [ ] 18. Ensure vertical rhythm between major sections uses consistent 24px or 32px gaps.
- [ ] 19. Verify max-width limits (`max-w-7xl mx-auto`) prevent ultra-wide screen stretching.
- [ ] 20. Align all card action elements cleanly to the bottom baseline.

### Color & Styling Aesthetics
- [ ] 21. Use strictly warm-tinted or cool-tinted neutrals (<5% saturation) instead of pure black/white.
- [ ] 22. Limit background-to-container brightness delta to <=7% in light mode.
- [ ] 23. Limit background-to-container brightness delta to <=12% in dark mode.
- [ ] 24. Remove all purple-to-blue gradients, cyan text on dark, or glowing neon drop shadows.
- [ ] 25. Remove side-tab borders (colored lines on one side of a card).
- [ ] 26. Eliminate ghost cards that mix 1px hairline borders with soft drop shadows.
- [ ] 27. Ensure dark mode uses deep charcoal twilight tones rather than inverted white.
- [ ] 28. Apply subtle multi-layered ambient shadows (`0 8px 32px rgba(0,0,0,0.06)`).
- [ ] 29. Ensure translucent glassmorphic backdrops use `backdrop-blur-md`.
- [ ] 30. Verify theme color variables update smoothly when switching dark/light themes.

### Animations & Transitions
- [ ] 31. Set all transition easings to smooth exponential curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- [ ] 32. Keep button micro-interaction durations under 300ms.
- [ ] 33. Set route view transition durations to exactly 400ms.
- [ ] 34. Ensure particle system animations run continuously at 60fps without stuttering.
- [ ] 35. Eliminate all high-contrast strobe, flashing, or hyperactive animations.
- [ ] 36. Add smooth hover scale effects (`scale-102`) for desktop mouse cursors.
- [ ] 37. Add subtle active tap scale compression (`scale-95`) for touch screens.
- [ ] 38. Respect `prefers-reduced-motion` browser accessibility settings.
- [ ] 39. Ensure modal dialogs fade and scale in from center effortlessly.
- [ ] 40. Smoothly cross-fade canvas weather state changes over 2.0 seconds.

### Touch Targets & Accessibility
- [ ] 41. Ensure every mobile interactive element has a minimum touch target of 44x44px.
- [ ] 42. Add `aria-label` tags to all icon-only buttons.
- [ ] 43. Ensure full keyboard tab navigation support across all screens.
- [ ] 44. Add visible focus outline rings for keyboard navigation users.
- [ ] 45. Test screen reader compatibility for primary practice controls.
- [ ] 46. Ensure modal overlays capture focus and prevent background scrolling.
- [ ] 47. Support standard system font size scaling without UI breaking.
- [ ] 48. Ensure high-contrast toggle settings work flawlessly.
- [ ] 49. Avoid relying solely on color to convey state; use icons and labels.
- [ ] 50. Provide explicit error messages with actionable resolution steps.

### Sound & Audio Feedback
- [ ] 51. Ensure all Web Audio synth tones cross-fade smoothly over 1.5 seconds.
- [ ] 52. Add subtle wooden chime tap sounds to primary button clicks.
- [ ] 53. Play a soft singing bowl chime on practice form completion.
- [ ] 54. Ensure ambient nature soundscapes adjust volume gracefully with the master slider.
- [ ] 55. Add gentle water splash audio triggers when tapping garden ponds.
- [ ] 56. Provide a global audio mute toggle accessible in one tap.
- [ ] 57. Ensure practice audio pauses automatically when phone calls are received.
- [ ] 58. Prevent audio distortion or clipping during multi-track playback.
- [ ] 59. Add gentle wind chime tones on sanctuary item interaction.
- [ ] 60. Store user volume preferences reliably across app reloads.

### State & Empty States
- [ ] 61. Design peaceful, encouraging empty states for new user sanctuaries.
- [ ] 62. Show clear loading skeletons for asynchronous AI coach recommendations.
- [ ] 63. Ensure offline mode gracefully displays cached practice content.
- [ ] 64. Show subtle retry indicators when network connection is lost.
- [ ] 65. Save form practice progress automatically if interrupted.
- [ ] 66. Provide clear confirmation before discarding custom garden layouts.
- [ ] 67. Show informative tooltips when tapping locked sanctuary items.
- [ ] 68. Display daily streak pause status with gentle, reassuring copy.
- [ ] 69. Ensure user avatar pose defaults gracefully if webcam is disabled.
- [ ] 70. Maintain persistent local state across app backgrounding.

### Micro-Interactions & Delight
- [ ] 71. Implement interactive water ripples expanding on garden tap.
- [ ] 72. Animate leaves shaking loose when tapping sanctuary trees.
- [ ] 73. Make stone lanterns light up with warm flames at local dusk.
- [ ] 74. Add jumping koi fish animations in garden ponds.
- [ ] 75. Animate fireflies emerging and hovering during night mode.
- [ ] 76. Add waving animations for pandas resting in bamboo groves.
- [ ] 77. Create drifting sakura petal effects across the home screen.
- [ ] 78. Add subtle light pulse effects around the daily practice start button.
- [ ] 79. Trigger a soft golden particle burst upon level advancement.
- [ ] 80. Animate a bow of gratitude on user avatar rank upgrades.

### Navigation & Header Flow
- [ ] 81. Keep the floating bottom navigation bar fixed and blur-backed.
- [ ] 82. Highlight active navigation tab icons clearly with soft jade indicators.
- [ ] 83. Ensure back button navigation returns smoothly to previous views.
- [ ] 84. Display current mastery rank badge clearly in the home header.
- [ ] 85. Ensure streak flame icon pulses gently when daily practice is incomplete.
- [ ] 86. Maintain single-tap access to the Sanctuary from any screen.
- [ ] 87. Keep the top header clean, uncluttered, and spacious.
- [ ] 88. Smoothly hide navigation controls during full-screen practice playback.
- [ ] 89. Ensure deep links open target practice forms directly.
- [ ] 90. Prevent accidental app exit when swiping near screen edges.

### Performance & Mobile Optimization
- [ ] 91. Achieve initial page paint in under 1.0 second on standard mobile networks.
- [ ] 92. Ensure HTML5 Canvas frame rate stays strictly at 60fps during weather effects.
- [ ] 93. Compress all static SVG icons and image assets.
- [ ] 94. Implement `ResizeObserver` on canvas containers for responsive resizing.
- [ ] 95. Debounce rapid window resize events to avoid canvas re-render thrashing.
- [ ] 96. Keep total bundle size within optimized production limits.
- [ ] 97. Prevent memory leaks by cleaning up Web Audio nodes and animation loops.
- [ ] 98. Ensure zero raw code warnings or unhandled promise rejections in console.
- [ ] 99. Test smooth execution across low-tier Android mobile hardware.
- [ ] 100. Pass full `npm run lint` and `npm run build` verification tests cleanly.

---

## 5. Technical Milestones

To maintain stability and minimize regressions, technical implementation will proceed in strict order:

1. **Milestone T1: Core Architecture & State Isolation**
   - Refactor Zustand stores into dedicated modules (`usePracticeStore`, `useSanctuaryStore`, `useUserStore`).
   - Standardize TypeScript interfaces in `/src/types.ts`.
2. **Milestone T2: Visual Component Library & Design Tokens**
   - Implement reusable Tailwind UI primitives (buttons, cards, badges, modal overlays).
   - Ensure WCAG AA compliance and strict outer/inner padding math.
3. **Milestone T3: Sanctuary Engine & Canvas Render Loop**
   - Build high-performance 60fps isometric HTML5 canvas rendering engine.
   - Implement particle systems, dynamic lighting layers, and water ripple physics.
4. **Milestone T4: Gamification, Quests & Collectibles Store**
   - Connect 30-day login calendar, daily quest engine, and soft currency shop.
   - Integrate persistence layer using client storage / Firestore schemas.
5. **Milestone T5: AI Master Integration & Gemini Proxy**
   - Implement secure server-side Express API proxy routes for Google GenAI SDK.
   - Connect somatic pose feedback and personalized coaching advice.
6. **Milestone T6: Firebase Cloud Sync & Mobile PWA Hardening**
   - Integrate Firebase Auth and Firestore for multi-device synchronization.
   - Configure Capacitor/TWA Android wrapper assets for Google Play Store packaging.

---

## 6. Documentation Rule

> **CRITICAL EXECUTION MANDATE**:
> After every completed implementation milestone, the developer MUST update the following four documentation files in the repository to reflect changes accurately:
>
> 1. `DEVELOPMENT_PROGRESS.md`
> 2. `FEATURE_STATUS.md`
> 3. `CHANGELOG.md`
> 4. `AI_HANDOFF.md`
>
> Failing to update these four status files upon milestone completion is strictly prohibited.
