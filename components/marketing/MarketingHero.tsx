"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MiradorMark } from "@/components/brand/MiradorMark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_SCENE = "scene_best50000";

export function MarketingHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-b border-mirador-border">
      <div className="mx-auto max-w-[90rem] px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-28">
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-6 flex items-center gap-2 text-sm text-mirador-text-muted">
            <span className="flex -space-x-1.5" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="inline-block size-7 rounded-full border-2 border-mirador-bg bg-mirador-border"
                />
              ))}
            </span>
            <span>Recorridos 3D · Colombia</span>
          </div>

          <MiradorMark className="mb-6 h-12 w-12 text-mirador-accent md:h-14 md:w-14" />

          <h1 className="text-balance text-3xl font-medium tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            El mirador que tu listing necesitaba
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg text-mirador-text-muted md:text-xl">
            Recorridos 3D de espacios reales y diseños por caminar — listos para
            compartir en WhatsApp y embeber en tu web.
          </p>

          <p className="mt-2 text-sm text-mirador-text-muted/80">
            The viewpoint your listing was missing.
          </p>

          <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href={`/v/${DEMO_SCENE}`}
              className={cn(buttonVariants({ size: "lg" }), "min-h-11 px-8")}
            >
              Ver tour de ejemplo
            </Link>
            <a
              href="/home"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 border-mirador-text px-8"
              )}
            >
              Explorar listings
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
