# Product Requirements Document (PRD): FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Frontend Architect & Product Director  
**Target Release:** MVP (V1) to V3 Roadmap  

---

## 1. Product Overview

### What FlowZen Does
FlowZen is a personalized AI-powered Tai Chi and Qi Gong wellness companion designed to act as a therapeutic digital sanctuary. The application delivers customized, slow-motion kinetic movement routines, breathing exercises, and alignment cues tailored to the user's current physical tension, fatigue, and mental mood. Utilizing responsive skeletal biomechanical models (front and side views), and driven by an intuitive, compassionate AI coach, FlowZen guides users into active, gentle physical recovery and mental grounding.

To support long-term adherence without cognitive pressure, FlowZen maps user consistency directly onto an interactive, emotional, virtual **Zen Garden**. As users log sessions, their garden dynamically flourishes with stones, lanterns, bridges, cherry blossom trees, and koi fish—providing a soothing, non-competitive, visually rewarding progression.

### Who It Serves
*   **The Hunched Professional:** Desk-bound workers seeking fast, low-impact breaks to relieve spinal compression and shoulder tightness.
*   **The Mindful Enthusiast:** Stress-weary individuals seeking a physical, somatic complement to seated meditation.
*   **The Golden Practitioner:** Active seniors seeking safe, joint-lubricating balance movements to prevent falls and preserve mobility.
*   **The Recovering Athlete:** Individuals rehabilitating injuries or correcting posture alignment through slow eccentric control.

### Main User Outcome
The primary outcome of FlowZen is **neuromuscular alignment and autonomic nervous system regulation**. Users gain the ability to lower their heart rate variability (HRV) and mental stress levels in real-time, while steadily rebuilding joint flexibility, spinal length, and kinetic balance through a gentle, daily 5-to-15 minute physical sanctuary practice.

---

## 2. Product Goals

### User-Centric Goals
*   **Learn Traditional Tai Chi & Qi Gong:** Build a foundational understanding of classic postures, stance forms, and breathing pacing patterns.
*   **Improve Mobility & Muscle Balance:** Gently increase the range of motion in key postural areas (shoulders, spine, hips, ankles) without high-impact stress.
*   **Reduce Stress and Anxiety:** Learn how to regulate the nervous system using deep diaphragmatic breathing and slow, rhythmic physical shifts.
*   **Build Lasting Wellness Routines:** Establish a consistent daily habit of gentle, therapeutic physical and cognitive self-care.
*   **Track Somatic Progress:** Keep a mindful record of energy, subjective tension, and practice history without judgment.

### Business-Centric Goals
*   **Drive Exceptional Long-Term Retention:** Prioritize Day-30, Day-90, and Day-365 cohort retention by removing high-pressure "streak shaming" and replacing it with calm, emotional rewards.
*   **Cultivate Intrinsic Daily Engagement:** Create a positive habit cycle where users look forward to opening the app to nurture their personal Zen Garden.
*   **Establish Premium Subscription Readiness:** Build a highly valuable, technically robust core architecture prepared for expansion into AI camera posture feedback, specialized course packs, and a live instructor marketplace.

---

## 3. User Personas

### Persona 1: "The Hunched Professional" (Elena Chen)
*   **Background:** 34-year-old Senior UX Designer working remotely. Enjoys deep focus work but frequently works 10-hour days in front of three monitors.
*   **Goals:** Relieve mid-back pain, neck stiffness, and wrist tightness; easily transition her brain from active work to resting state; find a short, restorative movement routine that does not require changing into athletic gear.
*   **Problems:** Gym commutes take too long; high-intensity workout apps cause physical exhaustion after intense mental workdays; sitting meditation feels boring and fails to relieve her physical stiffness.
*   **Behaviors:** Highly technical but easily overwhelmed by notification-heavy apps; values minimal, luxury aesthetic and premium visual design.
*   **Desired Outcomes:** A repeatable 5-minute desktop-compatible posture break that leaves her shoulders feeling light and her mind clear.

