import { siteConfig } from "@/lib/config";
import { formatCOP } from "@/lib/format";

export function AnnouncementBar() {
  const items = [
    `ENVÍO GRATIS DESDE ${formatCOP(siteConfig.shipping.freeFrom, false)}`,
    "ENVÍOS A TODA COLOMBIA",
    "CONFIRMA TU PEDIDO POR WHATSAPP",
    `CAMBIOS HASTA ${siteConfig.returnsDays} DÍAS`,
  ];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-white/5 bg-bone text-ink">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2 font-mono text-[10px] font-medium tracking-[0.25em] sm:text-[11px]">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6">
            {t}
            <span className="inline-block size-1 bg-ink" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
