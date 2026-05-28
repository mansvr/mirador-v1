import fs from "fs";
import path from "path";
import sharp from "sharp";

/** JPEG data URL for Satori (WebP thumbs are unreliable in OG renderer). */
export async function demo1PosterDataUrl(): Promise<string> {
  const file = path.join(process.cwd(), "public/demo1/assets/poster.webp");
  if (!fs.existsSync(file)) {
    throw new Error(`Demo1 OG poster missing: ${file}`);
  }
  const buf = await sharp(file).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}
