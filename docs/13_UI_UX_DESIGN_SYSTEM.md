# FlowZen — UI/UX Design System & Experience Specification

## 1. Design Goal
FlowZen should feel like opening a living, magical sanctuary that immediately creates peace, emotional warmth, and gentle curiosity. From the moment the app opens, the interface acts as a nervous-system soothing environment where soft light, subtle ambient movement, and balanced space transport the user into a tranquil digital haven.

---

## 2. First Impression (First 10 Seconds)

### Launch & Splash Sequence
1. **0.0s – 1.5s (The Soft Awake)**: A quiet, warm-off-white or twilight canvas smoothly fades in. In the center, a golden-leafed lotus icon gently breathes with a subtle 2.5-second pulse. A soft, warm bamboo chime chord sounds gently in the background.
2. **1.5s – 3.5s (Ambient Entrance)**: The lotus icon transitions effortlessly upward into the top navigation header while the main view layers unfurl like silk. Ambient nature sound (distant wind chimes, soft stream trickle) fades in smoothly at 20% volume.
3. **3.5s – 10.0s (Sanctuary Discovery)**: The home dashboard presents the user's living garden in a subtle dynamic card hero frame. A gentle morning mist or golden sunbeam drifts across the sanctuary canvas. The user feels an immediate drop in shoulder tension and an intuitive impulse to tap "Begin Daily Practice".

---

## 3. Home Screen Layout

The home screen is structured in a clean, vertical rhythm designed to guide attention effortlessly:

1. **Top Header & Personalized Greeting**:
   - Displays user avatar, current mastery rank badge (e.g. *Disciple*), current streak count with a glowing flame leaf icon, and time-of-day greeting (e.g. *"Good Morning, Master Ebram"*).
2. **Today's Journey (Primary Action Card)**:
   - A prominent, warm-bordered card showcasing today's recommended session (e.g., *"10-Min Wave Hands Like Clouds — Air & Water Balance"*), estimated practice time, and a prominent "Start Practice" button with a gentle glow.
3. **Sanctuary Preview (Interactive Window)**:
   - A real-time mini canvas window showing the user's living garden sanctuary with active weather, day/night lighting, and wandering wildlife. Tapping expands to the full Sanctuary View.
4. **Continue Practice / Recommended Forms**:
   - Horizontally scrollable cards showing recent practice forms, bookmarked movements, and new master curriculum modules with difficulty tags.
5. **Daily Rewards & Qi Vitality Tracker**:
   - Quick claim bar for daily login rewards, active streak calendar, and current Qi Energy recharge progress.
6. **AI Master's Guidance Message**:
   - A personalized, soothing quote or posture tip from the Somatic AI Coach based on recent practice scores and elemental balance metrics.
7. **Bottom Navigation Bar**:
   - Floating translucent navigation bar with 4 clear icons: **Home**, **Practice**, **Sanctuary**, **Progress**.

---

## 4. Sanctuary Screen

The Sanctuary is the emotional centerpiece of FlowZen — an interactive, living 2D/3D procedural world reflecting the practitioner's inner balance.

- **Camera Angle**: Isometric 30-degree tilt perspective providing a deep, layered view of the courtyard, flora, pathways, and water elements.
- **Lighting**: Dynamic lighting that adjusts dynamically based on local device time (Dawn golden hues, Midday sunbeams, Dusk crimson glow, Midnight starlight with soft lantern illumination).
- **Animations & Ambient Movement**: 60fps organic particle systems rendering drifting sakura petals, swaying bamboo stalks, swirling stream ripples, and floating fog banks.
- **Interactive Objects**: Every item placed in the garden (stone lanterns, koi ponds, tea pavilions, bonsai trees) can be tapped to trigger delightful physical feedback.
- **Dynamic Weather System**: Real-time atmospheric toggles and seasonal weather (Spring Rain, Autumn Petal Breeze, Winter Snowfall, Summer Fireflies).
- **Day/Night Cycle**: Smooth 24-hour lighting transitions with real-time shadow movement and starry skies.
- **Pinch & Drag Zooming**: Intuitive pinch-to-zoom and pan controls allowing practitioners to inspect details close-up (e.g., koi swimming in the pond).
- **Tapping Objects**: Tapping a lantern lights or douses its flame; tapping a tree gently shakes leaves loose; tapping water creates expanding ring ripples.
- **Hidden Surprises**: Discoverable secrets unlocked through consistency (e.g., tapping a quiet bamboo clump reveals a resting panda that waves).

