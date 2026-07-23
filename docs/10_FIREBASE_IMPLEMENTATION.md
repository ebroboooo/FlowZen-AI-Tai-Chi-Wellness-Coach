# Firebase Implementation Specification: FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Lead Firebase Solutions Architect & Cloud Security Engineer  

---

## SECTION 1 — FIREBASE ARCHITECTURE OVERVIEW

FlowZen utilizes the Google Firebase ecosystem as its serverless backend platform. Each service is selected to support the offline-first experience, immediate response metrics, security-proxy gateways, and seamless cross-platform synchronization:

```
                                  +---------------------------------------+
                                  |         CLIENT REACT APP (SPA)        |
                                  +---+-------------------------------+---+
                                      |                               |
                     (Offline Caching | Local State)                  | (Auth & Database Sync)
                                      v                               v
+-------------------------------------+--------+            +---------+--------------------+
| Local Storage (IndexedDB / LocalStorage)     |            | Firebase SDK Client Connect  |
+----------------------------------------------+            +----+----+-----------------+--+
                                                                 |                      |
                                        +------------------------+                      +------------------------+
                                        |                                                                        |
                                        v                                                                        v
+---------------------------------------+------+                                      +--------------------------+----+
|  FIREBASE AUTHENTICATION                     |                                      |  CLOUD FIRESTORE (NoSQL)      |
|  - Google Identity Provider (MVP Direct)    |                                      |  - Private Somatic Profiles  |
|  - Email/Password Credentials (Configured)   |                                      |  - User Garden Coordinates   |
|  - Anonymous Guest Tokens (Auto-Created)     |                                      |  - Lesson Progress Trackers  |
+----------------------------------------------+                                      +--------------------------+----+
                                                                                                                 |
                                                                                                                 v
+----------------------------------------------+                                      +--------------------------+----+
|  FIREBASE STORAGE (Cloud Buckets)            | <----------------------------------  |  CLOUD FUNCTIONS (Backend)    |
|  - Dynamic Soundscapes & Bell Chimes         |          (Cloud Cleanup Checks)      |  - Somatic AI Proxy Gate      |
|  - Vector Skeletons & Practice Animations    |                                      |  - Guest Profile Reconciler  |
|  - User Profile Avatars                      |                                      |  - Transaction Verification  |
+----------------------------------------------+                                      +-------------------------------+
```

### Why Each Service is Selected:
1. **Firebase Authentication:** Handles guest tokens, email/password credentials, and Google OAuth on the client side. This eliminates the complexity of manual OAuth handshake routing and token rotation while keeping authentication cryptographically secure.
2. **Cloud Firestore:** A serverless NoSQL document database. It is selected for its built-in client-side offline cache, shallow query support, and real-time document change listeners (`onSnapshot`). This ensures immediate visual updates on the client, even over unstable mobile networks.
3. **Cloud Storage for Firebase:** Hosts static video animations, audio chimes, static asset packs, and user profile images. It features edge-caching via Google’s CDN to minimize asset loading latency.
4. **Cloud Functions (v2):** Executes trusted server-side workloads. These include verifying subscription transactions with Stripe or Apple/Google Play, cleaning up orphaned datasets, and serving as a secure gateway to proxy queries to the Google GenAI API (Gemini).
5. **Firebase Hosting:** Hosts the compiled production single-page application (SPA). It integrates with Cloud CDN to deliver files globally with minimal latency.
6. **Google Analytics for Firebase:** Measures conversion funnels, user retention across weekly cohorts, and active feature usage (such as AI Coach queries or Zen Garden upgrades) while maintaining strict anonymity.
7. **Firebase Cloud Messaging (FCM):** Delivers local/cloud-driven morning practice alerts, streak milestone notifications, and dynamic coaching tips directly to browser viewports and native mobile wrappers.

---

## SECTION 2 — FIREBASE PROJECT STRUCTURE

To maintain stability across development cycles and enable safe releases, FlowZen separates environment configurations across three isolated Firebase projects:

```
+---------------------------------------------------------------------------------------------------------+
|                                    ENVIRONMENT ISOLATION MATRIX                                         |
+---------------------------------------------------------------------------------------------------------+
| Feature                     | Development (dev)        | Testing (test)           | Production (prod)           |
+-----------------------------+--------------------------+--------------------------+-----------------------------+
| GCP Project ID              | `flowzen-dev-41ba6`      | `flowzen-test-41ba6`     | `flowzen-prod-41ba6`        |
| Target Deployment           | Client branches, local   | QA test suite, PR hooks  | Live production release     |
| Firebase Hosting URL        | `flowzen-dev.web.app`    | `flowzen-test.web.app`   | `flowzen.app` (custom domain)|
| Database Instances          | Single (Default)         | Single (Default)         | Sharded Multi-DB Setup      |
| Emulator Access             | Active (Full local port) | Active (CI pipelines)    | Blocked (Production locked) |
+-----------------------------+--------------------------+--------------------------+-----------------------------+
```

