import Link from "next/link";
import { legal, legalRoutes, POLICY, waDisplay } from "@/lib/legal";
import { LegalLangNote } from "./LegalLangNote";
import { CookieSettingsButton } from "./CookieConsent";

export type LegalSection = { id: string; h: string; body: React.ReactNode };

const NAV = [
  { href: legalRoutes.privacy, label: "Política de privacidad" },
  { href: legalRoutes.terms, label: "Términos y condiciones" },
  { href: legalRoutes.returns, label: "Cambios y devoluciones" },
  { href: legalRoutes.cookies, label: "Política de cookies" },
  { href: legalRoutes.seller, label: "Información del vendedor" },
];

/** Shared layout for every legal document: side nav, table of contents, numbered sections. */
export function LegalDocument({
  path,
  eyebrow,
  title,
  intro,
  version,
  sections,
}: {
  path: string;
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  version?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-8 sm:px-6 sm:pt-12 lg:px-10">
      <header className="max-w-4xl">
        <p className="font-mono text-[11px] tracking-[0.3em] text-acid">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(42px,8vw,104px)] uppercase leading-[0.85] tracking-tight">{title}</h1>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.15em] text-ash">
          <span className="border border-white/15 px-2.5 py-1">ACTUALIZADA: {POLICY.updatedLabel.toUpperCase()}</span>
          {version && <span className="border border-white/15 px-2.5 py-1">VERSIÓN {version}</span>}
          <span className="border border-white/15 px-2.5 py-1">COLOMBIA</span>
        </div>
        <LegalLangNote />
        <div className="mt-6 max-w-3xl text-[15px] leading-relaxed text-white/75 sm:text-base">{intro}</div>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <aside className="lg:col-span-3">
          <div className="space-y-8 lg:sticky lg:top-28">
            <nav aria-label="Documentos legales">
              <p className="font-mono text-[10px] tracking-[0.3em] text-ash">DOCUMENTOS</p>
              <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto lg:flex-col lg:gap-0.5">
                {NAV.map((n) => (
                  <li key={n.href} className="shrink-0">
                    <Link
                      href={n.href}
                      aria-current={n.href === path ? "page" : undefined}
                      className={`block border px-3 py-2 text-[13px] transition lg:border-0 lg:border-l-2 lg:py-1.5 ${n.href === path ? "border-acid text-acid" : "border-white/10 text-ash hover:text-bone lg:border-transparent"}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Contenido" className="hidden lg:block">
              <p className="font-mono text-[10px] tracking-[0.3em] text-ash">CONTENIDO</p>
              <ol className="mt-3 space-y-1.5">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-2 text-[12px] leading-snug text-white/50 transition hover:text-bone">
                      <span className="font-mono text-white/30">{String(i + 1).padStart(2, "0")}</span> {s.h}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <article className="min-w-0 lg:col-span-8">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 py-7 sm:grid sm:grid-cols-[64px_1fr] sm:gap-4">
                <span className="font-mono text-xs text-acid">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold uppercase tracking-wide sm:text-lg">{s.h}</h2>
                  <div className="legal-prose mt-3 space-y-3 text-[15px] leading-relaxed text-white/75">{s.body}</div>
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 border border-white/10 bg-cement/40 p-5 text-sm text-ash sm:flex-row sm:items-center sm:justify-between">
            <p>¿Dudas sobre este documento? Escríbenos por WhatsApp {legal.whatsapp ? waDisplay(legal.whatsapp) : ""}{legal.privacyEmail ? ` o a ${legal.privacyEmail}` : ""}.</p>
            <CookieSettingsButton className="shrink-0 border border-white/20 px-4 py-2.5 text-[11px] font-bold tracking-[0.2em] text-bone transition hover:border-acid hover:text-acid" />
          </div>
        </article>
      </div>
    </div>
  );
}

/** Visible placeholder for business data the owner still has to provide. Never invent it. */
export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-dashed border-acid/50 bg-acid/5 px-1.5 font-mono text-[0.85em] text-acid" title="Dato pendiente de completar por el propietario">
      [Pendiente: {children}]
    </span>
  );
}

export function Val({ v, label }: { v?: string; label: string }) {
  return v ? <>{v}</> : <Pending>{label}</Pending>;
}

export function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[0.6em] size-1 shrink-0 bg-acid" aria-hidden />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export const A = ({ href, children }: { href: string; children: React.ReactNode }) =>
  href.startsWith("/") ? (
    <Link href={href} className="text-bone underline underline-offset-2 hover:text-acid">{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-bone underline underline-offset-2 hover:text-acid">{children}</a>
  );
