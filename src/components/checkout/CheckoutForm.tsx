"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { computeCart } from "@/lib/cart-math";
import { formatCOP, cn } from "@/lib/format";
import { departamentos } from "@/lib/colombia";
import { createOrder, type Customer } from "@/lib/orders";
import { useMounted } from "@/lib/use-mounted";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { useI18n } from "@/lib/i18n";

const empty: Customer = { fullName: "", phone: "", email: "", department: "", city: "", address: "", notes: "" };
type Errors = Partial<Record<keyof Customer | "terms", string>>;

function validate(c: Customer, terms: boolean): Errors {
  const e: Errors = {};
  if (c.fullName.trim().split(/\s+/).length < 2) e.fullName = "co.eName";
  const digits = c.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 12) e.phone = "co.ePhone";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.email = "co.eEmail";
  if (!c.department) e.department = "co.eDept";
  if (c.city.trim().length < 2) e.city = "co.eCity";
  if (c.address.trim().length < 6) e.address = "co.eAddress";
  if (!terms) e.terms = "co.eTerms";
  return e;
}

const PAYMENTS = [
  { id: "whatsapp", label: "co.payWa", desc: "co.payWaD", enabled: true },
  { id: "mercadopago", label: "Mercado Pago", desc: "co.soon", enabled: false },
  { id: "wompi", label: "Wompi (PSE, Nequi)", desc: "co.soon", enabled: false },
  { id: "payu", label: "PayU", desc: "co.soon", enabled: false },
];

