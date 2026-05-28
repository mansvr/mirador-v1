/**
 * Smoke-test OG tags + image for /demo1 (WhatsApp / Meta).
 * Usage: node scripts/test-demo1-og.mjs [baseUrl]
 */
const baseUrl = (process.argv[2] ?? "https://mirador.lat").replace(/\/$/, "");
const pathArg = process.argv[3] ?? "/demo1";
const pageUrl = `${baseUrl}${pathArg.startsWith("/") ? pathArg : `/${pathArg}`}`;

const htmlRes = await fetch(pageUrl, {
  headers: { "User-Agent": "facebookexternalhit/1.1" },
});
if (!htmlRes.ok) {
  console.error(`Page fetch failed: ${htmlRes.status} ${pageUrl}`);
  process.exit(1);
}
const html = await htmlRes.text();

const ogImage =
  html.match(/property="og:image" content="([^"]+)"/)?.[1] ??
  html.match(/content="([^"]+)" property="og:image"/)?.[1];
const ogTitle =
  html.match(/property="og:title" content="([^"]+)"/)?.[1] ?? "(missing)";
const ogUrl =
  html.match(/property="og:url" content="([^"]+)"/)?.[1] ?? "(missing)";

console.log(`URL: ${pageUrl}`);
console.log(`og:title  → ${ogTitle}`);
console.log(`og:url    → ${ogUrl}`);
console.log(`og:image  → ${ogImage ?? "(missing)"}`);

if (!ogImage) {
  console.error("\nFAIL: no og:image");
  process.exit(1);
}

if (ogImage.includes("opengraph-image")) {
  console.warn(
    "\nWARN: og:image still points at dynamic opengraph-image (PNG). WhatsApp may drop it. Use baked /demo1/og-card.jpg only.",
  );
}

const imgRes = await fetch(ogImage, {
  headers: { "User-Agent": "facebookexternalhit/1.1" },
});
if (!imgRes.ok) {
  console.error(`\nFAIL: og:image fetch ${imgRes.status}`);
  process.exit(1);
}
const len = Number(imgRes.headers.get("content-length") ?? 0);
const type = imgRes.headers.get("content-type") ?? "";
console.log(`\nog:image  ${imgRes.status} ${type} ${len ? `${(len / 1024).toFixed(1)} KB` : ""}`);

if (type.includes("jpeg") && len > 0 && len < 300 * 1024) {
  console.log("\nOK: JPEG under 300 KB — good for WhatsApp.");
} else if (type.includes("png")) {
  console.warn("\nWARN: PNG — rebake with npm run og:bake:demo1 and redeploy.");
} else {
  console.warn("\nWARN: check image type/size manually.");
}
