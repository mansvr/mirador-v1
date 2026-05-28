"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

type HeroScrollScrubProps = {
  srcMp4: string;
  posterUrl: string;
  title: string;
  /** Seconds of video advanced per 1 viewport height scrolled. */
  secondsPerViewport?: number;
  children?: React.ReactNode;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function HeroScrollScrub({
  srcMp4,
  posterUrl,
  title,
  secondsPerViewport = 4,
  children,
}: HeroScrollScrubProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force-load the media in some browsers that defer <source> fetching until play().
    video.src = srcMp4;
    video.load();

    const onMeta = () =>
      setDuration(Number.isFinite(video.duration) ? video.duration : null);
    video.addEventListener("loadedmetadata", onMeta);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [srcMp4]);

  // iOS Safari often requires a user gesture before it will render video frames reliably.
  useEffect(() => {
    if (unlocked) return;
    const onUnlock = async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
        await video.play();
        video.pause();
        setUnlocked(true);
      } catch {
        // Ignore; some browsers will still allow scrubbing without explicit play().
        setUnlocked(true);
      }
    };
    window.addEventListener("pointerdown", onUnlock, { once: true });
    return () => window.removeEventListener("pointerdown", onUnlock);
  }, [unlocked]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!duration) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    const build = () => {
      const pxPerSecond = window.innerHeight / secondsPerViewport;
      const totalScrollPx = Math.max(1, Math.round(duration * pxPerSecond));

      return ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScrollPx}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const t = clamp01(self.progress) * duration;
          if (Number.isFinite(t) && Math.abs(video.currentTime - t) > 0.03) {
            video.currentTime = t;
          }
        },
      });
    };

    const st = build();
    return () => st.kill();
  }, [duration, prefersReducedMotion, secondsPerViewport]);

  return (
    <section ref={sectionRef} className="relative bg-viewer">
      <div className="relative h-[100svh] overflow-hidden bg-viewer">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          poster={posterUrl}
          aria-label={title}
        />
        {children ? (
          <div className="pointer-events-none absolute inset-0 z-10">{children}</div>
        ) : null}
      </div>
    </section>
  );
}

