# FlowZen Google Play Beta Release Plan

**Document ID:** `19_GOOGLE_PLAY_RELEASE_PLAN`  
**Application Name:** FlowZen - AI Tai Chi & Living Sanctuary  
**Package ID:** `com.flowzen.app`  
**Target Version:** `0.1.0-beta.1` (Build 1)  
**Target Platform:** Android (Google Play Store - Closed Beta)  

---

## 1. Release Status

### Completed Milestones
- **Core Engine & Architecture:** SPA with Vite, React 18, Tailwind CSS, Zustand state stores, and HTML5 Canvas rendering engine.
- **Biomechanical Practice Player:** 2D skeleton pose rendering, real-time joint guidance, breathing pacer, Web Audio soundscapes, and mastery scoring.
- **Living Garden Sanctuary:** HTML5 Canvas stage with particle physics, weather states (sun, rain, snow, wind, mist), garden item unlocks, and Web Audio chimes.
- **AI Master Companion:** Personal mentor identity, daily time-aware master intentions, post-practice reflections, offline fallbacks, and Gemini API streaming.
- **Progress & Gamification:** 5-tier rank progression, radar element scores, journal logs, daily streaks, and Qi XP rewards.
- **Release Polish & Stability:**
  - React Error Boundary for zero-crash fallback UI.
  - Privacy-first lightweight analytics (`src/utils/analytics.ts`).
  - Mobile viewport safe-area padding (`viewport-fit=cover`).
  - Capacitor baseline configuration (`capacitor.config.ts`).
  - Standardized 44px+ touch targets across mobile screens.

### Remaining Tasks (Pre-Upload)
1. **Android Studio Project Sync:** Run `npx cap add android` and build signed Android App Bundle (`.aab`).
2. **Play Console Setup:** Create app entry in Google Play Console under package `com.flowzen.app`.
3. **Asset Generation:** Export high-resolution app icon (512x512) and feature graphic (1024x500).
4. **Privacy Policy Hosted URL:** Publish static privacy policy page URL for Play Console submission.

### Current Blockers
- **None:** The codebase compiles cleanly (`npm run build`), passes TypeScript validation (`tsc --noEmit`), and meets all functional criteria for closed beta release.

---

## 2. Google Play Store Listing Draft

### App Title
**FlowZen: AI Tai Chi & Sanctuary**

### Short Description (Max 80 characters)
*Cultivate inner calm with AI Tai Chi coaching, somatic movement & a living garden.*

### Full Description
```
FlowZen is your personal AI-powered Tai Chi master and somatic wellness companion designed to cultivate mindfulness, physical poise, and quiet inner harmony.

Whether you seek stress relief, joint mobility, or daily grounding, FlowZen guides you through gentle Tai Chi and Qigong movements paired with an interactive living garden sanctuary that blooms as you practice.

KEY FEATURES:

• PERSONALIZED AI MASTER COMPANION
Receive daily time-aware somatic guidance, personalized posture tips, and gentle post-practice reflections tailored to your wellness goals and practice history.

• BIOMECHANICAL SOMATIC PRACTICE PLAYER
Follow step-by-step 2D skeleton pose animations with real-time breathing pacers, joint alignment cues, and elemental Web Audio soundscapes (Air, Water, Fire, Earth).

• LIVING GARDEN SANCTUARY
Watch your mindfulness practice transform into visual growth. Earn Qi XP to cultivate bonsai pines, bamboo groves, and lotus ponds in a responsive sanctuary featuring real-time weather effects.

• MASTRY PROGRESS & RADAR PROFILE
Track your somatic evolution across 5 rank tiers. Review your elemental balance (Air, Water, Fire, Earth), log reflective journals, and maintain daily practice streaks.

• PRIVACY-FIRST & ACCESSIBLE
FlowZen operates with offline resilience, zero intrusive tracking, and safe-area responsive design optimized for mobile devices.

Begin your journey to effortless strength and quiet poise with FlowZen today.
```

### Category
**Health & Fitness** / **Mindfulness & Fitness**

### Keywords / Tags
`Tai Chi`, `Qigong`, `AI Coach`, `Mindfulness`, `Somatic Movement`, `Meditation`, `Joint Mobility`, `Stress Relief`, `Living Garden`, `Breathing Exercises`

### Target Audience
- Adults (18+) seeking gentle physical exercise, stress reduction, joint protection, or daily mindfulness routines.
- Content rating: Everyone.

---

## 3. Screenshot Plan

### Screenshot 1: First Impression
- **Visual Content:** Home Dashboard showing the personalized greeting, Daily Journey card with streak counter, and the AI Master Intention card.
- **Headline Caption:** *Your Personal AI Somatic Master*
- **Subtext:** *Begin each day with tailored intentions, gentle guidance, and clear goals.*

