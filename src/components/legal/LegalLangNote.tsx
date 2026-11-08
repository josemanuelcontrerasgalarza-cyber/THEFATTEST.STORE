"use client";

import { useI18n } from "@/lib/i18n";

/** In English mode, explains that legal documents are published in Spanish. */
export function LegalLangNote() {
  const { lang, t } = useI18n();
  if (lang !== "en") return null;
  return <p className="mt-4 max-w-3xl border-l-2 border-acid pl-3 text-sm text-ash">{t("legal.spanishOnly")}</p>;
}