### Persona 2: "The Mindful Enthusiast" (Marcus Sterling)
*   **Background:** 42-year-old Creative Director and long-time daily meditator. Attends weekly sound baths and practices deep breathing.
*   **Goals:** Integrate physical somatic movement with his existing seated mindfulness practice; learn how to run his breath through his limbs (Qi circulation).
*   **Problems:** Finds traditional weightlifting mindless and repetitive; most yoga apps are fast-paced or focused on advanced, unsafe flexibility.
*   **Behaviors:** Tracks sleep and resting heart rate closely; keeps a paper journal; appreciates traditional Eastern philosophies.
*   **Desired Outcomes:** A deeply immersive, slow physical flow that acts as "moving meditation," paired with background nature soundscapes.

### Persona 3: "The Golden Practitioner" (Evelyn Wood)
*   **Background:** 72-year-old retired schoolteacher living independently. Enjoys gardening and walking in her local park.
*   **Goals:** Improve single-leg balance to maintain stability and prevent slips/falls; keep arthritic knee and ankle joints loose and pain-free.
*   **Problems:** Most online exercises are too fast, have loud backing music, or use small, unreadable fonts; feels intimidated by traditional gym environments.
*   **Behaviors:** Uses an iPad to stay in touch with family; requires high contrast and larger font scales.
*   **Desired Outcomes:** Clear, slow, step-by-step instructions that emphasize steady feet, weight distribution, and a supportive, gentle voice coach.

---

## 4. Feature Requirements

### 4.1 Authentication & Security
*   **Email Login & Signup:** Minimalist form requiring only email and secure password, utilizing Firebase Authentication.
*   **OAuth Social Integrations:** 
    *   **Google Login:** Native web popup integration.
    *   **Apple Login:** Architecture prepared for future iOS Web View and App Store wrapper requirements.
*   **Guest Mode (No-Auth Access):** 
    *   Users can skip authentication entirely.
    *   All data is stored directly in client-side local storage.
    *   When the user signs up later, local cache seamlessly transfers to their new cloud account.
*   **Account Management:** Users can update passwords, change their primary emails, export a complete JSON archive of all logs, and permanently delete their accounts in one click (triggering instant DB cleanup to honor privacy).

### 4.2 User Profile & Onboarding
*   **Somatic Curation Questionnaire:** A multi-step introductory screen collecting:
    *   **Practitioner Name:** For personalized greetings.
    *   **Primary Path Focus:** Joint Lubrication, Grounding & Balance, Anxiety & Stress, Posture Alignment, or Deep Rest.
    *   **Experience Level:** Beginner (Gentle), Intermediate (Moderate), or Advanced (Deep).
    *   **Daily Practice Target:** Slider ranging from 5 to 45 minutes.
*   **Accessibility Preset Selectors:** Integrated directly into onboarding to allow seniors or visual-impaired users to select their optimal text scale and contrast upfront.

### 4.3 AI Tai Chi Coach
*   **Personality Paradigm:** Act as a wise, calm, highly supportive, and gentle companion. Speaks with patience and provides physical safety cues alongside metaphorical imagery.
*   **Core Responsibilities:**
    *   Analyze user check-in data (fatigue levels, emotional mood, joint stiffness) to recommend custom flows.
    *   Provide physical biomechanical explanations of traditional postures (e.g., explaining how "sinking the chest and rounding the back" protects the spine).
    *   Maintain conversational memory within a session, remembering prior tightness or preferences.
*   **Technical Pipeline:** Uses server-side API proxy routing to protect secret credentials, calling the Google GenAI SDK with custom grounding instructions.

### 4.4 Daily Practice System
*   **Personalized Path Recommendation:** Every morning, the dashboard presents a single curated routine matching the user's primary path focus and current physical energy level.
*   **Form Structure:** Each routine is structurally balanced:
    1.  **Warm-up (1-2 Min):** Joint loosening, shoulder rolling, and deep breathing chimes.
    2.  **Main Movements (3-10 Min):** High-fidelity Tai Chi forms with continuous pacing and alignment.
    3.  **Cool-down & Reflection (1-2 Min):** Quiet standing or seated grounding with a focus on deep belly breathing.

### 4.5 Movement Library
*   **Attributes Matrix:** Each movement entry contains:
    *   `id`: Unique identifier.
    *   `title`: Traditional English name.
    *   `chineseName`: Traditional characters (e.g., 云手) and Pinyin representation.
    *   `pronunciation`: Phonetic sound-out guide (e.g., "Yoon Show").
    *   `tagline`: Poetic, descriptive sensory imagery.
    *   `difficulty`: Beginner, Intermediate, or Advanced.
    *   `benefits`: List of physiological benefits.
    *   `targetBodyParts`: Ankle, Knee, Hips, Spine, Shoulders, Wrists.
    *   `breathingPacing`: Inhale/Exhale timing sequence.
    *   `safetyNotes`: Key spinal and joint warnings.
    *   `commonMistakes`: Visual mistakes to avoid (e.g., "Do not let your front knee overshoot your toes").
