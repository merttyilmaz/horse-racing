# Horse Racing Game

An interactive horse racing game built with Vue 3, TypeScript, Vuex, Vite, and Tailwind CSS.

**Live demo:** [horse-racing-alpha.vercel.app](https://horse-racing-alpha.vercel.app/)

## Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — strict mode
- **Vuex 4** — state management
- **vue-i18n 11** — internationalisation (EN / TR)
- **Tailwind CSS 4** — styling via `@tailwindcss/vite`
- **Vite 7** — build tool
- **Vitest** — unit tests
- **Playwright** — E2E tests

## Getting Started

```bash
pnpm install
pnpm dev
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server at `http://localhost:5173` |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e` | Run E2E tests (Playwright) |

## Project Structure

```
src/
├── main.ts
├── App.vue
├── i18n.ts               # vue-i18n plugin instance (browser language detection)
├── types/
│   └── index.ts          # Shared TypeScript interfaces
├── store/
│   └── index.ts          # Vuex store (state, mutations, actions, getters)
├── utils/
│   ├── horseUtils.ts     # Horse generation helpers
│   └── scheduleUtils.ts  # Race schedule & simulation helpers
├── locales/
│   ├── en.ts             # English strings
│   └── tr.ts             # Turkish strings
├── composables/
│   └── useTheme.ts       # Dark/light theme toggle with localStorage persistence
├── components/
│   ├── AppHeader.vue     # Generate / Start / Pause / Resume / language & theme toggles
│   ├── HorseList.vue     # Left panel — all 20 horses
│   ├── RaceTrack.vue     # Center — animated race lanes
│   ├── ProgramPanel.vue  # Right top — 6-round schedule
│   └── ResultsPanel.vue  # Right bottom — sequential results
└── __tests__/
    ├── horseUtils.test.ts
    ├── scheduleUtils.test.ts
    ├── store.test.ts
    ├── useTheme.test.ts
    └── i18n.test.ts

e2e/
└── horseRacing.spec.ts   # Playwright E2E tests
```

## How to Play

1. Click **Generate Program** to create a 6-round race schedule (10 random horses per round)
2. Click **Start / Pause** to begin the race
3. Watch horses animate across the track — each round runs automatically
4. Results appear in the Results panel as each round finishes
5. After all 6 rounds, click **New Race** to reset

## Theme

The app supports **dark and light mode** via the sun/moon toggle button in the header.

- Defaults to your OS `prefers-color-scheme` setting on first visit
- Preference is saved to `localStorage` and restored on reload
- Implemented with Tailwind CSS v4's class-based `dark:` variant — the `.dark` class is toggled on `<html>`

## Internationalisation

The app supports **English and Turkish** via the `EN | TR` toggle button in the header.

- Auto-detects browser language on first visit (`tr-*` → Turkish, everything else → English)
- Switching language updates all UI strings instantly with no page reload
- Implemented with vue-i18n 11 in Composition API mode (`legacy: false`)
- Locale files live in `src/locales/en.ts` and `src/locales/tr.ts`
