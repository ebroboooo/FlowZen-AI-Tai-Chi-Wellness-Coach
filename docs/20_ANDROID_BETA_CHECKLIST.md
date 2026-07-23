# FlowZen Android Beta Release & Capacitor Readiness Checklist

**Document ID:** `20_ANDROID_BETA_CHECKLIST`  
**App ID:** `com.flowzen.app`  
**App Name:** FlowZen  
**Version:** `0.1.0-beta.1` (Version Code: 1)  
**Target Platform:** Android (Google Play Closed Beta)  

---

## 1. Capacitor Configuration & Readiness Review

| Parameter | Configured Value | Status | Validation Note |
|---|---|---|---|
| **App ID** | `com.flowzen.app` | **VERIFIED** | Valid reverse domain namespace for Google Play Store. |
| **App Name** | `FlowZen` | **VERIFIED** | Matches store listing and launcher title. |
| **Web Directory** | `dist` | **VERIFIED** | Aligns with Vite production build output directory. |
| **Android Scheme** | `https` | **VERIFIED** | Standard HTTPS scheme prevents CORS and mixed-content issues in Android WebView. |
| **Build Output** | Single-page HTML5/JS | **VERIFIED** | Validated via `npm run build` with zero bundling errors. |

---

## 2. Minimal Android Project Setup Commands

Since the `android/` native container directory is generated dynamically during native packaging, run the following sequential commands in a local Android environment:

```bash
# Step 1: Install Capacitor Android dependency (if not present)
npm install @capacitor/android

# Step 2: Build production web bundle
npm run build

# Step 3: Add Android platform target (creates /android folder)
npx cap add android

# Step 4: Sync web assets & configuration to native android folder
npx cap sync android

# Step 5: Open Android Studio to build & sign the release AAB
npx cap open android
```

---

## 3. Mobile & WebView Compatibility Audit

### Safe Areas & Viewport
- **Meta Tag:** `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />` configured in `index.html`.
- **CSS Handling:** Padding accommodates top notch and bottom gesture bar via `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.

### Status Bar & Theme Color
- **Theme Color:** `#faf8f5` (Light sanctuary neutral canvas) configured in `index.html`.
- **Status Bar Style:** Blends naturally with top headers across light and dark cards.

### Touch Interactions & Target Sizes
- **Touch Targets:** All primary buttons, tab bar items, and interactive garden elements meet or exceed 44px x 44px touch guidelines.
- **Pinch-to-zoom:** Disabled via `user-scalable=no` to prevent accidental viewport shifts during interactive Tai Chi practice or canvas tapping.

### Canvas & Particle Performance
- **HTML5 Canvas Engine:** Utilizes dynamic hardware acceleration and adaptive particle density (32 particles on mobile screens, 75 on desktop).
- **FPS Stability:** Smooth 60 FPS animation loops managed via `requestAnimationFrame` with proper cancellation on component unmount.

### Audio Systems & Web Audio API
- **Web Audio Synthesis:** Soundscapes (wind, water, rain, chimes) initialize lazily and resume `AudioContext` on first user touch gesture, satisfying mobile browser autoplay policies.
- **Microphone / Media Permissions:** Not required. Zero native audio recording or camera permissions needed for beta release.

### Offline Resilience
- **Core Practice Player:** 100% functional without network connection.
- **Living Garden Canvas:** Renders and calculates growth XP completely offline using `localStorage`.
- **AI Companion:** Features built-in offline reflection generators when server API calls are unavailable.

---

## 4. Google Play Store Technical Requirements

### Target & Minimum SDK
- **Target SDK Version:** SDK 34 (Android 14+) - Fully compliant with Google Play 2024 target API requirement.
- **Min SDK Version:** SDK 22 (Android 5.1 Lollipop+) - Covers > 99.5% of active Android devices worldwide.

### App Bundle (.aab) Generation
To build the signed release bundle in Android Studio or command line:

```bash
cd android
./gradlew bundleRelease
```
The output artifact will be generated at `android/app/build/outputs/bundle/release/app-release.aab`.

### App Signing Config (`android/app/build.gradle`)
Ensure release signing is configured using a generated release keystore:

```groovy
android {
    defaultConfig {
        applicationId "com.flowzen.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "0.1.0-beta.1"
    }
    signingConfigs {
        release {
            storeFile file("release-key.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 5. Release Action Plan & Checklist

### Completed Items
- [x] Verified `capacitor.config.ts` configuration (`com.flowzen.app`, `webDir: dist`, `https` scheme).
- [x] Configured `package.json` versioning (`0.1.0-beta.1`).
- [x] Configured `index.html` viewport meta tags and theme color.
- [x] Implemented React Error Boundary for root crash recovery (`src/components/ErrorBoundary.tsx`).
- [x] Added privacy-first local analytics event tracking (`src/utils/analytics.ts`).
- [x] Verified zero TypeScript or linter errors (`npm run lint`).
- [x] Verified clean production web bundle creation (`npm run build`).

### Remaining Developer Actions (Local Machine)
- [ ] Run `npx cap add android` on local machine with Android SDK installed.
- [ ] Generate production keystore (`keytool -genkey -v -keystore release-key.keystore ...`).
- [ ] Execute `./gradlew bundleRelease` to generate `app-release.aab`.
- [ ] Upload `app-release.aab` to Google Play Console Closed Beta track.
- [ ] Complete Content Rating Questionnaire & Privacy Policy URL in Play Console.
