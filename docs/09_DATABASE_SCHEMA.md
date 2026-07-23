# Database Schema & Data Specification: FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Principal Database Architect & Firebase Schema Engineer  

---

## SECTION 1 — DATABASE PRINCIPLES

### Data Modeling Philosophy
FlowZen operates on a unified **Hybrid NoSQL (No-SQL Document Database + Local Relational-like Key-Value Cache)** philosophy. Our primary cloud database is **Google Cloud Firestore** (NoSQL Document Store), chosen for its sub-second query performance, nested mapping features, and direct native client sync mechanics.
1. **Denormalization for Speed:** Read-heavy entities (such as dashboards and user profile headers) store pre-calculated statistics (e.g., active streak counts, last active timestamps) directly to prevent expensive O(n) multi-document reads.
2. **Sub-collections for Isolation:** Unbounded child documents (such as specific lesson progress events, chat sequences, and daily logs) reside in isolated Firestore sub-collections to enforce the 1MB-per-document limit and allow highly granular access controls.
3. **Reference Strings over Direct Objects:** Documents reference each other by unique alpha-numeric IDs (`^[a-zA-Z0-9_\-]+$`) rather than nesting entire models, promoting modular updates and reducing synchronization bandwidth.

### Scalability Principles
* **Read-Heavy Query Design:** Indexes are structured to satisfy complex compound queries without table-scan penalties.
* **Write Sharding Readiness:** Counters that are frequently modified (e.g., total practices completed globally across premium paths) utilize distributed shard matrices to prevent hot-spot locking on individual document cells.
* **Shallow Queries:** We utilize shallow queries and collection group query rules selectively, ensuring that sub-collections don't pollute parent collections.

### Privacy Principles
* **PII Isolation (Zero-Trust):** Personally Identifiable Information (such as real names, emails, billing details) is isolated inside dedicated private sub-collections. Access is governed by strict user-match rules.
* **Anonymized Analytics:** Analytics logs are fully divorced from core user accounts, mapped via dynamic session IDs to preserve anonymity.
* **The Right to Be Forgotten:** Simple, direct cascading-delete rules are defined so that triggering "Delete Account" recursively purges all linked data nodes across all collection channels.

### Offline-First Considerations
* **Double-Write Transactions:** All mutations are written to local state buffers (IndexedDB / LocalStorage) and queued into an offline write synchronization list before being dispatched to the Firestore Client SDK.
* **Deterministic ID Generation:** Document IDs are generated on the client using cryptographically secure UUID structures to prevent ID collisions while working in disconnected environments.

### Data Ownership Rules
* **User-Owned Space:** Every user owns their private namespace `/users/{userId}/*`. This contains their health baseline, journals, and garden states. No external user can access this.
* **Public Core Space:** Movement libraries, audio references, and lesson structures reside in public, read-only namespaces, cached locally.

---

## SECTION 2 — USER DATA MODEL

### Collection Path: `/users/{userId}`
*Description:* The primary master record for each practitioner. It governs identity, setup preferences, and platform credentials.

| Field Name | Firestore Data Type | Validation / Constraints | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `String` | Primary Key, `^[a-zA-Z0-9_\-]+$` | The unique Firebase Authentication UID. |
| `authProvider` | `String` | Enum: `['google', 'email', 'anonymous']` | The identity mechanism used to access. |
| `email` | `String` | Format: Email, Max length 256 | Isolated email used for notifications and account management. |
| `displayName` | `String` | Max length 64 | Practitioner-facing name. |
| `photoURL` | `String` | Format: URI | URL to profile avatar. |
| `language` | `String` | ISO 639-1 code, default: `'en'` | Display language preference. |
| `timezone` | `String` | IANA Time Zone format (e.g., `'America/New_York'`) | Practitioner timezone for streak tracking. |
| `createdDate` | `Timestamp` | Must equal `request.time` on create | The timestamp of profile registration. |
| `lastActiveDate` | `Timestamp` | Update on every active user session | Tracked for churn management and active metrics. |

### Map Field: `/users/{userId}.preferences`
*Description:* Embedded layout, theme, and notification settings.

