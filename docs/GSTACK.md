# gstack — minimal setup for Mirador

Internal dev workflow only. Not part of what we sell to realtors or architects.

**Install status:** see [One-time install](#one-time-install) below. After install, skills live in `~/.cursor/skills/gstack-*`.

---

## What gstack is (in one sentence)

A library of slash-command “specialists” (review, QA, ship, debug) that turn Cursor into a small eng team — **for building Mirador**, not for 3DGS capture/render.

---

## One-time install

**Requirements:** Git, Node.js 20+, Bun 1.0+, Cursor.

> **Note:** gstack’s README lists `./setup --host cursor`, but `setup.sh` does not wire Cursor yet (as of gstack v1.42). Use the Mirador install script instead.

### Quick install (Windows — recommended)

From **`O:\Umbral\mirador`**:

```powershell
npm install -g bun          # if bun not on PATH
powershell -ExecutionPolicy Bypass -File scripts/install-gstack-cursor.ps1
```

This clones the repo to `%USERPROFILE%\.cursor\skills\gstack-repo`, builds `browse.exe`, generates Cursor skill docs, and copies skills to `%USERPROFILE%\.cursor\skills\gstack-*`.

**Already installed?** 46 skills under `~/.cursor/skills/gstack-*` — re-run the script after `git pull` in the repo to refresh.

### Manual install (Git Bash / macOS / Linux)

```bash
bash scripts/install-gstack-cursor.sh
```

Uses `$HOME/.cursor/skills/gstack` as the clone path (same as upstream docs).

### Verify

```powershell
Test-Path "$env:USERPROFILE\.cursor\skills\gstack-qa\SKILL.md"      # skills
Test-Path "$env:USERPROFILE\.cursor\skills\gstack\browse\dist\browse.exe"  # browser QA
Get-ChildItem "$env:USERPROFILE\.cursor\skills" -Filter "gstack-*" | Measure-Object
```

### Upgrade

```powershell
powershell -ExecutionPolicy Bypass -File scripts/install-gstack-cursor.ps1
```

Or in Cursor chat: “Run gstack upgrade” (loads `gstack-upgrade` skill).

---

## Skills we use (minimal set)

| Skill | When to use | Mirador example |
|-------|-------------|-----------------|
| `/review` | Before merging any branch with code changes | ListingCard, viewer routes, middleware |
| `/qa` | After implementing UI or flows | `http://localhost:3000/`, `/design`, `/home`, `/v/scene_best50000` |
| `/investigate` | Bug you don’t understand yet | Splat load failure, OG image wrong |
| `/ship` | Ready to open PR: tests + push | Feature branch → PR with summary |
| `/browse` | Agent needs real browser (not just curl) | Click through marketing scroll, embed iframe |
| `/office-hours` | **New feature** — scope before code | “Should `/home` be a separate app or routes?” |
| `/plan-eng-review` | Multi-file feature — lock architecture | Real listing data + CMS wiring |
| `/document-release` | After shipping — sync README/docs | Update this file + ROADMAP when routes change |

### Voice-friendly triggers (Cursor chat)

You don’t have to memorize slash names. Say things like:

- “Run a code review on this branch” → `/review`
- “QA localhost:3000/design” → `/qa http://localhost:3000/design`
- “Help me debug why the splat viewer is blank” → `/investigate`
- “Ship this as a PR” → `/ship`

---

## Skills we skip (for now)

| Skill | Why skip |
|-------|----------|
| `/design-shotgun` | Brand tokens + logo are **locked** — see HDS boundary below |
| `/design-consultation` | Would invent a new design system; we already have `brand/tokens/` |
| `/design-html` | Use existing Next.js + Tailwind patterns in `mirador/` |
| `/plan-design-review` | Use for **audit only** if UI looks off; not for greenfield exploration |
| `/autoplan` | Overkill for one-file fixes; use for multi-route features only |
| `/cso` | No production auth/payments yet |
| `/land-and-deploy`, `/canary`, `/setup-deploy` | No staging/prod CI pipeline yet |
| `/setup-gbrain`, `/sync-gbrain` | Optional later; graphify covers repo knowledge at Umbral root |
| `/codex` | Optional second opinion; needs OpenAI Codex CLI |
| `/pair-agent`, OpenClaw skills | Solo dev; no multi-agent coordination needed yet |
| `/retro` | Nice weekly habit; not launch-critical |

---

## HDS vs gstack — don’t fight each other

Mirador has **two design modes**. Pick one per task; never run both on the same surface.

### Mode A — **Ship mode** (default for `mirador/`)

Use gstack. Brand is fixed.

**Locked sources of truth:**

- `brand/tokens/colors.json` → `mirador/app/globals.css` → `mirador/lib/brand.ts`
- `brand/tokens/typography.json` — Cormorant Garamond + Source Sans 3
- `brand/identity/logo/mark.svg` — frame + arch portal
- Direction B warm stone — locked 2026-05-18

**Rules for the agent:**

1. Do **not** run `/design-shotgun`, `/design-consultation`, or open-ended “explore 6 mockup variants” flows on Mirador UI.
2. `/design-review` is allowed only as **audit + fix** against existing tokens (contrast, spacing, component consistency) — not to reinvent palette or type.
3. For new components: copy patterns from `ListingCard`, `/design`, marketing `/` — don’t generate standalone HTML mockups.
4. Conceptual / competition / brand-strategy work stays in **`../brand/`** and **`../docs/`** under HDS (parent repo rules), not in gstack design skills.

### Mode B — **HDS mode** (concept & brand strategy only)

Use parent repo HDS rules (`../.cursor/rules/hds.mdc`, `../CLAUDE.md`).

**When:** new product line, competition entry, mood board direction, narrative framing — **not** day-to-day Mirador CSS.

**Trigger phrases:** “frame this with HDS”, “Q1–Q4”, “chronogram”, “conceptual development”.

### Decision tree

```
Working in mirador/ on UI or routes?
  └─ YES → gstack ship mode (/review, /qa, /ship). Tokens are law.
  └─ NO, working on brand strategy or new product concept?
       └─ YES → HDS mode (parent repo). Skip gstack design skills.
  └─ NO, pure 3DGS pipeline / capture?
       └─ Neither — use editor/ and pipeline docs.
```

---

## How you use it in Cursor (cheat sheet)

Open the **`mirador`** folder in Cursor (or the whole Umbral repo — agent reads `mirador/AGENTS.md`).

### Invoking skills

Cursor discovers skills from `~/.cursor/skills/`. gstack installs as **`gstack-qa`**, **`gstack-review`**, etc. In chat:

| You type | What happens |
|----------|----------------|
| `/gstack-qa http://localhost:3000/design` | Browser QA on ListingCard preview |
| `Run gstack review on this branch` | Loads review skill |
| `QA localhost home page` | Agent picks qa skill |
| `Ship this as a PR` | Tests + PR via ship skill |

If slash names don’t autocomplete, say explicitly: **“Follow the gstack-qa skill for http://localhost:3000/home”** — the agent reads `SKILL.md` from your global skills folder.

### Your daily loop

```
1. npm run dev                    # terminal
2. Implement feature              # normal agent chat
3. "Run gstack review"            # before merge
4. "/gstack-qa http://localhost:3000/…"   # click-through QA
5. "Ship this"                    # PR
```

### When to skip gstack entirely

- One-line typo fix → just edit, no `/review`
- Brand/concept strategy → HDS (parent repo), not gstack
- 3DGS training / capture → pipeline docs, not gstack

---

Open **`O:\Umbral\mirador`** as the Cursor workspace folder (or ensure the agent knows paths are under `mirador/`).

### Typical feature (e.g. wire real listings on `/home`)

1. **Start dev server**
   ```powershell
   cd O:\Umbral\mirador
   npm run dev
   ```

2. **Scope** (only if the feature is non-obvious)
   ```
   /office-hours
   I want /home to show real listings from demo-listings.ts with OG images.
   ```

3. **Build** — normal Cursor agent chat: “Implement X following ListingCard patterns and brand tokens.”

4. **Review**
   ```
   /review
   ```

5. **QA in browser**
   ```
   /qa http://localhost:3000/home
   ```
   Agent opens Chromium, clicks cards, checks mobile width, reports/fixes bugs.

6. **Ship**
   ```
   /ship
   ```

### Small fix (typo, one component tweak)

Skip `/office-hours`. Just implement → `/review` → `/qa` on the affected URL → `/ship`.

### Bug hunt

```
/investigate
The splat at /v/scene_best50000 shows a black screen after load.
```

Agent freezes scope to the viewer module, traces data flow, no drive-by refactors.

---

## Mirador URLs for QA

| URL | What to check |
|-----|----------------|
| `http://localhost:3000/` | Marketing hero, scroll sections, warm stone tokens |
| `http://localhost:3000/design` | Three `ListingCard` samples |
| `http://localhost:3000/home` | Listing grid (when wired) |
| `http://localhost:3000/v/scene_best50000` | 3D splat viewer, load time, mobile |

Always run `npm run dev` first. Use `0.0.0.0` hostname if testing from another device on LAN.

---

## What gets committed vs stays global

| Location | Contents |
|----------|----------|
| `~/.cursor/skills/gstack/` | gstack repo + generated skills (global, not in git) |
| `mirador/AGENTS.md` | Project routing: gstack vs HDS vs brand locks |
| `mirador/docs/GSTACK.md` | This guide |

We do **not** vendor gstack into the repo (no `.claude/` team-init). Keeps Mirador git clean; you upgrade globally with `git pull` + `./setup`.

---

## Troubleshooting (Windows)

| Problem | Fix |
|---------|-----|
| `bun: command not found` | `npm install -g bun`, restart terminal |
| Skills not in Cursor | Re-run `./setup --host cursor` from gstack clone |
| `/browse` or `/qa` fails | `cd ~/.cursor/skills/gstack && bun install && bun run build` |
| Stale skills after pull | Re-run `./setup --host cursor` (Windows copy fallback) |
| Agent ignores slash commands | Say explicitly: “Load gstack skill `/qa` for http://localhost:3000/design” |

---

## Related docs

- Brand roadmap: [`../brand/WHAT-TO-DO-NEXT.md`](../brand/WHAT-TO-DO-NEXT.md)
- Business context (not gstack): [`../../docs/umbraltech/BUSINESS_STRUCTURE.md`](../../docs/umbraltech/BUSINESS_STRUCTURE.md)
- HDS (parent repo): [`../../.cursor/rules/hds.mdc`](../../.cursor/rules/hds.mdc)
