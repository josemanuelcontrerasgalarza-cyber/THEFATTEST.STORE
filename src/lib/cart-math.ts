import { siteConfig } from "./config";
import { couponDiscount, type Coupon } from "./coupons";
import { getProductById, type Product } from "./products";
import type { CartItem } from "@/store/cart";

export type CartLine = CartItem & { product: Product; lineTotal: number; lineSavings: number };

export type CartTotals = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** Savings from sale prices (compareAt − price). Informational. */
  saleSavings: number;
  couponDiscount: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
};

export function computeCart(items: CartItem[], coupon: Coupon | null): CartTotals {
  const lines: CartLine[] = items.flatMap((i) => {
    const product = getProductById(i.productId);
    if (!product) return [];
    const lineTotal = product.price * i.qty;
    const lineSavings = product.compareAt && product.compareAt > product.price ? (product.compareAt - product.price) * i.qty : 0;
    return [{ ...i, product, lineTotal, lineSavings }];
  });
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const saleSavings = lines.reduce((n, l) => n + l.lineSavings, 0);
  const cDiscount = couponDiscount(coupon, subtotal);
  const afterDiscount = subtotal - cDiscount;
  const shipping = subtotal === 0 || afterDiscount >= siteConfig.shipping.freeFrom ? 0 : siteConfig.shipping.flatRate;
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    saleSavings,
    couponDiscount: cDiscount,
    shipping,
    total: afterDiscount + shipping,
    freeShippingRemaining: Math.max(0, siteConfig.shipping.freeFrom - afterDiscount),
  };
}