*   **Biomechanical Skeletal Player:**
    *   An interactive, responsive vector skeleton indicating exact limb placement.
    *   **Controls:** Toggle Front View vs. Side View; Toggle Mirror Mode (for intuitive left-right tracking); playback speed control (0.75x, 1x, 1.25x).
    *   **Subtitles & Audio:** Synchronized text cues displaying voice coach alignment tips.

### 4.6 Lesson System
*   **Foundational Paths:** Chronological pathways designed to teach the fundamentals:
    *   **Level 1: Grounding the Feet (3 Lessons)** - Developing lower-body weight transfers.
    *   **Level 2: Moving Like Water (4 Lessons)** - Transitioning arms and waist with continuous elasticity.
    *   **Level 3: Circulating Qi (5 Lessons)** - Unifying breath, posture, and intention.
*   **Progression and Completion Rules:** Each lesson is locked until the previous one is fully completed. Complete lessons trigger garden milestones.

### 4.7 Progress & Diagnostics Dashboard
*   **Qualitative Diagnostics Check-In:**
    *   **Physical Energy State Slider:** User rate 1-10 to dynamically describe their current fatigue level.
    *   **Subjective Mood Grid:** Interactive selector (Calm, Peaceful, Energetic, Tense, Tired, Stiff).
*   **Quantitative Analytics Visualizers:**
    *   **Interactive Practice Calendar:** Color-coded days indicating completed sessions.
    *   **Streak Meter:** Shows current continuous practice streak alongside high-water marks.
    *   **Active Posture Heatmap:** Interactive map showing target body sectors worked.
    *   **Weekly Goal Progress Ring:** Beautiful radial indicator of target minutes completed.
    *   **Historical Trends:** Line graphs showing the gradual decline of stress and muscle stiffness over monthly and yearly views.

### 4.8 Zen Garden Progression Engine
*   **Growth Mechanics:** Completed session minutes are converted into "Zen Dew drops."
*   **Unlock System:** Accumulated Dew drops automatically purchase and place assets into a beautifully animated virtual garden:
    *   *5 Sessions:* Smooth River Pebbles and Sand Paths.
    *   *10 Sessions:* Traditional Stone Lantern (glowing softly).
    *   *15 Sessions:* Flowering Cherry Blossom Tree.
    *   *25 Sessions:* Wooden Arch Bridge.
    *   *40 Sessions:* Golden Koi Fish pond.
*   **Weather and Atmosphere Modes:** Users can manually change or auto-sync the garden to match the current time of day (Morning mist, Sunset glow, Quiet night mode) or overlay peaceful weather sounds (Gentle rain, falling cherry blossom petals).

### 4.9 Achievements & Badges
*   **Aesthetic Badges:** High-contrast, minimalist vector icons with poetic descriptions:
    *   *First Steps:* "Noble Crane" (First posture logged).
    *   *Consistency Peak:* "Silver Lotus" (3-day practice streak).
    *   *Deeper Grounding:* "Ancient Bonsai" (10 sessions in Joint Lubrication).
*   **Unlock Display:** Award notifications appear inside the dashboard with gentle animations, never interrupting active movement.

### 4.10 Mindfulness Journal
*   **Somatic Log Entry:** Built-in reflection textareas at the end of each session where practitioners can log how their hips, shoulders, and mind feel.
*   **AI Insight Generator:** An automated monthly assistant that processes logged physical notes, physical energy ratings, and mood inputs to generate constructive, compassionate wellness insights (e.g., "We noticed your shoulders feel tight on Tuesday afternoons; let's try a 3-minute chest opener during lunch").

### 4.11 Notification System
*   **Gentle Reminders:** Simple push notifications or browser reminders sent at the user's preferred time.
*   **Motivational Imagery:** Notifications display calm, peaceful thoughts ("Take a breath. Allow your shoulders to sink as you read this") rather than high-pressure commands.
*   **Mute & Quiet Hours:** Full customization enabling a "Silent Mode" where all notifications are disabled.

