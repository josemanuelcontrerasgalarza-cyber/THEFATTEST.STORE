"use client";

import { MessageCircle, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

export function Services() {
  const { t } = useI18n();
  const items = [
    { icon: MessageCircle, title: t("services.t1"), text: t("services.d1") },
    { icon: Truck, title: t("services.t2"), text: t("services.d2", { eta: siteConfig.shipping.eta, amount: formatCOP(siteConfig.shipping.freeFrom) }) },
    { icon: RefreshCcw, title: t("services.t3", { days: siteConfig.returnsDays }), text: t("services.d3") },
    { icon: ShieldCheck, title: t("services.t4"), text: t("services.d4") },
  ];
  return (
    <section className="border-y border-white/10 bg-cement/40" aria-label={t("services.aria")}>
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 0.06} className="border-white/10 p-4 sm:p-8 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b">
            <it.icon className="size-5 text-acid" strokeWidth={1.6} />
            <h3 className="mt-3 text-[12.5px] font-semibold uppercase leading-snug tracking-wide sm:mt-4 sm:text-sm">{it.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ash sm:text-sm">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
