"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Truck, RefreshCcw, ChevronDown, AlertCircle, Info } from "lucide-react";
import { isSoldOut, stockFor, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";
import { siteConfig } from "@/lib/config";
import { cn, formatCOP } from "@/lib/format";
import { waLink, waMessages } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ProductBadges, Price } from "./Badges";

export function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { t, pName, pDesc, pDetails, color: colorName, size: sizeName, cat } = useI18n();
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);

  const singleColor = product.colors.length === 1;
  const singleSize = product.sizes.length === 1;
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | null>(singleColor ? product.colors[0].name : null);
  const [size, setSize] = useState<string | null>(singleSize && product.sizes[0].stock > 0 ? product.sizes[0].label : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>("details");
  const ctaRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  const name = pName(product);
  const sold = isSoldOut(product);
  const maxQty = size ? stockFor(product, size) : 0;
  const buyable = !sold && !product.demo;

  // Show the mobile sticky bar only when the main buttons are off-screen.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCtaVisible(e.isIntersecting), { rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pickColor = (n: string) => {
    setColor(n);
    setError(null);
    const idx = product.colors.find((c) => c.name === n)?.image;
    if (idx !== undefined) setImgIdx(idx);
  };

  const validate = (): boolean => {
    const msg = !color && !size ? "pdp.errBoth" : !color ? "pdp.errColor" : !size ? "pdp.errSize" : null;
    if (msg) {
      setError(t(msg));
      optionsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleAdd = (buyNow = false) => {
    if (!validate()) return;
    const r = add(product.id, size!, color!, qty);
    if (!r.ok) {
      setError(r.code ? t(`cartMsg.${r.code}`, { n: r.n ?? 0, size: r.size ?? "" }) : t("pdp.errAdd"));
      return;
    }
    if (buyNow) return router.push("/checkout");
    openCart();
  };

  const wa = waLink(waMessages.product(product, size ?? undefined, color ?? undefined));

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 pb-16 pt-4 sm:px-6 sm:pt-6 lg:grid-cols-12 lg:gap-12 lg:px-10 lg:pb-20">
      {/* Gallery */}
      <div className="-mx-4 sm:mx-0 lg:col-span-7">
        <div className="flex flex-col-reverse gap-2 md:flex-row md:gap-3">
          {product.images.length > 1 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 sm:px-0 md:w-20 md:flex-col md:overflow-visible" role="tablist" aria-label={t("a11y.images")}>
              {product.images.map((src, i) => (
                <button
                  key={src}
                  role="tab"
                  aria-selected={imgIdx === i}
                  aria-label={t("a11y.viewImage", { n: i + 1 })}
                  onClick={() => setImgIdx(i)}
                  className={cn("relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-cement ring-1 transition md:w-20", imgIdx === i ? "ring-bone" : "opacity-50 ring-transparent hover:opacity-100")}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-cement">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={imgIdx}
                className="absolute inset-0 touch-pan-y"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                drag={product.images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  const n = product.images.length;
                  if (info.offset.x < -50) setImgIdx((i) => (i + 1) % n);
                  else if (info.offset.x > 50) setImgIdx((i) => (i - 1 + n) % n);
                }}
              >
                <Image src={product.images[imgIdx]} alt={t("pdp.image", { name, n: imgIdx + 1 })} fill priority sizes="(max-width:1024px) 100vw, 55vw" className={cn("pointer-events-none object-cover", sold && "grayscale")} />
              </motion.div>
            </AnimatePresence>
            <ProductBadges product={product} className="absolute left-3 top-3" />
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden" aria-hidden>
                {product.images.map((_, i) => (
                  <span key={i} className={cn("h-1 rounded-full transition-all", i === imgIdx ? "w-5 bg-bone" : "w-1.5 bg-white/40")} />
                ))}
              </div>
            )}
            {product.images.length > 1 && (
              <p className="absolute bottom-3 right-3 hidden bg-ink/70 px-2 py-1 font-mono text-[10px] tracking-[0.2em] backdrop-blur md:block">
                {String(imgIdx + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{cat(product.category).toUpperCase()}</p>
          <h1 className="mt-2 font-display text-[clamp(36px,9vw,72px)] uppercase leading-[0.9] tracking-tight">{name}</h1>
          <div className="mt-3 sm:mt-4"><Price product={product} size="lg" /></div>

          {product.demo && siteConfig.demoMode && (
            <p className="mt-4 flex items-start gap-2 border border-white/10 bg-cement/60 p-3 text-xs text-ash">
              <Info className="mt-px size-4 shrink-0" /> {t("pdp.demo")}
            </p>
          )}
          {product.priceToConfirm && (
            <p className="mt-4 flex items-start gap-2 border border-white/10 bg-cement/60 p-3 text-xs text-ash">
              <Info className="mt-px size-4 shrink-0" /> {t("pdp.refPrice")}
            </p>
          )}

          <p className="mt-5 leading-relaxed text-white/75 sm:mt-6">{pDesc(product)}</p>

          <div ref={optionsRef} className="scroll-mt-28">
            {/* Color */}
            <div className="mt-7 sm:mt-8">
              <p className="mb-3 flex justify-between text-xs">
                <span className="font-mono tracking-[0.25em] text-ash">{t("pdp.color")}</span>
                <span className="text-bone">{color ? colorName(color) : t("pdp.select")}</span>
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("pdp.color")}>
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    role="radio"
                    aria-checked={color === c.name}
                    onClick={() => pickColor(c.name)}
                    className={cn("flex h-11 items-center gap-2 border px-3 text-xs transition", color === c.name ? "border-bone bg-white/5" : "border-white/15 hover:border-white/50")}
                  >
                    <span className="size-4 rounded-full ring-1 ring-white/30" style={{ background: c.hex }} />
                    {colorName(c.name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-6">
              <p className="mb-3 flex justify-between text-xs">
                <span className="font-mono tracking-[0.25em] text-ash">{t("pdp.size")}</span>
                {size && maxQty <= 3 && maxQty > 0 ? <span className="text-acid">{t("pdp.last", { n: maxQty })}</span> : <span className="text-bone">{size ? sizeName(size) : t("pdp.select")}</span>}
              </p>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-6" role="radiogroup" aria-label={t("pdp.size")}>
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    role="radio"
                    aria-checked={size === s.label}
                    disabled={s.stock === 0}
                    onClick={() => {
                      setSize(s.label);
                      setQty(1);
                      setError(null);
                    }}
                    className={cn(
                      "h-12 border font-mono text-sm transition active:scale-95",
                      singleSize && "col-span-3",
                      size === s.label ? "border-acid bg-acid text-ink" : "border-white/15 hover:border-white/50",
                      "disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/20 disabled:line-through",
                    )}
                    aria-label={t(s.stock === 0 ? "a11y.sizeSoldOut" : "a11y.size", { s: sizeName(s.label) })}
                  >
                    {sizeName(s.label)}
                  </button>
                ))}
              </div>
              {!singleSize && <p className="mt-2 text-[11px] text-ash">{t("pdp.sizeHelp")}</p>}
            </div>

            {/* Qty */}
            {buyable && (
              <div className="mt-6 flex items-center gap-4">
                <span className="font-mono text-xs tracking-[0.25em] text-ash">{t("pdp.qty")}</span>
                <div className="flex h-11 items-center border border-white/15">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t("a11y.minus")} className="grid h-full w-11 place-items-center hover:bg-white/5"><Minus className="size-4" /></button>
                  <span className="w-10 text-center font-mono" aria-live="polite">{qty}</span>
                  <button onClick={() => setQty((q) => (size ? Math.min(maxQty, q + 1) : q + 1))} disabled={!!size && qty >= maxQty} aria-label={t("a11y.plus")} className="grid h-full w-11 place-items-center hover:bg-white/5 disabled:opacity-30"><Plus className="size-4" /></button>
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="mt-4 flex items-center gap-2 text-sm text-danger">
                  <AlertCircle className="size-4" /> {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* CTAs */}
          <div ref={ctaRef}>
            {product.demo ? (
              <div className="mt-6">
                <button disabled className="h-14 w-full bg-steel text-xs font-bold tracking-[0.25em] text-ash">{t("pdp.demoBtn")}</button>
                <p className="mt-2 text-center text-xs text-ash">{t("pdp.demoSub")}</p>
              </div>
            ) : sold ? (
              <div className="mt-6 space-y-2">
                <button disabled className="h-14 w-full bg-steel text-xs font-bold tracking-[0.25em] text-ash">{t("pdp.sold")}</button>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="flex h-14 w-full items-center justify-center gap-2 border border-white/20 text-xs font-bold tracking-[0.2em] hover:border-bone"><WhatsAppIcon className="size-4" /> {t("wa.notify")}</a>}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button onClick={() => handleAdd(false)} className="group relative h-14 overflow-hidden border border-bone text-[11px] font-bold tracking-[0.2em] transition hover:text-ink active:scale-[0.98] sm:text-xs sm:tracking-[0.25em]">
                  <span className="absolute inset-0 translate-y-full bg-bone transition-transform duration-300 ease-out-expo group-hover:translate-y-0" />
                  <span className="relative">{t("pdp.add")}</span>
                </button>
                <button onClick={() => handleAdd(true)} className="h-14 bg-acid text-[11px] font-bold tracking-[0.2em] text-ink transition hover:brightness-110 active:scale-[0.98] sm:text-xs sm:tracking-[0.25em]">
                  {t("pdp.buy")}
                </button>
              </div>
            )}
          </div>
          {wa && buyable && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 py-2 text-xs text-ash transition hover:text-bone">
              <WhatsAppIcon className="size-4 text-[#25D366]" /> {t("wa.ask")}
            </a>
          )}

          {/* Accordions */}
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            <Accordion id="details" open={open} setOpen={setOpen} title={t("pdp.details")}>
              <ul className="list-inside list-disc space-y-1 marker:text-acid">
                {pDetails(product).map((d) => <li key={d}>{d}</li>)}
              </ul>
            </Accordion>
            <Accordion id="ship" open={open} setOpen={setOpen} title={t("pdp.shipping")} icon={<Truck className="size-4" />}>
              {t("pdp.shipText", { eta: siteConfig.shipping.eta, free: formatCOP(siteConfig.shipping.freeFrom), flat: formatCOP(siteConfig.shipping.flatRate) })}
            </Accordion>
            <Accordion id="returns" open={open} setOpen={setOpen} title={t("pdp.returns")} icon={<RefreshCcw className="size-4" />}>
              {t("pdp.returnsText", { days: siteConfig.returnsDays })}{" "}
              <Link href="/info/cambios" className="underline hover:text-bone">{t("pdp.policy")}</Link>.
            </Accordion>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <AnimatePresence>
        {buyable && !ctaVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-ink/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden bg-cement">
                <Image src={product.images[imgIdx]} alt="" fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold uppercase">{name}</p>
                <p className="font-mono text-xs text-ash">
                  {formatCOP(product.price)}
                  {size && color ? ` · ${sizeName(size)}` : ""}
                </p>
              </div>
              <button onClick={() => handleAdd(false)} className="h-12 shrink-0 bg-acid px-5 text-[11px] font-bold tracking-[0.2em] text-ink active:scale-95">
                {size && color ? t("pdp.addShort") : t("pdp.chooseOptions")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({ id, open, setOpen, title, icon, children }: { id: string; open: string | null; setOpen: (v: string | null) => void; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const isOpen = open === id;
  return (
    <div>
      <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`acc-${id}`} className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-wide">
        <span className="flex items-center gap-2">{icon}{title}</span>
        <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div id={`acc-${id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pb-5 text-sm leading-relaxed text-ash">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
