"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLocalOrders, ORDER_STATUSES, type Order } from "@/lib/orders";
import { formatCOP } from "@/lib/format";
import { orderMessage, waLink } from "@/lib/whatsapp";

export function AccountView() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => setOrders(getLocalOrders()), []);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ash">MI CUENTA</p>
      <h1 className="mt-2 font-display text-[clamp(48px,9vw,104px)] uppercase leading-[0.85] tracking-tight">MIS PEDIDOS</h1>
      <p className="mt-4 max-w-xl text-sm text-ash">
        Aquí ves los pedidos generados desde este dispositivo. El inicio de sesión con cuenta (historial en cualquier dispositivo) se activa al conectar la base de datos de la tienda.
      </p>

      {orders === null ? null : orders.length === 0 ? (
        <div className="mt-12 border border-white/10 p-10 text-center">
          <p className="font-display text-4xl text-white/20">AÚN NO HAY PEDIDOS</p>
          <Link href="/shop" className="mt-6 inline-block bg-bone px-6 py-3 text-xs font-bold tracking-[0.2em] text-ink hover:bg-acid">IR A LA TIENDA</Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {orders.map((o) => {
            const wa = waLink(orderMessage(o));
            return (
              <li key={o.code} className="border border-white/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm">{o.code}</p>
                    <p className="text-xs text-ash">{new Date(o.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <span className="border border-acid/40 px-2 py-1 font-mono text-[10px] tracking-[0.15em] text-acid">
                    {ORDER_STATUSES.find((s) => s.value === o.status)?.label.toUpperCase()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/80">{o.items.map((i) => `${i.name} (${i.size}) ×${i.qty}`).join(" · ")}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono">{formatCOP(o.total)}</p>
                  <div className="flex gap-4 text-xs">
                    <Link href={`/checkout/confirmacion?pedido=${o.code}`} className="text-ash underline hover:text-bone">Ver detalle</Link>
                    {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-acid underline">Reenviar por WhatsApp</a>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
