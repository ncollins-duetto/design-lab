# How to Work With This Repo

A step-by-step guide for UX designers. No Git experience required.

---

## The mental model (read this first)

Think of this repo like a shared Google Drive folder that the whole design team uses. The difference is: if two people edit the same file at the same time, things break. To prevent that, Git gives everyone their own personal copy of the Drive to work in — called a **branch**. You do all your work on your branch, and when you're ready, you ask for it to be merged back into the shared version.

The other thing to know: every time you push your work to GitHub, Vercel automatically generates a **preview URL** for your prototype. That's the link you share with stakeholders, engineers, and your team. You never need to deploy anything manually.

---

## Before you start (one-time setup)

You only need to do this once. If you've already worked in this repo before, skip to the scenario that fits your situation.

### Step 1 — Authenticate with GitHub

This lets your machine talk to GitHub so you can push and pull code.

Open **Terminal** on your Mac (press `Cmd + Space`, type "Terminal", press Enter) and run this command to check if you're already set up:

```
gh auth status
```

- If you see your GitHub username and "Logged in to github.com" — you're good. Skip to Step 2.
- If you see an error or "not logged in" — run the following and follow the on-screen prompts:

```
gh auth login
```

When it asks, choose **GitHub.com**, then **HTTPS**, then **Login with a web browser**. A code will appear in your Terminal — copy it, press Enter, and it'll open GitHub in your browser where you paste the code to confirm.

### Step 2 — Clone the repo

"Cloning" means downloading your own local copy of the repo to your machine. You only do this once.

In Terminal, run:

```
gh repo clone duettoresearch/UX ~/Desktop/UX
```

This creates a folder called `UX` on your Desktop. That's your local copy of the repo.

### Step 3 — Open the repo in Claude Code Desktop

1. Open Claude Code Desktop
2. Click **Open Folder** (or press `Cmd + O`)
3. Navigate to your Desktop and select the `UX` folder
4. Click Open

### Step 4 — Allow Claude Code to run Git commands

The first time Claude Code tries to run a Git command on your behalf, it will show a permission prompt like:

> *"Allow Claude to run shell commands?"*

Click **Allow** (or **Always Allow** to avoid being asked again). Claude Code needs this permission to create branches, commit your work, and push to GitHub. Without it, none of the Git steps in this guide will work.

> **If you're using Cursor instead of Claude Code Desktop:** You'll manage Git through the Source Control panel in the left sidebar (the branch icon) — no permission prompt needed. **If you're using Terminal instead of Claude Code Desktop:** All commands below can be run as-is.

---

## Scenario A — Starting a new prototype from scratch

Use this when you're beginning a brand new prototype and have nothing built yet.

### 1. Make sure you're looking at the latest version

In Claude Code Desktop, open a new chat. Before typing anything, check the top of the window or the current folder shown in the interface — it should say `UX` (the repo folder you cloned earlier). If it's pointing to a different project, go to **File → Open Folder** and select your `UX` folder on the Desktop.

Then type:

> "Pull the latest changes from main"

Claude will run `git pull origin main` and update your local copy with anything the team has merged recently.

### 2. Create your branch

Type in the chat:

> "Create a new branch called designer/your-name/your-feature-name"

Replace `your-name` and `your-feature-name` with your actual name and something that describes your prototype. For example: `designer/paulo/advanced-costs-v2`.

Claude will create the branch and switch to it automatically. It'll confirm the name back to you — double-check it matches the pattern above.

> **If you're using Cursor instead of Claude Code Desktop:** Click the branch name in the bottom-left corner of the window (it probably says "main"). Select "Create new branch" and type the branch name.
>
> **If you're using Terminal instead of Claude Code Desktop:** Run `git checkout -b designer/your-name/your-feature-name`

**Why does the branch name format matter?** The repo is set up to recognize branches that start with `designer/` — and the CLAUDE.md instructions tell Claude to refuse to write code if you're on `main`. Stick to the pattern.

### 3. Create your prototype files

This depends on which type of prototype you're building. If you're not sure, check the [README](README.md) for a comparison. When in doubt, start with the standalone static format — it's the fastest to build and iterate on.

**For a standalone static prototype (plain HTML/CSS/JS) — recommended starting point:**

Type in the chat:

