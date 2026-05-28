import type { Demo1Locale } from "@/lib/demo1/locale";

const messages = {
  es: {
    nav: {
      gallery: "Galería",
      contact: "Contacto",
      whatsapp: "WhatsApp",
      homeAria: "Mirador — inicio",
    },
    hero: {
      specsLine: "{beds} hab · {baths} ba · {sqm} m²",
      scrollAria: "Deslizar para explorar el recorrido",
      scrollLabel: "Deslizar",
    },
    specs: {
      beds: "Habitaciones",
      baths: "Baños",
      area: "Área",
      verified: "Propiedad verificada · Mirador",
    },
    gallery: {
      eyebrow: "Espacios",
      title: "Galería",
    },
    contact: {
      eyebrow: "Contacto",
    },
    footer: {
      demoLine: "Demo Mirador · material de presentación",
      disclaimer:
        "Las imágenes y datos son ilustrativos. No constituye oferta comercial ni compromiso de venta o arriendo. Para disponibilidad y precios, contacte al agente.",
      contact: "Contacto",
      navAria: "Enlaces del pie",
    },
  },
  en: {
    nav: {
      gallery: "Gallery",
      contact: "Contact",
      whatsapp: "WhatsApp",
      homeAria: "Mirador — home",
    },
    hero: {
      specsLine: "{beds} bed · {baths} bath · {sqm} m²",
      scrollAria: "Scroll to explore the tour",
      scrollLabel: "Scroll",
    },
    specs: {
      beds: "Bedrooms",
      baths: "Bathrooms",
      area: "Area",
      verified: "Verified listing · Mirador",
    },
    gallery: {
      eyebrow: "Spaces",
      title: "Gallery",
    },
    contact: {
      eyebrow: "Contact",
    },
    footer: {
      demoLine: "Mirador demo · presentation material",
      disclaimer:
        "Images and data are illustrative only. This is not a commercial offer or commitment to sell or rent. Contact the agent for availability and pricing.",
      contact: "Contact",
      navAria: "Footer links",
    },
  },
} as const satisfies Record<Demo1Locale, Record<string, unknown>>;

export type Demo1Messages = (typeof messages)[Demo1Locale];

export function demo1Messages(locale: Demo1Locale): Demo1Messages {
  return messages[locale];
}

export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(vars[key] ?? ""),
  );
}
