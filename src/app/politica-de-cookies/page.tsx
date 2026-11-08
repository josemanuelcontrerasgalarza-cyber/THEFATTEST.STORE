import type { Metadata } from "next";
import { A, LegalDocument, UL } from "@/components/legal/LegalDocument";
import { CookieSettingsButton } from "@/components/legal/CookieConsent";
import { cookieInventory } from "@/lib/cookie-inventory";
import { legalRoutes, POLICY } from "@/lib/legal";
import type { ConsentCategory } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Qué cookies y almacenamiento local usa THEFATTEST.STORE y cómo gestionar tu consentimiento.",
  alternates: { canonical: legalRoutes.cookies },
};

const LABEL: Record<ConsentCategory, string> = {
  necessary: "Necesarias (siempre activas)",
  preferences: "Preferencias",
  analytics: "Analíticas",
  marketing: "Marketing",
};

function Table({ cat }: { cat: ConsentCategory }) {
  const items = cookieInventory[cat];
  if (!items.length)
    return <p className="border border-dashed border-white/15 p-4 text-sm text-ash">Actualmente no usamos ninguna herramienta de esta categoría. Si en el futuro se incorpora alguna, se listará aquí y solo funcionará con tu consentimiento.</p>;
  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-cement/60 font-mono text-[10px] tracking-[0.15em] text-ash">
          <tr>
            <th className="p-3 font-normal">NOMBRE</th>
            <th className="p-3 font-normal">TIPO / PROVEEDOR</th>
            <th className="p-3 font-normal">FINALIDAD</th>
            <th className="p-3 font-normal">DURACIÓN</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {items.map((i) => (
            <tr key={i.name} className="align-top">
              <td className="p-3 font-mono text-bone">{i.name}</td>
              <td className="p-3 text-white/60">{i.type}<br />{i.provider}</td>
              <td className="p-3 text-white/75">{i.purpose}</td>
              <td className="p-3 text-white/60">{i.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  const sections = [
    {
      id: "que-son",
      h: "¿Qué son las cookies?",
      body: <p>Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o datos que un sitio guarda en tu dispositivo para funcionar, recordar información o medir su uso. En esta política usamos “cookies” para referirnos a ambas.</p>,
    },
    {
      id: "categorias",
      h: "Categorías que usamos",
      body: (
        <UL
          items={[
            <><strong>Necesarias:</strong> imprescindibles para el funcionamiento y la seguridad del sitio. No requieren consentimiento y no se pueden desactivar.</>,
            <><strong>Preferencias:</strong> recuerdan tus configuraciones, como el idioma.</>,
            <><strong>Analíticas:</strong> estadísticas de visitas y comportamiento.</>,
            <><strong>Marketing:</strong> publicidad personalizada y seguimiento de campañas.</>,
          ]}
        />
      ),
    },
    ...(["necessary", "preferences", "analytics", "marketing"] as ConsentCategory[]).map((c) => ({
      id: `lista-${c}`,
      h: `Detalle: ${LABEL[c]}`,
      body: <Table cat={c} />,
    })),
    {
      id: "consentimiento",
      h: "Cómo gestionamos tu consentimiento",
      body: (
        <>
          <UL
            items={[
              "Ninguna cookie que no sea necesaria se activa antes de que elijas en el aviso de cookies.",
              "Puedes aceptar todas, rechazar las no esenciales o configurar cada categoría.",
              "Guardamos tu elección con la fecha, la versión de esta política y las categorías aceptadas. También registramos una copia anónima (identificador aleatorio del dispositivo, sin datos personales ni IP) como evidencia del consentimiento.",
              "Puedes cambiar o retirar tu consentimiento en cualquier momento desde “Configuración de cookies”, al pie de cada página. Al retirarlo, borramos los datos de esa categoría.",
              "Si actualizamos esta política de forma relevante, te pediremos de nuevo tu elección.",
            ]}
          />
          <CookieSettingsButton className="mt-2 inline-flex h-11 items-center bg-acid px-5 text-[11px] font-bold tracking-[0.2em] text-ink transition hover:brightness-110">
            ABRIR CONFIGURACIÓN DE COOKIES
          </CookieSettingsButton>
        </>
      ),
    },
    {
      id: "terceros",
      h: "Servicios de terceros",
      body: (
        <p>
          Las fotografías y fuentes tipográficas se sirven desde nuestro propio dominio, sin cookies de terceros. Al pulsar un enlace de WhatsApp o Instagram sales del sitio y esas plataformas aplican sus propias políticas. El alojamiento (Vercel) y la base de datos (Supabase) procesan datos técnicos de conexión necesarios para prestar el servicio; ver <A href={legalRoutes.privacy}>Política de privacidad</A>.
        </p>
      ),
    },
    {
      id: "navegador",
      h: "Cómo borrar cookies desde tu navegador",
      body: <p>Además del panel de configuración, puedes borrar las cookies y el almacenamiento local desde los ajustes de privacidad de tu navegador (Chrome, Safari, Firefox, Edge u otros). Si borras el almacenamiento necesario, se vaciará tu bolsa y la copia local de tus pedidos.</p>,
    },
    {
      id: "vigencia",
      h: "Vigencia",
      body: <p>Versión {POLICY.cookies}, vigente desde el {POLICY.updatedLabel}.</p>,
    },
  ];
  return (
    <LegalDocument
      path={legalRoutes.cookies}
      eyebrow="LEGAL — COOKIES"
      title="Política de cookies"
      version={POLICY.cookies}
      intro={<p>Aquí explicamos qué cookies y almacenamiento local usa THEFATTEST.STORE, para qué sirven y cómo puedes aceptarlos, rechazarlos o configurarlos. Esta lista refleja lo que el sitio usa realmente.</p>}
      sections={sections}
    />
  );
}