> "Copy the `standalone-apps/_template` folder and rename it to `standalone-apps/your-prototype-name`"

Then ask Claude to fill in the `metadata.json` for you:

> "Update the metadata.json in `standalone-apps/your-prototype-name` — the name is `Your Prototype Name`, team is `strategy-team`, description is `A short description`, decoration is `rates`, and author is `your-name`"

Valid team values: `strategy-team` · `onboarding-team` · `group` · `resorts` · `pricing` · `detection-exploration` · `special-projects`

Valid decoration values: `rates` · `sales-room` · `min-max` · `tour-operator`

Now build your prototype inside `index.html`. You can ask Claude to help you write the HTML and CSS — just describe what you're trying to build.

> **Note on Vite-based standalone prototypes:** If you're tempted to start a React/Vite standalone prototype from scratch, resist — use the static HTML template above instead. Every Vite prototype adds build time to every team deploy, and most prototypes don't actually need React for our team's purposes. If you're bringing in an existing Vite prototype you already built, see Scenario B.

**For a mock-app prototype (Next.js, uses Duetto components):**

Type in the chat:

> "Create a new page at `design-lab/app/your-feature/page.tsx` and register it in `design-lab/lib/folders.ts`"

Describe your prototype to Claude and it will scaffold the page using the correct stack (MUI components, AppShell wrapper, mock data from `lib/mock/`).

### 4. Preview your prototype locally

**Standalone static:** Just open `standalone-apps/your-prototype-name/index.html` directly in your browser. No server needed.

**Mock app:** In the chat, type:

> "Start the dev server"

Claude will run `npm install` and `npm run dev`. Once it's ready, open `http://localhost:3000` in your browser.

### 5. Commit your work

"Committing" is like saving a snapshot of your files with a label. You should do this regularly as you work — not just at the end.

In the chat, type:

> "Commit my changes with the message: [description of what you did so far in the prototype]"

Claude will stage your files and create the commit.

> **If you're using Cursor instead of Claude Code Desktop:** Click the branch icon in the left sidebar, write a message in the text field at the top, and click "Commit".
>
> **If you're using Terminal instead of Claude Code Desktop:** Run `git add .` then `git commit -m "your message here"`

### 6. Push to GitHub and get your preview URL

In the chat, type:

> "Push my branch to GitHub"

Claude will run `git push origin your-branch-name`. Within a minute or two, Vercel will build a preview and post a URL to your branch's GitHub page. To find it:

