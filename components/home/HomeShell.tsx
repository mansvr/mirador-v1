import Link from "next/link";
import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-mirador-border bg-mirador-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/home" className="shrink-0">
          <MiradorWordmark />
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Principal">
          <Link
            href="/"
            className="hidden rounded-sm px-3 py-2 text-mirador-text-muted transition-colors hover:bg-mirador-surface hover:text-mirador-text sm:inline-flex"
          >
            Para agentes
          </Link>
          <Link
            href="/v/scene_best50000"
            className={cn(
              buttonVariants({ size: "sm" }),
              "min-h-10 bg-mirador-text text-[#F5F6F2] hover:bg-mirador-accent-hover"
            )}
          >
            Ver tour demo
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function HomeFooter() {
  return (
    <footer className="mt-16 border-t border-mirador-border bg-mirador-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-mirador-text-muted md:flex-row md:items-center md:justify-between md:px-6">
        <MiradorWordmark className="opacity-80" />
        <p>
          Listings ·{" "}
          <Link href="/" className="text-mirador-text underline-offset-2 hover:underline">
            mirador.lat
          </Link>
        </p>
      </div>
    </footer>
  );
}