### 4.12 Offline Capability (Offline-First)
*   **Local Persistence Engine:** All progress calendars, profiles, custom notes, and garden progress are saved locally using standard client-side state models.
*   **Static Audio Chimes:** Sound effects and bell synthesizers are generated locally using the Web Audio API, removing any dependency on remote media streaming.
*   **Seamless Database Syncing:** When internet connectivity is restored, local data is automatically reconciled with the Firebase Cloud Database.

---

## 5. User Stories

### User Onboarding & Profiles
1.  **As a** busy office worker,  
    **I want to** select my physical pain focus areas during onboarding,  
    **so that** the application instantly filters out irrelevant movements.
2.  **As a** user who is cautious about online safety,  
    **I want to** try the app as a guest without creating an account,  
    **so that** I can test the features before sharing personal details.
3.  **As a** senior practitioner,  
    **I want to** select a larger text scale during my first setup,  
    **so that** I can easily read instructions from a distance.
4.  **As an** experienced Tai Chi student,  
    **I want to** choose my experience level during onboarding,  
    **so that** I don't have to repeat basic lessons.
5.  **As a** returning user,  
    **I want to** update my daily target minutes in my profile,  
    **so that** the app adapts to my changing schedule.
6.  **As a** user with sensitive knees,  
    **I want to** log my health limitations in my profile,  
    **so that** the app automatically highlights safety warnings for knee flexion.
7.  **As a** security-conscious user,  
    **I want to** permanently delete all my account data in one click,  
    **so that** I have full control over my personal information.
8.  **As an** international practitioner,  
    **I want to** select my preferred language,  
    **so that** the physical cues are easily understandable.

### The AI Coach & Interactive Assistance
9.  **As a** beginner with tight hips,  
    **I want to** ask the AI Coach for a custom routine,  
    **so that** I can safely open my joints before starting my workday.
10. **As a** highly stressed remote worker,  
    **I want to** tell the AI Coach that my energy is extremely low,  
    **so that** it can suggest a breathing-only session instead of a complex physical stance.
11. **As a** user curious about history,  
    **I want to** ask the AI Coach about the meaning of "Qi,"  
    **so that** I can understand the traditional philosophy behind my practice.
12. **As a** user recovering from injury,  
    **I want to** receive safety notes and anatomical cues from the AI Coach,  
    **so that** I don't overstretch my shoulders.
13. **As a** user who practices at night,  
    **I want to** ask the AI Coach for a wind-down routine,  
    **so that** I can relax my body for deep sleep.
14. **As a** user logging my posture notes,  
    **I want the** AI Coach to analyze my physical reflections over the week,  
    **so that** I can see patterns in my physical stiffness.

### Daily Practice & Interactive Player
15. **As a** practitioner on a short lunch break,  
    **I want** a single personalized recommendation on my home screen,  
    **so that** I don't waste time searching for a routine.
16. **As a** user with limited coordination,  
    **I want to** toggle a "Mirror Mode" in the session player,  
    **so that** my movements match the screen exactly.
17. **As a** beginner learning complex forms,  
    **I want to** slow the player down to 0.75x speed,  
    **so that** I can observe the weight shifts at a comfortable pace.
18. **As a** practitioner with a small workspace,  
    **I want to** switch between Front View and Side View,  
    **so that** I can verify my spinal angle and knee alignment.
19. **As a** user with visual impairments,  
    **I want to** toggle large, high-contrast subtitles,  
    **so that** I can follow along without hearing the audio cues.
20. **As a** parent who practices in a busy room,  
    **I want to** pause and resume the session at any time,  
    **so that** I can handle short interruptions without losing my progress.
21. **As a** user who loves a specific movement,  
    **I want to** repeat a single posture step in a loop,  
    **so that** I can practice it until it feels natural.
22. **As a** minimalist,  
    **I want to** enter virtual fullscreen mode during practice,  
    **so that** all UI distractions are hidden.
23. **As a** quiet practitioner,  
    **I want to** mute the voice guide but keep the peaceful chime bells,  
    **so that** I can focus on my breathing in silence.

### Zen Garden Progression
24. **As a** practitioner building a daily habit,  
    **I want to** watch my virtual Zen Garden grow over time,  
    **so that** I can see a visual representation of my commitment.
