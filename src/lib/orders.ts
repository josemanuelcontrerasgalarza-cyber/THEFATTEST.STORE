import { getSupabase } from "./supabase";
import type { CartTotals } from "./cart-math";
import type { Coupon } from "./coupons";

export const ORDER_STATUSES = [
  { value: "pendiente", label: "Pendiente de confirmación" },
  { value: "confirmado", label: "Confirmado / pagado" },
  { value: "preparando", label: "En preparación" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export type Customer = {
  fullName: string;
  phone: string;
  email: string;
  department: string;
  city: string;
  address: string;
  notes: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  unitPrice: number;
};

export type Order = {
  code: string;
  createdAt: string;
  status: OrderStatus;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  couponCode: string | null;
  discount: number;
  shipping: number;
  total: number;
  /** Where the order record lives. */
  storage: "supabase" | "local";
};

const LS_KEY = "thefattest-orders";

function newCode(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 4)
    .toUpperCase();
  return `TF-${ymd}-${rand}`;
}

export function getLocalOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(orders));
  } catch {
    /* storage full / blocked — the WhatsApp message is still the source of truth */
  }
}

export function getLocalOrder(code: string): Order | undefined {
  return getLocalOrders().find((o) => o.code === code);
}

export function updateLocalOrderStatus(code: string, status: OrderStatus) {
  saveLocalOrders(getLocalOrders().map((o) => (o.code === code ? { ...o, status } : o)));
}

/**
 * Registers an order. No payment is taken here: the order is created as
 * "pendiente" and confirmed by the store over WhatsApp.
 * With Supabase configured, the `create_order` RPC recomputes prices, coupon
 * and stock server-side (never trust browser totals) and returns the code.
 */
export async function createOrder(customer: Customer, totals: CartTotals, coupon: Coupon | null): Promise<Order> {
  const items: OrderItem[] = totals.lines.map((l) => ({
    productId: l.productId,
    slug: l.product.slug,
    name: l.product.name,
    size: l.size,
    color: l.color,
    qty: l.qty,
    unitPrice: l.product.price,
  }));

  const base: Omit<Order, "code" | "storage"> = {
    createdAt: new Date().toISOString(),
    status: "pendiente",
    customer,
    items,
    subtotal: totals.subtotal,
    couponCode: coupon && totals.couponDiscount > 0 ? coupon.code : null,
    discount: totals.couponDiscount,
    shipping: totals.shipping,
    total: totals.total,
  };

  const sb = getSupabase();
  let order: Order;
  if (sb) {
    const { data, error } = await sb.rpc("create_order", {
      p_customer: {
        full_name: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        department: customer.department,
        city: customer.city,
        address: customer.address,
        notes: customer.notes,
      },
      p_items: items.map((i) => ({ slug: i.slug, size: i.size, color: i.color, qty: i.qty })),
      p_coupon: base.couponCode,
    });
    if (error) throw new Error(error.message || "No pudimos registrar el pedido.");
    const row = Array.isArray(data) ? data[0] : data;
    order = {
      ...base,
      code: row.code,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      shipping: Number(row.shipping),
      total: Number(row.total),
      storage: "supabase",
    };
  } else {
    order = { ...base, code: newCode(), storage: "local" };
  }

  saveLocalOrders([order, ...getLocalOrders()]);
  return order;
}
