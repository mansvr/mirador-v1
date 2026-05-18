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
