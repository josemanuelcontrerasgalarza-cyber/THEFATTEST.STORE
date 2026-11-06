import type { Metadata, Viewport } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { Toaster } from "@/components/ui/Toaster";
import { I18nProvider } from "@/lib/i18n";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-src", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Ropa urbana, tenis y esenciales`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["streetwear", "ropa urbana", "sneakers", "Colombia", "camisetas oversized", "buzos", "joyería", "perfumería", "THEFATTEST"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: siteConfig.domain,
    title: `${siteConfig.name} — Nada de seguidores. Pura influencia.`,
    description: siteConfig.description,
    images: [{ url: "/products/hellstar-records-black.jpg", width: 1194, height: 1456, alt: "THEFATTEST" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" className={`${anton.variable} ${inter.variable} ${mono.variable}`}>
      <body className="grain min-h-dvh antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-acid focus:px-4 focus:py-2 focus:text-ink">
          Saltar al contenido
        </a>
        <I18nProvider>
        <AnnouncementBar />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <WhatsAppFloat />
        <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
