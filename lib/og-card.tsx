/** JSX layout for `next/og` ImageResponse (Satori). No client hooks. */

export function OgCard({
  title,
  accent,
  thumbSrc,
  eyebrow = "MIRADOR",
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
        background: "#070707",
        color: "#fafafa",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
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
            "linear-gradient(180deg, rgba(7,7,7,0.35) 0%, rgba(7,7,7,0.55) 45%, rgba(7,7,7,0.92) 78%, #070707 100%)",
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
            fontSize: 22,
            letterSpacing: "0.2em",
            fontWeight: 600,
            opacity: 0.9,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.1,
            maxHeight: 220,
            overflow: "hidden",
            textShadow: "0 2px 24px rgba(0,0,0,0.6)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
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
