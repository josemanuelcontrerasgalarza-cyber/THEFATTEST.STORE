"use client";

import { create } from "zustand";
import { POLICY } from "./legal";
import { getSupabase } from "./supabase";

/**
 * Cookie / local-storage consent manager.
 *
 * - Nothing non-essential runs until the visitor chooses (see ConsentScripts).
 * - The choice is stored on the device (key below) with date, policy version and
 *   categories, and an anonymous copy is logged in Supabase as evidence
 *   (random device id, no IP, no personal data).
 * - Bumping POLICY.cookies asks everyone again.
 */
export type ConsentCategory = "necessary" | "analytics" | "marketing" | "preferences";
export type ConsentChoices = Record<ConsentCategory, boolean>;
export type ConsentRecord = {
  id: string;
  version: string;
  date: string;
  method: "accept_all" | "reject_all" | "custom";
  choices: ConsentChoices;
};

export const CONSENT_KEY = "tf-consent";
export const LANG_KEY = "thefattest-lang";

/** Storage keys / cookies set by each optional category, removed on withdrawal. */
const CATEGORY_STORAGE: Record<Exclude<ConsentCategory, "necessary">, { local: string[]; cookiePrefixes: string[] }> = {
  preferences: { local: [LANG_KEY], cookiePrefixes: [] },
  analytics: { local: [], cookiePrefixes: ["_ga", "_gid", "_gat"] },
  marketing: { local: [], cookiePrefixes: ["_fbp", "_fbc", "fr"] },
};

const NONE: ConsentChoices = { necessary: true, analytics: false, marketing: false, preferences: false };
const ALL: ConsentChoices = { necessary: true, analytics: true, marketing: true, preferences: true };

export function readConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as ConsentRecord;
    if (r.version !== POLICY.cookies || !r.choices) return null; // policy changed → ask again
    return { ...r, choices: { ...NONE, ...r.choices, necessary: true } };
  } catch {
    return null;
  }
}

/** Synchronous check usable outside React (e.g. before writing a preference). */
export function hasConsent(cat: ConsentCategory): boolean {
  if (cat === "necessary") return true;
  return readConsent()?.choices[cat] === true;
}

function clearCategory(cat: Exclude<ConsentCategory, "necessary">) {
  const { local, cookiePrefixes } = CATEGORY_STORAGE[cat];
  try {
    local.forEach((k) => localStorage.removeItem(k));
  } catch {}
  if (!cookiePrefixes.length) return;
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0]?.trim();
    if (!name || !cookiePrefixes.some((p) => name === p || name.startsWith(`${p}_`))) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}

function deviceId(prev?: string | null) {
  if (prev) return prev;
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function logConsent(r: ConsentRecord) {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.rpc("log_cookie_consent", { p_device: r.id, p_version: r.version, p_method: r.method, p_choices: r.choices });
  } catch {
    /* evidence is also kept on the device; never block the visitor */
  }
}

type ConsentState = {
  /** null = not decided yet (or not hydrated). */
  record: ConsentRecord | null;
  hydrated: boolean;
  panelOpen: boolean;
  hydrate: () => void;
  save: (choices: Partial<ConsentChoices>, method: ConsentRecord["method"]) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openPanel: () => void;
  closePanel: () => void;
};

export const useConsent = create<ConsentState>()((set, get) => ({
  record: null,
  hydrated: false,
  panelOpen: false,
  hydrate: () => set({ record: readConsent(), hydrated: true }),
  save: (choices, method) => {
    const prev = get().record;
    const next: ConsentRecord = {
      id: deviceId(prev?.id ?? safeOldId()),
      version: POLICY.cookies,
      date: new Date().toISOString(),
      method,
      choices: { ...NONE, ...choices, necessary: true },
    };
    // Withdrawals: remove whatever the category had stored.
    (["preferences", "analytics", "marketing"] as const).forEach((c) => {
      if (!next.choices[c]) clearCategory(c);
    });
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
    } catch {}
    const hadScripts = prev && ((prev.choices.analytics && !next.choices.analytics) || (prev.choices.marketing && !next.choices.marketing));
    set({ record: next, panelOpen: false });
    void logConsent(next);
    window.dispatchEvent(new CustomEvent("tf-consent", { detail: next }));
    // Already-loaded third-party scripts can't be unloaded: reload so they're gone.
    if (hadScripts) setTimeout(() => location.reload(), 150);
  },
  acceptAll: () => get().save(ALL, "accept_all"),
  rejectAll: () => get().save(NONE, "reject_all"),
  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
}));

function safeOldId(): string | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as ConsentRecord).id ?? null : null;
  } catch {
    return null;
  }
}
