import { readFile, access } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const MIME: Record<string, string> = {
  ".sog": "application/octet-stream",
  ".spz": "application/octet-stream",
  ".ply": "application/octet-stream",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

async function firstExisting(paths: string[]): Promise<string | null> {
  for (const p of paths) {
    try {
      await access(p);
      return p;
    } catch {
      // try next
    }
  }
  return null;
}

interface RouteParams {
  params: Promise<{ sceneId: string; filename: string }>;
}

/**
 * Local dev splat/static delivery when NEXT_PUBLIC_R2_URL is unset.
 * Search order: public/, scenes/, repo sibling r2upload/.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { sceneId, filename: encoded } = await params;
  const filename = decodeURIComponent(encoded);

  if (
    filename.includes("..") ||
    sceneId.includes("..") ||
    filename.includes("/") ||
    sceneId.includes("/")
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const root = process.cwd();
  const filePath = await firstExisting([
    path.join(root, "public", sceneId, filename),
    path.join(root, "scenes", sceneId, filename),
    path.join(root, "public", filename),
    path.join(root, "..", "r2upload", sceneId, filename),
  ]);

  if (!filePath) {
    return NextResponse.json(
      {
        error: "Asset not found on disk",
        hint:
          "Place the file under scenes/<sceneId>/, public/<sceneId>/, or r2upload/<sceneId>/ — or set NEXT_PUBLIC_R2_URL in .env.local for production R2.",
        sceneId,
        filename,
      },
      { status: 404 }
    );
  }

  const body = await readFile(filePath);
  const ext = path.extname(filename).toLowerCase();

  return new NextResponse(body, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "private, max-age=60",
    },
  });
}
