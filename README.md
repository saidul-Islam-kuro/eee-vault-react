# EEE Vault JSTU — React rebuild

A React + Vite rebuild of the EEE Vault question-bank/study-archive app. Same black/red
theme and the same features (course papers, notes, library, AI assistant, PDF export),
restructured into a proper multi-page app with a mobile-app-style bottom nav.

## What changed from the old single-file app

- **Rebuilt in React** (Vite + React Router) instead of one big `index.html` with inline
  scripts. Code is split into pages/components/hooks so it's actually maintainable.
- **Library and Notes are now their own pages**, reachable from a bottom tab bar (Home /
  Notes / Library), like a native app, instead of being buttons on every course card.
- **Notes page** is grouped by semester → course, same visual language as the paper
  grid, so it's obvious which notes belong to which course/semester.
- **Library page** adds a category filter alongside the search bar.
- **Session buttons** ("20-21", "21-22", …) got a more tactile press effect (depth
  shadow that collapses on press) and a clear available/missing state (red + file icon
  vs. grey + lock icon) — missing sessions/notes/course visuals are consistent across
  Home and Notes.
- **Viewer** (the full-screen paper reader) is now its own route (`/viewer/:code/:batch`)
  instead of a modal, so the back button/back-swipe on mobile does the right thing. It
  keeps pinch-to-zoom, double-tap zoom, the "compile to PDF" export, and the AI panel —
  all ported behavior-for-behavior from the original.
- **AI assistant** (Gemini / OpenRouter / local Ollama, multi-provider with quota
  tracking) is unchanged in behavior and uses the **same localStorage keys**, so if this
  is deployed to the same domain as the old app, people's saved API keys keep working.
- **PWA polish**: manifest with proper icons, safe-area padding for notched phones, and
  no-select/no-tap-highlight tuning so it feels like an installed app rather than a
  website — important since this is meant to be installed from the home screen /
  distributed via Play Store (as a TWA) rather than just opened in a browser tab.

## Project structure

```
src/
  components/   Layout, TopBar, BottomNav, CourseCard, SessionButton, modals, viewer bits
  pages/        Home.jsx, Notes.jsx, Library.jsx, ViewerPage.jsx
  hooks/        useVaultData, useAiProviders, usePinchZoom, useConfirmDialog
  lib/          aiProviders.js (provider/quota logic), pdfCompile.js, vault.js (helpers)
  context/      VaultDataContext (course/library data available to every route)
public/
  data.json     Course + library data (fetched at runtime — same shape as before)
  admin/        Decap CMS (unchanged backend, now also has a Library collection so you
                 can edit library books from the CMS, not just courses)
  manifest.json, icon-192.png, icon-512.png, apple-touch-icon.png
```

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

## Deploying

This is still a static site, so the existing GitHub + Vercel setup keeps working:

1. Push this project to the `KURO-RGBN/EEE-QUESTION-BANK-JSTU` repo (replacing the old
   files, or in a new branch first if you want to compare).
2. Vercel will run `npm run build` and serve `dist/`. `vercel.json` is already set up to
   rewrite all routes to `index.html` so `/notes`, `/library`, and `/viewer/...` work on
   direct load/refresh (not just client-side navigation), while `/admin`, `/data.json`,
   and everything in `public/` are still served as real files.
3. The Decap CMS admin at `/admin` is untouched — same GitHub backend, same
   `data.json`. It now also has a **Library** collection so you can add/edit reference
   books from the CMS instead of hand-editing JSON.

## Notes / things you'll probably want to do

- Replace `public/icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` with your
  real logo — these are placeholder icons in the same black/red style so the PWA install
  prompt and Play Store listing don't look unfinished, but they're generated, not your
  artwork.
- `admin/config.yml`'s `base_url` still points at `eeevaultjstu.vercel.app` — update it
  if the domain changes.
- The AI assistant still expects the person to bring their own Gemini/OpenRouter key or
  a local Ollama server — nothing changed there server-side, it's all client-side calls
  from the browser, same as before.
