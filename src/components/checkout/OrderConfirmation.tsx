"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { getLocalOrder, type Order } from "@/lib/orders";
import { orderMessage, waLink } from "@/lib/whatsapp";
import { formatCOP } from "@/lib/format";
import { siteConfig } from "@/lib/config";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

export function OrderConfirmation() {
  const code = useSearchParams().get("pedido") ?? "";
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrder(getLocalOrder(code) ?? null), [code]);

  if (order === undefined) return <div className="min-h-[70vh]" />;
  if (order === null) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-6xl text-white/15">PEDIDO NO ENCONTRADO</p>
        <p className="mt-4 text-ash">No encontramos ese pedido en este dispositivo.</p>
        <Link href="/account" className="mt-8 bg-bone px-8 py-4 text-xs font-bold tracking-[0.25em] text-ink hover:bg-acid">VER MIS PEDIDOS</Link>
      </div>
    );
  }

  const msg = orderMessage(order);
  const wa = waLink(msg);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="grid size-16 place-items-center bg-acid text-ink">
        <Check className="size-8" strokeWidth={3} />
      </motion.div>
      <p className="mt-8 font-mono text-[11px] tracking-[0.3em] text-ash">PEDIDO {order.code}</p>
      <h1 className="mt-2 font-display text-[clamp(48px,9vw,104px)] uppercase leading-[0.85] tracking-tight">
        UN PASO <span className="text-outline">MÁS.</span>
      </h1>
      <p className="mt-6 max-w-xl text-white/75">
        Tu pedido quedó registrado como <strong className="text-bone">pendiente de confirmación</strong>. Envíalo por WhatsApp para que un asesor confirme disponibilidad,
        precio final y te comparta los datos de pago. <strong className="text-bone">Aún no se ha realizado ningún cobro.</strong>
      </p>

      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-8 flex h-16 w-full items-center justify-center gap-3 bg-[#25D366] text-sm font-bold tracking-[0.2em] text-ink transition hover:brightness-110 sm:w-auto sm:px-10">
          <WhatsAppIcon className="size-6" /> ENVIAR PEDIDO POR WHATSAPP
        </a>
      ) : (
        <div className="mt-8 border border-white/15 bg-cement/60 p-4 text-sm text-ash">
          El número de WhatsApp de la tienda aún no está configurado (<code className="font-mono text-bone">NEXT_PUBLIC_WHATSAPP_NUMBER</code>). Copia el mensaje y envíalo por
          Instagram a{" "}
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-bone underline">{siteConfig.instagramHandle}</a>.
        </div>
      )}

      <div className="mt-10 border border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="font-mono text-[11px] tracking-[0.25em] text-ash">MENSAJE DEL PEDIDO</p>
          <button onClick={copy} className="inline-flex items-center gap-1.5 text-xs text-ash hover:text-bone">
            {copied ? <Check className="size-3.5 text-acid" /> : <Copy className="size-3.5" />} {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-4 font-mono text-xs leading-relaxed text-white/80">{msg}</pre>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-px bg-white/10 text-sm sm:grid-cols-4">
        {[
          ["Productos", String(order.items.reduce((n, i) => n + i.qty, 0))],
          ["Envío", order.shipping === 0 ? "Gratis" : formatCOP(order.shipping, false)],
          ["Descuento", order.discount ? `−${formatCOP(order.discount, false)}` : "—"],
          ["Total", formatCOP(order.total)],
        ].map(([k, v]) => (
          <div key={k} className="bg-ink p-4">
            <dt className="text-xs text-ash">{k}</dt>
            <dd className="mt-1 font-mono">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap gap-4 text-xs font-bold tracking-[0.2em]">
        <Link href="/shop" className="border border-white/30 px-6 py-3 hover:border-bone">SEGUIR COMPRANDO</Link>
        <Link href="/account" className="px-2 py-3 text-ash hover:text-bone">VER MIS PEDIDOS →</Link>
      </div>
    </div>
  );
}
