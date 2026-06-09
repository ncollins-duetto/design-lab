# PR: Standalone Apps Workflow

## Context

The UX repo previously only supported one prototype workflow: adding routes inside the `design-lab/` Next.js app. This works well for component-accurate prototypes but creates friction for standalone HTML/CSS/JS prototypes, which are faster to build and better suited for interaction-rich experiments.

This PR introduces a fully parallel workflow for standalone prototypes — with the same Vercel preview and directory listing experience as the existing mock-app path.

---

## What changed

### New: `standalone-apps/` folder
A dedicated home for standalone prototypes at the repo root, separate from the Next.js app. Each prototype lives in its own subfolder with an `index.html` and a `metadata.json` describing it.

- `standalone-apps/CLAUDE.md` — full instructions for the standalone workflow
- `standalone-apps/_template/` — copy this to start a new prototype
- `standalone-apps/manage-rates-rpos/` — first prototype using this workflow (Manage Rates RPOs)

### New: `design-lab/scripts/sync-standalone.js`
A build script that runs automatically before `npm run dev` and `npm run build`. It:
1. Copies `standalone-apps/` → `design-lab/public/standalone-apps/` so Next.js can serve the files
2. Generates `design-lab/lib/standalone-generated.ts` from each folder's `metadata.json`, including git commit timestamps for sort order

Both outputs are git-ignored — the script is the source of truth.

### Updated: `design-lab/package.json`
`dev` and `build` scripts now prepend `node scripts/sync-standalone.js` so the sync runs automatically with no manual step required.

### Updated: `design-lab/app/page.tsx`
The directory landing page now merges both `PROJECTS` (mock-app routes) and `STANDALONE_PROJECTS` (from the generated file) into a single sorted list. Standalone prototypes display a subtle "Standalone" badge on their card.

### Updated: `design-lab/lib/folders.ts`
Added an optional `type?: 'mock-app' | 'standalone'` field to the `Project` type to support the badge and any future filtering.

### Updated: `.gitignore`
Added `design-lab/public/standalone-apps/` and `design-lab/lib/standalone-generated.ts` (both auto-generated) plus `.DS_Store`.

### Updated: `README.md`
Rewritten to document both workflows side by side with a comparison table.

### Updated: `design-lab/CLAUDE.md`
Project structure section updated to reflect new files and annotate what's auto-generated.

---

## Designer workflow going forward

```
1. Create standalone-apps/my-prototype/ with index.html + metadata.json
2. Preview locally — just open index.html in a browser
3. Push branch → Vercel auto-deploys
4. Prototype appears in the directory at /standalone-apps/my-prototype/
5. Open PR to merge to main when ready
```

No changes to `lib/folders.ts` or any shared app file needed.

---

## What this doesn't change

- The existing mock-app workflow is completely untouched
- No new Vercel project or config needed — same single deployment
- Protected files (`layout.tsx`, `AppShell.tsx`, `globals.css`, `lib/mock/types.ts`) not modified
