# User Journeys and UX Strategy: FlowZen
**Document Version:** 1.0.0  
**Status:** APPROVED  
**Author:** Senior UX Designer & Apple Human Interface Expert  

---

## 1. User Experience Principles

### Emotional Goals
FlowZen’s interface is designed around the somatic concept of **tactile decompression**. Every view, transition, and microinteraction should leave the user feeling:
*   **Safe:** Protected from performance metrics and notification fatigue.
*   **Unpressured:** Guided by a gentle rhythm that honors the body’s current state.
*   **Grounded:** Connected to the sensation of physical weight sinking, breath widening, and posture lengthening.

### User Expectations
Users expect FlowZen to be an instantaneous sanctuary. They demand zero friction when launching their daily practice, no heavy configuration screens, and zero visual clutter. They expect our technology to act as a supportive companion, offering safe, helpful anatomical modifications when their joints are stiff.

### Trust Building
We establish trust through **functional transparency** and **absolute privacy**:
*   No personal health logs or reflective journal entries are transmitted or sold. Everything is processed and stored on-device by default.
*   The AI Coach explains *why* it suggests specific modifications, using anatomical and historical reasoning to validate its choices.
*   We use humble, literal, and descriptive human labels throughout the UI, strictly avoiding "tech-larping" or pseudo-intelligent system logs that clutter the page margins.

### Motivation System
We reject traditional, anxiety-inducing gamification models. FlowZen replaces loud alerts, red notification badges, and public leaderboards with **intrinsic, organic milestones**:
*   **Somatic Rewards:** The immediate physiological relief felt in the hips, shoulders, and lower back after practicing.
*   **Emotional Rewards:** The visual growth of their private, virtual Zen Garden, transforming their commitment into trees, paths, and koi fish.
*   **Quiet Celebrations:** Soft, warm-hued badge unlocks and gentle chimes that celebrate consistency without interruption.

### Habit Formation Principles
FlowZen leverages the classic habit loop: **Cue → Routine → Reward**:
*   **The Cue:** A soft, ambient reminder matched to the user's preferred time of day (e.g., "Morning mist" or "Twilight settle").
*   **The Routine:** A hyper-accessible, 5-minute practice that requires zero special equipment, props, or clothing changes.
*   **The Reward:** The visual growth of their garden, paired with immediate physical relief, reinforcing the loop.

### Accessibility Considerations (WCAG 2.2 AA / Apple HIE)
*   **Dynamic Font Scaling:** Users can scale typography from Small to Extra Large. Component containers adapt fluidly without breaking or truncating text.
*   **Optimal Color Contrast:** All screens maintain a contrast ratio of at least 4.5:1 for standard body copy, ensuring legible guidance for seniors.
*   **Touch Target Size:** Interactive elements feature an active footprint of at least 44x44 points, preventing misclicks on touch screens.
*   **Reduced Motion Comfort:** Enabling system-wide "Reduced Motion" stops drifting petals, wind lines, and sliding cards, replacing them with peaceful, immediate cross-fades.

---

## 2. First-Time User Journey (FTUE)

```
+-----------------------------------------------------------------------------------------------------+
|                              FIRST-TIME USER JOURNEY STAGE LINE                                     |
+-----------------------------------------------------------------------------------------------------+
| 1. Welcome Splash -> 2. Brand Value -> 3. Permissions -> 4. Account Choice -> 5. Assessment        |
| 6. AI Recommendation -> 7. First Practice Session -> 8. Complete & Bell Synthesis -> 9. Garden Intro|
+-----------------------------------------------------------------------------------------------------+
```

### Stage 1: Welcome & Value Pitch
*   **User Action:** Opens FlowZen for the first time.
*   **System Response:** Initiates a silent, fade-in transition displaying a clean, warm-white canvas centered on a soft-pink lotus flower. Displays the title **FlowZen** in a spacious serif font, accompanied by a quiet tagline: *"A somatic sanctuary for spinal length, joint mobility, and mental grounding."*
*   **User Emotion:** Curiosity, immediate visual calm.
*   **Potential Problems:** Slow load times or flickering graphics.
*   **Success Criteria:** Splash animations load smoothly within 600ms.

