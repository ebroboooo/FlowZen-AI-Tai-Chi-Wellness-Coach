# Information Architecture (IA) and System Structure: FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Principal UX Architect & Information Engineer  

---

## 1. Application Structure

The FlowZen ecosystem is organized into a highly focused, three-tier hierarchical tree. It is designed to minimize cognitive load, presenting a single clean workspace while holding advanced depth behind logical interactions.

```
                                  [ APP ROOT ]
                                       |
       +-------------------------------+-------------------------------+
       |                               |                               |
[ ONBOARDING / FTUE ]         [ SECURE ACCOUNT ]             [ MAIN SANCTUARY ]
                                                                       |
       +---------------+---------------+---------------+---------------+---------------+
       |               |               |               |               |               |
   [ HOME ]       [ PRACTICE ]     [ GARDEN ]     [ PROGRESS ]    [ PROFILE ]     [ ASSIST ]
   Dashboard       Library & Paths  Virtual Space  Analytics & Logs Path Settings   AI Coach
```

### Purpose of Core Architectural Areas:
*   **Onboarding / FTUE:** Captures user goals, focus areas (e.g., spinal relief), physical limitations, and scaling choices.
*   **Secure Account:** Handles guest mode transition, Google social login, and email authentication via Firebase.
*   **Home Dashboard:** The daily center. Houses daily personalized recommendations, check-ins, and quick statistics.
*   **Practice Library:** Searchable catalog of individual movements, programs (e.g., 5-day desk relief), and deep breathing exercises.
*   **Zen Garden:** The emotional core. A beautiful virtual space that grows, rakes, and flourishes based on cumulative minutes practiced.
*   **Progress & Analytics:** High-contrast graphs, calendar sheets, body heatmaps, and journal notes.
*   **Path Settings / Profile:** App configuration, dynamic font scaling, data backup, and permanent erasure tools.
*   **AI Coach Companion:** Dialogue interface for customized routines, philosophical inquiries, and alignment guidance.

---

## 2. Complete Screen Inventory

### SCREEN-FTUE-001: Welcome Splash
*   **Purpose:** Introduce FlowZen brand and establish immediate aesthetic calm.
*   **User Goal:** Enter the application with a sense of mental decompression.
*   **Entry Points:** Cold launch of application.
*   **Exit Points:** Progress to SCREEN-FTUE-002 (Value Cards).
*   **Related Features:** Fluid canvas fades, soft-chime loading triggers.
*   **Required Data:** None.
*   **Permissions Needed:** None.

### SCREEN-FTUE-002: Value Presentation
*   **Purpose:** Explain the unique integration of Tai Chi, somatic recovery, and the growing Zen Garden.
*   **User Goal:** Understand what makes FlowZen different from hyper-active fitness platforms.
*   **Entry Points:** Completed Welcome Splash.
*   **Exit Points:** SCREEN-FTUE-003 (Access Credentials).
*   **Related Features:** Carousel swipe indicator.
*   **Required Data:** Static copy definitions.
*   **Permissions Needed:** None.

### SCREEN-FTUE-003: Access Credentials
*   **Purpose:** Onboard users securely without forcing account pressure.
*   **User Goal:** Access the app instantly, choosing whether to register or try it as a guest.
*   **Entry Points:** Value Presentation slides.
*   **Exit Points:** SCREEN-FTUE-004 (Somatic Questionnaire).
*   **Related Features:** Google OAuth, Guest cache initialization, Firebase Auth.
*   **Required Data:** None.
*   **Permissions Needed:** None.

### SCREEN-FTUE-004: Somatic Questionnaire
*   **Purpose:** Gather physical limitations, balance goals, and experience levels.
*   **User Goal:** Receive a customized movement plan aligned with their body’s unique needs.
*   **Entry Points:** Account credential setup.
*   **Exit Points:** SCREEN-HOME-001 (Home Dashboard).
*   **Related Features:** Progress bar, dynamic accessibility font scale toggles.
*   **Required Data:** User selections (Stiffness points, daily targets, experience metrics).
*   **Permissions Needed:** Optional notification permission request.

### SCREEN-HOME-001: Home Dashboard
*   **Purpose:** Daily wellness command center.
*   **User Goal:** Instantly view and start their daily personalized recommendation.
*   **Entry Points:** FTUE completion, Main tab navigation.
*   **Exit Points:** Practice Player, AI Coach, Zen Garden, or Progress sub-screens.
*   **Related Features:** Daily energy/mood check-in, weekly progress ring, active streak indicator.
*   **Required Data:** User goals, cached weekly logs, dynamic recommended exercise ID.
*   **Permissions Needed:** None.

