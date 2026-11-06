export function Marquee({ words, inverted = false }: { words: string[]; inverted?: boolean }) {
  const row = [...words, ...words];
  return (
    <div className={`overflow-hidden border-y py-4 sm:py-5 ${inverted ? "border-ink bg-acid text-ink" : "border-white/10 bg-ink text-bone"}`} aria-hidden>
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-8 px-8 font-display text-4xl leading-none tracking-tight sm:text-6xl">
            <span className={i % 2 ? (inverted ? "" : "text-outline") : ""}>{w}</span>
            <span className={`text-2xl ${inverted ? "text-ink" : "text-acid"}`}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
