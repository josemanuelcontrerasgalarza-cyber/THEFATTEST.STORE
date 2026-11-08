"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Cookie, X } from "lucide-react";
import { useConsent, type ConsentCategory, type ConsentChoices } from "@/lib/consent";
import { cookieInventory } from "@/lib/cookie-inventory";
import { legalRoutes, trackers } from "@/lib/legal";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/format";

const CATS: ConsentCategory[] = ["necessary", "analytics", "marketing", "preferences"];
const ease = [0.16, 1, 0.3, 1] as const;

/** Banner + preferences panel + consent-gated scripts. Mounted once in the root layout. */
export function CookieConsent() {
  const { record, hydrated, panelOpen, hydrate } = useConsent();
  useEffect(() => {
    hydrate();
    // Legacy: an older version kept newsletter e-mails on the device. Not needed — remove it.
    try {
      localStorage.removeItem("thefattest-newsletter");
    } catch {}
  }, [hydrate]);
  return (
    <>
      <AnimatePresence>{hydrated && !record && !panelOpen && <Banner key="banner" />}</AnimatePresence>
      <AnimatePresence>{panelOpen && <Preferences key="panel" />}</AnimatePresence>
      <ConsentScripts />
    </>
  );
}

function Banner() {
  const { t } = useI18n();
  const { acceptAll, rejectAll, openPanel } = useConsent();
  const hasTrackers = Boolean(trackers.gaId || trackers.metaPixelId);
  return (
    <motion.section
      role="region"
      aria-label={t("ck.aria")}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.8, duration: 0.6, ease } }}
      exit={{ y: 40, opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-x-0 bottom-0 z-[66] p-2 pb-[calc(env(safe-area-inset-bottom)+8px)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[420px] sm:p-0"
    >
      <div className="relative overflow-hidden border border-white/15 bg-cement/95 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-acid/10 blur-3xl" aria-hidden />
        <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-acid">
          <Cookie className="size-3.5" /> {t("ck.eyebrow")}
        </p>
        <p className="mt-3 font-display text-2xl uppercase leading-none">{t("ck.title")}</p>
        <p className="mt-2 text-[13px] leading-relaxed text-white/70">
          {t(hasTrackers ? "ck.textTrackers" : "ck.text")}{" "}
          <Link href={legalRoutes.cookies} className="text-bone underline underline-offset-2 hover:text-acid">{t("ck.policy")}</Link>.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={rejectAll} className="h-11 border border-white/25 text-[11px] font-bold tracking-[0.2em] transition hover:border-bone">
            {t("ck.reject")}
          </button>
          <button onClick={acceptAll} className="h-11 bg-acid text-[11px] font-bold tracking-[0.2em] text-ink transition hover:brightness-110">
            {t("ck.accept")}
          </button>
        </div>
        <button onClick={openPanel} className="mt-3 w-full text-center text-[11px] font-semibold tracking-[0.2em] text-ash underline-offset-4 transition hover:text-bone hover:underline">
          {t("ck.configure")}
        </button>
      </div>
    </motion.section>
  );
}

function Preferences() {
  const { t } = useI18n();
  const { record, save, acceptAll, rejectAll, closePanel } = useConsent();
  const [choices, setChoices] = useState<ConsentChoices>(
    record?.choices ?? { necessary: true, analytics: false, marketing: false, preferences: false },
  );
  const [open, setOpen] = useState<ConsentCategory | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [closePanel]);

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button aria-label={t("a11y.close")} onClick={closePanel} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ck-title"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5, ease } }}
        exit={{ y: 60, opacity: 0, transition: { duration: 0.25 } }}
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col border border-white/15 bg-ink shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-acid">{t("ck.eyebrow")}</p>
            <h2 id="ck-title" className="mt-2 font-display text-3xl uppercase leading-none sm:text-4xl">{t("ck.panelTitle")}</h2>
          </div>
          <button onClick={closePanel} aria-label={t("a11y.close")} className="grid size-10 shrink-0 place-items-center border border-white/15 transition hover:border-bone">
            <X className="size-4" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-white/70">
            {t("ck.panelText")}{" "}
            <Link href={legalRoutes.cookies} onClick={closePanel} className="text-bone underline underline-offset-2 hover:text-acid">{t("ck.policy")}</Link>.
          </p>
          <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {CATS.map((c) => {
              const items = cookieInventory[c];
              const locked = c === "necessary";
              const on = locked || choices[c];
              const expanded = open === c;
              return (
                <li key={c} className="py-4">
                  <div className="flex items-start gap-4">
                    <button onClick={() => setOpen(expanded ? null : c)} aria-expanded={expanded} className="flex min-w-0 flex-1 items-start gap-2 text-left">
                      <ChevronDown className={cn("mt-0.5 size-4 shrink-0 text-ash transition", expanded && "rotate-180")} />
                      <span>
                        <span className="block text-sm font-semibold uppercase tracking-wide">{t(`ck.cat.${c}`)}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-ash">{t(`ck.desc.${c}`)}</span>
                      </span>
                    </button>
                    {locked ? (
                      <span className="shrink-0 pt-0.5 font-mono text-[10px] tracking-[0.15em] text-acid">{t("ck.always")}</span>
                    ) : (
                      <Switch checked={on} onChange={(v) => setChoices((p) => ({ ...p, [c]: v }))} label={t(`ck.cat.${c}`)} />
                    )}
                  </div>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="ml-6 mt-3 space-y-2">
                          {items.length === 0 ? (
                            <p className="border border-dashed border-white/15 p-3 text-xs text-ash">{t("ck.noneConfigured")}</p>
                          ) : (
                            items.map((i) => (
                              <div key={i.name} className="border border-white/10 bg-cement/50 p-3 text-xs">
                                <p className="font-mono text-bone">{i.name}</p>
                                <p className="mt-1 text-ash">{i.purpose}</p>
                                <p className="mt-1 text-white/40">{i.provider} · {i.duration}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
          {record && (
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.1em] text-white/40">
              {t("ck.current", { date: new Date(record.date).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }), v: record.version })}
            </p>
          )}
        </div>

        <footer className="grid grid-cols-2 gap-2 border-t border-white/10 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] sm:grid-cols-3 sm:p-5">
          <button onClick={rejectAll} className="h-12 border border-white/25 text-[11px] font-bold tracking-[0.18em] transition hover:border-bone">{t("ck.reject")}</button>
          <button onClick={acceptAll} className="h-12 border border-acid text-[11px] font-bold tracking-[0.18em] text-acid transition hover:bg-acid/10">{t("ck.accept")}</button>
          <button onClick={() => save(choices, "custom")} className="col-span-2 h-12 bg-acid text-[11px] font-bold tracking-[0.18em] text-ink transition hover:brightness-110 sm:col-span-1">{t("ck.save")}</button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors", checked ? "border-acid bg-acid" : "border-white/25 bg-white/5")}
    >
      <span className={cn("absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-all", checked ? "left-[22px] bg-ink" : "left-[3px] bg-white/60")} />
    </button>
  );
}

/** Third-party scripts. Rendered only when configured AND consented — nothing loads before. */
function ConsentScripts() {
  const record = useConsent((s) => s.record);
  const analytics = Boolean(trackers.gaId && record?.choices.analytics);
  const marketing = Boolean(trackers.metaPixelId && record?.choices.marketing);
  return (
    <>
      {analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${trackers.gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${trackers.gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {marketing && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${trackers.metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

/** Permanent "cookie settings" trigger (footer, cookie policy). */
export function CookieSettingsButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { t } = useI18n();
  const openPanel = useConsent((s) => s.openPanel);
  return (
    <button type="button" onClick={openPanel} className={className}>
      {children ?? t("ck.settings")}
    </button>
  );
}
