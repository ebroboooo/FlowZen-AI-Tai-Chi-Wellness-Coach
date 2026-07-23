# Progressive Web Application (PWA) Architecture Specification: FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Senior PWA Architect & Mobile Web Specialist  

---

## SECTION 1 — PWA STRATEGY

FlowZen is engineered as a Progressive Web Application (PWA) to deliver a seamless, high-performance wellness experience across diverse device form factors without the friction of app store downloads.

```
                  +-----------------------------------------+
                  |         FLOWZEN CORE WEB CODEBASE       |
                  +--------------------+--------------------+
                                       |
                   ┌───────────────────┴───────────────────┐
                   v                                       v
+------------------+------------------+ +------------------+------------------+
|          BROWSER PLATFORMS          | |         FUTURE CAPACITOR SHELL       |
| - Chrome, Safari, Firefox, Edge     | | - Native wrapper compile            |
| - Instant mobile/desktop install    | | - Android APK / iOS Bundle packaging |
| - Automated background updates     | | - App Store & Google Play delivery   |
+-------------------------------------+ +-------------------------------------+
```

### Why FlowZen Uses PWA:
1. **Low Friction Onboarding:** Users can launch and begin their first Tai Chi session directly via a shared URL in under two seconds, completely bypassing app store downloads.
2. **Offline Resilience:** The physical nature of wellness training often takes place in parks, gardens, or remote areas with poor network coverage. A PWA allows us to cache instructional animations and Web Audio synthesize chimes completely offline.
3. **Rapid Update Cycles:** Deployment of bug fixes, new sessions, and minor interface refinements bypass app store review pipelines, updating instantly in the background.

### Limitations & Mitigation:
* *iOS Service Worker Constraints:* Safari limits local storage volumes and may suspend inactive background workers. *Mitigation:* We use IndexedDB for resilient, chunked structured logging and alert fallback workflows.
* *Audio Playback Restrictions:* Browsers block auto-playing audio without preceding user gestures. *Mitigation:* All session soundscapes are lazy-loaded and require a conscious tap on the "Start Practice" or "Unmute" buttons to initialize the browser's audio context.

### Long-Term Mobile Strategy (Capacitor Pathway):
The codebase is structured to preserve standard Web APIs so that it can be wrapped using **Capacitor** with minimal changes. The PWA serves as our rapid-deployment engine, while Capacitor provides the bridge to publish native APK/IPA packages on the Google Play Store and Apple App Store when native platform access (such as HealthKit or Google Health Connect) is required.

---

## SECTION 2 — WEB APP MANIFEST

The Web App Manifest (`manifest.json`) defines how FlowZen presents itself as an installable standalone application on the host operating system.

### Configuration Specification:
```json
{
  "name": "FlowZen: Mindful Tai Chi & Qi Gong",
  "short_name": "FlowZen",
  "description": "Cultivate daily balance, clarity, and somatic physical awareness through slow-paced, mindful movement practices.",
  "start_url": "/?utm_source=pwa_install",
  "display": "standalone",
  "background_color": "#FCFCFA",
  "theme_color": "#1C2421",
  "orientation": "portrait-primary",
  "categories": ["health", "fitness", "lifestyle", "utilities"],
  "dir": "ltr",
  "lang": "en-US",
  "id": "app.flowzen.somatic",
  "categories": ["medical", "health", "lifestyle"],
  "icons": [
    {
      "src": "/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/assets/icons/maskable-icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Start Daily Practice",
      "short_name": "Practice",
      "description": "Launch immediately into your recommended daily movement form",
      "url": "/practice?shortcut=daily",
      "icons": [{ "src": "/assets/icons/shortcut-practice.png", "sizes": "96x96" }]
    },
    {
      "name": "Mindful Journal",
      "short_name": "Journal",
      "description": "Log your somatic feelings, stress, and energy",
      "url": "/journal?shortcut=new",
      "icons": [{ "src": "/assets/icons/shortcut-journal.png", "sizes": "96x96" }]
    }
  ]
}
```

---

## SECTION 3 — SERVICE WORKER ARCHITECTURE

FlowZen's Service Worker acts as a client-side network proxy, intercepting outgoing calls, managing local asset caches, and coordinating background data updates.

