# Mirador — operations guide

Single reference for **where the viewer lives**, **how to ship listings** (mirador.homes + mirador.lat), **file layout**, **embeds**, and **local dev** when localhost “doesn’t load.”

---

## 1. Where Mirador lives

| Layer | Location |
|-------|----------|
| **Code** | `O:\Umbral\mirador` → GitHub `mansvr/mirador-v1` |
| **Hosting** | One Vercel project → **mirador.lat** + **mirador.homes** (same deploy) |
| **3D assets** | Cloudflare R2 bucket (e.g. `mirador-scenes`) — not in Git |
| **Listings index** | `mirador/lib/listings/catalog.json` — in Git, redeploy on change |
| **Staging uploads** | `O:\Umbral\r2upload\<sceneId>\` (per-scene folders at repo root) |

The **viewer** is not a separate app. It is routes inside this Next.js project plus `SceneCanvas` (Spark / R3F).

---

## 2. URL map (how to link and reference)

| URL | Purpose | Who uses it |
|-----|---------|-------------|
| `/` | B2B marketing (mirador.lat) | Prospects, agents evaluating product |
| `/home` | Listings grid (mirador.homes content) | Buyers browsing properties |
| `/v/<sceneId>` | **Full tour** — 3D + waypoints + listing strip (mobile) + embed copy + OG | Share links, WhatsApp, QR, cards on `.homes` |
| `/e/<sceneId>` | **Embed-only** — fullscreen GL, no listing chrome; `frame-ancestors *` | iframe on your main site / WordPress / Webflow |
| `/<tenant>/<property>` | Branded slug (static map in `lib/tenants.ts`) | e.g. `/umbral/best-splat-50k` → `scene_best50000` |

**Production examples**

- Tour: `https://mirador.lat/v/scene_best50000` or `https://mirador.homes/v/scene_best50000`
- Grid: `https://mirador.homes/` (middleware rewrites `/` → `/home` on `.homes` host)
- Embed: `https://mirador.lat/e/scene_best50000`

**Rule:** Cards and marketing always link to **`/v/<sceneId>`**. Never iframe `/v/` — use **`/e/`** for embeds.

---

## 3. Code map (viewer stack)

```
app/v/[sceneId]/page.tsx     → ViewerPageShell (full tour page)
app/e/[sceneId]/page.tsx     → SceneCanvas only (iframe)
app/[tenant]/[property]/     → same shell, slug → sceneId

components/viewer/
  SceneCanvas.tsx            → Canvas + overlays
  SplatScene.tsx             → Spark SplatMesh load (SOG / SPZ / PLY)
  SparkInit.tsx              → SparkRenderer + LoD
  LoadingOverlay.tsx         → progress / errors
  ViewerPageShell.tsx        → layout: GL + PropertyStrip + EmbedSnippet

lib/scene.ts                 → fetch scene.json (local scenes/ or R2)
lib/scene-utils.ts           → splatUrl(), url_mobile, device budgets
lib/listings/catalog.json    → mirador.homes cards
lib/tenants.ts               → branded URL → sceneId
```

---

## 4. Two-layer data model (critical)

Do **not** put splat paths in the catalog. Split responsibilities:

| Layer | File | Contains |
|-------|------|----------|
| **Catalog** | `lib/listings/catalog.json` | Card title, price, beds, `sceneId`, `published`, `sortOrder` |
| **Scene** | `R2/<sceneId>/scene.json` | `render.url`, splat budgets, waypoints, `listing` copy for tour page, orientation |

**sceneId** is the join key: same string in catalog, R2 folder name, and `/v/` URL.

---

## 5. Recommended file structure

### In Git (mirador repo)

```
mirador/
  app/v/[sceneId]/          # tour routes
  app/e/[sceneId]/          # embed routes
  app/home/                 # listings grid
  scenes/<sceneId>/         # local dev scene.json only
  lib/listings/catalog.json # .homes grid
  public/                   # local .sog / .spz (gitignored), OG JPEGs
  docs/                     # this guide + specialized docs
```

### On R2 (production assets)

**One splat format per scene** — pick SOG *or* SPZ in `scene.json`; do not leave legacy files from old exports.

