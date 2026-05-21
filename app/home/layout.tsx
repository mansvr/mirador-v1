import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Explora apartamentos y casas con recorridos 3D en Colombia. · Browse listings with 3D tours",
  openGraph: {
    title: "Mirador — Propiedades",
    description: "Recorridos 3D para comprar y arrendar en Colombia.",
    siteName: "Mirador",
    locale: "es_CO",
  },
};

export default function HomeAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
