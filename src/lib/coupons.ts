import { getSupabase } from "./supabase";

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minSubtotal?: number;
  description: string;
};

/**
 * DEMO coupons used only when Supabase is not configured. With Supabase, codes
 * are validated server-side by the `validate_coupon` RPC (the table is never
 * readable from the browser).
 */
const demoCoupons: Coupon[] = [
  { code: "FATTEST10", type: "percent", value: 10, description: "10% OFF (cupón demo)" },
  { code: "DROP20K", type: "fixed", value: 20_000, minSubtotal: 200_000, description: "$20.000 OFF desde $200.000 (cupón demo)" },
];

export type CouponResult = { ok: true; coupon: Coupon } | { ok: false; error: string };

export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Escribe un código." };

  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb.rpc("validate_coupon", { p_code: code, p_subtotal: subtotal });
    if (error) return { ok: false, error: "No pudimos validar el cupón. Intenta de nuevo." };
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.valid) return { ok: false, error: row?.message ?? "Cupón no válido." };
    return {
      ok: true,
      coupon: { code, type: row.type, value: Number(row.value), minSubtotal: Number(row.min_subtotal ?? 0), description: row.description ?? code },
    };
  }

  const c = demoCoupons.find((x) => x.code === code);
  if (!c) return { ok: false, error: "Cupón no válido." };
  if (c.minSubtotal && subtotal < c.minSubtotal) return { ok: false, error: "No cumples el mínimo de compra para este cupón." };
  return { ok: true, coupon: c };
}

export function couponDiscount(c: Coupon | null, subtotal: number): number {
  if (!c) return 0;
  if (c.minSubtotal && subtotal < c.minSubtotal) return 0;
  const d = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
  return Math.min(Math.round(d), subtotal);
}
