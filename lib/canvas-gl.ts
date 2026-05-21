/** Spark recommends antialias off for Gaussian splatting performance (esp. mobile). */
export function getCanvasGlProps(): {
  antialias: boolean;
  alpha: boolean;
  powerPreference: "high-performance" | "default" | "low-power";
} {
  const mobile =
    typeof navigator !== "undefined" &&
    /Mobi|iPhone|iPad|Android/i.test(navigator.userAgent);

  return {
    antialias: !mobile,
    alpha: false,
    powerPreference: "high-performance",
  };
}
