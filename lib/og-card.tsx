/** JSX layout for `next/og` ImageResponse (Satori). No client hooks. */

import { OG_FONT_DISPLAY, OG_FONT_UI } from "@/lib/og-fonts";

export function OgCard({
  title,
  accent,
  thumbSrc,
  eyebrow = "Mirador",
  subtitle = "Tour virtual 3D",
}: {
  title: string;
  accent: string;
  thumbSrc?: string | null;
  eyebrow?: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        background: "#121212",
        color: "#fafafa",
      }}
    >
      {thumbSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- Satori OG renderer
        <img
          src={thumbSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(18,18,18,0.35) 0%, rgba(18,18,18,0.55) 45%, rgba(18,18,18,0.92) 78%, #121212 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 56,
        }}
      >
        <div
          style={{
            fontFamily: OG_FONT_DISPLAY,
            fontSize: 36,
            fontWeight: 700,
            fontStyle: "normal",
            letterSpacing: "0.02em",
            opacity: 0.95,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: OG_FONT_UI,
            fontSize: 52,
            fontWeight: 500,
            lineHeight: 1.12,
            maxHeight: 220,
            overflow: "hidden",
            textShadow: "0 2px 24px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: OG_FONT_UI,
            fontSize: 24,
            fontWeight: 400,
            opacity: 0.85,
            color: accent,
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
