# Duetto Design Lab — AI Instructions

This is the shared environment for UX prototypes built by the Duetto UX Design team.
Read this before generating any code.

## What this is

A Next.js 16 app that mirrors the real Duetto frontend stack as closely as possible, so
prototypes are useful to developers, not just designers.

**Real frontend reference:** `/Users/nylecollins/dev/duetto-frontend/src/`
Check it when you need to understand how a real component works or what a GQL type looks like.

---

## Stack rules — follow these exactly

| Concern | Use | Do NOT use |
|---|---|---|
| Components | `@material-ui/core` v4 | shadcn, Radix, Headless UI, custom divs for buttons/inputs |
| Icons | `@material-ui/icons` | Inline SVGs, Heroicons, Lucide |
| Tables / data grids | `ag-grid-react` | Custom table implementations |
| Theming | `ThemeProvider` + `duettoTheme2026` from `@duetto/duetto-components` | Hardcoded color values, CSS variables |
| Styling | MUI `makeStyles` or `sx` prop | Tailwind, CSS modules, inline `style` objects |
| Color tokens | `color2026` from `@duetto/duetto-components` | Hardcoded hex values |
| State | React `useState` + Context | Redux, Zustand, or other libraries |
| Data fetching | None — use mock data from `lib/mock/` | Real API calls, GraphQL, SWR, React Query |
| Fonts | Already set in `app/layout.tsx` (Lato via Google Fonts) | Importing fonts yourself |
| Page router | Next.js App Router (`app/` directory) | Pages router (`pages/` directory) |

---

## Project structure

```
design-lab/
├── app/
│   ├── layout.tsx          ← DO NOT EDIT — theme and font providers live here
│   ├── globals.css         ← DO NOT EDIT — minimal reset only
│   ├── page.tsx            ← replace with your prototype landing page
│   └── your-feature/      ← add new routes as folders here
├── components/
│   ├── AppShell.tsx        ← DO NOT EDIT — shared nav/header wrapper
│   └── your-components/   ← add prototype-specific components here
├── lib/
│   └── mock/
│       ├── types.ts        ← GQL-mirroring types — extend, don't reinvent
│       ├── properties.ts   ← shared property/group mock data
│       ├── index.ts        ← barrel — add new files here
│       └── your-data.ts   ← add domain-specific mock data here
└── public/
    └── duetto-logo.svg
```

**Protected files** (require maintainer review to change):
`app/layout.tsx`, `app/globals.css`, `components/AppShell.tsx`, `lib/mock/types.ts`

---

## How to add a new prototype page

1. Create `app/your-feature/page.tsx`
2. Wrap content in `<AppShell>` — pass `activeNav`, `breadcrumbs`, and `propertyLabel` props
3. Add any mock data to `lib/mock/your-data.ts` and re-export from `lib/mock/index.ts`
4. Use MUI components for all UI; import icons from `@material-ui/icons`
5. For tables, use `AgGridReact` from `ag-grid-react`

### AppShell props

```tsx
<AppShell
  activeNav="pricing-strategy"     // highlights the correct nav item
  breadcrumbs={[
    { label: 'Pricing & Strategy', href: '/' },
    { label: 'Manage Rates' },      // last item has no href = current page
  ]}
  propertyLabel="All Properties"   // shown in the property picker stub
>
  {/* your page content */}
</AppShell>
```

`activeNav` values: `home` | `advance` | `pricing-strategy` | `scoreboard` | `command-center`

---

## Mock data rules

- All mock data lives in `lib/mock/`
- Types in `lib/mock/types.ts` must mirror real GQL types from `duetto-frontend/src/generated/`
  — copy only the fields you actually use
- Property/group data comes from `lib/mock/properties.ts` — don't create new hotel lists elsewhere
- Add feature-specific data in a new file (e.g. `lib/mock/rates.ts`) and export from `index.ts`
- Use realistic data: real currency, plausible rates, European hotel names
  (see existing `properties.ts` for the established set)

---

## AG Grid setup

```tsx
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

// In component:
<div className="ag-theme-alpine" style={{ height: 400 }}>
  <AgGridReact
    rowData={rows}
    columnDefs={colDefs}
  />
</div>
```

The real app uses AG Grid Enterprise — community is sufficient for prototypes.
Enterprise features to avoid: rowGrouping, pivoting, server-side row model.
Community features to use freely: sorting, filtering, custom cell renderers, sticky headers.

---

## MUI theming

`duettoTheme2026` is applied at the root. Access it in components via `makeStyles`:

```tsx
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  myElement: {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
}))
```

For color tokens not in the MUI palette, import `color2026`:

```tsx
import { color2026 } from '@duetto/duetto-components'
// color2026.text.link, color2026.dataTable.rowHover, etc.
```

---

## Working with the real codebase

When you need to understand how a real page or component works:

- **Real components:** `duetto-frontend/src/components/`
- **Real page containers:** `duetto-frontend/src/containers/`
- **GQL types:** `duetto-frontend/src/generated/`
- **Real theme:** `duetto-frontend/src/core/styles/themes.ts`
- **SmartTable (AG Grid wrapper):** `duetto-frontend/src/components/SmartTable/`

Prototypes should match the *behaviour and data shape* of the real app, not copy its internal
implementation. The goal is something a developer can look at and immediately map to their code.

---

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000
```

Requires `artifactory_npm_auth_token` env var to be set (already in `.zshrc` on Duetto machines).

## Branch and deploy workflow

Every branch gets its own Vercel preview URL automatically on push — no manual deploy needed.

1. Create a branch: `designer/your-name/feature-name` (e.g. `designer/nyle/metrics-management`)
2. Push your work: `git push origin your-branch`
3. Vercel posts a preview URL as a GitHub PR check — share that URL for feedback and testing
4. When work is approved, open a PR and merge to `main`
5. `main` auto-deploys to the canonical design-lab URL

**Never push directly to `main`** — branch protection is enabled.
Changes to protected files require maintainer approval (see CODEOWNERS).
