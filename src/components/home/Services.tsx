import { MessageCircle, Truck, RefreshCcw, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatCOP } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: MessageCircle, title: "Asesoría personalizada", text: "Te ayudamos con tallas y outfits por WhatsApp." },
  { icon: Truck, title: "Envíos a toda Colombia", text: `${siteConfig.shipping.eta}. Gratis desde ${formatCOP(siteConfig.shipping.freeFrom)}.` },
  { icon: RefreshCcw, title: `Cambios en ${siteConfig.returnsDays} días`, text: "¿No te quedó? Lo cambiamos por otra talla." },
  { icon: ShieldCheck, title: "Pago seguro", text: "Confirmas tu pedido y pagas por canales oficiales." },
];

export function Services() {
  return (
    <section className="border-y border-white/10 bg-cement/40" aria-label="Beneficios">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06} className="border-white/10 p-5 sm:p-8 [&:not(:last-child)]:border-r max-lg:[&:nth-child(2)]:border-r-0 max-lg:[&:nth-child(-n+2)]:border-b">
            <it.icon className="size-5 text-acid" strokeWidth={1.6} />
            <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide">{it.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ash sm:text-sm">{it.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
