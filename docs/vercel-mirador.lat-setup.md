# Vercel + mirador.lat — quick setup

## 1. Import environment variables

1. Open your Vercel project → **Settings** → **Environment Variables**.
2. Click **Import .env** and choose **`vercel-import.env`** from this repo (`mirador/vercel-import.env`).
3. Edit **`NEXT_PUBLIC_R2_URL`** — replace `REPLACE_WITH_YOUR_ACCOUNT` with your real R2 public hostname.
4. Scope: **Production** and **Preview** (or Production only until DNS is live).
5. **Redeploy** after any env change.

## 2. Custom domain in Vercel

1. **Settings** → **Domains** → add:
   - `mirador.lat`
   - `www.mirador.lat` (optional; redirect www → apex or the reverse, pick one canonical URL)
2. Add the DNS records your registrar shows (usually **CNAME** `mirador.lat` → `cname.vercel-dns.com`).
3. When HTTPS works, confirm **`NEXT_PUBLIC_SITE_URL`** is exactly `https://mirador.lat` (or `https://www.mirador.lat` if that is your canonical host).

## 3. R2 CORS (if splats load from R2)

Allow **GET** / **HEAD** from:

- `https://mirador.lat`
- `https://www.mirador.lat` (if used)
- `https://mirador-v1.vercel.app` (or your `*.vercel.app` preview host)

See root **`README.md`** → Day 10 for a JSON CORS template.

## 4. Dashboard / iframe (not full page)

Embed the **minimal** viewer route:

```html
<div style="position:relative;width:100%;aspect-ratio:16/9;max-height:min(85dvh,900px);min-height:280px">
  <iframe
    src="https://mirador.lat/e/scene_best50000"
    title="Mirador"
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>
```

Replace `scene_best50000` with your `scene.json` id. Full listing chrome (description, CTA, embed copy) stays on **`/v/<sceneId>`** or your separate dashboard app.

## 5. Smoke tests after deploy

| URL | Expect |
|-----|--------|
| `https://mirador.lat/v/scene_best50000` | Full viewer (if scene + asset resolve) |
| `https://mirador.lat/e/scene_best50000` | Canvas + HUD only — use inside dashboard iframe |
| `https://mirador.lat/umbral/best-splat-50k` | Tenant slug → same scene |
| `https://mirador.lat/v/scene_best50000/opengraph-image` | OG PNG for share previews |

## 6. Viewer perf debug (stats.js + **H** panel)

Gate: `lib/viewer-debug.ts` — overlay is **not** mounted on Production unless you opt in.

### Go-live checklist

- [ ] **Production** env vars: **`NEXT_PUBLIC_VIEWER_DEBUG` is unset** (or not `1`).
- [ ] Redeploy Production after removing it (env changes need a new build).
- [ ] Open `https://mirador.lat/v/scene_best50000` — press **H** → nothing should appear (no FPS HUD).
- [ ] Splat budgets still apply without the overlay (`docs/spark-assets-and-budget.md`).

### One-off profiling on production

Use this when you need real-device numbers on the live domain (then turn it off again).

1. Vercel → project **mirador-v1** → **Settings** → **Environment Variables**.
2. **Add** (or edit):
   - **Name:** `NEXT_PUBLIC_VIEWER_DEBUG`
   - **Value:** `1`
   - **Environment:** **Production** only (leave Preview/Development unset unless you want it there too).
3. **Deployments** → latest Production → **⋯** → **Redeploy** (or push any commit to `main`).
4. Wait until the deploy is **Ready**.
5. On a desktop browser, open `https://mirador.lat/v/scene_best50000`.
6. Press **H** → stats HUD + lil-gui panel should appear (both were hidden until **H**).
7. Orbit the scene a few seconds; use **Log snapshot → F12 Console** if you need a JSON row to save.
8. When finished: **delete** `NEXT_PUBLIC_VIEWER_DEBUG` (or set value empty) for **Production**.
9. **Redeploy** Production again so the next build strips the overlay from the live site.

**Note:** `NEXT_PUBLIC_*` is baked in at **build** time — toggling the variable without redeploying does not change an already-built deployment.

More detail: `docs/viewer-debug.md`.
