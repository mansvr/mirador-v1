import fs from "fs/promises";
import path from "path";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 700;
  style: "normal";
};

/**
 * Must match the `name` passed to Satori `fonts[]` (Satori lowercases for lookup).
 * Use the real family label — same as next/font Cormorant_Garamond on the site.
 */
export const OG_FONT_DISPLAY = "Cormorant Garamond";

/** Embedded UI sans for OG headlines (not the system stack). */
export const OG_FONT_UI = "Source Sans 3";

const FONT_PATHS = {
  cormorant700: [
    path.join(process.cwd(), "public/fonts/og/cormorant-700.woff"),
    path.join(
      process.cwd(),
      "node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff"
    ),
  ],
  sourceSans400: [
    path.join(process.cwd(), "public/fonts/og/source-sans-400.woff"),
    path.join(
      process.cwd(),
      "node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff"
    ),
  ],
  sourceSans500: [
    path.join(process.cwd(), "public/fonts/og/source-sans-500.woff"),
    path.join(
      process.cwd(),
      "node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-500-normal.woff"
    ),
  ],
} as const;

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return new Uint8Array(buf).buffer;
}

async function readFirst(paths: readonly string[]): Promise<ArrayBuffer> {
  for (const filePath of paths) {
    try {
      return toArrayBuffer(await fs.readFile(filePath));
    } catch {
      continue;
    }
  }
  throw new Error(`OG font missing. Tried: ${paths.join(", ")}`);
}

let fontsPromise: Promise<OgFont[]> | null = null;

/** Cached WOFF bytes for Satori — latin subsets only (latin-ext breaks “Mirador”). */
export function getOgFonts(): Promise<OgFont[]> {
  if (process.env.NODE_ENV === "development") {
    fontsPromise = null;
  }
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFirst(FONT_PATHS.cormorant700),
      readFirst(FONT_PATHS.sourceSans400),
      readFirst(FONT_PATHS.sourceSans500),
    ]).then(([cormorant700, sourceSans400, sourceSans500]) => [
      {
        name: OG_FONT_DISPLAY,
        data: cormorant700,
        weight: 700,
        style: "normal",
      },
      {
        name: OG_FONT_UI,
        data: sourceSans400,
        weight: 400,
        style: "normal",
      },
      {
        name: OG_FONT_UI,
        data: sourceSans500,
        weight: 500,
        style: "normal",
      },
    ]);
  }
  return fontsPromise;
}

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
