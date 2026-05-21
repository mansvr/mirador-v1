import Link from "next/link";
import { MiradorWordmark } from "@/components/brand/MiradorMark";
import { ListingCard } from "@/components/listing/ListingCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_SCENE = "scene_best50000";

const SAMPLES = [
  {
    title: "Apartamento en Chapinero",
    neighborhood: "Chapinero",
    city: "Bogotá",
    beds: 3,
    areaM2: 92,
    priceLabel: "$485.000.000 COP",
    href: `/v/${DEMO_SCENE}`,
    hasTour: true,
  },
  {
    title: "Penthouse con terraza",
    neighborhood: "El Poblado",
    city: "Medellín",
    beds: 4,
    areaM2: 168,
    priceLabel: "$1.250.000.000 COP",
    href: `/v/${DEMO_SCENE}`,
    hasTour: true,
  },
  {
    title: "Estudio cerca al parque",
    neighborhood: "Laureles",
    city: "Medellín",
    beds: 1,
    areaM2: 48,
    priceLabel: "$320.000.000 COP",
    href: `/v/${DEMO_SCENE}`,
    hasTour: false,
  },
] as const;

export default function DesignPreviewPage() {
  return (
    <div className="min-h-dvh bg-mirador-bg text-mirador-text">
      <header className="border-b border-mirador-border bg-mirador-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <MiradorWordmark />
          <div className="flex items-center gap-3 text-sm">
            <span className="text-mirador-text-muted">Design preview</span>
            <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Volver a /
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-mirador-text-muted">
          Step 4 · ListingCard
        </p>
        <h1 className="mt-2 text-2xl font-medium md:text-3xl">Tarjetas de listing</h1>
        <p className="mt-2 max-w-2xl text-mirador-text-muted">
          Drake + Rissim + Gola. Tokens: warm stone ·{" "}
          <code className="rounded bg-mirador-surface px-1 text-xs">brand/tokens/colors.json</code>
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLES.map((listing) => (
            <ListingCard key={listing.title} {...listing} />
          ))}
        </div>
      </main>
    </div>
  );
}
