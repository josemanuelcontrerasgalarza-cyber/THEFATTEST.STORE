"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { categories, products, totalStock, isSoldOut } from "@/lib/products";
import { getLocalOrders, ORDER_STATUSES, updateLocalOrderStatus, type Order, type OrderStatus } from "@/lib/orders";
import { formatCOP, cn } from "@/lib/format";
import { siteConfig } from "@/lib/config";
import { isSupabaseConfigured } from "@/lib/supabase";

const TABS = ["Resumen", "Inventario", "Pedidos", "Cupones", "Configuración"] as const;
type Tab = (typeof TABS)[number];

/**
 * Store back-office (preview).
 * Today it reads the catalog file and the orders stored in THIS browser.
 * Production: protect with Supabase Auth + the `admins` table and read/write
 * through the RLS policies in supabase/migrations (see README → Panel admin).
 */
export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("Resumen");
  const [orders, setOrders] = useState<Order[]>([]);
  const [catFilter, setCatFilter] = useState("all");
  useEffect(() => setOrders(getLocalOrders()), []);

  const stats = useMemo(() => {
    const real = products.filter((p) => !p.demo);
    return {
      products: products.length,
      real: real.length,
      units: real.reduce((n, p) => n + totalStock(p), 0),
      soldOut: products.filter(isSoldOut).length,
      lowStock: products.flatMap((p) => p.sizes.filter((s) => s.stock > 0 && s.stock <= 2).map((s) => ({ p, s }))),
      revenue: orders.filter((o) => o.status !== "cancelado").reduce((n, o) => n + o.total, 0),
      pending: orders.filter((o) => o.status === "pendiente").length,
    };
  }, [orders]);

  const setStatus = (code: string, status: OrderStatus) => {
    updateLocalOrderStatus(code, status);
    setOrders(getLocalOrders());
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ash">BACK-OFFICE</p>
      <h1 className="mt-2 font-display text-[clamp(44px,8vw,96px)] uppercase leading-[0.85] tracking-tight">PANEL ADMIN</h1>
      <p className="mt-4 flex max-w-3xl items-start gap-2 border border-white/10 bg-cement/60 p-3 text-xs text-ash">
        <AlertTriangle className="mt-px size-4 shrink-0 text-acid" />
        Vista previa: muestra el catálogo del código y los pedidos guardados en este navegador. Para gestionar pedidos reales de todos los clientes, conecta Supabase y protege
        esta ruta con inicio de sesión de administrador (ver README).
      </p>

      <div className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-white/10" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("shrink-0 border-b-2 px-4 py-3 text-xs font-bold tracking-[0.15em]", tab === t ? "border-acid text-bone" : "border-transparent text-ash hover:text-bone")}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "Resumen" && (
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {[
              ["Productos en catálogo", `${stats.products}`, `${stats.real} reales · ${stats.products - stats.real} demo`],
              ["Unidades reales en stock", `${stats.units}`, "suma de tallas"],
              ["Pedidos pendientes", `${stats.pending}`, `${orders.length} pedidos en total`],
              ["Valor de pedidos", formatCOP(stats.revenue), "excluye cancelados"],
            ].map(([k, v, s]) => (
              <div key={k} className="bg-ink p-5">
                <p className="text-xs text-ash">{k}</p>
                <p className="mt-2 font-display text-4xl">{v}</p>
                <p className="mt-1 text-[11px] text-ash">{s}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="font-mono text-[11px] tracking-[0.3em] text-ash">ALERTAS DE STOCK BAJO (≤2 UNIDADES)</h2>
            <ul className="mt-3 divide-y divide-white/10 border-y border-white/10 text-sm">
              {stats.lowStock.slice(0, 12).map(({ p, s }) => (
                <li key={p.id + s.label} className="flex justify-between py-2">
                  <span>{p.name} <span className="text-ash">· talla {s.label}</span>{p.demo && <span className="ml-2 font-mono text-[10px] text-ash">DEMO</span>}</span>
                  <span className="font-mono text-acid">{s.stock}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "Inventario" && (
        <div className="mt-8">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="h-10 border border-white/20 bg-ink px-3 text-xs" aria-label="Filtrar por categoría">
            <option value="all">Todas las categorías</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
          </select>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 font-mono text-[10px] tracking-[0.2em] text-ash">
                <tr><th className="py-2 pr-3">PRODUCTO</th><th className="pr-3">CATEGORÍA</th><th className="pr-3">PRECIO</th><th className="pr-3">STOCK POR TALLA</th><th className="pr-3">TOTAL</th><th>ESTADO</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.filter((p) => catFilter === "all" || p.category === catFilter).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden bg-cement"><Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" /></div>
                        <div><p className="font-semibold">{p.name}</p><p className="font-mono text-[10px] text-ash">{p.id} · {p.slug}</p></div>
                      </div>
                    </td>
                    <td className="pr-3 text-ash">{categories.find((c) => c.slug === p.category)?.label}</td>
                    <td className="pr-3 font-mono">{formatCOP(p.price, false)}{p.priceToConfirm && <span className="ml-1 text-[10px] text-acid">*</span>}</td>
                    <td className="pr-3">
                      <div className="flex flex-wrap gap-1">
                        {p.sizes.map((s) => (
                          <span key={s.label} className={cn("border px-1.5 py-0.5 font-mono text-[10px]", s.stock === 0 ? "border-danger/40 text-danger" : s.stock <= 2 ? "border-acid/40 text-acid" : "border-white/15")}>
                            {s.label}:{s.stock}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="pr-3 font-mono">{totalStock(p)}</td>
                    <td className="text-xs">{isSoldOut(p) ? <span className="text-danger">Agotado</span> : p.demo ? <span className="text-ash">Demo</span> : <span className="text-acid">Activo</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ash">* Precio por confirmar. Edita productos, precios y stock en <code className="font-mono text-bone">src/lib/products.ts</code> o en la tabla <code className="font-mono text-bone">inventory</code> de Supabase.</p>
        </div>
      )}

      {tab === "Pedidos" && (
        <div className="mt-8">
          {orders.length === 0 ? (
            <p className="text-sm text-ash">No hay pedidos guardados en este navegador.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => (
                <li key={o.code} className="border border-white/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm">{o.code} <span className="text-ash">· {o.storage}</span></p>
                      <p className="text-xs text-ash">{new Date(o.createdAt).toLocaleString("es-CO")} — {o.customer.fullName} · {o.customer.phone} · {o.customer.city}, {o.customer.department}</p>
                    </div>
                    <select value={o.status} onChange={(e) => setStatus(o.code, e.target.value as OrderStatus)} className="h-9 border border-white/20 bg-ink px-2 text-xs" aria-label={`Estado del pedido ${o.code}`}>
                      {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                  <p className="mt-2 text-sm">{o.items.map((i) => `${i.name} ${i.size}/${i.color} ×${i.qty}`).join(" · ")}</p>
                  <p className="mt-1 font-mono text-sm">{formatCOP(o.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "Cupones" && (
        <div className="mt-8 max-w-2xl space-y-3 text-sm">
          <p className="text-ash">Cupones de demostración activos mientras no haya base de datos (definidos en <code className="font-mono text-bone">src/lib/coupons.ts</code>):</p>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            <li className="flex justify-between py-2"><span className="font-mono">FATTEST10</span><span className="text-ash">10% sobre el subtotal</span></li>
            <li className="flex justify-between py-2"><span className="font-mono">DROP20K</span><span className="text-ash">$20.000 desde $200.000</span></li>
          </ul>
          <p className="text-ash">Con Supabase, los cupones viven en la tabla <code className="font-mono text-bone">coupons</code> (no legible desde el navegador) y se validan con la función <code className="font-mono text-bone">validate_coupon</code>.</p>
        </div>
      )}

      {tab === "Configuración" && (
        <ul className="mt-8 max-w-2xl divide-y divide-white/10 border-y border-white/10 text-sm">
          {[
            ["WhatsApp Business", !!siteConfig.whatsappNumber, "NEXT_PUBLIC_WHATSAPP_NUMBER"],
            ["Instagram", !!siteConfig.instagramUrl, "NEXT_PUBLIC_INSTAGRAM_URL"],
            ["TikTok", !!siteConfig.tiktokUrl, "NEXT_PUBLIC_TIKTOK_URL"],
            ["Correo de contacto", !!siteConfig.contactEmail, "NEXT_PUBLIC_CONTACT_EMAIL"],
            ["Supabase (pedidos, cupones, newsletter)", isSupabaseConfigured(), "NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY"],
            ["Pasarela de pago (Wompi / Mercado Pago / PayU)", false, "Pendiente de integrar"],
            ["Modo demo visible", siteConfig.demoMode, "NEXT_PUBLIC_DEMO_MODE"],
          ].map(([label, ok, env]) => (
            <li key={label as string} className="flex items-center justify-between gap-3 py-3">
              <span className="flex items-center gap-2">
                {ok ? <CheckCircle2 className="size-4 text-acid" /> : <Circle className="size-4 text-ash" />} {label as string}
              </span>
              <code className="font-mono text-[11px] text-ash">{env as string}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
