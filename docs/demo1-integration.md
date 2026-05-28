# Demo1 integration — AI67 listing microsite

**Live path:** `https://mirador.lat/demo1`  
**Source (iterate):** `O:\microsites\apartment01\web`  
**Deployed copy:** `mirador/app/demo1`, `mirador/components/demo1`, `mirador/content/demo1`, `mirador/public/demo1`

Handoff checklist for Step 10 (pipeline QA + deploy).  
**Last status pass:** 2026-05-28 · live at `https://mirador.lat/demo1` (also `mirador.homes/demo1` when routed).

---

## Handoff status vs pipeline + Blender docs

Source checklists: `O:\microsites\docs\AI67-HERO-TO-MICROSITE-PIPELINE.md` (Step 10), `BLENDER-ARCHVIZ-MICROSITE-HANDOFF.md`, `AI67-MICROSITE-GAP-ANALYSIS.md`.

### Your read (mostly right)

For **product UX on the live microsite**, the two highest **impact × ROI** gaps left are:

1. **3D tour CTA block** — `property.json` still has `ctas.primary` (“Ver recorrido 3D”) but nothing on the page links to the splat tour (`/v/scene_best50000`). Without this, the listing story stops at scroll-scrub + stills.
2. **Stakeholder handoff package** — operational closure (URLs, assets, share playbook), not a page feature.

Everything else from the original handoff is either **shipped**, **resolved with a deliberate substitute**, or **Phase 2+ / low ROI** for v1.

### Implemented on `/demo1`

