/**
 * Store-wide configuration. Everything business-specific lives here or in env
 * vars so the real data can be dropped in without touching components.
 */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const siteConfig = {
  name: "THEFATTEST",
  domain: "THEFATTEST.STORE",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://thefattest.store",
  tagline: "HECHO DIFERENTE. SE LLEVA DIFERENTE.",
  description:
    "Ropa urbana, tenis y esenciales. Hecho para los que se mueven diferente. Tienda online de ropa urbana, sneakers, joyería y perfumería en Colombia.",
  established: 2026,
  currency: "COP",
  locale: "es-CO",
  /** Digits only, international format (57 + celular). Store line: +57 310 538 6878. */
  whatsappNumber: (env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ?? "573105386878").replace(/\D/g, ""),
  instagramUrl: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? "https://www.instagram.com/thefattest.store/",
  instagramHandle: "@thefattest.store",
  tiktokUrl: env(process.env.NEXT_PUBLIC_TIKTOK_URL),
  contactEmail: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  shipping: {
    freeFrom: 300_000,
    flatRate: 14_900,
    eta: "2–5 días hábiles",
  },
  returnsDays: 15,
} as const;

export const navLinks = [
  { key: "nav.shop", label: "TIENDA", href: "/shop" },
  { key: "nav.new", label: "LO NUEVO", href: "/shop?new=1" },
  { key: "nav.clothing", label: "ROPA", href: "/shop?group=clothing" },
  { key: "nav.sneakers", label: "TENIS", href: "/shop?cat=sneakers" },
  { key: "nav.accessories", label: "ACCESORIOS", href: "/shop?group=accessories" },
  { key: "nav.fragrances", label: "PERFUMES", href: "/shop?cat=perfumeria" },
  { key: "nav.about", label: "NOSOTROS", href: "/about" },
] as const;
