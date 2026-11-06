"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en, es, type Dict } from "./dict";
import type { Product } from "@/lib/products";

export type Lang = "es" | "en";
const DICTS: Record<Lang, Dict> = { es, en };
const KEY = "thefattest-lang";

type Vars = Record<string, string | number>;
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** t("cart.missing", { amount }) — dot path into the dictionary. Falls back to Spanish, then the key. */
  t: (path: string, vars?: Vars) => string;
  /** Arrays (e.g. marquee words). */
  list: (path: string) => string[];
  pName: (p: Product) => string;
  pDesc: (p: Product) => string;
  pDetails: (p: Product) => string[];
  color: (name: string) => string;
  size: (label: string) => string;
  cat: (slug: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function get(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}
const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Spanish is the default (and what the server renders); English is restored after hydration.
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "es") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "es-CO";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => {
    const d = DICTS[lang];
    const t = (path: string, vars?: Vars) => {
      const v = get(d, path) ?? get(es, path);
      return typeof v === "string" ? fill(v, vars) : path;
    };
    const list = (path: string) => {
      const v = get(d, path) ?? get(es, path);
      return Array.isArray(v) ? (v as string[]) : [];
    };
    return {
      lang,
      setLang,
      t,
      list,
      pName: (p) => (lang === "en" && p.nameEn) || p.name,
      pDesc: (p) => (lang === "en" && p.descriptionEn) || p.description,
      pDetails: (p) => (lang === "en" && p.detailsEn) || p.details,
      color: (name) => (lang === "en" && d.colors[name]) || name,
      size: (label) => (lang === "en" && d.sizes[label]) || label,
      cat: (slug) => (d.catNames as Record<string, string>)[slug] ?? slug,
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Spanish / English toggle. */
export function LangToggle({ className = "", size = "sm" }: { className?: string; size?: "sm" | "lg" }) {
  const { lang, setLang, t } = useI18n();
  const base = size === "lg" ? "h-10 px-4 text-xs" : "h-8 px-2.5 text-[10px]";
  return (
    <div role="group" aria-label={t("a11y.lang")} className={`inline-flex items-center border border-white/20 font-mono font-bold tracking-[0.15em] ${className}`}>
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          title={l === "es" ? "Español" : "English"}
          className={`${base} transition ${lang === l ? "bg-bone text-ink" : "text-white/60 hover:text-bone"}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
