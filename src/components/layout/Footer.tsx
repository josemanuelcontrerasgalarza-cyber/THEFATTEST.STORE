"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Newsletter } from "./Newsletter";
import { siteConfig } from "@/lib/config";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { waLink, waMessages } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n";
import { legal, legalRoutes, waDisplay } from "@/lib/legal";
import { CookieSettingsButton } from "@/components/legal/CookieConsent";
import { Cookie } from "lucide-react";

const cols = () => [
  {
    title: "footer.shop",
    links: [
      { label: "footer.all", href: "/shop" },
      { label: "footer.new", href: "/shop?new=1" },
      { label: "cat:camisetas", href: "/shop?cat=camisetas" },
      { label: "cat:buzos", href: "/shop?cat=buzos" },
      { label: "cat:conjuntos", href: "/shop?cat=conjuntos" },
      { label: "cat:sneakers", href: "/shop?cat=sneakers" },
    ],
  },
  {
    title: "footer.help",
    links: [
      { label: "footer.faq", href: "/info/faq" },
      { label: "footer.shipping", href: "/info/envios" },
      { label: "footer.contact", href: "/info/contacto" },
      { label: "footer.orders", href: "/account" },
      { label: "footer.about", href: "/about" },
    ],
  },
  {
    title: "footer.legal",
    links: [
      { label: "footer.privacy", href: legalRoutes.privacy },
      { label: "footer.terms", href: legalRoutes.terms },
      { label: "footer.cookies", href: legalRoutes.cookies },
      { label: "footer.returns", href: legalRoutes.returns },
      { label: "footer.seller", href: legalRoutes.seller },
    ],
  },
];

export function Footer() {
  const { t, cat } = useI18n();
  const wa = waLink(waMessages.general());
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pb-24 pt-14 sm:pb-10 sm:pt-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="text-[64px] sm:text-[80px]" />
            <p className="mt-4 max-w-sm text-sm text-ash">{t("footer.tagline")}</p>
            <div className="mt-8">
              <Newsletter />
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:justify-items-end" aria-label={t("footer.nav")}>
            {cols().map((c) => (
              <div key={c.title}>
                <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{t(c.title)}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="text-sm text-white/80 transition hover:text-acid">{l.label.startsWith("cat:") ? cat(l.label.slice(4)) : t(l.label)}</Link>
                    </li>
                  ))}
                  {c.title === "footer.legal" && (
                    <li>
                      <CookieSettingsButton className="group inline-flex items-center gap-1.5 text-left text-sm text-acid transition hover:text-bone">
                        <Cookie className="size-3.5" /> {t("footer.cookieSettings")}
                      </CookieSettingsButton>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-16 select-none font-display text-[19vw] leading-[0.8] tracking-tight text-bone lg:text-[16vw]" aria-hidden>
          {t("footer.stay")} <span className="text-outline">FATTEST.</span>
        </p>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <p className="font-mono text-[11px] tracking-[0.15em] text-ash">
              © {new Date().getFullYear()} {siteConfig.domain} — {t("footer.rights")}
            </p>
            <p className="max-w-2xl text-[11px] leading-relaxed text-white/40">
              {legal.sellerName ? (
                <>
                  {t("legal.sellerLine")}: {legal.sellerName}
                  {legal.sellerId ? ` · ${legal.sellerIdType} ${legal.sellerId}` : ""}
                  {legal.address ? ` · ${legal.address}${legal.city ? `, ${legal.city}` : ""}` : ""} · {legal.country}
                </>
              ) : (
                <Link href={legalRoutes.seller} className="underline-offset-2 hover:text-bone hover:underline">{t("legal.pending")}</Link>
              )}
              {legal.whatsapp ? ` · WhatsApp ${waDisplay(legal.whatsapp)}` : ""}
              {legal.email ? ` · ${legal.email}` : ""}
              {" · "}
              <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-bone hover:underline">SIC</a>
            </p>
          </div>
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
