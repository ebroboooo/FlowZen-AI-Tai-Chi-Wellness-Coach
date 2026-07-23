# FlowZen — Known Issues & Troubleshooting

## Active Issues
*No active breaking bugs or failing unit tests.*

## Historical / Addressed Observations

### 1. Web Audio Context Suspended State in Browsers
- **Symptom**: Audio does not play immediately on page load in Chrome/Safari.
- **Root Cause**: Browsers require explicit user gesture (click/tap) before allowing `AudioContext` to resume.
- **Solution**: Handled gracefully in `audioPacer.ts` and `elementalSoundscape.ts` by invoking `ctx.resume()` inside click event handlers (`startPractice`, sound toggle button).
- **Status**: Resolved.

### 2. Firebase Config File Missing in Fresh Local Clones
- **Symptom**: Error importing `firebase-applet-config.json` when provisioning local isolated dev environments without Firebase setup.
- **Root Cause**: `firebase-applet-config.json` is generated dynamically by the setup tool.
- **Solution**: Implemented dynamic `import.meta.glob` check in `src/firebase/firebase.ts` with default fallback object values (`demo-api-key`, etc.).
- **Status**: Resolved.

### 3. JSDOM Global Environment Missing in Vitest
- **Symptom**: `ReferenceError: localStorage is not defined` or `window is not defined` during `npm test`.
- **Root Cause**: Default Vitest test runner executes in Node environment without DOM globals.
- **Solution**: Added `test: { environment: 'jsdom' }` to `vite.config.ts`.
- **Status**: Resolved.
