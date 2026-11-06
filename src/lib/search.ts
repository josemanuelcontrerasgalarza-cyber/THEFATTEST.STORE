import { getCategory, type Product } from "./products";

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Accent-insensitive search on name, category, description and colors; every word must match. */
export function searchProducts(list: Product[], query: string): Product[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return list;
  return list.filter((p) => {
    const hay = norm([p.name, p.nameEn ?? "", getCategory(p.category)?.label, p.category, p.description, ...p.colors.map((c) => c.name)].join(" "));
    return words.every((w) => hay.includes(w));
  });
}
