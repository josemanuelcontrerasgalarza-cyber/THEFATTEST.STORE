import type { Metadata } from "next";
import { A, LegalDocument, UL, Val } from "@/components/legal/LegalDocument";
import { legal, legalRoutes, POLICY, trackers, waDisplay } from "@/lib/legal";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de privacidad y tratamiento de datos personales",
  description: "Política de Tratamiento de Datos Personales de THEFATTEST conforme a la Ley 1581 de 2012.",
  alternates: { canonical: legalRoutes.privacy },
};

export default function PrivacyPage() {
  const wa = legal.whatsapp ? waDisplay(legal.whatsapp) : undefined;
  const contactLine = (
    <>
      WhatsApp <Val v={wa} label="número de WhatsApp" />
      {" · "}correo <Val v={legal.privacyEmail} label="correo para datos personales" />
    </>
  );
  const sections = [
    {
      id: "responsable",
      h: "Responsable del tratamiento",
      body: (
        <>
          <p>El responsable del tratamiento de los datos personales recolectados a través de {siteConfig.domain} y sus canales de atención es:</p>
          <dl className="grid gap-x-6 gap-y-2 border border-white/10 p-4 text-sm sm:grid-cols-[180px_1fr]">
            <dt className="text-ash">Nombre o razón social</dt><dd><Val v={legal.sellerName} label="nombre o razón social" /></dd>
            <dt className="text-ash">Identificación</dt><dd>{legal.sellerIdType}: <Val v={legal.sellerId} label="número de identificación" /></dd>
            <dt className="text-ash">Domicilio</dt><dd><Val v={legal.address} label="dirección" />{legal.city ? `, ${legal.city}` : ""}, {legal.country}</dd>
            <dt className="text-ash">Canales</dt><dd>{contactLine}</dd>
            <dt className="text-ash">Marca comercial</dt><dd>THEFATTEST · {legal.instagram}</dd>
          </dl>
          <p>Esta política se expide en cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto Único Reglamentario 1074 de 2015) y demás normas que las modifiquen o complementen.</p>
        </>
      ),
    },
    {
      id: "definiciones",
      h: "Definiciones básicas",
      body: (
        <UL
          items={[
            <><strong>Titular:</strong> persona natural cuyos datos personales son objeto de tratamiento (tú).</>,
            <><strong>Dato personal:</strong> cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable.</>,
            <><strong>Tratamiento:</strong> cualquier operación sobre datos personales: recolección, almacenamiento, uso, circulación o supresión.</>,
            <><strong>Autorización:</strong> consentimiento previo, expreso e informado del titular para el tratamiento.</>,
            <><strong>Encargado:</strong> persona que realiza el tratamiento por cuenta del responsable (por ejemplo, un proveedor de hosting).</>,
          ]}
        />
      ),
    },
    {
      id: "datos",
      h: "Datos personales que recopilamos",
      body: (
        <>
          <p>Solo pedimos los datos necesarios para cada finalidad:</p>
          <UL
            items={[
              <><strong>Al generar un pedido:</strong> nombre completo, teléfono / WhatsApp, correo electrónico, departamento, ciudad, dirección de entrega, referencias de entrega (opcional) y los productos, tallas, cantidades y valores del pedido.</>,
              <><strong>Evidencia de autorizaciones:</strong> fecha y hora, versión de la política aceptada y si aceptaste o no recibir comunicaciones comerciales.</>,
              <><strong>Al suscribirte al boletín:</strong> correo electrónico, fecha de la autorización y versión de la política.</>,
              <><strong>Al escribirnos por WhatsApp o Instagram:</strong> los datos que tú decidas compartir en la conversación, tratados también bajo las condiciones de esas plataformas.</>,
              <><strong>Preferencias de cookies:</strong> un identificador aleatorio del dispositivo, la fecha, la versión de la política de cookies y las categorías que aceptaste. No incluye tu nombre, correo ni dirección IP.</>,
            ]}
          />
          <p>No solicitamos datos sensibles (salud, origen étnico, orientación política o sexual, datos biométricos, etc.) ni datos financieros: en esta página no se ingresan datos de tarjetas ni de cuentas bancarias. Tampoco recolectamos intencionalmente datos de menores de 18 años; si eres menor, compra a través de tu representante legal.</p>
        </>
      ),
    },
    {
      id: "finalidades",
      h: "Finalidades del tratamiento",
      body: (
        <>
          <p>Tratamos tus datos para:</p>
          <UL
            items={[
              "Registrar, confirmar, facturar, despachar y entregar tus pedidos.",
              "Contactarte por WhatsApp, llamada o correo sobre el estado de tu pedido, disponibilidad, pagos y entregas.",
              "Atender cambios, devoluciones, derecho de retracto, garantías, peticiones, quejas y reclamos.",
              "Cumplir obligaciones legales, contables, tributarias y de protección al consumidor.",
              "Prevenir fraudes y usos indebidos del sitio y proteger su seguridad.",
              "Solo si lo autorizas de forma separada y opcional: enviarte novedades, lanzamientos y promociones. Negarte no afecta tus compras.",
            ]}
          />
          <p>No vendemos, alquilamos ni cedemos tus datos personales a terceros para sus propios fines comerciales.</p>
        </>
      ),
    },
    {
      id: "almacenamiento",
      h: "Uso, almacenamiento y seguridad",
      body: (
        <>
          <p>Los pedidos y suscripciones se guardan en una base de datos administrada (Supabase) con acceso restringido: las reglas de seguridad a nivel de fila impiden que los visitantes lean datos de otros clientes y solo el personal autorizado de la tienda puede consultarlos. La conexión con el sitio está cifrada (HTTPS).</p>
          <p>Además, tu navegador guarda una copia local de tu bolsa y de los pedidos que generas desde ese dispositivo, para que puedas consultarlos en “Mis pedidos”. Puedes borrar esa copia en cualquier momento desde esa misma página.</p>
          <p>Conservamos los datos de pedidos durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales (por ejemplo, contables y de garantía). Los datos del boletín se conservan hasta que te des de baja. Luego se suprimen o anonimizan, salvo que una norma exija conservarlos.</p>
        </>
      ),
    },
    {
      id: "clientes",
      h: "Tratamiento de datos de clientes",
      body: (
        <>
          <p>Al generar un pedido no se realiza ningún cobro en la web: el pedido queda registrado como “pendiente” y lo confirmas con un asesor por WhatsApp. Los datos del pedido se incluyen en el mensaje de WhatsApp que tú decides enviar.</p>
          <p>Para entregar tu pedido podemos compartir tu nombre, teléfono y dirección con la empresa transportadora que realice el envío, únicamente para esa finalidad.</p>
        </>
      ),
    },
    {
      id: "cookies",
      h: "Uso de cookies",
      body: (
        <p>
          Usamos almacenamiento esencial en tu navegador para que la tienda funcione y, solo con tu consentimiento, almacenamiento de preferencias
          {trackers.gaId || trackers.metaPixelId ? ", analítico y de marketing" : ""}. Puedes aceptar, rechazar o configurar cada categoría y cambiar tu decisión cuando quieras. Consulta la <A href={legalRoutes.cookies}>Política de cookies</A>.
        </p>
      ),
    },
    {
      id: "terceros",
      h: "Terceros y proveedores tecnológicos",
      body: (
        <>
          <p>Para operar la tienda nos apoyamos en estos proveedores, que actúan como encargados o como plataformas independientes:</p>
          <UL
            items={[
              <><strong>Vercel Inc.</strong> (Estados Unidos): alojamiento y entrega del sitio web. Procesa datos técnicos de conexión (como dirección IP) necesarios para servir las páginas.</>,
              <><strong>Supabase Inc.</strong> (servidores en Estados Unidos, región us-east-1): base de datos de pedidos, suscripciones y registros de consentimiento.</>,
              <><strong>WhatsApp (Meta Platforms)</strong>: canal de confirmación de pedidos y atención, cuando tú decides escribirnos.</>,
              <><strong>Instagram (Meta Platforms)</strong>: canal de atención por mensajes directos, cuando tú decides escribirnos.</>,
              <><strong>Empresas transportadoras</strong>: entrega de pedidos en Colombia.</>,
              ...(trackers.gaId ? [<><strong>Google Analytics (Google LLC)</strong>: estadísticas de visitas, solo con tu consentimiento.</>] : []),
              ...(trackers.metaPixelId ? [<><strong>Píxel de Meta (Meta Platforms)</strong>: medición de campañas, solo con tu consentimiento.</>] : []),
            ]}
          />
          <p>Algunos de estos proveedores almacenan información fuera de Colombia. Al aceptar esta política autorizas esa transferencia o transmisión internacional, que se realiza con proveedores que ofrecen medidas de seguridad y confidencialidad, conforme al artículo 26 de la Ley 1581 de 2012 y las normas aplicables.</p>
        </>
      ),
    },
    {
      id: "derechos",
      h: "Derechos de los titulares",
      body: (
        <>
          <p>Conforme al artículo 8 de la Ley 1581 de 2012, como titular tienes derecho a:</p>
          <UL
            items={[
              "Conocer, actualizar y rectificar tus datos personales.",
              "Solicitar prueba de la autorización otorgada, salvo cuando la ley no la exija.",
              "Ser informado sobre el uso que se ha dado a tus datos.",
              "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley, una vez agotado el trámite de consulta o reclamo ante nosotros.",
              "Revocar la autorización y/o solicitar la supresión de tus datos cuando no se respeten los principios, derechos y garantías legales.",
              "Acceder en forma gratuita a tus datos personales objeto de tratamiento.",
            ]}
          />
        </>
      ),
    },
    {
      id: "procedimiento",
      h: "Procedimiento para consultas y reclamos",
      body: (
        <>
          <p>Puedes ejercer tus derechos tú mismo, tus causahabientes o tu representante, a través de: {contactLine}.</p>
          <p>Indica tu nombre, el dato de contacto usado en tu pedido (teléfono o correo), lo que solicitas y, si es un reclamo, los hechos y documentos que quieras hacer valer. Podremos verificar tu identidad antes de responder.</p>
          <UL
            items={[
              <><strong>Consultas:</strong> se responden en máximo diez (10) días hábiles desde su recibo. Si no es posible, te informaremos los motivos y la nueva fecha, que no superará cinco (5) días hábiles adicionales.</>,
              <><strong>Reclamos</strong> (corrección, actualización, supresión o incumplimiento): se atienden en máximo quince (15) días hábiles desde el día siguiente a su recibo, prorrogables hasta ocho (8) días hábiles más, informándote el motivo. Si el reclamo está incompleto, te pediremos completarlo dentro de los cinco (5) días siguientes; si pasan dos (2) meses sin respuesta, se entenderá desistido.</>,
            ]}
          />
          <p>Puedes usar este atajo para enviarnos tu solicitud por WhatsApp: </p>
          {legal.whatsapp ? (
            <p>
              <A href={`https://wa.me/${legal.whatsapp}?text=${encodeURIComponent("Hola THEFATTEST. Quiero ejercer mis derechos sobre mis datos personales (Ley 1581 de 2012).\nTipo de solicitud (consulta / actualización / rectificación / supresión / revocación):\nNombre:\nTeléfono o correo usado en mi pedido:\nDetalle:")}`}>
                Enviar solicitud de datos personales por WhatsApp
              </A>
            </p>
          ) : null}
        </>
      ),
    },
    {
      id: "revocacion",
      h: "Revocación de la autorización",
      body: (
        <>
          <p>Puedes revocar total o parcialmente tu autorización en cualquier momento por los canales indicados. La revocación no procede cuando exista un deber legal o contractual de permanecer en la base de datos (por ejemplo, mientras se ejecuta tu pedido o una garantía, o por obligaciones contables).</p>
          <p>Para dejar de recibir comunicaciones comerciales basta con pedirlo por cualquier canal o responder a cualquiera de esas comunicaciones. Para cookies, usa el botón “Configuración de cookies” al pie de cada página.</p>
        </>
      ),
    },
    {
      id: "supresion",
      h: "Solicitudes de eliminación de datos",
      body: (
        <>
          <p>Puedes solicitar la supresión de tus datos cuando proceda. Una vez verificada tu identidad, eliminaremos o anonimizaremos tus datos de nuestras bases, salvo aquellos que debamos conservar por obligación legal (por ejemplo, registros contables o de garantía), que se bloquearán y solo se usarán para ese fin.</p>
          <p>La copia de pedidos guardada en tu navegador la puedes borrar tú directamente desde <A href="/account">Mis pedidos</A>.</p>
        </>
      ),
    },
    {
      id: "vigencia",
      h: "Vigencia y cambios",
      body: (
        <p>
          Esta política rige desde el {POLICY.updatedLabel} (versión {POLICY.privacy}). Si la modificamos de forma sustancial, lo informaremos en el sitio y, cuando sea necesario, pediremos de nuevo tu autorización. Cada pedido y suscripción registra la versión aceptada.
        </p>
      ),
    },
  ];

  return (
    <LegalDocument
      path={legalRoutes.privacy}
      eyebrow="LEGAL — LEY 1581 DE 2012"
      title="Política de privacidad"
      version={POLICY.privacy}
      intro={<p>Esta es nuestra Política de Tratamiento de Datos Personales. Explica qué datos recopilamos, para qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos como titular.</p>}
      sections={sections}
    />
  );
}
