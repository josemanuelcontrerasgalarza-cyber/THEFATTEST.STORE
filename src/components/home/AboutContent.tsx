"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/home/Marquee";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

export function AboutContent() {
  const { t } = useI18n();
  const pillars = [1, 2, 3].map((n) => ({ n: `0${n}`, k: t(`about.k${n}`), d: t(`about.d${n}`) }));
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-10">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{t("about.eyebrow", { year: siteConfig.established })}</p>
          <h1 className="mt-4 font-display text-[clamp(60px,14vw,220px)] uppercase leading-[0.82] tracking-tight">
            {t("about.t1")} <br /><span className="text-outline">{t("about.t2")}</span>
          </h1>
          <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-2 lg:gap-10">
            <Reveal>
              <p className="text-2xl leading-snug sm:text-3xl">{t("about.lead")}</p>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="grid h-[52vh] grid-cols-3 gap-1 sm:h-[80vh]">
        {["1523398002811-999ca8dec234", "1614495039153-e9cd13240469", "1578681994506-b8f463449011"].map((id, i) => (
          <div key={id} className={`relative overflow-hidden ${i === 1 ? "translate-y-6 sm:translate-y-8" : ""}`}>
            <Image src={`https://images.unsplash.com/photo-${id}?fit=crop`} alt={t("about.alt")} fill sizes="33vw" className="object-cover grayscale contrast-125" />
          </div>
        ))}
      </div>

      <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 sm:py-24 lg:px-10">
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08} className="bg-ink p-6 sm:p-8">
              <p className="font-mono text-xs text-acid">{p.n}</p>
              <h2 className="mt-5 font-display text-4xl uppercase sm:mt-6 sm:text-5xl">{p.k}</h2>
              <p className="mt-3 leading-relaxed text-white/70 sm:mt-4">{p.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 sm:mt-16 sm:flex-row">
          <Link href="/shop" className="bg-bone px-8 py-4 text-center text-xs font-bold tracking-[0.25em] text-ink hover:bg-acid">{t("about.cta")}</Link>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="border border-white/30 px-8 py-4 text-center text-xs font-bold tracking-[0.25em] hover:border-bone">
            {siteConfig.instagramHandle.toUpperCase()}
          </a>
        </div>
      </section>
      <Marquee inverted listKey="marquee.c" />
    </>
  );
}
