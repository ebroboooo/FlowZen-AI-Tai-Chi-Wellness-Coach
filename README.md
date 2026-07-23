# FlowZen — AI Somatic Tai Chi & Living Garden Sanctuary

FlowZen is an AI-powered somatic Tai Chi, Qigong, and physical mindfulness application that integrates real-time skeletal pose guidance, ambient elemental soundscapes, an evolving Zen living garden sanctuary, and a comprehensive somatic mastery progression system.

---

## 📚 Complete Project Documentation

All architectural, feature status, development progress, and handoff documentation is strictly maintained inside [`/docs`](./docs):

- **[01_PROJECT_OVERVIEW.md](./docs/01_PROJECT_OVERVIEW.md)** — Product vision, goals, target users, major features, and technology stack.
- **[02_ARCHITECTURE.md](./docs/02_ARCHITECTURE.md)** — Folder structure, data flow, state management, AI architecture, and canvas rendering pipelines.
- **[03_FEATURE_STATUS.md](./docs/03_FEATURE_STATUS.md)** — Feature status tracking matrix across all applet modules.
- **[04_DEVELOPMENT_PROGRESS.md](./docs/04_DEVELOPMENT_PROGRESS.md)** — Chronological append-only development log.
- **[05_PENDING_TASKS.md](./docs/05_PENDING_TASKS.md)** — Prioritized roadmap and TODO list (Critical, High, Medium, Low).
- **[06_AI_HANDOFF.md](./docs/06_AI_HANDOFF.md)** — Complete context and guidelines for any AI or developer joining the project.
- **[07_CHANGELOG.md](./docs/07_CHANGELOG.md)** — Semantic versioning changelog history.
- **[08_TEST_STATUS.md](./docs/08_TEST_STATUS.md)** — Vitest test suite breakdown and pass status (42/42 tests passing).
- **[09_KNOWN_ISSUES.md](./docs/09_KNOWN_ISSUES.md)** — Troubleshooting and addressed browser/environment notes.
- **[10_AI_RULES.md](./docs/10_AI_RULES.md)** — Permanent project rules, coding standards, and handoff requirements.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Type Checking & Linting
```bash
npm run lint
```

### Unit Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Frontend Core**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Motion (`motion/react`)
- **State Management**: Zustand v5
- **AI Engine**: Google GenAI SDK (`@google/genai`) with Gemini
- **Database & Sync**: Firebase Firestore & Auth
- **PWA**: `vite-plugin-pwa`
- **Testing**: Vitest with JSDOM