### Stage 2: Value Presentation
*   **User Action:** Clicks "Commence Journey."
*   **System Response:** Displays three beautiful, minimal illustrations explaining the core tenets:
    1.  *Restorative Movement:* Gentle Tai Chi forms that relieve desk-bound physical tightness.
    2.  *Breathing Pacing:* Diaphragmatic chimes that regulate the nervous system.
    3.  *Nurtured Progress:* Your practice minutes grow a beautiful, private virtual garden.
*   **User Emotion:** Hopeful, unhurried.
*   **Potential Problems:** Heavy blocks of reading text.
*   **Success Criteria:** Bullet copy is kept under 15 words per slide.

### Stage 3: Requesting Frame Permissions
*   **User Action:** Progresses past the value slides.
*   **System Response:** Shows a quiet prompt requesting optional notifications: *"May we send gentle chimes to remind you to breathe and stand? You can silence them at any time."* No alert boxes are launched until the user clicks "Allow."
*   **User Emotion:** Respected, in full control of their focus.
*   **Success Criteria:** Users can decline without being locked out or shamed.

### Stage 4: Authentic Account Choice
*   **User Action:** Clicks "Continue to Sanctuary."
*   **System Response:** Displays three clear, equal-weight entry options:
    *   *Try as Guest:* No password required. Data is cached locally.
    *   *Secure with Google:* Standard popup authentication.
    *   *Secure with Email:* Simple, minimal form field.
*   **User Emotion:** Safe and unpressured.
*   **Success Criteria:** Guest mode logs the user in instantly with a single touch.

### Stage 5: Somatic Assessment
*   **User Action:** Enters their name and begins the personal curation questionnaire.
*   **System Response:** Presents four quick, beautiful screens assessing their physical parameters:
    1.  *Primary Path Focus:* Options for Joint Lubrication, Grounding & Balance, Anxiety & Stress, Postures, or Deep Rest.
    2.  *Stance Experience:* Beginner, Intermediate, or Advanced.
    3.  *Daily Time Target:* Slider default set to 10 Minutes.
    4.  *Postural Limitations:* Optional checklist (Knee flexion tension, stiff shoulders, lower back tightness).
*   **User Emotion:** Heard and valued; feels they are building a customized program.
*   **Potential Problems:** Long, clinical dropdown lists.
*   **Success Criteria:** Entire flow is completed in under 45 seconds.

### Stage 6: AI-Curation and First Recommendation
*   **User Action:** Completes the final assessment step.
*   **System Response:** Animates a subtle, breathing radial ring with a message: *"Nurturing your somatic path..."* Instantly displays their first personalized posture recommendation (e.g., "Wave Hands Like Clouds" for desk tightness) alongside its specific benefits.
*   **User Emotion:** Excited, motivated, and supported.
*   **Success Criteria:** Recommendations are generated and rendered in under 1.5 seconds.

### Stage 7: First Somatic Practice
*   **User Action:** Clicks "Begin Commencing Form."
*   **System Response:** Launches the Session Player. Displays the front-view skeletal model, starting a gentle 30-second joint warmup. The voice coach says: *"Let your heels sink deep. Allow your shoulders to widen."*
*   **User Emotion:** Somatically engaged, breathing slowly, physically focused.
*   **Potential Problems:** User feels confused by left-right direction patterns.
*   **Success Criteria:** Mirror mode and speed controls are instantly visible and responsive.

### Stage 8: Journey Integration (First Reward)
*   **User Action:** Completes the final cooldown step.
*   **System Response:** Automatically plays a beautiful, 3-second long-ringing chime synthesized locally. Transitions to a peaceful completion screen displaying the **Noble Crane** achievement badge.
*   **User Emotion:** Relaxed, satisfied, and physically light.
*   **Success Criteria:** The local Web Audio synth plays perfectly without popping or static.

### Stage 9: First Zen Garden Interaction
*   **User Action:** Returns to the Home Dashboard.
*   **System Response:** Automatically scrolls the view to reveal their brand-new, empty Zen Garden. A single, small stone path fades in, accompanied by a soft tooltip: *"Your first minutes have laid down gravel paths. Continue your practice tomorrow to nurture your garden."*
*   **User Emotion:** Intrisically rewarded, looking forward to returning.
*   **Success Criteria:** The user completes onboarding, practices, and enters their dashboard within a single, highly polished, friction-free session.

---

