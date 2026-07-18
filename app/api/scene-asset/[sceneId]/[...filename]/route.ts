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
  ".png": "image/png",
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
  params: Promise<{ sceneId: string; filename: string[] }>;
}

/**
 * Local dev splat/static delivery when NEXT_PUBLIC_R2_URL is unset.
 * Catch-all so nested paths (e.g. gallery/01.jpg) resolve the same as on R2.
 * Search order: public/, scenes/, repo sibling r2upload/.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { sceneId, filename: segments } = await params;
  const filename = segments.map((s) => decodeURIComponent(s)).join("/").replace(/\\/g, "/");

  if (
    filename.includes("..") ||
    sceneId.includes("..") ||
    sceneId.includes("/") ||
    filename.startsWith("/")
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const root = process.cwd();
  const bases = [
    path.join(root, "public", sceneId),
    path.join(root, "scenes", sceneId),
    path.join(root, "public"),
    path.join(root, "..", "r2upload", sceneId),
  ];
  // Containment guard: resolved candidate must stay inside its base dir.
  const safeCandidates = bases
    .map((base) => path.join(base, filename))
    .filter((c, i) => path.resolve(c).startsWith(path.resolve(bases[i]) + path.sep));
  const filePath = await firstExisting(safeCandidates);

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
