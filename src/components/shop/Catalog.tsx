"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { applyFilters, filtersToQuery, PRICE_RANGES, SIZE_GROUPS, SORTS, type Filters, type SortId } from "@/lib/catalog";
import { categories, products, type CategorySlug } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/format";
import { siteConfig } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

const PAGE = 12;

export function Catalog({ initial }: { initial: Filters }) {
  const [f, setF] = useState<Filters>(initial);
  const { t, cat, size: sizeName } = useI18n();
  const [visible, setVisible] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const results = useMemo(() => applyFilters(f), [f]);

  // Keep the URL shareable without a server round-trip.
  useEffect(() => {
    const url = `/shop${filtersToQuery(f)}`;
    if (url !== window.location.pathname + window.location.search) window.history.replaceState(null, "", url);
  }, [f]);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  const update = (patch: Partial<Filters>) => {
    setF((prev) => ({ ...prev, ...patch }));
    setVisible(PAGE);
  };
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const activeCount = f.cats.length + f.sizes.length + (f.price ? 1 : 0) + (f.onlyNew ? 1 : 0) + (f.onlySale ? 1 : 0) + (f.inStock ? 1 : 0);
  const reset = () => update({ q: "", cats: [], sizes: [], price: null, onlyNew: false, onlySale: false, inStock: false, sort: "featured" });

  const title =
    f.cats.length === 1 ? cat(f.cats[0]) : f.onlyNew ? t("shop.new") : f.onlySale ? t("shop.sale") : f.q ? `“${f.q}”` : t("shop.all");

  const panel = (
    <div className="space-y-8">
      <FilterGroup title={t("shop.category")}>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <Chip key={c.slug} active={f.cats.includes(c.slug)} onClick={() => update({ cats: toggle<CategorySlug>(f.cats, c.slug) })}>
              {cat(c.slug)} <span className="text-white/40">{products.filter((p) => p.category === c.slug).length}</span>
            </Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title={t("shop.price")}>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => (
            <label key={r.id} className="flex cursor-pointer items-center gap-3 py-1 text-sm text-white/80 hover:text-bone">
              <input type="radio" name="price" checked={f.price === r.id} onChange={() => update({ price: r.id })} className="accent-[#C8FF00]" />
              {t(`shop.prices.${r.id}`)}
            </label>
          ))}
          {f.price && (
            <button onClick={() => update({ price: null })} className="mt-1 text-xs text-ash underline hover:text-bone">{t("shop.clearPrice")}</button>
          )}
        </div>
      </FilterGroup>
      <FilterGroup title={t("shop.size")}>
        <div className="space-y-4">
          {SIZE_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="mb-2 text-[11px] text-ash">{t(g.label)}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.sizes.map((s) => (
                  <Chip key={s} active={f.sizes.includes(s)} onClick={() => update({ sizes: toggle(f.sizes, s) })} mono>
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title={t("shop.show")}>
        <div className="space-y-2">
          {[
            { k: "onlyNew" as const, label: t("shop.onlyNew") },
            { k: "inStock" as const, label: t("shop.inStock") },
          ].map((o) => (
            <label key={o.k} className="flex cursor-pointer items-center gap-3 text-sm text-white/80 hover:text-bone">
              <input type="checkbox" checked={f[o.k]} onChange={(e) => update({ [o.k]: e.target.checked })} className="accent-[#C8FF00]" />
              {o.label}
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-10">
      <header className="border-b border-white/10 pb-8">
        <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{t("shop.eyebrow", { n: results.length })}</p>
        <h1 className="mt-3 font-display text-[clamp(52px,10vw,140px)] uppercase leading-[0.85] tracking-tight">{title}</h1>
        {siteConfig.demoMode && (
          <p className="mt-4 max-w-2xl text-xs text-ash">
            {t("shop.demoNote1")} <span className="border border-white/15 px-1 font-mono text-[10px]">DEMO</span> {t("shop.demoNote2")}
          </p>
        )}
      </header>

      {/* toolbar */}
      <div className="sticky top-16 z-30 -mx-4 flex items-center gap-2 border-b border-white/10 bg-ink/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[72px] lg:-mx-10 lg:px-10">
        <button onClick={() => setSheet(true)} className="inline-flex h-10 items-center gap-2 border border-white/20 px-4 text-xs font-bold tracking-[0.15em] lg:hidden">
          <SlidersHorizontal className="size-4" /> {t("shop.filters")} {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-acid text-[10px] text-ink">{activeCount}</span>}
        </button>
        <div className="relative hidden flex-1 sm:block lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash" />
          <input
            value={f.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={t("shop.search")}
            aria-label={t("shop.search")}
            className="h-10 w-full border border-white/15 bg-transparent pl-9 pr-3 text-sm placeholder:text-white/30 focus:border-bone focus:outline-none"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort" className="hidden text-xs text-ash sm:block">{t("shop.sort")}</label>
          <select
            id="sort"
            value={f.sort}
            onChange={(e) => update({ sort: e.target.value as SortId })}
            className="h-10 border border-white/20 bg-ink px-3 text-xs font-semibold focus:border-bone focus:outline-none"
          >
            {SORTS.map((s) => <option key={s.id} value={s.id}>{t(`shop.sorts.${s.id}`)}</option>)}
          </select>
        </div>
      </div>

      {/* mobile search */}
      <div className="relative mt-4 sm:hidden">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ash" />
        <input value={f.q} onChange={(e) => update({ q: e.target.value })} placeholder={t("shop.search")} aria-label={t("shop.search")} className="h-11 w-full border border-white/15 bg-transparent pl-9 pr-3 text-base placeholder:text-white/30 focus:border-bone focus:outline-none" />
      </div>

      {activeCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {f.cats.map((c) => <ActiveTag key={c} onRemove={() => update({ cats: f.cats.filter((x) => x !== c) })}>{cat(c)}</ActiveTag>)}
          {f.sizes.map((s) => <ActiveTag key={s} onRemove={() => update({ sizes: f.sizes.filter((x) => x !== s) })}>{t("shop.tagSize", { s: sizeName(s) })}</ActiveTag>)}
          {f.price && <ActiveTag onRemove={() => update({ price: null })}>{t(`shop.prices.${f.price}`)}</ActiveTag>}
          {f.onlyNew && <ActiveTag onRemove={() => update({ onlyNew: false })}>{t("shop.tagNew")}</ActiveTag>}
          {f.onlySale && <ActiveTag onRemove={() => update({ onlySale: false })}>{t("shop.tagSale")}</ActiveTag>}
          {f.inStock && <ActiveTag onRemove={() => update({ inStock: false })}>{t("shop.tagStock")}</ActiveTag>}
          <button onClick={reset} className="text-xs text-ash underline hover:text-bone">{t("shop.clearAll")}</button>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto pr-2 no-scrollbar">{panel}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="font-display text-6xl text-white/15">{t("shop.emptyT")}</p>
              <p className="text-sm text-ash">{t("shop.emptyS")}</p>
              <button onClick={reset} className="bg-bone px-6 py-3 text-xs font-bold tracking-[0.2em] text-ink hover:bg-acid">{t("shop.clearFilters")}</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3">
                {results.slice(0, visible).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} priority={i < 3} />
                ))}
              </div>
              <div className="mt-14 flex flex-col items-center gap-4">
                <p className="font-mono text-[11px] tracking-[0.2em] text-ash">
                  {t("shop.showing", { a: Math.min(visible, results.length), b: results.length })}
                </p>
                <div className="h-0.5 w-48 bg-white/10">
                  <div className="h-full bg-bone transition-all" style={{ width: `${(Math.min(visible, results.length) / results.length) * 100}%` }} />
                </div>
                {visible < results.length && (
                  <button onClick={() => setVisible((v) => v + PAGE)} className="mt-2 h-12 border border-white/30 px-8 text-xs font-bold tracking-[0.25em] transition hover:border-bone hover:bg-bone hover:text-ink">
                    {t("shop.more")}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/70" onClick={() => setSheet(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("a11y.filters")}
              className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[88dvh] flex-col border-t border-white/10 bg-ink"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <p className="font-display text-3xl leading-none">{t("shop.filters")}</p>
                <button onClick={() => setSheet(false)} aria-label={t("a11y.closeFilters")} className="-mr-2 grid size-11 place-items-center"><X className="size-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">{panel}</div>
              <div className="flex gap-2 border-t border-white/10 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
                <button onClick={reset} className="h-12 flex-1 border border-white/20 text-xs font-bold tracking-[0.2em]">{t("shop.clear")}</button>
                <button onClick={() => setSheet(false)} className="h-12 flex-[2] bg-acid text-xs font-bold tracking-[0.2em] text-ink">{t("shop.see", { n: results.length })}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 font-mono text-[11px] tracking-[0.3em] text-ash">{title.toUpperCase()}</legend>
      {children}
    </fieldset>
  );
}

function Chip({ active, onClick, children, mono }: { active: boolean; onClick: () => void; children: React.ReactNode; mono?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 border px-3 text-xs transition",
        mono ? "min-w-11 justify-center font-mono" : "font-semibold",
        active ? "border-acid bg-acid text-ink [&_span]:text-ink/60" : "border-white/15 text-white/80 hover:border-white/50",
      )}
    >
      {children}
    </button>
  );
}

function ActiveTag({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <button onClick={onRemove} className="inline-flex h-8 items-center gap-1.5 bg-cement px-3 text-xs hover:bg-steel">
      {children} <X className="size-3" aria-hidden />
    </button>
  );
}
