import type { Metadata } from "next";
import { Catalog } from "@/components/shop/Catalog";
import { parseFilters } from "@/lib/catalog";
import { getCategory } from "@/lib/products";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const title = f.cats.length === 1 ? getCategory(f.cats[0])?.label ?? "Tienda" : f.onlyNew ? "Lo nuevo" : "Tienda — Catálogo completo";
  return {
    title,
    description: "Catálogo THEFATTEST: camisetas, buzos, chaquetas, jeans, cargos, conjuntos, tenis, accesorios, joyería y perfumería. Envíos a toda Colombia.",
    alternates: { canonical: "/shop" },
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const initial = parseFilters(await searchParams);
  // Remount when navigation (navbar, links) changes the filters from outside.
  return <Catalog key={JSON.stringify(initial)} initial={initial} />;
}
