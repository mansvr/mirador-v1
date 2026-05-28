"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { HeroScrollIndicator } from "@/components/demo1/HeroScrollIndicator";

type HeroScrollScrubProps = {
  srcMp4: string;
  posterUrl: string;
  title: string;
  /** Viewport heights of scroll per 1s of video — higher = longer scroll track = smoother. */
  secondsPerViewport?: number;
  children?: React.ReactNode;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

const SEEK_EPSILON = 0.06;
const WARMUP_MARKS = [0, 0.25, 0.5, 0.75, 0.98] as const;

function seekVideoTo(video: HTMLVideoElement, time: number): Promise<void> {
  const target = Math.max(0, Math.min(time, video.duration || time));
  if (Math.abs(video.currentTime - target) < SEEK_EPSILON) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener("seeked", onSeeked);
      window.clearTimeout(timeoutId);
      resolve();
    };
    const onSeeked = () => finish();
    const timeoutId = window.setTimeout(finish, 800);

    video.addEventListener("seeked", onSeeked);
    try {
      if (typeof video.fastSeek === "function") {
        video.fastSeek(target);
      } else {
        video.currentTime = target;
      }
    } catch {
      finish();
    }
  });
}

/** Prime decoder + network buffer so early scroll seeks hit cached keyframes. */
async function warmupScrubVideo(video: HTMLVideoElement) {
  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    await seekVideoTo(video, 0);
    return;
  }

  for (const mark of WARMUP_MARKS) {
    await seekVideoTo(video, duration * mark);
  }
  await seekVideoTo(video, 0);
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
  const targetTimeRef = useRef(0);
  const seekRafRef = useRef(0);
  const seekInFlightRef = useRef(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [scrubReady, setScrubReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const prepare = async () => {
      setScrubReady(false);
      video.preload = "auto";
      video.src = srcMp4;
      video.load();

      await new Promise<void>((resolve) => {
        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve();
          return;
        }
        const onReady = () => {
          video.removeEventListener("canplay", onReady);
          resolve();
        };
        video.addEventListener("canplay", onReady);
      });

      if (cancelled) return;

      const d = Number.isFinite(video.duration) ? video.duration : null;
      setDuration(d);

      if (!prefersReducedMotion && d) {
        try {
          await video.play();
          video.pause();
        } catch {
          // iOS may require pointer unlock first; warmup seeks still help.
        }
        await warmupScrubVideo(video);
      }

      if (!cancelled) setScrubReady(true);
    };

    void prepare();

    return () => {
      cancelled = true;
      setScrubReady(false);
    };
  }, [srcMp4, prefersReducedMotion]);

  // iOS Safari: user gesture unlock before first reliable frame paint.
  useEffect(() => {
    if (unlocked) return;
    const onUnlock = async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
        await video.play();
        video.pause();
      } catch {
        // Scrub may still work after warmup on some builds.
      } finally {
        setUnlocked(true);
        if (!scrubReady && duration && !prefersReducedMotion) {
          await warmupScrubVideo(video);
          setScrubReady(true);
        }
      }
    };
    window.addEventListener("pointerdown", onUnlock, { once: true });
    return () => window.removeEventListener("pointerdown", onUnlock);
  }, [unlocked, scrubReady, duration, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!scrubReady || !duration) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    const scheduleSeek = () => {
      if (seekRafRef.current) return;
      seekRafRef.current = requestAnimationFrame(() => {
        seekRafRef.current = 0;
        if (seekInFlightRef.current) return;

        const target = targetTimeRef.current;
        if (Math.abs(video.currentTime - target) < SEEK_EPSILON) return;

        seekInFlightRef.current = true;
        const release = () => {
          seekInFlightRef.current = false;
          if (Math.abs(video.currentTime - targetTimeRef.current) >= SEEK_EPSILON) {
            scheduleSeek();
          }
        };

        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          release();
        };
        video.addEventListener("seeked", onSeeked);

        try {
          if (typeof video.fastSeek === "function") {
            video.fastSeek(target);
          } else {
            video.currentTime = target;
          }
        } catch {
          video.removeEventListener("seeked", onSeeked);
          release();
        }
      });
    };

    const build = () => {
      const pxPerSecond = window.innerHeight / secondsPerViewport;
      const totalScrollPx = Math.max(1, Math.round(duration * pxPerSecond));

      return ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScrollPx}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const p = clamp01(self.progress);
          setScrubProgress(p);
          targetTimeRef.current = p * duration;
          scheduleSeek();
        },
      });
    };

    const st = build();
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (seekRafRef.current) cancelAnimationFrame(seekRafRef.current);
      st.kill();
    };
  }, [duration, prefersReducedMotion, scrubReady, secondsPerViewport]);

  return (
    <section ref={sectionRef} className="relative bg-viewer">
      <div className="relative h-[100svh] overflow-hidden bg-viewer">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            scrubReady || prefersReducedMotion ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          preload="auto"
          poster={posterUrl}
          aria-label={title}
        />
        {!scrubReady && !prefersReducedMotion ? (
          <div
            className="pointer-events-none absolute inset-0 bg-viewer bg-cover bg-center"
            style={{ backgroundImage: `url(${posterUrl})` }}
            aria-hidden
          />
        ) : null}
        {children ? (
          <div className="pointer-events-none absolute inset-0 z-10">{children}</div>
        ) : null}
        <HeroScrollIndicator
          progress={scrubProgress}
          show={scrubReady && !prefersReducedMotion}
        />
      </div>
    </section>
  );
}