## 3. Daily Practice Journey

```
+-----------------------------------------------------------------------------------------------------+
|                                DAILY PRACTICE JOURNEY SEQUENCE                                      |
+-----------------------------------------------------------------------------------------------------+
| 1. Morning Cue -> 2. Energy Check-in -> 3. Personalized Dashboard -> 4. Warmup -> 5. Active Postures|
| 6. Cooldown -> 7. Somatic Note Logging -> 8. Garden Growth -> 9. Closing Bell & Offline Sync        |
+-----------------------------------------------------------------------------------------------------+
```

### 1. Morning Opening Cue
The user receives a quiet morning notification: *"The morning mist is clearing. Take 5 minutes to ground your stance and mobilize your joints."* The user taps the notification.

### 2. Physical & Emotional Diagnostic
FlowZen opens directly to the Grounding Diagnostics panel. The user slides their Energy State to 6 (Moderately Fatigued) and selects "Stiff" and "Tired."

### 3. Customized Dashboard Review
The dashboard instantly filters its options, recommending **Commencing the Form (Qi Flow)**—a gentle, 5-minute routine requiring minimal posture bending. The user views their weekly goal progress ring, which is currently at 40%.

### 4. Practice Room Entrance & Setup
The user taps the recommendation, entering the practice room. They adjust the playback speed to **0.75x** to match their fatigued state and toggle **Mirror Mode** on so they can copy the model's movements.

### 5. Joint Loosening Warmup
A 60-second warmup begins. The user is instructed to gently twist their waist and let their arms swing like heavy ropes, tapping their lower back to stimulate energy flow.

### 6. Flow Posture Practice
The session transitions to the main postures. The user tracks the slow, waving skeletal lines. They read the focused coaching tip displayed on-screen: *"Keep your hips tucked. Protect your lower back."* A soft, rhythmic chime guides each inhale and exhale.

### 7. Breath Sinking Cooldown
The active movement ends. The user is guided to place their hands over their lower belly (Dantian) for 60 seconds, closing their eyes and feeling their breathing sink into their heels.

### 8. Mindful Somatic Reflection
The session ends. The user rates their mental grounding as 4/5 (Mindful & Relaxed). They type a quick note in their journal: *"Hips felt tight at the start, but after the second posture, my lower back completely released."*

### 9. Garden Integration & Exit
The user returns to their Zen Garden. They watch their stone lantern illuminate with a soft, warm glow, fueled by the minutes they just practiced. They exit the app feeling grounded and ready for the day.

---

## 4. Returning User Journey (Retention Dynamics)

```
                       [ PRACTICE HABIT MATURATION ]
                                     
Day 1              Day 7              Day 30             Day 100+
(Onboarding)       (Introduction)     (Integration)      (Mastery)
+------------------+------------------+------------------+------------------+
| Learn foundations| Earn Silver Lotus| Custom Postures  | Complete Forms   |
| First sand path  | Stone lantern    | Flowering Cherry | Golden Koi fish  |
| Simple warmup    | Joint recovery   | Weekly Heatmaps  | Yearly summaries |
+------------------+------------------+------------------+------------------+
```

### Day 2: Continuity Encouragement
*   **Focus:** Reduce barrier to entry.
*   **The Experience:** When the user returns on Day 2, the AI Coach greets them warmly: *"Welcome back, [Name]. Consistency is like water carving stone—gentle, persistent, and transformative. Let's do a simple 4-minute movement today."*
*   **Rewards:** The second practice adds a small bamboo shoot to their Zen Garden.

### Day 7: Establishing the Habit Loop
*   **Focus:** Active exploration.
*   **The Experience:** The user has logged 4 sessions. The AI Coach highlights their progress: *"You have nurtured your spine for 20 minutes this week. Your joints are learning to flow."*
*   **Rewards:** The user unlocks the **Silver Lotus** badge and placements for **Stone Lanterns** in their Zen Garden.

### Day 30: Somatic Integration
*   **Focus:** Personalized adaptation and physical insights.
*   **The Experience:** The user has practiced consistently. FlowZen processes their monthly notes and renders a postural heatmap, illustrating which areas of their body have been prioritized. The AI Coach suggests custom focus paths based on their journal entries.
*   **Rewards:** The user’s Zen Garden flourishes with a **Flowering Cherry Blossom Tree**.