1. Go to [github.com/duettoresearch/UX](https://github.com/duettoresearch/UX)
2. Click on **Pull requests** → your branch, or click the **branches** dropdown and find your branch
3. Look for the Vercel check — click **Details** next to it to open the preview URL

> **If you're using Cursor instead of Claude Code Desktop:** Click the cloud/sync icon in the bottom-left status bar or use Source Control → "Push".
>
> **If you're using Terminal instead of Claude Code Desktop:** Run `git push origin your-branch-name` (the first time, add `-u`: `git push -u origin your-branch-name`)

### 7. Keep working and pushing

Continue building, committing (step 5), and pushing (step 6) as you work. Every push updates the preview URL — stakeholders can refresh it and see your latest changes.

### 8. Open a Pull Request when you're done

When your prototype is ready to be merged into the shared main version:

In the chat, type:

> "Open a pull request for my branch"

Or go to [github.com/duettoresearch/UX](https://github.com/duettoresearch/UX), click **Pull requests** → **New pull request**, select your branch, and submit. Add team members as reviewers before submitting.

---

## Scenario B — Adding a prototype you've already built

Use this when you've built something outside the repo and want to bring it in.

Steps 1 and 2 are identical to Scenario A (pull latest, create your branch). Come back here after you've done that.

### 3. Copy your files into the right place

Open Finder and drag your prototype files into the repo folder on your Desktop:

- If it's a standalone static HTML prototype: create a new folder inside `standalone-apps/` and drop your files in (e.g. `standalone-apps/my-prototype/`)
- If it's a Vite-based standalone prototype (React + TypeScript): copy your project folder into `standalone-apps/` and then tell Claude what you're doing — it will follow the repo's instructions to configure everything correctly:
  > "I'm adding an existing Vite prototype to `standalone-apps/your-prototype-name`. Please check and fix everything needed to make it work in this repo."
- If it's a mock-app prototype: your page file goes inside `design-lab/app/your-feature/`

### 4. Add a metadata.json (standalone only)

If you're adding a standalone prototype (either static or Vite), you need a `metadata.json` file in your prototype's root folder so it shows up on the design lab directory page. Ask Claude to create it:

> "Create a metadata.json in `standalone-apps/your-prototype-name` — the name is `Your Prototype Name`, team is `strategy-team`, description is `A short description`, decoration is `rates`, author is `your-name`"

Valid team values: `strategy-team` · `onboarding-team` · `group` · `resorts` · `pricing` · `detection-exploration` · `special-projects`

Valid decoration values: `rates` · `sales-room` · `min-max` · `tour-operator`

### 5. Extra steps for Vite-based prototypes

Vite prototypes need two additional things to work correctly once served through the design lab. Ask Claude to check and fix both:

> "Check my Vite config in `standalone-apps/your-prototype-name/vite.config.ts` and make sure `base` is set to `'./'`. Also check the `.npmrc` file and make sure it has `registry=https://registry.npmjs.org/` and `legacy-peer-deps=true`."

**Why these matter:**
- `base: './'` — without this, the built app's asset paths are absolute and everything 404s when served from a subdirectory
- The `.npmrc` registry setting — the repo root is configured for Duetto's private npm registry (which requires auth), but standalone apps only use public packages. Pinning the registry here bypasses the auth requirement entirely.

If your Vite prototype uses React Router for navigation between pages, also ask:

> "Check if my app uses BrowserRouter, and if so, make sure its `basename` is set to `/standalone-apps/your-prototype-name`"

Without the correct `basename`, navigating between pages resets the URL to the domain root and breaks routing on the preview URL.

**Local preview for Vite prototypes:**

In the chat, type:

> "Start the dev server for `standalone-apps/your-prototype-name`"

Claude will run `npm install` and `npm run dev` inside that folder. Once it's ready, open `http://localhost:5173` in your browser (or whichever port it reports).

### 6. Register the page (mock-app only)

If you're adding a mock-app page, you also need to register it in `design-lab/lib/folders.ts`. In the chat, type:

> "Register my new page in lib/folders.ts — the slug is `your-feature`, the name is `Your Feature Name`, and it belongs to the `strategy-team` team"

Claude will add the entry for you.

### 7. Check it works locally

**Static standalone:** Open `standalone-apps/your-prototype-name/index.html` directly in your browser.

**Vite standalone:** Follow the local preview step above (step 5).

**Mock app:** In the chat, type "Start the dev server" and open `http://localhost:3000`.

### 8. Commit, push, and open a PR

Follow steps 5, 6, and 8 from Scenario A.

---

## Scenario C — Duplicating an existing prototype to iterate on it

Use this when you want to explore a new direction from an existing prototype — without changing the original.

Steps 1 and 2 are identical to Scenario A (pull latest, create your branch). Come back here after you've done that.

### 3. Duplicate the prototype folder

In the chat, type:

> "Copy `standalone-apps/existing-prototype-name` to a new folder called `standalone-apps/new-prototype-name`"

Or for a mock-app page:

> "Copy `design-lab/app/existing-feature` to `design-lab/app/new-feature`"

**Do not rename or move the original.** Only work in the new copy.

### 4. Update the metadata and names

Ask Claude to update the `metadata.json` in the new folder so it shows up as a distinct card in the directory — not a duplicate of the original:

> "Update the metadata.json in `standalone-apps/new-prototype-name` — change the name to `New Name`, description to `A short description`, and author to `your-name`"

If you copied a mock-app page, also ask Claude to update the page title and register the new route in `lib/folders.ts`.

### 5. Make your changes in the new copy only

All your edits should happen inside the new folder. If you catch yourself editing files in the original folder, stop — undo the changes (`Cmd + Z` or ask Claude to discard them) and make sure you're in the right place.

### 6. Commit, push, and open a PR

Follow steps 5, 6, and 8 from Scenario A.

---

## Frequently asked questions

**What's the difference between a commit, a push, and a PR?**

These are three separate steps that often get confused:

- **Commit** — saves a snapshot of your current work locally, on your machine only. Think of it like hitting Save in a document editor, but with a label attached. Nothing leaves your computer.
- **Push** — sends your commits to GitHub so the rest of the team can see them, and triggers Vercel to build a preview URL. Until you push, your work is invisible to everyone else.
- **Pull Request (PR)** — a formal request to merge your branch into `main`, the shared version of the design lab. You open one when your prototype is finished and ready to be part of the permanent directory. PRs go through a quick review before they're merged.

The typical loop during active work is: build → commit → push → repeat. You only open a PR once at the very end.

---

**What happens if two people are working on the same prototype at the same time?**

Git can usually handle this without issues, as long as you and your teammate aren't editing the exact same file at the same moment. If you are, Git will flag a **merge conflict** when one of you tries to push — it can't automatically decide which version to keep.

The easiest way to avoid this: coordinate with your teammate so you're not in the same files at the same time. If you want to explore a different direction on the same prototype independently, use Scenario C to make your own copy and work from there.

If you do end up with a conflict, ask Claude:

> "I have a merge conflict. Can you help me resolve it?"

Claude will walk you through it step by step.

---

**Can I work on two prototypes at the same time?**

Yes — the simplest way is to clone the repo a second time into a different folder on your Desktop:

```
gh repo clone duettoresearch/UX ~/Desktop/UX-2
```

Open `UX-2` as a separate project in Claude Code Desktop. Each clone is independent: you can have different branches checked out in each, run separate dev servers on different ports, and work on both without interference.

A few things to keep in mind:
- Treat each clone as its own workspace — don't move files between them
- When you're done with the second clone, you can delete `UX-2` from your Desktop. Your work is safely on GitHub
- Each branch gets its own Vercel preview URL, so you can share both simultaneously

---

**Claude says I'm on the main branch**

This means you forgot to create a branch before starting work. Don't panic — your files are fine. In the chat, type:

> "I'm on main but I have uncommitted changes. Create a new branch called designer/your-name/your-feature and move my changes there without touching main."

Claude will create the branch and carry your work over. Main stays untouched.

> **If you're using Terminal instead of Claude Code Desktop:** Run `git checkout -b designer/your-name/your-feature` — this moves your uncommitted changes to the new branch automatically.

---

**I committed something to the wrong branch**

In the chat, type:

> "I just committed to the wrong branch. I want to move my last commit to a new branch called designer/your-name/your-feature and undo it from where it is now."

Claude will handle this. Ask it to show you what it's going to do before it runs anything.

---

**I don't know what branch I'm on**

In the chat, type:

> "What branch am I on?"

The answer should be `designer/your-name/something`. If it says `main`, see the entry above.

> **If you're using Cursor instead of Claude Code Desktop:** Your current branch is always shown in the bottom-left corner of the window.
>
> **If you're using Terminal instead of Claude Code Desktop:** Run `git branch --show-current`

---

**My preview URL isn't showing the latest changes**

Make sure you've both committed **and** pushed. Committing saves a snapshot locally; pushing is what sends it to GitHub and triggers the Vercel build. In the chat, type:

> "Do I have any uncommitted changes or unpushed commits?"

Claude will check both and tell you what's pending.

---

**I accidentally deleted a file I needed**

As long as the file was committed at some point, it's recoverable. In the chat, describe what happened:

> "I accidentally deleted `standalone-apps/my-prototype/index.html`. Can you restore it from the last commit?"

If the file was never committed (you deleted it before ever committing), it may be in your Trash — check there first.

---

**I have no idea what state my repo is in**

In the chat, type:

> "Give me a summary of my current Git status — what branch I'm on, what changes are staged or unstaged, and whether I have unpushed commits."

This is always safe to run. It doesn't change anything.

---

## Quick reference

| What you want to do | Say to Claude |
|---|---|
| See what branch you're on | "What branch am I on?" |
| Get latest changes from main | "Pull the latest changes from main" |
| Create a new branch | "Create a branch called designer/your-name/feature-name" |
| Save a snapshot of your work | "Commit my changes with the message: your message here" |
| Send your work to GitHub | "Push my branch to GitHub" |
| Check what's uncommitted or unpushed | "What's my current Git status?" |
| Undo uncommitted changes to a file | "Discard my changes to filename.tsx" |
| Open a pull request | "Open a pull request for my branch" |

---

Questions? Ask Nyle Collins or Paulo Latancia.
