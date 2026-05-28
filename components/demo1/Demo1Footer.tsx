import Link from "next/link";

interface Demo1FooterProps {
  propertyTitle: string;
}

/**
 * Client-facing demo footer: brand, disclaimer, easy paths to contact / main site.
 */
export function Demo1Footer({ propertyTitle }: Demo1FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg px-4 py-10 pb-28 text-center sm:pb-10">
      <p className="font-display text-lg text-text">{propertyTitle}</p>
      <p className="mt-2 text-sm text-text-muted">
        Demo Mirador · material de presentación
      </p>
      <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-text-muted">
        Las imágenes y datos son ilustrativos. No constituye oferta comercial ni
        compromiso de venta o arriendo. Para disponibilidad y precios, contacte
        al agente.
      </p>
      <nav
        className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm"
        aria-label="Enlaces del pie"
      >
        <Link
          href="/"
          className="font-medium text-text transition-sacred hover:text-text-emphasis"
        >
          mirador.lat
        </Link>
        <span className="text-border" aria-hidden>
          ·
        </span>
        <a
          href="#contacto"
          className="text-text-muted transition-sacred hover:text-text"
        >
          Contacto
        </a>
      </nav>
      <p className="mt-6 text-xs text-text-muted">
        © {year} Mirador
      </p>
    </footer>
  );
}