### Day 100+: Somatic Mastery
*   **Focus:** Deep, lifelong autonomous wellness.
*   **The Experience:** The user has unlocked all foundational levels and moves with intuitive coordination. They use the AI Coach to dive deep into advanced alignment theories, design custom routines, and export their quarterly progress reports for their physical therapist.
*   **Rewards:** A fully completed garden sanctuary featuring a **Wooden Arch Bridge** and **Swimming Golden Koi Fish**.

---

## 5. Missed Practice Recovery Journey (Guilt-Free Re-entry)

Many health applications lose users permanently after a missed day due to high-pressure "streak broken" notifications that trigger negative emotions. FlowZen actively reframes the recovery experience.

```
+----------------------------------------------------------------------------------------------------+
|                               GUILT-FREE RE-ENTRY FLOW                                             |
+----------------------------------------------------------------------------------------------------+
| 1. User returns -> 2. Greeting (No guilt) -> 3. Soft Diagnostic check-in -> 4. Gentle suggestions  |
+----------------------------------------------------------------------------------------------------+
```

### Scenario A: 1-Day Absence
*   **Somatic Perspective:** A one-day pause is an essential part of muscle recovery and rest.
*   **The Experience:** The app displays no warnings or broken streak icons. The AI Coach greets them calmly: *"Welcome back. Let's return to our posture today with a quiet, unhurried form. Sinking your weight into the ground is the fastest way to find your center again."*

### Scenario B: 1-Week Absence
*   **Somatic Perspective:** The body has likely returned to sedentary tension patterns.
*   **The Experience:** The user’s previous streak is stored quietly as a "High-Water Mark," keeping their history intact. The AI Coach provides a supportive, gentle re-entry: *"Your body has enjoyed a week of rest. Let's begin today with a soft, joint-loosening warm-up to release any physical stiffness that has settled in."*

### Scenario C: 1-Month Absence
*   **Somatic Perspective:** The user is likely feeling guilty or disconnected from the practice.
*   **The Experience:** When the app opens, the Zen Garden is shown in "Quiet Twilight Mode"—its growth is preserved, but the colors are soft and muted. The AI Coach welcomes them back without pressure: *"Welcome home. The path remains open, exactly as you left it. There is no need to catch up or rush. Let's spend just 3 minutes breathing together today."* Practicing for 3 minutes immediately restores the garden's vibrant colors.

---

## 6. Beginner-to-Master Progression Journey

We define progression through physical coordinate control and mindfulness integration, rather than arbitrary points or levels:

### Level 1: Complete Beginner (The Rooted Stance)
*   **Focus:** Foot stability, balance, and basic joint loosening.
*   **Key Movements:** *Commencing the Form*, *Qi Rising*.
*   **Somatic Skills Learned:** Sinking weight into the heels, keeping knees soft, and relaxing the shoulders.
*   **Garden State:** A simple gravel path with small rocks.

### Level 2: Beginner (The Fluid Waist)
*   **Focus:** Torso twisting, continuous arm transitions, and simple balance shifts.
*   **Key Movements:** *Wave Hands Like Clouds*, *Parting the Wild Horse’s Mane*.
*   **Somatic Skills Learned:** Initiating movement from the hips, coordinating hands with waist rotation, and synchronized belly breathing.
*   **Garden State:** Unlocks stone lanterns and bamboo shoots.

### Level 3: Intermediate (The Integrated Flow)
*   **Focus:** Continuous transitions, variable stances, and dynamic weight shifts.
*   **Key Movements:** *Brush Knee and Step Forward*, *Single Whip*.
*   **Somatic Skills Learned:** Transferring 100% of body weight to a single leg, maintaining continuous movement without pauses, and utilizing the breath to lead movement.
*   **Garden State:** Unlocks flowering cherry blossom trees and stone bridges.

### Level 4: Advanced (The Unified Energy)
*   **Focus:** Eccentric muscle control, deep postures, and complete somatic mind-body integration.
*   **Key Movements:** *The Golden Rooster Stands on One Leg*, *Sinking the Qi*.
*   **Somatic Skills Learned:** Moving with absolute continuous elasticity, relaxing the chest, and maintaining core alignment during deep lower-body stances.
*   **Garden State:** Unlocks koi ponds, dynamic weather systems, and night modes.

