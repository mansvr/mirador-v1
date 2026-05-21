import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { buttonVariants } from "@/components/ui/button";
import { demoTourHref } from "@/lib/demo-scene";
import { cn } from "@/lib/utils";

/** Header + growing main + footer pinned to the viewport bottom on short pages. */
export function SitePageShell({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        "flex min-h-dvh w-full min-w-0 flex-1 flex-col overflow-x-clip bg-mirador-bg text-mirador-text",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-mirador-border bg-mirador-bg/90 backdrop-blur-md">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 md:px-6">
        <Link href="/home" className="min-w-0 shrink">
          <MiradorWordmark />
        </Link>
        <nav
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium sm:gap-2"
          aria-label="Principal"
        >
          <Link
            href="/"
            className="hidden rounded-sm px-3 py-2 text-mirador-text-muted transition-colors hover:bg-mirador-surface hover:text-mirador-text sm:inline-flex"
          >
            Para agentes
          </Link>
          <Link
            href={demoTourHref()}
            className={cn(
              buttonVariants({ size: "sm" }),
              "min-h-10 max-w-full whitespace-normal bg-mirador-text px-3 text-center text-xs leading-snug text-[#F5F6F2] hover:bg-mirador-accent-hover sm:whitespace-nowrap sm:px-4 sm:text-sm"
            )}
          >
            <span className="sm:hidden">Tour demo</span>
            <span className="hidden sm:inline">Ver tour demo</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function HomeFooter() {
  return (
    <footer className="mt-auto shrink-0 border-t border-mirador-border bg-mirador-surface">
      <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-mirador-text-muted md:flex-row md:items-center md:justify-between md:px-6">
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
