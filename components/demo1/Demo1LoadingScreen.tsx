"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MiradorWordmark } from "@/components/brand/MiradorMark";

export function Demo1LoadingScreen({ show }: { show: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="demo1-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: reduceMotion ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-viewer"
          role="status"
          aria-busy="true"
          aria-label="Cargando recorrido"
        >
          <MiradorWordmark
            size="md"
            className="text-hero-glass-text [&_svg]:text-hero-glass-text"
          />
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-hero-glass-text/50">
            Cargando recorrido
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
