import fs from "fs";
import path from "path";
import type { Metadata } from "next";

const BAKED_OG = path.join(process.cwd(), "public/demo1/og-card.jpg");

const BAKED_OG_PATH = "/demo1/og-card.jpg";

/** Prefer baked JPEG for WhatsApp; else Next serves `opengraph-image.tsx`. */
export function demo1OpenGraphImages(): NonNullable<Metadata["openGraph"]>["images"] {
  if (fs.existsSync(BAKED_OG)) {
    return [
      {
        url: BAKED_OG_PATH,
        width: 1200,
        height: 630,
        alt: "AI67 — apartamento demo Mirador",
      },
    ];
  }
  return undefined;
}

export function demo1TwitterImage(): string | undefined {
  return fs.existsSync(BAKED_OG) ? BAKED_OG_PATH : undefined;
}
