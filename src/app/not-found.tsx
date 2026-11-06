"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4 sm:px-6">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ash">ERROR 404</p>
      <h1 className="mt-2 font-display text-[clamp(72px,16vw,200px)] uppercase leading-[0.82]">{t("nf.title")}<span className="text-acid">.</span></h1>
      <p className="mt-6 text-ash">{t("nf.text")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/shop" className="bg-bone px-6 py-3 text-xs font-bold tracking-[0.2em] text-ink hover:bg-acid">{t("nf.shop")}</Link>
        <Link href="/" className="border border-white/30 px-6 py-3 text-xs font-bold tracking-[0.2em] hover:border-bone">{t("nf.home")}</Link>
      </div>
    </div>
  );
}
