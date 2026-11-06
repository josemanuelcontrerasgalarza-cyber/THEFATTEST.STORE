"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Product } from "@/lib/products";

export function Breadcrumb({ product }: { product: Product }) {
  const { t, pName, cat } = useI18n();
  return (
    <nav aria-label={t("pdp.route")} className="font-mono text-[10px] tracking-[0.15em] text-ash sm:text-[11px]">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li><Link href="/" className="hover:text-bone">{t("pdp.home")}</Link></li>
        <li aria-hidden>/</li>
        <li><Link href="/shop" className="hover:text-bone">{t("nav.shop")}</Link></li>
        <li aria-hidden>/</li>
        <li><Link href={`/shop?cat=${product.category}`} className="hover:text-bone">{cat(product.category).toUpperCase()}</Link></li>
        <li aria-hidden className="hidden sm:inline">/</li>
        <li className="hidden text-bone sm:inline" aria-current="page">{pName(product).toUpperCase()}</li>
      </ol>
    </nav>
  );
}

export function RelatedHeading() {
  const { t } = useI18n();
  return (
    <h2 id="related" className="font-display text-[clamp(40px,7vw,96px)] uppercase leading-[0.85] tracking-tight">
      {t("pdp.related1")} <span className="text-outline">{t("pdp.related2")}</span>
    </h2>
  );
}