### SCREEN-PRAC-001: Practice Library
*   **Purpose:** Provide a catalog of postures, breathing patterns, and levels.
*   **User Goal:** Discover specific movements or courses to address current physical stiffness.
*   **Entry Points:** Main navigation bar.
*   **Exit Points:** SCREEN-PRAC-002 (Movement Details Drawer), SCREEN-PLAY-001 (Active Player).
*   **Related Features:** Multi-criteria filter, text search bar, course locking mechanics.
*   **Required Data:** Global exercises array.
*   **Permissions Needed:** None.

### SCREEN-PRAC-002: Movement Details Drawer
*   **Purpose:** Present in-depth historical, anatomical, and safety context for a single form.
*   **User Goal:** Understand the proper spinal alignment, common mistakes, and health benefits before practicing.
*   **Entry Points:** Tapping a movement card in the library or home screen.
*   **Exit Points:** Close drawer, launch SCREEN-PLAY-001 (Active Player).
*   **Related Features:** High-contrast anatomy illustrations, common mistake checklists.
*   **Required Data:** Full movement properties.
*   **Permissions Needed:** None.

### SCREEN-PLAY-001: Active Session Player
*   **Purpose:** Immersive, distraction-free physical and cognitive instruction space.
*   **User Goal:** Follow skeletal models and verbal breathing cycles safely and accurately.
*   **Entry Points:** Tapping "Begin Form" from the Home or Movement Details screens.
*   **Exit Points:** Close/Exit, SCREEN-PLAY-002 (Session Summary & Rating).
*   **Related Features:** Front/Side skeletal coordinate toggle, Mirror mode, Speed controller (0.75x–1.25x), local Audio Bell synthesizer.
*   **Required Data:** Current active exercise steps data.
*   **Permissions Needed:** None.

### SCREEN-PLAY-002: Session Summary & Rating
*   **Purpose:** Log completed practices and prompt subjective somatic reflections.
*   **User Goal:** Nurture their Zen Garden and log how their joints feel.
*   **Entry Points:** Automatic transition upon completion of player steps.
*   **Exit Points:** Submitting logs returns user to SCREEN-HOME-001.
*   **Related Features:** Slider for anxiety/tension scoring, optional text reflection journal.
*   **Required Data:** Exercise metrics, user ratings.
*   **Permissions Needed:** None.

### SCREEN-GARD-001: The Zen Garden
*   **Purpose:** Visual, non-competitive gamification space mapping consistency to nature.
*   **User Goal:** Relax while viewing their growing digital garden.
*   **Entry Points:** Main navigation bar.
*   **Exit Points:** Home Dashboard, Settings.
*   **Related Features:** Asset lock/unlock animations, weather toggle panel, night mode, ambient nature loop.
*   **Required Data:** Cumulative practice duration, unlocked asset IDs.
*   **Permissions Needed:** None.

### SCREEN-STAT-001: Progress Analytics
*   **Purpose:** Detailed personal tracking dashboard.
*   **User Goal:** Review long-term trends in flexibility, consistency, and stress reduction.
*   **Entry Points:** Main navigation bar.
*   **Exit Points:** Main dashboard screens, Journal edit panels.
*   **Related Features:** Heatmap chart, stress-reduction comparison line graphs, practice history calendar.
*   **Required Data:** Historic database logs.
*   **Permissions Needed:** None.

### SCREEN-PROF-001: Path Settings
*   **Purpose:** Manage settings, account backup, and visual accessibility.
*   **User Goal:** Customize their experience, backup data, or permanently erase their profile.
*   **Entry Points:** Main navigation bar.
*   **Exit Points:** Main dashboards, SCREEN-FTUE-001 (upon complete factory reset).
*   **Related Features:** Text scale buttons, account backup, Google social binding.
*   **Required Data:** Active user profile, cloud storage status.
*   **Permissions Needed:** None.

---

## 3. Navigation Architecture

FlowZen uses a flat, predictable navigation layout that avoids confusing nested menus.

```
DESKTOP COLLAPSIBLE SIDEBAR:
+------------------------------------+
|  FlowZen Logo      [Collapse Arrow]|
|                                    |
|  [Home]  Sanctuary Home            |
|  [Comp]  Practice Library          |
|  [Shov]  Zen Garden                |
|  [Stat]  Progress Analytics        |
|  [User]  Path Settings             |
|                                    |
|  [Wind]  Quick Breath              |
|  [Chat]  Consult AI                |
+------------------------------------+

MOBILE TAB REGIME:
+-----------------------------------------------------+
| [Home]    [Practice]    [Garden]    [Stats]    [User] |
+-----------------------------------------------------+
```

*   **Adaptive Navigation Rails:**
    *   **Mobile (<768px):** Fixed bottom toolbar (20px height padding, touch targets 48x48px). Main quick actions (Quick Breath, Consult AI) are located in the top header.
    *   **Tablet (768px–1024px):** A compact, vertical navigation rail on the left side, showing minimalist icons with tooltips.
    *   **Desktop (>1024px):** A collapsible sidebar containing clear icons and labels, along with quick access buttons for instant practices.