```
<bucket>/
  scene_best50000/
    scene.json              # render.url → scene.spz (or scene.sog)
    scene.spz               # SPZ path (Marble / Niantic demos)
    thumbnail.webp          # listing card hero (16:10 WebP ~80–120 KB)
  scene_poblado001/
    scene.json
    scene.spz
    thumbnail.webp
```

| File | Used by |
|------|---------|
| `scene.json` | Viewer + catalog enrichment |
| `scene.spz` or `scene.sog` | `/v/` and `/e/` WebGL tour only |
| `thumbnail.webp` | **Listing cards** on mirador.homes (if no `public/og/{sceneId}.jpg`) |

Optional later: `scene-mobile.spz` / `scene-mobile.sog` when mobile needs a lighter file than desktop.

**Do not** mix SOG + SPZ in the same folder unless `scene.json` explicitly references both (confusing; wastes storage). Remove orphans when switching format.

### Staging on disk (Umbral root, not deployed)

```
O:\Umbral\r2upload\
  scene_best50000\          # or flat scene.json for one scene
    scene.json
    scene.sog
    scene-mobile.sog
  scene_poblado001\
    scene.json
    ...
```

Upload manually in Cloudflare dashboard or Wrangler — see `r2upload/README.md`.

---

## 6. New listing playbook (end-to-end)

### A. Choose ids

- **sceneId:** `scene_<slug>` e.g. `scene_poblado001` (must match catalog + R2 folder).
- **catalog id:** marketing slug e.g. `poblado-penthouse` (future `/home/{id}`).

### B. Capture → export

1. Train (Postshot / LichtFeld) → PLY.
2. SuperSplat — crop, prune, orient.
3. Export **SOG** and/or **SPZ** (`splat-transform`). Target **8–20 MB** for mobile when possible.
4. Export **thumbnail.webp** (1600×1000 or 1200×750).

### C. Write `scene.json`

Copy from `r2upload/scene_best50000/scene.json` or `scenes/scene_best50000/scene.json`.

```json
"render": {
  "format": "sog",
  "url": "scene.sog",
  "url_mobile": "scene-mobile.sog",
  "format_mobile": "sog",
  "splat_budget_desktop": 2000000,
  "splat_budget_mobile": 500000,
  "pitch_correction_deg": 180,
  "pitch_correction_deg_mobile": 0
}
```

For SPZ (Marble / Niantic — same asset desktop + mobile):

```json
"format": "spz",
"url": "scene.spz",
"yaw_correction_deg": 0,
"pitch_correction_deg": 0
```

**Marble SPZ** exports are usually **already Y-up in Spark** → start at **`pitch_correction_deg: 0`**. The **`180`** fix in `3dgs-viewer-system.md` §3.5 applies to **Postshot → SOG**, not Marble. If upside-down, toggle **`0` vs `180`** in `scene.json` and re-upload JSON only.

For SOG (Postshot pipeline — optional mobile crop):

Test orientation on `/v/<sceneId>` before publishing.

### D. Upload to R2

Upload entire folder to `/<sceneId>/` on the bucket. JSON-only updates apply in ~60s without Vercel redeploy.

### E. Add catalog row

Edit `mirador/lib/listings/catalog.json`:

```json
{
  "id": "poblado-penthouse",
  "sceneId": "scene_poblado001",
  "title": "Penthouse con terraza",
  "neighborhood": "El Poblado",
  "city": "Medellín",
  "beds": 4,
  "areaM2": 168,
  "priceLabel": "$1.250.000.000 COP",
  "published": true,
  "sortOrder": 2,
  "thumbnailR2": "thumbnail.webp"
}
```

**Commit + push** → Vercel rebuild (catalog lives in repo).

### F. Verify

| Check | URL |
|-------|-----|
| Tour | `/v/<sceneId>` |
| Card | `/home` — hero image or “Vista previa” gradient (never broken icon) |
| Embed | paste snippet from tour page; test `/e/<sceneId>` in iframe |
| Phone | same tour URL on Safari |
| Share preview | paste `/v/<sceneId>` in WhatsApp — see §6b |

