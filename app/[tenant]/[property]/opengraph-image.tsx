import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { fetchScene } from "@/lib/scene";
import { resolveSceneIdFromSlugs } from "@/lib/tenants";

export const runtime = "nodejs";
export const alt = "Mirador";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ tenant: string; property: string }>;
}) {
  const { tenant, property } = await params;
  const sceneId = resolveSceneIdFromSlugs(tenant, property);
  if (!sceneId) notFound();

  try {
    const scene = await fetchScene(sceneId);
    const accent = scene.branding?.primary_color ?? "#FF6A00";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            background: `linear-gradient(145deg, #070707 0%, #121212 55%, ${accent}22 100%)`,
            color: "#fafafa",
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.15em",
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            {tenant.toUpperCase()} · MIRADOR
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.12,
              maxHeight: 320,
              overflow: "hidden",
            }}
          >
            {scene.title}
          </div>
          <div style={{ fontSize: 24, opacity: 0.72 }}>
            Tour virtual 3D · Umbral
          </div>
        </div>
      ),
      { ...size }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#070707",
            color: "#fafafa",
            fontSize: 52,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Mirador
        </div>
      ),
      { ...size }
    );
  }
}