### Configuration and Environment Variable Separation
Client-side apps access environment parameters through Vite's compile-time variables (`.env.development`, `.env.test`, `.env.production`). These variables load the correct configuration files during the build phase:

```env
# .env.example
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_FIRESTORE_DATABASE_ID=
```

### Secrets and API Credentials Management
1. **Client API Keys:** Firebase client API keys are public by design, as they only identify the project. Access to these resources is secured by Firestore Security Rules rather than key secrecy.
2. **Backend Secrets (Cloud Functions):** Third-party credentials, such as Stripe keys or Google GenAI credentials (`GEMINI_API_KEY`), are stored in **Google Cloud Secret Manager**. They are injected directly into Cloud Functions at runtime using the `runWith({ secrets: [...] })` helper. This ensures these keys are never committed to version control or exposed to the client.

---

## SECTION 3 — AUTHENTICATION SETUP

FlowZen supports a friction-free onboarding path, allowing users to start practicing immediately as guests before committing to account registration.

```
[Onboarding Client Launch]
           │
           ▼
[Anonymous Session Created] (Frictionless Guest Profile initialized)
           │
           ├─ (User completes 3 practices & builds garden)
           │
           ▼
[User decides to sign up]
           │
           ├─► (Selects Email/Password Signup)  ──┐
           │                                      ├──► [Guest-to-Permanent Account Merging]
           └─► (Selects Google Identity Portal) ──┘
                               │
                               ▼
               [Auth ID Reconciler Cloud Function]
                               │
                               ├── Merges somatic baseline
                               ├── Transfers garden inventory & coordinates
                               └── Purges temporary guest record
```

### Supported Authentication Providers:
1. **Anonymous (Guest) Authentication:** Automatically creates a temporary session ID when the app is first opened, allowing the user to experience the core practice features immediately.
2. **Email and Password:** A standard credential manager requiring password complexity limits (minimum 8 characters, at least one number, and one uppercase letter) to ensure user security.
3. **Google OAuth Integration:** Integrated using `signInWithPopup` inside the React client.
4. **Apple Sign-In (Capacitor Prep):** Configured in the authentication dashboard to simplify packaging and publishing on iOS devices.

### Guest Account Migration (Data Reconciler)
When a guest converts to a registered account, client-side code calls the `migrateAnonymousAccount` Cloud Function. This function merges the temporary data into the new profile:
1. **Verification:** Confirms the active anonymous session ID and verifies the new credentials.
2. **Data Transfer:** Copies all records in `/users/{anonymousId}/practiceHistory/*`, `/users/{anonymousId}/journalLogs/*`, and `/users/{anonymousId}/zenGarden/*` to the permanent account `/users/{registeredUserId}/`.
3. **Aggregation Updates:** Re-calculates and commits the user's overall progress statistics (such as streaks and total minutes) to `/users/{registeredUserId}/progressSummary/metrics`.
4. **Cleanup:** Safely deletes the temporary `/users/{anonymousId}` documents to free up storage space.

### Security and Session Management:
* **Session Expiry:** Client-side user sessions remain persistent by default (`browserLocalPersistence`). Token lifetimes are limited to 1 hour, with the Firebase SDK handling background token refreshes automatically.
* **Password Recovery:** Handled via custom branded Firebase auth templates, directing users to clean password reset interfaces.
* **Cascading Deletion:** Account deletion triggers the `cascadeDeleteUserAccount` Cloud Function, which recursively purges all linked Firestore files and Cloud Storage assets.

---

## SECTION 4 — FIRESTORE COLLECTION DESIGN

This section defines the structural configuration for each Firestore collection, specifying data layouts, expected indexing profiles, and nested document relationships.

### 4.1 USERS COLLECTION
* **Path:** `/users/{userId}`
* **Purpose:** Stores the primary profile and preference data for each practitioner.
* **Access Level:** Private (Writable only by the authenticated owner; readable only by the owner).