---

## 5. Visual Style

- **Color Palette**:
  - *Primary Backgrounds*: Warm Sand (`#FBF9F5`), Deep Charcoal Night (`#121619`), Soft Jade Green (`#2D5A4C`).
  - *Accent Accents*: Crimson Blossom (`#E05A47`), Imperial Gold (`#E8A838`), Azure Water (`#3B82F6`), Earth Amber (`#D97706`).
- **Typography**:
  - *Headings*: Playfair Display or Plus Jakarta Sans (Serif/Display elegance with high legibility).
  - *Body & Labels*: Inter / Plus Jakarta Sans (Clean, high contrast, WCAG AA compliant).
- **Rounded Corners**: Modern, soft radii — Cards: `16px`, Buttons: `24px` pill shapes, Inner containers: `12px` (following outer - padding math).
- **Glassmorphic Translucency**: Translucent blurred backdrops (`backdrop-blur-md` with `bg-white/70` or `bg-slate-900/70`) for floating navigation and overlay panels.
- **Shadows**: Soft, multi-layered ambient drop shadows (`0 8px 32px rgba(0,0,0,0.06)`). No harsh black shadows.
- **Blur Effects**: Gaussian blur overlays for modal backgrounds to maintain focus on open dialogs.
- **Icons**: Clean, organic line icons from `lucide-react` with 2px stroke width.
- **Illustration Style**: Hand-painted watercolor aesthetics combined with clean vector precision.

---

## 6. Animation Guidelines

- **Principles**: Calm, slow, organic, and natural.
- **Easing**: Exponential ease-out and smooth spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Durations**: Transitions range from 300ms (button clicks) to 800ms (page route changes) and continuous 3000ms+ ambient loops.
- **Strict Prohibition**: Never use jittery, fast, flashing, or high-contrast strobe animations. Everything must promote parasympathetic calm.

---

## 7. Sound Design

- **Ambient Audio Layer**: Procedurally synthesized binaural frequencies combined with organic field recordings (rustling bamboo, mountain streams, soft wind).
- **UI Interaction Tones**: Custom wooden chime taps, soft singing bowl resonance on session completion, and warm acoustic clicks.
- **Wildlife Audio**: Soft bird calls at dawn, crickets at dusk, and gentle water splashes when koi jump.
- **Wind & Weather**: Dynamic band-pass filter sweeps mimicking gusting breeze and rainfall intensity.
- **Meditation & Breath Guidance**: Soft rhythmic ocean-wave audio swells synchronizing inhale and exhale phases.

---

## 8. Delight Moments (30 Micro-Interactions)