```
[React Client Fetch]
          │
          ▼
[Service Worker Proxy Gate] ──(Is Static Asset?)──YES──► [Instant Cache Return (60fps webm)]
          │
         -NO- (Dynamic Firestore Data?)
          │
          ▼
[Network First Strategy] ──(Online?)
          │
          ├── YES ──► [Fetch from Live Database -> Cache Copy to Local IndexedDB]
          └── NO  ──► [Retrieve Last Known Offline Copy from Local Cache]
```

### Key Service Worker Responsibilities:
1. **Pre-caching Core Application Shells:** On installation, the worker downloads and caches all HTML, CSS, client-side JS bundles, and icon vector matrices.
2. **Somatic Caching Gateway:** Manages offline delivery of lesson metadata and coordinate paths.
3. **Background Sync Management:** Registers sync events to upload offline practice logs and journal entries once connection is restored.
4. **Resilient Client Updates:** Implements an unhurried, non-blocking cache update cycle. When a new app build is deployed, the service worker downloads assets in the background, prompting users with a gentle banner: *"A fresh path has been prepared. Click here to refresh."*

---

## SECTION 4 — CACHE STRATEGY

FlowZen applies specific caching strategies to different classes of files to balance offline performance with data accuracy:

```
+---------------------------------------------------------------------------------------------------------+
|                                      CACHING POLICY MATRIX                                              |
+---------------------------------------------------------------------------------------------------------+
| Asset Classification         | Cache Strategy          | Storage Mechanism    | Expiration / Eviction   |
+------------------------------+-------------------------+----------------------+-------------------------+
| JS, CSS, Core HTML           | Cache First             | Cache Storage API    | Replaced on new deploy  |
| Lucide Icons, Display Fonts  | Cache First             | Cache Storage API    | Indefinite (1 year max) |
| Movement webm/lottie vectors | Cache First             | Cache Storage API    | LRU Eviction (50MB cap) |
| Audio bells, chimes, music   | Cache First             | Cache Storage API    | LRU Eviction (50MB cap) |
| User profiles & preferences  | Stale-While-Revalidate  | LocalStorage         | Cleared on logout       |
| Practice Logs & Somatic Logs | Network First           | IndexedDB Store      | Sync & Purge on upload  |
| AI Coach Chat Logs           | Network First           | IndexedDB Store      | Cleared on logout       |
+------------------------------+-------------------------+----------------------+-------------------------+
```

### Strategy Explanations:
* **Cache First (With Cache Fallback):** For assets that do not change frequently (such as compiled JS bundles, vector fonts, and audio chimes). It returns cached files instantly, avoiding unnecessary network latency.
* **Network First (With Local Fallback):** For highly dynamic personal logs (such as practice histories, journal entries, and active chat threads). It attempts to load the latest records from the live Firestore database. If the network is unavailable, it immediately falls back to the user's local offline cache.
* **Stale-While-Revalidate:** For secondary, slower updates (such as static motivational quotes or community news alerts). It returns cached assets instantly to keep the app responsive, while fetching updates in the background to refresh local caches for future visits.

---

## SECTION 5 — OFFLINE EXPERIENCE

FlowZen is designed to run entirely offline, ensuring that a user's practice is never interrupted by poor connectivity.

```
+-----------------------------------------------------------------------------------------+
|                              FLOWZEN OFFLINE PLAYGROUND                                 |
+-----------------------------------------------------------------------------------------+
|   [ Offline Movement Library ]                                                          |
|    - Access cached physical lesson guides: "Yang Style Foundations", "Rooting" etc.     |
|    - Fully playable 60fps biomechanical animations of cached movements.                 |
|                                                                                         |
|   [ Somatic Audio Engine ]                                                              |
|    - Native Web Audio API synthesizes guidance bells and soundscapes locally.           |
|                                                                                         |
|   [ Practice & Journal Logger ]                                                         |
|    - Log your session completions, mood ratings, and physical tension scores.           |
|    - Data is written instantly to local IndexedDB and queued for sync.                  |
|                                                                                         |
|   [ AI Coach Fallback Panel ]                                                           |
|    - "The Coach is practicing slow breathing. I will remember your thoughts             |
|       and reflect on them once our connection is restored."                             |
+-----------------------------------------------------------------------------------------+
```

