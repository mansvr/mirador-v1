# WhatsApp / Facebook link preview (403 in Sharing Debugger)

If [Sharing Debugger](https://developers.facebook.com/tools/debug/) shows **403** and only `mirador.lat` as title (no `og:image`), Meta’s crawler is being blocked **before** Next.js runs — not an OG markup bug.

## Fix 1 — Vercel Firewall (most common on `*.vercel.app` / custom domains)

1. [Vercel Dashboard](https://vercel.com) → project **mirador-v1** → **Firewall** (or **Security**).
2. **Disable** “Bot Protection” / “Attack Challenge Mode” on **Production**, **or** add an **Allow** rule:
   - **User-Agent** contains `facebookexternalhit`
   - **OR** contains `Facebot`
   - **OR** contains `meta-externalagent`
3. **Deployment Protection**: **Settings** → **Deployment Protection** → Production must be **public** (not password / Vercel Authentication).
4. **Redeploy** production after changes.

Known issue: Meta’s datacenter IPs are sometimes blocked by Vercel DDoS mitigation while `curl -A facebookexternalhit` from your PC returns 200. See [Vercel community thread](https://community.vercel.com/t/facebook-sharing-debugger-returns-403-meta-crawler-blocked-by-vercel-ddos-mitigation/41737).

## Fix 2 — Cloudflare (only if `mirador.lat` is proxied orange-cloud)

1. Cloudflare → domain → **Security** → **Bots**.
2. Allow **Verified bots** or add WAF skip for User-Agent `facebookexternalhit`.
3. Do not challenge Meta crawlers on `/v/*` and `/og/*`.

## Fix 3 — After access works

1. Confirm **robots.txt**: https://mirador.lat/robots.txt (200, allows crawlers).
2. Confirm **OG image**: https://mirador.lat/og/scene_best50000.jpg (200, JPEG).
3. Sharing Debugger → paste `https://mirador.lat/v/scene_best50000` → **Scrape Again** (twice).
4. WhatsApp: paste link in **Message yourself** (new message; cache is sticky).

## Expected OG tags (when scrape succeeds)

| Tag | Example |
|-----|---------|
| `og:title` | Best splat — 50k |
| `og:description` | Tour virtual 3D · … |
| `og:image` | `https://mirador.lat/og/scene_best50000.jpg` |

Composite card (photo + title overlay): https://mirador.lat/api/og/scene_best50000
