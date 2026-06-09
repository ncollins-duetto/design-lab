# Standalone Apps — AI Instructions

This folder houses standalone HTML/CSS/JS prototypes that live outside the Next.js design-lab app.
Read this before creating or editing anything here.

## Before doing anything else

Run `git branch --show-current` and check the result.

- If the current branch is `main`: **stop immediately**. Do not write or edit any code. Tell the designer:
  > "You're on the main branch. Please create your own branch before we start — run this in your terminal:
  > `git checkout -b designer/your-name/feature-name`
  > Then let me know when you're ready."
  Wait for them to confirm they've switched branches before proceeding.

- If the current branch is a designer branch (e.g. `designer/paulo/my-feature`): confirm it and continue.

---

## What this is

A collection of self-contained prototypes. Each lives in its own folder and is served by Next.js
via the `public/standalone-apps/` path (populated automatically at build/dev time).

Two formats are supported:

- **Static** — a single `index.html` with plain HTML/CSS/JS. No build step. Open directly in a browser.
- **Vite** — a React + TypeScript app with a `package.json`. Built automatically by the sync script before serving.

Use this workflow when:
- Your prototype is interaction-rich and easier to build outside the Next.js stack
- You need to experiment with UI patterns that don't map to existing components
- You want to iterate fast without the design-lab overhead

Use the Vite format when your prototype needs React, npm packages (e.g. dnd-kit, react-hook-form),
or a multi-file component structure that would be unwieldy in a single HTML file.

Standalone prototypes should still align visually with the Duetto design system — start from a
clean Figma file using the correct tokens and components before writing code.

---

## Folder structure

```
standalone-apps/
├── CLAUDE.md                  ← this file
├── _template/                 ← copy this to start a static prototype
│   ├── index.html
│   └── metadata.json
├── your-static-prototype/
│   ├── index.html             ← entry point (required)
│   ├── metadata.json          ← required for directory listing
│   └── (any other assets)
└── your-vite-prototype/
    ├── package.json           ← presence of this file triggers the Vite build path
    ├── metadata.json          ← required for directory listing (same format as static)
    ├── index.html             ← Vite entry point
    ├── vite.config.ts
    ├── src/
    └── (dist/ and node_modules/ are git-ignored — never commit them)
```

---

## How to add a new static prototype

1. Copy `_template/` to a new folder: `cp -r _template/ your-prototype-name/`
2. Edit `metadata.json` with your prototype's details (see below)
3. Build your prototype in `index.html`
4. Preview locally by opening `index.html` directly in your browser
5. Push your branch — the sync script runs automatically and your prototype appears in the
   design-lab directory at `/standalone-apps/your-prototype-name/`

## How to add a new Vite-based prototype

> **Prefer the static format.** Every Vite prototype adds an `npm install` + `npm run build` step to every Vercel deployment. One is fine, but each one added makes the build slower for the entire team. Vercel has a 45-minute build limit. Only use this format when the prototype genuinely needs React, npm packages, or a multi-file component structure that would be impractical in a single HTML file.

1. Scaffold a new Vite app: `npm create vite@latest your-prototype-name -- --template react-ts`
2. Add `metadata.json` at the root of the new folder (see spec below)
3. **Add `registry=https://registry.npmjs.org/` to `.npmrc`** — the repo root `.npmrc` is configured
   for the private Duetto npm registry, which requires auth credentials that aren't available in
   the context where the sync script runs. Standalone apps only use public npm packages, so pinning
   the registry here bypasses that auth entirely.
   ```
   registry=https://registry.npmjs.org/
   legacy-peer-deps=true
   ```
4. **Set `base: './'` in `vite.config.ts`** — this is required. Without it, the built asset paths
   are absolute and will 404 when served from `/standalone-apps/your-prototype-name/`. The sync
   script will refuse to build and exit with an error if this is missing.
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: './',
   })
   ```
4. **If using React Router, set `basename` on `BrowserRouter`** to match the subpath the app is
   served from. Without this, navigating between pages resets the URL to the domain root and breaks routing.
   ```tsx
   <BrowserRouter basename="/standalone-apps/your-prototype-name">
   ```
5. Preview locally: `cd your-prototype-name && npm install && npm run dev`
6. Push your branch — the sync script detects `package.json`, builds the app automatically,
   and your prototype appears in the design-lab directory at `/standalone-apps/your-prototype-name/`

---

## metadata.json spec

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Display name shown on the directory card |
| `team` | Yes | One of the team slugs below |
| `description` | Yes | Short description shown on the card (1–2 sentences) |
| `decoration` | Yes | Card visual style — see options below |
| `author` | Yes | Your first name or handle |

**Team slugs:** `strategy-team` · `onboarding-team` · `group` · `resorts` · `pricing` · `detection-exploration` · `special-projects`

**Decoration options:** `rates` · `sales-room` · `min-max` · `tour-operator`

---

## Local preview

**Static:** Open `index.html` directly in a browser — no server needed. Keep any referenced CSS, JS,
or images in the same folder and use relative paths.

**Vite:** Run `npm install && npm run dev` inside your prototype folder. Vite serves the app at
`http://localhost:5173` (or the next available port) with hot reload.

---

## Branch and deploy workflow

1. Create a branch: `designer/your-name/feature-name`
2. Build your prototype in `standalone-apps/your-prototype-name/`
3. Push — Vercel auto-deploys a preview. Your prototype is accessible at:
   `https://[branch-url].vercel.app/standalone-apps/your-prototype-name/`
   and appears as a card in the design-lab directory
4. Share the URL for feedback
5. Open a PR when ready to merge to `main`

---

## What NOT to do

- Do not edit `_template/` — it's the reference template for new prototypes
- Do not commit anything to `design-lab/public/standalone-apps/` — it's auto-generated and git-ignored
- Do not commit `design-lab/lib/standalone-generated.ts` — also auto-generated
- Do not commit `dist/` or `node_modules/` inside Vite prototype folders — both are git-ignored
- Do not make real API calls — use hardcoded mock data
