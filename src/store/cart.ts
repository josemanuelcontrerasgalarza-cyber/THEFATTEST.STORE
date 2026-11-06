"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Coupon } from "@/lib/coupons";
import { getProductById, stockFor } from "@/lib/products";

export type CartItem = {
  key: string;
  productId: string;
  size: string;
  color: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  coupon: Coupon | null;
  isOpen: boolean;
  add: (productId: string, size: string, color: string, qty?: number) => { ok: boolean; message?: string };
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  setSize: (key: string, size: string) => void;
  clear: () => void;
  setCoupon: (c: Coupon | null) => void;
  open: () => void;
  close: () => void;
};

const keyOf = (productId: string, size: string, color: string) => `${productId}__${size}__${color}`;

function maxQty(productId: string, size: string): number {
  const p = getProductById(productId);
  return p ? stockFor(p, size) : 0;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      add: (productId, size, color, qty = 1) => {
        const max = maxQty(productId, size);
        if (max <= 0) return { ok: false, message: "Esta talla está agotada." };
        const key = keyOf(productId, size, color);
        const existing = get().items.find((i) => i.key === key);
        const current = existing?.qty ?? 0;
        const next = Math.min(current + qty, max);
        if (next === current) return { ok: false, message: `Solo quedan ${max} unidades en talla ${size}.` };
        set({
          items: existing
            ? get().items.map((i) => (i.key === key ? { ...i, qty: next } : i))
            : [...get().items, { key, productId, size, color, qty: next }],
        });
        return { ok: true, message: next < current + qty ? `Ajustado al stock disponible (${max}).` : undefined };
      },

      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),

      setQty: (key, qty) =>
        set({
          items: get()
            .items.map((i) => (i.key === key ? { ...i, qty: Math.max(0, Math.min(qty, maxQty(i.productId, i.size))) } : i))
            .filter((i) => i.qty > 0),
        }),

      setSize: (key, size) => {
        const item = get().items.find((i) => i.key === key);
        if (!item || item.size === size) return;
        const newKey = keyOf(item.productId, size, item.color);
        const max = maxQty(item.productId, size);
        if (max <= 0) return;
        const others = get().items.filter((i) => i.key !== key);
        const merge = others.find((i) => i.key === newKey);
        set({
          items: merge
            ? others.map((i) => (i.key === newKey ? { ...i, qty: Math.min(i.qty + item.qty, max) } : i))
            : get().items.map((i) => (i.key === key ? { ...i, key: newKey, size, qty: Math.min(i.qty, max) } : i)),
        });
      },

      clear: () => set({ items: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "thefattest-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
      // Drop items whose product no longer exists (catalog changes between visits).
      onRehydrateStorage: () => (state) => {
        if (state) state.items = state.items.filter((i) => getProductById(i.productId));
      },
    },
  ),
);
