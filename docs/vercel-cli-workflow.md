# Mirador — Git + local + Vercel CLI workflow

## Source of truth

| Layer | Role |
|-------|------|
| **`mansvr/mirador-v1` on GitHub** | Canonical **code** history. Every feature/fix → commit → push → Vercel **Production** (or Preview on PRs). |
| **`O:\Umbral\mirador` (this folder)** | Your **working copy**. Same repo; `git pull` / `git push` keeps it aligned with GitHub. |
| **Vercel project `mansurme/mirador-v1`** | **Hosting** + env vars + domains. Deploys from Git; CLI uses `.vercel/` link for commands only. |

Do **not** treat Vercel as the editor of record for code. Treat **Git** as source of truth and Vercel as **where it runs**.

## What we configured locally

```text
vercel login          → signed in (CLI)
vercel link           → O:\Umbral\mirador ↔ mansurme/mirador-v1
```

`.vercel/` is in `.gitignore` (machine-specific link; each dev runs `vercel link` once).

## Day-to-day workflow (recommended)

### Normal feature work

1. Edit code in **`O:\Umbral\mirador`** (or Cursor).
2. Test locally: `npm run dev` (uses `.env.local` if present).
3. `git add` / `git commit` / `git push` → **`main`** on GitHub.
4. Vercel **auto-deploys** from Git (you already set this up).
5. Verify on **`https://mirador-v1-six.vercel.app`** or **`https://mirador.lat`** when DNS is ready.

### When to use the CLI (agent or you)

| Task | Command |
|------|---------|
| Pull env for local dev | `vercel env pull .env.local` (overwrites; backup first) |
| List remote env | `vercel env ls` |
| Add/update env | Dashboard or `vercel env add` |
| Preview deploy **without** pushing | `vercel` (preview URL) — optional |
| Production deploy **without** Git | `vercel --prod` — **avoid** if Git is connected; use push to `main` instead |
| Logs / inspect | `vercel logs`, dashboard |
| Plugin in Cursor | `/vercel-plugin:status`, `/vercel-plugin:env` |

**Best practice:** prefer **Git push** for production deploys so GitHub and Vercel stay in sync. Use **`vercel`** preview only for quick experiments.

### Environment variables

- **Set in Vercel dashboard** (or `vercel env add`) — not committed.
- **Pull locally** when you need parity with production:

  ```powershell
  cd O:\Umbral\mirador
  vercel env pull .env.local
  ```

- Keep **`vercel-import.env`** as the template for re-import / documentation.

Current remote vars (encrypted on Vercel): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_R2_URL`.

### R2 assets

- **Code** → Git → Vercel.
- **`.sog` / `scene.json` on R2** → upload in Cloudflare dashboard (or future automation). Changing splats does **not** require `vercel link` again.

## If local and GitHub diverge

```powershell
cd O:\Umbral\mirador
git fetch origin
git status
git pull origin main
```

Never edit production only on Vercel’s filesystem (there isn’t one for App Router source)—always push from Git.

## Cursor Vercel plugin

After `vercel login` + `vercel link`, slash commands can target **this** project:

- `/vercel-plugin:status`
- `/vercel-plugin:env`
- `/vercel-plugin:deploy` (preview; prefer Git for prod)
