"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDemo1Motion } from "@/components/demo1/Demo1MotionProvider";

/** Softer than marketing ScrollReveal — tuned for full-width listing sections. */
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

type Demo1ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** First block below pinned hero — delay trigger so pin-release scroll does not stack with fade-in. */
  afterHero?: boolean;
};

export function Demo1ScrollReveal({
  children,
  className,
  afterHero = false,
}: Demo1ScrollRevealProps) {
  const { motion: motionFlags } = useDemo1Motion();
  const reduceMotion = useReducedMotion();

  if (!motionFlags.reveal) {
    return <div className={className}>{children}</div>;
  }

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("transform-gpu backface-hidden", className)}
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: afterHero ? 0.22 : 0.14,
        margin: afterHero ? "-12% 0px -8% 0px" : "0px 0px -10% 0px",
      }}
      transition={{
        duration: afterHero ? 0.62 : 0.52,
        ease: REVEAL_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