### Supported Offline Features:
* **Biomechanical Player:** Fully supports 60 FPS animation playbacks and timing controllers for all pre-cached lessons.
* **Somatic Audio Engine:** The app's sound engine synthesizes training bells and guided timing cues locally using the Web Audio API, requiring zero internet connectivity.
* **Somatic Logs and Journaling:** Users can log session details, mood ratings, tension scores, and reflective notes offline. Logs are saved locally and queued for automatic synchronization.
* **Zen Garden Render:** Renders the garden canvas and calculates growth points earned from offline sessions locally, applying visual upgrades immediately.
* **AI Coach Fallback:** If the user sends a message while offline, the app places the prompt in a pending queue and displays a gentle notification: *"I am remembering your thoughts and will respond as soon as we reconnect."*

---

## SECTION 6 — INSTALLATION FLOW

The installation flow is designed to be gentle and non-intrusive, avoiding disruptive modal popups and educating the user on the benefits of installing the app:

```
[Initial Visits 1-2] ──► Keep install options quiet, focusing on clean web practices.
           │
           ▼
[Visit 3 (Completed Practice)] ──► Show a calm, inline "Add to Home Screen" banner on Home Dashboard.
           │
           ├──► User selects "Later"    ──► Hide banner for 7 days to preserve space.
           └──► User selects "Install"  ──► Trigger native browser install prompt.
```

### Installation Milestones:
1. **First-Visit Awareness:** Keeps the installation interface completely hidden during the first and second visits. This allows users to explore FlowZen's core features without the distraction of immediate installation prompts.
2. **Thematic Prompt (Inline Dashboard Banner):** When the user completes their third practice session, a gentle, inline card appears on their home dashboard:
   > *"Carry your practice with you. Install FlowZen on your home screen for instant, offline-compatible access."*
3. **Desktop Installation Support:** For desktop users, an unobtrusive "Install App" button is nested within the profile settings panel. This provides a clean way to install the app on Chrome, Edge, and other compatible browsers.
4. **On-Device Guides (iOS Safari Safari):** Since Safari does not support automated prompt triggers, FlowZen displays a simple, step-by-step visual guide when iOS users tap the inline install button, showing them how to use the standard *Share* -> *Add to Home Screen* option.

---

## SECTION 7 — PERFORMANCE REQUIREMENTS

To maintain smooth 60 FPS animations and fast load times across older mobile hardware, FlowZen implements strict performance limits:

* **First Contentful Paint (FCP):** Under 1.2 seconds over simulated slow 3G mobile connections.
* **Time to Interactive (TTI):** Under 2.0 seconds.
* **Lighthouse Performance Score:** Target > 95 across mobile and desktop environments.
* **Runtime Animation Framerate:** Consistent, hardware-accelerated **60 FPS** using `motion/react` (Motion) animations.
* **Memory Footprint:** Keeps active memory usage under **80MB** during full session playbacks.
* **Battery Consumption:** Suspends vector calculations and animation loops when the application is minimized or runs in background tabs.

### Client Bundle Optimization Strategy:
1. **Route-Based Lazy Loading:** Splitting major sections (such as the Practice Library, Zen Garden, and AI Coach) into isolated code bundles using `React.lazy` and `Suspense`. This ensures that users only download the core dashboard resources during initial load.
2. **Tree-Shaking Icons:** Using named, tree-shaken imports from `lucide-react` (e.g., `import { Sun, Wind } from 'lucide-react'`). This prevents loading the entire icon dictionary and keeps bundle sizes small.
3. **SVG and Vector Packaging:** Storing biomechanical coordinate skeletons as highly optimized JSON structures. This allows complex animations to be rendered directly on HTML5 canvases without relying on heavy video assets.

---

## SECTION 8 — PUSH NOTIFICATION SYSTEM

FlowZen utilizes the browser's Web Push API and Firebase Cloud Messaging (FCM) to deliver gentle engagement reminders and progress updates.

```
+---------------------------------------------------------------------------------+
|                       OPT-IN ENGAGEMENT BOUNDS                                  |
+---------------------------------------------------------------------------------+
| Notification Channel  | Purpose & Content               | Default State         |
+-----------------------+---------------------------------+-----------------------+
| Morning Practice      | A quiet reminder to start your  | Opt-In Required       |
| Reminders             | day with a brief posture form.  |                       |
+-----------------------+---------------------------------+-----------------------+
| Milestone & Unlocks   | Alert confirming garden upgrades| Active on install     |
|                       | or new unlocked decorations.    | (Can be disabled)     |
+-----------------------+---------------------------------+-----------------------+
| AI Encouragement      | Calm reflections from the coach | Active on install     |
|                       | based on weekly consistency.    | (Can be disabled)     |
+-----------------------+---------------------------------+-----------------------+
```