| Handoff item | Where / notes |
|--------------|----------------|
| Nav pill + WhatsApp | `FloatingNav` (compact 3-column layout) |
| Spec strip | `SpecStrip` + verified line |
| Bento gallery | 12 WebPs incl. wide floor plan (`0014`, `fit: contain`) |
| Agent + phone + WhatsApp | Real agent (Mansur Arevalo, `573043362502`) |
| Agent headshot | `public/demo1/assets/agent-headshot.webp` |
| Mobile sticky CTA | `AgentBlock` bottom bar (secondary CTA copy) |
| Hero video | **Scroll-scrub MP4** on R2 (`HeroScrollScrub` + GSAP ScrollTrigger) |
| Hero scroll hint | `HeroScrollIndicator` inline in glass card footer (see [Hero copy card](#hero-copy-card-glass-block)) |
| Loading + prefetch | Default on `/demo1` (`Demo1LoadingScreen`, `useDemo1Prefetch`) |
| GSAP hero entrance | Default on `/demo1` (`HeroCopyCard`, blur → sharp) |
| ES / EN locale | Nav toggle + `copy.es` / `copy.en`; `?lang=en` |
| OG 1200×630 for WhatsApp | Baked `public/demo1/og-card.jpg` + `share/demo1.html` |
| Listings hub OG | `mirador.homes` share page + metadata (separate commit) |
| PostHog funnel | `demo1_section_viewed`, `demo1_outbound_click` |
| Client footer + disclaimer | `Demo1Footer` |
| Deploy | Vercel · `main` → production |

### Resolved differently (not missing — document the choice)

| Original handoff | What we shipped instead |
|------------------|-------------------------|
| HLS loop hero (`HeroHls`, Cloudflare Stream `.m3u8`) | **Scroll-scrub MP4** only — better interaction; `hlsUrl` remains `null`. Stream UID optional for archive/Reels, not required for current hero. |
| `LoadingScreen` 000→100 counter (2.7s) | Branded Mirador loader tied to **real** scrub warmup (not fake progress) |
| Framer `whileInView` on every section | **Not default** — tried, felt jumpy; available via `?motion=reveal` only |
| **Parallax gallery** (Hyliox-style) | **Removed** after preview — scope/perf; do not reintroduce without new brief |
| **Cycling specs** in hero | Static spec line (cleaner for listings) |
| Cormorant + Source Sans 3 | Cormorant + **Manrope** (Sacred tokens) |
| Asymmetric 7/5/5/7 bento | Uniform responsive bento grid |
| Agent **form** | WhatsApp + `tel:` only (conversion path for v1) |
| `FooterMarquee` + footer HLS echo | Text footer only |
| `SplatViewerGate` / `R3FViewerGate` inline | **Deferred** — use full-page tour at `/v/scene_best50000` when CTA ships |
| Similar units / journal sections | Out of v1 scope |

### Still open — priority

| Item | ROI | Notes |
|------|-----|--------|
| **3D CTA section** (hero and/or `#recorrido` + link to tour) | **High** | Tour exists: `https://mirador.lat/v/scene_best50000`. Wire `ctas.primary`; optional click-to-load gate later. |
| **Handoff package** (below) | **High (ops)** | One-pager for stakeholder + archive pointers |
| Gallery **room labels** | Low–medium | All `title: ""` in `property.json` |
| **`hero_reels_9x16.mp4`** | Medium (marketing) | Social/Reels/Stories; `hlsUrlVertical` still `null` |
| Homepage → `/demo1` link | Medium (distribution) | `MarketingSections` — deliberate v1 omit |
| Dedicated **Stream asset UID** in handoff | Low for current hero | Only needed if you publish HLS loop or host Reels on Stream |
| Custom **demo1 favicon** | Low | Site uses global `app/icon.svg` |
| Inline **contact form** | Low for v1 | Handoff Pro tier |

### Stakeholder handoff package (checklist)

Deliver when closing the AI67 demo (copy into a one-pager or `docs/ai67-stakeholder-handoff.md`):

**Live & product**

- [x] Live microsite URL: `https://mirador.lat/demo1`
- [x] English preview: `https://mirador.lat/demo1?lang=en`
- [ ] 3D tour URL (link from microsite once CTA ships): `https://mirador.lat/v/scene_best50000`
- [x] WhatsApp share URL (preview card): `https://mirador.lat/share/demo1.html`
- [x] Listings hub (if using homes): `https://mirador.homes/home` · tour deep link `/v/scene_best50000`

**Share playbook**

- [x] WhatsApp link preview — static `share/demo1.html` + baked JPEG; see [Open Graph](#open-graph-1200630--whatsapp-share)
- [ ] **Reels / Stories** — `hero_reels_9x16.mp4` not in repo (encode per pipeline Step 6; center-safe crop from master)
- [ ] **UTM template** for agent campaigns: `?utm_source=whatsapp&utm_campaign={agent-slug}`
- [x] PostHog — events documented in [Analytics](#analytics-posthog)

**Archive masters (paths / cloud)**

- [x] Hero scrub MP4 (production): R2 `pub-8d93aaffda7e41a99f7984129f0a3674.r2.dev/hero-scrub.mp4`
- [ ] `hero_loop.mp4` master (16:9 loop for Stream) — if encoded separately from scrub
- [ ] Cloudflare **Stream asset UID** + `.m3u8` URL — if/when HLS is published
- [x] `poster.webp` — `public/demo1/assets/poster.webp`
- [x] Gallery WebPs — `public/demo1/gallery/*.webp`
- [x] OG card — `public/demo1/og-card.jpg`
- [x] Source of truth — `content/demo1/property.json`
- [ ] Blender scene + render settings — `O:\microsites\docs\AI67-SCROLL-SCRUB-RUNBOOK.md` + `.blend` path on disk

**QA sign-off**

- [x] Mobile scroll-scrub + WhatsApp CTA smoke-tested on production
- [ ] iOS/Android scroll-scrub regression when 3D CTA adds new scroll targets
- [x] WhatsApp OG validated (Sharing Debugger + fresh chat)

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

### Hero copy card (glass block)

Bottom-left overlay on the scroll-scrub hero. **Do not** float “Deslizar” over the card corner on mobile — it overlapped copy. The approved layout keeps meta + scroll hint in **one row** directly under the divider.

**Code**

| Piece | Location |
|-------|----------|
| Card shell + layout | `components/demo1/Demo1PageContent.tsx` (`heroCardClassName`, footer row) |
| GSAP entrance | `components/demo1/HeroCopyCard.tsx` |
| Scroll hint | `components/demo1/HeroScrollIndicator.tsx` (`variant="inline"`) |
| Scrub progress for hint | `components/demo1/HeroScrubContext.tsx` ← `HeroScrollScrub` provider |
| Copy / specs | `content/demo1/property.json` → `hero.*`, `specs.*`; specs line from `lib/demo1/messages.ts` |

**Layout (top → bottom)**

```
┌─────────────────────────────────────────────┐
│  AI67                          (hero.title) │
│  Apartamento con acabados…   (description)│
├─────────────────────────────────────────────┤  ← border-t (margin)
│  PROYECTO · MEDELLÍN    │      DESLIZAR    │  ← items-start: same top line
│  1 hab · 2 ba · 92 m²    │         ↓        │
│       (left column)      │    (right col.)  │
└─────────────────────────────────────────────┘
```

| Zone | Source | Notes |
|------|--------|--------|
| Title | `property.hero.title` | No eyebrow above title (listing name leads) |
| Description | `property.hero.description` | |
| Divider | `border-t border-hero-glass-text/10` | Tight padding: `pt-2` / `sm:pt-2.5` |
| Left column | `property.hero.eyebrow` then formatted `specsLine` | Stacked; `flex-1 min-w-0` |
| Right column | `HeroScrollIndicator` inline | Tap scrolls ~40vh; fades when scrub `progress >= 1` |

**Tailwind / alignment**

- Footer row: `flex items-start justify-between gap-3` — **`items-start`** so eyebrow lines up with “Deslizar” at the margin (avoid `items-end`, which pinned the left stack to the bottom of the taller arrow column).
- Card padding: `px-4 py-4` / `sm:px-5 sm:py-6`; description `mt-3` / `sm:mt-4`.

**History (avoid regressions)**

| Attempt | Outcome |
|---------|---------|
| Floating `HeroScrollIndicator` (bottom-right of viewport) | Overlapped glass card on mobile |
| Inline hint in same row as specs only | Eyebrow felt too low |
| Deslizar on its own row above eyebrow | Too much vertical space |
| **Current** — one row, two columns, top-aligned | Shipped default (2026-05-28) |

**Mobile nav (separate)** — `FloatingNav`: below `sm`, hide Galería/Contacto; center ES/EN; Mirador left, WhatsApp right.

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

## Motion polish

| Feature | Default on `/demo1` | Notes |
|---------|---------------------|--------|
| **Loading + prefetch** | Yes | Overlay until scrub MP4 warmup; preload scrub + first gallery stills |
| **GSAP hero entrance** | Yes | Hero glass card blur → sharp (`power3.out`, ~550ms) when scrub ready |
| **Section reveals** | No | Opt-in only — see below |

Resolver: `lib/demo1/motion-mode.ts`. Components: `Demo1LoadingScreen`, `HeroCopyCard`, `Demo1ScrollReveal`, `useDemo1Prefetch`.

### Query overrides

| URL | Behavior |
|-----|----------|
| `/demo1` | Loading + hero entrance (shipped default) |
| `/demo1?motion=reveal` | Default **plus** scroll reveals on spec / gallery / contact |
| `/demo1?motion=all` | Same as `reveal` (default + section reveals) |
| `/demo1?motion=off` | Disable all motion (scroll-scrub + hint only) |
| `/demo1?motion=loading` | Loading only (isolated preview) |
| `/demo1?motion=hero` | Hero entrance only (isolated preview) |

Combine with locale: `/demo1?lang=en&motion=reveal`.

**Not shipped:** cycling specs (`?motion=cycle` reserved). **Parallax** was tried and removed.

---

## Not in v1 (per product decision)

- Homepage link to `/demo1` (add later in `MarketingSections`)
- Hero HLS loop (`HeroHls`) — scroll-scrub only; see [Resolved differently](#resolved-differently-not-missing--document-the-choice)
- Gallery room labels (copy-only; low priority)
- **3D tour CTA** — primary remaining product gap; tour at `/v/scene_best50000`
- **Stakeholder handoff one-pager** — ops checklist above
- `hero_reels_9x16.mp4` / vertical Stream derivative
- Section scroll reveals on default `/demo1` (use `?motion=reveal` to preview); see [Motion polish](#motion-polish)
- Parallax gallery, inline splat gate, footer HLS marquee, agent form, similar listings

---

## Related docs

- Gap analysis: `O:\microsites\docs\AI67-MICROSITE-GAP-ANALYSIS.md`
- WhatsApp OG: `mirador/docs/whatsapp-og-troubleshooting.md`
- R2 setup: `mirador/docs/cloudflare-r2-setup.md`
