"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Truck, RefreshCcw, ChevronDown, AlertCircle, Info } from "lucide-react";
import { getCategory, isSoldOut, stockFor, type Product } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useToast } from "@/store/toast";
import { siteConfig } from "@/lib/config";
import { cn, formatCOP } from "@/lib/format";
import { waLink, waMessages } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ProductBadges, Price } from "./Badges";

export function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const toast = useToast((s) => s.push);

  const singleColor = product.colors.length === 1;
  const singleSize = product.sizes.length === 1;
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState<string | null>(singleColor ? product.colors[0].name : null);
  const [size, setSize] = useState<string | null>(singleSize && product.sizes[0].stock > 0 ? product.sizes[0].label : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>("details");

  const sold = isSoldOut(product);
  const maxQty = size ? stockFor(product, size) : 0;

  const pickColor = (name: string) => {
    setColor(name);
    setError(null);
    const idx = product.colors.find((c) => c.name === name)?.image;
    if (idx !== undefined) setImgIdx(idx);
  };

  const validate = (): boolean => {
    if (!color && !size) return setError("Selecciona color y talla."), false;
    if (!color) return setError("Selecciona un color."), false;
    if (!size) return setError("Selecciona una talla."), false;
    return true;
  };

  const handleAdd = (buyNow = false) => {
    if (!validate()) return;
    const r = add(product.id, size!, color!, qty);
    if (!r.ok) {
      setError(r.message ?? "No se pudo añadir.");
      return;
    }
    if (buyNow) {
      router.push("/checkout");
      return;
    }
    toast({ title: "Añadido a tu bolsa", description: `${product.name} · ${size} · ${color} × ${qty}` });
    openCart();
  };

  const wa = waLink(waMessages.product(product, size ?? undefined, color ?? undefined));

  return (
    <div className="mx-auto grid max-w-[1600px] gap-8 px-4 pb-20 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
      {/* Gallery */}
      <div className="lg:col-span-7">
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          {product.images.length > 1 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto md:w-20 md:flex-col md:overflow-visible" role="tablist" aria-label="Imágenes del producto">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  role="tab"
                  aria-selected={imgIdx === i}
                  aria-label={`Ver imagen ${i + 1}`}
                  onClick={() => setImgIdx(i)}
                  className={cn("relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-cement ring-1 transition", imgIdx === i ? "ring-bone" : "opacity-50 ring-transparent hover:opacity-100")}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-cement">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={imgIdx} className="absolute inset-0" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <Image src={product.images[imgIdx]} alt={`${product.name} — imagen ${imgIdx + 1}`} fill priority sizes="(max-width:1024px) 100vw, 55vw" className={cn("object-cover", sold && "grayscale")} />
              </motion.div>
            </AnimatePresence>
            <ProductBadges product={product} className="absolute left-3 top-3" />
            {product.images.length > 1 && (
              <p className="absolute bottom-3 right-3 bg-ink/70 px-2 py-1 font-mono text-[10px] tracking-[0.2em] backdrop-blur">
                {String(imgIdx + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{getCategory(product.category)?.label.toUpperCase()}</p>
          <h1 className="mt-2 font-display text-[clamp(40px,6vw,72px)] uppercase leading-[0.88] tracking-tight">{product.name}</h1>
          <div className="mt-4"><Price product={product} size="lg" /></div>

          {product.demo && siteConfig.demoMode && (
            <p className="mt-4 flex items-start gap-2 border border-white/10 bg-cement/60 p-3 text-xs text-ash">
              <Info className="mt-px size-4 shrink-0" /> Producto de demostración: foto, precio y stock son de ejemplo, no es inventario real.
            </p>
          )}
          {product.priceToConfirm && (
            <p className="mt-4 flex items-start gap-2 border border-white/10 bg-cement/60 p-3 text-xs text-ash">
              <Info className="mt-px size-4 shrink-0" /> Precio referencial. Te confirmamos precio final y disponibilidad por WhatsApp antes de cobrar.
            </p>
          )}

          <p className="mt-6 leading-relaxed text-white/75">{product.description}</p>

          {/* Color */}
          <div className="mt-8">
            <p className="mb-3 flex justify-between text-xs">
              <span className="font-mono tracking-[0.25em] text-ash">COLOR</span>
              <span className="text-bone">{color ?? "Selecciona"}</span>
            </p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  role="radio"
                  aria-checked={color === c.name}
                  onClick={() => pickColor(c.name)}
                  className={cn("flex h-11 items-center gap-2 border px-3 text-xs transition", color === c.name ? "border-bone" : "border-white/15 hover:border-white/50")}
                >
                  <span className="size-4 rounded-full ring-1 ring-white/30" style={{ background: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <p className="mb-3 flex justify-between text-xs">
              <span className="font-mono tracking-[0.25em] text-ash">TALLA</span>
              {size && maxQty <= 3 && maxQty > 0 ? <span className="text-acid">¡Últimas {maxQty} unidades!</span> : <span className="text-bone">{size ?? "Selecciona"}</span>}
            </p>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Talla">
              {product.sizes.map((s) => (
                <button
                  key={s.label}
                  role="radio"
                  aria-checked={size === s.label}
                  disabled={s.stock === 0}
                  onClick={() => {
                    setSize(s.label);
                    setQty(1);
                    setError(null);
                  }}
                  className={cn(
                    "h-12 border font-mono text-sm transition",
                    singleSize && "col-span-3",
                    size === s.label ? "border-acid bg-acid text-ink" : "border-white/15 hover:border-white/50",
                    "disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/20 disabled:line-through",
                  )}
                  aria-label={`Talla ${s.label}${s.stock === 0 ? ", agotada" : ""}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {!singleSize && (
              <p className="mt-2 text-[11px] text-ash">¿Dudas con tu talla? Te asesoramos por WhatsApp.</p>
            )}
          </div>

          {/* Qty */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-mono text-xs tracking-[0.25em] text-ash">CANTIDAD</span>
            <div className="flex h-11 items-center border border-white/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar" className="grid h-full w-11 place-items-center hover:bg-white/5"><Minus className="size-4" /></button>
              <span className="w-10 text-center font-mono" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => (size ? Math.min(maxQty, q + 1) : q + 1))} disabled={!!size && qty >= maxQty} aria-label="Sumar" className="grid h-full w-11 place-items-center hover:bg-white/5 disabled:opacity-30"><Plus className="size-4" /></button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="mt-4 flex items-center gap-2 text-sm text-danger">
                <AlertCircle className="size-4" /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* CTAs */}
          {sold ? (
            <div className="mt-6 space-y-2">
              <button disabled className="h-14 w-full bg-steel text-xs font-bold tracking-[0.25em] text-ash">AGOTADO</button>
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="flex h-14 w-full items-center justify-center gap-2 border border-white/20 text-xs font-bold tracking-[0.2em] hover:border-bone"><WhatsAppIcon className="size-4" /> AVÍSENME CUANDO LLEGUE</a>}
            </div>
          ) : (
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button onClick={() => handleAdd(false)} className="group relative h-14 overflow-hidden border border-bone text-xs font-bold tracking-[0.25em] transition hover:text-ink active:scale-[0.99]">
                <span className="absolute inset-0 translate-y-full bg-bone transition-transform duration-300 ease-out-expo group-hover:translate-y-0" />
                <span className="relative">AÑADIR AL CARRITO</span>
              </button>
              <button onClick={() => handleAdd(true)} className="h-14 bg-acid text-xs font-bold tracking-[0.25em] text-ink transition hover:brightness-110 active:scale-[0.99]">
                COMPRAR AHORA
              </button>
            </div>
          )}
          {wa && !sold && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 py-2 text-xs text-ash transition hover:text-bone">
              <WhatsAppIcon className="size-4 text-[#25D366]" /> Preguntar por este producto en WhatsApp
            </a>
          )}

          {/* Accordions */}
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            <Accordion id="details" open={open} setOpen={setOpen} title="Detalles">
              <ul className="list-inside list-disc space-y-1 marker:text-acid">
                {product.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </Accordion>
            <Accordion id="ship" open={open} setOpen={setOpen} title="Envío" icon={<Truck className="size-4" />}>
              Envíos a toda Colombia en {siteConfig.shipping.eta} tras confirmar el pago. Envío gratis desde {formatCOP(siteConfig.shipping.freeFrom)}; si no,
              tarifa fija de {formatCOP(siteConfig.shipping.flatRate)}. Recibirás la guía de seguimiento por WhatsApp.
            </Accordion>
            <Accordion id="returns" open={open} setOpen={setOpen} title="Cambios y devoluciones" icon={<RefreshCcw className="size-4" />}>
              Tienes {siteConfig.returnsDays} días desde que recibes para solicitar cambio de talla o referencia. La prenda debe estar sin uso, con etiquetas y en su empaque.
              Perfumería y joyería solo aplica por defecto de fábrica. <Link href="/info/cambios" className="underline hover:text-bone">Ver política completa</Link>.
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ id, open, setOpen, title, icon, children }: { id: string; open: string | null; setOpen: (v: string | null) => void; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const isOpen = open === id;
  return (
    <div>
      <button onClick={() => setOpen(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={`acc-${id}`} className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-wide">
        <span className="flex items-center gap-2">{icon}{title}</span>
        <ChevronDown className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div id={`acc-${id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pb-5 text-sm leading-relaxed text-ash">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