*   **Deep Linking Structure:** Uses clean routing paths:
    *   `/home` — Sanctuary Home
    *   `/practice` — Practice Library
    *   `/practice/:exerciseId` — Direct link to a specific movement drawer
    *   `/garden` — Zen Garden State
    *   `/progress` — Progress Sheets and Journal
    *   `/settings` — Path Settings and Accessibility Toggles
*   **Back Navigation Behavior:** Modal overlays and drawers can be closed using the Escape key, screen taps outside the container, or clear close buttons. Closing a drawer always returns the user to their exact scroll position on the previous screen.
*   **Global Search Navigation:** Tapping the search bar on the Practice screen displays matching results instantly below, without taking the user to a separate results page.

---

## 4. Complete User Flow Map

### I. Onboarding Flow
```
[Start] -> Welcome Splash (FTUE-001) -> Value Cards (FTUE-002) 
               |
               v
       Access Choice (FTUE-003) -> Select Guest / Google / Email
               |
               v
       Somatic Questionnaire (FTUE-004) -> Input Focus, Target Mins, Limits
               |
               v
       Dynamic AI Curation -> Complete FTUE -> Home Dashboard (HOME-001)
```

### II. Daily Practice & Reflection Flow
```
Home Dashboard (HOME-001) -> Tap Daily Recommendation -> Open Practice Room
                                                                 |
                                                                 v
       Journal Log & Rating <- Session Complete <- Play Active Forms
                 |
                 v
       Trigger Garden Grow -> Auto-redirect to Home Dashboard (HOME-001)
```

---

## 5. Content Architecture

FlowZen's content structure is designed to support scalable expansion, organizing materials from single postures to comprehensive multi-week plans:

```
[PATH FOCUS GROUP]
  e.g., Joint Lubrication / Grounding & Balance
         |
         v
  [GUIDED COURSE]
    e.g., 5-Day Desk Tension Release
           |
           v
    [CHRONOLOGICAL LEVEL / LESSON]
      e.g., Lesson 3: Floating Hands and Soft Spine
             |
             v
      [ACTIVE SESSION]
        e.g., Commencing Flow (5 Mins) -> Playback Steps List
               |
               v
        [CORE POSTURES / FORMS]
          e.g., Wave Hands Like Clouds (Skeletal coordinates, breathing pacing)
```

### Core Content Relationships:
*   **Path Focus Groups:** The highest organization layer, filtering recommendations based on user goals.
*   **Guided Courses:** Chronological sequences of lessons designed to build physical skills step-by-step.
*   **Chronological Lessons:** Individual milestones containing structured practice sessions.
*   **Active Sessions:** Curated routines that combine warmups, core postures, and cooldowns.
*   **Core Postures / Forms:** The building blocks of the library, containing skeletal assets, coaching cues, and safety guidelines.

---

## 6. Movement Content Hierarchy Example

The following diagram illustrates how the core "Wave Hands Like Clouds" posture fits into the broader content hierarchy:

```
[TAI CHI SECTOR]
  |
  +-- [PATH: Grounding & Balance]
        |
        +-- [COURSE: Beginner Stance Foundations]
              |
              +-- [LEVEL: Week 1 - Sinking Weight]
                    |
                    +-- [LESSON: Lesson 3 - The Fluid Hips]
                          |
                          +-- [SESSION: Wave Hands like Clouds (6 Mins)]
                                |
                                +-- Warmup: Shoulder Rolls (60s)
                                +-- Posture Step: Single posture loop (3 mins)
                                +-- Posture Step: Weight-shifting transition (1 min)
                                +-- Cooldown: Dantian breathing reflection (1 min)
```

---

## 7. User Data Relationships (ERD Representation)

The application stores user data locally by default, backing up to the cloud securely via Firestore for registered accounts.

```
  +------------------+             +--------------------+
  |      USER        | 1         1 |    USER_PROFILE    |
  |  - uid (UUID)    |-------------|  - name (String)   |
  |  - email (String)|             |  - focusPath (Enum)|
  |                  |             |  - limitKeys (List)|
  +------------------+             +--------------------+
           | 1
           |
           | 1:N
           v
  +-----------------------------------------------------+
  |                  SESSION_LOG                        |
  |  - id (String)                                      |
  |  - timestamp (ISOString)                             |
  |  - exerciseId (String)                              |
  |  - durationMinutes (Int)                            |
  |  - mentalRating (Int)                               |
  |  - journalNote (Text)                               |
  +-----------------------------------------------------+
           | 1:1
           v
  +-----------------------------------------------------+
  |                  ZEN_GARDEN_PROGRESS                |
  |  - accumulatedDewDrops (Int)                        |
  |  - unlockedAssetIds (List)                          |
  |  - selectedWeather (Enum)                           |
  |  - gardenTheme (Enum)                               |
  +-----------------------------------------------------+
```

