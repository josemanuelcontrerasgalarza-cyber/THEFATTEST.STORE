import { trackers } from "./legal";
import type { ConsentCategory } from "./consent";

/**
 * Real inventory of cookies / browser storage used by the site.
 * It is generated from the actual configuration: analytics and marketing tools
 * only appear when their env var is set (and even then load only after consent).
 * Keep this list in sync with the code — it feeds the banner, the preferences
 * panel and the cookie policy.
 */
export type StorageItem = { name: string; type: "Almacenamiento local" | "Cookie"; provider: string; purpose: string; duration: string };

export const cookieInventory: Record<ConsentCategory, StorageItem[]> = {
  necessary: [
    { name: "tf-consent", type: "Almacenamiento local", provider: "THEFATTEST (propia)", purpose: "Guarda tu elección de cookies: categorías, fecha y versión de la política.", duration: "Hasta que la cambies, borres los datos del navegador o actualicemos la política" },
    { name: "thefattest-cart", type: "Almacenamiento local", provider: "THEFATTEST (propia)", purpose: "Recuerda los productos de tu bolsa y el cupón aplicado.", duration: "Hasta que vacíes la bolsa o borres los datos del navegador" },
    { name: "thefattest-orders", type: "Almacenamiento local", provider: "THEFATTEST (propia)", purpose: "Copia en tu dispositivo de los pedidos que generas (incluye los datos de entrega que escribiste) para verlos en “Mis pedidos” y reenviarlos por WhatsApp. Puedes borrarla desde “Mis pedidos”.", duration: "Hasta que la borres" },
  ],
  preferences: [
    { name: "thefattest-lang", type: "Almacenamiento local", provider: "THEFATTEST (propia)", purpose: "Recuerda el idioma elegido (español / inglés) entre visitas. Sin este permiso el idioma se mantiene solo durante la visita.", duration: "Hasta que retires el consentimiento o borres los datos del navegador" },
  ],
  analytics: trackers.gaId
    ? [
        { name: "_ga", type: "Cookie", provider: "Google Analytics (Google LLC)", purpose: "Distingue visitantes de forma estadística.", duration: "2 años" },
        { name: `_ga_${trackers.gaId.replace(/^G-/, "")}`, type: "Cookie", provider: "Google Analytics (Google LLC)", purpose: "Mantiene el estado de la sesión de medición.", duration: "2 años" },
      ]
    : [],
  marketing: trackers.metaPixelId
    ? [{ name: "_fbp", type: "Cookie", provider: "Meta Platforms (píxel de Meta)", purpose: "Mide la efectividad de campañas en Facebook / Instagram y permite publicidad personalizada.", duration: "3 meses" }]
    : [],
};
