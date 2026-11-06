"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, products } from "@/lib/products";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/format";

/** Editorial bento of categories. First two tiles are large. */
export function CategoryGrid() {
  const { t, cat } = useI18n();
  const order = ["camisetas", "sneakers", "buzos", "conjuntos"];
  const cats = order.map((s) => categories.find((c) => c.slug === s)!);
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 sm:py-28 lg:px-10" aria-labelledby="cats">
      <SectionHeading eyebrow={t("cats.eyebrow")} title={<span id="cats">{t("cats.t1")} <span className="text-outline">{t("cats.t2")}</span></span>} />
      <div className="mt-9 grid grid-cols-2 gap-2 sm:mt-12 sm:gap-3 lg:grid-cols-4">
        {cats.map((c, i) => {
          const n = products.filter((p) => p.category === c.slug).length;
          const big = i < 2;
          return (
            <Reveal
              key={c.slug}
              delay={(i % 4) * 0.05}
              className={cn(
                big ? "col-span-2 aspect-[5/4] sm:aspect-[16/11] lg:aspect-[4/3]" : "aspect-[4/5] lg:col-span-2 lg:aspect-[4/3]",
                "relative",
              )}
            >
              <Link href={`/shop?cat=${c.slug}`} className="group absolute inset-0 overflow-hidden bg-cement">
                <Image src={c.image} alt={cat(c.slug)} fill sizes={big ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"} className="object-cover opacity-80 transition duration-[1.2s] ease-out-expo group-hover:scale-105 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-6">
                  <div className="min-w-0">
                    <p className={cn("font-mono text-[9px] tracking-[0.2em] text-white/60 sm:text-[10px] sm:tracking-[0.25em]", !big && "hidden sm:block")}>
                      {String(i + 1).padStart(2, "0")} — {t("cats.pieces", { n })}
                    </p>
                    <h3 className={cn("font-display uppercase leading-[0.9]", big ? "text-5xl sm:text-7xl" : "text-[26px] sm:text-4xl")}>{cat(c.slug)}</h3>
                    {!big && <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-white/60 sm:hidden">{t("cats.pieces", { n })}</p>}
                  </div>
                  <span className={cn("grid shrink-0 place-items-center border border-white/30 transition group-hover:border-acid group-hover:bg-acid group-hover:text-ink", big ? "size-10" : "hidden size-10 sm:grid")}>
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
