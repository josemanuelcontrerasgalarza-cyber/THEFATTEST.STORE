import { siteConfig } from "./config";

/**
 * Legal / seller information.
 *
 * NOTHING here is invented: every business fact comes from an env var (or from
 * data the owner already gave: WhatsApp, Instagram). Missing values render as
 * "pendiente" so the owner can see what still has to be completed.
 * See docs/LEGAL-PENDIENTES.md.
 */
const env = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const legal = {
  /** Nombre o razón social del vendedor / responsable del tratamiento. */
  sellerName: env(process.env.NEXT_PUBLIC_LEGAL_NAME),
  /** "NIT", "CC", "RUT"… */
  sellerIdType: env(process.env.NEXT_PUBLIC_LEGAL_ID_TYPE) ?? "NIT / CC",
  sellerId: env(process.env.NEXT_PUBLIC_LEGAL_ID),
  address: env(process.env.NEXT_PUBLIC_LEGAL_ADDRESS),
  city: env(process.env.NEXT_PUBLIC_LEGAL_CITY),
  country: "Colombia",
  /** Correo para habeas data (consultas y reclamos). Falls back to the general contact e-mail. */
  privacyEmail: env(process.env.NEXT_PUBLIC_PRIVACY_EMAIL) ?? siteConfig.contactEmail,
  email: siteConfig.contactEmail,
  whatsapp: siteConfig.whatsappNumber,
  instagram: siteConfig.instagramHandle,
  instagramUrl: siteConfig.instagramUrl,
  /** Horario de atención (opcional). */
  hours: env(process.env.NEXT_PUBLIC_SUPPORT_HOURS),
  /** Días de cambio voluntario por talla/gusto (política comercial, adicional a la ley). */
  exchangeDays: siteConfig.returnsDays,
};

/**
 * Policy versions. Bump a version when its text changes materially:
 * - cookies → visitors are asked for consent again;
 * - privacy / terms → new orders and sign-ups record the new version.
 */
export const POLICY = {
  updated: "2026-11-08",
  updatedLabel: "8 de noviembre de 2026",
  privacy: "1.0",
  terms: "1.0",
  cookies: "1.0",
  returns: "1.0",
} as const;

/** Optional third-party tools. They only load if configured AND consented. */
export const trackers = {
  gaId: env(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  metaPixelId: env(process.env.NEXT_PUBLIC_META_PIXEL_ID),
};

export const legalRoutes = {
  privacy: "/politica-de-privacidad",
  terms: "/terminos-y-condiciones",
  cookies: "/politica-de-cookies",
  returns: "/cambios-y-devoluciones",
  seller: "/informacion-legal",
  contact: "/info/contacto",
} as const;

export const waDisplay = (n: string) => (n.length === 12 ? `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`);

/** Exact wording required for the data-processing authorization checkbox. */
export const DATA_AUTH_TEXT = "He leído y autorizo el tratamiento de mis datos personales de acuerdo con la";
