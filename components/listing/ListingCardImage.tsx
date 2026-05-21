"use client";

import { useState } from "react";

type Props = {
  src: string;
  className?: string;
};

/** Falls back to gradient placeholder when the thumbnail URL 404s (e.g. missing R2 file). */
export function ListingCardImage({ src, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex size-full items-center justify-center bg-gradient-to-br from-[#E7E6DC] to-[#CCC3B7] text-sm text-mirador-text-muted"
        aria-hidden
      >
        Vista previa
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