---

## 6b. Listing images vs share OG (three assets)

These are **different jobs**. Do not assume one file covers all.

| Asset | Location | Aspect | Purpose |
|-------|----------|--------|---------|
| **OG source still** | `R2/{sceneId}/og-poster.jpg` | any (≥ 1200×630) | Uploaded at **H-GATE approve** |
| **Listing card** | `R2/{sceneId}/thumbnail.webp` | 16:10 WebP | Grid hero when no `public/og` still |
| **Share card** | `public/og/{sceneId}-card.jpg` | 1200×630 JPEG ≤300 KB | WhatsApp / social link previews |

**Standard:** photo-only share cards (no text overlay on image). Full workflow: **[share-og-workflow.md](./share-og-workflow.md)**.

**Listing cards (`/home`):** resolver order → `catalog.thumbnailUrl` → `public/og/{sceneId}.jpg` → R2 `thumbnail.webp` (HEAD must succeed) → gradient placeholder.

**Share / OG:** paste **`/share/{sceneId}.html`** in WhatsApp. After H-GATE publish, run `npm run og:bake -- {sceneId}` and `vercel deploy --prod`. Crawlers load **`/api/og-card/{sceneId}`** (HTTP 200 JPEG).

**Per-listing checklist**

1. H-GATE: upload **JPEG poster** (compress to ≤2 MB before upload).
2. `npm run og:bake -- {sceneId}` → `{sceneId}-card.jpg`.
3. `npm run og:share-page -- {sceneId}` if `public/share/{sceneId}.html` is missing.
4. `vercel deploy --prod`.
5. Test in a **new** WhatsApp chat.

---

## 7. mirador.homes — populate the grid

1. **Domain:** `mirador.homes` on same Vercel project as `.lat` (see §8).
2. **Catalog:** `catalog.json` rows with `"published": true`.
3. **Thumbnails:** R2 `thumbnail.webp` per scene (or baked `public/og/<sceneId>.jpg`).
4. **Middleware:** `mirador/middleware.ts` rewrites `mirador.homes/` → `/home`.

Card links are always **`/v/{sceneId}`** — works on both hostnames.

Detailed checklist: [mirador-homes-setup.md](./mirador-homes-setup.md).

---

## 8. Embed on your main site (protocol)

### Use `/e/<sceneId>` only

```html
<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:min(85dvh,900px);min-height:200px">
  <iframe
    src="https://mirador.lat/e/scene_best50000"
    title="Mirador — tour 3D"
    style="position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:12px;display:block"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
```

- **CSP:** `next.config.ts` sets `frame-ancestors *` on `/e/*`.
- **Origin:** On production, `getSiteUrl()` uses the **request host** — embeds on `mirador.homes` should be served from pages on `.homes` so the iframe src matches (or hardcode the canonical host you want).
- **Copy from UI:** Desktop `/v/…` → Embed panel (bottom-right). Mobile → Embed section in listing strip.

### Do not

- iframe `/v/` (extra chrome, worse for small boxes).
- Put splat files on your main site — keep them on R2.
- Block third-party cookies in a way that breaks WebGL inside iframe (rare).

### Share / OG

- Direct links and WhatsApp: **`/v/<sceneId>`**
- OG image: baked `public/og/<sceneId>-card.jpg` (share) — see **§6b** for listing vs share assets

---

## 9. Branded URLs (optional)

Edit `lib/tenants.ts`:

```ts
umbral: {
  "best-splat-50k": "scene_best50000",
},
```

→ `https://mirador.lat/umbral/best-splat-50k` (same viewer as `/v/scene_best50000`).

---

## 10. Splat formats (SOG / SPZ / PLY)

| format in JSON | File | Notes |
|----------------|------|--------|
| `sog` | `.sog` | Default Umbral pipeline (PlayCanvas SOG zip) |
| `spz` | `.spz` | Often smaller; Niantic / Polycam |
| `ply` | `.ply` | Large; dev / fallback |

Mirador infers decoder from **file extension** if it disagrees with `format`. See [spark-assets-and-budget.md](./spark-assets-and-budget.md).

---

## 11. Local dev — localhost “not loading”

