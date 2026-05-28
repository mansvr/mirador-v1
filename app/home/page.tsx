import type { Metadata } from "next";
import { getPublishedListingCards } from "@/lib/listings/get-listings";
import { listingsHubMetadata } from "@/lib/listings/home-metadata";
import { ListingCard } from "@/components/listing/ListingCard";
import { HomeFooter, HomeHeader, SitePageShell } from "@/components/home/HomeShell";

export async function generateMetadata(): Promise<Metadata> {
  return listingsHubMetadata();
}

export default async function HomeListingsPage() {
  const listings = await getPublishedListingCards();

  return (
    <SitePageShell>
      <HomeHeader />
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-10 sm:px-5 md:px-6 md:py-12">
        <header className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-mirador-text-muted">
            mirador.homes
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
            Propiedades con tour 3D
          </h1>
          <p className="mt-3 text-pretty text-lg text-mirador-text-muted">
            Explora espacios reales antes de visitar. Toca una tarjeta para abrir el recorrido.
          </p>
        </header>

        <ul className="grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <li key={listing.href}>
              <ListingCard {...listing} />
            </li>
          ))}
        </ul>
      </main>
      <HomeFooter />
    </SitePageShell>
  );
}
