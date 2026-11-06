"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const A = "https://images.unsplash.com/photo-1578681994506-b8f463449011?fit=crop";
const B = "https://images.unsplash.com/photo-1614495039153-e9cd13240469?fit=crop";
const C = "https://images.unsplash.com/photo-1527010154944-f2241763d806?fit=crop";

export function BrandStory() {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["25%", "-25%"]);
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-30%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-ink py-20 sm:py-36" aria-labelledby="story">
      <motion.p style={{ x }} className="pointer-events-none absolute top-10 whitespace-nowrap font-display text-[22vw] leading-none text-white/[0.03]" aria-hidden>
        THEFATTEST THEFATTEST
      </motion.p>

      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-10">
        <div className="lg:col-span-6 lg:pt-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{t("story.eyebrow")}</p>
          <h2 id="story" className="mt-4 font-display text-[clamp(56px,10vw,150px)] uppercase leading-[0.82] tracking-tight">
            {t("story.t1")}<br />{t("story.t2")}<br /><span className="text-acid">{t("story.t3")}</span>
          </h2>
          <div className="mt-8 max-w-md space-y-5 text-base sm:mt-10 sm:text-lg leading-relaxed text-white/70">
            <p className="text-2xl leading-snug text-bone">
              {t("story.lead")}
            </p>
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
          </div>
          <Link href="/about" className="mt-10 inline-flex h-12 items-center border border-white/30 px-6 text-xs font-bold tracking-[0.25em] transition hover:border-bone hover:bg-bone hover:text-ink">
            {t("story.cta")}
          </Link>
        </div>

        <div className="relative h-[480px] sm:h-[720px] lg:col-span-6 lg:h-[860px]">
          <motion.div style={{ y: y1 }} className="absolute right-0 top-0 h-[62%] w-[68%] overflow-hidden">
            <Image src={B} alt={t("story.altB")} fill sizes="(max-width:1024px) 70vw, 35vw" className="object-cover grayscale contrast-125" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 h-[52%] w-[54%] overflow-hidden border-8 border-ink">
            <Image src={A} alt={t("story.altA")} fill sizes="(max-width:1024px) 55vw, 28vw" className="object-cover grayscale contrast-125" />
          </motion.div>
          <motion.div style={{ y: y1 }} className="absolute bottom-[8%] right-[4%] hidden h-[26%] w-[30%] overflow-hidden sm:block">
            <Image src={C} alt={t("story.altC")} fill sizes="20vw" className="object-cover grayscale contrast-125" />
          </motion.div>
          <p className="absolute left-0 top-4 font-mono text-[10px] tracking-[0.3em] text-ash [writing-mode:vertical-rl]">{t("story.est")}</p>
        </div>
      </div>
    </section>
  );
}