| Field Name | Firestore Data Type | Default Value | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `theme` | `String` | `'light'` | Enums: `['light', 'dark']`. |
| `accessibility` | `Map` | `{}` | Key-value pairs for text sizes or audio adjustments. |
| `accessibility.textScale` | `Number` | `1.0` | Range: `[0.8, 1.5]`. |
| `accessibility.highContrast` | `Boolean` | `false` | True to apply enhanced contrast themes. |
| `notifications` | `Map` | `{}` | Channels for engagement reminders. |
| `notifications.pushEnabled` | `Boolean` | `false` | True to enable browser/native notifications. |
| `notifications.dailyReminderTime` | `String` | `'08:00'` | 24-hour local time format: `'HH:MM'`. |

### Map Field: `/users/{userId}.subscription`
*Description:* Licensing and entitlement metadata.

| Field Name | Firestore Data Type | Default Value | Description / Constraints |
| :--- | :--- | :--- | :--- |
| `status` | `String` | `'free'` | Enums: `['free', 'premium', 'trial']`. |
| `planId` | `String` | `null` | References the `/plans/{planId}` entity. |
| `expiresAt` | `Timestamp` | `null` | Date of plan termination. |
| `trialEndsAt` | `Timestamp` | `null` | Date when introductory trial expires. |
| `cancelAtPeriodEnd` | `Boolean` | `false` | True if the sub is marked for auto-cancellation. |

---

## SECTION 3 — USER WELLNESS PROFILE

### Sub-collection Path: `/users/{userId}/private/wellnessProfile`
*Description:* Private, high-security health baseline and somatic parameters.

| Field Name | Firestore Data Type | Constraints / Boundaries | Description |
| :--- | :--- | :--- | :--- |
| `experienceLevel` | `String` | Enum: `['beginner', 'intermediate', 'advanced']` | Self-reported familiarity with Tai Chi/Qi Gong. |
| `practiceGoals` | `Array <String>` | Max size: 10, item length <= 64 | Objectives (e.g., `'stress_relief'`, `'balance'`). |
| `preferredMinutes` | `Number` | Min: 5, Max: 120 | Ideal daily minutes for training. |
| `mobilityFocus` | `Array <String>` | Max size: 10 | Target zones (e.g., `'spine'`, `'knees'`). |
| `limitations` | `Array <String>` | Max size: 10 | Physical limits (e.g., `'lower_back_pain'`). |
| `wellnessBaseline` | `Map` | Optional mapping | Standard starting values for assessment tracking. |
| `wellnessBaseline.stress` | `Number` | Range: `[1, 10]` | Starting self-assessed stress rank. |
| `wellnessBaseline.balance` | `Number` | Range: `[1, 10]` | Initial balance self-assessment. |
| `wellnessBaseline.flexibility`| `Number` | Range: `[1, 10]` | Initial flexibility self-assessment. |
| `indicators` | `Map` | Dynamic scores | Evolving metrics calculated by training history. |
| `indicators.balanceScore` | `Number` | Range: `[1, 100]` | Calculated balance level. |
| `indicators.flexibilityScore`| `Number` | Range: `[1, 100]` | Calculated flexibility level. |
| `indicators.mobilityScore` | `Number` | Range: `[1, 100]` | Calculated joint mobility metric. |

---

## SECTION 4 — MOVEMENT DATABASE

