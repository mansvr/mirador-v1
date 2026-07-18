/**
 * Bake photo-only OG card JPEG for WhatsApp (≤ ~300 KB, 1200×630).
 * No Mirador text overlay — title/description live in the link preview block below.
 *
 * Source (first match wins):
 *   1. public/og/{sceneId}.jpg
 *   2. R2 {sceneId}/og-poster.jpg (NEXT_PUBLIC_R2_URL from .env.local or env)
 *
 * Usage:
 *   npm run og:bake -- scene_jardin-interno_01
 *   node scripts/bake-og-card.mjs scene_best50000
 *
 * @see docs/share-og-workflow.md
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const sceneId = process.argv[2];
if (!sceneId) {
  console.error("Usage: npm run og:bake -- <sceneId>");
  process.exit(1);
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const env = {
  ...loadDotEnv(path.join(process.cwd(), ".env.local")),
  ...process.env,
};

const outDir = path.join("public", "og");
const outPath = path.join(outDir, `${sceneId}-card.jpg`);
const localStill = path.join(outDir, `${sceneId}.jpg`);

async function loadSourceBytes() {
  if (fs.existsSync(localStill)) {
    console.log("Source: local", localStill);
    return fs.readFileSync(localStill);
  }

  const r2Base = (env.NEXT_PUBLIC_R2_URL ?? env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");
  if (!r2Base) {
    throw new Error(
      `No public/og/${sceneId}.jpg and NEXT_PUBLIC_R2_URL unset. ` +
        `Upload OG poster at H-GATE first, or save a still to public/og/${sceneId}.jpg`,
    );
  }

  for (const file of ["og-poster.jpg", "thumbnail.webp"]) {
    const url = `${r2Base}/${sceneId}/${file}`;
    console.log("Source: R2", url);
    const res = await fetch(url);
    if (res.ok) {
      return Buffer.from(await res.arrayBuffer());
    }
  }

  throw new Error(`R2 fetch failed for ${sceneId}/og-poster.jpg and thumbnail.webp`);
}

const input = await loadSourceBytes();
fs.mkdirSync(outDir, { recursive: true });

let quality = 82;
let out = await sharp(input)
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality, mozjpeg: true })
  .toBuffer();

while (out.length > 300 * 1024 && quality > 40) {
  quality -= 8;
  out = await sharp(input)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}

fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath} (${(out.length / 1024).toFixed(1)} KB, q=${quality})`);
console.log("Next: npm run og:share-page --", sceneId, "(if share HTML missing)");
console.log("Then: vercel deploy --prod");
