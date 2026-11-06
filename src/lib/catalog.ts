import { categoryGroups, isOnSale, isSoldOut, products, type CategorySlug, type Product } from "./products";
import { searchProducts } from "./search";

export const PRICE_RANGES = [
  { id: "0-100", label: "Menos de $100.000", min: 0, max: 99_999 },
  { id: "100-150", label: "$100.000 – $150.000", min: 100_000, max: 150_000 },
  { id: "150-200", label: "$150.000 – $200.000", min: 150_001, max: 200_000 },
  { id: "200-300", label: "$200.000 – $300.000", min: 200_001, max: 300_000 },
  { id: "300+", label: "Más de $300.000", min: 300_001, max: Infinity },
] as const;

export const SORTS = [
  { id: "featured", label: "Destacados" },
  { id: "new", label: "Novedades" },
  { id: "price-asc", label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
] as const;
export type SortId = (typeof SORTS)[number]["id"];

export type Filters = {
  q: string;
  cats: CategorySlug[];
  sizes: string[];
  price: string | null;
  onlyNew: boolean;
  onlySale: boolean;
  inStock: boolean;
  sort: SortId;
};

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const list = (v: string | string[] | undefined) => one(v).split(",").map((s) => s.trim()).filter(Boolean);

export function parseFilters(sp: Params): Filters {
  const group = one(sp.group);
  const cats = [...list(sp.cat), ...(categoryGroups[group] ?? [])] as CategorySlug[];
  const sort = one(sp.sort) as SortId;
  return {
    q: one(sp.q),
    cats: Array.from(new Set(cats)),
    sizes: list(sp.size),
    price: one(sp.price) || null,
    onlyNew: one(sp.new) === "1",
    onlySale: one(sp.sale) === "1",
    inStock: one(sp.stock) === "1",
    sort: SORTS.some((s) => s.id === sort) ? sort : one(sp.new) === "1" ? "new" : "featured",
  };
}

export function filtersToQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.cats.length) p.set("cat", f.cats.join(","));
  if (f.sizes.length) p.set("size", f.sizes.join(","));
  if (f.price) p.set("price", f.price);
  if (f.onlyNew) p.set("new", "1");
  if (f.onlySale) p.set("sale", "1");
  if (f.inStock) p.set("stock", "1");
  if (f.sort !== "featured" && !(f.onlyNew && f.sort === "new")) p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Featured order: real in-stock products first, then demo, sold-out last. */
const featuredScore = (p: Product) => (isSoldOut(p) ? 2 : 0) + (p.demo ? 1 : 0);

export function applyFilters(f: Filters): Product[] {
  let r = f.q ? searchProducts(products, f.q) : [...products];
  if (f.cats.length) r = r.filter((p) => f.cats.includes(p.category));
  if (f.sizes.length) r = r.filter((p) => p.sizes.some((s) => f.sizes.includes(s.label) && (s.stock > 0 || !f.inStock)));
  if (f.price) {
    const range = PRICE_RANGES.find((x) => x.id === f.price);
    if (range) r = r.filter((p) => p.price >= range.min && p.price <= range.max);
  }
  if (f.onlyNew) r = r.filter((p) => p.isNew);
  if (f.onlySale) r = r.filter(isOnSale);
  if (f.inStock) r = r.filter((p) => !isSoldOut(p));

  switch (f.sort) {
    case "new":
      return r.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return r.sort((a, b) => a.price - b.price);
    case "price-desc":
      return r.sort((a, b) => b.price - a.price);
    default:
      return r.sort((a, b) => featuredScore(a) - featuredScore(b));
  }
}

export const SIZE_GROUPS = [
  { label: "shop.sizeClothes", sizes: ["S", "M", "L", "XL", "XXL"] },
  { label: "shop.sizeJeans", sizes: ["28", "30", "32", "34", "36"] },
  { label: "shop.sizeShoes", sizes: ["38", "39", "40", "41", "42", "43"] },
];
