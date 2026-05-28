import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  demo1OpenGraphImages,
  demo1TwitterImage,
} from "@/lib/demo1/share-metadata";
import "./demo-globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-demo-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-demo-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI67",
  description:
    "Apartamento AI67 — recorrido en video, galería y contacto con agente Mirador.",
  openGraph: {
    title: "AI67 · Mirador",
    description:
      "Apartamento con acabados contemporáneos y espacios luminosos.",
    type: "website",
    images: demo1OpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: "AI67 · Mirador",
    description:
      "Apartamento con acabados contemporáneos y espacios luminosos.",
    images: demo1TwitterImage(),
  },
};

export default function Demo1Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`demo1-root ${cormorant.variable} ${manrope.variable}`}
      data-demo-theme="ai67"
    >
      {children}
    </div>
  );
}
