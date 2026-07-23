# FlowZen — System Architecture

## Folder Structure
```
/
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── docs/                      # Complete architectural and handoff documentation
├── src/
│   ├── App.tsx               # Root view router with top nav bar & tab switcher
│   ├── main.tsx              # React DOM mounting entry point
│   ├── index.css             # Tailwind v4 import & global styles
│   ├── ai/                   # Gemini API client initialization
│   ├── components/           # Reusable UI components
│   │   ├── PracticePlayer.tsx          # Core animation & camera pose player
│   │   ├── avatar/FlowZenAvatar.tsx     # Skeleton pose canvas renderer
│   │   ├── garden/LivingGardenLayer.tsx# Procedural garden canvas layer
│   │   └── practice/CameraPoseGuide.tsx# Live pose estimation overlay
│   ├── data/                 # Curriculum, themes, and animations
│   │   ├── curriculumData.ts
│   │   ├── elementalThemes.ts
│   │   ├── masterCurriculum.ts
│   │   └── skeletonAnimations.ts
│   ├── firebase/             # Firebase SDK configuration with local fallback
│   │   └── firebase.ts
│   ├── routes/               # Top-level screen views
│   │   ├── Practice.tsx
│   │   ├── Garden.tsx
│   │   └── Progress.tsx
│   ├── store/                # Zustand client state stores
│   │   ├── useAuthStore.ts
│   │   ├── useCoachStore.ts
│   │   ├── useCurriculumStore.ts
│   │   ├── useGardenStore.ts
│   │   ├── usePracticeStore.ts
│   │   ├── useProgressStore.ts
│   │   └── useStore.ts
│   ├── tests/                # Vitest unit & integration test suite
│   │   ├── coachMemory.test.ts
│   │   ├── elementalThemes.test.ts
│   │   ├── gardenEvolution.test.ts
│   │   ├── livingGarden.test.ts
│   │   ├── masterCurriculum.test.ts
│   │   ├── masteryProgress.test.ts
│   │   ├── motionEngine.test.ts
│   │   ├── poseGuidance.test.ts
│   │   └── soundscape.test.ts
│   ├── types/                # Global TypeScript definitions
│   │   └── index.ts
│   └── utils/                # Pure business logic and calculation engines
│       ├── audioPacer.ts
│       ├── elementalSoundscape.ts
│       ├── gardenEvolution.ts
│       ├── masteryCalculations.ts
│       ├── motionEngine.ts
│       ├── movementFeedback.ts
│       ├── poseGuidance.ts
│       └── speechQueue.ts
```

## Data Flow
1. **User Practice Interaction**: The user initiates a session in `Practice.tsx` or `PracticePlayer.tsx`.
2. **Animation & Audio Processing**: `skeletonAnimations.ts` feeds joint poses into `FlowZenAvatar.tsx` canvas while `elementalSoundscape.ts` & `audioPacer.ts` synthesize audio context frequencies.
3. **Session Completion**: Upon completion, `useProgressStore.addSession` records the duration, rating, and timestamps.
4. **Mastery Calculation Engine**: `masteryCalculations.ts` computes updated XP, rank level, elemental scores (Air, Water, Fire, Earth), averages, and next milestones.
5. **Sanctuary Evolution**: `useGardenStore` updates garden growth stages based on total practice minutes and streak data.

## State Management Architecture
FlowZen utilizes specialized modular Zustand stores:
- `useProgressStore`: Session history, journal entries, practice minutes, streak, and `getMasteryProfile()` execution.
- `usePracticeStore`: Current lesson, active movement index, play/pause controls, speed multiplier, mirror mode, view camera angle.
- `useGardenStore`: Living garden level, unlocked decorative items, active selected item, weather conditions.
- `useCurriculumStore`: Program selection, level filters, favorites, started and completed lesson arrays.
- `useCoachStore`: AI coach conversation messages, training history memory, feedback cues.
- `useAuthStore`: User profile information, guest mode toggles.

## AI Architecture
- **Model**: Gemini via `@google/genai` TypeScript SDK.
- **Server Proxy**: Key resides strictly on the server (`GEMINI_API_KEY`) accessed via `/api/coach` or server endpoints to safeguard API secrets.
- **Coach Memory**: Evaluates postural feedback metrics and balance averages to tailor conversational suggestions.

## Firebase Architecture
- Configured safely in `src/firebase/firebase.ts`.
- Uses dynamic module resolution (`import.meta.glob`) for `firebase-applet-config.json` with standard fallbacks so local environments function seamlessly without crashing when missing configuration files.

## Rendering & Animation Architecture
- **Canvas Rendering**: 2D HTML5 canvas context for high-performance, 60fps skeleton joint drawing (`FlowZenAvatar.tsx`) and atmospheric particle renders (`LivingGardenLayer.tsx`).
- **UI Transitions**: Motion (`motion/react`) for fluid component entering, tab switching, and score progress bars.