---

## 8. AI Feature Structure

AI is woven into the core experience to provide personalized, supportive guidance without adding pressure.

### AI Coach Companion
*   **User Input:** Natural language queries (e.g., *"My shoulders feel stiff today,"* *"What is Qi?"*). Includes the user's focus path, experience level, and physical limitations as background context.
*   **Processing:** Server-side proxy API. Runs safety audits, formats custom instructions, and filters results to prioritize physical safety.
*   **System Output:** Gentle, conversational suggestions, biomechanical tips, and custom-filtered routine recommendations.

### Automated Diagnostic Analyzer
*   **User Input:** Daily physical energy slider (1–10) and qualitative mood selections.
*   **Processing:** Heuristic comparison matching energy levels to ideal posture durations and difficulty curves.
*   **System Output:** A single, curated daily recommendation on the Home Dashboard.

---

## 9. Search Architecture

Global search is designed for speed and accessibility, allowing users to find content instantly.

```
[Search Input Field] ---> [Tokenize & Filter Engine]
                               |
            +------------------+------------------+
            |                  |                  |
            v                  v                  v
     [Movements Library]   [Guided Courses]  [Somatic Notes]
```

*   **Searchable Entities:**
    *   *Movements:* Matches English names, Chinese Pinyin characters, and anatomical targets (e.g., "hips").
    *   *Guided Courses:* Matches titles, focus levels, and descriptions.
    *   *Somatic Journal Notes:* Allows users to search their own historical logs for keywords like "neck pain" to track their progress.
*   **Instant Result Filtering:** Results are updated in real-time as the user types, with a maximum 150ms debounce window to preserve performance.

---

## 10. Admin Content Structure

For future administrative systems, the content management platform is organized as follows:

```
[ADMIN PLATFORM]
  |
  +-- [Content Desk]: Manage Posture Library, metadata, and description fields.
  +-- [Anatomy Suite]: Upload and test coordinate points for front and side skeletal players.
  +-- [Course Studio]: Organize lessons, set completion requirements, and define pathways.
  +-- [Sound Room]: Manage Web Audio synthesizer configurations and nature tracks.
  +-- [Analytics Center]: Monitor aggregate retention rates and user satisfaction trends.
```

---

## 11. Accessibility Structure

Accessibility is built directly into the structure of FlowZen, ensuring a seamless experience for all users.

### Navigation Adaptations
*   **Clear Hierarchy:** Screen components are arranged logically, allowing screen readers to announce content in a predictable order.
*   **Focus Ring Indicator:** Every interactive element displays a high-contrast focus outline when navigated using a keyboard.

### Screen Reader Support
*   Skeletal coordinate changes are accompanied by descriptive text alternative tags, enabling visually impaired users to understand the postures.
*   Action buttons (e.g., Play, Pause, Toggle View) feature clear, spoken descriptive labels.

### Visual Preferences
*   **Dynamic Font Scaling:** Supports fluid scaling up to Extra Large, enlarging buttons and cards proportionally without clipping text.
*   **Reduced Motion:** Disabling motion replaces transition slide-ins, falling cherry petals, and raking animations with clean cross-fades.

---

## 12. Information Architecture Rules

*   **Rule of Three Taps:** Users must be able to reach any movement, practice log, or setting in three taps or fewer from the Home Dashboard.
*   **Visual Balance:** Maintain generous negative space across all screens. Cards must be clean and free of unnecessary system metrics or telemetry logs.
*   **Consistent Terminology:** Postures, levels, and paths must use consistent, supportive, and descriptive English terminology across all menus.
*   **Intuitive Layouts:** Related interactive items (such as player controls, volume toggles, and view selectors) must be grouped together logically.

---

## Product Vision, PRD, and User Journey Verification

- [x] **Every feature has a location:** Screen inventories explicitly detail where onboarding, player controls, analytics, settings, and the AI Coach live.
- [x] **Every screen has a purpose:** Screen purposes, inputs, and outputs are clearly defined.
- [x] **Navigation is logical:** Mobile bottom toolbars and desktop sidebars scale fluidly to match any screen size.
- [x] **Content hierarchy is scalable:** The structure supports easy expansion from single postures to multi-week plans.
- [x] **Developers can implement it:** Provides clear specifications for local Web Audio synthesis, database schemas, and state transitions.
- [x] **QA can test it:** Defined clear inputs, outputs, and acceptance criteria for every screen in the inventory.
No code has been written during this turn.
The system is now fully aligned for high-fidelity interactive prototyping.
