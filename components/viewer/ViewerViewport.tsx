"use client";

import { useRef, type ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useViewerFullscreen } from "@/lib/use-viewer-fullscreen";
import { cn } from "@/lib/utils";

interface ViewerViewportProps {
  children: ReactNode;
  className?: string;
  /** Accessible label for the tour (e.g. scene title). */
  label?: string;
}

/**
 * Viewer chrome boundary: GL + HUD overlays. Fullscreen targets this node so
 * R3F receives a resize via ResizeObserver (canvas parent), not a raw canvas fullscreen.
 */
export function ViewerViewport({ children, className, label }: ViewerViewportProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggle } = useViewerFullscreen(rootRef);

  return (
    <div
      ref={rootRef}
      className={cn(
        "mirador-viewer-viewport group/viewport relative overflow-hidden bg-[#121212]",
        isFullscreen &&
          "fixed inset-0 z-[10000] !m-0 h-dvh w-full !max-h-none max-w-none !rounded-none !border-0",
        "fullscreen:aspect-auto fullscreen:h-full fullscreen:max-h-none fullscreen:w-full fullscreen:rounded-none fullscreen:border-0",
        className
      )}
      data-fullscreen={isFullscreen ? "true" : undefined}
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => void toggle()}
        className={cn(
          "absolute top-2 right-2 left-auto z-20 flex size-7 items-center justify-center rounded-full sm:top-3 sm:left-3 sm:right-auto sm:size-9",
          "border border-white/10 bg-black/45 text-white/85 backdrop-blur-sm",
          "opacity-0 transition-[opacity,background-color] duration-200",
          "hover:bg-black/60 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          "group-hover/viewport:opacity-100 group-focus-within/viewport:opacity-100",
          isFullscreen && "opacity-100"
        )}
        aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        title={isFullscreen ? "Salir (Esc)" : "Pantalla completa"}
      >
        {isFullscreen ? (
          <Minimize2 className="size-4" strokeWidth={1.75} aria-hidden />
        ) : (
          <Maximize2 className="size-4" strokeWidth={1.75} aria-hidden />
        )}
      </button>

      {children}
    </div>
  );
}
