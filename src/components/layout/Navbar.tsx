"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, User, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SearchOverlay } from "./SearchOverlay";
import { navLinks, siteConfig } from "@/lib/config";
import { useCart } from "@/store/cart";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/format";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { waLink, waMessages } from "@/lib/whatsapp";
import { LangToggle, useI18n } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openCart = useCart((s) => s.open);
  const mounted = useMounted();
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-white/10 bg-ink/75 backdrop-blur-xl" : "border-transparent bg-ink/40 backdrop-blur-sm",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-10" aria-label="Principal">
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setMenuOpen(true)} aria-label={t("a11y.openMenu")} aria-expanded={menuOpen} className="-ml-2 grid size-11 place-items-center">
              <Menu className="size-5" />
            </button>
          </div>

          <Logo className="text-[26px] lg:text-[30px]" />

          <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((l) => {
              const active = l.href === pathname;
              return (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    className={cn(
                      "group relative whitespace-nowrap py-2 text-[11px] font-semibold tracking-[0.14em] xl:text-[11.5px] xl:tracking-[0.18em] text-white/75 transition-colors hover:text-bone",
                      active && "text-bone",
                    )}
                  >
                    {l.key === "nav.new" && <span className="absolute -right-2.5 top-1.5 size-1.5 rounded-full bg-acid" aria-hidden />}
                    {t(l.key)}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-bone transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <LangToggle className="mr-1 sm:mr-2" />
            <button onClick={() => setSearchOpen(true)} aria-label={t("a11y.search")} className="grid size-11 place-items-center text-white/80 transition hover:text-bone">
              <Search className="size-[19px]" />
            </button>
            <Link href="/account" aria-label={t("a11y.account")} className="hidden size-11 place-items-center text-white/80 transition hover:text-bone sm:grid">
              <User className="size-[19px]" />
            </Link>
            <button onClick={openCart} aria-label={t("a11y.openCart", { n: mounted ? count : 0 })} className="relative -mr-2 grid size-11 place-items-center text-white/80 transition hover:text-bone">
              <ShoppingBag className="size-[19px]" />
              <AnimatePresence>
                {mounted && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute right-1 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-acid px-1 font-mono text-[10px] font-bold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-ink lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t("a11y.menu")}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Logo className="text-[26px]" />
              <button onClick={() => setMenuOpen(false)} aria-label={t("a11y.closeMenu")} className="-mr-2 grid size-11 place-items-center">
                <X className="size-6" />
              </button>
            </div>
            <div className="px-6 pt-2"><LangToggle size="lg" /></div>
            <ul className="flex flex-1 flex-col justify-center gap-1 px-6">
              {navLinks.map((l, i) => (
                <motion.li key={l.key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={l.href} className="group flex items-center justify-between border-b border-white/10 py-3 font-display text-[clamp(34px,11vw,48px)] leading-none tracking-tight">
                    <span className="transition-colors group-active:text-acid">{t(l.key)}</span>
                    <ArrowUpRight className="size-6 text-ash" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-white/10 px-6 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-5">
              <Link href="/account" className="font-mono text-xs tracking-[0.2em] text-ash">{t("menu.account")}</Link>
              <div className="flex items-center gap-5">
                {waLink(waMessages.general()) && (
                  <a href={waLink(waMessages.general())!} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-[#25D366]"><WhatsAppIcon className="size-5" /></a>
                )}
                {siteConfig.instagramUrl && (
                  <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon className="size-5" /></a>
                )}
                {siteConfig.tiktokUrl && (
                  <a href={siteConfig.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><TikTokIcon className="size-5" /></a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
