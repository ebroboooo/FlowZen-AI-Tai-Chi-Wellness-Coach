# FlowZen — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-07-23

### Added
- **User Mastery & Progression System (Phase 6.6)**:
  - 5 Mastery Levels: Student, Disciple, Practitioner, Master, Grand Master (`calculateMasteryLevel`).
  - 4 Elemental Mastery score calculations: Air (breath control/flow), Water (smoothness/transitions), Fire (energy expression), Earth (balance/stability).
  - Next Milestone requirement generator (`calculateNextMilestone`).
  - Upgraded `src/routes/Progress.tsx` dashboard displaying rank badges, XP progress bar, 4 elemental path progress cards, posture statistics, and somatic title unlock badges.
  - Vitest test suite in `src/tests/masteryProgress.test.ts` validating level calculation, elemental scoring, empty user fallback, milestone unlocking, and score averaging.
  - Comprehensive project documentation in `/docs` directory and updated root `README.md`.

### Changed
- Configured Vitest test runner with `jsdom` environment in `vite.config.ts`.
- Extended `useProgressStore.ts` with `getMasteryProfile()` execution.
- Configured `src/firebase/firebase.ts` with dynamic import fallback for missing applet config files.

---

## [1.1.0] - 2026-07-22

### Added
- Living Garden Sanctuary layer (`LivingGardenLayer.tsx`, `Garden.tsx`) with seasonal atmospheric weather effects and unlockable Zen garden items.
- Elemental Soundscape Audio Engine (`elementalSoundscape.ts`) for procedural ambient sound synthesis.
- Somatic AI Coach integration with Gemini model API and coach training memory (`useCoachStore.ts`).

---

## [1.0.0] - 2026-07-20

### Added
- Core FlowZen application setup with React 19, Vite 6, Tailwind CSS v4, and Zustand.
- Interactive Practice Player canvas with 2D avatar skeleton animation rendering (`PracticePlayer.tsx`, `FlowZenAvatar.tsx`).
- Curriculum database with beginner, intermediate, and advanced Tai Chi & Qigong forms (`curriculumData.ts`, `masterCurriculum.ts`).
