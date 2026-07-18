# Share & OG workflow (photo-only cards)

Standard for Mirador tour links in **WhatsApp**, iMessage, and social previews.

**Policy:** OG **poster = photo only** (no Mirador text overlay on the image). Title, neighborhood, and description appear in the preview **text block below** the image — same information, cleaner card.

---

## Two URLs per scene

| URL | Use |
|-----|-----|
| `https://mirador.lat/share/{sceneId}.html` | **Paste in WhatsApp** — static HTML, stable OG for crawlers |
| `https://mirador.lat/v/{sceneId}` | **Canonical tour** — viewer, agent CTA, embed snippet |

`mirador.homes/v/{sceneId}` is the same tour on the listings domain (buyer-facing grid). Pick one host for campaigns; both work.

---

## Operator workflow (H-GATE → WhatsApp)

### 1. Capture the poster (you)

In [H-GATE HQ preview](https://mirador.tools/admin/qa) (`preview?mode=hq`):

1. Orient the splat with **Pitch / Yaw / Roll** (not SuperSplat gizmo X/Y/Z — see [Orientation](#orientation-pitch--yaw--roll)).
2. Take a **screenshot** or export a still from SuperSplat — horizontal, representative frame.
3. **Compress before upload** (recommended):

   | Target | Guideline |
   |--------|-----------|
   | Format | **JPEG** (best for WhatsApp; PNG/WebP also accepted) |
   | Dimensions | ≥ 1200×630 (16:9 or wider); script crops to 1200×630 |
   | File size | **≤ 2 MB** upload; final share card is compressed to **≤ 300 KB** on deploy |

   Quick compress (macOS/Linux): export at 80–85% JPEG quality, or use Preview / Squoosh / `sharp` locally.

4. **Approve & publish** with **OG poster** file attached.

H-GATE writes to R2:

- `{sceneId}/og-poster.jpg` — source still (can be large)
- `{sceneId}/thumbnail.webp` — same bytes for listing grid fallback

### 2. Bake + share page + deploy (dev / agent)

From repo `mirador/`:

```bash
# Compress R2 poster → public/og/{sceneId}-card.jpg (photo-only, ≤300 KB)
npm run og:bake -- scene_jardin-interno_01

# Static WhatsApp page (skip if file already exists)
npm run og:share-page -- scene_jardin-interno_01

# Ship to production
vercel deploy --prod
```

`og:bake` reads `public/og/{sceneId}.jpg` if present, else fetches R2 `og-poster.jpg`.

### 3. Share

Paste in a **new** WhatsApp chat (previews cache per URL):

`https://mirador.lat/share/scene_jardin-interno_01.html`

Verify: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) → **Scrape Again** twice.

Troubleshooting: [whatsapp-og-troubleshooting.md](./whatsapp-og-troubleshooting.md)

---

## What gets served

```
H-GATE upload (og-poster.jpg on R2)
        ↓
npm run og:bake  →  public/og/{sceneId}-card.jpg  (1200×630, ≤300 KB, photo only)
        ↓
/api/og-card/{sceneId}  →  HTTP 200 JPEG (no Vercel static 206 on Range)
        ↓
/share/{sceneId}.html og:image  +  /v/{sceneId} metadata
```

**Listing grid** (`mirador.homes`) uses a separate asset: R2 `thumbnail.webp` or `public/og/{sceneId}.jpg` — see [mirador-operations-guide.md §6b](./mirador-operations-guide.md).

### OG priority (`lib/og.ts` → `buildOpenGraphImages`)

| Priority | Source | Used when |
|----------|--------|-----------|
| 1 | `/api/og-card/{sceneId}` | Baked `public/og/{sceneId}-card.jpg` exists (after `npm run og:bake`) |
| 2 | R2 `{sceneId}/og-poster.jpg` | H-GATE or pipeline upload |
| 3 | R2 `{sceneId}/thumbnail.webp` | Listing hero only (PlayCanvas / manual screenshot) |
| 4 | `public/og/{sceneId}.jpg` | Local source still |
| 5 | `/api/og/{sceneId}` | **Legacy branded overlay** (black card + Mirador text) |

**PlayCanvas viewer-pc shortcut** (no H-GATE): capture hall hero → `r2upload/{sceneId}/thumbnail.webp` → `og-poster.jpg` → `npm run og:bake` in `mirador/` → `vercel deploy --prod`. See [`viewer-pc/docs/VIEWER-PRODUCTION-PIPELINE.md`](../../mirador-dev/apps/viewer-pc/docs/VIEWER-PRODUCTION-PIPELINE.md#og-poster--whatsapp-share).

Both **mirador.lat** and **mirador.homes** share one deploy — `/v/{sceneId}` on either host uses the same `og:image`.

---

## Orientation (pitch / yaw / roll)

| Field | Axis | Phone SOG typical start |
|-------|------|-------------------------|
| Pitch | World X | **180°** (fixes upside-down in Spark) |
| Yaw | World Y | 0° |
| Roll | World Z | 0° |

SuperSplat **Transform gizmo** is preview-only; it does **not** map 1:1 to these fields.

---

## Legacy: branded overlay cards

`npm run og:bake:branded -- <sceneId>` composites Mirador eyebrow + title via `/api/og` (used for early demos). **Not** the default for new listings.

`demo1` keeps its own bake: `npm run og:bake:demo1`.

---

## Related docs

| Doc | Contents |
|-----|----------|
| [mirador-operations-guide.md](./mirador-operations-guide.md) | URLs, R2 layout, catalog, embeds |
| [whatsapp-og-troubleshooting.md](./whatsapp-og-troubleshooting.md) | 403, cache, image size |
| [mirador-dev/ops/pipeline/PIPELINE-GUIDE.md](../../mirador-dev/ops/pipeline/PIPELINE-GUIDE.md) | H-GATE pipeline step 8 |