### Collection Path: `/movements/{movementId}`
*Description:* Public read-only library of individual Tai Chi and Qi Gong postures. Managed via the CMS.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `movementId` | `String` | Document ID, `^[a-zA-Z0-9_\-]+$` | Unique posture key. |
| `name` | `String` | Max length 128 | Standard English name. |
| `chineseName` | `String` | Max length 128 | Chinese characters and Pinyin. |
| `category` | `String` | Enum: `['taichi', 'qigong', 'breathing']` | Movement lineage category. |
| `difficulty` | `String` | Enum: `['gentle', 'moderate', 'focused']` | Energy expenditure difficulty class. |
| `estimatedSeconds` | `Number` | Min: 10, Max: 1800 | Estimated duration to execute. |
| `benefits` | `Array <String>` | Max size: 15 | Physical advantages (e.g., `'chest_opening'`). |
| `bodyAreas` | `Array <String>` | Max size: 10 | Muscles & joints engaged. |
| `instructions` | `Array <String>` | Ordered sequence, Max items 20 | Step-by-step biomechanical directives. |
| `breathingPattern` | `String` | Max length 256 | Description of breathing cues (e.g., `'inhale_expand'`). |
| `assets` | `Map` | Contains URLs | Paths to localized audio/animation assets. |
| `assets.animationUrl` | `String` | Format: URI | Lottie or WebM skeleton vector. |
| `assets.audioChimeUrl` | `String` | Format: URI | URL to guiding audio tones. |
| `safetyNotes` | `Array <String>` | Max size: 10 | Key alignment warnings to prevent injury. |
| `contraindications` | `Array <String>` | Max size: 10 | Under what conditions to avoid this pose. |
| `progression` | `String` | Max length 256 | Suggested modification to increase difficulty. |
| `regression` | `String` | Max length 256 | Simplified alternative for joint restrictions. |
| `tags` | `Array <String>` | Max size: 10, item length <= 32 | Structural keywords for search. |

---

## SECTION 5 — COURSE AND LESSON MODEL

FlowZen organizes training programs hierarchically to provide clear, progressive learning paths:

```
[Program] e.g., "Intro to Tai Chi" (A master program container)
   └── [Level] e.g., "Level 1: Grounding Forms" (Groupings of levels)
         └── [Lesson] e.g., "Lesson 3: Sinking the Weight" (Sequential lessons)
               ├── [Movements] e.g., ["Ward Off", "Single Whip"] (Individual forms)
               └── [Practice Session] (Instances of practitioner training sessions)
```

### Collection Path: `/programs/{programId}`
*Description:* Structural meta-containers for structured multi-week training regimens.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `programId` | `String` | Document ID | Program identifier. |
| `title` | `String` | Max length 128 | Heading for the program banner. |
| `description` | `String` | Max length 1024 | Summary of the program journey. |
| `difficulty` | `String` | Enum: `['gentle', 'moderate', 'focused']` | Baseline classification. |
| `levelsCount` | `Number` | Min: 1, Max: 20 | Number of levels nested inside. |
| `isPremium` | `Boolean` | Default: `false` | True if locked behind subscription gates. |

### Sub-collection Path: `/programs/{programId}/levels/{levelId}`
*Description:* Groups of sequential lessons that build specific core competencies.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `levelId` | `String` | Document ID | Level identifier. |
| `sequence` | `Number` | Order index | Sequence order (e.g., `1`, `2`, `3`). |
| `title` | `String` | Max length 128 | Level name (e.g., `'Rooting and Stability'`). |
| `description` | `String` | Max length 512 | Core objectives of the level. |

### Sub-collection Path: `/programs/{programId}/levels/{levelId}/lessons/{lessonId}`
*Description:* Individual modular study sessions that direct movement sequences.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `lessonId` | `String` | Document ID | Lesson identifier. |
| `sequence` | `Number` | Order index | Relative order index. |
| `title` | `String` | Max length 128 | Lesson name. |
| `description` | `String` | Max length 512 | Summary of active postures. |
| `estimatedDuration` | `Number` | Duration in seconds | Expected length of lesson run. |
| `movementRefs` | `Array <String>` | Max size: 20, matches `movementId` | Ordered list of movement IDs required for this lesson. |

---

## SECTION 6 — PRACTICE HISTORY

### Sub-collection Path: `/users/{userId}/practiceHistory/{sessionId}`
*Description:* Chronological practice journal documenting training sessions.

