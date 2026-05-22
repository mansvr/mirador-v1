"use client";

import { useCallback, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useViewerStore } from "@/lib/store";
import { trackWaypointReached } from "@/lib/analytics";
import { sceneAssetUrl } from "@/lib/scene-utils";
import { canRunTourAutoplay } from "@/lib/tour-autoplay";
import {
  navPillsForScene,
  navStepIndex,
  navStepSibling,
} from "@/lib/viewer-camera";
import { cn } from "@/lib/utils";
import type { Scene } from "@/lib/types/scene";
import type { SceneWaypoint } from "@/lib/types/scene";

interface WaypointNavProps {
  scene: Scene;
}

const chromeBtnClass = cn(
  "flex size-7 shrink-0 items-center justify-center rounded-full",
  "group-data-[fullscreen=true]/viewport:size-9",
  "border border-white/10 bg-black/45 text-white/85 backdrop-blur-sm",
  "transition-[opacity,background-color] duration-200",
  "hover:bg-black/60 hover:text-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  "disabled:pointer-events-none disabled:opacity-35"
);

const chromeIconClass =
  "size-3.5 group-data-[fullscreen=true]/viewport:size-4";

/** Subdued — visible on glass but quieter than chevrons. */
const autoplayBtnClass = cn(
  chromeBtnClass,
  "border-white/8 text-white/45",
  "hover:bg-black/50 hover:text-white/60",
  "focus-visible:ring-white/25"
);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    target.isContentEditable
  );
}

export function WaypointNav({ scene }: WaypointNavProps) {
  const activeWaypointId = useViewerStore((s) => s.activeWaypointId);
  const goToWaypoint = useViewerStore((s) => s.goToWaypoint);
  const tourAutoplayPaused = useViewerStore((s) => s.tourAutoplayPaused);
  const tourAutoplaySuppressed = useViewerStore(
    (s) => s.tourAutoplaySuppressed
  );
  const resumeTourAutoplay = useViewerStore((s) => s.resumeTourAutoplay);
  const setTourAutoplayPaused = useViewerStore((s) => s.setTourAutoplayPaused);

  const pills = useMemo(() => navPillsForScene(scene), [scene]);
  const activeIndex = navStepIndex(pills, activeWaypointId);
  const canStep = pills.length > 1;
  const showAutoplay = canRunTourAutoplay(scene);
  const autoplayActive =
    showAutoplay && !tourAutoplayPaused && !tourAutoplaySuppressed;

  const goTo = useCallback(
    (wp: SceneWaypoint) => {
      goToWaypoint(wp.id);
      trackWaypointReached(scene.id, wp.id, wp.label);
    },
    [scene.id, goToWaypoint]
  );

  function toggleAutoplay() {
    if (autoplayActive) {
      setTourAutoplayPaused(true);
      return;
    }
    if (tourAutoplaySuppressed) {
      resumeTourAutoplay();
      return;
    }
    setTourAutoplayPaused(false);
  }

  useEffect(() => {
    if (!canStep) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const sibling =
        event.key === "ArrowLeft"
          ? navStepSibling(pills, activeWaypointId, -1)
          : navStepSibling(pills, activeWaypointId, 1);
      if (!sibling) return;

      event.preventDefault();
      goTo(sibling);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canStep, pills, activeWaypointId, goTo]);

  if (!pills.length) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex flex-col items-center gap-1 px-2 group-data-[fullscreen=true]/viewport:bottom-4 group-data-[fullscreen=true]/viewport:gap-2 group-data-[fullscreen=true]/viewport:px-3">
      {showAutoplay ? (
        <button
          type="button"
          className={cn(autoplayBtnClass, "pointer-events-auto")}
          aria-label={autoplayActive ? "Pausar recorrido" : "Reproducir recorrido"}
          title={autoplayActive ? "Pausar" : "Reproducir"}
          onClick={toggleAutoplay}
        >
          {autoplayActive ? (
            <Pause className={chromeIconClass} strokeWidth={1.75} aria-hidden />
          ) : (
            <Play className={cn(chromeIconClass, "ml-0.5")} strokeWidth={1.75} aria-hidden />
          )}
        </button>
      ) : null}

      <div
        className="pointer-events-auto flex max-w-full items-center gap-1 group-data-[fullscreen=true]/viewport:gap-2"
        role="group"
        aria-label="Navegación del recorrido"
      >
        <button
          type="button"
          className={chromeBtnClass}
          disabled={!canStep}
          aria-label="Vista anterior"
          title="Anterior (←)"
          onClick={() => {
            const wp = navStepSibling(pills, activeWaypointId, -1);
            if (wp) goTo(wp);
          }}
        >
          <ChevronLeft className={chromeIconClass} strokeWidth={1.75} aria-hidden />
        </button>

        <div
          className="flex max-w-[min(100vw-6rem,28rem)] gap-0.5 overflow-x-auto overscroll-x-contain rounded-full bg-black/50 p-1 backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] group-data-[fullscreen=true]/viewport:max-w-[min(100vw-8rem,32rem)] group-data-[fullscreen=true]/viewport:gap-1.5 group-data-[fullscreen=true]/viewport:p-2 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Puntos del recorrido"
        >
          {pills.map((wp) => {
            const isActive = wp.id === activeWaypointId;
            return (
              <button
                key={wp.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => goTo(wp)}
                className={[
                  "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition-all duration-200 group-data-[fullscreen=true]/viewport:gap-2 group-data-[fullscreen=true]/viewport:px-3 group-data-[fullscreen=true]/viewport:py-1.5 group-data-[fullscreen=true]/viewport:text-sm",
                  isActive
                    ? "bg-[var(--mirador-primary,#5e5956)] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                {wp.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sceneAssetUrl(scene.id, wp.thumbnail_url)}
                    alt=""
                    className="h-4 w-4 rounded-full object-cover group-data-[fullscreen=true]/viewport:h-5 group-data-[fullscreen=true]/viewport:w-5"
                  />
                )}
                <span className="max-w-[8rem] truncate group-data-[fullscreen=true]/viewport:max-w-none">
                  {wp.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={chromeBtnClass}
          disabled={!canStep}
          aria-label="Vista siguiente"
          title="Siguiente (→)"
          onClick={() => {
            const wp = navStepSibling(pills, activeWaypointId, 1);
            if (wp) goTo(wp);
          }}
        >
          <ChevronRight className={chromeIconClass} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      {canStep && activeIndex >= 0 ? (
        <span className="sr-only" aria-live="polite">
          {activeIndex + 1} de {pills.length}
          {autoplayActive ? " · recorrido automático" : ""}
        </span>
      ) : null}
    </div>
  );
}
