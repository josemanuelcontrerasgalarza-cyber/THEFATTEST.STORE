import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/home/Marquee";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About — More than clothing",
  description: "THEFATTEST es más que una tienda. Es una declaración, una cultura, una forma de moverse. Streetwear con identidad propia, hecho en Colombia.",
};

const pillars = [
  { n: "01", t: "Curaduría", d: "Cada pieza pasa un filtro: calidad, peso, caída y actitud. Si no la usaríamos, no la vendemos." },
  { n: "02", t: "Cultura", d: "Nacimos en la calle, en el barrio, en la música. Vestimos a quienes construyen su propio camino." },
  { n: "03", t: "Trato directo", d: "Te atiende una persona real por WhatsApp: tallas, outfits, disponibilidad. Sin bots, sin rodeos." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-4 pb-16 pt-14 sm:px-6 lg:px-10">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">ABOUT — EST. {siteConfig.established}</p>
          <h1 className="mt-4 font-display text-[clamp(64px,14vw,220px)] uppercase leading-[0.82] tracking-tight">
            MORE THAN <br /><span className="text-outline">CLOTHING.</span>
          </h1>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <p className="text-2xl leading-snug sm:text-3xl">THEFATTEST is more than a store. It&apos;s a statement. A culture. A way of moving.</p>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-white/70">
              <p>
                Empezamos como una cuenta de Instagram con una idea simple: traer piezas que nadie más tenía y venderlas con la seriedad de una marca grande. Hoy
                THEFATTEST es la vitrina de una generación que no espera permiso para destacar.
              </p>
              <p>No seguimos tendencias, las ponemos. No buscamos seguidores, buscamos influencia. Built different. Worn different.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="grid h-[60vh] grid-cols-3 gap-1 sm:h-[80vh]">
        {["1523398002811-999ca8dec234", "1614495039153-e9cd13240469", "1578681994506-b8f463449011"].map((id, i) => (
          <div key={id} className={`relative overflow-hidden ${i === 1 ? "translate-y-8" : ""}`}>
            <Image src={`https://images.unsplash.com/photo-${id}?fit=crop`} alt="Editorial THEFATTEST" fill sizes="33vw" className="object-cover grayscale contrast-125" />
          </div>
        ))}
      </div>

      <section className="mx-auto max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10">
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08} className="bg-ink p-8">
              <p className="font-mono text-xs text-acid">{p.n}</p>
              <h2 className="mt-6 font-display text-5xl uppercase">{p.t}</h2>
              <p className="mt-4 leading-relaxed text-white/70">{p.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap gap-3">
          <Link href="/shop" className="bg-bone px-8 py-4 text-xs font-bold tracking-[0.25em] text-ink hover:bg-acid">SHOP THE COLLECTION</Link>
          <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="border border-white/30 px-8 py-4 text-xs font-bold tracking-[0.25em] hover:border-bone">
            {siteConfig.instagramHandle.toUpperCase()}
          </a>
        </div>
      </section>
      <Marquee inverted words={["NO FOLLOWERS", "JUST INFLUENCE", "STAY FATTEST"]} />
    </>
  );
}
