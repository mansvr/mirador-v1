# mirador.homes — setup & listings pipeline

> **Master guide:** [mirador-operations-guide.md](./mirador-operations-guide.md) — URLs, viewer code map, embed protocol, localhost, full new-listing playbook.

**Goal:** One Vercel project serves both **mirador.lat** (B2B marketing + tours) and **mirador.homes** (listings grid). Cards pull from a **catalog**; tours pull from **R2 scene folders**.

You do **not** need a separate GitHub repo for v1.

---

## Architecture (two layers)

| Layer | File / location | Purpose |
|-------|----------------|---------|
| **Listings catalog** | `mirador/lib/listings/catalog.json` | What appears on the grid: title, price, beds, sort order, `sceneId` link |
| **Scene manifest** | `R2/{sceneId}/scene.json` | Tour truth: splat URLs, waypoints, listing strip on `/v/…` |
| **Card image** | `R2/{sceneId}/thumbnail.webp` | 16:10 hero on `ListingCard` (required for production polish) |
| **Splat assets** | `R2/{sceneId}/scene.spz` or `scene.sog` (+ optional mobile) | WebGL tour |

**Rule:** Catalog = marketplace index. Scene = spatial product. Never duplicate splat paths in the catalog.

---

## Card population (automatic)

Server: `getPublishedListingCards()` → `resolveListingCard()` per row.

**Thumbnail priority:**

1. `catalog.thumbnailUrl` (absolute override, staging)
2. `public/og/{sceneId}.jpg` (baked OG still, if present)
3. `R2 /{sceneId}/thumbnail.webp` (recommended)
4. Gradient placeholder “Vista previa”

**Tour link:** always `/v/{sceneId}` (works on both `.lat` and `.homes`).

**Enrichment:** If catalog omits fields, resolver reads `scene.json` (`listing.*`, `metric.*`) when R2/local scene exists.

---

## Phase 1 — Domain on existing Vercel project (no new repo)

1. **Vercel** → same project as `mirador.lat` → **Settings → Domains**
2. Add **`mirador.homes`** (and optional `www.mirador.homes` → redirect to apex)
3. DNS at registrar: point to Vercel (same as `.lat`)
4. Deploy latest `main` from `mansvr/mirador-v1`

**Middleware** (`mirador/middleware.ts`):

- `https://mirador.homes/` → rewrites to `/home` (listings grid)
- `https://mirador.lat/` → marketing `/` (unchanged)
- Tours: `https://mirador.homes/v/scene_…` works on either host

**Env:** Keep `NEXT_PUBLIC_R2_URL` + `NEXT_PUBLIC_SITE_URL=https://mirador.lat` for OG canonical on marketing. `getSiteUrl()` uses **request host** in production so embeds on `.homes` get correct origin.

**R2 CORS:** Add `https://mirador.homes` to allowed origins (same bucket).

---

## Phase 2 — Three demo scenes on R2

Use **one folder per scene** (folder name = `sceneId`):

```
mirador-scenes/   (your R2 bucket)
  scene_best50000/
    scene.json
    scene.spz
    thumbnail.webp      ← card + social fallback
  scene_poblado001/
    scene.json
    scene.spz
    thumbnail.webp
  scene_laureles01/
    scene.json
    scene.spz
    thumbnail.webp
```

Staging templates: `O:\Umbral\r2upload\` — see [`../../r2upload/README.md`](../../r2upload/README.md).

### Per-scene checklist

- [ ] Pick `sceneId` matching `^scene_[a-z0-9]{8,}$` (see `catalog.json`)
- [ ] Export splat (`.spz` or `.sog`; SPZ dummies uploaded 2026-05-21)
- [ ] Write `scene.json` (orientation: test `pitch_correction_deg` on `/v/…`)
- [ ] Export **thumbnail.webp** — 1600×1000 or 1200×750, WebP ~80–120 KB, representative frame
- [ ] Upload with Wrangler (`--remote`; see `r2upload/upload-spz-dummies.ps1`)
- [ ] Add row to `catalog.json` if new listing
- [ ] Verify card image + tour on `/home` and `/v/{sceneId}`

### Wrangler upload (example)

```powershell
powershell -ExecutionPolicy Bypass -File O:\Umbral\r2upload\upload-spz-dummies.ps1
```

**JSON-only updates** propagate in ~60s (ISR). **New splats** = upload only, no Vercel redeploy.

---

## Phase 3 — Edit the catalog

File: `mirador/lib/listings/catalog.json`

| Field | Meaning |
|-------|---------|
| `id` | Stable listing slug (future `/home/{id}`) |
| `sceneId` | Must match R2 folder + `/v/` route |
| `published` | `false` hides from grid |
| `sortOrder` | Lower = first |
| `thumbnailR2` | Default `thumbnail.webp` |

After catalog changes: **git commit + push** → Vercel redeploy (catalog is in repo, not R2).

---

## Phase 4 — Smoke tests

| URL | Expect |
|-----|--------|
| `https://mirador.homes/` | Listings grid (3 cards when R2 + thumbs ready) |
| `https://mirador.lat/home` | Same grid (path alias during transition) |
| `https://mirador.homes/v/scene_best50000` | Tour loads from R2 |
| Card image | `thumbnail.webp` or placeholder until uploaded |

---

## When to create a separate repo

**Not yet.** Split only if:

- Different team/deploy cadence for marketplace vs viewer
- Separate env secrets / compliance boundary

Until then: **one repo, one Vercel project, two domains.**

---

## Local dev

```powershell
cd O:\Umbral\mirador
npm run dev
```

| URL | Simulates |
|-----|-----------|
| `http://localhost:3000/home` | Listings grid |
| `http://localhost:3000/?host=…` | Use `/home` directly |

Optional: add `127.0.0.1 mirador.homes` to hosts file to test middleware locally.

---

## Related docs

- R2 upload staging: [`../../r2upload/README.md`](../../r2upload/README.md)
- Vercel + `.lat`: [`vercel-mirador.lat-setup.md`](vercel-mirador.lat-setup.md)
- Brand roadmap: [`../../brand/ROADMAP.md`](../../brand/ROADMAP.md) Step 8