25. **As a** user who has completed 5 sessions,  
    **I want to** unlock river pebbles and sand paths,  
    **so that** my virtual space starts to look personalized.
26. **As a** user practicing in the evening,  
    **I want to** switch my garden to "Sunset Mode,"  
    **so that** the digital environment matches my physical surroundings.
27. **As a** user who loves nature,  
    **I want to** turn on gentle rain sounds in the garden,  
    **so that** I can relax while reading my progress reports.
28. **As a** user with a long streak,  
    **I want to** unlock a flowering cherry blossom tree,  
    **so that** I feel a deep sense of calm achievement.
29. **As a** user who values serene design,  
    **I want to** watch koi fish swim in my garden pond,  
    **so that** I can use the visual as a short mindfulness exercise.

### Progress Tracking & Mindfulness Journal
30. **As a** goal-oriented user,  
    **I want to** see my daily sessions marked on an interactive calendar,  
    **so that** I can track my consistency over the month.
31. **As a** user tracking my health,  
    **I want to** view a body heatmap of my target posture areas,  
    **so that** I can see which muscle groups I have activated.
32. **As a** user recovering from stress,  
    **I want to** see a chart of my physical energy and mood trends,  
    **so that** I can correlate my practice with improved mood.
33. **As a** privacy-conscious user,  
    **I want to** export my entire journal history to a local JSON file,  
    **so that** I can save a personal backup of my progress.
34. **As a** user finishing a session,  
    **I want to** log my immediate physical feelings in a private note,  
    **so that** I can remember how my posture improved.
35. **As a** senior citizen,  
    **I want to** see my weekly total minutes display in a large, clear progress ring,  
    **so that** I can celebrate my consistency without squinting.

### Achievements & Badges
36. **As a** new student,  
    **I want to** earn a "Noble Crane" badge on my first complete practice,  
    **so that** I feel welcome and supported.
37. **As a** consistent practitioner,  
    **I want to** earn a "Silver Lotus" badge for a 3-day streak,  
    **so that** I am gently encouraged to keep going.
38. **As a** dedicated user,  
    **I want to** view my unlocked badges in a clean cabinet view,  
    **so that** I can see my progress milestones in one place.
39. **As a** user who dislikes game pressure,  
    **I want** badge notifications to appear quietly on my dashboard,  
    **so that** my sense of calm is never interrupted by loud alerts.

### Notifications & Reminders
40. **As a** busy professional,  
    **I want to** set a morning reminder at 8:00 AM,  
    **so that** I can start my day with a gentle posture stretch.
41. **As a** user who values peace,  
    **I want** my reminders to include soothing thoughts,  
    **so that** I don't feel stressed or pressured to practice.
42. **As a** user who needs quiet time,  
    **I want to** quickly turn off all notifications,  
    **so that** my offline periods remain completely uninterrupted.

### Offline & Reliability
43. **As an** off-grid traveler,  
    **I want** the session player and chimes to work without internet,  
    **so that** I can maintain my practice anywhere in the world.
44. **As a** user with poor internet,  
    **I want** my progress to be saved locally on my device,  
    **so that** my data is never lost during a disconnection.
45. **As a** user logging in from multiple devices,  
    **I want** my offline data to sync automatically when I connect,  
    **so that** my progress is always up to date.

### Quality, Safety & Design
46. **As an** iOS user,  
    **I want** buttons to slightly scale and cards to elevate on hover,  
    **so that** the app feels responsive and high-fidelity.
47. **As a** user with knee issues,  
    **I want to** see clear safety warnings before trying deep stances,  
    **so that** I can avoid joint strain.
48. **As a** beginner learning complex forms,  
    **I want to** see a list of common postural mistakes,  
    **so that** I can correct my alignment at home.
49. **As an** aesthetic purist,  
    **I want** a clean background without telemetry logs or system clutter,  
    **so that** I can enjoy a peaceful, high-quality design.
50. **As a** user who values smooth motion,  
    **I want** the animations to run at a steady 60 FPS,  
    **so that** the visual experience feels fluid and organic.

---

## 6. Functional Requirements

