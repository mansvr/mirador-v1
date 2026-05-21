"use client";

import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { AnimatePresence, motion } from "framer-motion";
import { useViewerStore } from "@/lib/store";

export function LoadingOverlay() {
  const isLoaded = useViewerStore((s) => s.isLoaded);
  const progress = useViewerStore((s) => s.loadProgress);
  const loadError = useViewerStore((s) => s.loadError);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black"
        >
          <MiradorWordmark
            onDark
            size="lg"
            className="mb-8 select-none"
          />

          {/* Progress bar */}
          {loadError ? (
            <p className="max-w-xs px-6 text-center text-sm text-white/80">
              {loadError}
            </p>
          ) : (
            <div className="w-40 h-px bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--mirador-primary,#5e5956)] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
