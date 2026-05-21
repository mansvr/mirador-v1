import type { ListingCardProps } from "@/components/listing/ListingCard";

const DEMO_SCENE = "scene_best50000";

/** Sample listings for mirador.home prototype (`/home`). */
export const DEMO_LISTINGS: ListingCardProps[] = [
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
];