### Account & Profiles
*   **FR-001 (Guest Session Conversion):** The system MUST support guest access. If a guest user later registers an account, all local practice logs and profile settings MUST be automatically synchronized to their new database record.
*   **FR-002 (Data Erasure):** The application MUST provide a visible "Delete Account" button within the Profile panel. Activating this MUST delete all database entries associated with the user's UUID and clear all local cache.

### Core Practice Engine
*   **FR-003 (Adaptive recommendations):** The app MUST recommend a daily exercise routine. It MUST select this routine by matching the user's focus area and current energy rating (e.g., if energy is low (<4), it MUST recommend gentle, low-stance, or breathing-focused forms).
*   **FR-004 (Skeletal View Toggle):** The session player MUST support real-time switching between Front View and Side View vector models without resetting the active timer.
*   **FR-005 (Pacing Speed Modifier):** The session player MUST allow playback speed adjustments (0.75x, 1.0x, 1.25x). Changing the speed MUST scale the step timers and animation pacing proportionally.
*   **FR-006 (Audio Bell Synthesis):** All chimes and bells MUST be synthesized locally via the Web Audio API, ensuring they function offline without loading remote media files.

### Zen Garden Progression
*   **FR-007 (Zen Dew Calculation):** The app MUST calculate completed minutes and convert them into Zen Dew drops at a rate of 1 Minute = 1 Dew Drop.
*   **FR-008 (Unlock Milestones):** The Zen Garden MUST automatically unlock new assets as milestones are met, displaying them with a gentle fade animation during the user's next visit.

### Diagnostics & Trends
*   **FR-009 (Postural Heatmap Rendering):** The progress dashboard MUST render an interactive anatomical model highlighting target muscle groups based on logged exercises.
*   **FR-010 (Stress Correlation Graphs):** The app MUST show a monthly line chart comparing logged stress levels with weekly practice duration, highlighting correlations.

---

## 7. Non-Functional Requirements

### Performance
*   **NFR-001 (Frame Rate Stability):** The visual interface and vector animations MUST run at a stable 60 FPS on modern mobile, tablet, and desktop displays.
*   **NFR-002 (Reduced Motion Compliance):** The app MUST respect system "Reduced Motion" settings. If enabled, high-movement animations (e.g., falling petals, sliding transitions) MUST be replaced with soft, static fades.

### Security & Privacy
*   **NFR-003 (Privacy by Default):** Practitioner notes and journal entries MUST be stored securely. All local data MUST be stored using secure storage mechanisms, and cloud data must be protected behind strict Firebase security rules.
*   **NFR-004 (Secure API Keys):** All generative AI models and external API calls MUST go through server-side proxy routes. No API credentials or keys may be exposed to the client-side browser.

### Accessibility
*   **NFR-005 (WCAG 2.2 AA Standard):** All screen interfaces MUST maintain a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
*   **NFR-006 (Adaptive Font Scaling):** The user interface MUST support dynamic font scale presets (Small, Normal, Large, Extra Large), scaling all typography fluidly without breaking layouts.

### Offline & Reliability
*   **NFR-007 (Complete Offline Practice):** The core player, movement library, and progress calendar MUST remain fully functional without active network connectivity, utilizing local client-side caches.

---

## 8. MVP & Release Roadmap

```
+------------------------------------------------------------------------------------------------+
|                                    MVP TO V3 ROADMAP                                           |
+---------------------------------+---------------------------------+----------------------------+
|         MVP (V1) - Launch       |         V2 - Intelligence       |        V3 - Community      |
+---------------------------------+---------------------------------+----------------------------+
| * Multi-step Onboarding         | * AI Posture Feed (Camera)      | * Live Group Sessions      |
| * 5 Core Postures with Player   | * HealthKit / Google Connect    | * Master Trainer Market    |
| * Offline Web Audio Synthesis   | * Qi Gong & Daoist Yoga Paths   | * Shared Family Gardens    |
| * Local Zen Garden & Logs       | * Wearable Heart Rate Sync      | * Custom Music Packs       |
+---------------------------------+---------------------------------+----------------------------+
```

### MVP (V1) - The Somatic Sanctuary
*   **Goal:** Establish a beautiful, high-fidelity core loop centered on safe physical recovery and mental grounding.
*   **Included Features:** Fully responsive web application, interactive onboarding, 5 core postures with biomechanical players, local Web Audio synthesis, qualitative diagnostics check-ins, local Zen Garden growth mechanics, and secure progress dashboards.

