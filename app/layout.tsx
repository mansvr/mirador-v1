import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PosthogAnalytics } from "@/components/analytics/PosthogAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"
  ),
  title: "Mirador",
  description: "Immersive 3D property experiences powered by Mirador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      {/* h-full chains % heights to R3F; min-h-dvh covers mobile dynamic toolbar */}
      <body className="h-full min-h-dvh bg-black text-white">
        <PosthogAnalytics />
        {children}
      </body>
    </html>
  );
}