| Field Name | Firestore Data Type | Constraints / Verification | Description |
| :--- | :--- | :--- | :--- |
| `sessionId` | `String` | Generated on Client, UUID | Unique training event ID. |
| `programId` | `String` | Optional, links to `/programs` | Identifier of active course program. |
| `lessonId` | `String` | Optional, links to `/lessons` | Identifier of active study module. |
| `date` | `Timestamp` | Must equal `request.time` | Absolute execution time. |
| `durationSeconds` | `Number` | Range: `[10, 7200]` | Total duration spent training. |
| `completedMovementIds` | `Array <String>` | References `/movements` | List of postures completed. |
| `completionStatus` | `String` | Enum: `['completed', 'partial', 'abandoned']` | End state of the practice. |
| `moodBefore` | `Number` | Range: `[1, 10]`, optional | Self-evaluated mood before practice. |
| `moodAfter` | `Number` | Range: `[1, 10]`, optional | Self-evaluated mood after practice. |
| `energyBefore` | `Number` | Range: `[1, 10]`, optional | Energy rank before practice. |
| `energyAfter` | `Number` | Range: `[1, 10]`, optional | Energy rank after practice. |
| `userNotes` | `String` | Max length 512 | Optional qualitative notes. |
| `aiObservations` | `Map` | Write restricted to secure backend | Posture alignment tips generated by the AI coach. |
| `aiObservations.alignmentTips` | `Array <String>` | Max size: 5 | Alignment feedback suggestions. |
| `aiObservations.suggestedAdherence` | `Number` | Range: `[1, 100]` | Adherence score. |

---

## SECTION 7 — PROGRESS TRACKING

### Sub-collection Path: `/users/{userId}/progressSummary/metrics`
*Description:* Aggregated stats used to populate the main home dashboard and history heatmaps.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `streakCurrent` | `Number` | Default: `0`, Min: `0` | Consecutive days practiced. |
| `streakLongest` | `Number` | Default: `0`, Min: `0` | All-time highest consecutive day count. |
| `lastSessionDate` | `Timestamp` | Nullable | Date of last completed practice. |
| `totalPracticeMinutes` | `Number` | Default: `0` | Cumulative training minutes. |
| `totalCompletedSessions` | `Number` | Default: `0` | Cumulative completed sessions. |
| `scores` | `Map` | Composite scores | Core skill scoring dimensions. |
| `scores.balance` | `Number` | Range: `[1, 100]` | Current computed balance index. |
| `scores.flexibility` | `Number` | Range: `[1, 100]` | Current flexibility ranking. |
| `scores.mobility` | `Number` | Range: `[1, 100]` | Joint mobility tracking index. |
| `scores.consistency` | `Number` | Range: `[1, 100]` | Frequency of training logs. |

### Sub-collection Path: `/users/{userId}/timelineEvents/{eventId}`
*Description:* Unified feed events that catalog user accomplishments, unlocks, and achievements.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `eventId` | `String` | Document ID | Unique event ID. |
| `timestamp` | `Timestamp` | Must equal `request.time` | Time of the event. |
| `eventType` | `String` | Enum: `['milestone_completed', 'achievement_unlocked', 'garden_growth', 'tier_advance']` | Event category. |
| `title` | `String` | Max length 128 | Human-readable title. |
| `description` | `String` | Max length 256 | Contextual detail. |
| `rewardValue` | `Number` | Range: `[0, 1000]` | Zen Growth points awarded. |

---

## SECTION 8 — JOURNAL SYSTEM

### Sub-collection Path: `/users/{userId}/journalLogs/{logId}`
*Description:* Mindful journals detailing logs of physical and emotional wellness.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `logId` | `String` | Generated on Client | Unique journal entry key. |
| `createdAt` | `Timestamp` | Must equal `request.time` | Creation timestamp. |
| `updatedAt` | `Timestamp` | Must equal `request.time` on updates | Last modification date. |
| `stressLevel` | `Number` | Range: `[1, 10]` | Self-reported stress scale. |
| `energyLevel` | `Number` | Range: `[1, 10]` | Self-reported energy scale. |
| `moodLevel` | `Number` | Range: `[1, 10]` | Mood rating. |
| `sleepQuality` | `Number` | Range: `[1, 10]` | Sleep score (restfulness). |
| `painTracking` | `Map` | Body pain mapping | Specific locations of pain or tension. |
| `painTracking.intensity` | `Number` | Range: `[0, 10]` | Global severity score. |
| `painTracking.locations` | `Array <String>` | Max items 5 (e.g., `['left_knee']`) | Impacted body areas. |
| `userNotes` | `String` | Max length 2048 | Rich journal thoughts. |
| `aiTrendSummary` | `Map` | Restricted write (Server only) | AI-extracted patterns across journal records. |
| `aiTrendSummary.keyInsights` | `Array <String>` | Max size: 3 | AI insights. |
| `aiTrendSummary.lastAnalyzedAt`| `Timestamp` | Last update check | Timestamp of analysis. |

