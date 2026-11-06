"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X, Tag, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { computeCart } from "@/lib/cart-math";
import { formatCOP } from "@/lib/format";
import { siteConfig } from "@/lib/config";
import { validateCoupon } from "@/lib/coupons";
import { useMounted } from "@/lib/use-mounted";

export function CartDrawer() {
  const { items, coupon, isOpen, close, remove, setQty, setSize, clear, setCoupon } = useCart();
  const mounted = useMounted();
  const router = useRouter();
  const t = computeCart(items, coupon);
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    const r = await validateCoupon(code, t.subtotal);
    setChecking(false);
    if (r.ok) {
      setCoupon(r.coupon);
      setCode("");
      setCouponMsg(null);
    } else setCouponMsg(r.error);
  };

  const goCheckout = () => {
    close();
    router.push("/checkout");
  };

  if (!mounted) return null;
  const shipPct = Math.min(100, ((siteConfig.shipping.freeFrom - t.freeShippingRemaining) / siteConfig.shipping.freeFrom) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-[440px] flex-col border-l border-white/10 bg-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-3xl leading-none">
                TU BOLSA <span className="align-top font-mono text-sm text-ash">({t.count})</span>
              </h2>
              <button onClick={close} aria-label="Cerrar carrito" className="-mr-2 grid size-11 place-items-center text-ash hover:text-bone">
                <X className="size-6" />
              </button>
            </header>

            {t.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-5xl leading-none text-white/15">VACÍA.</p>
                <p className="text-sm text-ash">Tu bolsa está esperando algo que valga la pena.</p>
                <Link href="/shop" onClick={close} className="mt-2 bg-bone px-6 py-3 text-xs font-bold tracking-[0.2em] text-ink transition hover:bg-acid">
                  IR A LA TIENDA
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-white/10 px-5 py-3">
                  <p className="flex items-center gap-2 text-xs text-ash">
                    <Truck className="size-4" />
                    {t.freeShippingRemaining > 0 ? (
                      <>Te faltan <span className="text-bone">{formatCOP(t.freeShippingRemaining)}</span> para envío gratis</>
                    ) : (
                      <span className="text-acid">¡Tienes envío gratis!</span>
                    )}
                  </p>
                  <div className="mt-2 h-0.5 bg-white/10">
                    <motion.div className="h-full bg-acid" initial={false} animate={{ width: `${shipPct}%` }} transition={{ duration: 0.6 }} />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {t.lines.map((l) => (
                      <motion.li key={l.key} layout exit={{ opacity: 0, x: 40 }} className="flex gap-4 py-4">
                        <Link href={`/product/${l.product.slug}`} onClick={close} className="relative h-28 w-22 shrink-0 overflow-hidden bg-cement">
                          <Image src={l.product.images[l.product.colors.find((c) => c.name === l.color)?.image ?? 0]} alt={l.product.name} fill sizes="88px" className="object-cover" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/product/${l.product.slug}`} onClick={close} className="text-sm font-semibold uppercase leading-tight tracking-wide hover:text-acid">
                              {l.product.name}
                            </Link>
                            <button onClick={() => remove(l.key)} aria-label={`Eliminar ${l.product.name}`} className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center text-ash hover:text-danger">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-ash">{l.color}</p>
                          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                            <div className="flex items-center gap-2">
                              {l.product.sizes.length > 1 ? (
                                <label className="sr-only" htmlFor={`size-${l.key}`}>Talla</label>
                              ) : null}
                              {l.product.sizes.length > 1 ? (
                                <select
                                  id={`size-${l.key}`}
                                  value={l.size}
                                  onChange={(e) => setSize(l.key, e.target.value)}
                                  className="h-8 border border-white/15 bg-ink px-2 font-mono text-xs focus:border-bone focus:outline-none"
                                >
                                  {l.product.sizes.map((s) => (
                                    <option key={s.label} value={s.label} disabled={s.stock === 0}>
                                      {s.label}{s.stock === 0 ? " (agotada)" : ""}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="font-mono text-xs text-ash">{l.size}</span>
                              )}
                              <div className="flex h-8 items-center border border-white/15">
                                <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Restar uno" className="grid h-full w-8 place-items-center hover:bg-white/5">
                                  <Minus className="size-3" />
                                </button>
                                <span className="w-6 text-center font-mono text-xs" aria-live="polite">{l.qty}</span>
                                <button
                                  onClick={() => setQty(l.key, l.qty + 1)}
                                  aria-label="Sumar uno"
                                  disabled={l.qty >= (l.product.sizes.find((s) => s.label === l.size)?.stock ?? 0)}
                                  className="grid h-full w-8 place-items-center hover:bg-white/5 disabled:opacity-30"
                                >
                                  <Plus className="size-3" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              {l.lineSavings > 0 && <p className="font-mono text-[11px] text-ash line-through">{formatCOP(l.lineTotal + l.lineSavings, false)}</p>}
                              <p className="font-mono text-sm">{formatCOP(l.lineTotal, false)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-white/10 px-5 pb-5 pt-4">
                  {coupon ? (
                    <div className="mb-3 flex items-center justify-between bg-acid/10 px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 text-acid"><Tag className="size-3.5" /> {coupon.code} — {coupon.description}</span>
                      <button onClick={() => setCoupon(null)} className="text-ash underline hover:text-bone">Quitar</button>
                    </div>
                  ) : (
                    <form onSubmit={applyCoupon} className="mb-3">
                      <div className="flex">
                        <input
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="CÓDIGO DE DESCUENTO"
                          aria-label="Código de descuento"
                          className="h-10 min-w-0 flex-1 border border-white/15 bg-transparent px-3 font-mono text-xs uppercase placeholder:text-white/30 focus:border-bone focus:outline-none"
                        />
                        <button disabled={checking || !code.trim()} className="h-10 border border-l-0 border-white/15 px-4 text-xs font-bold tracking-[0.15em] transition hover:bg-bone hover:text-ink disabled:opacity-40">
                          {checking ? "…" : "APLICAR"}
                        </button>
                      </div>
                      {couponMsg && <p className="mt-1.5 text-xs text-danger">{couponMsg}</p>}
                    </form>
                  )}

                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-ash"><dt>Subtotal</dt><dd className="font-mono">{formatCOP(t.subtotal)}</dd></div>
                    {t.saleSavings > 0 && <div className="flex justify-between text-ash"><dt>Ahorro en ofertas <span className="text-[10px]">(ya incluido)</span></dt><dd className="font-mono text-acid">{formatCOP(t.saleSavings)}</dd></div>}
                    {t.couponDiscount > 0 && <div className="flex justify-between text-ash"><dt>Cupón</dt><dd className="font-mono text-acid">−{formatCOP(t.couponDiscount)}</dd></div>}
                    <div className="flex justify-between text-ash"><dt>Envío</dt><dd className="font-mono">{t.shipping === 0 ? "GRATIS" : formatCOP(t.shipping)}</dd></div>
                    <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold"><dt>Total</dt><dd className="font-mono">{formatCOP(t.total)}</dd></div>
                  </dl>

                  <button onClick={goCheckout} className="group mt-4 flex h-14 w-full items-center justify-center gap-2 bg-acid text-sm font-bold tracking-[0.2em] text-ink transition hover:brightness-110 active:scale-[0.99]">
                    FINALIZAR PEDIDO
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <button onClick={close} className="text-ash underline-offset-4 hover:text-bone hover:underline">Seguir comprando</button>
                    {confirmClear ? (
                      <span className="flex gap-3">
                        <button onClick={() => { clear(); setConfirmClear(false); }} className="text-danger">Sí, vaciar</button>
                        <button onClick={() => setConfirmClear(false)} className="text-ash">Cancelar</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmClear(true)} className="text-ash underline-offset-4 hover:text-bone hover:underline">Vaciar carrito</button>
                    )}
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
