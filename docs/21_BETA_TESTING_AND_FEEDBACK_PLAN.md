# FlowZen Beta Testing & User Feedback Plan

**Document ID:** `21_BETA_TESTING_AND_FEEDBACK_PLAN`  
**Application Name:** FlowZen - AI Tai Chi & Living Sanctuary  
**Version:** `0.1.0-beta.1`  
**Target Platform:** Google Play Closed Beta & Web Preview  

---

## 1. Beta Testing Goals & Learning Objectives

The primary objective of the FlowZen Beta Release is to validate the core somatic value proposition, measure user habit formation, and refine app polish based on real-world usage.

### Key Hypotheses to Validate
1. **User Attraction & Value Alignment:** Do users resonate with combining gentle Tai Chi movement with a visual living garden sanctuary?
2. **First Session Completion:** Do new users complete their 5-step onboarding and execute their first guided practice within 3 minutes?
3. **Daily Return Behavior:** Does the Living Garden sanctuary growth model encourage daily return visits and practice streak continuity?
4. **Sanctuary & Audio Engagement:** Do users enjoy interactive garden tapping, weather states, and Web Audio chimes?
5. **AI Master Companion Usefulness:** Are users reading the daily master intentions, engaging with post-practice reflections, and asking questions?
6. **Practice Completion & Pacing:** Do users finish full 3-to-5 minute Tai Chi movement sessions without drop-off or confusion?

---

## 2. Ideal Beta User Profile

To collect meaningful qualitative and quantitative feedback, the beta testing cohort will target four primary user personas:

1. **Wellness & Stress-Relief Seekers:** Adults looking for gentle daily stress reduction, grounding routines, and mindfulness tools without intense cardio.
2. **Tai Chi & Qigong Beginners:** Individuals interested in learning Tai Chi or Qigong stances who need accessible visual guidance and zero intimidating jargon.
3. **Meditation & Breathwork Enthusiasts:** Users of apps like Calm or Headspace who desire physical somatic movement combined with breathwork.
4. **Gentle Fitness & Mobility Practitioners:** Older adults or desk workers seeking low-impact joint mobility, posture improvement, and bodily flexibility.

---

## 3. Beta Rollout Phases

```
┌──────────────────────────┐    ┌──────────────────────────┐    ┌──────────────────────────┐
│  PHASE 1: ALPHA SEED     │ ──►│  PHASE 2: CLOSED BETA    │ ──►│  PHASE 3: EXPANDED BETA  │
│  10 Internal Testers     │    │  50 Target Beta Users    │    │  100+ Community Testers  │
└──────────────────────────┘    └──────────────────────────┘    └──────────────────────────┘
```

### Phase 1: Internal Alpha Seed (10 Testers)
- **Cohort:** Close team, friends, and internal wellness testers.
- **Goal:** Verify zero crashes, smooth onboarding flow, audio synthesis compatibility across devices, and Capacitor Android webview rendering.
- **Feedback Method:** Direct qualitative debriefs, bug reports, screen recording reviews.
- **Success Criteria:** 0 critical crashes; 100% onboarding completion; smooth 60 FPS canvas performance on mobile devices.

### Phase 2: Closed Beta (50 Testers)
- **Cohort:** Selected somatic wellness seekers, Tai Chi beginners, and community signups via Google Play Closed Beta track.
- **Goal:** Measure first-week retention, daily practice streaks, AI Master interaction value, and garden item unlocking frequency.
- **Feedback Method:** In-app feedback card, Google Play beta review form, mid-week 5-minute survey.
- **Success Criteria:** > 80% first-session practice completion rate; > 45% Day 1 retention; positive sentiment on AI Master guidance.

### Phase 3: Expanded Beta (100+ Testers)
- **Cohort:** Broader public beta via open link, Reddit wellness communities, and newsletter invitees.
- **Goal:** Stress-test offline fallbacks, validate long-term habit retention (D7/D14), and finalize store listing assets before public launch.
- **Feedback Method:** In-app rating prompt, structured feedback form, aggregated privacy-first local analytics.
- **Success Criteria:** > 99.0% crash-free sessions; > 30% Day 7 retention; > 4.5/5.0 average user satisfaction rating.

---

## 4. Feedback Collection Infrastructure

