"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "ok"; msg: string } | { kind: "error"; msg: string };

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState({ kind: "error", msg: t("news.badEmail") });
    if (!consent) return setState({ kind: "error", msg: t("news.needConsent") });
    setState({ kind: "loading" });
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("newsletter_subscribers").insert({ email: email.toLowerCase().trim() });
      if (error && error.code !== "23505") return setState({ kind: "error", msg: t("news.fail") });
      setState({ kind: "ok", msg: t("news.ok") });
    } else {
      // No backend configured yet: be honest instead of faking a sign-up.
      try {
        const list = JSON.parse(localStorage.getItem("thefattest-newsletter") ?? "[]") as string[];
        localStorage.setItem("thefattest-newsletter", JSON.stringify(Array.from(new Set([...list, email.toLowerCase().trim()]))));
      } catch {}
      setState({ kind: "ok", msg: t("news.local") });
    }
    setEmail("");
  };

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <label htmlFor="nl-email" className="font-mono text-[11px] tracking-[0.3em] text-ash">{t("news.label")}</label>
      <div className="mt-3 flex border-b border-white/30 focus-within:border-bone">
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="h-12 min-w-0 flex-1 bg-transparent text-base placeholder:text-white/30 focus:outline-none"
        />
        <button disabled={state.kind === "loading"} aria-label={t("a11y.subscribe")} className="grid size-12 place-items-center transition hover:text-acid disabled:opacity-40">
          <ArrowRight className="size-5" />
        </button>
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-ash">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[#C8FF00]" />
        {t("news.consent")} <Link href="/info/privacidad" className="underline hover:text-bone">{t("news.privacy")}</Link>.
      </label>
      {state.kind === "ok" && <p className="mt-2 flex items-start gap-2 text-xs text-acid"><Check className="mt-px size-3.5 shrink-0" /> {state.msg}</p>}
      {state.kind === "error" && <p className="mt-2 text-xs text-danger" role="alert">{state.msg}</p>}
    </form>
  );
}
