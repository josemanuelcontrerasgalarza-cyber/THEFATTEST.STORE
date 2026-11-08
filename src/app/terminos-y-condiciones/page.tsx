import type { Metadata } from "next";
import { A, LegalDocument, UL, Val } from "@/components/legal/LegalDocument";
import { legal, legalRoutes, POLICY, waDisplay } from "@/lib/legal";
import { siteConfig } from "@/lib/config";
import { formatCOP } from "@/lib/format";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso y de compra en THEFATTEST.STORE.",
  alternates: { canonical: legalRoutes.terms },
};

export default function TermsPage() {
  const s = siteConfig.shipping;
  const sections = [
    {
      id: "generales",
      h: "Condiciones generales de uso",
      body: (
        <>
          <p>
            Estos términos regulan el uso de {siteConfig.domain} y las compras realizadas a través del sitio y sus canales de atención. El sitio es operado por{" "}
            <Val v={legal.sellerName} label="nombre o razón social" /> ({legal.sellerIdType} <Val v={legal.sellerId} label="identificación" />), en adelante “THEFATTEST”. Ver <A href={legalRoutes.seller}>Información del vendedor</A>.
          </p>
          <p>Al navegar o comprar aceptas estos términos. Te comprometes a usar el sitio de forma lícita, a suministrar información veraz y a no realizar actividades que afecten su funcionamiento o seguridad (por ejemplo, pedidos falsos, envío automatizado de formularios o intentos de acceso no autorizado).</p>
        </>
      ),
    },
    {
      id: "productos",
      h: "Descripción de productos",
      body: (
        <>
          <p>Cada producto se publica con su nombre, fotografías, descripción, colores, tallas disponibles y precio. Las fotografías son de las prendas reales que vendemos; los colores pueden variar levemente según la pantalla.</p>
          <p>Si tienes dudas sobre talla, materiales o estado de un producto, pregúntanos por WhatsApp antes de confirmar tu compra.</p>
        </>
      ),
    },
    {
      id: "precios",
      h: "Precios y disponibilidad",
      body: (
        <>
          <p>Los precios se expresan en pesos colombianos (COP) y corresponden al precio total que pagas por el producto, incluidos los impuestos aplicables. El costo de envío se muestra por separado antes de generar el pedido.</p>
          <p>La disponibilidad por talla se muestra en cada producto y se valida al generar el pedido. Si después de tu pedido un producto se agota o hay un error evidente en el precio publicado, te lo informaremos antes de cobrar y podrás elegir otro producto o desistir del pedido sin costo; si ya pagaste, te devolveremos el 100 % del dinero.</p>
          <p>Las promociones y cupones aplican según las condiciones publicadas (vigencia, mínimo de compra y unidades) y no son acumulables salvo que se indique lo contrario.</p>
        </>
      ),
    },
    {
      id: "compra",
      h: "Proceso de compra",
      body: (
        <UL
          items={[
            "Eliges producto, color, talla y cantidad, y lo añades a tu bolsa.",
            "En el checkout ingresas tus datos de contacto y entrega, aceptas estos términos y autorizas el tratamiento de tus datos.",
            "El sitio genera un pedido con código (TF-…) en estado “pendiente”. En este paso no se realiza ningún cobro.",
            "Envías el pedido por WhatsApp; un asesor confirma disponibilidad, valor total y medios de pago.",
            "El contrato se perfecciona cuando confirmamos el pedido y recibimos el pago. Te enviamos la confirmación y, al despachar, el número de guía.",
          ]}
        />
      ),
    },
    {
      id: "pagos",
      h: "Métodos de pago",
      body: (
        <p>
          Actualmente el pago no se realiza en el sitio web. Los medios de pago disponibles se informan al confirmar el pedido por WhatsApp, a través de canales oficiales de la tienda. Nunca te pediremos claves, códigos de verificación ni datos completos de tarjetas por chat. Si en el futuro habilitamos pagos en línea, lo informaremos aquí indicando el proveedor.
        </p>
      ),
    },
    {
      id: "envios",
      h: "Envíos y entregas",
      body: (
        <>
          <p>Enviamos a todo el territorio colombiano con empresas transportadoras. El tiempo estimado de entrega es de {s.eta} después de confirmado el pago; algunos municipios pueden tardar más. Envío gratis en compras desde {formatCOP(s.freeFrom)}; para compras menores, tarifa fija de {formatCOP(s.flatRate)}.</p>
          <p>Revisa el paquete al recibirlo. Si llega abierto o con daños visibles, déjalo anotado con la transportadora y escríbenos de inmediato. Más detalles en <A href="/info/envios">Envíos</A>.</p>
        </>
      ),
    },
    {
      id: "cambios",
      h: "Cambios y devoluciones",
      body: (
        <p>
          Los cambios, devoluciones, el derecho de retracto y la reversión del pago se rigen por nuestra <A href={legalRoutes.returns}>Política de cambios y devoluciones</A>, que hace parte de estos términos.
        </p>
      ),
    },
    {
      id: "garantias",
      h: "Garantías legales",
      body: (
        <p>
          Todos los productos cuentan con la garantía legal de calidad, idoneidad y seguridad prevista en la Ley 1480 de 2011 (Estatuto del Consumidor). El procedimiento para hacerla efectiva se describe en la <A href={`${legalRoutes.returns}#garantia`}>Política de cambios y devoluciones</A>.
        </p>
      ),
    },
    {
      id: "responsabilidades",
      h: "Responsabilidades del comprador y del vendedor",
      body: (
        <>
          <p><strong>El comprador</strong> se compromete a suministrar datos veraces y completos, revisar su pedido antes de confirmarlo, estar disponible para recibir el envío en la dirección indicada y usar los productos según su naturaleza.</p>
          <p><strong>THEFATTEST</strong> se compromete a entregar productos que correspondan a lo publicado y confirmado, informar de manera clara precio, costos de envío y tiempos, proteger los datos personales conforme a su <A href={legalRoutes.privacy}>Política de privacidad</A>, atender peticiones, quejas y reclamos, y cumplir con las garantías legales.</p>
        </>
      ),
    },
    {
      id: "propiedad",
      h: "Propiedad intelectual",
      body: (
        <p>
          El nombre y logotipo de THEFATTEST, el diseño del sitio, los textos y las fotografías propias son de titularidad de THEFATTEST o se usan con autorización, y no pueden reproducirse sin permiso previo. Las marcas de terceros que aparecen en algunos productos pertenecen a sus respectivos titulares y se mencionan solo para identificar el producto; su mención no implica patrocinio ni relación comercial con esos titulares.
        </p>
      ),
    },
    {
      id: "limitaciones",
      h: "Limitaciones de responsabilidad",
      body: (
        <p>
          Hacemos esfuerzos razonables para que el sitio esté disponible y la información sea exacta, pero pueden presentarse interrupciones o errores técnicos. THEFATTEST no responde por fallas de conexión del usuario, ni por demoras causadas por fuerza mayor, caso fortuito o hechos de terceros ajenos a su control. Nada de lo aquí dispuesto limita los derechos que la ley otorga a los consumidores ni las responsabilidades que no pueden excluirse según la Ley 1480 de 2011.
        </p>
      ),
    },
    {
      id: "pqr",
      h: "Atención al consumidor (PQR)",
      body: (
        <p>
          Puedes presentar peticiones, quejas o reclamos por WhatsApp {legal.whatsapp ? waDisplay(legal.whatsapp) : ""}, por Instagram {legal.instagram}
          {legal.email ? <> o al correo {legal.email}</> : null}. También puedes acudir a la Superintendencia de Industria y Comercio (<A href="https://www.sic.gov.co">sic.gov.co</A>).
        </p>
      ),
    },
    {
      id: "ley",
      h: "Legislación aplicable",
      body: (
        <p>
          Estos términos se rigen por las leyes de la República de Colombia, en especial la Ley 1480 de 2011, la Ley 527 de 1999 (comercio electrónico) y la Ley 1581 de 2012. Las controversias se resolverán ante las autoridades colombianas competentes, sin perjuicio de las acciones de protección al consumidor ante la Superintendencia de Industria y Comercio. Versión {POLICY.terms}, vigente desde el {POLICY.updatedLabel}.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      path={legalRoutes.terms}
      eyebrow="LEGAL — CONDICIONES DE COMPRA"
      title="Términos y condiciones"
      version={POLICY.terms}
      intro={<p>Lee estas condiciones antes de comprar. Explican cómo funciona la tienda, cómo se confirma un pedido y cuáles son tus derechos y los nuestros.</p>}
      sections={sections}
    />
  );
}
