# Demo1 integration — AI67 listing microsite

**Live path:** `https://mirador.lat/demo1`  
**Source (iterate):** `O:\microsites\apartment01\web`  
**Deployed copy:** `mirador/app/demo1`, `mirador/components/demo1`, `mirador/content/demo1`, `mirador/public/demo1`

Handoff checklist for Step 10 (pipeline QA + deploy).

---

## Architecture

| Piece | Location |
|-------|----------|
| Route | `app/demo1/page.tsx` |
| Scoped Sacred theme | `app/demo1/demo-globals.css` imported from **`app/globals.css`** (not only demo layout) so Tailwind emits `text-hero-glass-text` / `from-hero-scrim/*` utilities; `@theme` uses **literal hex** |
| Data | `content/demo1/property.json` |
| Hero MP4 (prod) | Cloudflare R2 public URL (see below) |
| Gallery stills | `public/demo1/gallery/*.webp` (git) |
| OG card | `app/demo1/opengraph-image.tsx` → bake → `public/demo1/og-card.jpg` |
| Analytics | PostHog via root `PosthogAnalytics` + `demo1_*` events |

---

## Agent & WhatsApp (`wa.me`)

In `property.json`:

- **name:** Mansur Arevalo  
- **phone:** +57 304 336 2502 (display + `tel:` link)  
- **whatsapp:** `573043362502` (digits only)

**What `wa.me` means:** WhatsApp’s click-to-chat URL. Format:

`https://wa.me/573043362502?text=...`

Country code `57` (Colombia) + mobile `3043362502`, no `+` or spaces. The app builds this in `lib/demo1/property.ts` → `whatsappHref()`.

---

## Hero video (R2)

**Production URL (default in code):**

`https://pub-8d93aaffda7e41a99f7984129f0a3674.r2.dev/hero-scrub.mp4`

Override in Vercel:

```env
NEXT_PUBLIC_DEMO1_SCRUB_MP4_URL=https://pub-8d93aaffda7e41a99f7984129f0a3674.r2.dev/hero-scrub.mp4
```

Local fallback: same URL (no need to ship ~25 MB MP4 in git if R2 is always up).

### Scroll-scrub hero (performance)

The hero uses **MP4 + GSAP ScrollTrigger** (`HeroScrollScrub`), not HLS. If scrub feels jumpy:

1. **Encode for seeks** — short GOP (`-g 8`), no B-frames (`-bf 0`), `+faststart`. See `O:\microsites\docs\AI67-SCROLL-SCRUB-RUNBOOK.md`.
2. **Pacing** — `secondsPerViewport` on `app/demo1/page.tsx` (higher = more scroll per second of video = smoother). Default in component is `4`; page uses `4` (try `5` if still fast).
3. **Warmup** — component waits for `canplay`, runs buffer priming seeks (0 / 25% / 50% / 75% / end), then enables scroll. Poster shows until ready.
4. **File size** — ~10 Mbps / 20s MP4 is heavy on mobile over R2; re-encode ~4–6 Mbps if production still stutters.

### R2 CORS (required for `<video crossOrigin>` / scrub)

From repo root, after `npx wrangler login`:

```powershell
# Bucket: ai67-assets (public: pub-8d93aaffda7e41a99f7984129f0a3674.r2.dev)
npx wrangler r2 bucket cors set ai67-assets --file mirador/scripts/demo1-r2-cors.json -y
```

CORS template: `mirador/scripts/demo1-r2-cors.json` (localhost + mirador.lat + mirador.homes).

Verify:

```powershell
npx wrangler r2 bucket cors list ai67-assets
```

---

## Open Graph (1200×630) — WhatsApp share

WhatsApp reads **`og:image`**, not `twitter:image`. It drops images **> ~300 KB** (dynamic PNG is too large).

| Piece | Location |
|-------|----------|
| Baked JPEG (preferred) | `public/demo1/og-card.jpg` (~60 KB) |
| Dynamic source (bake only) | `GET /api/og/demo1` |
| Metadata | `app/demo1/layout.tsx` + `lib/demo1/share-metadata.ts` |

**Do not** add `app/demo1/opengraph-image.tsx` — Next.js would inject a large PNG into `og:image` and override the baked JPEG.

### Bake / refresh card

```powershell
cd O:\Umbral\mirador
npm run dev
# other terminal:
npm run og:bake:demo1
# or against prod (after /api/og/demo1 is deployed):
node scripts/bake-demo1-og.mjs https://mirador.lat
git add public/demo1/og-card.jpg && git commit -m "chore: refresh demo1 OG card"
```

### Test preview

**Facebook Sharing Debugger** (validates tags; does **not** refresh WhatsApp cache):