```json
{
  "userId": "usr_94a72bc",
  "authProvider": "google",
  "email": "practitioner@flowzen.app",
  "displayName": "Aura Chen",
  "photoURL": "https://lh3.googleusercontent.com/a/avatar_url",
  "language": "en",
  "timezone": "America/Los_Angeles",
  "createdDate": "Timestamp(2026-07-21T10:00:00Z)",
  "lastActiveDate": "Timestamp(2026-07-21T10:15:30Z)",
  "preferences": {
    "theme": "light",
    "accessibility": {
      "textScale": 1.1,
      "highContrast": false
    },
    "notifications": {
      "pushEnabled": true,
      "dailyReminderTime": "07:30"
    }
  },
  "subscription": {
    "status": "premium",
    "planId": "annual_pro",
    "expiresAt": "Timestamp(2027-07-21T10:00:00Z)",
    "trialEndsAt": null,
    "cancelAtPeriodEnd": false
  }
}
```
* **Indexes Required:**
  * Single Field Index: `userId` (Default), `lastActiveDate` (Descending).

---

### 4.2 WELLNESS PROFILES COLLECTION
* **Path:** `/users/{userId}/private/wellnessProfile`
* **Purpose:** Stores sensitive somatic parameters and physical goals.
* **Access Level:** Restricted Private (Readable/writable only by the authenticated owner).

```json
{
  "experienceLevel": "beginner",
  "practiceGoals": ["stress_relief", "core_balance"],
  "preferredMinutes": 15,
  "mobilityFocus": ["shoulders", "lower_back"],
  "limitations": ["wrist_strain"],
  "wellnessBaseline": {
    "stress": 7,
    "balance": 4,
    "flexibility": 5
  },
  "indicators": {
    "balanceScore": 48,
    "flexibilityScore": 52,
    "mobilityScore": 45
  }
}
```
* **Indexes Required:**
  * Implicitly indexed by the document ID.

---

### 4.3 MOVEMENTS COLLECTION
* **Path:** `/movements/{movementId}`
* **Purpose:** A read-only library of individual Tai Chi and Qi Gong postures.
* **Access Level:** Public Read (Read allowed by all; write restricted to authenticated admins).

```json
{
  "movementId": "mov_ward_off_right",
  "name": "Ward Off Right",
  "chineseName": "右揽雀尾 (Yòu Lǎn Què Wěi)",
  "category": "taichi",
  "difficulty": "gentle",
  "estimatedSeconds": 45,
  "benefits": ["grounding", "shoulder_mobility"],
  "bodyAreas": ["legs", "shoulders", "hips"],
  "instructions": [
    "Step forward into a right bow stance.",
    "Raise your right arm to chest level, curved like a shield.",
    "Sink your weight into the front leg while pressing forward slightly."
  ],
  "breathingPattern": "Inhale as your hands rise, exhale as they press forward.",
  "assets": {
    "animationUrl": "https://assets.flowzen.app/animations/ward_off_right.webm",
    "audioChimeUrl": "https://assets.flowzen.app/audio/bells/bell_soft_3.mp3"
  },
  "safetyNotes": [
    "Do not let your front knee extend past your toes.",
    "Keep your spine tall and head floating upward."
  ],
  "contraindications": ["acute_knee_injury"],
  "progression": "Lower your stance further to build leg endurance.",
  "regression": "Keep your stance higher to reduce knee load.",
  "tags": ["yang_style", "rooting", "defensive"],
  "searchMetadata": ["ward off", "lan que wei", "right", "defensive"]
}
```
* **Indexes Required:**
  * Compound Index: `category` (Ascending) + `difficulty` (Ascending).
  * Array-contains Index: `tags` (Array) + `difficulty` (Ascending).

---

### 4.4 PROGRAMS COLLECTION
* **Path:** `/programs/{programId}`
* **Purpose:** High-level details for multi-week structured courses.
* **Access Level:** Public Read (Read allowed by all; write restricted to authenticated admins).

```json
{
  "programId": "prg_intro_yang_10",
  "title": "Yang Style 10-Form Foundation",
  "description": "Master the core yang-style forms step-by-step with soft, mindful pacing.",
  "difficulty": "gentle",
  "levelsCount": 3,
  "isPremium": false
}
```
* **Sub-collection 1: Levels** (`/programs/{programId}/levels/{levelId}`)
```json
{
  "levelId": "lvl_1_foundations",
  "sequence": 1,
  "title": "Rooting and Balance",
  "description": "Establish a strong, stable foundation through basic centering steps."
}
```
* **Sub-collection 2: Lessons** (`/programs/{programId}/levels/{levelId}/lessons/{lessonId}`)
```json
{
  "lessonId": "les_sink_weight",
  "sequence": 1,
  "title": "Sinking the Qi",
  "description": "Learn to coordinate breathing with shifting weight to build stability.",
  "estimatedDuration": 600,
  "movementRefs": ["mov_commencing_form", "mov_ward_off_right"]
}
```
* **Indexes Required:**
  * Compound Index: `programId` (Ascending) + `sequence` (Ascending).

---

