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

A collection of self-contained HTML prototypes. Each lives in its own folder and is served as a
static file by Next.js via the `public/standalone-apps/` path (populated automatically at build/dev time).

Use this workflow when:
- Your prototype is interaction-rich and easier to build in plain HTML/CSS/JS
- You need to experiment with UI patterns that don't map to existing components
- You want to iterate fast without the Next.js stack overhead

Standalone prototypes should still align visually with the Duetto design system — start from a
clean Figma file using the correct tokens and components before writing code.

---

## Folder structure

```
standalone-apps/
├── CLAUDE.md               ← this file
├── _template/              ← copy this to start a new prototype
│   ├── index.html
│   └── metadata.json
└── your-prototype/
    ├── index.html          ← entry point (required)
    ├── metadata.json       ← required for directory listing
    └── (any other assets)
```

---

## How to add a new standalone prototype

1. Copy `_template/` to a new folder: `cp -r _template/ your-prototype-name/`
2. Edit `metadata.json` with your prototype's details (see below)
3. Build your prototype in `index.html`
4. Preview locally by opening `index.html` directly in your browser
5. Push your branch — the sync script runs automatically at build time and your prototype
   appears in the design-lab directory at `/standalone-apps/your-prototype-name/`

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

Open your `index.html` directly in a browser — no server needed. If your prototype references
other local files (CSS, JS, images), keep them in the same folder and use relative paths.

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
- Do not make real API calls — use hardcoded mock data in your HTML file
