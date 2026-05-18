# WhatsApp / Facebook link preview (403 in Sharing Debugger)

If [Sharing Debugger](https://developers.facebook.com/tools/debug/) shows **403** and only `mirador.lat` as title (no `og:image`), Meta’s crawler is being blocked **before** Next.js runs — not an OG markup bug.

Your custom **Bypass** rule can be correct and Meta may still get **403** (Vercel edge blocks Meta’s datacenter IPs, not your PC). `curl -A facebookexternalhit` returning 200 does **not** mean the Debugger will pass.

## Quick test — is it only `mirador.lat`?

In Sharing Debugger, try:

`https://mirador-v1-six.vercel.app/v/scene_best50000`

| Result | Meaning |
|--------|---------|
| **200** on vercel.app, **403** on mirador.lat | Custom domain / extra proxy layer — see Fix 2 (Cloudflare) and Fix 1b |
| **403** on both | Vercel Bot Protection / DDoS layer — Fix 1b |

## Fix 1 — Vercel Firewall (most common on `*.vercel.app` / custom domains)

1. [Vercel Dashboard](https://vercel.com) → project **mirador-v1** → **Firewall** (or **Security**).
2. **Disable** “Bot Protection” / “Attack Challenge Mode” on **Production**, **or** add an **Allow** rule:
   - **User-Agent** contains `facebookexternalhit`
   - **OR** contains `Facebot`
   - **OR** contains `meta-externalagent`
3. **Deployment Protection**: **Settings** → **Deployment Protection** → Production must be **public** (not password / Vercel Authentication).
4. **Redeploy** production after changes.

Known issue: Meta’s datacenter IPs are sometimes blocked by Vercel DDoS mitigation while `curl -A facebookexternalhit` from your PC returns 200. See [Vercel community thread](https://community.vercel.com/t/facebook-sharing-debugger-returns-403-meta-crawler-blocked-by-vercel-ddos-mitigation/41737).

### Fix 1b — If Bypass rule still shows 403

1. **Firewall → Bot Protection** (managed): set to **Off** for Production (not only a custom Allow rule).
2. Confirm the Bypass rule is enabled for **Production** and ordered **above** Deny/Challenge rules.
3. **Settings → Deployment Protection**: Production = **not** password-protected.
4. Optional: open a [Vercel support](https://vercel.com/help) ticket: “Meta crawler AS32934 gets 403 on HTML for OG scrape.”

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

## Fix 4 — R2 share page (works while Vercel blocks Meta)

Host a tiny HTML file on **R2** (same bucket as splats). Meta scrapes `*.r2.dev` without hitting Vercel.

### Upload once (dashboard or Wrangler)

From repo `mirador/`:

```bash
# Workshop photo for og:image
wrangler r2 object put mirador-scenes/og/scene_best50000.jpg --file=public/og/scene_best50000.jpg --content-type=image/jpeg

# Share page (OG only — no meta-refresh to mirador.lat; Meta follows that and gets 403)
wrangler r2 object put mirador-scenes/share/scene_best50000.html --file=r2-share/scene_best50000.html --content-type=text/html

# robots.txt at bucket root (Debugger checks this on r2.dev)
wrangler r2 object put mirador-scenes/robots.txt --file=r2-share/robots.txt --content-type=text/plain
```

**Important:** Do not use `<meta http-equiv="refresh" href="https://mirador.lat/...">` on the share page. Facebook follows it, hits Vercel, sees **403**, and the Debugger blames the R2 URL.

### Links

| Use | URL |
|-----|-----|
| **Paste in WhatsApp** (preferred) | `https://mirador.lat/share/scene_best50000.html` |
| **Opens tour** (after tap) | `https://mirador.lat/v/scene_best50000` |

Static file lives in `public/share/` (no Next.js SSR). `/og/scene_best50000.jpg` is also static.

**Note:** `pub-….r2.dev/share/…` often returns **403 for Meta’s IPs** even when your browser shows 200. Use **mirador.lat** for link previews; keep R2 for `.sog` assets only.

Debugger: `https://mirador.lat/share/scene_best50000.html` → **Scrape Again**.

CORS on R2 does **not** apply to OG scrape (server-side fetch).
