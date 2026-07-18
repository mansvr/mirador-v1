import { readFile, access } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ sceneId: string }>;
}

/**
 * Serves baked OG JPEG cards with a plain 200 response (no Accept-Ranges / 206).
 * WhatsApp and some crawlers fail previews when static files return Partial Content.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { sceneId } = await params;
  if (!/^scene_[a-z0-9_-]+$/i.test(sceneId)) {
    return NextResponse.json({ error: "Invalid scene id" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "og", `${sceneId}-card.jpg`);

  try {
    await access(filePath);
  } catch {
    return NextResponse.json({ error: "OG card not found" }, { status: 404 });
  }

  const body = await readFile(filePath);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