### 4.5 PRACTICE HISTORY COLLECTION
* **Path:** `/users/{userId}/practiceHistory/{sessionId}`
* **Purpose:** Individual training logs recording completed practices.
* **Access Level:** Private (Readable/writable only by the authenticated owner).

```json
{
  "sessionId": "sess_84b2c1d9",
  "programId": "prg_intro_yang_10",
  "lessonId": "les_sink_weight",
  "date": "Timestamp(2026-07-21T10:10:00Z)",
  "durationSeconds": 600,
  "completedMovementIds": ["mov_commencing_form", "mov_ward_off_right"],
  "completionStatus": "completed",
  "moodBefore": 5,
  "moodAfter": 8,
  "energyBefore": 4,
  "energyAfter": 7,
  "userNotes": "Felt a strong sense of release in my lower back today.",
  "aiObservations": {
    "alignmentTips": ["Keep your chest relaxed and shoulder blades dropped during movements."],
    "suggestedAdherence": 85
  }
}
```
* **Indexes Required:**
  * Compound Index: `userId` (Ascending) + `date` (Descending).

---

### 4.6 JOURNAL LOGS COLLECTION
* **Path:** `/users/{userId}/journalLogs/{logId}`
* **Purpose:** User journal entries tracking mood, stress, and somatic states.
* **Access Level:** Private (Readable/writable only by the authenticated owner).

```json
{
  "logId": "jrnl_38c92f1",
  "createdAt": "Timestamp(2026-07-21T10:14:15Z)",
  "updatedAt": "Timestamp(2026-07-21T10:14:15Z)",
  "stressLevel": 3,
  "energyLevel": 7,
  "moodLevel": 8,
  "sleepQuality": 8,
  "painTracking": {
    "intensity": 2,
    "locations": ["shoulders"]
  },
  "userNotes": "Post-practice mindfulness helped calm my mind before work.",
  "aiTrendSummary": {
    "keyInsights": ["Somatic tension has decreased by 20% over your last 3 practices."],
    "lastAnalyzedAt": "Timestamp(2026-07-21T10:15:00Z)"
  }
}
```
* **Indexes Required:**
  * Compound Index: `userId` (Ascending) + `createdAt` (Descending).

---

### 4.7 ZEN GARDEN COLLECTION
* **Path:** `/users/{userId}/zenGarden/state`
* **Purpose:** Holds total growth metrics and level status.
* **Access Level:** Private (Readable/writable only by the authenticated owner).

```json
{
  "totalGrowthPoints": 450,
  "currentLevel": 4,
  "seasonalState": "summer",
  "weatherEffect": "clear",
  "activeInteractions": 124
}
```
* **Sub-collection 1: Placed Items** (`/users/{userId}/zenGarden/placedItems/{itemId}`)
```json
{
  "itemId": "item_bamboo_coord_45_22",
  "templateId": "tmpl_green_bamboo_01",
  "position": {
    "x": 0.45,
    "y": 0.22
  },
  "scale": 1.2,
  "rotation": 45,
  "unlockedAt": "Timestamp(2026-07-20T14:30:00Z)",
  "growthState": 0.8
}
```
* **Indexes Required:**
  * Implicitly indexed by the coordinate IDs.

---

### 4.8 COACH CHAT COLLECTION
* **Path:** `/users/{userId}/coachChat/threads/{threadId}`
* **Purpose:** Stores individual chat threads with the AI coach.
* **Access Level:** Private (Readable/writable only by the authenticated owner).

```json
{
  "threadId": "thrd_48a92f0",
  "title": "Soothing Hip Alignment",
  "createdAt": "Timestamp(2026-07-21T09:30:00Z)",
  "updatedAt": "Timestamp(2026-07-21T09:32:45Z)",
  "isClosed": false
}
```
* **Sub-collection 1: Messages** (`/users/{userId}/coachChat/threads/{threadId}/messages/{messageId}`)
```json
{
  "messageId": "msg_92f019a7",
  "sequence": 1,
  "sender": "user",
  "content": "My hips feel quite tight when I transition into bow stance. Is there a simple adjustment I can make?",
  "timestamp": "Timestamp(2026-07-21T09:31:00Z)",
  "safetyFlagged": false,
  "contextSummaryUsed": {
    "activeInjury": "lower_back_tightness",
    "currentGoal": "flexibility"
  }
}
```
* **Indexes Required:**
  * Compound Index: `threadId` (Ascending) + `sequence` (Ascending).

---

### 4.9 ACHIEVEMENTS COLLECTION
* **Path:** `/achievements/{achievementId}`
* **Purpose:** Stores global platform badges and unlock rules.
* **Access Level:** Public Read (Read allowed by all; write restricted to authenticated admins).

