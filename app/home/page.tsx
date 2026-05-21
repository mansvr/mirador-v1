import { ListingCard } from "@/components/listing/ListingCard";
import { HomeFooter, HomeHeader } from "@/components/home/HomeShell";
import { DEMO_LISTINGS } from "@/lib/listings/demo-listings";

export default function HomeListingsPage() {
  return (
    <div className="min-h-dvh bg-mirador-bg text-mirador-text">
      <HomeHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <header className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-mirador-text-muted">
            mirador.home
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
            Propiedades con tour 3D
          </h1>
          <p className="mt-3 text-pretty text-lg text-mirador-text-muted">
            Explora espacios reales antes de visitar. Toca una tarjeta para abrir el recorrido.
          </p>
        </header>

        <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_LISTINGS.map((listing) => (
            <li key={listing.title}>
              <ListingCard {...listing} />
            </li>
          ))}
        </ul>
      </main>
      <HomeFooter />
    </div>
  );
}
