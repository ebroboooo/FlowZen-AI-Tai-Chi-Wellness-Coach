# FlowZen — Permanent AI Coding Rules

> **CRITICAL MANDATE**: Any AI model or developer contributing to this repository MUST strictly follow these rules.

## Core Rules

1. **Never Rewrite Working Systems**
   - Preserve existing architectures, canvas rendering layers, audio engines, and store structures.
   - Do NOT rewrite or replace existing working code unless explicitly instructed by the user.

2. **Always Inspect Before Modifying**
   - Call `view_file` to inspect the exact lines before editing any file. Never assume file content.

3. **Always Minimize Breaking Changes**
   - Implement features incrementally.
   - Ensure all edits maintain zero regression breakage across the applet.

4. **Preserve Architecture & Folder Conventions**
   - Place components in `src/components/`, stores in `src/store/`, utilities in `src/utils/`, types in `src/types/`, and tests in `src/tests/`.
   - Use Tailwind CSS v4 utility classes. Do not create separate `.css` files.

5. **Keep TypeScript Strict**
   - Maintain strict typing. Avoid using `any` unless required for dynamic mock objects in unit tests.

6. **Never Remove Documentation**
   - Documentation inside `/docs` and `README.md` must be maintained and updated. Never delete documentation files.

7. **Always Update Documentation After EVERY Completed Task**
   - Before completing a task, always update:
     - `04_DEVELOPMENT_PROGRESS.md`
     - `03_FEATURE_STATUS.md`
     - `07_CHANGELOG.md`
     - `06_AI_HANDOFF.md`
   - Leave the repository in a clean, handoff-ready state with all tests passing (`npm run lint` and `npm test`).
