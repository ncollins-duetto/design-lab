# Duetto UX

Shared workspace for the Duetto UX/design team.

## Contents

- **[`prototype-template/`](prototype-template/)** — shared Next.js starter for all code prototypes.
  Clone and use this as the base for every new prototype. See [`prototype-template/CLAUDE.md`](prototype-template/CLAUDE.md) for full instructions.

## Setup

1. Clone this repo: `gh repo clone duettoresearch/UX`
2. Copy the template into a new folder for your prototype:
   ```bash
   cp -r prototype-template my-prototype
   cd my-prototype
   npm install
   npm run dev
   ```
3. Rename the project in `package.json` and start building.

## Branch workflow

- Branch naming: `designer/your-name/feature-name`
- Open a PR to merge back to `main`
- Protected files (layout, tokens, AppShell) require maintainer review

## Who to ask

Template questions → @nylecollins
