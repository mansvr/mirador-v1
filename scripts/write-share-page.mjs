/**
 * Generate public/share/{sceneId}.html for WhatsApp (static OG tags).
 *
 * Usage:
 *   npm run og:share-page -- scene_jardin-interno_01
 *   npm run og:share-page -- scene_jardin-interno_01 "Custom title" "Custom description"
 *
 * Title/description default from lib/listings/catalog.json when present.
 */
import fs from "fs";
import path from "path";

const sceneId = process.argv[2];
if (!sceneId) {
  console.error("Usage: npm run og:share-page -- <sceneId> [title] [description]");
  process.exit(1);
}

const catalogPath = path.join("lib", "listings", "catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const entry = catalog.listings?.find((l) => l.sceneId === sceneId);

const title = process.argv[3] ?? entry?.title ?? sceneId;
const neighborhood = entry?.neighborhood ?? "";
const description =
  process.argv[4] ??
  (neighborhood ? `Recorridos 3D · Colombia · ${neighborhood}` : `Recorridos 3D · Colombia · ${title}`);

const site = "https://mirador.lat";
const shareUrl = `${site}/share/${sceneId}.html`;
const tourUrl = `${site}/v/${encodeURIComponent(sceneId)}`;
const ogImage = `${site}/api/og-card/${encodeURIComponent(sceneId)}`;

const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${title} | Mirador</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${shareUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:site_name" content="Mirador" />
    <meta property="og:locale" content="es_CO" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="canonical" href="${shareUrl}" />
  </head>
  <body
    style="
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      background: #070707;
      color: #fafafa;
    "
  >
    <p style="text-align: center; padding: 2rem">
      <a href="${tourUrl}" style="color: #ff6a00; font-size: 1.125rem">Abrir tour 3D en Mirador</a>
    </p>
  </body>
</html>
`;

const outPath = path.join("public", "share", `${sceneId}.html`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log("Wrote", outPath);
