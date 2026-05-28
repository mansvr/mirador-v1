import type { PropertyMicrosite } from "@/lib/demo1/types";
import { SacredIcon } from "@/components/demo1/SacredIcon";

interface SpecStripProps {
  specs: PropertyMicrosite["specs"];
}

export function SpecStrip({ specs }: SpecStripProps) {
  const items = [
    {
      label: "Habitaciones",
      value: String(specs.beds),
      icon: "solar:bed-linear",
    },
    {
      label: "Baños",
      value: String(specs.baths),
      icon: "solar:bath-linear",
    },
    {
      label: "Área",
      value: `${specs.sqm} m²`,
      icon: "solar:ruler-angular-linear",
    },
  ];

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-5xl grid-cols-3 divide-x divide-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center px-4 py-6 sm:px-8 sm:py-8"
          >
            <SacredIcon
              name={item.icon}
              size={28}
              color="726A5C"
              className="mb-1.5"
            />
            <p className="font-display text-2xl text-text sm:text-3xl">{item.value}</p>
            <p className="label-sacred mt-2 text-text-muted">{item.label}</p>
          </div>
        ))}
      </div>
      {specs.verified && (
        <p className="border-t border-border bg-bg py-2 text-center text-xs tracking-wide text-text-muted">
          Propiedad verificada · Mirador
        </p>
      )}
    </section>
  );
}
