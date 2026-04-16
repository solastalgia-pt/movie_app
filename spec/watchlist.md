# Watchlist Feature Spec

## Overview

Allow users to save movies and TV shows to a personal watchlist. The list persists across sessions and is accessible from a dedicated page.

---

## Requirements

### Functional

1. **Add to watchlist** — Any movie or TV card/detail page has a button to add that item to the watchlist.
2. **Remove from watchlist** — The same button toggles: if the item is already in the list, clicking removes it.
3. **Visual indicator** — The button shows a filled/active state when the item is already saved.
4. **Watchlist page** — A dedicated `/watchlist` route shows all saved items as a grid of `MovieCard`s.
5. **Empty state** — When the list is empty, show a friendly message with a link back to Home.
6. **Persistence** — The list survives page refresh (stored in `localStorage`).
7. **Category awareness** — Each saved item stores its `category` (`movie` or `tv`) so detail-page links work correctly.

### Non-functional

- No backend or login required — fully client-side.
- Works on both mobile (sidebar) and desktop (header nav).
- Respects the existing dark/light theme.

---

## Design Approach

### Data shape

Each watchlist entry mirrors the existing `IMovie` type plus a `category` field:

```ts
interface IWatchlistItem extends IMovie {
  category: "movie" | "tv";
}
```

### State management — React Context + localStorage

The app already uses React Context for global state (`globalContext`, `themeContext`). Follow the same pattern: create a `watchlistContext` that:

- Reads initial state from `localStorage` on mount.
- Writes to `localStorage` on every change.
- Exposes `watchlist`, `addToWatchlist`, `removeFromWatchlist`, and `isInWatchlist` to consumers.

This keeps things consistent with the rest of the codebase and avoids pulling in a new library.

### Where the toggle button lives

- **`MovieCard`** — Add a small bookmark icon in the top-left corner of the card (visible on hover, like the existing YouTube icon overlay). This covers both the Catalog grid and the Section sliders on Home.
- **`Detail` page** — Add a larger "Add to Watchlist / Remove" button alongside the existing info block.

Use `react-icons` (already installed) for the icon — `BsBookmark` (empty) and `BsBookmarkFill` (saved).

### Routing

Add a `/watchlist` route in `App.tsx` alongside the existing routes. Add a "watchlist" nav link to `constants/index.ts` so it appears in both the Header and Sidebar automatically.

---

## Recommended Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| State | React Context + `useState` | Already used in the project; no new dependency |
| Persistence | `localStorage` (via `useEffect`) | Simple, zero-dependency, survives refresh |
| Icon | `react-icons` (`BsBookmark`, `BsBookmarkFill`) | Already installed |
| Routing | React Router (existing) | Just add one more `<Route>` |

No new packages needed.

---

## Build Order (step-by-step, testable at each stage)

Build in this order so each step is independently testable in the browser before moving on.

### Step 1 — Context

Create `src/context/watchlistContext.tsx`.

- State: `watchlist: IWatchlistItem[]`
- On mount: read from `localStorage.getItem("watchlist")`, parse, set state.
- On change: write to `localStorage.setItem("watchlist", JSON.stringify(watchlist))`.
- Expose: `watchlist`, `addToWatchlist(item)`, `removeFromWatchlist(id)`, `isInWatchlist(id)`.

Wrap the app in `<WatchlistProvider>` inside `main.tsx` (same pattern as `GlobalContextProvider`).

**Test:** Open browser console, call `localStorage.getItem("watchlist")` — should return `null` (empty). No visual change yet.

---

### Step 2 — Watchlist page

Create `src/pages/Watchlist/index.tsx`.

- Import `useWatchlistContext`.
- Render saved items using the existing `MovieCard` component.
- Show an empty-state message when `watchlist.length === 0`.

Add the route in `App.tsx`:
```tsx
<Route path="/watchlist" element={<Watchlist />} />
```

Add the nav link in `constants/index.ts`:
```ts
{ title: "watchlist", path: "/watchlist", icon: BsBookmark }
```

**Test:** Navigate to `http://localhost:5173/watchlist` — should render the empty state.

---

### Step 3 — Toggle button on MovieCard

Add the bookmark toggle button to `src/common/MovieCard/index.tsx`.

- Call `isInWatchlist(id)` to determine icon state.
- On click: call `addToWatchlist` or `removeFromWatchlist`. Stop the click event from bubbling to the `<Link>` with `e.preventDefault() / e.stopPropagation()`.
- The button needs `category` to build the saved item — pass it down (it's already a prop on `MovieCard`).

**Test:** Click bookmark on a card → navigate to `/watchlist` → item appears. Click again → item disappears.

---

### Step 4 — Toggle button on Detail page

Add the same toggle button to `src/pages/Detail/index.tsx`.

- Render next to the title/genre block.
- Label the button "Add to Watchlist" / "Remove from Watchlist" for clarity (text + icon).

**Test:** Open a movie detail page, click the button → go to `/watchlist` → item is there. Refresh the page → item persists.

---

### Step 5 — Polish

- Confirm the bookmark icon appears in both Header (desktop) and Sidebar (mobile) nav.
- Confirm dark/light theme looks correct on the Watchlist page.
- Confirm item poster images load correctly on the Watchlist page (they use the same `MovieCard` + `Image` components, so this should be free).