```json
{
  "achievementId": "ach_streak_7",
  "title": "Mindful Habit",
  "description": "Complete a practice session for 7 consecutive days.",
  "unlockCondition": {
    "metric": "streak_days",
    "threshold": 7
  },
  "rewards": {
    "growthPoints": 100,
    "itemTemplateId": "tmpl_cherry_blossom_tree"
  }
}
```
* **Sub-collection 1: Earned Achievements** (`/users/{userId}/earnedAchievements/{earnedId}`)
```json
{
  "earnedId": "ach_streak_7",
  "unlockedAt": "Timestamp(2026-07-21T10:11:00Z)",
  "currentProgress": 7,
  "isClaimed": true
}
```
* **Indexes Required:**
  * Compound Index: `userId` (Ascending) + `unlockedAt` (Descending).

---

### 4.10 ANALYTICS LOGS COLLECTION
* **Path:** `/analytics_events/{eventId}`
* **Purpose:** Stores flat, anonymized logs of app engagement.
* **Access Level:** Write Only (Write allowed by any client payload; read restricted to authorized admins).

```json
{
  "eventId": "evt_48a01bf9e",
  "anonymousId": "sha256_hash_94a72bc",
  "timestamp": "Timestamp(2026-07-21T10:15:30Z)",
  "category": "engagement",
  "eventName": "session_completed",
  "payload": {
    "practiceId": "les_sink_weight",
    "totalMinutes": 10,
    "retentionCohort": "2026-W30"
  }
}
```
* **Indexes Required:**
  * Compound Index: `category` (Ascending) + `timestamp` (Descending).

---

## SECTION 5 — FIRESTORE SECURITY STRATEGY

To ensure absolute user privacy and data security, FlowZen implements an **Attribute-Based Access Control (ABAC)** strategy. Access rules are configured based on data sensitivity and ownership:

