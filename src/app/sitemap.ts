import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { categories, products } from "@/lib/products";
import { infoPages } from "@/lib/info-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${siteConfig.url}${p}`;
  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    { url: u("/shop"), changeFrequency: "daily", priority: 0.9 },
    { url: u("/about"), priority: 0.5 },
    ...categories.map((c) => ({ url: u(`/shop?cat=${c.slug}`), priority: 0.7 })),
    ...products.filter((p) => !p.demo).map((p) => ({ url: u(`/product/${p.slug}`), priority: 0.8 })),
    ...Object.keys(infoPages).map((k) => ({ url: u(`/info/${k}`), priority: 0.3 })),
  ];
}
