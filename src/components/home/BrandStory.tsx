"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const A = "https://images.unsplash.com/photo-1578681994506-b8f463449011?fit=crop";
const B = "https://images.unsplash.com/photo-1614495039153-e9cd13240469?fit=crop";
const C = "https://images.unsplash.com/photo-1527010154944-f2241763d806?fit=crop";

export function BrandStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["25%", "-25%"]);
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-30%"]);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-ink py-24 sm:py-36" aria-labelledby="story">
      <motion.p style={{ x }} className="pointer-events-none absolute top-10 whitespace-nowrap font-display text-[22vw] leading-none text-white/[0.03]" aria-hidden>
        THEFATTEST THEFATTEST
      </motion.p>

      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-10">
        <div className="lg:col-span-6 lg:pt-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-ash">BRAND STORY</p>
          <h2 id="story" className="mt-4 font-display text-[clamp(56px,10vw,150px)] uppercase leading-[0.82] tracking-tight">
            MORE<br />THAN<br /><span className="text-acid">CLOTHING.</span>
          </h2>
          <div className="mt-10 max-w-md space-y-5 text-lg leading-relaxed text-white/70">
            <p className="text-2xl leading-snug text-bone">
              THEFATTEST is more than a store. It&apos;s a statement. A culture. A way of moving.
            </p>
            <p>
              Representamos a una generación que construye su propio camino: sin pedir permiso, sin copiar a nadie. Elegimos cada pieza para que
              lo que te pongas diga quién eres antes de que hables.
            </p>
            <p>Built different. Worn different.</p>
          </div>
          <Link href="/about" className="mt-10 inline-flex h-12 items-center border border-white/30 px-6 text-xs font-bold tracking-[0.25em] transition hover:border-bone hover:bg-bone hover:text-ink">
            NUESTRA HISTORIA
          </Link>
        </div>

        <div className="relative h-[560px] sm:h-[720px] lg:col-span-6 lg:h-[860px]">
          <motion.div style={{ y: y1 }} className="absolute right-0 top-0 h-[62%] w-[68%] overflow-hidden">
            <Image src={B} alt="Retrato editorial en negro" fill sizes="(max-width:1024px) 70vw, 35vw" className="object-cover grayscale contrast-125" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 h-[52%] w-[54%] overflow-hidden border-8 border-ink">
            <Image src={A} alt="Modelo con buzo negro y bucket hat" fill sizes="(max-width:1024px) 55vw, 28vw" className="object-cover grayscale contrast-125" />
          </motion.div>
          <motion.div style={{ y: y1 }} className="absolute bottom-[8%] right-[4%] hidden h-[26%] w-[30%] overflow-hidden sm:block">
            <Image src={C} alt="Outfit urbano con sneakers" fill sizes="20vw" className="object-cover grayscale contrast-125" />
          </motion.div>
          <p className="absolute left-0 top-4 font-mono text-[10px] tracking-[0.3em] text-ash [writing-mode:vertical-rl]">EST. 2026 — COLOMBIA</p>
        </div>
      </div>
    </section>
  );
}