### Level 5: Master (The Lifelong Sanctuary)
*   **Focus:** Autonomous, custom-paced practices, somatic reflection, and lifestyle integration.
*   **Key Movements:** Customized traditional 10-form and 24-form routines.
*   **Somatic Skills Learned:** Flowing instinctively without guidance, utilizing movement to instantly regulate stress, and guiding others with clarity.
*   **Garden State:** Fully mature, emotional sanctuary.

---

## 7. AI Coach Conversation Journeys

The AI Coach leverages the Google GenAI SDK to process user inputs and deliver personalized, safe, and actionable physical advice.

### Journey A: "My back feels stiff."
*   **User Input:** *"I woke up with terrible lower back stiffness from sitting too long yesterday."*
*   **AI Coach Reasoning:** The user is experiencing tightness in their lumbar spine and hips. I should recommend a gentle, standing twist to release compression, while warning them to avoid deep bending or over-arching.
*   **AI Coach Recommendation:** *"I hear you. Long sitting can lock our lower back. Let's try 'Wave Hands Like Clouds'. Focus on keeping your knees soft and rotating gently from your waist. Let your arms hang loose. Do not force the twist—allow the movement to flow naturally within your comfort range."*
*   **Safety Considerations:** Proactively warn against twisting past pain points or forcing the spine.

### Journey B: "I only have 5 minutes."
*   **User Input:** *"I'm in a huge rush between meetings but need to calm my brain down. I only have 5 minutes."*
*   **AI Coach Reasoning:** The user is experiencing high cognitive stress and time pressure. They need an instant, high-yield routine that requires minimal setup.
*   **AI Coach Recommendation:** *"Let's take a quick 4-minute pause. I recommend our 'Commencing Form' breathing routine. We will do 1 minute of joint loosening followed by 3 minutes of synchronized rising breath. It will ground your body and calm your nervous system, leaving you ready for your next call."*
*   **Safety Considerations:** Emphasize that quality of movement and breathing is far more important than completing a long sequence.

### Journey C: "I am stressed."
*   **User Input:** *"My anxiety is through the roof today. I feel jittery and can't focus."*
*   **AI Coach Reasoning:** The user's sympathetic nervous system is highly active. They need slow, rhythmic, low-impact movements with prolonged exhalations to stimulate the vagus nerve and restore a sense of calm.
*   **AI Coach Recommendation:** *"Take a slow, deep breath in... and let it sink all the way down to your heels. Let's flow through our 'Sinking the Qi' breathing form. Focus on matching your hands rising with your inhale, and letting them float down with a long, slow exhale. We will move at a very slow pace to help calm your mind."*
*   **Safety Considerations:** Encourage slow, gentle movements and remind them to keep their jaw and shoulders relaxed.

---

## 8. Health and Somatic Improvement Journey

```
                        [ PROGRESS TIMELINE ]
                                     
Week 1             Week 2             Month 1            Month 3+
+------------------+------------------+------------------+------------------+
| Release spinal   | Build habit      | Lower muscle     | Posture changes  |
| compression      | consistency      | stiffness        | Improved balance |
| Calmer mind      | Diaphragmatic    | Reduced daily    | Lower baseline   |
|                  | breathing        | stress levels    | anxiety          |
+------------------+------------------+------------------+------------------+
```

### Week 1: Spinal Decompression
*   **Physical:** Relief of superficial muscle tension in the upper back, shoulders, and neck.
*   **Mental:** Immediate post-session drop in subjective stress and heart rate.
*   **Habit:** User completes onboarding, learns basic controls, and logs their first 3 practices.

### Week 2: Diaphragmatic Integration
*   **Physical:** Improved breathing coordination, soft-knee stance stability, and hip flexibility.
*   **Mental:** Reduced daily mental chatter; user begins using the breathing chimes to calm down during work breaks.
*   **Habit:** Practice routine becomes integrated into their morning or midday schedule.

### Month 1: Musculoskeletal Loosening
*   **Physical:** Decreased lumbar stiffness and improved joint range of motion in the ankles and hips.
*   **Mental:** Improved sleep quality and lower baseline daily stress levels.
*   **Habit:** Zen Garden is noticeably growing, reinforcing their commitment.

