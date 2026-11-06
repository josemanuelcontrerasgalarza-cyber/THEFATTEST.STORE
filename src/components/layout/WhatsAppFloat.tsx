"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { waLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/format";

/** Messages stay in Spanish: they are read by the store team. */
const TOPICS = [
  { key: "wa.t1", text: "Hola THEFATTEST 👋 Quiero consultar por un producto." },
  { key: "wa.t2", text: "Hola THEFATTEST 👋 ¿Me ayudan con la guía de tallas?" },
  { key: "wa.t3", text: "Hola THEFATTEST 👋 ¿Qué tienen disponible ahora mismo?" },
  { key: "wa.t4", text: "Hola THEFATTEST 👋 Quiero asesoría personalizada para armar un outfit." },
  { key: "wa.t5", text: "Hola THEFATTEST 👋 Quiero confirmar mi pedido. Mi código es: " },
];

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const pathname = usePathname();
  // On phones the product page has its own sticky buy bar and checkout needs room for the form.
  const hideOnMobile = pathname.startsWith("/product/") || pathname.startsWith("/checkout") || pathname.startsWith("/shop");
  // On phones, wait until the visitor scrolls past the first screen so it never covers the hero buttons.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  if (!siteConfig.whatsappNumber) return null;

  return (
    <div className={cn("fixed bottom-[calc(env(safe-area-inset-bottom)+16px)] right-4 z-[65] sm:bottom-6 sm:right-6", (hideOnMobile || (!scrolled && !open)) && "hidden lg:block")}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[min(86vw,320px)] origin-bottom-right border border-white/10 bg-cement shadow-2xl sm:bottom-[72px]"
            role="dialog"
            aria-label={t("wa.title")}
          >
            <div className="border-b border-white/10 p-4">
              <p className="font-display text-2xl leading-none">{t("wa.title")}</p>
              <p className="mt-1 text-xs text-ash">{t("wa.sub")}</p>
            </div>
            <ul className="p-2">
              {TOPICS.map((x) => (
                <li key={x.key}>
                  <a href={waLink(x.text)!} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-3 text-sm transition hover:bg-white/5 hover:text-acid">
                    {t(x.key)}
                    <MessageCircle className="size-4 text-ash" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? t("a11y.closeWa") : t("a11y.openWa")}
        aria-expanded={open}
        className="relative grid size-[52px] place-items-center rounded-full bg-[#25D366] text-ink shadow-[0_10px_30px_-5px_rgba(37,211,102,0.5)] transition hover:brightness-110 sm:size-14"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.5s]" aria-hidden />}
        {open ? <X className="size-6" /> : <WhatsAppIcon className="size-7" />}
      </motion.button>
    </div>
  );
}
