# FlowZen — Pending Tasks & Roadmap

## Critical Priority
- *None currently open.* System compiles cleanly with 100% test pass rate.

## High Priority
1. **Camera WebCam Pose Integration Refinement**
   - **Why**: Enhance browser webcam feed frame rate and joint overlay alignment when practicing in front of a desktop/mobile device.
   - **Files Involved**: `src/components/practice/CameraPoseGuide.tsx`, `src/utils/poseGuidance.ts`
   - **Complexity**: Medium
   - **Dependencies**: Browser MediaDevices API, Canvas overlay.

## Medium Priority
1. **Cloud Sync for User Progress & Garden State**
   - **Why**: Allow users signed in via Firebase Auth to synchronize local Zustand state (`useProgressStore`, `useGardenStore`) to Firestore across multiple devices.
   - **Files Involved**: `src/firebase/firebase.ts`, `src/store/useProgressStore.ts`, `src/store/useGardenStore.ts`
   - **Complexity**: Medium
   - **Dependencies**: Firebase Firestore.

2. **Expanded Custom Audio Soundscapes**
   - **Why**: Add user-controlled ambient volume sliders for specific sound elements (e.g. rain intensity, wind harmonic pitch).
   - **Files Involved**: `src/utils/elementalSoundscape.ts`, `src/routes/Garden.tsx`
   - **Complexity**: Low
   - **Dependencies**: Web Audio API.

## Low Priority
1. **Export Practice Session Summaries**
   - **Why**: Allow users to download or share printable PDF / image summary cards of their Tai Chi form achievements.
   - **Files Involved**: `src/routes/Progress.tsx`
   - **Complexity**: Low
   - **Dependencies**: Client-side canvas / HTML-to-image utilities.
