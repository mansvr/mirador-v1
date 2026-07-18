# Mirador

Next.js **App Router** viewer for **3D Gaussian splats** (SOGS via [Spark](https://sparkjs.dev/)): `/v/[sceneId]`, embed `/e/[sceneId]`, branded slugs `/[tenant]/[property]`.

## Local dev

```bash
npm install
npm run dev
```

- **`/`** — B2B marketing. **`/home`** — listings grid. **`/v/scene_best50000`** — 3D tour (main local dev URL).
- **Ops guide:** [docs/mirador-operations-guide.md](docs/mirador-operations-guide.md) (URLs, R2, catalog, embeds, `mirador.homes`, localhost).
- **Share / WhatsApp OG:** [docs/share-og-workflow.md](docs/share-og-workflow.md) (H-GATE poster → bake → deploy).
- Local scenes load from `scenes/<sceneId>/scene.json` when that file exists (see `lib/scene.ts`). Splats can use same-origin paths in `render.url` (e.g. `/best-splat_50000.sog` in `public/`).
- Do **not** set `NEXT_PUBLIC_R2_URL` in `.env.local` unless you need to test R2 (`MIRADOR_USE_R2=1` + CORS for `http://localhost:3000`).

Copy `.env.example` → `.env.local` and adjust.

### Embed vs tour URL

| Route | Use |
|-------|-----|
| `/v/<sceneId>` | Full tour page (listing on mobile, share/QR, OG). Open this link directly. |
| `/e/<sceneId>` | **Iframe only** — fullscreen viewer, no listing chrome, `frame-ancestors *`. |

Paste on your site (replace host and scene id):

```html
<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:min(85dvh,900px);min-height:200px">
  <iframe
    src="https://mirador.lat/e/scene_best50000"
    title="Mirador"
    style="position:absolute;inset:0;width:100%;height:100%;border:none;border-radius:12px;display:block"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
```

On desktop, `/v/…` and `/e/…` both look like “only 3D” until you scroll (mobile listing) or use the **Embed** card (desktop, bottom-right on `/v/`).

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | **Production: yes** | Canonical origin for OG metadata, embed snippet, QR (`metadataBase`, `getSiteUrl()`). Use your Vercel production URL (no trailing slash). |
| `NEXT_PUBLIC_R2_URL` or `R2_PUBLIC_URL` | For R2-hosted assets | Public bucket base, e.g. `https://pub-xxxxx.r2.dev`. If missing in dev, scenes load from `scenes/` on disk. |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Enables PostHog (`lib/analytics.ts`). |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Defaults to `https://us.i.posthog.com`. |

## Branded routes (v0)

Static map in `lib/tenants.ts`, e.g.:

- `/umbral/best-splat-50k` → `scene_best50000`
- `/umbral/apto-502-chapinero` → `scene_demo00`

---

## Day 10 — Vercel, R2 CORS, OG / share QA

Do this when you are ready to ship a **preview** or **production** URL.

### 1. Vercel project

1. Import the `mirador/` directory (or monorepo root with **Root Directory** = `mirador`).
2. **Environment variables**
   - **Production:** `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_R2_URL` (see `vercel-import.env`).
   - **Preview:** at minimum `NEXT_PUBLIC_R2_URL` (`vercel-import-preview.env`). `NEXT_PUBLIC_SITE_URL` is optional on Preview — if unset, embed/OG use the deployment hostname automatically.
   - CLI cannot add Preview vars for “all branches” without an interactive prompt; use the dashboard **Import** or add each key with environment **Preview → All Previews**.
3. Deploy; confirm `npm run build` already passes locally.

### 2. R2 CORS (browser loads `.sog` / images from R2)

The **splats and textures** are fetched **from the browser** to R2 → the bucket must allow your app origin.

In **Cloudflare Dashboard → R2 → your bucket → Settings → CORS policy**, add a rule like (adjust origins; duplicate rules if wildcard is not accepted):

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://YOUR-PRODUCTION-DOMAIN",
      "https://YOUR-PROJECT.vercel.app"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 86400
  }
]
```

- Add each **long-lived Preview** hostname if you test previews often, or use your stable staging domain.
- If CORS is wrong: DevTools **Network** shows blocked requests to `*.r2.dev` / custom host.

### 3. OG and unfurl checks

If Facebook Sharing Debugger shows **403**, fix [docs/whatsapp-og-troubleshooting.md](docs/whatsapp-og-troubleshooting.md) (Vercel Firewall / Deployment Protection) before scraping again.

After deploy, with `NEXT_PUBLIC_SITE_URL` correct:

| Check | URL / tool |
|-------|------------|
| Dynamic OG (by scene) | `https://<host>/v/scene_best50000/opengraph-image` |
| Tenant OG | `https://<host>/umbral/best-splat-50k/opengraph-image` |
| Meta | [Sharing Debugger](https://developers.facebook.com/tools/debug/) |
| X | [Card Validator](https://cards-dev.twitter.com/validator) (or post a link on a test account) |
| Slack / iMessage | Paste link in a private channel / note to yourself |

### 4. QA checklist (minimal)

- [ ] **Desktop Chrome:** `/v/...` loads splat; waypoints; hotspot; embed copy works; `/e/...` in a local HTML `<iframe>`.
- [ ] **Mobile Chrome:** same route; touch orbit; listing scroll.
- [ ] **Mobile Safari:** WebGL loads; no blank GL (check R2 CORS if asset fails).
- [ ] **Share:** link unfurl shows title + large image where supported.
- [ ] **Embed host:** parent page can iframe `/e/...` (headers already set in `next.config.ts`).

When this list is green, mark **Day 10** complete in `mirador_v0_spec_278ac78c.plan.md`.

## Learn More

- [Next.js](https://nextjs.org/docs)
- [Spark / SOGS](https://sparkjs.dev/)
