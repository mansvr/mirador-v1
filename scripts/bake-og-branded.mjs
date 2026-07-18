/**
 * Legacy: bake branded overlay card from /api/og PNG (demo1 / one-off use).
 * Standard tours use photo-only `npm run og:bake` — see docs/share-og-workflow.md
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const sceneId = process.argv[2] ?? "scene_best50000";
const baseUrl = (process.argv[3] ?? "https://mirador.lat").replace(/\/$/, "");
const outDir = path.join("public", "og");
const outPath = path.join(outDir, `${sceneId}-card.jpg`);

const res = await fetch(`${baseUrl}/api/og/${sceneId}`);
if (!res.ok) throw new Error(`fetch failed: ${res.status} ${res.url}`);
const buf = Buffer.from(await res.arrayBuffer());

fs.mkdirSync(outDir, { recursive: true });

let quality = 82;
let out = await sharp(buf)
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality, mozjpeg: true })
  .toBuffer();

while (out.length > 300 * 1024 && quality > 40) {
  quality -= 8;
  out = await sharp(buf)
    .resize(1200, 630, { fit: "cover" })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}

fs.writeFileSync(outPath, out);
console.log(`Wrote branded ${outPath} (${(out.length / 1024).toFixed(1)} KB, q=${quality})`);
