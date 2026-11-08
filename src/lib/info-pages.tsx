import { siteConfig } from "./config";
import Link from "next/link";
import { formatCOP } from "./format";
import { legal } from "./legal";

export type InfoPage = { title: string; eyebrow: string; description: string; sections: { h: string; p: React.ReactNode }[] };

const s = siteConfig;

/**
 * Help pages (/info/*). Legal documents live in their own routes
 * (/politica-de-privacidad, /terminos-y-condiciones, /cambios-y-devoluciones,
 * /politica-de-cookies, /informacion-legal).
 */
export const infoPages: Record<string, InfoPage> = {
  faq: {
    eyebrow: "AYUDA",
    title: "Preguntas frecuentes",
    description: "Resolvemos las dudas más comunes sobre pedidos, tallas, pagos y envíos.",
    sections: [
      { h: "¿Cómo compro?", p: "Agrega productos a tu bolsa, completa tus datos en el checkout y genera el pedido. Luego lo envías por WhatsApp con un clic y un asesor lo confirma." },
      { h: "¿Cómo pago?", p: "En la web no se cobra nada. Al confirmar tu pedido por WhatsApp un asesor te comparte los medios de pago disponibles por canales oficiales. Nunca te pediremos claves ni códigos por chat." },
      { h: "¿Puedo cambiar o devolver?", p: <>Sí. Consulta la <Link className="underline" href="/cambios-y-devoluciones">política de cambios y devoluciones</Link>: cambios por talla, derecho de retracto, garantía legal y reversión del pago.</> },
      { h: "¿Cómo sé mi talla?", p: "Cada producto indica su fit (regular, oversized, boxy). Si tienes dudas, escríbenos por WhatsApp con tu estatura y peso y te recomendamos la talla ideal." },
      { h: "¿Los productos están disponibles?", p: "El stock se muestra por talla. Antes de cobrar siempre confirmamos disponibilidad contigo." },
      { h: "¿Hacen envíos a toda Colombia?", p: `Sí. Entregamos en ${s.shipping.eta} a ciudades principales; municipios lejanos pueden tardar un poco más.` },
    ],
  },
  envios: {
    eyebrow: "AYUDA",
    title: "Envíos",
    description: "Tiempos, costos y cobertura de envíos de THEFATTEST.",
    sections: [
      { h: "Cobertura", p: "Enviamos a todo el territorio colombiano con transportadoras aliadas." },
      { h: "Tiempos", p: `${s.shipping.eta} después de confirmado el pago. Pedidos confirmados después de las 3:00 p. m. salen al siguiente día hábil.` },
      { h: "Costo", p: `Envío gratis en compras desde ${formatCOP(s.shipping.freeFrom)}. Para compras menores, tarifa fija de ${formatCOP(s.shipping.flatRate)}.` },
      { h: "Seguimiento", p: "Te enviamos el número de guía por WhatsApp para que sigas tu paquete." },
    ],
  },
  contacto: {
    eyebrow: "AYUDA",
    title: "Contacto",
    description: "Habla con THEFATTEST por WhatsApp, Instagram o correo.",
    sections: [
      { h: "WhatsApp", p: s.whatsappNumber ? `Escríbenos al +${s.whatsappNumber} o usa el botón verde en cualquier página.` : "Usa el botón verde de WhatsApp en cualquier página (número en configuración)." },
      { h: "Instagram", p: <>Síguenos y escríbenos por DM en <a className="underline" href={s.instagramUrl} target="_blank" rel="noopener noreferrer">{s.instagramHandle}</a>.</> },
      ...(s.contactEmail ? [{ h: "Correo", p: <a className="underline" href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a> }] : []),
      { h: "Horario", p: legal.hours ?? "Respondemos lo más rápido posible." },
      { h: "Datos personales", p: <>Para consultas, reclamos o eliminación de tus datos sigue el procedimiento de la <Link className="underline" href="/politica-de-privacidad#procedimiento">Política de privacidad</Link>.</> },
      { h: "Vendedor", p: <>Datos de identificación del vendedor en <Link className="underline" href="/informacion-legal">Información del vendedor</Link>.</> },
    ],
  },
};
