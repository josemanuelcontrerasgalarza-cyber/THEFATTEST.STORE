import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { infoPages } from "@/lib/info-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(infoPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = infoPages[(await params).slug];
  return page ? { title: page.title, description: page.description } : { title: "No encontrado" };
}

export default async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const page = infoPages[slug];
  if (!page) notFound();
  return (
    <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pb-24 pt-10 sm:px-6 lg:grid-cols-12 lg:px-10">
      <aside className="lg:col-span-3">
        <nav className="sticky top-28 flex flex-wrap gap-2 lg:flex-col lg:gap-1" aria-label="Información">
          {Object.entries(infoPages).map(([k, v]) => (
            <Link key={k} href={`/info/${k}`} className={`text-sm ${k === slug ? "text-acid" : "text-ash hover:text-bone"} border border-white/10 px-3 py-1.5 lg:border-0 lg:px-0`}>
              {v.title}
            </Link>
          ))}
        </nav>
      </aside>
      <article className="lg:col-span-8">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{page.eyebrow}</p>
        <h1 className="mt-2 font-display text-[clamp(44px,8vw,96px)] uppercase leading-[0.85] tracking-tight">{page.title}</h1>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {page.sections.map((s) => (
            <section key={s.h} className="grid gap-2 py-6 sm:grid-cols-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide">{s.h}</h2>
              <p className="leading-relaxed text-white/75 sm:col-span-2">{s.p}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
