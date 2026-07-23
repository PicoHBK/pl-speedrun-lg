# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then produce a production build in `dist/`
- `npm run lint` — run ESLint over the repo
- `npm run preview` — serve the built `dist/` locally

There is no test runner configured in this project.

## Architecture

Single-page React 19 + TypeScript + Vite app that renders a speedrun league leaderboard ("Liga de Speedruns"). UI text and domain identifiers are in Spanish (`juego`, `jugador`, `runner`, `tiempo`, `puntos`).

**Data source is a public Google Sheet, fetched client-side at runtime.** There is no backend. `src/page/core/SpeedrunLeague.tsx` fetches two sheet tabs by hardcoded `SHEET_ID` / `GID` via the `.../export?format=csv&gid=...` URL, parses them, and holds all app state. Changing the data means editing the sheet, not the code. A cache-busting `&t=Date.now()` param is appended to every fetch.

**Parsing lives entirely in `src/page/utils/utils.ts`** and is positional/fragile by design — it depends on the sheet's exact layout:
- `parseCSV` → `SheetData`: player names come from row index 2 starting at column 5; each subsequent row (from index 3) is a game, column 0 = image, column 1 = name, columns 5+ = per-player times. Times of `"0:00:00"` are treated as "no run". Runners are sorted ascending by seconds; fastest gets `esRecord`. Classic points (`jugadores`) = one point per game a player holds the record for.
- `parseSheet3` → dynamic content tabs (`{ boton, contenido, img?, fechaFin? }`), rendered by `TabsContenido`. `contenido` is Markdown (`react-markdown`). Uses a separate multiline-aware CSV parser (`parseCSVMultiline`) because tab content may contain newlines inside quotes.

**Two scoring systems coexist:**
- *Clásica* (`LeaderboardDialog`): points from `parseCSV` — record holder gets 1 point.
- *Beta* (`LeaderboardBeta`): recomputed from `juegos` via `calcularJugadoresBeta`. Base points = `min(10, ceil(totalRunners / posicion))`, multiplied by a per-game multiplier parsed from a `[x.x]` suffix in the game name (`extraerMultiplicador`). Keep this logic intact unless explicitly asked to change scoring.

**Component layers under `src/page/`:**
- `core/` — the single stateful container (`SpeedrunLeague`), owns fetch + all dialog/filter state.
- `feature/` — presentational features (cards, dialogs, search, tabs, queue widget), driven by props. `cards/` holds reusable row/card subcomponents.
- `landing/types/types.ts` — shared domain types (`Juego`, `Jugador`, `RunnerTiempo`, `SheetData`).
- `utils/utils.ts` — all sheet parsing and time conversion.

## Conventions

- Path alias `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- shadcn/ui (`components.json`, style `radix-nova`, base color neutral) generates into `src/components/ui`; utils alias is `@/lib/utils` (`cn` = clsx + tailwind-merge). Icons: lucide-react.
- Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config`; theme lives in `src/index.css`). Styling is heavily inline utility classes with a dark neon/cyberpunk aesthetic; some backgrounds use inline `style` gradients.
- Animations use `framer-motion`.
- TS config is strict-ish: `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax` are on — import types with `import type`.
