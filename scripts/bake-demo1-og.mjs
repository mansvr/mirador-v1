/**
 * Bake /demo1/opengraph-image PNG → JPEG for WhatsApp (≤ ~300 KB).
 * Requires dev or prod server: npm run dev  OR  npm run build && npm run start
 *
 * Usage: node scripts/bake-demo1-og.mjs [baseUrl]
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const baseUrl = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = path.join("public", "demo1");
const outPath = path.join(outDir, "og-card.jpg");

const res = await fetch(`${baseUrl}/demo1/opengraph-image`);
if (!res.ok) {
  throw new Error(
    `fetch failed: ${res.status} ${res.url}\nStart the app first: npm run dev`,
  );
}
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
console.log(`Wrote ${outPath} (${(out.length / 1024).toFixed(1)} KB, q=${quality})`);