### In-App Feedback & Reflection Loop
- **Daily Reflection Card:** Post-practice reflection dialog lets users rate practice difficulty and energy levels in one tap.
- **Settings & Profile Support Link:** Simple "Share Beta Feedback" button linking directly to a 2-minute Google Form or email feedback channel.

### Bug & Disruption Reporting
- **Crash Recovery Screen:** Handled by `ErrorBoundary.tsx` — provides a one-tap "Return to Quiet Sanctuary" reset while logging non-sensitive component error stack traces locally.
- **Lightweight Analytics Event Log:** Events stored locally in `localStorage` (`fz_analytics_events_v1`) to track usage patterns without transmitting PII.

### Qualitative User Interviews
- Conduct 15-minute informal video chats with 5–8 power users from Phase 2 to observe live app navigation and gather deep psychological insights on sanctuary emotional connection.

---

## 5. Metrics To Watch

| Category | Primary Metric | Target Benchmark | Event Triggered (`src/utils/analytics.ts`) |
|---|---|---|---|
| **Activation** | Onboarding Completion Rate | **> 85%** | `onboarding_completed` |
| **Activation** | First Practice Started Rate | **> 90%** of onboarded | `first_practice_started` |
| **Activation** | First Practice Finished Rate | **> 80%** of started | `first_practice_completed` |
| **Retention** | Day 1 Retention (D1) | **> 50%** | `app_opened` (Day +1) |
| **Retention** | Day 7 Retention (D7) | **> 30%** | `app_opened` (Day +7) |
| **Retention** | Practice Streak Continuity | **≥ 3 consecutive days** | `first_practice_completed` |
| **Engagement** | Garden Visit Frequency | **≥ 1.5 visits/session** | `garden_visited` |
| **Engagement** | Daily Reward Claim Rate | **> 70%** of daily users | `daily_reward_claimed` |
| **Engagement** | AI Master Interaction Rate | **> 60%** of daily users | `ai_master_opened` |

---

## 6. Public Release Readiness Criteria

FlowZen will be declared **100% Ready for Public Google Play Store Launch** when all of the following conditions are met:

1. **Zero Blocker Crashes:** Crash-free user rate exceeds **99.5%** over a 14-day trailing period.
2. **Proven Onboarding Funnel:** > 85% of installs successfully complete onboarding and execute their first practice.
3. **Sustained Habit Formation:** D7 user retention stabilizes at or above **30%**.
4. **Polished Mobile Experience:** Touch target responsiveness, Web Audio autoplay, canvas particle pool scaling, and safe-area margins verified across minimum 5 distinct Android device screen ratios.
5. **Store Asset Validation:** All required 512x512 app icons, 1024x500 feature graphics, screenshots, and store copy approved on Google Play Console.

---

## 7. Founder Decision Rules for Feedback Triage

To preserve product focus and prevent feature-creep during beta, all incoming user feedback will be categorized according to strict decision rules:

```
                  ┌─────────────────────────────────┐
                  │      INCOMING BETA FEEDBACK     │
                  └─────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  P0: IMMEDIATE   │      │   P1: POST-BETA  │      │   P2: REJECTED   │
│    HOTFIXES      │      │    ROADMAP       │      │   OUT OF SCOPE   │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### 1. Immediate Hotfix (P0 — Fix within 24 hours)
- White-screen crashes or unhandled JavaScript exceptions.
- Broken audio synthesis or distorted canvas rendering on major device models.
- Inability to complete onboarding or launch a practice session.
- Data loss or store reset bugs affecting user streaks and garden progress.

### 2. Queue for Post-Beta Roadmap (P1 — Log in backlog)
- Requests for additional Tai Chi forms, movements, or curriculum tiers.
- Custom garden decoration requests or cosmetic skin unlocks.
- Requests for background music tracks or expanded audio options.
- Dark mode customization tweaks.

### 3. Reject / Out of Scope (P2 — Politely decline)
- Requests for intense cardio, high-impact exercise routines, or calorie burn trackers (contradicts somatic calm philosophy).
- Requests for complex social feeds, public leaderboards, or competitive multiplayer mechanics (contradicts quiet sanctuary identity).
- Requests for intrusive ad placements or paywalls blocking core practice movements.
