"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { isSoldOut, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { useI18n } from "@/lib/i18n";
import { ProductBadges, Price } from "./Badges";
import { cn } from "@/lib/format";

export function ProductCard({ product, priority = false, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const { t, pName, color: colorName, size: sizeName, cat } = useI18n();
  const [picking, setPicking] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toast = useToast((s) => s.push);
  const sold = isSoldOut(product);
  const hasHover = product.images.length > 1;
  const color = product.colors[0];
  const name = pName(product);

  const quickAdd = (size: string) => {
    const r = add(product.id, size, color.name, 1);
    if (r.ok) {
      // The cart drawer opening is the confirmation (a toast would cover its checkout button).
      setPicking(false);
      openCart();
    } else toast({ title: t("toast.failed"), description: t(`cartMsg.${r.code}`, { n: r.n ?? 0, size: r.size ?? "" }), tone: "error" });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cement">
        <Link href={`/product/${product.slug}`} aria-label={name} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-[transform,opacity] duration-[900ms] ease-out-expo lg:group-hover:scale-[1.04]",
              hasHover && "lg:group-hover:opacity-0",
              sold && "grayscale",
            )}
          />
          {hasHover && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 1024px) 33vw, 25vw"
              className="hidden scale-[1.06] object-cover opacity-0 transition-[transform,opacity] duration-[900ms] ease-out-expo group-hover:scale-100 group-hover:opacity-100 lg:block"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" aria-hidden />
        </Link>

        <ProductBadges product={product} className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5" />

        {!sold && !product.demo && (
          <>
            <button
              onClick={() => setPicking(true)}
              aria-label={t("a11y.quickAdd", { name })}
              className={cn(
                "absolute bottom-2 right-2 grid size-9 place-items-center bg-bone text-ink shadow-lg transition-all duration-300 hover:bg-acid active:scale-90 sm:bottom-2.5 sm:right-2.5 sm:size-10",
                "lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
                picking && "pointer-events-none opacity-0",
              )}
            >
              <Plus className="size-5" />
            </button>
            <AnimatePresence>
              {picking && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 bg-ink/95 p-2.5 backdrop-blur sm:p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="font-mono text-[9px] tracking-[0.15em] text-ash sm:text-[10px] sm:tracking-[0.2em]">{t("card.quick")}</p>
                    <button onClick={() => setPicking(false)} aria-label={t("a11y.closeSizes")} className="-m-1.5 p-1.5 text-ash hover:text-bone">
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s.label}
                        disabled={s.stock === 0}
                        onClick={() => quickAdd(s.label)}
                        className="h-9 min-w-9 flex-1 border border-white/20 px-1.5 font-mono text-xs transition hover:border-acid hover:bg-acid hover:text-ink active:bg-acid active:text-ink disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/20 disabled:line-through"
                        aria-label={t(s.stock === 0 ? "a11y.sizeSoldOut" : "a11y.size", { s: sizeName(s.label) })}
                      >
                        {sizeName(s.label)}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2 sm:mt-3 sm:gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[9px] tracking-[0.2em] text-ash sm:text-[10px]">{cat(product.category).toUpperCase()}</p>
          <h3 className="mt-0.5 line-clamp-2 text-[12.5px] font-semibold uppercase leading-snug tracking-wide sm:text-sm">
            <Link href={`/product/${product.slug}`} className="hover:text-acid">{name}</Link>
          </h3>
          <div className="mt-1"><Price product={product} /></div>
        </div>
        {product.colors.length > 1 && (
          <div className="mt-1 flex shrink-0 gap-1" aria-label={t("a11y.colors", { n: product.colors.length })}>
            {product.colors.map((c) => (
              <span key={c.name} title={colorName(c.name)} className="size-2.5 rounded-full ring-1 ring-white/40 sm:size-3" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
