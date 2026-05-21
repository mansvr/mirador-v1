/** Cap DPR on mobile to reduce WebGL memory pressure (iOS Safari). */
export function getCanvasDpr(): number {
  if (typeof window === "undefined") return 1;
  const mobile = /Mobi|iPhone|iPad|Android/i.test(navigator.userAgent);
  const cap = mobile ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}