### Month 3: Autonomic Nervous System Regulation
*   **Physical:** Noticeable improvements in posture and walking balance; reduced pain from old repetitive strain injuries.
*   **Mental:** A resilient, grounded mindset; decreased overall anxiety.
*   **Habit:** FlowZen is now a natural, daily habit, completed without effort.

---

## 9. Zen Garden Progression and Evolution

The Zen Garden serves as a beautiful, visual metaphor for the user's journey of inner calm and consistency:

```
                  [ GARDEN ASSET UNLOCK TIMELINE ]
                                     
Empty Gravel       Smooth Pebbles     Stone Lantern      Bridge & Koi Pond
(0 Mins)           (50 Mins)          (150 Mins)         (400+ Mins)
+------------------+------------------+------------------+------------------+
| Dry white sand   | Smooth pathways  | Soft amber glow  | Flowering cherry |
| Simple borders   | Border borders   | Night weather    | Koi fish swim    |
|                  |                  |                  | Soft rain sounds |
+------------------+------------------+------------------+------------------+
```

### 1. The Beginning (0 Minutes Practiced)
*   **Visual State:** A simple, quiet grid of dry white sand bordered by minimalist cedar wood.
*   **Emotional Meaning:** An empty canvas, representing a calm mind and a fresh, unwritten start.

### 2. The Path (50 Minutes Practiced)
*   **Visual State:** Hand-raked sand patterns and smooth river pebbles appear, creating paths.
*   **Emotional Meaning:** The user has taken their first steps, establishing a consistent direction and routine.

### 3. The Light (150 Minutes Practiced)
*   **Visual State:** A beautiful, hand-carved traditional Stone Lantern is placed at the center of the path, glowing with a soft amber light. Unlocks Night Mode.
*   **Emotional Meaning:** The practice has become a guiding light, helping them navigate daily stress with clarity and calm.

### 4. The Sanctuary (400+ Minutes Practiced)
*   **Visual State:** Flowering cherry blossom trees begin to grow, shedding soft-pink petals onto a small wooden bridge over a quiet koi pond. Golden koi fish swim gracefully in the water.
*   **Emotional Meaning:** The practice is now a mature, deeply integrated, and beautiful personal sanctuary, reflecting a life of balance, mindfulness, and calm.

---

## 10. Ethical Subscription Journey

FlowZen respects its users' cognitive and financial boundaries, utilizing an ethical, non-manipulative subscription model:

```
+----------------------------------------------------------------------------------------------------+
|                                ETHICAL UPGRADE TOUCHPOINTS                                         |
+----------------------------------------------------------------------------------------------------+
| 1. Clear free access -> 2. Premium values shown -> 3. Soft suggestions -> 4. Transparent trial     |
+----------------------------------------------------------------------------------------------------+
```

### Free-Tier Boundaries
*   Free users enjoy complete, uncapped access to foundational postures (e.g., *Commencing the Form*, *Wave Hands Like Clouds*), basic breathing routines, the progress calendar, and the initial, gravel-path stage of the Zen Garden.
*   **Ethical Commitment:** Free access is never crippled by ads, constant popups, countdown barriers, or artificial limits on fundamental wellness tools.

### Premium Value Touchpoints
*   **Touchpoint 1 (Advanced Content Preview):** While browsing the Practice Library, premium postures (e.g., *Sinking the Qi*, *The Golden Rooster*) are displayed with a subtle, elegant gold accent. Selecting them opens a beautiful, unhurried description card explaining the posture's history and benefits, with a quiet option to try Premium.
*   **Touchpoint 2 (Garden Expansion):** In the Zen Garden, locked premium assets (like the Koi Pond or Cherry Blossom Tree) are displayed as soft, ghosted-out silhouettes. Hovering over them shows a peaceful description of the element and how it can be unlocked with Premium.
*   **Touchpoint 3 (AI Coach Dialogue):** If a free user asks the AI Coach a complex, multi-layered question that requires advanced AI capabilities, the coach answers the first part with full depth, and then gently explains how Premium unlocks uncapped daily coaching.

---

## 11. Edge Cases and Resilience Strategies