1. [Sharing Debugger](https://developers.facebook.com/tools/debug/) → **Scrape Again** (twice).
2. Confirm **og:image** = `https://mirador.lat/demo1/og-card.jpg` (JPEG).

**WhatsApp** (separate cache — Debugger “OK” does not fix a stale WA preview):

| Paste this link | Why |
|-----------------|-----|
| **`https://mirador.lat/share/demo1.html`** | Static HTML (same pattern as scene shares). **Preferred for WhatsApp.** |
| `https://mirador.lat/demo1` | Full app page; OK after cache clears |

Steps:

1. Scrape `https://mirador.lat/share/demo1.html` in Sharing Debugger once.
2. Send that URL in a **new** WhatsApp chat (not a thread where you already sent `/demo1`).
3. Wait ~30s for the preview card to build.
4. If still blank: try `https://mirador.lat/share/demo1.html?v=2` once, or Android → Settings → Storage → Clear cache.

Tap opens the listing: link goes to `https://mirador.lat/demo1`.

If Debugger shows **403**, see `docs/whatsapp-og-troubleshooting.md` (Vercel bot protection / Meta crawler).

**mirador.homes listings:** Tour links are `/v/{sceneId}` (OG already uses baked `/og/{sceneId}-card.jpg`). The grid homepage had no `og:image` until `listingsHubMetadata()` — for WhatsApp prefer `https://mirador.homes/share/mirador-homes.html` or a specific `/v/…` URL, not a stale cached `/` link.

---

## Analytics (PostHog)

### Setup (once)

1. Create project at [posthog.com](https://posthog.com) (free tier is fine).
2. Copy **Project API Key** (`phc_…`).
3. Vercel → mirador project → Environment Variables:

   | Variable | Value |
   |----------|--------|
   | `NEXT_PUBLIC_POSTHOG_KEY` | `phc_…` |
   | `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` (or EU host if you chose EU) |

4. Redeploy. Local: add same keys to `mirador/.env.local`.

If the key is missing, analytics no-op safely (no errors in console).

### Events on `/demo1`

| Event | When | Properties |
|-------|------|------------|
| `$pageview` | Every route change (incl. landing on `/demo1`) | `$current_url` |
| `demo1_section_viewed` | Gallery or contact scrolls into view (once each) | `section`, `demo_slug` |
| `demo1_outbound_click` | WhatsApp or phone tap | `channel`, `placement`, `demo_slug` |

`placement`: `nav` | `agent` | `sticky` (mobile bar)

### How to track client shares

1. PostHog → **Activity** → filter `$current_url` contains `demo1`.
2. **Insights** → Funnel:
   - Step 1: `$pageview` where URL contains `/demo1`
   - Step 2: `demo1_section_viewed` `section = galeria`
   - Step 3: `demo1_outbound_click` `channel = whatsapp`
3. **Dashboard** (recommended): pin the funnel + daily `$pageview` on `/demo1`.
4. Optional: add UTM when sharing:  
   `https://mirador.lat/demo1?utm_source=whatsapp&utm_campaign=client-name`  
   PostHog captures query strings on `$pageview`.

---

## Footer (client-facing)

`Demo1Footer` includes:

- Project title + “Demo Mirador”
- Short **non-offer disclaimer** (illustrative data, contact agent for price/availability)
- Links: `mirador.lat`, `#contacto`
- © Mirador

---

## Local dev

```powershell
cd O:\Umbral\mirador
npm run dev
# http://localhost:3000/demo1
```

---

## Deploy

1. Commit `mirador/` changes (exclude `public/demo1/assets/hero-scrub.mp4` if using R2 only).
2. Push to Git remote connected to Vercel.
3. Confirm env vars (`NEXT_PUBLIC_SITE_URL`, PostHog, optional `NEXT_PUBLIC_DEMO1_SCRUB_MP4_URL`).
4. Smoke test production `/demo1` on phone (scroll hero, WhatsApp opens with prefilled text).
5. Run `npm run og:bake:demo1` against production if you want baked OG in repo:  
   `node scripts/bake-demo1-og.mjs https://mirador.lat`

---

## Sync from microsites repo

When you change the standalone app at `O:\microsites\apartment01\web`:

1. Copy components → `mirador/components/demo1/`
2. Merge `content/property.json` → `content/demo1/property.json` (keep `/demo1/` asset paths)
3. Copy new gallery WebPs → `public/demo1/gallery/`
4. Re-run `npm run og:bake:demo1` if hero poster changed

---

## Locale (ES / EN)

| Mode | How |
|------|-----|
| **Spanish (default)** | `/demo1` |
| **English** | `/demo1?lang=en` |

Nav toggle (next to Contacto) updates `?lang=` without reload. Copy lives in `content/demo1/property.json` → `copy.es` / `copy.en`; UI chrome in `lib/demo1/messages.ts`. Revert by using `/demo1` only (no `lang` param).

---

## Not in v1 (per product decision)

- Homepage link to `/demo1` (add later in `MarketingSections`)
- Hero HLS loop (`HeroHls`) — scroll-scrub only
- Gallery room labels
- 3D tour CTA in hero

---

## Related docs

- Gap analysis: `O:\microsites\docs\AI67-MICROSITE-GAP-ANALYSIS.md`
- WhatsApp OG: `mirador/docs/whatsapp-og-troubleshooting.md`
- R2 setup: `mirador/docs/cloudflare-r2-setup.md`
