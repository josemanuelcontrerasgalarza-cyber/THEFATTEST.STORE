import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, getProduct, isSoldOut, products, relatedProducts } from "@/lib/products";
import { ProductView } from "@/components/product/ProductView";
import { ProductCard } from "@/components/product/ProductCard";
import { siteConfig } from "@/lib/config";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return { title: "Producto no encontrado" };
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { title: `${p.name} | ${siteConfig.name}`, description: p.description, images: [{ url: p.images[0] }] },
    robots: p.demo ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const cat = getCategory(product.category)!;
  const related = relatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => (i.startsWith("http") ? i : `${siteConfig.url}${i}`)),
    description: product.description,
    category: cat.label,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: product.price,
      availability: isSoldOut(product) ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${siteConfig.url}/product/${product.slug}`,
    },
  };

  return (
    <>
      {!product.demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <div className="mx-auto max-w-[1600px] px-4 pt-6 sm:px-6 lg:px-10">
        <nav aria-label="Ruta" className="font-mono text-[11px] tracking-[0.15em] text-ash">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-bone">INICIO</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/shop" className="hover:text-bone">SHOP</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={`/shop?cat=${cat.slug}`} className="hover:text-bone">{cat.label.toUpperCase()}</Link></li>
            <li aria-hidden>/</li>
            <li className="text-bone" aria-current="page">{product.name.toUpperCase()}</li>
          </ol>
        </nav>
      </div>

      <ProductView product={product} />

      <section className="mx-auto max-w-[1600px] border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="related">
        <h2 id="related" className="font-display text-[clamp(40px,7vw,96px)] uppercase leading-[0.85] tracking-tight">
          COMPLETA EL <span className="text-outline">FIT</span>
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  );
}