### I. Offline Use (Zero Network Connectivity)
*   **Risk:** The user tries to practice on a plane, in a park, or in an area with poor signal, resulting in a blank screen or a loading freeze.
*   **FlowZen Strategy:**
    *   The core session player, anatomical skeletal models, and text steps operate entirely client-side.
    *   Warmup and cooldown chimes are synthesized in real-time using local Web Audio, requiring no network connection or media streaming.
    *   Practice history is cached locally and automatically synced with the cloud database once internet connectivity is restored.

### II. Account Transition (Guest to Registered)
*   **Risk:** A guest user who has practiced for weeks decides to create an account, but their hard-earned progress and Zen Garden states are lost during the registration.
*   **FlowZen Strategy:**
    *   Upon registration, the app's local storage cache is verified.
    *   If guest logs exist, they are automatically merged into the user's new cloud profile, and the user is greeted with a supportive message: *"Your practice history and Zen Garden have been successfully synchronized with your new account."*

### III. System-wide Accessibility Scaling
*   **Risk:** A user selects Extra Large text, causing words to overlap, buttons to hide, or labels to get cut off.
*   **FlowZen Strategy:**
    *   All containers utilize flexible CSS grids and responsive Tailwind classes.
    *   When the text scales, container cards grow proportionally, ensuring all text remains fully readable and buttons remain clickable.

### IV. Stopping App Usage (Somatic Preservation)
*   **Risk:** The user stops practicing for months due to life interruptions.
*   **FlowZen Strategy:**
    *   We do not spam the user with reminders or notifications.
    *   Their garden remains preserved exactly as they left it. When they return, they are greeted with warmth, and their progress is resumed without pressure or guilt.

---

## 12. User Flow Diagrams

### I. Onboarding & Personalization Flow
```
[User Opens App] ---> [Animated Welcome Screen] ---> [Value Presentation]
                                                             |
                                                             v
[Select Guest / Sign In] <--- [Notification Permission] <----/
          |
          v
[Name Input] ---> [Select focus area] ---> [Select Stance Level] ---> [Select Time Target]
                                                                                |
                                                                                v
[Personalized Home Dashboard] <--- [AI Posture Curation] <--- [Accessibility scaling]
```

### II. Daily Practice Loop
```
[Home Dashboard] ---> [Review recommendation] ---> [Open Practice Room]
                                                            |
                                                            v
[Start Cooldown] <--- [Execute Postures] <--- [Loosening Warmup] <--- [Adjust Speed/Mirror]
        |
        v
[Mindfulness Rating] ---> [Log Somatic Note] ---> [Garden Grows] ---> [Dashboard Exit]
```

---

## 13. UX Strategy Success Criteria

### FTUE & Assessment Setup
*   **User Goal:** Understand FlowZen's unique value and complete their personal assessment without stress.
*   **Business Goal:** Achieve an onboarding completion rate higher than 85%.
*   **Technical Requirement:** Onboarding steps must render and transition within 250ms at 60 FPS.
*   **Measurement Method:** Track drop-off percentages for each step of the onboarding flow.

### Daily Practice Retention
*   **User Goal:** Complete their daily practice and feel physically lighter and mentally calmer.
*   **Business Goal:** Target a Day-30 retention rate higher than 40%.
*   **Technical Requirement:** The interactive skeletal models must render smoothly on all mobile and desktop devices.
*   **Measurement Method:** Monitor daily active practice metrics and user-logged consistency charts.

### AI Coach Support
*   **User Goal:** Receive safe, compassionate, and personalized physical modifications.
*   **Business Goal:** Encourage user exploration of specialized posture pathways.
*   **Technical Requirement:** AI Coach responses must be delivered through secure proxy routes with low latency.
*   **Measurement Method:** Measure daily interactions with the AI Coach and analyze the helpfulness ratings of its recommendations.

---

## Product Vision & PRD Alignment Verification

- [x] **Every major feature has a user journey:** Complete pathways specified for onboarding, daily players, garden growth, and the AI Coach.
- [x] **No user experience gaps exist:** Guilt-free recovery paths, offline sync boundaries, and accessibility parameters are fully detailed.
- [x] **Journeys are realistic:** Technical constraints like Web Audio synthesis, browser caching, and responsive container grids are respected.
- [x] **Developers can implement them:** Specific states, actions, and logic flows are outlined with technical clarity.
- [x] **QA can test them:** Clear success metrics and acceptance guidelines are provided for each step of the journey.
