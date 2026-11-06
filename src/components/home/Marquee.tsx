"use client";

import { useI18n } from "@/lib/i18n";

/** Scrolling band. Pass `listKey` (dictionary array) so it follows the language. */
export function Marquee({ listKey, inverted = false }: { listKey: string; inverted?: boolean }) {
  const { list } = useI18n();
  const words = list(listKey);
  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden border-y py-3.5 sm:py-5 ${inverted ? "border-ink bg-acid text-ink" : "border-white/10 bg-ink text-bone"}`} aria-hidden>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-display text-3xl leading-none tracking-tight sm:gap-8 sm:px-8 sm:text-6xl">
            <span className={i % 2 ? (inverted ? "" : "text-outline") : ""}>{w}</span>
            <span className={`text-xl sm:text-2xl ${inverted ? "text-ink" : "text-acid"}`}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
