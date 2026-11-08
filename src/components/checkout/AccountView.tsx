"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearLocalOrders, getLocalOrders, type Order } from "@/lib/orders";
import { formatCOP } from "@/lib/format";
import { orderMessage, waLink } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n";

export function AccountView() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const { t, lang } = useI18n();
  const [wiped, setWiped] = useState(false);
  useEffect(() => setOrders(getLocalOrders()), []);
  const wipe = () => {
    if (!window.confirm(t("acc.wipeConfirm"))) return;
    clearLocalOrders();
    setOrders([]);
    setWiped(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{t("acc.eyebrow")}</p>
      <h1 className="mt-2 font-display text-[clamp(48px,9vw,104px)] uppercase leading-[0.85] tracking-tight">{t("acc.title")}</h1>
      <p className="mt-4 max-w-xl text-sm text-ash">
        {t("acc.sub")}
      </p>

      {orders === null ? null : orders.length === 0 ? (
        <div className="mt-12 border border-white/10 p-10 text-center">
          <p className="font-display text-4xl text-white/20">{t("acc.none")}</p>
          <Link href="/shop" className="mt-6 inline-block bg-bone px-6 py-3 text-xs font-bold tracking-[0.2em] text-ink hover:bg-acid">{t("acc.goShop")}</Link>
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
                    <p className="text-xs text-ash">{new Date(o.createdAt).toLocaleString(lang === "en" ? "en-US" : "es-CO", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <span className="border border-acid/40 px-2 py-1 font-mono text-[10px] tracking-[0.15em] text-acid">
                    {t(`status.${o.status}`).toUpperCase()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/80">{o.items.map((i) => `${i.name} (${i.size}) ×${i.qty}`).join(" · ")}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-mono">{formatCOP(o.total)}</p>
                  <div className="flex gap-4 text-xs">
                    <Link href={`/checkout/confirmacion?pedido=${o.code}`} className="text-ash underline hover:text-bone">{t("acc.detail")}</Link>
                    {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="text-acid underline">{t("acc.resend")}</a>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {orders && orders.length > 0 && (
        <button onClick={wipe} className="mt-8 text-xs text-ash underline underline-offset-4 transition hover:text-danger">{t("acc.wipe")}</button>
      )}
      {wiped && <p role="status" className="mt-6 text-xs text-acid">{t("acc.wiped")}</p>}
    </div>
  );
}
