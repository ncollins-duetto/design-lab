# Duetto Design Lab

Shared environment for UX prototypes built by the Duetto design team.

## How it works

All prototypes live as routes within the same Next.js app in [`design-lab/`](design-lab/).
Every branch gets its own Vercel preview URL automatically on push.
`main` is the canonical approved state.

## Getting started

```bash
gh repo clone duettoresearch/UX
cd UX/design-lab
npm install
npm run dev   # http://localhost:3000
```

See [`design-lab/CLAUDE.md`](design-lab/CLAUDE.md) for full instructions — including how to add pages, use mock data, and deploy.

### Vercel (required for deploys)

Vercel uses `ARTIFACTORY_NPM_AUTH_TOKEN` (Production + Preview) with the shared CI pull token — not your personal `artifactory_npm_auth_token` from `.zshrc`.

## Branch workflow

1. Create a branch: `designer/your-name/feature-name`
2. Push — Vercel auto-deploys a preview URL
3. Share the URL for feedback
4. Open a PR when ready to merge to `main`

Protected files (layout, AppShell, tokens) require maintainer review before merge.

## Who to ask

Questions → @nylecollins
