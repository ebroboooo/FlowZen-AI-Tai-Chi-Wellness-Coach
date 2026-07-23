# FlowZen — Project Overview

## What FlowZen Is
**FlowZen** is an AI-powered somatic Tai Chi, Qigong, and physical mindfulness application that integrates real-time skeletal pose guidance, ambient elemental soundscapes, an evolving Zen living garden sanctuary, and a comprehensive somatic mastery progression system.

## Vision
To provide a calm, deeply restorative digital sanctuary where practitioners of any experience level can learn and refine traditional somatic forms, cultivate inner energy (Qi), track biomechanical postural alignment, and visualize their growth through an evolving digital garden and elemental mastery path.

## Goals
1. **Interactive Somatic Guidance**: Deliver real-time visual skeleton pose alignment and voice/text coaching using Gemini AI.
2. **Immersive Audio-Visual Experience**: Blend procedurally synthesized elemental ambient soundscapes (Air, Water, Fire, Earth) with smooth motion animations and customizable avatar views.
3. **Evolving Living Garden**: Connect daily practice minutes and mindfulness consistency directly to an evolving Zen garden sanctuary.
4. **Mastery & Progression**: Track practitioner progression across 5 mastery tiers (Student, Disciple, Practitioner, Master, Grand Master) and 4 elemental balance paths.
5. **Privacy & Local Resilience**: Support offline practice, guest mode state persistence, and client-side data management with optional Firebase syncing.

## Target Users
- **Mindfulness Seekers**: Individuals looking for stress reduction, grounding, and diaphragmatic breath synchronization.
- **Somatic & Martial Arts Practitioners**: Tai Chi and Qigong enthusiasts desiring form reference, movement smoothing, and alignment scoring.
- **Seniors & Rehabilitation Seekers**: Users focused on gentle balance improvement, joint mobility, and low-impact daily movement.

## Major Features
- **Interactive Practice Player**: Canvas-rendered 2D/3D skeletal avatars with variable playback speed, mirror mode, camera pose overlay guidance, and audio pacer.
- **Living Garden Sanctuary**: Interactive procedural garden featuring seasonal atmospheric weather filters, bonsai pines, bamboo groves, lotus ponds, and stone lanterns.
- **Somatic AI Coach**: Gemini-powered conversational coach providing real-time movement feedback, personalized training summaries, and memory retention.
- **User Mastery & Progression System**: 5-tier mastery progression (`calculateMasteryLevel`), 4 elemental cultivation scores (`calculateElementProgress`), milestone tracking, and somatic title unlockable badges.

## Technology Stack
- **Frontend Core**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Motion (motion/react).
- **State Management**: Zustand v5 (modular stores: `useProgressStore`, `usePracticeStore`, `useGardenStore`, `useCurriculumStore`, `useCoachStore`, `useAuthStore`).
- **AI Integration**: Google GenAI SDK (`@google/genai`) with Gemini models.
- **Database & Sync**: Firebase Firestore (web client SDK with local fallback/mock layer).
- **PWA & Offline**: Vite PWA (`vite-plugin-pwa`) with ServiceWorker asset caching.
- **Testing & Verification**: Vitest 4 with JSDOM environment, TypeScript strict type checking.