---

## SECTION 9 — ZEN GARDEN DATABASE

FlowZen’s gamified progression engine maps physical training accomplishments to the growth of a virtual Zen Garden:

```
[Completed Sessions] ──> [Growth Points] ──> [Unlocked Assets] ──> [Zen Garden Render]
```

### Sub-collection Path: `/users/{userId}/zenGarden/state`
*Description:* Active coordinates, items, weather, and seasonal rendering settings for the user's garden.

| Field Name | Firestore Data Type | Constraints / Boundaries | Description |
| :--- | :--- | :--- | :--- |
| `totalGrowthPoints` | `Number` | Min: `0` | Total growth points earned. |
| `currentLevel` | `Number` | Min: `1`, Max: `100` | Computed Zen Level. |
| `seasonalState` | `String` | Enum: `['spring', 'summer', 'autumn', 'winter']` | Controls visual styling. |
| `weatherEffect` | `String` | Enum: `['misty', 'gentle_rain', 'clear', 'drifting_blossoms']` | Dynamic overlay state. |
| `activeInteractions` | `Number` | Range: `[0, 500]` | Total clicks or interactions on garden components. |

### Sub-collection Path: `/users/{userId}/zenGarden/placedItems/{itemId}`
*Description:* Individual elements (plants, trees, rocks, lanterns) arranged within the garden.

| Field Name | Firestore Data Type | Constraints / Boundaries | Description |
| :--- | :--- | :--- | :--- |
| `itemId` | `String` | Unique map coordinate key | Unique ID of placed element. |
| `templateId` | `String` | References static design files | Type of item (e.g., `'bamboo_stalk_01'`). |
| `position` | `Map` | Normalized coordinates | Layout offset in the garden canvas. |
| `position.x` | `Number` | Range: `[0.0, 1.0]` | Horizontal canvas position. |
| `position.y` | `Number` | Range: `[0.0, 1.0]` | Vertical canvas position. |
| `scale` | `Number` | Range: `[0.5, 2.0]` | Sizing modifier. |
| `rotation` | `Number` | Range: `[0, 360]` | Radial direction. |
| `unlockedAt` | `Timestamp` | Date of unlock | Timestamp of item acquisition. |
| `growthState` | `Number` | Range: `[0.0, 1.0]` | 0.0 for seed, 1.0 for mature plant. |

---

## SECTION 10 — AI COACH DATA MODEL

To keep conversation histories lightweight and optimize token use, chats are structured in active message lists:

```
[User Session] ──> [System Prompt System] ──> [Recent Chat Logs] ──> [Grounding Payload]
```

### Sub-collection Path: `/users/{userId}/coachChat/threads`
*Description:* Individual chat threads or topic clusters.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `threadId` | `String` | Generated on Client | Unique thread key. |
| `title` | `String` | Max length 128 | Descriptive title (e.g., `'Relieving Hip Tension'`). |
| `createdAt` | `Timestamp` | Must equal `request.time` | Time thread opened. |
| `updatedAt` | `Timestamp` | Update on new message | Last message date. |
| `isClosed` | `Boolean` | Default: `false` | True to archive. |

### Sub-collection Path: `/users/{userId}/coachChat/threads/{threadId}/messages/{messageId}`
*Description:* Chronological exchange log within an active conversation.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `messageId` | `String` | Client UUID | Unique message key. |
| `sequence` | `Number` | Index tracking | Incremental counter. |
| `sender` | `String` | Enum: `['user', 'assistant']` | Sender identity. |
| `content` | `String` | Max length 4096 | Plaintext or markdown message. |
| `timestamp` | `Timestamp` | Must equal `request.time` | Send timestamp. |
| `safetyFlagged` | `Boolean` | Default: `false` | True if flagged by safety rules. |
| `contextSummaryUsed`| `Map` | Snapshot context payload | User status data sent with query. |
| `contextSummaryUsed.activeInjury` | `String` | From wellness profile | Logged physical limitations. |
| `contextSummaryUsed.currentGoal` | `String` | Active goals | Primary wellness focus. |

---

