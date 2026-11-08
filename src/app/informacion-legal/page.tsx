import type { Metadata } from "next";
import { A, LegalDocument, UL, Val } from "@/components/legal/LegalDocument";
import { legal, legalRoutes, waDisplay } from "@/lib/legal";
import { siteConfig } from "@/lib/config";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = {
  title: "Información del vendedor",
  description: "Datos de identificación del vendedor, precios, entregas y canales de atención al consumidor de THEFATTEST.STORE.",
  alternates: { canonical: legalRoutes.seller },
};

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-white/10 py-3 last:border-0 sm:grid-cols-[220px_1fr] sm:gap-4">
      <dt className="font-mono text-[11px] tracking-[0.15em] text-ash">{k.toUpperCase()}</dt>
      <dd className="text-white/85">{children}</dd>
    </div>
  );
}

export default function SellerPage() {
  const s = siteConfig.shipping;
  const sections = [
    {
      id: "vendedor",
      h: "Identificación del vendedor",
      body: (
        <dl className="border border-white/10 px-4">
          <Row k="Nombre o razón social"><Val v={legal.sellerName} label="nombre o razón social" /></Row>
          <Row k={legal.sellerIdType}><Val v={legal.sellerId} label="número de identificación" /></Row>
          <Row k="Marca comercial">THEFATTEST · {siteConfig.domain}</Row>
          <Row k="Dirección de contacto"><Val v={legal.address} label="dirección" />{legal.city ? `, ${legal.city}` : ""}</Row>
          <Row k="País de operación">{legal.country}</Row>
          <Row k="Correo electrónico">{legal.email ? <A href={`mailto:${legal.email}`}>{legal.email}</A> : <Val label="correo electrónico" />}</Row>
          <Row k="Teléfono / WhatsApp">{legal.whatsapp ? <A href={`https://wa.me/${legal.whatsapp}`}>{waDisplay(legal.whatsapp)}</A> : <Val label="teléfono" />}</Row>
          <Row k="Instagram"><A href={legal.instagramUrl}>{legal.instagram}</A></Row>
          {legal.hours && <Row k="Horario de atención">{legal.hours}</Row>}
        </dl>
      ),
    },
    {
      id: "precios",
      h: "Precios e impuestos",
      body: (
        <UL
          items={[
            "Los precios se publican en pesos colombianos (COP) y son el precio total al consumidor, incluidos los impuestos aplicables.",
            "El costo de envío se informa por separado en la bolsa y en el checkout, antes de generar el pedido.",
            "En el sitio no se realizan cobros: el pago se acuerda al confirmar el pedido por WhatsApp.",
          ]}
        />
      ),
    },
    {
      id: "entrega",
      h: "Información de entrega",
      body: (
        <UL
          items={[
            "Cobertura: todo el territorio colombiano, mediante empresas transportadoras.",
            `Tiempo estimado: ${s.eta} después de confirmado el pago.`,
            `Costo: gratis desde ${formatCOP(s.freeFrom)}; tarifa fija de ${formatCOP(s.flatRate)} para compras menores.`,
            "Recibes el número de guía por WhatsApp para hacer seguimiento.",
          ]}
        />
      ),
    },
    {
      id: "atencion",
      h: "Canales de atención al consumidor",
      body: (
        <>
          <p>Peticiones, quejas, reclamos, cambios, garantías y solicitudes sobre datos personales: WhatsApp {legal.whatsapp ? waDisplay(legal.whatsapp) : ""}, Instagram {legal.instagram}{legal.email ? `, ${legal.email}` : ""}.</p>
          <p>
            Autoridad de protección al consumidor y de datos personales: Superintendencia de Industria y Comercio — <A href="https://www.sic.gov.co">www.sic.gov.co</A>.
          </p>
        </>
      ),
    },
    {
      id: "documentos",
      h: "Documentos legales",
      body: (
        <UL
          items={[
            <A key="p" href={legalRoutes.privacy}>Política de privacidad y tratamiento de datos personales</A>,
            <A key="t" href={legalRoutes.terms}>Términos y condiciones</A>,
            <A key="r" href={legalRoutes.returns}>Cambios y devoluciones</A>,
            <A key="c" href={legalRoutes.cookies}>Política de cookies</A>,
          ]}
        />
      ),
    },
  ];
  return (
    <LegalDocument
      path={legalRoutes.seller}
      eyebrow="LEGAL — INFORMACIÓN AL CONSUMIDOR"
      title="Información del vendedor"
      intro={<p>Información de identificación y contacto del vendedor, de precios y de entregas, a disposición de los consumidores conforme al Estatuto del Consumidor (Ley 1480 de 2011, artículo 50).</p>}
      sections={sections}
    />
  );
}
