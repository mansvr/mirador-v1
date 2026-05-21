"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

function getFullscreenElement(): Element | null {
  if (typeof document === "undefined") return null;
  return (
    document.fullscreenElement ??
    // Safari legacy
    (document as Document & { webkitFullscreenElement?: Element })
      .webkitFullscreenElement ??
    null
  );
}

async function requestFullscreen(el: HTMLElement): Promise<void> {
  if (el.requestFullscreen) {
    await el.requestFullscreen();
    return;
  }
  const webkit = el as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
  };
  if (webkit.webkitRequestFullscreen) {
    await webkit.webkitRequestFullscreen();
  }
}

async function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
  if (doc.webkitExitFullscreen) {
    await doc.webkitExitFullscreen();
  }
}

/**
 * Fullscreen the viewer container so R3F (ResizeObserver on the canvas parent) resizes
 * with the new layout. Falls back to fixed inset-0 when the Fullscreen API is unavailable.
 */
export function useViewerFullscreen(containerRef: RefObject<HTMLElement | null>) {
  const [nativeFs, setNativeFs] = useState(false);
  const [pseudoFs, setPseudoFs] = useState(false);

  const isFullscreen = nativeFs || pseudoFs;

  useEffect(() => {
    const onChange = () => {
      const el = containerRef.current;
      setNativeFs(!!el && getFullscreenElement() === el);
    };

    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [containerRef]);

  useEffect(() => {
    if (!pseudoFs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPseudoFs(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [pseudoFs]);

  const toggle = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    if (isFullscreen) {
      if (nativeFs) await exitFullscreen().catch(() => {});
      setPseudoFs(false);
      return;
    }

    try {
      await requestFullscreen(el);
    } catch {
      setPseudoFs(true);
    }
  }, [containerRef, isFullscreen, nativeFs]);

  return { isFullscreen, toggle };
}
