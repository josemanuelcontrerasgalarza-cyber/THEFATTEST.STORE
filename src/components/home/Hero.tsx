"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const HERO = "/products/jordan4-thunder.jpg";

const lineV = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: 0, transition: { duration: 1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate -mt-16 flex min-h-[100svh] items-end overflow-hidden bg-ink pt-16 lg:-mt-[72px] lg:pt-[72px]" aria-label={t("hero.aria")}>
      {/* Image */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -z-10 lg:left-[38%]">
        <motion.div initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
          <Image src={HERO} alt={t("hero.alt")} fill priority sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover object-[55%_40%] contrast-[1.05] saturate-[1.1]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30 lg:bg-gradient-to-r lg:from-ink lg:via-ink/50 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,transparent_30%,rgba(8,8,8,0.6)_80%)]" />
      </motion.div>

      {/* Vertical label */}
      <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-90 origin-right font-mono text-[10px] tracking-[0.5em] text-white/40 lg:block">
        {t("hero.vertical")}
      </div>

      <motion.div style={{ y: textY, opacity: fade }} className="mx-auto w-full max-w-[1600px] px-4 pb-10 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }} className="mb-5 inline-flex items-center gap-3 border sm:mb-6 border-white/15 bg-ink/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.3em] text-white/80 backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-acid" /> {t("hero.label")}
        </motion.p>

        <h1 className="font-display text-[clamp(50px,10.5vw,172px)] uppercase leading-[0.86] tracking-[-0.01em]">
          {[t("hero.line1"), t("hero.line2")].map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.04em]">
              <motion.span custom={i} variants={lineV} initial="hidden" animate="show" className={`block ${i === 1 ? "text-outline lg:whitespace-nowrap" : ""}`}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col gap-7 sm:mt-10 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }} className="max-w-sm text-[15px] leading-relaxed text-white/70 sm:text-lg">
            {t("hero.sub")}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.9 }} className="flex flex-col gap-3 sm:flex-row">
            <Link href="#drop" className="group relative inline-flex h-[52px] items-center sm:h-14 justify-center gap-3 overflow-hidden bg-bone px-8 text-xs font-bold tracking-[0.25em] text-ink">
              <span className="absolute inset-0 -translate-x-full bg-acid transition-transform duration-500 ease-out-expo group-hover:translate-x-0" />
              <span className="relative">{t("hero.cta1")}</span>
              <ArrowDownRight className="relative size-4 transition-transform group-hover:rotate-[-45deg]" />
            </Link>
            <Link href="/shop" className="inline-flex h-[52px] items-center justify-center border sm:h-14 border-white/30 px-8 text-xs font-bold tracking-[0.25em] backdrop-blur transition hover:border-bone hover:bg-bone/10">
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
