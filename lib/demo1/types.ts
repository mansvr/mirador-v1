export interface PropertyGalleryItem {
  title: string;
  imageUrl: string;
  aspect: "16/9" | "4/3" | "3/4" | "4/5" | "9/16" | "1/1";
}

export interface PropertyMicrosite {
  slug: string;
  locale: "es" | "en";
  hlsUrl: string | null;
  posterUrl: string;
  hlsUrlVertical?: string | null;
  durationSec: number;
  aspectRatio: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  specs: {
    beds: number;
    baths: number;
    sqm: number;
    verified?: boolean;
  };
  agent: {
    name: string;
    phone: string;
    whatsapp: string;
    photoUrl?: string;
  };
  ctas: {
    primary: string;
    secondary: string;
  };
  gallery: PropertyGalleryItem[];
}