1. A colorful butterfly fluttering toward the user's touch location when tapping the sanctuary background.
2. A golden koi fish jumping out of the pond with a gentle splash sound when tapped.
3. A cherry blossom petal landing softly on the screen edge and drifting away when shaken.
4. A resting panda in the bamboo grove waving slowly when tapped.
5. Stone lanterns automatically lighting up with a warm amber glow at local sunset.
6. Bioluminescent fireflies emerging and dancing across the screen during night mode.
7. Tapping the water surface creating expanding concentric ring ripples with soft aquatic chime notes.
8. Wind chimes swaying and producing randomized pentatonic tones when the device moves or screen is swiped.
9. Completing a practice session causing a golden burst of light particles to shower down onto the living garden.
10. A red fox peeking out from behind a mossy rock and winking.
11. Dew drops rolling down lotus leaves when tapped during morning sessions.
12. Raindrops leaving soft, disappearing water droplets on the glass UI during rain weather.
13. Tapping a tea cup on the pavilion table causing gentle steam to rise in spiral patterns.
14. A white crane gliding gracefully across the background sky when opening the app.
15. Bamboo stalks bowing smoothly when the wind intensity slider is increased.
16. A soft singing bowl hum vibrating the device's haptic engine upon completing a streak milestone.
17. Tapping the sun or moon causing it to pulse with a glowing halo.
18. Floating clouds drifting across the screen casting subtle moving shadows on the garden floor.
19. Snowflakes collecting on garden rooftops during winter weather.
20. Reaching a new Mastery Rank causing the user's avatar avatar to perform a bow of gratitude.
21. Tapping a stone cairn stacking an additional pebble onto the pile.
22. Falling autumn leaves changing color dynamically from gold to crimson.
23. Tapping the AI Coach icon prompting a warm bow and a personalized word of wisdom.
24. A nightingale singing a brief melodic phrase when morning breaks.
25. Holding down on the garden canvas triggering a peaceful camera slow-pan mode.
26. Recharging Qi energy displaying flowing green aura streams around the user avatar.
27. Unlocking a new plant causing it to sprout instantly from a seed into full bloom with a blossom effect.
28. Tapping the water stream speeding up the current and spawning floating lotus flowers.
29. A soft glowing aurora appearing in the night sky when completing a late-evening mindfulness session.
30. Leaving the app idle for 30 seconds smoothly dimming the UI controls into full-screen Zen Sanctuary view.

---

## 9. Permanent UX Rules

1. **Zero High-Stress Popups**: Never display intrusive modal popups, paywall walls, or aggressive sales notifications.
2. **Instant Feedback**: Every interactive control must provide immediate visual or auditory feedback within 100ms.
3. **One-Tap Practice Access**: Users must be able to launch a practice session in a single tap from the home screen.
4. **Persistent Practice State**: If a session is interrupted, the user's position and breath phase are saved automatically.
5. **Legibility Standard**: All text must maintain WCAG AA contrast (at least 4.5:1 ratio) against its background.
6. **Touch Target Size**: All mobile interactive touch targets must be at least 44x44px.
7. **No Truncated Labels**: UI button and tag labels must fit comfortably on a single line without awkward hyphens.
8. **Consistent Navigation**: The floating bottom navigation bar must remain accessible across all primary views.
9. **Fluid Responsive Scale**: Layouts must fluidly adjust from mobile screens (375px) up to ultra-wide desktop monitors.
10. **Sanctuary Primacy**: The living garden canvas must always remain accessible within one tap.
11. **Non-Punitive Streaks**: A missed practice day pauses streak progress gracefully rather than destroying total achievement history.
12. **Smooth Audio Transitions**: Audio tracks must cross-fade smoothly over 1.5s rather than starting or stopping abruptly.
13. **Haptic Integration**: Use subtle, soft haptics for completion triggers and breath transitions on supported mobile devices.
14. **Respect Dark Mode**: Dark mode must be a dedicated, rich twilight environment rather than inverted white.
15. **Clear Hierarchy**: Use typography scale step ratios of at least 1.25 to maintain distinct visual hierarchy.
16. **No Nesting Cards**: Avoid placing rounded cards inside other rounded cards; use white space and dividers.
17. **Mathematical Corner Radius**: Nested radii must adhere strictly to `Inner Radius = Outer Radius - Padding`.
18. **Accessible Motion Control**: Respect `prefers-reduced-motion` browser accessibility settings.
19. **Offline Independence**: Core UI navigation, saved practice history, and offline session playback must function without internet access.
20. **Continuous Visual Harmony**: No raw code warnings, empty placeholder boxes, or unstyled UI elements may ever appear in production views.
