"use client";

/**
 * StorySplat-style loop: dwell at each stop, then tween to the next pill.
 * User pill/chevron/drag or pause suppresses until play is pressed.
 */

import { useEffect, useRef } from "react";
import { useNavigationMode } from "@/lib/navigation-mode";
import {
  canRunTourAutoplay,
  NAV_TWEEN_COMPLETE_EVENT,
  nextAutoplayWaypointId,
  TOUR_AUTOPLAY_DWELL_MS,
  TOUR_AUTOPLAY_INITIAL_DELAY_MS,
} from "@/lib/tour-autoplay";
import { useViewerStore } from "@/lib/store";

export function TourAutoplay() {
  const mode = useNavigationMode();
  const scene = useViewerStore((s) => s.scene);
  const isLoaded = useViewerStore((s) => s.isLoaded);
  const activeWaypointId = useViewerStore((s) => s.activeWaypointId);
  const tourAutoplayPaused = useViewerStore((s) => s.tourAutoplayPaused);
  const tourAutoplaySuppressed = useViewerStore(
    (s) => s.tourAutoplaySuppressed
  );
  const autoplayTweenTo = useViewerStore((s) => s.autoplayTweenTo);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialArmedForScene = useRef<string | null>(null);

  const playing =
    mode === "tour" &&
    isLoaded &&
    canRunTourAutoplay(scene) &&
    !tourAutoplayPaused &&
    !tourAutoplaySuppressed;

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function schedule(ms: number, fn: () => void) {
    clearTimer();
    timerRef.current = setTimeout(fn, ms);
  }

  function shouldPlay(): boolean {
    const s = useViewerStore.getState();
    return (
      mode === "tour" &&
      s.isLoaded &&
      canRunTourAutoplay(s.scene) &&
      !s.tourAutoplayPaused &&
      !s.tourAutoplaySuppressed
    );
  }

  function advanceFrom(arrivedId: string) {
    const s = useViewerStore.getState();
    if (!shouldPlay() || !s.scene) return;
    const nextId = nextAutoplayWaypointId(s.scene, arrivedId);
    if (!nextId || nextId === arrivedId) return;
    s.autoplayTweenTo(nextId);
  }

  function scheduleDwellThenAdvance(arrivedId: string) {
    schedule(TOUR_AUTOPLAY_DWELL_MS, () => advanceFrom(arrivedId));
  }

  useEffect(() => {
    if (!scene?.id || !isLoaded || mode !== "tour" || !canRunTourAutoplay(scene)) {
      return;
    }
    if (initialArmedForScene.current === scene.id) return;
    initialArmedForScene.current = scene.id;

    schedule(TOUR_AUTOPLAY_INITIAL_DELAY_MS, () => {
      const s = useViewerStore.getState();
      if (!shouldPlay() || !s.activeWaypointId) return;
      advanceFrom(s.activeWaypointId);
    });

    return clearTimer;
  }, [scene?.id, isLoaded, mode, scene, autoplayTweenTo]);

  useEffect(() => {
    if (!playing) {
      clearTimer();
      return;
    }

    const onComplete = (event: Event) => {
      const detail = (event as CustomEvent<{ waypointId: string }>).detail;
      const arrivedId = detail?.waypointId;
      if (!arrivedId || !shouldPlay()) return;
      scheduleDwellThenAdvance(arrivedId);
    };

    window.addEventListener(NAV_TWEEN_COMPLETE_EVENT, onComplete);
    return () => {
      window.removeEventListener(NAV_TWEEN_COMPLETE_EVENT, onComplete);
    };
  }, [playing, autoplayTweenTo]);

  const prevSuppressed = useRef(tourAutoplaySuppressed);
  useEffect(() => {
    const wasSuppressed = prevSuppressed.current;
    prevSuppressed.current = tourAutoplaySuppressed;

    if (wasSuppressed && !tourAutoplaySuppressed && !tourAutoplayPaused && playing && activeWaypointId) {
      scheduleDwellThenAdvance(activeWaypointId);
    }
  }, [tourAutoplaySuppressed, tourAutoplayPaused, playing, activeWaypointId]);

  useEffect(() => {
    if (tourAutoplayPaused) clearTimer();
  }, [tourAutoplayPaused]);

  useEffect(() => {
    if (tourAutoplaySuppressed) clearTimer();
  }, [tourAutoplaySuppressed]);

  return null;
}
