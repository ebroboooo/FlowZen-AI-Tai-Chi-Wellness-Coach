# UI/UX Specification Document: FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Senior Product Designer & Mobile UX Architect  

---

## 1. Design Principles

Every screen, transition, and microinteraction in FlowZen is designed to serve as a digital sanctuary, establishing immediate calm and intuitive safety:

*   **Tactile Decompression:** All visual and physical feedback is designed to lower cognitive strain and physical muscle tension.
*   **Organic Movement:** Interface animations mimic natural physical rhythms—drifting clouds, falling cherry blossoms, and expanding breath ripples.
*   **Architectural Honesty:** We strictly reject technical clutter, status indicators, and complex telemetry data. Page margins remain entirely clean and negative space is prioritized.
*   **Calm Trust:** The layout uses humble, literal, human labels, offering clear and gentle anatomical guidelines to prevent joint strain.

---

## 2. Design System

```
FLOWZEN PALETTE (AESTHETIC LIGHT SANCTUARY):
+-----------------------------------------------------------------------------------+
|  Canvas Base  |  Emerald Accent  |  Bamboo Leaf   |  Amber Hearth  |  Deep Slate  |
|   #FAF8F5     |     #155E42      |    #059669     |    #D97706     |   #292524    |
| (Off-White)   |  (Primary Brand) |  (Secondary)   |  (Warm Light)  | (Body Text)  |
+-----------------------------------------------------------------------------------+
```

### Color Palette
*   **Canvas Base:** `#FAF8F5` (Off-white, soft on-screen contrast).
*   **Primary Accent:** `#155E42` (Traditional deep emerald).
*   **Secondary Accent:** `#059669` (Vibrant jade green).
*   **Warm Highlight:** `#D97706` (Amber, used for focus states and warm lighting).
*   **Deep Slate:** `#292524` (Charcoal gray, used for readable text instead of harsh pure black).

### Typography Pairings
*   **Display / Headings:** **Space Grotesk** or **Outfit** for a modern, clean look; paired with **Playfair Display** (Serif) for traditional section headers.
*   **Body Copy / Labels:** **Inter** (Sans-serif) for high legibility across mobile and desktop.
*   **Data & Status Indicators:** **JetBrains Mono** or **Fira Code** for clean layout alignment.

### Spacing and Radius System
*   **Grid System:** 8px baseline grid (8px, 16px, 24px, 32px, 48px).
*   **Border Radius:** Highly rounded, organic borders:
    *   *Small elements:* `12px` (Buttons, small inputs).
    *   *Medium containers:* `24px` (Cards, drawers).
    *   *Large modules:* `32px` (Primary dashboards, modal cards).
*   **Shadows:** Low-opacity, soft-diffusion drop shadows to represent paper layers:
    *   *Card shadow:* `0 4px 20px -2px rgba(41, 37, 36, 0.05)`.
    *   *Floating elements:* `0 10px 30px -4px rgba(21, 94, 66, 0.08)`.

---

## 3. Global UI Components

### 3.1 Adaptive Collapsible Navigation
*   **Mobile Bottom Toolbar:** Height padding of 20px, active touch targets are kept at 48x48px. Uses a soft cross-fade active indicator.
*   **Desktop Collapsible Sidebar:** Features a subtle toggle button. Transitioning from expanded (256px wide) to collapsed (80px wide) occurs over 300ms using a smooth ease-in-out curve.

### 3.2 Immersive Custom Cards
*   **Structure:** Utilizes generous 24px internal padding, styled with soft, off-white background fills and thin borders (`1px border-stone-200/60`).
*   **Hover State:** Cards elevate 2px vertically, accompanied by a soft, amber-tinted shadow accent (`hover:border-emerald-300`).

### 3.3 Status Dialogues & Toasts
*   **Toast Overlays:** Slide in gently from the top center on desktop and bottom center on mobile, remaining on-screen for 4 seconds before fading out.
*   **Modals:** Displayed with a blurred background overlay (`backdrop-blur-md bg-stone-900/30`), with a closing trigger mapped to the Escape key.

