import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { PosthogAnalytics } from "@/components/analytics/PosthogAnalytics";

const sourceSans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

/** Display serif — “Mirador” wordmark only (header/footer). */
const cormorantDisplay = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"
  ),
  title: {
    default: "Mirador",
    template: "%s · Mirador",
  },
  description:
    "Recorridos 3D para propiedad en Colombia — espacios reales y diseños por explorar. · 3D property tours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${sourceSans.variable} ${cormorantDisplay.variable} h-full antialiased`}
    >
      {/* h-full chains % heights to R3F; min-h-dvh covers mobile dynamic toolbar */}
      <body className="h-full min-h-dvh bg-background text-foreground">
        <PosthogAnalytics />
        {children}
      </body>
    </html>
  );
}
