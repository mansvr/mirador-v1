"use client";

import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { AnimatePresence, motion } from "framer-motion";
import { useViewerStore } from "@/lib/store";

export function LoadingOverlay() {
  const isLoaded = useViewerStore((s) => s.isLoaded);
  const progress = useViewerStore((s) => s.loadProgress);
  const loadHint = useViewerStore((s) => s.loadHint);
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
            <div className="flex max-w-sm flex-col items-center gap-4 px-6">
              <p className="text-center text-sm text-white/80">{loadError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
              >
                Recargar
              </button>
            </div>
          ) : (
            <>
              {loadHint ? (
                <p className="mb-4 max-w-xs px-6 text-center text-xs text-white/70">
                  {loadHint}
                </p>
              ) : null}
              <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-[var(--mirador-primary,#5e5956)]"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${Math.max(4, Math.round(progress * 100))}%`,
                  }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              {progress > 0.05 && progress < 0.98 ? (
                <p className="mt-3 text-[10px] text-white/50">
                  {Math.round(progress * 100)}%
                </p>
              ) : null}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