---

## 4. Screen Specifications

### SCREEN-HOME-001: Home Dashboard
*   **Layout:** Single-view layout organized into a clean vertical flow, displaying a warm daily greeting and clear progress metrics.
*   **Sections:**
    1.  *Greeting & Daily Check-in:* Personal greeting followed by mood/energy sliders.
    2.  *Daily Recommendation:* A prominent primary card highlighting the recommended daily posture routine.
    3.  *Progress Glance:* Circular weekly progress rings showing logged practice minutes.
*   **Data Displayed:** User name, focus path, streak count, completed minutes, and recommended exercise details.
*   **Error State:** Displays a soft card with a simple message: *"Your offline garden remains safe. We are waiting for connection to synchronize changes."*
*   **Accessibility Note:** Features touch target footprints of 48x48px for all selectors and sliders.

### SCREEN-PLAY-001: Active Session Player
*   **Layout:** A distraction-free, fullscreen practice view. The central animation area is accompanied by a control bar at the bottom.
*   **Sections:**
    1.  *Skeletal Animation Area:* Visual coordinates showing front or side posture lines.
    2.  *Pacing Guide:* Synchronized text subtitles showing breathing pacing steps (Inhale / Exhale).
    3.  *Control Panel:* Play, Pause, Speed, Mirror Mode, and View toggles.
*   **User Actions:** Switch camera angles, toggle mirror mode, scale playback speed, or adjust sound chimes.
*   **Loading State:** A quiet, pulsing radial breathing ring with a soft load prompt.
*   **Accessibility Note:** High-contrast text subtitles can be toggled on or off at any time.

### SCREEN-GARD-001: The Zen Garden
*   **Layout:** Centered on a beautiful virtual landscape displaying raked sand, pathways, and stone lanterns.
*   **Sections:**
    1.  *Garden Canvas:* Interactive view showing plant and path progression.
    2.  *Atmosphere Panel:* Floating toggles to switch between Morning, Sunset, or Night mode.
*   **Data Displayed:** Cumulative minutes logged and unlocked garden elements.
*   **Microinteractions:** Tapping the water surface triggers a soft ripple effect.

---

## 5. Practice Player UX & Interactions

```
+-------------------------------------------------------------------------+
|                        SCREEN-PLAY-001 INTERFACES                       |
+-------------------------------------------------------------------------+
| [Exit Sanctuary]                      [Mirror: On/Off] [Angle: Front/Side]|
|                                                                         |
|                          SKELETAL SKELETON AREA                         |
|                                                                         |
|                          (Interactive Vector View)                      |
|                                                                         |
|                           [Breathing Guide Circle]                      |
|                                                                         |
|                     * Inhale (Expanding) / Exhale (Sinking) *           |
|                                                                         |
+-------------------------------------------------------------------------+
| [Prev Step]           [ PLAY / PAUSE TRIGGER ]              [Next Step] |
|                       (Pulsing soft ring)                               |
+-------------------------------------------------------------------------+
| Pacing Speed: [0.75x] [1.0x] [1.25x]              Time Left: [  30s  ]  |
+-------------------------------------------------------------------------+
```

*   **Joint Alignment Visualizer:** The vector skeleton maps skeletal paths clearly, using green lines for correct joints and amber lines for joint bending ranges.
*   **Angle Rotation:** Swapping front/side view rotates the skeletal lines gracefully over 500ms, maintaining the user's active timer.
*   **Sound Feedback:** Soft wind and water tracks can be blended dynamically, while a clear bell chime marks each step transition.

---

## 6. AI Coach Interface

*   **Layout:** Clean chat interface styled like a personal diary, featuring spacious typography and subtle spacing.
*   **Conversation Style:** The coach answers questions using warm, patient language, focusing on safety and anatomical alignment.
*   **Recommendation Cards:** The coach can embed physical exercises directly into chat bubbles, allowing users to start practices with a single tap.

