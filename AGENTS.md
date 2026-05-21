<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## gstack (Mirador dev workflow)

Full guide: [`docs/GSTACK.md`](docs/GSTACK.md).

Use gstack skills from `~/.cursor/skills/gstack-*` for **shipping Mirador** (review, QA, debug, PR). This is internal ops — not customer-facing product.

### Default skills

| Task | Skill |
|------|-------|
| Code review before merge | `/review` |
| Browser QA on dev server | `/qa http://localhost:3000/...` |
| Root-cause debugging | `/investigate` |
| Open PR | `/ship` |
| Real browser (not curl) | `/browse` |
| Scope a **new** multi-route feature | `/office-hours` then `/plan-eng-review` |

### Brand lock — do not fight with gstack design skills

Mirador UI is **Direction B warm stone**, locked 2026-05-18. Sources of truth:

- `../brand/tokens/colors.json` → `app/globals.css` → `lib/brand.ts`
- `../brand/tokens/typography.json`
- `../brand/identity/logo/mark.svg`

**Do not run** `/design-shotgun`, `/design-consultation`, or `/design-html` on Mirador surfaces.

`/design-review` is allowed only as audit-and-fix against existing tokens (spacing, contrast, consistency) — never to change palette, type, or logo.

For new components, follow `components/listing/ListingCard.tsx` and routes `/design`, `/`.

### HDS boundary

Conceptual / brand-strategy work (competitions, new product framing) uses **HDS** in the parent Umbral repo (`../.cursor/rules/hds.mdc`) — not gstack design skills.

- **mirador/** code + UI → gstack ship mode
- **brand/** strategy + concept → HDS mode
- **3DGS pipeline** → editor/ and pipeline docs

### QA URLs

Run `npm run dev` first, then QA: `/`, `/design`, `/home`, `/v/scene_best50000`.

### 3DGS performance debug

On viewer routes in dev: press **H** to toggle perf HUD + lil-gui (`docs/viewer-debug.md`). Both hidden until **H**.