### Version 2 - Connected Intelligence
*   **Goal:** Integrate real-time computer vision and bio-telemetry to deepen the coaching experience.
*   **Included Features:** On-device camera-driven posture detection, integrations with Apple Health and Google Health Connect, wearable heart rate monitoring, and expanded classes for Qi Gong and specialized mobility.

### Version 3 - Global Sangha
*   **Goal:** Foster human connection and professional instruction.
*   **Included Features:** Shared virtual family gardens, a live trainer marketplace for custom reviews, group streaming sessions, and premium high-fidelity ambient music packs.

---

## 9. Acceptance Criteria

| Feature ID | Functional Target | Critical Path Verification (How We Know It Works) |
| :--- | :--- | :--- |
| **AC-001** | **Onboarding Curation** | Onboarding forms MUST correctly save selections to local storage, and the home dashboard MUST instantly show customized posture recommendations. |
| **AC-002** | **Biomechanical Player** | The player MUST let users toggle between front and side views and adjust speed without interrupting the active timer. |
| **AC-003** | **Zen Garden Growth** | Completing a session MUST instantly increase the completed minutes metric and trigger garden updates according to the dew drop formula. |
| **AC-004** | **Offline Synthesis** | Disconnecting the internet and completing a session MUST successfully play the local sound chimes and log progress without errors. |
| **AC-005** | **AI Companion Proxy** | Chat messages to the AI Coach MUST route through the secure server-side proxy, return responses within 3 seconds, and remain confidential. |

---

## 10. Technical Dependencies

*   **Firebase Authentication:** Handles guest, email, and social logins.
*   **Firebase Firestore Database:** Stores authenticated user logs and settings.
*   **Google GenAI SDK (`@google/genai`):** Powers the AI Coach on the server-side.
*   **Motion (`motion/react`):** Renders smooth, high-fidelity UI transitions at 60 FPS.
*   **Lucide React:** Provides a consistent, minimalist, and responsive icon set.
*   **Web Audio API:** Synthesizes the peaceful bell sounds locally and offline.

---

## 11. Project Risks & Mitigation

| Risk Area | Risk Level | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Visual Slop / Clutter** | **Medium** | Violating the Modern Japanese Zen aesthetic. | Stick to strict styling guides, soft off-white canvases, generous spacing, and zero system telemetry displays. |
| **Camera Performance (V2)** | **High** | Device overheating and frame rate drops during camera analysis. | Use optimized on-device models, limit camera processing to 15 FPS, and keep the main UI thread at 60 FPS. |
| **AI Inaccuracies** | **Medium** | The AI Coach suggesting unsafe or historically inaccurate postures. | Provide the AI model with strict, pre-vetted grounding instructions and include clear medical disclaimers in the UI. |
| **Data Loss (Offline)** | **Low** | Guests losing their logs when switching browsers. | Proactively remind guests that creating a free account backs up their progress to the cloud. |

---

## 12. Requirement Traceability Matrix

| Product Vision Focus | Key Feature Area | Functional Req ID | Future Release Path |
| :--- | :--- | :--- | :--- |
| **Under-exertion Sanctuary** | Somatic Curation | `FR-001`, `FR-003` | MVP (V1) Base |
| **Biomechanical Safety** | Front/Side Skeletal Player | `FR-004`, `FR-005` | MVP (V1) Base |
| **Intrinsic Motivation** | Growing Zen Garden | `FR-007`, `FR-008` | MVP (V1) Base |
| **Accessibility & Inclusion** | Dynamic Font Scaling | `NFR-005`, `NFR-006` | MVP (V1) Base |
| **Offline Habits** | Web Audio Synthesis | `FR-006`, `NFR-007` | MVP (V1) Base |
| **Posture Corrections** | Live Camera Posture Feed | `FR-009` | Version 2 Release |

---

## Product Vision Alignment Verification

- [x] **Every vision point has requirements:** All elements of the approved visual style and philosophy are translated into functional requirements.
- [x] **No important feature is missing:** Covered complete specifications for onboarding, coaching, players, the Zen Garden, and progress logs.
- [x] **Clear enough for developers:** Includes explicit instructions for local Web Audio synthesis, viewport toggles, and data structure paths.
- [x] **Requirements can be tested:** Defined measurable targets and explicit acceptance criteria for each major user flow.
