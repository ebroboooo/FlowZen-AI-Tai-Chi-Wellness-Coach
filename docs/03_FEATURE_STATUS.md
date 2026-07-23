# FlowZen — Feature Status

| Feature Module | Description | Status | Related Files | Dependencies |
|---|---|---|---|---|
| **Practice Player** | Canvas avatar playback with skeleton keyframe interpolation, variable speed, mirror mode, and audio pacing | **Completed** | `src/components/PracticePlayer.tsx`, `src/components/avatar/FlowZenAvatar.tsx`, `src/utils/audioPacer.ts` | React, Zustand, HTML5 Canvas |
| **Living Garden Sanctuary** | Interactive procedural garden with weather filter sweeps, level progression, and collectible Zen garden items | **Completed** | `src/routes/Garden.tsx`, `src/components/garden/LivingGardenLayer.tsx`, `src/utils/gardenEvolution.ts` | Lucide React, Zustand |
| **Mastery & Progression (Phase 6.6)** | 5-tier Tai Chi rank system (Student -> Grand Master), 4 elemental paths, milestone guidance, score averaging | **Completed** | `src/routes/Progress.tsx`, `src/store/useProgressStore.ts`, `src/utils/masteryCalculations.ts` | Vitest, Zustand |
| **Elemental Soundscape Engine** | Procedural web audio synthesis for Air, Water, Fire, and Earth ambient frequencies | **Completed** | `src/utils/elementalSoundscape.ts`, `src/data/elementalThemes.ts` | Web Audio API |
| **Somatic AI Coach** | Conversational coaching interface with training memory and movement feedback | **Completed** | `src/store/useCoachStore.ts`, `src/ai/gemini.ts` | Google GenAI SDK |
| **Curriculum Data & Programs** | Structured Tai Chi & Qigong forms, lesson modules, and difficulty filtering | **Completed** | `src/data/curriculumData.ts`, `src/data/masterCurriculum.ts`, `src/store/useCurriculumStore.ts` | TypeScript Interfaces |
| **Pose Estimation Guide** | Camera overlay guidance and feedback prompts | **Completed** | `src/components/practice/CameraPoseGuide.tsx`, `src/utils/poseGuidance.tsx` | MediaDevices / Camera API |
| **PWA & Offline Caching** | PWA service worker manifest, caching strategies, and standalone display mode | **Completed** | `vite.config.ts`, `index.html` | vite-plugin-pwa |
