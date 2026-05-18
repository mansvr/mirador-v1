# Cloudflare R2 for Mirador — what it is and how to set it up

## What is R2?

**Cloudflare R2** is object storage (like Amazon S3): you upload files (`.sog`, `scene.json`, thumbnails) and serve them over **HTTPS** from a public URL.

Mirador on **Vercel** is only the **Next.js app** (HTML/JS). It does **not** store your 50–500 MB splat files inside the deployment. Those live in **R2** (or another CDN) and the browser downloads them directly.

```
Browser  →  mirador.lat (Vercel)     →  page + viewer code
Browser  →  pub-xxx.r2.dev (R2)      →  scene.sog, scene.json, thumbnails
```

## Is R2 necessary?

| Situation | Need R2? |
|-----------|----------|
| **Local dev** (`npm run dev`, no `NEXT_PUBLIC_R2_URL`) | **No** — uses `mirador/scenes/<id>/scene.json` on disk; splat can be `public/` or a path in `scene.json`. |
| **Vercel production** with large `.sog` files | **Yes** (or some other object storage + public URL). Git ignores `*.sog`; Vercel builds stay small and fast. |
| **Tiny demo only** (small file committed to `public/`, under ~50 MB and you accept bloated deploys) | **Optional** — not recommended for real listings. |

Your `scene_best50000` uses `"url": "/best-splat_50000.sog"` (same-origin). That works locally with a hard link in `public/`. On Vercel, that file is **not** in the repo unless you upload it elsewhere — **R2 is the intended production path**.

## Advantages

- **Cheap storage** (~$0.015/GB/month) and **no egress fees** to the public internet (big win vs AWS S3 for a heavy 3D asset).
- **Same Cloudflare account** you may already use for DNS (`mirador.lat` can stay on Cloudflare).
- **Fits the Umbral pipeline**: one folder per scene (`/<scene-id>/scene.json`, `scene.sog`, `thumbnail.webp`).
- **CDN-friendly** — Spark fetches the `.sog` by URL; browsers cache like any static file.
- **Scales** to many listings without redeploying the Next app for every new splat.

## Disadvantages

- **Another service** to configure (bucket, public access, CORS).
- **Two origins** — app on Vercel, assets on R2 (must set CORS so WebGL can load splats).
- **Public bucket at v0** — URLs are unguessable scene IDs, not secret signing (v1 can add signed URLs).
- **Upload step** per scene (dashboard, `rclone`, or Wrangler — not automatic until you build the ingest Worker).

## Alternatives (if you skip R2)

| Option | Tradeoff |
|--------|----------|
| **Vercel Blob** | Works, but egress/pricing and Mirador code expect R2 URL shape — you’d adapt `lib/r2.ts`. |
| **AWS S3 + CloudFront** | Standard, but egress cost on large splats adds up. |
| **Commit `.sog` to `public/`** | Simple and wrong for 68 MB+ files; slow deploys, repo bloat. |

For Umbral/Mirador v0, **R2 is the default choice** in your tech notes.

---

## Setup walkthrough (first time)

### 1. Cloudflare account

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com) and sign up / log in.
2. You do **not** need to move `mirador.lat` DNS to Cloudflare to use R2 (but it’s convenient if DNS is already there).

### 2. Create a bucket

1. Left sidebar → **R2 Object Storage** → **Create bucket**.
2. Name: e.g. `mirador-scenes` (globally unique in your account).
3. Location: pick a region close to users (e.g. **Eastern North America** if most traffic is Americas).
4. Create.

### 3. Enable public access (v0 — public listings)

R2 buckets are **private** by default. For v0 public scenes:

**Option A — R2.dev subdomain (fastest)**

1. Open the bucket → **Settings**.
2. Under **Public access** / **R2.dev subdomain**, enable **Allow public access**.
3. Cloudflare gives a URL like: `https://pub-xxxxxxxxxxxxxxxx.r2.dev`
4. That value is your **`NEXT_PUBLIC_R2_URL`** (no trailing slash).

**Option B — Custom domain on R2 (later)**

e.g. `assets.mirador.lat` — nicer URLs, extra DNS step. Use Option A first.

### 4. CORS (required for browser splat loading)

Bucket → **Settings** → **CORS policy** → paste (edit origins):

```json
[
  {
    "AllowedOrigins": [
      "https://mirador.lat",
      "https://www.mirador.lat",
      "http://localhost:3000",
      "https://mirador-v1.vercel.app"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 86400
  }
]
```

Add every hostname where the **viewer** runs (Vercel preview URL, custom domain). Without this, the splat may fail in Chrome with a CORS error in DevTools → Network.

### 5. Upload your first scene

Folder layout in the bucket (keys = paths):

```text
scene_best50000/
  scene.json
  scene.sog          ← your trained/exported file (can rename from best-splat_50000.sog)
  thumbnail.webp     ← optional, for future OG underlay
```

**Upload via dashboard**

1. Bucket → **Objects** → **Upload**.
2. Create prefix `scene_best50000/` and upload files.

**Upload via Wrangler CLI** (optional)

```bash
npm install -g wrangler
wrangler login
wrangler r2 object put mirador-scenes/scene_best50000/scene.sog --file=O:\Umbral\best-splat_50000.sog
wrangler r2 object put mirador-scenes/scene_best50000/scene.json --file=O:\Umbral\mirador\scenes\scene_best50000\scene.json
```

### 6. Align `scene.json` with R2 paths

For R2-hosted splats, `render.url` is usually the **filename inside the scene folder**, not a leading `/`:

```json
"render": {
  "format": "sog",
  "url": "scene.sog",
  ...
}
```

Mirador resolves: `{NEXT_PUBLIC_R2_URL}/scene_best50000/scene.sog`

Keep a **copy** in git under `scenes/scene_best50000/scene.json` for local dev, or use the same JSON in both places.

### 7. Vercel environment variables

In Vercel (or `vercel-import.env`):

```env
NEXT_PUBLIC_SITE_URL=https://mirador.lat
NEXT_PUBLIC_R2_URL=https://pub-xxxxxxxxxxxxxxxx.r2.dev
```

Redeploy. Production will:

- Fetch `scene.json` from `https://pub-xxx.r2.dev/scene_best50000/scene.json`
- Load splat from `https://pub-xxx.r2.dev/scene_best50000/scene.sog`

### 8. Verify

| Test | URL |
|------|-----|
| JSON in browser | `https://pub-xxx.r2.dev/scene_best50000/scene.json` |
| SOG reachable | `https://pub-xxx.r2.dev/scene_best50000/scene.sog` (may download) |
| Viewer | `https://mirador.lat/v/scene_best50000` |
| Embed | `https://mirador.lat/e/scene_best50000` |

If JSON works but the canvas stays black, check **CORS** and that `render.url` matches the uploaded filename.

---

## Cost ballpark

- **Storage**: ~$0.015/GB/month → a 70 MB `.sog` ≈ **$0.001/month** per scene.
- **Class A operations** (writes): pennies at low volume.
- **Egress**: **$0** to the internet on R2 (main reason vs S3 for splats).

---

## Security note (v0)

Public bucket + scene ids like `scene_best50000` = **security by obscurity**. Fine for marketing tours; use signed URLs + private bucket in v1 for paid/password scenes.