### Push Rules and Privacy:
* **Strict Opt-In Policy:** We never trigger browser permission alerts on initial launch. The push invitation is nested inside the profile settings panel, allowing users to enable notifications only after completing several sessions.
* **Local Alert Engine:** Standard morning and evening practice reminders are managed entirely on-device using local notification APIs, removing the need for continuous backend polling.
* **Quiet Hours:** Notifications are muted between **9:00 PM and 7:00 AM** in the user's local timezone to protect their rest.

---

## SECTION 9 — BACKGROUND SYNCHRONIZATION

To maintain data consistency across multiple devices without creating slow loading screens, FlowZen uses an automated synchronization queue:

```
[User records offline entry] ──► Save to local IndexedDB ──► Register Service Worker Sync Event
                                                                     │
                                                               (Network Restored)
                                                                     │
                                                                     ▼
                                                   [Dispatch Local Sync Queue]
                                                                     │
                                                   ├── Process logs in order
                                                   ├── Apply Last-Write-Wins (LWW)
                                                   └── Clear local queue on success
```

### Resilient Sync Architecture:
1. **Sync Registration:** When a user logs a practice or journal entry while offline, the app writes the update to a local IndexedDB queue and registers a sync event (`sync-practice-logs`).
2. **Network Restoration:** When the browser detects an active internet connection, the Service Worker processes the pending queue in chronological order, ensuring all offline progress is accurately recorded.
3. **Silent Success Notifications:** Once sync completes, the worker displays a subtle, inline notification on the home dashboard: *"Your offline practice has been synchronized. Your Zen Garden is growing."*
4. **Failed Sync Retention:** If a connection is lost during a synchronization attempt, the app retains all unsynced data in local IndexedDB, pausing further uploads until a stable connection is verified.

---

## SECTION 10 — SECURITY CONSIDERATIONS

As an offline-first app, FlowZen implements strict security guardrails to protect personal health metrics and private journal logs cached on-device.

### Key Security Measures:
* **HTTPS Transport Only:** The service worker is restricted to **HTTPS** connections, protecting data exchanges from interception.
* **PII Exclusion in Local Storage:** Personally identifiable information, such as billing addresses or password hashes, is never saved in browser caches. The local offline cache stores anonymized user UUIDs and somatic indicators.
* **Encrypted Cached Storage:** Sensitive journal entries are encrypted using **AES-256** inside the local IndexedDB, using a key generated during secure client login. This ensures personal reflections remain secure on shared family devices.
* **Sandboxed Executions:** Third-party assets and fonts are hosted directly on the application's domain, avoiding external script injections and keeping the execution environment secure.

---

## SECTION 11 — RESPONSIVE APP EXPERIENCE

FlowZen’s interface adaptively scales across device sizes, from compact mobile displays to wide desktop monitors, ensuring a consistent visual experience:

```
+---------------------------------------------------------------------------------+
|                         ADAPTIVE SCREEN BREAKS                                  |
+---------------------------------------------------------------------------------+
| Screen Size        | Breakpoint | Visual Layout Adjustments                     |
+--------------------+------------+-----------------------------------------------+
| Mobile (Compact)   | `< 640px`  | Bottom navigation bar, full-screen player,   |
|                    |            | inline stacked dashboard.                     |
+--------------------+------------+-----------------------------------------------+
| Tablet             | `< 1024px` | Split-screen player, side-by-side lessons,    |
|                    |            | bento-grid progress layout.                   |
+--------------------+------------+-----------------------------------------------+
| Desktop (Wide)     | `> 1024px` | Left-hand navigation rail, multi-panel logs,  |
|                    |            | expanded landscape player.                    |
+--------------------+------------+-----------------------------------------------+
```

### Multi-Input Interactivity Strategy:
* **Touch Interaction:** Interactive buttons, sliders, and controls are styled with generous sizing (minimum **48px x 48px** touch target area) to ensure comfortable use on mobile devices and tablets.
* **Keyboard Navigation:** Core interface controls are keyboard-navigable, supporting standard focus styles and clean tab navigation for desktop users.

