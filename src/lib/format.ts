const cop = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/** 89900 → "$89.900 COP" */
export function formatCOP(value: number, withCode = true): string {
  return `$${cop.format(Math.round(value))}${withCode ? " COP" : ""}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
