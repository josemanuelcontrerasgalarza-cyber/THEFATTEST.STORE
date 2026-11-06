"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { getCategory, isSoldOut, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { ProductBadges, Price } from "./Badges";
import { cn } from "@/lib/format";

export function ProductCard({ product, priority = false, index = 0 }: { product: Product; priority?: boolean; index?: number }) {
  const [picking, setPicking] = useState(false);
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toast = useToast((s) => s.push);
  const sold = isSoldOut(product);
  const hasHover = product.images.length > 1;
  const color = product.colors[0];

  const quickAdd = (size: string) => {
    const r = add(product.id, size, color.name, 1);
    if (r.ok) {
      toast({ title: "Añadido a tu bolsa", description: `${product.name} · Talla ${size} · ${color.name}` });
      setPicking(false);
      openCart();
    } else toast({ title: "No se pudo añadir", description: r.message, tone: "error" });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cement">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-[transform,opacity] duration-[900ms] ease-out-expo group-hover:scale-[1.04]",
              hasHover && "group-hover:opacity-0",
              sold && "grayscale",
            )}
          />
          {hasHover && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="scale-[1.06] object-cover opacity-0 transition-[transform,opacity] duration-[900ms] ease-out-expo group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" aria-hidden />
        </Link>

        <ProductBadges product={product} className="absolute left-2.5 top-2.5" />

        {!sold && (
          <>
            {/* Quick add trigger */}
            <button
              onClick={() => setPicking(true)}
              aria-label={`Añadir rápido ${product.name}`}
              className={cn(
                "absolute bottom-2.5 right-2.5 grid size-10 place-items-center bg-bone text-ink transition-all duration-300 hover:bg-acid",
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
                  className="absolute inset-x-0 bottom-0 bg-ink/95 p-3 backdrop-blur"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-ash">QUICK ADD — ELIGE TALLA</p>
                    <button onClick={() => setPicking(false)} aria-label="Cerrar selector de talla" className="-m-1 p-1 text-ash hover:text-bone">
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s.label}
                        disabled={s.stock === 0}
                        onClick={() => quickAdd(s.label)}
                        className="h-9 min-w-10 border border-white/20 px-2 font-mono text-xs transition hover:border-acid hover:bg-acid hover:text-ink disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/20 disabled:line-through"
                        aria-label={`Talla ${s.label}${s.stock === 0 ? " agotada" : ""}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.2em] text-ash">{getCategory(product.category)?.label.toUpperCase()}</p>
          <h3 className="mt-0.5 truncate text-[13px] font-semibold uppercase tracking-wide sm:text-sm">
            <Link href={`/product/${product.slug}`} className="hover:text-acid">{product.name}</Link>
          </h3>
          <div className="mt-1"><Price product={product} /></div>
        </div>
        {product.colors.length > 1 && (
          <div className="mt-1 flex shrink-0 -space-x-1" aria-label={`${product.colors.length} colores`}>
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} className="size-3 rounded-full ring-1 ring-white/30" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
