import { siteConfig } from "./config";
import { formatCOP } from "./format";
import type { Order } from "./orders";
import type { Product } from "./products";

/** wa.me link, or null when no number is configured (never invent one). */
export function waLink(text: string): string | null {
  if (!siteConfig.whatsappNumber) return null;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const waMessages = {
  general: () => `Hola ${siteConfig.name} 👋 Quiero asesoría con mi outfit.`,
  product: (p: Product, size?: string, color?: string) =>
    [
      `Hola ${siteConfig.name} 👋`,
      `Me interesa: *${p.name}* (${formatCOP(p.price)})`,
      size ? `Talla: ${size}` : `¿Qué tallas tienen disponibles?`,
      color ? `Color: ${color}` : null,
      `¿Está disponible?`,
    ]
      .filter(Boolean)
      .join("\n"),
};

export function orderMessage(o: Order): string {
  const lines = o.items.map(
    (i, n) => `${n + 1}. *${i.name}*\n   Talla: ${i.size} · Color: ${i.color} · Cant: ${i.qty}\n   ${formatCOP(i.unitPrice)} c/u = ${formatCOP(i.unitPrice * i.qty)}`,
  );
  return [
    `🖤 *NUEVO PEDIDO — ${siteConfig.domain}*`,
    `Pedido: *${o.code}*`,
    ``,
    ...lines,
    ``,
    `Subtotal: ${formatCOP(o.subtotal)}`,
    o.discount > 0 ? `Descuento${o.couponCode ? ` (${o.couponCode})` : ""}: -${formatCOP(o.discount)}` : null,
    `Envío: ${o.shipping === 0 ? "GRATIS" : formatCOP(o.shipping)}`,
    `*TOTAL: ${formatCOP(o.total)}*`,
    ``,
    `👤 ${o.customer.fullName}`,
    `📞 ${o.customer.phone}`,
    `✉️ ${o.customer.email}`,
    `📍 ${o.customer.address}, ${o.customer.city}, ${o.customer.department}`,
    o.customer.notes ? `📝 ${o.customer.notes}` : null,
    ``,
    `Quiero confirmar disponibilidad y el método de pago.`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
