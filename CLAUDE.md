# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (runs tsx server.ts, not vite directly)
npm run build      # Vite client build + esbuild server bundle → dist/
npm run start      # Run production build (node dist/server.cjs)
npm run preview    # Preview the Vite production build locally
npm run lint       # TypeScript type-check only (tsc --noEmit, no eslint)
npm run clean      # Remove dist/
```

There are no tests. `npm run lint` is the only static check available.

## Architecture

### Dual-process setup
`npm run dev` runs `server.ts` (Express + tsx), which spins up Vite in middleware mode. There is **no separate `vite dev` command** — the entry point is always `server.ts`. In production, the Express server serves `dist/` statically.

The Express server (`server.ts`) handles one real route: `POST /api/webhook/kofi` — a Ko-fi donation webhook that writes to the `supporters` Supabase table using the service role key (bypasses RLS).

### File layout
All source files live flat in the project root — there is no `src/` directory. Components, types, CSS, images, and the entry point all coexist at the root level.

Static assets (images) must be in `public/` to be served at root-relative URLs on Vercel. Files referenced via string URLs like `"/image.png"` require `public/image.png` to exist. The map image (`map.jpg`) is imported as an ES module in `MapCanvas.tsx` and is handled by Vite's asset pipeline instead.

### Supabase
Single client instance exported from `supabaseClient.ts`. Env vars are `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (must have `VITE_` prefix to be exposed to the browser by Vite). The server uses `SUPABASE_SERVICE_ROLE_KEY` for the Ko-fi webhook.

Supabase tables in use: `profiles` (user accounts, upserted on signup), `supporters` (Ko-fi donations).

### Component loading strategy
Heavy modals are lazy-loaded in `App.tsx` via `React.lazy` + `Suspense`: `SupportersSidebar`, `EcosystemSettings`, `AuthModal`, `DonateModal`, `CharactersModal`, `NewsModal`, `ComingSoonModal`, `NewsletterModal`.

Always-visible components are static imports: `MapCanvas`, `SmartDrawingToolbar`, `ViceDreamBackground`, `LaunchCountdown`, `UserBubble`.

### Map
Uses `react-leaflet` v5 with `react-leaflet-cluster` for marker clustering. The map renders a custom image overlay (`map.jpg`) using Leaflet's `ImageOverlay`. Drawing tools (freehand, shapes, measurement) are implemented with Leaflet event handlers in `MapCanvas.tsx` — no dedicated drawing library. The map state (active tool, color, drawing count) lives in `App.tsx` and is passed down as props.

### Styling
Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` — configured via `@theme` block in `index.css`). Heavy use of custom CSS classes in `index.css` alongside Tailwind utilities. No component library.

### Import paths
All imports between project files use relative paths from the root (e.g., `./MapCanvas`, `./supabaseClient`). There is a `@/*` alias pointing to the root in both `tsconfig.json` and `vite.config.ts`, but existing code uses `./` not `@/`.
