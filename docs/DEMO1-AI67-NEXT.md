# AI67 Demo1 — what’s done & what’s next

> **Quick access** at repo root. Deep reference: [`mirador/docs/demo1-integration.md`](mirador/docs/demo1-integration.md)  
> **Live:** https://mirador.lat/demo1 · **Tour:** https://mirador.lat/v/scene_best50000  
> **Last updated:** 2026-05-28

---

## Tackle next (priority order)

| # | Task | ROI | Action |
|---|------|-----|--------|
| 1 | **3D tour CTA** | High | Wire `property.json` → `ctas.primary` (“Ver recorrido 3D”) to `/v/scene_best50000` (hero button and/or `#recorrido` section). Tour already live. |
| 2 | **Stakeholder handoff one-pager** | High (ops) | Follow [Handoff package — how to assemble](#handoff-package--how-to-assemble); optional draft: `mirador/docs/ai67-stakeholder-handoff.md`. |
| 3 | **9:16 Reels cut** | Medium | Encode `hero_reels_9x16.mp4` per `O:\microsites\docs\AI67-HERO-TO-MICROSITE-PIPELINE.md` Step 6. |
| 4 | Gallery room labels | Low–medium | Fill `title` on items in `mirador/content/demo1/property.json`. |
| 5 | Homepage → `/demo1` | Medium | Link from `MarketingSections` when ready to promote demo. |

**Skip for v1 unless brief changes:** HLS loop hero, parallax gallery, inline splat gate, agent form, Stream UID (scrub-only hero is intentional).

---

## Shipped on `/demo1`

- Scroll-scrub hero (R2 MP4 + GSAP), loading + hero motion default, ES/EN nav toggle
- Glass hero card + inline Deslizar (layout below — **do not regress**)
- Mobile nav: logo · ES/EN · WhatsApp (`sm+` adds Galería / Contacto)
- Bento gallery, spec strip (1 hab · 2 ba · 92 m²), agent + sticky WhatsApp
- OG / WhatsApp share: `https://mirador.lat/share/demo1.html`
- PostHog: `demo1_section_viewed`, `demo1_outbound_click`
- Deploy: Vercel `main` → mirador.lat

---

## Hero copy card (approved layout)

Bottom-left glass block on the scrub hero. Documented in full in [`demo1-integration.md` → Hero copy card](mirador/docs/demo1-integration.md#hero-copy-card-glass-block).

```
┌─────────────────────────────────────────────┐
│  AI67                          (hero.title) │
│  Apartamento con acabados…   (description)  │
├─────────────────────────────────────────────┤  ← border-t (margin)
│  PROYECTO · MEDELLÍN    │      DESLIZAR    │  ← items-start: same top line
│  1 hab · 2 ba · 92 m²    │         ↓        │
│       (left column)      │    (right col.)  │
└─────────────────────────────────────────────┘
```

| Piece | File |
|-------|------|
| Layout | `mirador/components/demo1/Demo1PageContent.tsx` |
| GSAP entrance | `mirador/components/demo1/HeroCopyCard.tsx` |
| Deslizar | `mirador/components/demo1/HeroScrollIndicator.tsx` (`variant="inline"`) |
| Scrub progress | `mirador/components/demo1/HeroScrubContext.tsx` |
| Copy / specs | `mirador/content/demo1/property.json` |

**Rules**

- Footer row: `flex items-start justify-between` — **not** `items-end` (left meta must sit on the margin line with Deslizar).
- **Do not** float Deslizar on the viewport corner — overlaps the card on mobile.
- Eyebrow (`PROYECTO · MEDELLÍN`) lives **below** the divider, not above the title.

**Layout history (avoid redoing dead ends)**

| Attempt | Result |
|---------|--------|
| Floating Deslizar bottom-right | Overlap on mobile |
| Inline footer without two columns | Eyebrow / specs felt misaligned |
| Deslizar on its own row above meta | Too tall |
| **Current** — one row, two columns, top-aligned | Shipped |

---

## Handoff package — how to assemble

The handoff package is **not more product code** — it is a **small bundle of links, files, and instructions** so Mansur (or any stakeholder) can share the listing without asking you again. Think of it as three layers you assemble in order.

### What you are delivering

| Layer | Audience | Format |
|-------|----------|--------|
| **1. Stakeholder one-pager** | Agent, client, investor | 1–2 page PDF or Notion/Google Doc |
| **2. Share playbook** | Agent doing WhatsApp / IG | Copy-paste links + “how to share” |
| **3. Archive index** | You / Mirador ops | Folder or doc listing masters + cloud URLs |

The checklist in [`mirador/docs/demo1-integration.md`](mirador/docs/demo1-integration.md) is the inventory; the **one-pager** is what you actually send.

### Recommended order (about 1–2 hours)

#### Step 1 — Close the product gap that blocks the package (optional but strong)

The handoff reads incomplete if the microsite does not link to the tour.

- Tour already live: https://mirador.lat/v/scene_best50000
- Add a **“Ver recorrido 3D”** button (hero and/or `#recorrido`) → that URL
- Then the one-pager can say: *“Microsite + tour are one story.”*

You can ship the package **without** this, but you will keep explaining the tour URL separately.

#### Step 2 — Draft the stakeholder one-pager (30 min)

Use this outline; fill blanks from `mirador/content/demo1/property.json`:

1. **Title** — AI67 · Medellín · 1 hab · 92 m² (specs now correct on site)
2. **Live links** (table)
   - Microsite (ES): https://mirador.lat/demo1
   - English: https://mirador.lat/demo1?lang=en
   - 3D tour: https://mirador.lat/v/scene_best50000
   - WhatsApp preview (share this in chats): https://mirador.lat/share/demo1.html
3. **How to share on WhatsApp**
   - Paste `share/demo1.html` (not `/demo1` directly) so the card shows image + title
   - Suggested message (ES): one line + link
4. **Contact** — Mansur, phone, WhatsApp button behavior on site
5. **Disclaimer** — same as footer (illustrative, not an offer)
6. **What’s inside the demo** — scroll hero, gallery, 3D tour (bullet list)
7. **Known limits** — demo material, no HLS loop, no form, etc.

Keep tone non-technical. No repo paths on page 1.

#### Step 3 — Share playbook (15 min)

**WhatsApp (done technically; document the habit)**

| Do | Don’t |
|----|--------|
| Share `https://mirador.lat/share/demo1.html` | Share bare `/demo1` if you care about preview card |
| Test in a fresh chat after deploy | Assume old OG cache |

**UTM (optional, for tracking)**

Add when the agent shares in campaigns:

```
https://mirador.lat/share/demo1.html?utm_source=whatsapp&utm_medium=agent&utm_campaign=mansur-ai67
```

PostHog will attribute if those params are on the landing URL. Document one canonical template in the one-pager.

**Reels / Stories (only if you want social derivatives in the package)**

Pipeline Step 6 — center crop from hero master:

```powershell
ffmpeg -y -i hero_loop.mp4 -vf "crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920" -c:v libx264 -crf 20 -an hero_reels_9x16.mp4
```

If your **production hero is scrub-only** on R2, export 9:16 from the same Blender sequence or from `hero-scrub.mp4` (may need a different crop). Handoff can say: *“Reels cut: pending”* or attach the file in a Drive folder.

#### Step 4 — Archive index (20–30 min)

Stakeholders rarely need this; **you** need it for the next listing. One table:

| Asset | Location |
|-------|----------|
| `property.json` | `mirador/content/demo1/property.json` |
| Hero scrub MP4 | R2 `https://pub-8d93aaffda7e41a99f7984129f0a3674.r2.dev/hero-scrub.mp4` |
| `poster.webp`, gallery, OG | `mirador/public/demo1/` |
| Blender + scrub runbook | `O:\microsites\docs\AI67-SCROLL-SCRUB-RUNBOOK.md` + path to `.blend` |
| `hero_loop.mp4` / Stream UID | **Skip** unless you encode HLS for loop/Reels — scrub path replaced loop for v1 |

Zip or copy to something like `O:\microsites\deliverables\ai67-2026-05\` with a short `README.txt` pointing at the live URLs.

#### Step 5 — QA sign-off block (10 min)

Copy into the one-pager as “Verified”:

- [ ] `/demo1` on iPhone + Android: scroll hero, WhatsApp opens
- [ ] `share/demo1.html` preview in WhatsApp (or Meta Sharing Debugger once)
- [ ] Specs: 1 hab · 2 ba · 92 m²
- [ ] Tour loads on mobile data

Skip the old pipeline HLS checklist (iOS HLS autoplay, `hls.js`) — you shipped **scroll-scrub**, not Stream hero.

### What you can skip for v1

| Pipeline handoff item | Verdict |
|----------------------|---------|
| Stream asset UID + `.m3u8` | Skip unless you publish HLS |
| `hero_loop.mp4` for Stream | Optional archive only |
| Gallery room labels | Nice copy pass, not handoff-blocking |
| Custom demo1 favicon | Low priority |

### Where to put the finished artifacts

| Home | Use |
|------|-----|
| **Ops / Mirador** | `mirador/docs/ai67-stakeholder-handoff.md` (next to integration doc) |
| **Production archive** | `O:\microsites\deliverables\ai67-stakeholder-handoff.md` + PDF export for Mansur |

Integration doc stays the **engineering** source; the stakeholder doc is **human-facing**.

### Minimal “done” definition

You are finished when someone can:

1. Open the one-pager
2. Tap microsite + tour + WhatsApp share link
3. Know which link to paste in WhatsApp
4. (Optional) Find masters in one folder without asking you

### Suggested next actions

| Order | Action |
|-------|--------|
| **A** | Wire **3D CTA** on site first, then write the one-pager with tour linked from the microsite |
| **B** | **Draft** `mirador/docs/ai67-stakeholder-handoff.md` now with current URLs and Spanish share copy; add 3D CTA later |

---

## Local mobile test

From `mirador/`:

```powershell
npm run dev
```

Phone on same Wi‑Fi (not `localhost`):

```text
http://<YOUR_PC_IP>:3000/demo1
```

Find IP: `(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notlike '169.254*' }).IPAddress`

Allow Node through Windows Firewall if needed.

---

## Related docs

| Doc | Path |
|-----|------|
| Integration / OG / R2 / motion | `mirador/docs/demo1-integration.md` |
| Pipeline Step 10 | `O:\microsites\docs\AI67-HERO-TO-MICROSITE-PIPELINE.md` |
| Gap analysis (may be stale) | `O:\microsites\docs\AI67-MICROSITE-GAP-ANALYSIS.md` |
| Scroll-scrub encode | `O:\microsites\docs\AI67-SCROLL-SCRUB-RUNBOOK.md` |
| Archviz handoff philosophy | `O:\microsites\docs\BLENDER-ARCHVIZ-MICROSITE-HANDOFF.md` |

---

## Motion query params (reference)

| URL | Behavior |
|-----|----------|
| `/demo1` | Loading + hero entrance (default) |
| `/demo1?lang=en` | English |
| `/demo1?motion=reveal` | + section scroll reveals |
| `/demo1?motion=off` | Motion off (scrub + hint only) |
