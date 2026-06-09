# Duetto Design Lab

Shared environment for UX prototypes built by the Duetto design team.

Two workflows are supported — pick the one that fits your prototype:

| | Mock App | Standalone (static) | Standalone (Vite) |
|---|---|---|---|
| **Location** | `design-lab/app/your-feature/` | `standalone-apps/your-prototype/` | `standalone-apps/your-prototype/` |
| **Format** | React + Next.js (MUI, AG Grid) | Plain HTML/CSS/JS | React + Vite + TypeScript |
| **Best for** | High-fidelity, component-accurate prototypes | Interaction-rich, fast-iteration experiments | Complex interactions needing React/npm packages |
| **Directory listing** | Automatic | Automatic (via `metadata.json`) | Automatic (via `metadata.json`) |
| **Vercel preview** | Auto on push | Auto on push | Auto on push (built by sync script) |

Both workflows share a single Vercel deployment and a single directory landing page.

---

## Mock App workflow

All mock-app prototypes live as routes within the Next.js app in [`design-lab/`](design-lab/).

```bash
gh repo clone duettoresearch/UX
cd UX/design-lab
npm install
npm run dev   # http://localhost:3000
```

See [`design-lab/CLAUDE.md`](design-lab/CLAUDE.md) for full instructions — including how to add pages, use mock data, and deploy.

---

## Standalone App workflow

Standalone prototypes live in [`standalone-apps/`](standalone-apps/). Two formats are supported:

### Static (plain HTML/CSS/JS)

```bash
gh repo clone duettoresearch/UX
# Copy the template to a new folder
cp -r standalone-apps/_template standalone-apps/your-prototype-name
# Edit metadata.json and index.html
# Preview locally by opening index.html in your browser
```

### Vite-based (React + TypeScript)

> **Prefer the static format when possible.** Every Vite prototype adds an `npm install` + `npm run build` step that runs on every Vercel deployment. One app is fine, but as more accumulate the build time grows — Vercel has a 45-minute build limit, and a slow build means everyone on the team waits longer for their preview URLs. If you can achieve the same result in plain HTML, do that instead. Use the Vite format only when your prototype genuinely needs React, npm packages, or a multi-file component structure that would be impractical to inline.

```bash
gh repo clone duettoresearch/UX
# Scaffold a new Vite app inside standalone-apps/
npm create vite@latest standalone-apps/your-prototype-name -- --template react-ts
# Add metadata.json at the root of the new folder (see standalone-apps/CLAUDE.md)
# Preview locally
cd standalone-apps/your-prototype-name && npm install && npm run dev
```

At build/dev time, `scripts/sync-standalone.js` automatically handles both formats:
- **Static:** copies the folder directly into `design-lab/public/standalone-apps/`
- **Vite:** detects `package.json`, runs `npm install` (skipped if `node_modules` is up to date) and `npm run build`, then copies the `dist/` output
- Generates `design-lab/lib/standalone-generated.ts` so all prototypes appear in the directory

`dist/` and `node_modules/` inside standalone app folders are git-ignored — never commit them.

See [`standalone-apps/CLAUDE.md`](standalone-apps/CLAUDE.md) for full instructions.

---

## Branch workflow (both)

1. Create a branch: `designer/your-name/feature-name`
2. Push — Vercel auto-deploys a preview URL
3. Share the URL for feedback
4. Open a PR when ready to merge to `main`

Protected files (layout, AppShell, tokens) require maintainer review before merge.

### Vercel (required for deploys)

Vercel uses `ARTIFACTORY_NPM_AUTH_TOKEN` (Production + Preview) with the shared CI pull token — not your personal `artifactory_npm_auth_token` from `.zshrc`.

---

## Who to ask

Questions → @nylecollins
