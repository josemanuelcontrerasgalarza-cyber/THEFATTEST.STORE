import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/** Real photos posted by @thefattest.store. */
const feed = [
  { src: "/products/amiri-front.jpg", href: "/product/amiri-rhinestone-tee", alt: "Amiri Rhinestone Tee" },
  { src: "/products/hellstar-heaven-black.jpg", href: "/product/hellstar-heaven-tee", alt: "Hellstar Heaven Tee negra" },
  { src: "/products/kenzo-tiger.jpg", href: "/product/saco-kenzo-tiger", alt: "Saco Kenzo Tiger" },
  { src: "/products/hugo-leopard-black.jpg", href: "/product/hugo-leopard-tee", alt: "Hugo Leopard Tee" },
  { src: "/products/mixed-front.jpg", href: "/product/mixed-emotion-astronaut-tee", alt: "Mixed Emotion Astronaut Tee" },
  { src: "/products/lacoste-set.jpg", href: "/product/conjunto-lacoste", alt: "Conjunto Lacoste" },
];

/**
 * DEMO reviews — clearly labelled. Replace with real, verifiable reviews
 * (e.g. screenshots/links from Instagram or Google) before launch.
 */
const demoReviews = [
  { initials: "A.R.", city: "Ejemplo", text: "La calidad de la camiseta es otro nivel. Llegó rápido y el empaque brutal.", product: "Camisetas" },
  { initials: "J.M.", city: "Ejemplo", text: "Me asesoraron por WhatsApp con la talla y quedó perfecta. Repito seguro.", product: "Conjuntos" },
  { initials: "S.P.", city: "Ejemplo", text: "El buzo pesa y se siente premium. Se nota la diferencia.", product: "Buzos" },
];

export function SocialProof() {
  return (
    <section className="border-t border-white/10 py-20 sm:py-28" aria-labelledby="community">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <SectionHeading eyebrow="COMUNIDAD THEFATTEST" title={<span id="community">WORN BY <span className="text-outline">THE CULTURE</span></span>}>
          <div className="flex gap-3">
            <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-xs font-bold tracking-[0.2em] transition hover:border-acid hover:text-acid">
              <InstagramIcon className="size-4" /> {siteConfig.instagramHandle.toUpperCase()}
            </a>
            {siteConfig.tiktokUrl && (
              <a href={siteConfig.tiktokUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 border border-white/20 px-4 text-xs font-bold tracking-[0.2em] transition hover:border-acid hover:text-acid">
                <TikTokIcon className="size-4" /> TIKTOK
              </a>
            )}
          </div>
        </SectionHeading>
      </div>

      {/* Outfit / feed gallery — horizontal scroll on mobile */}
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:px-6 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-10">
        {feed.map((f, i) => (
          <Reveal key={f.src} delay={i * 0.05} className="w-[62vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto">
            <Link href={f.href} className="group relative block aspect-[4/5] overflow-hidden bg-cement">
              <Image src={f.src} alt={f.alt} fill sizes="(max-width:1024px) 62vw, 16vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 grid place-items-center bg-ink/60 opacity-0 transition group-hover:opacity-100">
                <span className="font-mono text-[10px] tracking-[0.25em]">VER PIEZA →</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">LO QUE DICEN</p>
          <span className="border border-white/15 px-2 py-0.5 font-mono text-[9px] tracking-[0.2em] text-ash">RESEÑAS DE EJEMPLO — DEMO, NO SON CLIENTES REALES</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {demoReviews.map((r, i) => (
            <Reveal key={r.initials} delay={i * 0.08}>
              <figure className="flex h-full flex-col justify-between border border-white/10 bg-cement/60 p-6">
                <div>
                  <div className="flex gap-0.5 text-acid" aria-label="5 de 5 estrellas">
                    {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="size-3.5 fill-current" />)}
                  </div>
                  <blockquote className="mt-4 text-lg leading-snug">“{r.text}”</blockquote>
                </div>
                <figcaption className="mt-6 flex items-center justify-between font-mono text-[11px] tracking-[0.15em] text-ash">
                  <span>{r.initials} — {r.city}</span>
                  <span>{r.product.toUpperCase()}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-ash">
          ¿Ya compraste? Etiquétanos en Instagram {siteConfig.instagramHandle} y comparte tu fit con la comunidad.
        </p>
      </div>
    </section>
  );
}