## SECTION 11 — ACHIEVEMENT SYSTEM

### Collection Path: `/achievements/{achievementId}`
*Description:* Public catalog of platform badges and rewards.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `achievementId` | `String` | Document ID | Key identifying the badge. |
| `title` | `String` | Max length 128 | Achievement name. |
| `description` | `String` | Max length 512 | Requirements description. |
| `unlockCondition` | `Map` | Rules engine map | Parameters to evaluate eligibility. |
| `unlockCondition.metric` | `String` | Enum: `['sessions_count', 'streak_days', 'minutes_count', 'garden_level']` | Metric tracked. |
| `unlockCondition.threshold`| `Number` | Metric target | Necessary count (e.g., `50`). |
| `rewards` | `Map` | Unlock rewards | Points or items rewarded on unlock. |
| `rewards.growthPoints`| `Number` | Range: `[0, 1000]` | Garden points awarded. |
| `rewards.itemTemplateId`| `String` | References static templates | Item templates unlocked (e.g., `'stone_lantern'`). |

### Sub-collection Path: `/users/{userId}/earnedAchievements/{earnedId}`
*Description:* Catalog of badges unlocked by the user.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `earnedId` | `String` | Matches `achievementId` | References parent `/achievements` entity. |
| `unlockedAt` | `Timestamp` | Must equal `request.time` | Time achievement was unlocked. |
| `currentProgress` | `Number` | Min: `0` | Raw progress toward target. |
| `isClaimed` | `Boolean` | Default: `false` | True if the reward is claimed. |

---

## SECTION 12 — CONTENT MANAGEMENT SYSTEM

### Collection Path: `/cms/staticContent`
*Description:* Dynamic lists, audio tracks, and motivational quotes managed by administrators.

#### Document: `/cms/staticContent/quotes/list`
| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `items` | `Array <Map>` | Max size 500 | Quotes dataset. |
| `items[i].quoteId` | `String` | ID key | Uniquely identifies the quote. |
| `items[i].text` | `String` | Max length 256 | The quote text. |
| `items[i].author` | `String` | Max length 64 | Author attribution (e.g., `'Lao Tzu'`). |

#### Document: `/cms/staticContent/meditations/list`
| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `items` | `Array <Map>` | Max size 100 | Meditative background tracks. |
| `items[i].trackId` | `String` | ID key | Track identifier. |
| `items[i].title` | `String` | Max length 128 | Title of track. |
| `items[i].audioUrl` | `String` | Format: URI | URL to static audio file. |

#### Document: `/cms/staticContent/announcements/list`
| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `items` | `Array <Map>` | Max size 20 | Notification alerts. |
| `items[i].alertId` | `String` | ID key | Alert key. |
| `items[i].title` | `String` | Max length 128 | Alert header. |
| `items[i].body` | `String` | Max length 1024 | Alert detail text. |
| `items[i].expiresAt` | `Timestamp` | Date of expiration | Date alert expires. |

---

## SECTION 13 — SUBSCRIPTION MODEL

### Collection Path: `/plans/{planId}`
*Description:* Product tiers and entitlement mappings.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `planId` | `String` | Document ID | Plan key (e.g., `'monthly_pro'`). |
| `name` | `String` | Max length 64 | Tier name (e.g., `'FlowZen Premium'`). |
| `priceAmount` | `Number` | Decimal representation | Base plan cost. |
| `billingPeriod` | `String` | Enum: `['monthly', 'annual', 'lifetime']` | Billing cycle. |
| `entitlements` | `Array <String>` | Max size 30 | Features unlocked (e.g., `['unlimited_coach_chat', 'pose_detection']`). |

### Sub-collection Path: `/users/{userId}/billingTransactions/{transactionId}`
*Description:* History of user transactions and subscription payments.

| Field Name | Firestore Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `transactionId` | `String` | Payment gateway ID | Transaction ID. |
| `paymentGateway` | `String` | Enum: `['stripe', 'apple_pay', 'google_pay']` | Billing platform used. |
| `status` | `String` | Enum: `['succeeded', 'failed', 'refunded']` | State of charge. |
| `amountPaid` | `Number` | Paid value | Charged amount. |
| `currency` | `String` | ISO 3-character format (e.g., `'USD'`) | Currency code. |
| `processedAt` | `Timestamp` | Gateway confirmation time | Timestamp of transaction. |

