/** Inline SVG for OG / apple-icon renderers (Satori-safe data URLs). */

export function miradorMarkSvgDataUrl(stroke = "#F5F6F2"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
<rect x="5.31" y="9.11" width="16.72" height="21.02" stroke="${stroke}" stroke-width="2" stroke-miterlimit="10"/>
<path d="M10.35,9.34c0-4.12,3.66-7.46,8.17-7.46s8.17,3.34,8.17,7.46v15.48H10.35v-15.64" stroke="${stroke}" stroke-width="2" stroke-miterlimit="10"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