export function CheckoutForm() {
  const mounted = useMounted();
  const { t: tr, pName, color: colorName, size: sizeName } = useI18n();
  const router = useRouter();
  const { items, coupon, clear } = useCart();
  const t = computeCart(items, coupon);
  const [c, setC] = useState<Customer>(empty);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!mounted) return <div className="min-h-[70vh]" />;

  if (t.lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-7xl text-white/15">{tr("co.emptyT")}</p>
        <p className="mt-4 text-ash">{tr("co.emptyS")}</p>
        <Link href="/shop" className="mt-8 bg-bone px-8 py-4 text-xs font-bold tracking-[0.25em] text-ink hover:bg-acid">{tr("co.goShop")}</Link>
      </div>
    );
  }

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setC((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(c, terms);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await createOrder({ ...c, fullName: c.fullName.trim(), email: c.email.trim().toLowerCase() }, t, coupon);
      clear();
      router.replace(`/checkout/confirmacion?pedido=${encodeURIComponent(order.code)}`);
    } catch (err) {
      setSubmitError(err instanceof Error && err.message ? err.message : tr("co.fail"));
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-10">
      <p className="font-mono text-[11px] tracking-[0.3em] text-ash">{tr("co.eyebrow")}</p>
      <h1 className="mt-2 font-display text-[clamp(48px,9vw,112px)] uppercase leading-[0.85] tracking-tight">{tr("co.t1")} <span className="text-outline">{tr("co.t2")}</span></h1>

      <form onSubmit={submit} noValidate className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 space-y-10 lg:col-span-7">
          <Section n="01" title={tr("co.s1")}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="fullName" label={tr("co.name")} error={errors.fullName && tr(errors.fullName)} className="sm:col-span-2">
                <input id="f-fullName" autoComplete="name" value={c.fullName} onChange={set("fullName")} className={input(errors.fullName)} />
              </Field>
              <Field id="phone" label={tr("co.phone")} error={errors.phone && tr(errors.phone)}>
                <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="300 123 4567" value={c.phone} onChange={set("phone")} className={input(errors.phone)} />
              </Field>
              <Field id="email" label={tr("co.email")} error={errors.email && tr(errors.email)}>
                <input id="f-email" type="email" autoComplete="email" value={c.email} onChange={set("email")} className={input(errors.email)} />
              </Field>
            </div>
          </Section>

          <Section n="02" title={tr("co.s2")}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="department" label={tr("co.dept")} error={errors.department && tr(errors.department)}>
                <select id="f-department" autoComplete="address-level1" value={c.department} onChange={set("department")} className={input(errors.department)}>
                  <option value="">{tr("co.choose")}</option>
                  {departamentos.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field id="city" label={tr("co.city")} error={errors.city && tr(errors.city)}>
                <input id="f-city" autoComplete="address-level2" value={c.city} onChange={set("city")} className={input(errors.city)} />
              </Field>
              <Field id="address" label={tr("co.address")} error={errors.address && tr(errors.address)} className="sm:col-span-2">
                <input id="f-address" autoComplete="street-address" placeholder={tr("co.addressPh")} value={c.address} onChange={set("address")} className={input(errors.address)} />
              </Field>
              <Field id="notes" label={tr("co.notes")} className="sm:col-span-2">
                <textarea id="f-notes" rows={3} placeholder={tr("co.notesPh")} value={c.notes} onChange={set("notes")} className={cn(input(), "h-auto py-3")} />
              </Field>
            </div>
          </Section>

          <Section n="03" title={tr("co.s3")}>
            <div className="space-y-2" role="radiogroup" aria-label={tr("co.payAria")}>
              {PAYMENTS.map((p) => (
                <div key={p.id} role="radio" aria-checked={p.id === "whatsapp"} aria-disabled={!p.enabled} className={cn("flex items-start gap-3 border p-4", p.enabled ? "border-acid bg-acid/5" : "border-white/10 opacity-50")}>
                  <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border", p.enabled ? "border-acid" : "border-white/30")}>
                    {p.enabled && <span className="size-2 rounded-full bg-acid" />}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {p.id === "whatsapp" && <WhatsAppIcon className="size-4 text-[#25D366]" />} {p.label.startsWith("co.") ? tr(p.label) : p.label}
                    </p>
                    <p className="mt-0.5 text-xs text-ash">{tr(p.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ash">{tr("co.noCharge")}</p>
          </Section>
        </div>

        {/* Summary */}
        <aside className="min-w-0 lg:col-span-5">
          <div className="border border-white/10 bg-cement/40 p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-3xl leading-none">{tr("co.summary")}</h2>
            <ul className="mt-5 max-h-72 divide-y divide-white/10 overflow-y-auto">
              {t.lines.map((l) => (
                <li key={l.key} className="flex gap-3 py-3">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cement">
                    <Image src={l.product.images[l.product.colors.find((x) => x.name === l.color)?.image ?? 0]} alt="" fill sizes="64px" className="object-cover" />
                    <span className="absolute right-0 top-0 grid size-5 place-items-center bg-bone font-mono text-[10px] font-bold text-ink">{l.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold uppercase">{pName(l.product)}</p>
                    <p className="text-xs text-ash">{tr("co.line", { size: sizeName(l.size), color: colorName(l.color), qty: l.qty })}</p>
                  </div>
                  <p className="font-mono text-sm">{formatCOP(l.lineTotal, false)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-ash"><dt>{tr("cart.subtotal")}</dt><dd className="font-mono">{formatCOP(t.subtotal)}</dd></div>
              {t.couponDiscount > 0 && <div className="flex justify-between text-ash"><dt>{tr("cart.coupon")} {coupon?.code}</dt><dd className="font-mono text-acid">−{formatCOP(t.couponDiscount)}</dd></div>}
              <div className="flex justify-between text-ash"><dt>{tr("cart.shipping")}</dt><dd className="font-mono">{t.shipping === 0 ? tr("cart.freeShip") : formatCOP(t.shipping)}</dd></div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-semibold"><dt>{tr("cart.total")}</dt><dd className="font-mono">{formatCOP(t.total)}</dd></div>
            </dl>

            <label className="mt-5 flex cursor-pointer items-start gap-2 text-xs text-ash">
              <input id="f-terms" type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: undefined })); }} className="mt-0.5 accent-[#C8FF00]" />
              <span>
                {tr("co.accept1")} <a href="/info/terminos" target="_blank" className="underline hover:text-bone">{tr("co.terms")}</a> {tr("co.accept2")}{" "}
                <a href="/info/privacidad" target="_blank" className="underline hover:text-bone">{tr("co.privacy")}</a> {tr("co.law")}
              </span>
            </label>
            {errors.terms && <p className="mt-1 text-xs text-danger">{tr(errors.terms)}</p>}

            {submitError && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-danger"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {submitError}</p>
            )}

            <button type="submit" disabled={submitting} className="mt-5 flex h-14 w-full items-center justify-center gap-2 bg-acid text-xs font-bold tracking-[0.25em] text-ink transition hover:brightness-110 disabled:opacity-60">
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
              {submitting ? tr("co.submitting") : tr("co.submit")}
            </button>
            <p className="mt-3 text-center text-[11px] text-ash">{tr("co.next")}</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

const input = (err?: string) =>
  cn("h-12 w-full border bg-transparent px-3 text-base text-bone placeholder:text-white/25 focus:outline-none sm:text-sm", err ? "border-danger" : "border-white/15 focus:border-bone");

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 flex items-baseline gap-3 border-b border-white/10 pb-3">
        <span className="font-mono text-xs text-acid">{n}</span>
        <span className="text-sm font-semibold uppercase tracking-[0.15em]">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Field({ id, label, error, className, children }: { id: string; label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={`f-${id}`} className="mb-1.5 block text-xs text-ash">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
