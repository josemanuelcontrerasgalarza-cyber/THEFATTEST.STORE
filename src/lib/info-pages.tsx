import { siteConfig } from "./config";
import { formatCOP } from "./format";

export type InfoPage = { title: string; eyebrow: string; description: string; sections: { h: string; p: React.ReactNode }[] };

const s = siteConfig;

/**
 * Base texts for policies. They are a sensible starting point for a Colombian
 * online store but should be reviewed by the owner (and ideally a lawyer)
 * before launch — especially privacy (Ley 1581/2012) and consumer rights (Ley 1480/2011).
 */
export const infoPages: Record<string, InfoPage> = {
  faq: {
    eyebrow: "AYUDA",
    title: "Preguntas frecuentes",
    description: "Resolvemos las dudas más comunes sobre pedidos, tallas, pagos y envíos.",
    sections: [
      { h: "¿Cómo compro?", p: "Agrega productos a tu bolsa, completa tus datos en el checkout y genera el pedido. Luego lo envías por WhatsApp con un clic y un asesor lo confirma." },
      { h: "¿Cómo pago?", p: "Al confirmar tu pedido por WhatsApp te compartimos los medios de pago disponibles (transferencia, Nequi, Daviplata o link de pago). Pronto tendremos pago en línea con Wompi, Mercado Pago y PayU." },
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
  cambios: {
    eyebrow: "AYUDA",
    title: "Cambios y devoluciones",
    description: "Política de cambios y devoluciones de THEFATTEST.",
    sections: [
      { h: "Plazo", p: `Tienes ${s.returnsDays} días calendario desde que recibes tu pedido para solicitar un cambio.` },
      { h: "Condiciones", p: "La prenda debe estar sin uso, sin lavar, con etiquetas y en su empaque original. Perfumería, joyería y ropa interior solo tienen cambio por defecto de fábrica." },
      { h: "¿Cómo solicito un cambio?", p: "Escríbenos por WhatsApp con tu código de pedido (TF-…) y el motivo. Te indicamos cómo enviar la prenda." },
      { h: "Costos", p: "Si el cambio es por defecto de fábrica o error nuestro, asumimos el envío. Si es por talla o gusto, el envío corre por cuenta del cliente." },
      { h: "Derecho de retracto y garantía", p: "Respetamos el derecho de retracto (5 días hábiles para compras a distancia) y la garantía legal según el Estatuto del Consumidor (Ley 1480 de 2011)." },
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
      { h: "Horario", p: "Lunes a sábado. Respondemos lo más rápido posible." },
    ],
  },
  privacidad: {
    eyebrow: "LEGAL",
    title: "Política de privacidad",
    description: "Cómo THEFATTEST trata tus datos personales.",
    sections: [
      { h: "Responsable", p: `${s.domain} es responsable del tratamiento de los datos que nos entregas al comprar o suscribirte.` },
      { h: "Datos que recolectamos", p: "Nombre, teléfono, correo, dirección de entrega y los productos de tu pedido." },
      { h: "Finalidad", p: "Procesar y entregar tus pedidos, contactarte para confirmarlos, atender garantías y, si lo autorizas, enviarte novedades y lanzamientos." },
      { h: "Tus derechos", p: "Conforme a la Ley 1581 de 2012 puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, o revocar la autorización, escribiéndonos por nuestros canales de contacto." },
      { h: "Almacenamiento", p: "Tu carrito y pedidos se guardan en tu navegador; si la tienda tiene base de datos conectada, también en servidores con acceso restringido. No vendemos tus datos." },
    ],
  },
  terminos: {
    eyebrow: "LEGAL",
    title: "Términos y condiciones",
    description: "Condiciones de uso y compra en THEFATTEST.STORE.",
    sections: [
      { h: "Pedidos", p: "Generar un pedido en la web no constituye un cobro. El pedido se confirma cuando validamos disponibilidad contigo y recibimos el pago." },
      { h: "Precios", p: "Los precios están en pesos colombianos (COP) e incluyen IVA cuando aplica. Algunos precios pueden ser referenciales y se confirman antes del pago." },
      { h: "Disponibilidad", p: "El stock puede variar. Si un producto se agota después de tu pedido, te ofrecemos cambio o devolución total del dinero." },
      { h: "Productos de demostración", p: "Los artículos marcados como DEMO son ejemplos ilustrativos y no están a la venta." },
      { h: "Ley aplicable", p: "Estos términos se rigen por las leyes de la República de Colombia." },
    ],
  },
};
