import type { Metadata } from "next";
import { A, LegalDocument, UL } from "@/components/legal/LegalDocument";
import { legal, legalRoutes, POLICY, waDisplay } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  description: "Cambios, devoluciones, garantía legal, derecho de retracto y reversión del pago en THEFATTEST (Ley 1480 de 2011).",
  alternates: { canonical: legalRoutes.returns },
};

export default function ReturnsPage() {
  const wa = legal.whatsapp ? waDisplay(legal.whatsapp) : null;
  const channels = (
    <>
      WhatsApp {wa ?? ""} · Instagram {legal.instagram}
      {legal.email ? <> · {legal.email}</> : null}
    </>
  );
  const sections = [
    {
      id: "solicitar",
      h: "Cómo solicitar un cambio, devolución o garantía",
      body: (
        <>
          <p>Escríbenos por cualquiera de nuestros canales ({channels}) con:</p>
          <UL items={["Tu código de pedido (TF-…) o el nombre y teléfono usados en la compra.", "El producto y el motivo (talla, retracto, defecto, producto distinto al pedido, etc.).", "Fotos del producto cuando se trate de un defecto o daño."]} />
          <p>Te responderemos con las instrucciones para el envío o la entrega del producto y el número de radicado de tu solicitud.</p>
          {legal.whatsapp && (
            <p>
              <A href={`https://wa.me/${legal.whatsapp}?text=${encodeURIComponent("Hola THEFATTEST. Quiero solicitar un cambio / devolución / garantía.\nCódigo de pedido:\nProducto y talla:\nMotivo:")}`}>Iniciar solicitud por WhatsApp</A>
            </p>
          )}
        </>
      ),
    },
    {
      id: "cambios",
      h: "Cambios por talla o referencia",
      body: (
        <>
          <p>Como política comercial adicional a la ley, puedes solicitar el cambio por otra talla o referencia dentro de los {legal.exchangeDays} días calendario siguientes a la entrega, sujeto a disponibilidad.</p>
          <UL items={["La prenda debe estar sin uso, sin lavar, con sus etiquetas y en su empaque original.", "Los costos de envío de un cambio por talla o gusto corren por cuenta del cliente.", "Si la nueva referencia tiene un precio mayor, pagas la diferencia; si es menor, te la reconocemos como saldo a favor o te la devolvemos, según prefieras."]} />
        </>
      ),
    },
    {
      id: "retracto",
      h: "Derecho de retracto",
      body: (
        <>
          <p>Por tratarse de una venta a distancia, puedes ejercer el derecho de retracto previsto en el artículo 47 de la Ley 1480 de 2011 dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la entrega del producto, sin necesidad de justificar tu decisión.</p>
          <UL
            items={[
              "Debes devolver el producto por los mismos medios y en las mismas condiciones en que lo recibiste.",
              "Los costos de transporte y demás que conlleve la devolución corren por tu cuenta.",
              "Te devolveremos en dinero la totalidad de lo pagado, sin descuentos ni retenciones, a más tardar dentro de los treinta (30) días calendario siguientes al ejercicio del derecho.",
              "No aplica en los casos exceptuados por la ley, por ejemplo bienes confeccionados conforme a especificaciones del consumidor o claramente personalizados.",
            ]}
          />
        </>
      ),
    },
    {
      id: "defectuosos",
      h: "Productos defectuosos o distintos a lo pedido",
      body: (
        <p>
          Si recibes un producto con defectos de fabricación, dañado en el transporte o distinto al que pediste, escríbenos lo antes posible con fotos. En estos casos asumimos los costos de envío y te ofrecemos la reparación, el cambio por un producto igual o la devolución del dinero, según corresponda conforme a la garantía legal.
        </p>
      ),
    },
    {
      id: "garantia",
      h: "Garantía legal",
      body: (
        <>
          <p>Todos nuestros productos tienen garantía legal de calidad, idoneidad y seguridad (artículos 7 y siguientes de la Ley 1480 de 2011). El término de la garantía es el indicado para cada producto; si no se indica, aplica el término supletorio del artículo 8 de esa ley, que para productos nuevos es de un (1) año contado desde la entrega.</p>
          <UL
            items={[
              "Puedes reclamarla presentando la solicitud por nuestros canales; no es necesario conservar la factura si puedes acreditar la compra por otro medio (por ejemplo, el código del pedido).",
              "Daremos respuesta dentro de los quince (15) días hábiles siguientes a la solicitud, conforme al Decreto 735 de 2013 (compilado en el Decreto 1074 de 2015).",
              "La garantía se hace efectiva mediante reparación, cambio del producto o devolución del dinero, en los términos de la ley. Si la falla se repite, puedes pedir el cambio o la devolución.",
              "No cubre daños causados por uso indebido, lavado o cuidado contrario a las instrucciones, fuerza mayor o hechos de terceros, conforme al artículo 16 de la Ley 1480 de 2011.",
            ]}
          />
        </>
      ),
    },
    {
      id: "reversion",
      h: "Reversión del pago",
      body: (
        <>
          <p>Cuando hayas pagado con tarjeta de crédito, tarjeta débito o cualquier otro instrumento de pago electrónico, puedes solicitar la reversión del pago (artículo 51 de la Ley 1480 de 2011 y Decreto 587 de 2016) si:</p>
          <UL items={["Fuiste objeto de fraude.", "Se trató de una operación no solicitada.", "El producto no fue recibido.", "El producto entregado no corresponde a lo solicitado o es defectuoso."]} />
          <p>Debes presentar la queja ante nosotros y, al mismo tiempo, notificar al emisor del instrumento de pago, dentro de los cinco (5) días hábiles siguientes a la fecha en que tuviste noticia de la situación. Si el motivo es que el producto no corresponde o es defectuoso, debes devolverlo en las mismas condiciones en que lo recibiste. La reversión no aplica a pagos hechos por medios que no son instrumentos de pago electrónico (por ejemplo, efectivo).</p>
        </>
      ),
    },
    {
      id: "reembolsos",
      h: "Devolución del dinero",
      body: <p>Cuando proceda una devolución de dinero, la haremos por el mismo medio de pago utilizado o por el medio que acordemos contigo, dentro de los plazos legales aplicables.</p>,
    },
    {
      id: "tiempos",
      h: "Tiempos y canales de atención",
      body: (
        <>
          <p>Canales: {channels}.{legal.hours ? ` Horario: ${legal.hours}.` : ""}</p>
          <p>Respondemos cada solicitud lo más pronto posible y siempre dentro de los plazos legales. Si no estás conforme con nuestra respuesta, puedes acudir a la Superintendencia de Industria y Comercio (<A href="https://www.sic.gov.co">sic.gov.co</A>).</p>
          <p className="text-sm text-ash">Versión {POLICY.returns}, vigente desde el {POLICY.updatedLabel}. Esta política hace parte de los <A href={legalRoutes.terms}>Términos y condiciones</A>.</p>
        </>
      ),
    },
  ];

  return (
    <LegalDocument
      path={legalRoutes.returns}
      eyebrow="LEGAL — LEY 1480 DE 2011"
      title="Cambios y devoluciones"
      version={POLICY.returns}
      intro={<p>Queremos que estés feliz con tu compra. Aquí explicamos cómo funcionan los cambios, el derecho de retracto, la garantía legal y la reversión del pago.</p>}
      sections={sections}
    />
  );
}
