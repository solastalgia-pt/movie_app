# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Type-check + production build (tsc && vite build)
npm run preview   # Serve the production build locally
```

There are no test scripts in this project.

## Environment

The app requires a `.env` file in the project root:

```
VITE_API_KEY=<tmdb-api-key>
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
```

Vite does not hot-reload `.env` changes — restart the dev server after editing it.

## Architecture

### Data fetching

All TMDB API calls go through a single RTK Query slice in `src/services/TMDB.ts`. It exposes two hooks:

- `useGetShowsQuery` — paginated lists, search, and similar-show queries. The `category` param is either `"movie"` or `"tv"` and maps directly to TMDB URL segments.
- `useGetShowQuery` — single item by ID, with `videos` and `credits` appended in one request.

The app uses `ApiProvider` (not `Provider` + `configureStore`) since there is no other Redux state.

### Global state

Two React contexts, both in `src/context/`:

- `globalContext` — controls the video trailer modal (`isModalOpen`, `videoId`, `getTrailerId`) and the mobile sidebar (`showSidebar`).
- `themeContext` — dark/light theme, persisted to `localStorage` under the key `"theme"`. Toggling adds/removes the `dark` class on `<html>` for Tailwind's dark mode.

### Routing

Four routes in `App.tsx`: `/` (Home), `/:category` (Catalog), `/:category/:id` (Detail), `*` (NotFound). All pages are lazy-loaded. The `category` segment is passed directly to TMDB API calls — valid values are `"movie"` and `"tv"`.

### Styling conventions

- Tailwind classes are composed using `cn()` from `src/utils/helper.ts`, which combines `clsx` + `tailwind-merge`.
- Shared Tailwind class strings (layout, typography) are exported as constants from `src/styles/index.ts` (e.g. `maxWidth`, `paragraph`, `mainHeading`).
- Dark mode uses Tailwind's `dark:` variant — classes like `dark:text-gray-300 text-gray-600`.

### Animations

All Framer Motion variants are centralised in the `useMotion` hook (`src/hooks/useMotion.ts`). It disables animations on mobile (`< 768px`) and when the user prefers reduced motion. Use `<m.div>` (from `LazyMotion` + `domAnimation`) rather than `<motion.div>`.

### Nav and sections

`src/constants/index.ts` is the single source of truth for nav links (`navLinks`) and home page sections (`sections`). Both the Header and Sidebar consume `navLinks` — adding an entry there adds it to both automatically.

### Common components

Reusable components live in `src/common/` and are exported from `src/common/index.ts`. The `Section` component fetches its own data via `useGetShowsQuery` and skips the query until it enters the viewport (`useInView` with a `420px` margin).

## Development practices

### Follow existing patterns

Before adding anything new, read the nearest existing example of the same thing:
- New context → read `globalContext.tsx` first
- New page → read an existing page and its lazy import in `App.tsx`
- New reusable component → export it from `src/common/index.ts`
- New nav link → add it to `src/constants/index.ts` (propagates to Header and Sidebar automatically)

### Testing each step

There are no automated tests. Instead, verify each step manually in the browser before moving on:
- Check the browser console for errors after every change
- Test both dark and light themes for any UI change
- Test mobile (narrow viewport) and desktop widths — the sidebar replaces the header nav on mobile
- After any `localStorage` change, verify persistence by refreshing the page

### Commit discipline

- Make one commit per logical step — don't bundle context setup, UI, and routing into a single commit
- Write descriptive commit messages that say what changed and why, not just what file was touched. Example: `add watchlist context with localStorage persistence` not `update context`

### Code quality

- Run `npm run build` before considering a feature done — it runs `tsc` and will catch type errors that the dev server tolerates
- Prefer updating existing types in `src/types.d.ts` over inline type definitions
- Keep new shared class strings in `src/styles/index.ts` rather than duplicating Tailwind strings across components