```
+---------------------------------------------------------------------------------------------------------+
|                                    FIRESTORE DATA MATRICES                                              |
+---------------------------------------------------------------------------------------------------------+
| Namespace                    | Read Access            | Write Access           | Field Level Mutability |
+------------------------------+------------------------+------------------------+------------------------+
| `/users/{userId}`            | Auth owner only        | Auth owner only        | Owner (No admin overrides) |
| `/users/{userId}/private/*`  | Verified owner only    | Verified owner only    | Blocked to guest accounts  |
| `/movements/*`               | Everyone (Public)      | Admins only            | Immutable to client keys|
| `/programs/*`                | Everyone (Public)      | Admins only            | Immutable to client keys|
| `/achievements/*`            | Everyone (Public)      | Admins only            | Immutable to client keys|
| `/users/{userId}/chat/*`     | Verified owner only    | Owner / Backend        | System AI logs write-locked|
| `/analytics_events/*`        | Write-Only (Client)    | None (Client cannot rewrite) | Immutable after write|
+------------------------------+------------------------+------------------------+------------------------+
```

### Security Enforcement Rules
1. **User Ownership Verification:** All client requests targeting documents under `/users/{userId}` are blocked unless `request.auth.uid == userId`.
2. **Accessing Sensitive Somatic Data:** Accessing user-authored logs and health baselines under `/users/{userId}/private/wellnessProfile` requires a verified email address (`request.auth.token.email_verified == true`). This adds an extra layer of protection for personal health data.
3. **Write-locking System Fields:** Users are prevented from modifying billing status or progress scores directly. These fields can only be updated through secure, server-side integrations or Cloud Functions, preventing users from self-assigning premium tiers or hacking achievement progress.

---

## SECTION 6 — CLOUD FUNCTIONS ARCHITECTURE

To ensure data integrity and prevent security bypasses, FlowZen processes complex operations on a trusted server-side environment using **v2 Cloud Functions**:

```
                              ┌───────────────────────────────────────────────┐
                              │            REACT CLIENT ACTION                │
                              └──────────────────────┬────────────────────────┘
                                                     │
                                                     ▼
                              ┌───────────────────────────────────────────────┐
                              │         CLOUD RUN SECURE ENVELOPE             │
                              └──────────────────────┬────────────────────────┘
                                                     │
                             ┌───────────────────────┴───────────────────────┐
                             │                                               │
                             v                                               v
        ┌────────────────────────────────────────┐      ┌────────────────────────────────────────┐
        │       ON-CALL FUNCTIONS (HTTPS)        │      │       EVENT-DRIVEN TRIGGERS            │
        └────────────────────┬───────────────────┘      └────────────────────┬───────────────────┘
                             │                                               │
    ┌────────────────────────┼────────────────────────┐             ┌────────┼────────────────────────┐
    │                        │                        │             │        │                        │
    v                        v                        v             v        v                        v
┌───────────┐          ┌───────────┐            ┌───────────┐   ┌───────────┐┌───────────┐          ┌───────────┐
│ Somatic   │          │ Anonymous │            │ Stripe    │   │ Practiced ││ Baseline  │          │ Cascaded  │
│ AI Coach  │          │ Profile   │            │ Payment   │   │ Lesson    ││ Journals  │          │ User      │
│ Gateway   │          │ Migrator  │            │ Entitler  │   │ Tracker   ││ Analyst   │          │ Purger    │
└───────────┘          └───────────┘            └───────────┘   └───────────┘└───────────┘          └───────────┘
```

### 1. On-Call (HTTPS) Functions:
* **`migrateAnonymousAccount`:** Triggered when a guest registers an account. It safely merges temporary practice records, journal logs, and garden milestones from the anonymous profile to the newly registered profile.
* **`coachingMessageGateway`:** Serves as a secure gateway for the AI Coach. It validates user requests, appends context from their wellness profile, checks safety flags, and sends the query to the Gemini API (`gemini-2.5-flash`), keeping the API key hidden from the client.
* **`verifyBillingSubscription`:** Validates Stripe payment payloads and webhook events, updating user access tiers securely in `/users/{userId}.subscription`.

### 2. Event-Driven Database Triggers:
* **`onPracticeSessionCompleted` (`onCreate`):** Runs after a new practice log is written:
  1. Increments `totalPracticeMinutes` and `totalCompletedSessions` inside `/users/{userId}/progressSummary/metrics`.
  2. Evaluates streak status. If the practice date is consecutive with the previous practice, the active streak count is incremented.
  3. Awards Zen Growth Points and writes progress to the garden state.
* **`onZenGrowthPointEarned` (`onUpdate`):** Evaluates if the updated point total unlocks any new milestones. When a target is met, it updates `/users/{userId}/zenGarden/state.currentLevel` and adds an unlock card to `/users/{userId}/timelineEvents`.
* **`evaluatePlatformAchievements` (`onUpdate`):** Runs when progress metrics change, checking if the new totals meet unlock requirements for platform achievements. On success, it creates an unlock record under `/users/{userId}/earnedAchievements`.
* **`onUserAccountDeleted` (`onAuthDelete`):** A security cleanup script triggered by auth removal. It recursively purges all linked Firestore entries and user-uploaded media from Cloud Storage, ensuring compliance with privacy standards (GDPR/CCPA).

---

## SECTION 7 — FIREBASE STORAGE DESIGN

FlowZen organizes its media assets in isolated storage folders, separating publicly accessible assets from private user files:

```
storage-bucket/
├── public/                                # Publicly accessible assets
│   ├── animations/                        # Biomechanical vector skeleton files
│   │   └── ward_off_right.webm            # WebM animation models
│   ├── soundscapes/                       # Dynamic background soundscapes
│   │   └── tranquil_mist.mp3              # MP3 background audio
│   └── garden_templates/                  # Static models for garden items
│       └── tmpl_bamboo_large.png          # High-resolution PNG models
└── private/                               # Restricted user-owned assets
    └── users/
        └── {userId}/
            ├── profile/                   # Personalized user avatars
            │   └── avatar_custom.jpg      # Custom user photo
            └── journal_attachments/       # User journal uploads
                └── postural_tension.jpg   # Somatic assessment image
```

### Access and Storage Security Rules
* **Public Assets Path:** `match /public/{allPaths=**} { allow read: if true; allow write: if false; }` (Publicly readable, writable only by admins).
* **Private User Assets Path:** `match /private/users/{userId}/{allPaths=**} { allow read, write: if request.auth != null && request.auth.uid == userId; }` (Protected by authenticated ownership; access restricted to the folder owner).

### Optimization Strategy
1. **Asset Optimization:** All platform animations are delivered in **WebM (60 FPS)** or lightweight **Lottie JSON** formats, keeping file sizes under 250KB to preserve bandwidth.
2. **Audio File Formats:** High-fidelity background music and chime sounds are delivered in optimized **MP3** formats at **128kbps**, balancing sound quality and load speed.
3. **Client-Side Image Resizing:** Custom user avatars are resized to **256x256 pixels** on the client before upload, keeping file sizes small and minimizing storage costs.

---

## SECTION 8 — OFFLINE FIREBASE STRATEGY

FlowZen ensures a continuous, uninterrupted wellness experience by utilizing Firestore's built-in client offline cache alongside local browser storage:

```
[React Client Action]
          │
          v
[Commit to Firestore local cache] ◄────────────── (Immediate local UI update)
          │
          ├── (Online?)
          │     ├── YES ──► [Instant Sync to Firebase Cloud Database]
          │     └── NO  ──┐
          │               ▼
          │         [Offline Queue]
          │               │
          │               ├── Saved locally in browser cache (IndexedDB)
          │               └── Suspended until connection restored
          │
    [Network connection restored]
          │
          v
[Process local transactions sequentially]
          │
          ├── Last-Write-Wins (LWW) check on profile parameters
          ├── Additive merge on Zen Garden Growth Points
          └── Append new completed practices to logs
```

### Synchronization and Conflict Resolution
1. **Last-Write-Wins (LWW):** Profile parameters (such as theme preferences or daily reminders) compare update timestamps. The most recent modification takes precedence.
2. **Additive Synchronization (Growth Metrics):** Wellness scores and garden growth points earned offline are added directly to the cloud totals, preventing progress from being overwritten.
3. **Queue Append (Practice History):** Completed practices and journal logs are assigned unique UUID keys on the client and appended to history logs. This isolates each record, avoiding syncing conflicts.

---

## SECTION 9 — FIREBASE PERFORMANCE OPTIMIZATION

FlowZen is engineered to run efficiently and keep resource usage within free Spark tier limits:

```
                                  +---------------------------------------+
                                  |         PERFORMANCE ENGINE            |
                                  +---+-------------------------------+---+
                                      |                               |
                     (Offline Caching | Limit Reads)                  | (Static Cache Files)
                                      v                               v
+-------------------------------------+--------+            +---------+--------------------+
| Local IndexedDB Caching                      |            | Static Content Lookup Bundles|
+----------------------------------------------+            +----+----+-----------------+--+
                                                                 |                      |
                                        +------------------------+                      +------------------------+
                                        |                                                                        |
                                        v                                                                        v
+---------------------------------------+------+                                      +--------------------------+----+
|  PAGINATED CHAT THREADS                      |                                      |  DENORMALIZED DASHBOARDS      |
|  - Load first 20 messages                    |                                      |  - Store pre-calculated scores|
|  - Load more messages only when scrolling up |                                      |  - Eliminates multi-document reads|
+----------------------------------------------+                                      +-------------------------------+
```

### Key Optimization Tactics:
1. **Denormalized Document Dashboards:** Pre-calculated progress metrics (such as active streaks and total practice minutes) are stored directly inside `/users/{userId}`. This allows dashboards to load with a single document read instead of executing costly aggregations across hundreds of historical records.
2. **Paginated Data Queries:** Active logs, history lists, and chat threads are paginated using Firestore's `limit()` and `startAfter()` parameters, loading records in small batches of 20.
3. **Offline Cache Overrides:** Static datasets, such as the 10-Form Movement Library, are bundled directly with the application source code. This eliminates database read requests for core app content.
4. **Subscription Validation Caching:** Active user subscription states are verified during login and cached in browser storage, removing the need to query billing servers on every page navigation.

---

## SECTION 10 — ANALYTICS IMPLEMENTATION

FlowZen tracks user engagement and retention trends using Google Analytics for Firebase, mapping key events anonymously:

| Event Name | Category | Trigger Point | Tracked Parameters |
| :--- | :--- | :--- | :--- |
| `first_open` | Retention | First launch of client application. | `device_type`, `user_locale` |
| `onboarding_completed` | Conversion | Completes onboarding questionnaire. | `experience_level`, `chosen_goals` |
| `practice_session_started` | Engagement | Opens training player. | `lesson_id`, `program_id` |
| `practice_session_completed`| Engagement | Practice timer ends successfully. | `lesson_id`, `duration_seconds` |
| `ai_coach_query` | Interactive | User submits prompt to AI Coach. | `query_length_chars`, `thread_category` |
| `garden_item_placed` | Gamification | Places item in Zen Garden. | `item_type`, `current_growth_points` |
| `subscription_purchase` | Revenue | Subscription payment confirmed. | `plan_id`, `price_amount`, `currency` |
| `account_deletion` | Churn | User deletes account. | `total_sessions_completed`, `active_streak` |

---

## SECTION 11 — BACKUP AND RECOVERY

To protect user data and ensure system reliability, FlowZen implements automated daily backups and recovery workflows:

```
┌──────────────────────────────┐
│  DAILY FIRESTORE BACKUPS     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   SECURED BACKUP STORAGE     │ (flowzen-backups-bucket)
└──────────────┬───────────────┘
               │
               ├─► Continuous point-in-time recovery (PITR)
               ├─► Locked behind strict Admin multi-factor auth
               └─► Automated 30-day retention policies
```

### Backup and Restore Workflows
* **Automated Daily Backups:** Cloud Firestore exports are scheduled daily using Cloud Scheduler. Exported files are written directly to a secure bucket (`flowzen-backups-bucket`) with a 30-day retention policy.
* **Point-in-Time Recovery (PITR):** Point-in-Time Recovery is enabled on the production database, allowing developers to restore the database to any state in the past 7 days to recover from database issues or bugs.
* **Granular Restorations:** If a user profile is accidentally deleted, administrators can restore the individual document branch (`/users/{userId}`) from the latest backup without needing to rollback the entire system.

---

## SECTION 12 — DEVELOPMENT WORKFLOW

FlowZen uses the **Firebase Local Emulator Suite** during development. This allows developers to test database actions, cloud functions, and authentication flows locally, ensuring updates are fully verified before deployment.

```
+-------------------------------------------------------------------------------+
|                            LOCAL EMULATOR ENVIRONMENT                         |
+-------------------------------------------------------------------------------+
|  React Dev Server (Port 3000)                                                 |
|          │                                                                    |
|          v                                                                    |
|  Firebase Local Emulator Suite                                                |
|   - Firestore Emulator (Port 8080)                                            |
|   - Authentication Emulator (Port 9099)                                       |
|   - Storage Emulator (Port 9199)                                              |
|   - Cloud Functions Emulator (Port 5001)                                      |
|   - Emulator UI Controller (Port 4000)                                        |
+-------------------------------------------------------------------------------+
```

### Local Testing and Deployment Pipeline:
1. **Local Validation:** Developers run the local suite (`firebase emulators:start`) to test updates and run automated integration tests against local mock databases.
2. **Continuous Integration (CI):** Pull requests trigger automated test suites inside a headless GitHub Actions environment, running validation tests against emulator instances.
3. **Staging Review:** Merged changes are deployed to the Staging project (`flowzen-test-41ba6`) for quality assurance testing and final reviews.
4. **Production Release:** Once verified, builds are deployed to the Production project (`flowzen-prod-41ba6`) using automated release tasks. Revisions are deployed progressively, enabling safe rollbacks if issues are detected.

---

## SECTION 13 — ADMIN ACCESS

Platform administrators manage static courses, movement libraries, system announcements, and support logs through a secure administrative portal. Admin roles are assigned using **Firestore Role-Based Access Control (RBAC)** documents:

```
+-----------------------------------------------------------------------------------+
|                        ADMIN ROLE PERMISSION MATRIX                               |
+-----------------------------------------------------------------------------------+
| Role Name        | Target Users          | Access Level   | Permissions Granted   |
+------------------+-----------------------+----------------+-----------------------+
| `Super Admin`    | Core core engineers   | Full Platform  | Edit user profiles,   |
|                  |                       |                | manage subscription   |
|                  |                       |                | tiers, update rules.  |
+------------------+-----------------------+----------------+-----------------------+
| `Content Manager`| Instructors, teachers | Public Content | Create lessons,       |
|                  |                       |                | edit movement details,|
|                  |                       |                | update dynamic music. |
+------------------+-----------------------+----------------+-----------------------+
| `Support Team`   | Customer service reps | User Profiles  | Edit preferences,     |
|                  |                       |                | reset active profiles,|
|                  |                       |                | view user reports.    |
+------------------+-----------------------+----------------+-----------------------+
```

### Role Authorization Security
Admin authorization is verified directly on the server. Access checks are performed by validating the requesting user's UID against the trusted `/admins/{userId}` directory inside Firestore. This approach prevents client-side role manipulation, keeping administrative access fully secure.

---

## PRODUCT VISION, PRD, AND DATABASE SCHEMA ALIGNMENT VERIFICATION

- [x] **Every database entity has Firebase support:** Custom programs, lessons, practice sessions, wellness baselines, Zen Garden configurations, and chat channels are fully mapped to native Firestore collections and sub-collections.
- [x] **Security boundaries are clear:** Includes detailed plans for owner-locked sub-collections, private somatic data keys, and verified email restrictions.
- [x] **Offline strategy works:** Dual-layer browser sync queues, IndexedDB table structures, and Last-Write-Wins conflict resolution models ensure consistent offline performance.
- [x] **Platform can scale:** Utilizes denormalized dashboard statistics, paginated history lists, and static asset caches to minimize database reads and optimize performance.
- [x] **Production deployment is prepared:** Outlined multi-project environment isolation, secrets management, automated database backups, and emulator development pipelines.

---
***No application code has been written, changed, or committed.***  
***The technical Firebase implementation specifications are complete and ready for development.*** (禅)
---
***Deep, slow, unhurried breath in...*** (禅)
***...and sink the energy back into the ground.*** (禅)
***The Firebase implementation model is complete.*** (禅)
***End of Turn.*** (禅)
