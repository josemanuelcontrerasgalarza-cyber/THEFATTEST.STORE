"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getProduct } from "@/lib/products";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

/** Real photos posted by @thefattest.store. */
const feed = [
  { src: "/products/amiri-front.jpg", slug: "amiri-rhinestone-tee" },
  { src: "/products/hellstar-heaven-black.jpg", slug: "hellstar-heaven-tee" },
  { src: "/products/kenzo-tiger.jpg", slug: "saco-kenzo-tiger" },
  { src: "/products/hugo-leopard-black.jpg", slug: "hugo-leopard-tee" },
  { src: "/products/mixed-front.jpg", slug: "mixed-emotion-astronaut-tee" },
  { src: "/products/lacoste-set.jpg", slug: "conjunto-lacoste" },
];

/** DEMO reviews — clearly labelled. Replace with real, verifiable reviews before launch. */
const demoReviews = [
  { initials: "A.R.", key: "social.r1", cat: "camisetas" },
  { initials: "J.M.", key: "social.r2", cat: "conjuntos" },
  { initials: "S.P.", key: "social.r3", cat: "buzos" },
];

export function SocialProof() {
  const { t, pName, cat } = useI18n();
  return (
    <section className="border-t border-white/10 py-16 sm:py-28" aria-labelledby="community">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow={t("social.eyebrow")} title={<span id="community">{t("social.t1")} <span className="text-outline">{t("social.t2")}</span></span>}>
          <div className="flex flex-wrap gap-3">
            <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-xs font-bold tracking-[0.2em] transition hover:border-acid hover:text-acid">
              <InstagramIcon className="size-4" /> {siteConfig.instagramHandle.toUpperCase()}
            </a>
            {siteConfig.tiktokUrl && (
              <a href={siteConfig.tiktokUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-xs font-bold tracking-[0.2em] transition hover:border-acid hover:text-acid">
                <TikTokIcon className="size-4" /> TIKTOK
              </a>
            )}
          </div>
        </SectionHeading>
      </div>

      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 sm:mt-12 sm:px-6 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-10">
        {feed.map((f, i) => {
          const p = getProduct(f.slug);
          const alt = p ? pName(p) : "THEFATTEST";
          return (
            <Reveal key={f.src} delay={i * 0.05} className="w-[58vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto">
              <Link href={`/product/${f.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-cement">
                <Image src={f.src} alt={alt} fill sizes="(max-width:1024px) 58vw, 16vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-ink/60 opacity-0 transition group-hover:opacity-100">
                  <span className="font-mono text-[10px] tracking-[0.25em]">{t("social.view")}</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mx-auto mt-14 max-w-[1600px] px-4 sm:mt-16 sm:px-6 lg:px-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{t("social.says")}</p>
          <span className="border border-white/15 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-ash">{t("social.demo")}</span>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {demoReviews.map((r, i) => (
            <Reveal key={r.initials} delay={i * 0.08} className="w-[82vw] shrink-0 snap-start md:w-auto">
              <figure className="flex h-full flex-col justify-between border border-white/10 bg-cement/60 p-5 sm:p-6">
                <div>
                  <div className="flex gap-0.5 text-acid" aria-label={t("social.stars")}>
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3.5 fill-current" />)}
                  </div>
                  <blockquote className="mt-4 text-base leading-snug sm:text-lg">“{t(r.key)}”</blockquote>
                </div>
                <figcaption className="mt-6 flex items-center justify-between font-mono text-[11px] tracking-[0.15em] text-ash">
                  <span>{r.initials} — {t("social.example")}</span>
                  <span>{cat(r.cat).toUpperCase()}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-ash">{t("social.tag", { handle: siteConfig.instagramHandle })}</p>
      </div>
    </section>
  );
}
