"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";

type HeroCopyCardProps = {
  motionHero: boolean;
  scrubReady: boolean;
  className?: string;
  children: ReactNode;
};

export function HeroCopyCard({
  motionHero,
  scrubReady,
  className,
  children,
}: HeroCopyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!motionHero || !scrubReady || reduceMotion || playedRef.current) return;

    const el = cardRef.current;
    if (!el) return;

    playedRef.current = true;
    gsap.fromTo(
      el,
      { opacity: 0, y: 22, filter: "blur(12px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power3.out",
        clearProps: "filter",
      },
    );
  }, [motionHero, scrubReady, reduceMotion]);

  const hiddenUntilReady = motionHero && !scrubReady && !reduceMotion;

  return (
    <div
      ref={cardRef}
      className={className}
      style={hiddenUntilReady ? { opacity: 0 } : undefined}
    >
      {children}
    </div>
  );
}
