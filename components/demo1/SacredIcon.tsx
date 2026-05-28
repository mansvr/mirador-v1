interface SacredIconProps {
  name: string;
  className?: string;
  size?: number;
  /** Hex without #, e.g. A39783 */
  color?: string;
}

/** Inline Iconify Solar linear icons (no extra dependency). */
export function SacredIcon({
  name,
  className = "",
  size = 20,
  color = "A39783",
}: SacredIconProps) {
  const src = `https://api.iconify.design/${name}.svg?color=%23${color}&width=${size}&height=${size}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
