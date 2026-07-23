# FlowZen — Changelog

## [1.2.0] - 2026-07-23

### Added
- **Sanctuary Atmosphere**: Implemented dynamic day/night lighting transitions (dawn, daylight, dusk, twilight), soft sky gradients, sunbeam overlay rays for daylight/dawn, moonbeam rays for twilight, and auto real-time local clock sky sync.
- **Garden Progress Visualization**: Connected practice minutes, XP, and growth stages directly to visible canvas flora patches (moss cushions on river stones, wild iris beds, blooming camellias, and lotus pond blossoms).
- **Interactive Tap Physics & Sound**: Added interactive SVG tap burst system spawning canvas particles (petals, sparkles, water droplets, embers) and Web Audio synthesized chimes for flowers, water, animals, and lanterns.
- **Weather Evolution Foundation**: Enhanced weather renderer with clear sky, falling rain drops with splash ripples, drifting mist fog layers, wind, snow, sunrise, and sunset.
- **Mobile Performance Optimization**: Adaptive canvas particle pool scaling (32 particles on mobile <768px, 75 on desktop) ensuring 60fps rendering without external heavy assets.

## [1.1.0] - 2026-07-23

### Added
- **Splash Component** (`src/components/Splash.tsx`): Built first launch splash screen featuring lotus breathing animation, 2.8s auto-advance, manual skip control, and `prefers-reduced-motion` compliance.
- **Onboarding Component** (`src/components/Onboarding.tsx`): Implemented 5-step onboarding sequence collecting practitioner name, focus intentions, experience tier, daily minute goals, and elemental sanctuary path.
- **Home Dashboard Route** (`src/routes/Home.tsx`): Built core home dashboard featuring time-of-day greeting, Today's Journey card with quick practice start, Living Garden preview card, AI Coach wisdom card, and foundational Tai Chi pathways.
- **App Navigation Refactor** (`src/App.tsx`): Wired Splash, Onboarding, Home, Practice, Living Garden, and Mastery views with persistent header navigation bar.
- **Progress Tracking Sync**: Added `onboardingCompleted` state to `UserGoals` store and persisted completion flags in client local storage.