### Screenshot 2: Living Sanctuary
- **Visual Content:** Full-screen Living Garden Canvas with glowing sunbeams, blooming lotus pond, bonsai pine, and Qi XP progress meter.
- **Headline Caption:** *Nurture a Living Garden Sanctuary*
- **Subtext:** *Every minute of physical practice blooms into visual harmony and garden rewards.*

### Screenshot 3: AI Master
- **Visual Content:** AI Master Companion card showing personalized mentor dialogue, elemental alignment badge, and post-practice reflection.
- **Headline Caption:** *Wise, Empathetic AI Guidance*
- **Subtext:** *Receive compassionate posture tips and post-practice reflections with zero pressure.*

### Screenshot 4: Practice Experience
- **Visual Content:** Biomechanical Practice Player with 2D skeleton avatar rendering a Tai Chi stance, breathing pacer ring, and audio soundscape controls.
- **Headline Caption:** *Guided Movement & Breathing*
- **Subtext:** *Master elemental Tai Chi & Qigong stances with step-by-step visual feedback.*

### Screenshot 5: Progress Evolution
- **Visual Content:** Progress Screen displaying the 5-tier rank rank progression, elemental radar score chart, practice history logs, and journal entries.
- **Headline Caption:** *Track Your Somatic Growth*
- **Subtext:** *Observe your balance, consistency, and physical mastery evolve over time.*

---

## 4. App Asset Checklist

| Asset Type | Dimensions / Specifications | Format | Status |
|---|---|---|---|
| **App Icon** | 512 x 512 px, 32-bit PNG (max 1024KB) | PNG | Ready for Export |
| **Adaptive Icon Foreground** | 432 x 432 px (108dp safe zone) | Vector XML / PNG | Pending Android Studio |
| **Adaptive Icon Background** | 432 x 432 px solid `#faf8f5` or `#065f46` | Vector XML / Color | Pending Android Studio |
| **Splash Screen** | 2732 x 2732 px centered lotus emblem | PNG | Configured via Capacitor |
| **Feature Graphic** | 1024 x 500 px (no CTA text near edges) | PNG / JPG | Drafted |
| **Phone Screenshots** | Min 2 screenshots, 1080 x 1920 px (16:9) | PNG / JPG | Planned |
| **7-inch Tablet Screenshots**| 1200 x 1920 px | PNG / JPG | Optional for Beta |
| **10-inch Tablet Screenshots**| 1600 x 2560 px | PNG / JPG | Optional for Beta |

---

## 5. Beta Testing Strategy

### 1. Internal Testing Track
- **Participants:** Core project developer & QA testers (1–5 users).
- **Focus:** Instant verification of install, splash screen rendering, local storage persistence, and Capacitor native wrap behavior.
- **Target SLA:** 24 hours post-build approval.

### 2. Closed Testing Track (Google Play Beta)
- **Participants:** Invited beta group (20–50 somatic practitioners, Tai Chi enthusiasts, and early adopters).
- **Distribution:** Google Play Closed Beta link via Google Groups / Email list.
- **Feedback Channel:** In-app feedback form, GitHub issues, or direct email feedback loop.

### 3. Key Success Metrics
- **Crash-Free User Rate:** > 99.0%.
- **Onboarding Completion Rate:** > 85%.
- **D1 Practice Retention:** > 50% of users complete a 2nd practice session within 24 hours.
- **AI Master Interaction Rate:** > 60% of active users ask a question or read the daily reflection.

---

## 6. Launch Safety & Compliance Checklist

- [x] **Privacy & Data Security:** No unnecessary personal data stored. All user preferences, session logs, and journal entries stored locally in `localStorage` or sandboxed browser cache.
- [x] **Zero Ad-ID Dependency:** No advertising SDKs integrated.
- [x] **React Error Boundary:** Handled at root level (`src/components/ErrorBoundary.tsx`) to prevent white screen crashes.
- [x] **Offline Resilience:** Practice player audio pacers, skeleton animations, garden rendering, and fallback coach messages function completely offline without internet connectivity.
- [x] **Permissions Review:** App requires zero intrusive permissions (no camera, microphone, or location required for core experience).
- [x] **Touch Target Compliance:** All interactive buttons and tab controls adhere to 44px x 44px minimum touch targets.
- [x] **Google Play Content Rating:** Self-assessment questionnaire prepared (Expected rating: PEGI 3 / Everyone).
- [x] **Production Build Validation:** Executed `npm run build` and `tsc --noEmit` with 0 errors.
