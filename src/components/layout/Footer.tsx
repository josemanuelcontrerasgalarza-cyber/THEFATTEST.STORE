import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Newsletter } from "./Newsletter";
import { siteConfig } from "@/lib/config";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { waLink, waMessages } from "@/lib/whatsapp";

const cols = [
  {
    title: "SHOP",
    links: [
      { label: "Todo", href: "/shop" },
      { label: "New drops", href: "/shop?new=1" },
      { label: "Camisetas", href: "/shop?cat=camisetas" },
      { label: "Buzos", href: "/shop?cat=buzos" },
      { label: "Conjuntos", href: "/shop?cat=conjuntos" },
      { label: "Sneakers", href: "/shop?cat=sneakers" },
      { label: "Ofertas", href: "/shop?sale=1" },
    ],
  },
  {
    title: "AYUDA",
    links: [
      { label: "Preguntas frecuentes", href: "/info/faq" },
      { label: "Envíos", href: "/info/envios" },
      { label: "Cambios y devoluciones", href: "/info/cambios" },
      { label: "Contacto", href: "/info/contacto" },
      { label: "Mis pedidos", href: "/account" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Política de privacidad", href: "/info/privacidad" },
      { label: "Términos y condiciones", href: "/info/terminos" },
      { label: "Sobre nosotros", href: "/about" },
    ],
  },
];

export function Footer() {
  const wa = waLink(waMessages.general());
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pb-28 pt-16 sm:pb-10">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="text-5xl" withDomain />
            <p className="mt-4 max-w-sm text-sm text-ash">{siteConfig.tagline} Streetwear, sneakers &amp; essentials para los que se mueven diferente.</p>
            <div className="mt-8">
              <Newsletter />
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:justify-items-end" aria-label="Pie de página">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-white/80 transition hover:text-acid">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-16 select-none font-display text-[19vw] leading-[0.8] tracking-tight text-bone lg:text-[16vw]" aria-hidden>
          STAY <span className="text-outline">FATTEST.</span>
        </p>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-[0.15em] text-ash">
            © {new Date().getFullYear()} {siteConfig.domain} — TODOS LOS DERECHOS RESERVADOS
          </p>
          <div className="flex items-center gap-2">
            <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid size-11 place-items-center border border-white/15 transition hover:border-acid hover:text-acid">
              <InstagramIcon className="size-4" />
            </a>
            {siteConfig.tiktokUrl && (
              <a href={siteConfig.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="grid size-11 place-items-center border border-white/15 transition hover:border-acid hover:text-acid">
                <TikTokIcon className="size-4" />
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center border border-white/15 transition hover:border-acid hover:text-acid">
                <WhatsAppIcon className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
