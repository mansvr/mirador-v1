# Mirador

Next.js **App Router** viewer for **3D Gaussian splats** (SOGS via [Spark](https://sparkjs.dev/)): `/v/[sceneId]`, embed `/e/[sceneId]`, branded slugs `/[tenant]/[property]`.

## Local dev

```bash
npm install
npm run dev
```

- Default redirect: `/` → `/v/scene_best50000` (see `app/page.tsx`).
- Local scenes live in `scenes/<sceneId>/scene.json` when `NEXT_PUBLIC_R2_URL` is unset or placeholder (see `lib/scene.ts`).

Copy `.env.example` → `.env.local` and adjust.

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
2. **Environment variables** (Production + Preview): set the table above. **`NEXT_PUBLIC_SITE_URL`** must match the URL you use in the browser for that environment (e.g. `https://mirador-xxxx.vercel.app` on Preview, `https://tours.yourdomain.com` in prod).
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
