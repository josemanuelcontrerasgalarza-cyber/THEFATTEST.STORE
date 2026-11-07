"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getProduct } from "@/lib/products";
import { formatCOP } from "@/lib/format";

/** Hero slideshow: full-color, slow zoom, each product slide links straight to the product. */
const SLIDES: { src: string; slug?: string; pos: string }[] = [
  { src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?fit=crop&crop=faces", pos: "60% 20%" },
  { src: "/products/jordan4-thunder.jpg", slug: "air-jordan-4-thunder", pos: "55% 40%" },
  { src: "/products/af1-red.jpg", slug: "nike-air-force-1", pos: "50% 50%" },
  { src: "/products/kenzo-tiger.jpg", slug: "saco-kenzo-tiger", pos: "50% 45%" },
  { src: "/products/hellstar-heaven-black.jpg", slug: "hellstar-heaven-tee", pos: "50% 45%" },
];
const DURATION = 5000;

const lineV = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: 0, transition: { duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  const { t, pName } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const id = setTimeout(() => setIdx((i) => (i + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(id);
  }, [idx]);

  const slide = SLIDES[idx];
  const product = slide.slug ? getProduct(slide.slug) : undefined;

  return (
    <section ref={ref} className="relative isolate -mt-16 flex min-h-[100svh] items-end overflow-hidden bg-ink pt-16 lg:-mt-[72px] lg:pt-[72px]" aria-label={t("hero.aria")}>
      {/* Slides */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10 lg:left-[34%]">
        <AnimatePresence initial={false}>
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1 }, scale: { duration: DURATION / 1000 + 1.2, ease: "linear" } }}
          >
            <Image
              src={slide.src}
              alt={product ? pName(product) : t("hero.alt")}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover saturate-[1.15] contrast-[1.08]"
              style={{ objectPosition: slide.pos }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/25 lg:bg-gradient-to-r lg:from-ink lg:via-ink/40 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        {/* neon accent */}
        <div className="pointer-events-none absolute -right-24 top-1/4 size-[420px] rounded-full bg-acid/15 blur-[120px]" aria-hidden />
      </motion.div>

      {/* Shoppable product tag */}
      <div className="absolute right-4 top-[calc(4rem+16px)] z-10 sm:right-6 lg:right-10 lg:top-[calc(72px+32px)]">
        <AnimatePresence mode="wait">
          {product && (
            <motion.div key={product.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <Link href={`/product/${product.slug}`} className="group flex items-center gap-3 border border-white/15 bg-ink/70 py-2 pl-3 pr-2 backdrop-blur-md transition hover:border-acid">
                <span className="size-1.5 animate-pulse rounded-full bg-acid" />
                <span className="text-left">
                  <span className="block max-w-[160px] truncate text-[11px] font-semibold uppercase tracking-wide sm:max-w-none">{pName(product)}</span>
                  <span className="block font-mono text-[11px] text-acid">{formatCOP(product.price)}</span>
                </span>
                <span className="grid size-8 place-items-center bg-acid text-ink transition group-hover:rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vertical label */}
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-90 origin-right font-mono text-[10px] tracking-[0.5em] text-white/40 lg:block">
        {t("hero.vertical")}
      </div>

      <motion.div style={{ y: textY, opacity: fade }} className="mx-auto w-full max-w-[1600px] px-4 pb-10 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="mb-5 inline-flex items-center gap-3 border border-white/15 bg-ink/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-white/80 backdrop-blur sm:mb-6">
          <span className="size-1.5 animate-pulse rounded-full bg-acid" /> {t("hero.label")}
        </motion.p>

        <h1 className="font-display text-[clamp(50px,10.5vw,172px)] uppercase leading-[0.86] tracking-[-0.01em] drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          {[t("hero.line1"), t("hero.line2")].map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.04em]">
              <motion.span custom={i} variants={lineV} initial="hidden" animate="show" className={`block ${i === 1 ? "text-acid lg:whitespace-nowrap" : ""}`}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col gap-7 sm:mt-10 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }} className="max-w-sm text-[15px] leading-relaxed text-white/80 sm:text-lg">
              {t("hero.sub")}
            </motion.p>
            {/* slide progress */}
            <div className="mt-5 flex gap-1.5" aria-hidden>
              {SLIDES.map((_, i) => (
                <button key={i} tabIndex={-1} onClick={() => setIdx(i)} className="relative h-[3px] w-8 overflow-hidden bg-white/20 sm:w-10">
                  {i === idx && <motion.span className="absolute inset-y-0 left-0 bg-acid" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: DURATION / 1000, ease: "linear" }} />}
                  {i < idx && <span className="absolute inset-0 bg-white/60" />}
                </button>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.9 }} className="flex flex-col gap-3 sm:flex-row">
            <Link href="#drop" className="group relative inline-flex h-[52px] items-center justify-center gap-3 overflow-hidden bg-acid px-8 text-xs font-bold tracking-[0.25em] text-ink sm:h-14">
              <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
              <span className="relative">{t("hero.cta1")}</span>
              <ArrowDownRight className="relative size-4 transition-transform group-hover:rotate-[-45deg]" />
            </Link>
            <Link href="/shop" className="inline-flex h-[52px] items-center justify-center border border-white/30 px-8 text-xs font-bold tracking-[0.25em] backdrop-blur transition hover:border-bone hover:bg-bone/10 sm:h-14">
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
