import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, products } from "@/lib/products";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";

/** Editorial bento of categories. First two tiles are large. */
export function CategoryGrid() {
  const order = ["camisetas", "conjuntos", "buzos", "sneakers", "joyeria", "chaquetas", "perfumeria", "accesorios", "jeans", "cargos"];
  const cats = order.map((s) => categories.find((c) => c.slug === s)!);
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10" aria-labelledby="cats">
      <SectionHeading eyebrow="CATÁLOGO" title={<span id="cats">SHOP BY <span className="text-outline">CATEGORY</span></span>} />
      <div className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-[repeat(3,minmax(0,260px))]">
        {cats.map((c, i) => {
          const n = products.filter((p) => p.category === c.slug).length;
          const big = i < 2;
          return (
            <Reveal key={c.slug} delay={(i % 4) * 0.05} className={cn(big ? "col-span-2 row-span-2 aspect-[4/5] sm:aspect-[16/11] lg:col-span-2 lg:row-span-2 lg:aspect-auto" : i < 6 ? "aspect-square lg:aspect-auto" : "aspect-square lg:hidden", "relative")}>
              <Link href={`/shop?cat=${c.slug}`} className="group absolute inset-0 overflow-hidden bg-cement">
                <Image src={c.image} alt={c.label} fill sizes={big ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"} className="object-cover opacity-80 transition duration-[1.2s] ease-out-expo group-hover:scale-105 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-6">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-white/60">{String(i + 1).padStart(2, "0")} — {n} PIEZAS</p>
                    <h3 className={cn("font-display uppercase leading-[0.9]", big ? "text-5xl sm:text-7xl" : "text-3xl sm:text-4xl")}>{c.label}</h3>
                  </div>
                  <span className="grid size-10 shrink-0 place-items-center border border-white/30 transition group-hover:border-acid group-hover:bg-acid group-hover:text-ink">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-6 hidden flex-wrap gap-2 lg:flex">
        {cats.slice(6).map((c) => (
          <Link key={c.slug} href={`/shop?cat=${c.slug}`} className="border border-white/15 px-5 py-2.5 text-xs font-bold tracking-[0.2em] transition hover:border-acid hover:text-acid">
            {c.label.toUpperCase()} →
          </Link>
        ))}
      </div>
    </section>
  );
}