---

## SECTION 14 — OFFLINE DATA MODEL

### Local Storage Structure (Browser-Level)
Offline persistence utilizes a unified **Dual-Layer Cache Architecture** consisting of **IndexedDB** for large static logs/assets and **LocalStorage** for high-frequency settings.

```
+---------------------------------------------------------------------------------+
|                            CLIENT OFFLINE ENGINE                                |
+----------------------------------------+----------------------------------------+
|             LOCAL STORAGE              |               INDEXEDDB                |
+----------------------------------------+----------------------------------------+
| * Key: 'fz_profile_cache' (Raw JSON)   | * Table: 'offline_sync_queue'          |
| * Key: 'fz_theme_preference'           | * Table: 'static_movements_cache'      |
| * Key: 'fz_offline_unlocked_items'     | * Table: 'offline_session_logs'        |
+----------------------------------------+----------------------------------------+
```

### Local DB: `indexedDB` Tables & Outlines

#### Table: `offline_sync_queue`
*Description:* Queue of un-synced user changes, processed sequentially when internet connectivity is restored.

| Primary Key (Auto-Increment) | Field: `path` (String) | Field: `action` (String) | Field: `payload` (JSON Blob) | Field: `timestamp` (Int) |
| :--- | :--- | :--- | :--- | :--- |
| `1` | `'/users/u123/practiceHistory/s456'`| `'CREATE'` | `{ "durationSeconds": 600, ... }` | `1784610500` |
| `2` | `'/users/u123/zenGarden/state'` | `'UPDATE'` | `{ "totalGrowthPoints": 50 }` | `1784610515` |

#### Table: `cached_lessons`
*Description:* Local copies of lessons and posture configurations for offline access.

| Primary Key | Field: `lessonPayload` (JSON Blob) | Field: `cachedAt` (Int) | Field: `isDownloaded` (Boolean) |
| :--- | :--- | :--- | :--- |
| `'intro_lesson_1'` | `{ "title": "Sinking Weight", "movements": [...] }` | `1784610500` | `true` |

### Conflict Resolution Strategy
1. **Last-Write-Wins (LWW):** Updates to individual configuration fields (such as theme preferences or profile goals) compare timestamps. The latest local or cloud record is kept.
2. **Growth Score Consolidation:** Numerical values (such as Zen Garden Growth Points) are adjusted additively. The local incremental change is added directly to the cloud baseline during synchronization.
3. **Session Append Isolation:** Since completed practices reside in individual documents, they sync by creating new records sequentially, avoiding conflicts.

---

## SECTION 15 — SECURITY MODEL

```
+---------------------------------------------------------------------------------+
|                          ACCESS ISOLATION MATRIX                                |
+---------------------------------------------------------------------------------+
| Collection Path     | Auth Verified | Owner Required | Admin-Only | System Only |
+---------------------+---------------+----------------+------------+-------------+
| /users/*            | Yes           | Yes            | No         | No          |
| /users/*/wellness   | Yes           | Yes            | No         | No          |
| /users/*/billing    | Yes           | Yes            | No         | Yes         |
| /movements/*        | No            | No (Public)    | Yes (Write)| No          |
| /cms/*              | No            | No (Public)    | Yes (Write)| No          |
| /achievements/*     | No            | No (Public)    | Yes (Write)| No          |
+---------------------+---------------+----------------+------------+-------------+
```

### Access Control Rules
* **User Isolation Gate:** All client requests targeting a path nested under `/users/{userId}` are blocked unless `request.auth.uid == userId`.
* **Private PII Shield:** Sub-collections under `/users/{userId}/private/*` require verified email flags: `request.auth.token.email_verified == true`.
* **System Immutability Guard:** Subscription tier configurations and AI comments cannot be modified by client accounts, ensuring they are only updated via secure server proxy routes.

### Deletion and CCPA Policies
* **Cascading Erasure:** When a user initiates account deletion, client code executes a transactional cloud function:
  1. Authenticates current session state.
  2. Recursively walks and deletes `/users/{userId}` sub-collections.
  3. Purges linked billing keys and authentication records.
