"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { categories, getCategory, products } from "@/lib/products";
import { formatCOP } from "@/lib/format";
import { searchProducts } from "@/lib/search";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => (q.trim() ? searchProducts(products, q).slice(0, 6) : []), [q]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] bg-ink/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar"
        >
          <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 sm:pt-16">
            <div className="flex justify-end">
              <button onClick={onClose} aria-label="Cerrar búsqueda" className="grid size-11 place-items-center text-ash hover:text-bone">
                <X className="size-6" />
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 flex items-center gap-3 border-b border-white/20 pb-3 focus-within:border-bone">
              <Search className="size-6 shrink-0 text-ash" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="BUSCA HELLSTAR, BUZOS, CONJUNTOS…"
                className="w-full bg-transparent font-display text-3xl tracking-tight placeholder:text-white/20 focus:outline-none sm:text-5xl"
                aria-label="Buscar productos"
                enterKeyHint="search"
              />
            </form>

            {!q.trim() && (
              <div className="mt-8">
                <p className="font-mono text-[11px] tracking-[0.25em] text-ash">CATEGORÍAS</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/shop?cat=${c.slug}`} onClick={onClose} className="border border-white/15 px-4 py-2 text-xs font-semibold tracking-[0.15em] transition hover:border-acid hover:text-acid">
                      {c.label.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {q.trim() && (
              <div className="mt-6">
                {results.length === 0 ? (
                  <p className="text-ash">Sin resultados para “{q}”. Prueba con otra palabra o escríbenos por WhatsApp.</p>
                ) : (
                  <ul className="divide-y divide-white/10">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link href={`/product/${p.slug}`} onClick={onClose} className="group flex items-center gap-4 py-3">
                          <div className="relative size-16 shrink-0 overflow-hidden bg-cement">
                            <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold uppercase tracking-wide group-hover:text-acid">{p.name}</p>
                            <p className="text-xs text-ash">{getCategory(p.category)?.label}</p>
                          </div>
                          <p className="font-mono text-sm">{formatCOP(p.price, false)}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {results.length > 0 && (
                  <button onClick={submit} className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-acid">
                    VER TODOS LOS RESULTADOS <ArrowRight className="size-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
