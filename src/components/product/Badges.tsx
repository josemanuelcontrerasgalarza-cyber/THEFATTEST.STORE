import { discountPct, isOnSale, isSoldOut, type Product } from "@/lib/products";
import { siteConfig } from "@/lib/config";

export function ProductBadges({ product, className = "" }: { product: Product; className?: string }) {
  const sold = isSoldOut(product);
  return (
    <div className={`pointer-events-none flex flex-col items-start gap-1 ${className}`}>
      {sold && <span className="bg-bone px-2 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-ink">AGOTADO</span>}
      {!sold && product.isNew && <span className="bg-ink/90 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-bone ring-1 ring-white/20">NEW</span>}
      {!sold && isOnSale(product) && <span className="bg-acid px-2 py-1 font-mono text-[10px] font-bold tracking-[0.15em] text-ink">SALE −{discountPct(product)}%</span>}
      {product.demo && siteConfig.demoMode && (
        <span className="bg-ink/70 px-2 py-1 font-mono text-[9px] tracking-[0.15em] text-ash ring-1 ring-white/10" title="Producto de demostración: no es inventario real">
          DEMO
        </span>
      )}
    </div>
  );
}

export function Price({ product, size = "sm" }: { product: Product; size?: "sm" | "lg" }) {
  const sale = isOnSale(product);
  const cls = size === "lg" ? "text-2xl" : "text-sm";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-mono ${cls} ${sale ? "text-acid" : ""}`}>
        ${new Intl.NumberFormat("es-CO").format(product.price)} <span className="text-[0.7em] text-ash">COP</span>
      </span>
      {sale && <span className={`font-mono text-ash line-through ${size === "lg" ? "text-base" : "text-xs"}`}>${new Intl.NumberFormat("es-CO").format(product.compareAt!)}</span>}
    </div>
  );
}
