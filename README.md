# Duetto Design Lab

Shared environment for UX prototypes built by the Duetto design team.

Two workflows are supported — pick the one that fits your prototype:

| | Mock App | Standalone |
|---|---|---|
| **Location** | `design-lab/app/your-feature/` | `standalone-apps/your-prototype/` |
| **Format** | React + Next.js (MUI, AG Grid) | Plain HTML/CSS/JS |
| **Best for** | High-fidelity, component-accurate prototypes | Interaction-rich, fast-iteration experiments |
| **Directory listing** | Automatic | Automatic (via `metadata.json`) |
| **Vercel preview** | Auto on push | Auto on push |

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

Standalone prototypes live in [`standalone-apps/`](standalone-apps/) as self-contained HTML files.

```bash
gh repo clone duettoresearch/UX
# Copy the template to a new folder
cp -r standalone-apps/_template standalone-apps/your-prototype-name
# Edit metadata.json and index.html
# Preview locally by opening index.html in your browser
```

At build/dev time, `scripts/sync-standalone.js` automatically:
- Copies `standalone-apps/` into `design-lab/public/standalone-apps/`
- Generates `design-lab/lib/standalone-generated.ts` so prototypes appear in the directory

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
