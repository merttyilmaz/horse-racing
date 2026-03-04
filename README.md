# Horse Racing Game

An interactive horse racing game built with Vue 3, TypeScript, Vuex, Vite, and Tailwind CSS.

## Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — strict mode
- **Vuex 4** — state management
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
├── types/
│   └── index.ts          # Shared TypeScript interfaces
├── store/
│   └── index.ts          # Vuex store (state, mutations, actions, getters)
├── utils/
│   ├── horseUtils.ts     # Horse generation helpers
│   └── scheduleUtils.ts  # Race schedule & simulation helpers
├── components/
│   ├── AppHeader.vue     # Generate / Start / Pause / Resume buttons
│   ├── HorseList.vue     # Left panel — all 20 horses
│   ├── RaceTrack.vue     # Center — animated race lanes
│   ├── ProgramPanel.vue  # Right top — 6-round schedule
│   └── ResultsPanel.vue  # Right bottom — sequential results
└── __tests__/
    ├── horseUtils.test.ts
    ├── scheduleUtils.test.ts
    └── store.test.ts

e2e/
└── horseRacing.spec.ts   # Playwright E2E tests
```

## How to Play

1. Click **Generate Program** to create a 6-round race schedule (10 random horses per round)
2. Click **Start / Pause** to begin the race
3. Watch horses animate across the track — each round runs automatically
4. Results appear in the Results panel as each round finishes
5. After all 6 rounds, click **New Race** to reset
