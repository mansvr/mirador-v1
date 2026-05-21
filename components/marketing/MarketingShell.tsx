import Link from "next/link";
import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { demoTourHref } from "@/lib/demo-scene";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-mirador-border bg-mirador-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <MiradorWordmark />
        </Link>
        <nav
          className="flex items-stretch overflow-hidden rounded-sm border border-mirador-text text-sm font-medium"
          aria-label="Principal"
        >
          <Link
            href={demoTourHref()}
            className="hidden border-r border-mirador-text px-4 py-2.5 text-mirador-text transition-colors hover:bg-mirador-surface sm:inline-flex sm:items-center"
          >
            Tour de ejemplo
          </Link>
          <Link
            href={demoTourHref()}
            className={cn(
              "inline-flex min-h-11 items-center px-4 py-2.5",
              "bg-mirador-text text-[#F5F6F2] hover:bg-mirador-accent-hover"
            )}
          >
            Ver recorrido 3D
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mirador-border bg-mirador-surface">
      <div className="mx-auto max-w-[90rem] px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <MiradorWordmark />
            <p className="mt-3 max-w-xs text-sm text-mirador-text-muted">
              Recorridos 3D para propiedad en Colombia. Espacios reales y diseños por explorar.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-mirador-text-muted">
              BLCK. 01
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-mirador-accent">
                  CAPTURE
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-mirador-accent">
                  RENDER
                </Link>
              </li>
              <li>
                <Link href={demoTourHref()} className="hover:text-mirador-accent">
                  Ver demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-mirador-text-muted">
              BLCK. 02
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="https://mirador.homes" className="hover:text-mirador-accent">
                  mirador.homes
                </Link>
              </li>
              <li>
                <Link href="/design" className="hover:text-mirador-accent">
                  Componentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-mirador-text-muted">
              BLCK. 03
            </p>
            <ul className="mt-3 space-y-2 text-sm text-mirador-text-muted">
              <li>ES · EN</li>
              <li>© {year} Mirador</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}