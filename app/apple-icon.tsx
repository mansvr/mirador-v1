import { ImageResponse } from "next/og";
import { miradorMarkSvgDataUrl } from "@/lib/brand-mark";
import { MIRADOR_BRAND } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Dark squircle app icon — #121212 + white mark (brand/identity/logo). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: MIRADOR_BRAND.viewerChrome,
          borderRadius: 38,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori */}
        <img src={miradorMarkSvgDataUrl("#F5F6F2")} width={96} height={96} alt="" />
      </div>
    ),
    { ...size }
  );
}
