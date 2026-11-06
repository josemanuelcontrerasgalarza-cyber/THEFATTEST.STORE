"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { latestDrop } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

export function LatestDrop() {
  const { t } = useI18n();
  const items = latestDrop();
  return (
    <section id="drop" className="mx-auto max-w-[1600px] scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28 lg:px-10">
      <SectionHeading
        eyebrow={t("drop.eyebrow")}
        title={
          <>
            {t("drop.t1")} <span className="text-outline">{t("drop.t2")}</span>
          </>
        }
      >
        <Link href="/shop?new=1" className="group inline-flex items-center gap-3 border-b border-white/30 pb-1 text-xs font-bold tracking-[0.25em] transition hover:border-acid hover:text-acid">
          {t("drop.all")} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </SectionHeading>

      <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-12 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-y-14">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} priority={i < 2} />
        ))}
      </div>
    </section>
  );
}
