# Duetto Design Lab — AI Instructions

Always invoke /designer-prototype at the start of any session in this project.

This is the shared environment for UX prototypes built by the Duetto UX Design team.
Read this before generating any code.

## Before doing anything else

Run `git branch --show-current` and check the result.

- If the current branch is `main`: **stop immediately**. Do not write or edit any code. Tell the designer:
  > "You're on the main branch. Please create your own branch before we start — run this in your terminal:
  > `git checkout -b designer/your-name/feature-name`
  > Then let me know when you're ready."
  Wait for them to confirm they've switched branches before proceeding.

- If the current branch is a designer branch (e.g. `designer/nyle/feature-name`): confirm it to the designer and continue normally.

## What this is

A Next.js 16 app that mirrors the real Duetto frontend stack as closely as possible, so
prototypes are useful to developers, not just designers.

**Real frontend reference:** `~/dev/duetto-frontend/src/`
Each designer should have the real frontend cloned at this path:
```bash
gh repo clone duettoresearch/duetto-frontend ~/dev/duetto-frontend
```
Check it when you need to understand how a real component works or what a GQL type looks like.

---

## Stack rules — follow these exactly

| Concern | Use | Do NOT use |
|---|---|---|
| Components | `@material-ui/core` v4 | shadcn, Radix, Headless UI, custom divs for buttons/inputs |
| Icons | `@material-ui/icons` | Inline SVGs, Heroicons, Lucide |
| Tables / data grids | `ag-grid-react` | Custom table implementations |
| Theming | `ThemeProvider` + `duettoTheme2026` from `@duetto/duetto-components` | Hardcoded color values, CSS variables |
| Styling | MUI `makeStyles` | Tailwind, CSS modules, inline `style` objects, `sx` prop |
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

**Why layout.tsx and globals.css look empty:**
`layout.tsx` only contains the `ThemeProvider` and font setup — that's intentional. The MUI
theme (`duettoTheme2026`) handles all colors, spacing, and typography. There's nothing left
for globals.css to do except a basic box-sizing reset. Do not add Tailwind, CSS variables,
or custom styles to either file — use `makeStyles` or the `sx` prop instead.

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
- Types in `lib/mock/types.ts` must mirror real GQL types from `~/dev/duetto-frontend/src/generated/`
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

- **Real components:** `~/dev/duetto-frontend/src/components/`
- **Real page containers:** `~/dev/duetto-frontend/src/containers/`
- **GQL types:** `~/dev/duetto-frontend/src/generated/`
- **Real theme:** `~/dev/duetto-frontend/src/core/styles/themes.ts`
- **SmartTable (AG Grid wrapper):** `~/dev/duetto-frontend/src/components/SmartTable/`

Prototypes should match the *behaviour and data shape* of the real app, not copy its internal
implementation. The goal is something a developer can look at and immediately map to their code.

### Duetto Code Intelligence

The **Duetto Code Intelligence** MCP indexes both `duetto-frontend` and `duetto-shared-javascript`.
Use it before writing any component — it surfaces real prop interfaces, import paths, and
architectural patterns that aren't visible in Figma or the file tree.

```
# Find real examples of the component/pattern you're building
smart_query("show me a real page component using FormPage in duetto-frontend")

# Verify props and import paths
search_code("FormPageHeader props interface")
```

Query Code Intelligence first, then check `~/dev/duetto-frontend/src/` directly if needed.
The `/duetto-design-system` skill formalises this workflow — invoke it for any UI component work.

---

## Running and deploying

**For active development — run locally:**
```bash
npm install
npm run dev   # http://localhost:3000
```
Use this when iterating with Claude or Cursor. Hot reload means you see changes instantly
without waiting for a deploy. Requires `artifactory_npm_auth_token` in your `.zshrc`
(standard on all Duetto machines).

**For sharing — use Vercel branch previews:**
Every push to a branch automatically deploys a preview URL. No manual deploy command needed.
Share that URL for stakeholder feedback, customer testing, or team review.

## Branch and deploy workflow

1. Create a branch: `designer/your-name/feature-name` (e.g. `designer/nyle/metrics-management`)
2. Develop locally: `npm run dev`
3. Push your work: `git push origin your-branch`
4. Vercel posts a preview URL as a GitHub PR check — share it for feedback and testing
5. When approved, open a PR and merge to `main`
6. `main` auto-deploys to the canonical design-lab URL

**Never push directly to `main`** — branch protection is enabled.
Changes to protected files require maintainer approval (see CODEOWNERS).
