"use client";

import { discountPct, isOnSale, isSoldOut, type Product } from "@/lib/products";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

export function ProductBadges({ product, className = "" }: { product: Product; className?: string }) {
  const { t } = useI18n();
  const sold = isSoldOut(product);
  return (
    <div className={`pointer-events-none flex flex-col items-start gap-1 ${className}`}>
      {sold && <span className="bg-bone px-2 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-ink">{t("badge.sold")}</span>}
      {!sold && product.isNew && <span className="bg-ink/90 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-bone ring-1 ring-white/20">{t("badge.new")}</span>}
      {!sold && isOnSale(product) && <span className="bg-acid px-2 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-ink">{t("badge.sale")} −{discountPct(product)}%</span>}
      {product.demo && siteConfig.demoMode && (
        <span className="bg-ink/70 px-2 py-1 font-mono text-[9px] tracking-[0.15em] text-ash ring-1 ring-white/10" title={t("badge.demoTitle")}>
          DEMO
        </span>
      )}
    </div>
  );
}

const num = new Intl.NumberFormat("es-CO");

export function Price({ product, size = "sm" }: { product: Product; size?: "sm" | "lg" }) {
  const sale = isOnSale(product);
  const cls = size === "lg" ? "text-2xl" : "text-[13px] sm:text-sm";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-mono ${cls} ${sale ? "text-acid" : ""}`}>
        ${num.format(product.price)} <span className="text-[0.7em] text-ash">COP</span>
      </span>
      {sale && <span className={`font-mono text-ash line-through ${size === "lg" ? "text-base" : "text-xs"}`}>${num.format(product.compareAt!)}</span>}
    </div>
  );
}