### Start the server

```powershell
cd O:\Umbral\mirador
npm install
npm run dev
```

Server binds **`0.0.0.0:3000`** (phone can use `http://<PC-LAN-IP>:3000`).

### Which URL to open

| You open | You get |
|----------|---------|
| `http://localhost:3000/` | Marketing homepage — **not** the 3D tour |
| `http://localhost:3000/home` | Listings grid (mirador.homes) |
| `http://localhost:3000/v/scene_best50000` | **3D tour** (primary dev URL) |
| `http://localhost:3000/v/scene_demo00` | Demo butterfly `.spz` (Spark CDN) |
| `http://localhost:3000/e/scene_best50000` | Embed layout only |

**Common mistake:** opening `/` and expecting the splat viewer.

### Local scene resolution (`lib/scene.ts`)

- If `scenes/<sceneId>/scene.json` exists → use it (default in dev).
- If `MIRADOR_USE_R2=1` or no local file → fetch from `NEXT_PUBLIC_R2_URL`.

**Recommended `.env.local` for local splats:**

```env
# Leave R2 unset, or comment out NEXT_PUBLIC_R2_URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Put splats in `public/` and reference with leading `/`:

```json
"url": "/best-splat_50000.sog",
"url_mobile": "/scene-mobile.sog"
```

### If the page loads but GL stays black

1. Hard refresh; check DevTools → Network for `.sog` / `.spz` **200**.
2. Mobile path needs `fileType` + download progress (latest `main`).
3. File too large for Safari — use smaller export or `scene-mobile.*`.
4. See [local-mobile-testing.md](./local-mobile-testing.md).

### If the server won’t start

- Port 3000 in use: stop other `node` / old `npm run dev`.
- Run from **`mirador/`**, not `O:\Umbral` root.

### Test embed locally

Save HTML on disk:

```html
<iframe src="http://localhost:3000/e/scene_best50000" width="100%" height="400" style="border:0"></iframe>
```

---

## 12. Production env (Vercel)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_R2_URL` | Public bucket base URL |
| `NEXT_PUBLIC_SITE_URL` | Canonical for OG on **mirador.lat** (`https://mirador.lat`) |

**R2 CORS** must allow:

- `https://mirador.lat`
- `https://mirador.homes`
- `https://*.vercel.app` (previews)
- `http://localhost:3000` (dev)

See [cloudflare-r2-setup.md](./cloudflare-r2-setup.md).

---

## 13. Deploy protocol

| Change | Action |
|--------|--------|
| Code (viewer, catalog.json) | `git push` → Vercel auto-deploy |
| `scene.json` / splats on R2 | Upload only — no redeploy |
| Domain / env | Vercel dashboard |

CLI: `vercel ls`, `vercel whoami` from `mirador/` (project linked in `.vercel/repo.json`).

---

## 14. Related docs (deep dives)

| Doc | Topic |
|-----|--------|
| [mirador-homes-setup.md](./mirador-homes-setup.md) | `.homes` domain + 3 demo scenes |
| [local-mobile-testing.md](./local-mobile-testing.md) | Phone + DevTools mobile |
| [mobile-splat-delivery.md](./mobile-splat-delivery.md) | Dual SOG + sizes |
| [spark-assets-and-budget.md](./spark-assets-and-budget.md) | LoD, SPZ, budgets |
| [vercel-mirador.lat-setup.md](./vercel-mirador.lat-setup.md) | Domains, OG, firewall |
| [cloudflare-r2-setup.md](./cloudflare-r2-setup.md) | Bucket + CORS |
| [../../r2upload/README.md](../../r2upload/README.md) | Staging uploads |

---

## Quick reference card

```
New listing:
  1. Export → r2upload/<sceneId>/
  2. Upload → R2/<sceneId>/
  3. Add row → lib/listings/catalog.json
  4. git push
  5. Test /home + /v/<sceneId> + /e/<sceneId>

Share link:     /v/<sceneId>
Embed iframe:   /e/<sceneId>
Listings grid:  mirador.homes/  or  localhost:3000/home
Local tour dev: localhost:3000/v/scene_best50000
```
