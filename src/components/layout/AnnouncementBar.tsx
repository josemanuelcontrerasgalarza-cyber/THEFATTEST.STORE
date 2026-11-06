"use client";

import { siteConfig } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

export function AnnouncementBar() {
  const { t } = useI18n();
  const items = [
    t("announce.free", { amount: formatCOP(siteConfig.shipping.freeFrom, false) }),
    t("announce.ship"),
    t("announce.wa"),
    t("announce.returns", { days: siteConfig.returnsDays }),
  ];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-bone text-ink">
      <div className="flex w-max animate-marquee whitespace-nowrap py-1.5 font-mono text-[9.5px] font-medium tracking-[0.22em] sm:py-2 sm:text-[11px] sm:tracking-[0.25em]">
        {[...row, ...row].map((x, i) => (
          <span key={i} className="flex items-center gap-5 px-5 sm:gap-6 sm:px-6">
            {x}
            <span className="inline-block size-1 bg-ink" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
