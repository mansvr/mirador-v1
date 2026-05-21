import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ListingCardImage } from "@/components/listing/ListingCardImage";
import { cn } from "@/lib/utils";

export type ListingCardProps = {
  title: string;
  neighborhood: string;
  city: string;
  beds: number;
  areaM2: number;
  priceLabel: string;
  href: string;
  imageUrl?: string;
  hasTour?: boolean;
  className?: string;
};

/** Drake + Rissim + Gola — brand/identity/ref-screenshots/TAKEAWAYS.md */
export function ListingCard({
  title,
  neighborhood,
  city,
  beds,
  areaM2,
  priceLabel,
  href,
  imageUrl,
  hasTour = true,
  className,
}: ListingCardProps) {
  const tourLinkProps = {
    target: "_blank" as const,
    rel: "noopener noreferrer",
  };

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-mirador-border bg-mirador-surface",
        "transition-[border-color,transform,box-shadow] duration-150",
        "hover:-translate-y-px hover:border-mirador-text-muted/40 hover:shadow-sm",
        className
      )}
    >
      <Link
        href={href}
        {...tourLinkProps}
        className="relative block aspect-[16/10] overflow-hidden bg-mirador-bg"
      >
        {imageUrl ? (
          <ListingCardImage
            src={imageUrl}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center bg-gradient-to-br from-[#E7E6DC] to-[#CCC3B7] text-sm text-mirador-text-muted"
            aria-hidden
          >
            Vista previa
          </div>
        )}
        {hasTour ? (
          <span className="absolute left-3 top-3 rounded-full bg-mirador-text px-2.5 py-0.5 text-xs font-medium text-[#F5F6F2]">
            Tour 3D
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-medium leading-snug text-mirador-text">
            <Link href={href} {...tourLinkProps} className="hover:text-mirador-accent">
              {title}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-mirador-text-muted">
            {neighborhood} · {city}
          </p>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-mirador-border pt-3 text-sm">
          <dt className="text-mirador-text-muted">Precio</dt>
          <dd className="font-medium tabular-nums text-mirador-text">{priceLabel}</dd>
          <dt className="text-mirador-text-muted">Hab.</dt>
          <dd className="tabular-nums text-mirador-text">{beds}</dd>
          <dt className="text-mirador-text-muted">Área</dt>
          <dd className="tabular-nums text-mirador-text">{areaM2} m²</dd>
        </dl>

        <Link
          href={href}
          {...tourLinkProps}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "mt-auto min-h-11 w-full justify-center gap-1.5"
          )}
        >
          Ver recorrido 3D
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