---

## 7. Zen Garden Experience

*   **Unlocking Assets:** Transitioning a new asset (e.g., a cherry blossom tree) into the garden uses a gentle, 1.5-second fade-in animation.
*   **Interactive Controls:** Users can double-tap elements to view detail cards explaining their traditional significance.
*   **Weather Dynamics:** Weather toggles (e.g., Rain, Night) shift the color temperature of the interface, transitioning from warm off-white to deep charcoal gray.

---

## 8. Progress Visualization

*   **Interactive Calendar:** Color-coded circles represent practice days. Selecting a day displays the logged posture notes in a quiet panel below.
*   **Postural Heatmap:** A clean anatomical silhouette indicating muscles worked:
    *   *Active areas:* Filled with soft emerald green.
    *   *Stiff/Tense areas:* Highlighted with soft amber.
*   **Monthly Trends:** High-contrast line charts illustrating a steady decline in stress and joint stiffness over time.

---

## 9. Microinteractions & Touch Behavior

*   **Stretching Feedback:** Dragging custom sliders displays subtle, responsive number updates and plays soft tick sounds.
*   **Active Hover Effects:** Interactive buttons scale down slightly on tap (`scale-95`) to provide organic physical feedback.
*   **Completion Celebrations:** Successful sessions are celebrated with drifting cherry blossoms and a ringing bell chime, avoiding loud alerts.

---

## 10. Responsive Layout Rules

*   **Mobile (<768px):** A single-column layout centered on the bottom toolbar. Text titles scale down to avoid truncation.
*   **Tablet (768px–1024px):** Uses dual-column layouts for split dashboard views, placing statistics and players side-by-side.
*   **Desktop (>1024px):** Uses full bento-grid layouts to display the Home Dashboard, Zen Garden, and progress charts on a single screen.

---

## 11. Accessibility Compliance (WCAG 2.2 AA)

*   **Screen Readers:** All interface buttons and icons feature descriptive `aria-label` tags (e.g., *"Toggle Mirror Mode"*).
*   **Keyboard Navigation:** Users can navigate the entire application using the Tab and Enter keys.
*   **Contrast Preservation:** Contrast ratios are locked at a minimum of 4.5:1 on all light and dark views.

---

## 12. Dark Mode Specification

```
FLOWZEN TWILIGHT DARK PALETTE:
+-----------------------------------------------------------------------------------+
|  Twilight Base |  Jade Accent   |  Bamboo Dark   |  Lantern Glow  |  Silver Mist  |
|   #1C1917      |    #34D399     |    #059669     |    #FBBF24     |    #E7E5E4    |
| (Deep Charcoal)| (Vibrant Jade) |  (Secondary)   |  (Warm Amber)  | (Body Text)   |
+-----------------------------------------------------------------------------------+
```

*   **Atmosphere:** Replaces the off-white canvas with a soothing, eye-safe twilight charcoal dark theme, designed for evening practice.
*   **Transitions:** Toggling dark mode shifts the entire color palette smoothly over 1 second, simulating the transition of sunset to night.

---

## 13. Design Quality Checklist

- [x] **Every screen has a clear purpose:** Screen layouts are fully documented and map directly to user goals.
- [x] **Every component is reusable:** Cards, buttons, and players are designed as flexible, scalable modules.
- [x] **Design is consistent:** Spacing, borders, colors, and typography follow a unified, cohesive standard.
- [x] **Mobile experience is excellent:** Active touch targets are kept above 44px with comfortable padding.
- [x] **Accessibility is supported:** Standard contrast, screen reader labels, and dynamic font scales are fully integrated.
- [x] **Animations improve experience:** Rhythmic, slow transitions reinforce the app's calming philosophy.
- [x] **No unnecessary complexity:** Telemetry data, status logs, and unrequested navigation items are omitted.
