# Local mobile testing (Mirador dev)

Test the **mobile SOG path** (`url_mobile`) before or after R2 upload. No wrangler required for local files.

## One-time setup (done in repo)

| Step | What |
|------|------|
| 1 | `public/scene-mobile.sog` — copy of your cropped export (~61 MB) |
| 2 | `scenes/scene_best50000/scene.json` — `url_mobile`, `pitch_correction_deg_mobile: 0` |
| 3 | Desktop still uses `public/best-splat_50000.sog` via `url` + `pitch_correction_deg: 180` |

If you replace the mobile SOG on disk, copy again:

```powershell
Copy-Item O:\Umbral\mirador\r2-share\scene-mobile.sog O:\Umbral\mirador\public\scene-mobile.sog -Force
```

## Start the dev server

```powershell
cd O:\Umbral\mirador
npm run dev
```

`--hostname 0.0.0.0` is already in `package.json` so your **phone can reach your PC** on the LAN.

Note the URL in the terminal, e.g. `http://localhost:3000` and `http://192.168.x.x:3000`.

Open the scene:

`http://localhost:3000/v/scene_best50000`

(or the LAN IP from your phone — see below)

## How Mirador picks desktop vs mobile

On the **client** (browser), Mirador checks `navigator.userAgent`:

- **Desktop browser** → loads `render.url` → `/best-splat_50000.sog` + pitch **180°**
- **Phone / tablet UA** → loads `render.url_mobile` → `/scene-mobile.sog` + pitch **0°**

Local dev uses `scenes/scene_best50000/scene.json` when R2 is not forced (`lib/scene.ts`). Do **not** set `MIRADOR_USE_R2=1` unless you want to hit production R2 from localhost.

## Method A — Real phone on Wi‑Fi (best)

1. PC and phone on the **same Wi‑Fi**.
2. Find your PC IP: `ipconfig` → IPv4 (e.g. `192.168.1.42`).
3. On the phone Safari/Chrome open:  
   `http://192.168.1.42:3000/v/scene_best50000`
4. Allow Windows Firewall if prompted (Node on port 3000).
5. **Verify:** On phone, use a debug overlay if enabled, or share URL to a friend — easiest check is **file size in Network** (Safari Web Inspector needs Mac + cable; see Method B on Windows).

**What you should see:** Slower load than desktop path, scene **right-side up** without the desktop flip. If black after load, same iOS WebGL limits as production — file may still be too large.

## Method B — Chrome DevTools mobile emulation (on PC)

Good for **URL + orientation logic**, not a perfect substitute for real iOS WebGL.

1. Open `http://localhost:3000/v/scene_best50000` in Chrome.
2. **F12** → toggle **device toolbar** (phone icon) or `Ctrl+Shift+M`.
3. Pick a device (e.g. iPhone 14) — this changes **User-Agent** to mobile.
4. **Hard refresh** (`Ctrl+Shift+R`) so the splat loader runs again with mobile UA.
5. **Network** tab → filter `sog`:
   - Mobile emulation → request **`scene-mobile.sog`**
   - Turn off device toolbar, refresh → **`best-splat_50000.sog`**

Optional: **H** key if viewer debug is on (dev default) — check `activeSplats` vs budget.

## Method C — Force mobile asset on desktop (quick visual)

Temporarily set in `scenes/scene_best50000/scene.json`:

```json
"url": "/scene-mobile.sog",
"pitch_correction_deg": 0
```

(comment out `url_mobile` or ignore it). Restart dev server. Restores after you revert — use Method B for dual-path testing.

## Production / R2 (manual upload — your workflow)

You uploaded via Cloudflare dashboard:

- `scene_best50000/scene.json` (with `url_mobile`, `pitch_correction_deg_mobile`)
- `scene_best50000/scene-mobile.sog`

After **Vercel deploy** with `url_mobile` code:

- Desktop at `https://mirador.lat/v/scene_best50000` → `scene.sog`
- iPhone → `scene-mobile.sog`

JSON-only R2 changes apply in ~60s without redeploy; **first time** for `url_mobile` needs a **code deploy**.

## Deploy to Vercel

From `O:\Umbral\mirador`:

```powershell
git add -A
git status
git commit -m "feat: url_mobile local dev + docs for mobile testing"
git push origin main
```

Vercel auto-builds from `main`. Watch the dashboard, then test `https://mirador.lat/v/scene_best50000` on phone.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Always loads `best-splat_50000.sog` on phone | UA not mobile; or `url_mobile` missing in JSON; hard refresh |
| 404 on `scene-mobile.sog` | File missing in `public/` |
| Loads local JSON but R2 splat | `MIRADOR_USE_R2=1` or no local `scenes/.../scene.json` |
| Upside-down on mobile | Set `pitch_correction_deg_mobile` to `0` or `180` after visual check |
| Phone cannot open LAN URL | Firewall, wrong IP, or dev server not on `0.0.0.0` |