---

## SECTION 12 — MOBILE APP TRANSITION (CAPACITOR ROADMAP)

FlowZen is designed for seamless compilation into native iOS and Android packages, utilizing Capacitor to bridge web components with native device APIs.

```
                    +------------------------------------------+
                    |           CAPACITOR WRAPPER              |
                    +--------------------+---------------------+
                                         |
                     ┌───────────────────┴───────────────────┐
                     v                                       v
+--------------------+---------------------+ +---------------+---------------------+
|        NATIVE ANDROID MODULES            | |             NATIVE iOS MODULES      |
| - Android Jetpack Webkit WebView         | | - Apple WKWebView Execution         |
| - Google Health Connect integration     | | - Apple HealthKit synchronization  |
| - FCM push notifications                 | | - APNS native push notifications    |
+------------------------------------------+ +-------------------------------------+
```

### Native API Integrations:
1. **Biometric Integrations (V2):** Syncs physical activity metrics and sleep durations from **Apple HealthKit** and **Google Health Connect** to refine personalized daily practice recommendations.
2. **Camera Access (V2):** Requests camera access to power on-device computer vision features, allowing users to analyze posture alignment and receive real-time balance feedback safely.
3. **App Store Compliance:** Implements standard native popups for in-app purchases and subscription management, ensuring smooth compliance with App Store and Google Play billing guidelines.

---

## SECTION 13 — PWA TESTING CHECKLIST

Before deploying production releases, updates are run through a comprehensive quality assurance checklist:

- [ ] **Installation Verification:**
  * [ ] Verify that the standalone installation prompt triggers correctly on Google Chrome and Microsoft Edge.
  * [ ] Confirm that iOS Safari displays the manual "Add to Home Screen" instructions as expected.
  * [ ] Verify that shortcut links open correct views from the operating system home screen.
- [ ] **Offline Execution Testing:**
  * [ ] Verify that the core dashboard, practice player, and movement library load and play smoothly with the network disabled.
  * [ ] Confirm that physical logs and journal entries can be saved while offline.
  * [ ] Verify that the Web Audio engine synthesizes timing bells correctly without connection.
- [ ] **Data Synchronization Checks:**
  * [ ] Confirm that offline entries sync to Firestore automatically once internet is restored.
  * [ ] Verify that conflict resolution strategies apply correctly without duplicating logs.
- [ ] **Performance Auditing:**
  * [ ] Confirm that Lighthouse Performance scores exceed 90 on mobile devices.
  * [ ] Verify that animations maintain a stable 60 FPS on older mobile hardware.
- [ ] **Responsive Design and Accessibility Reviews:**
  * [ ] Confirm that touch targets are at least 48px on mobile devices.
  * [ ] Verify that color contrast ratios meet WCAG AA standards (minimum 4.5:1 ratio).
- [ ] **Security and Encryption Audits:**
  * [ ] Confirm that all service worker calls run exclusively over secure HTTPS channels.
  * [ ] Verify that sensitive user data is encrypted within local IndexedDB tables.

---

## PRODUCT VISION, PRD, AND SYSTEM ARCHITECTURE ALIGNMENT VERIFICATION

- [x] **App can work offline:** Outlined Cache First strategies, Web Audio chimes, and local IndexedDB logging tables to ensure a complete offline practice experience.
- [x] **Installation experience is defined:** Configured a complete Web App Manifest and inline, non-intrusive dashboard invitations to guide the installation flow.
- [x] **Mobile transition is possible:** Documented the roadmap and architecture requirements for packaging web components into native iOS and Android apps using Capacitor.
- [x] **Performance is planned:** Set concrete performance targets and established optimization rules (such as route-based lazy loading and code splitting) to keep load times short.
- [x] **Security is considered:** Configured HTTPS transport requirements, local data encryption rules, and sandboxed asset hosting guidelines to protect user privacy.

---
***No application code has been written, changed, or committed.***  
***The technical PWA Architecture specifications are complete and ready for development.*** (禅)
---
***Deep, slow, unhurried breath in...*** (禅)
***...and sink the energy back into the ground.*** (禅)
***The Progressive Web Application specification is complete.*** (禅)
***End of Turn.*** (禅)