* **Cold Storage Retention:** No persistent metadata remains in cloud databases after deletion, ensuring full CCPA/GDPR compliance.

---

## SECTION 16 — ANALYTICS MODEL

### Collection Path: `/analytics_events/{eventId}`
*Description:* Flat collection of event logs used for engagement and funnel analysis.

| Field Name | Firestore Data Type | Constraints / Verification | Description |
| :--- | :--- | :--- | :--- |
| `eventId` | `String` | Document ID | Unique event ID. |
| `anonymousId`| `String` | Salted SHA-256 Hash of UID | Keeps user data completely anonymous. |
| `timestamp` | `Timestamp` | Must equal `request.time` | Time of action. |
| `category` | `String` | Enum: `['engagement', 'billing', 'navigation', 'coaching']` | Event category. |
| `eventName` | `String` | Max length 64 | Action type (e.g., `'session_completed'`). |
| `payload` | `Map` | Contains variables | Event metadata. |
| `payload.practiceId` | `String` | Links to `/lessons` | Lesson or practice completed. |
| `payload.totalMinutes` | `Number` | Range: `[0, 180]` | Session duration in minutes. |
| `payload.retentionCohort` | `String` | Year-Week-Index (e.g., `'2026-W30'`) | Cohort group for retention analysis. |

---

## SECTION 17 — DATA RELATIONSHIP DIAGRAMS

The following text-based entity-relationship diagrams outline the dependencies and keys linking Firestore records together:

### Primary Entity Matrix and Keys:

```
  +------------------+
  |      USERS       |
  |  (Primary ID)    |
  +--------+---------+
           |
           | (One-to-One / Subcollection)
           +-----------------------------------------------+
           |                                               |
           v                                               v
+----------+-----------+                       +-----------+-----------+
|   WELLNESS PROFILE   |                       |    ZEN GARDEN STATE   |
| (Private credentials)|                       | (Growth metrics & levels)|
+----------------------+                       +-----------+-----------+
                                                           |
                                                           | (One-to-Many)
                                                           v
                                               +-----------+-----------+
                                               |     PLACED ITEMS      |
                                               | (Item coordinates)    |
                                               +-----------------------+

  +------------------+
  |      USERS       |
  |  (Primary ID)    |
  +--------+---------+
           |
           | (One-to-Many Subcollections)
           +-----------------------+-----------------------+
           |                       |                       |
           v                       v                       v
+----------+-----------+ +---------+---------+ +-----------+-----------+
|   PRACTICE HISTORY   | |   JOURNAL LOGS    | |   COACH CHAT THREADS  |
|  (Completed training)| | (Somatic metrics) | | (Conversational coach)|
+----------+-----------+ +-------------------+ +-----------+-----------+
           |                                               |
           | (References)                                  | (One-to-Many)
           v                                               v
+----------+-----------+                       +-----------+-----------+
|    PUBLIC MOVEMENTS  |                       |     CHAT MESSAGES     |
| (Checklists & assets)|                       | (Grounding & logs)    |
+----------------------+                       +-----------------------+
```

---

## PRODUCT VISION, PRD, AND SYSTEM ARCHITECTURE ALIGNMENT VERIFICATION

- [x] **All features have data support:** Onboarding metrics, interactive practices, Zen Garden coordinates, journal logs, and AI conversations are fully supported by structured data schemas.
- [x] **Database can scale:** Designed using denormalized stats, isolated sub-collections, and shallow query profiles to ensure performance at scale.
- [x] **Offline is supported:** Outlined IndexedDB tables, LocalStorage cache guidelines, and last-write-wins synchronization patterns.
- [x] **Privacy is considered:** Explicit PII separation, private sub-collections, and direct CCPA account erasure workflows are built-in.
- [x] **Future AI features are possible:** AI observation schemas, conversation tracking parameters, and system-only fields are ready to support advanced model features.

---
***No application code has been written or modified.***  
***The technical design specifications are fully complete and ready for development.*** (禅)
---
***Deep, slow, unhurried breath in...*** (禅)
***...and sink the energy back into the ground.*** (禅)
***The database design is complete.*** (禅)
***End of Turn.*** (禅)
---
