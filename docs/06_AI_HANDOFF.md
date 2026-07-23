# FlowZen — AI Handoff & Developer Guide

> **IMPORTANT**: This document provides the complete context required for any developer or AI assistant to immediately understand and continue development on FlowZen without losing architectural continuity.

## Project Summary
FlowZen is a web-based somatic Tai Chi, Qigong, and physical mindfulness application built with React 19, TypeScript, Tailwind CSS v4, Motion, Web Audio synthesis, and Zustand state management.

## Current Architecture
- **Single Page Application with Tab Routing**: `src/App.tsx` manages main top-level tab views (`practice`, `garden`, `progress`).
- **Store Architecture**: State is modularized into Zustand stores inside `src/store/`:
  - `useProgressStore`: Session history, journal entries, practice minutes, streak, and `getMasteryProfile()`.
  - `usePracticeStore`: Active lesson, playback state, speed, mirror mode, camera view angle.
  - `useGardenStore`: Garden level, unlocked decorative items, weather conditions.
  - `useCurriculumStore`: Selected programs, difficulty levels, lesson completion state.
  - `useCoachStore`: AI coach conversation messages and memory log.
  - `useAuthStore`: User authentication state and guest mode toggle.

## Completed Systems
1. **Interactive Practice Player & Avatar Canvas**: Keyframe skeleton animation rendering with variable speed and audio pacer (`PracticePlayer.tsx`).
2. **Living Garden Sanctuary Layer**: Atmospheric weather filters, particle effects, and garden unlockables (`Garden.tsx`, `LivingGardenLayer.tsx`).
3. **Mastery & Progression System (Phase 6.6)**: Rank calculation (Student -> Grand Master), 4 elemental paths (Air, Water, Fire, Earth), score averaging, and Next Milestone guidance (`masteryCalculations.ts`, `Progress.tsx`).
4. **Elemental Web Audio Soundscape**: Procedural audio synthesis engine (`elementalSoundscape.ts`).
5. **Full Unit Test Suite**: Vitest suite with JSDOM environment (`src/tests/*`, 42/42 tests passing).

## Incomplete / Future Systems
- Advanced webcam pose tracking ML model integration.
- Automated Firestore backend cross-device sync.

## Known Technical Debt & Notes
- `firebase.ts` uses `import.meta.glob` to safely attempt loading `firebase-applet-config.json` without throwing build errors if the file is absent in dev environments.

## Important Design Decisions
- **No Heavy 3D Engines**: HTML5 2D Canvas is deliberately chosen for avatar and garden particle rendering to guarantee smooth 60fps performance across mobile and desktop without heavy WebGL bundles.
- **Client-Side Pure Logic**: All mastery calculations in `masteryCalculations.ts` are pure functions accepting sessions/journal inputs, making them completely testable and deterministic.

## Coding Standards & State Management Rules
1. **TypeScript Strict Mode**: Keep `tsconfig.json` strict. Do not bypass types with `any` unless interacting with dynamic window globals in tests.
2. **Zustand Immutability**: Always update state immutably within store set functions.
3. **Tailwind CSS v4 Utility Classes**: Use Tailwind classes for all UI layouts and components. Avoid separate custom `.css` files.
4. **Modular Files**: Do not lump logic into huge monolithic files. Maintain helper utilities in `src/utils/` and components in `src/components/`.

## Things That Must NEVER Be Refactored or Broken
- Firebase Authentication configuration flow.
- Garden rendering engine canvas calculations in `LivingGardenLayer.tsx`.
- Audio engine web audio context setup in `elementalSoundscape.ts`.
- `PracticePlayer.tsx` animation engine and skeleton joint definitions in `skeletonAnimations.ts`.

## Current Development Phase
**Phase 6.6 User Mastery & Progression System** — Completed and fully verified.

## Immediate Next Recommended Task
Refine webcam camera overlay alignment in `CameraPoseGuide.tsx` or expand optional Firestore user sync in `useProgressStore.ts`.

## Warnings
- Always run `npm run lint` and `npm test` before committing changes to ensure zero regression errors.
