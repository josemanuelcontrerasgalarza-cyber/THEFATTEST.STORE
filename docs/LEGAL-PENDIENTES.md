# THEFATTEST: datos legales que faltan por completar

> Estos documentos son una base técnica y funcional. **No constituyen asesoría jurídica ni certifican el cumplimiento legal.** Antes de operar a escala, un abogado en Colombia debería revisarlos.

## 1. Datos del vendedor (obligatorios)

Mientras falten, el sitio muestra `[Pendiente: …]`.

Se configuran en Vercel → Project → Settings → Environment Variables. Después de cambiarlos hay que hacer un redeploy.

| Variable | Qué poner | Dónde aparece |
| --- | --- | --- |
| `NEXT_PUBLIC_LEGAL_NAME` | Nombre completo de la persona natural o razón social | Privacidad (responsable), Términos, Información del vendedor, footer |
| `NEXT_PUBLIC_LEGAL_ID_TYPE` | `NIT`, `CC` o `RUT` | Ídem |
| `NEXT_PUBLIC_LEGAL_ID` | Número de identificación | Ídem |
| `NEXT_PUBLIC_LEGAL_ADDRESS` | Dirección física de contacto / notificaciones | Privacidad, Información del vendedor, footer |
| `NEXT_PUBLIC_LEGAL_CITY` | Ciudad | Ídem |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de atención | Contacto, PQR, footer |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | Correo para consultas y reclamos de datos personales (opcional; si falta se usa el de contacto) | Política de privacidad |
| `NEXT_PUBLIC_SUPPORT_HOURS` | Horario de atención (opcional) | Contacto, Cambios, Información del vendedor |

Ya configurados: WhatsApp +57 310 538 6878 e Instagram @thefattest.store.

## 2. Decisiones comerciales que el propietario debe confirmar

Ya aparecen en el sitio desde antes, pero son decisiones del negocio, no de la ley. Se cambian en `src/lib/config.ts`.

- **Cambios voluntarios por talla o gusto:** 15 días calendario (`returnsDays`). El costo del envío lo paga el cliente. Esto es adicional al retracto y a la garantía legal, que no se pueden reducir.
- **Envíos:**
  - Tiempo: 2–5 días hábiles.
  - Gratis desde $300.000.
  - Tarifa fija de $14.900.
- **Impuestos:** el sitio dice que los precios son el total final con impuestos incluidos, como exige el art. 26 de la Ley 1480. Hay que confirmar con el contador si el vendedor es responsable de IVA y si debe emitir factura electrónica (DIAN).
- **Medios de pago:** el sitio no nombra ninguno. Dice que se informan al confirmar por WhatsApp. Si se integra una pasarela (Wompi, Mercado Pago, PayU…), hay que:
  - añadirla a Términos (sección "Métodos de pago");
  - añadirla a Privacidad (sección "Terceros");
  - agregar su dominio al CSP en `next.config.ts`.
- **Transportadoras:** la política menciona "empresas transportadoras" sin nombrarlas. Si se quiere nombrarlas, se edita `src/app/politica-de-privacidad/page.tsx`.

## 3. Trámites legales a revisar con un abogado o contador

- **Registro Nacional de Bases de Datos (RNBD) ante la SIC:** es obligatorio para sociedades y entidades sin ánimo de lucro con activos totales superiores a 100.000 UVT. Hay que verificar si aplica.
- **Registro mercantil / RUT:** comprobar que el vendedor esté formalizado para vender en línea.
- **Marcas de terceros:** algunos productos llevan marcas de terceros (Hellstar, Nike, Jordan, Off-White, Supreme, Kenzo, Louis Vuitton, etc.). Hay que confirmar la procedencia y autenticidad, y cómo se describen. Vender réplicas presentándolas como originales puede infringir la Ley 1480 (información engañosa) y normas de propiedad industrial. Términos aclara que las marcas pertenecen a sus titulares, pero eso no sustituye esta revisión.
- **Reseñas de ejemplo:** la sección "Lo dice la calle" muestra reseñas marcadas como DEMO. Se recomienda reemplazarlas por reseñas reales verificables o quitarlas.
- **Garantía:** el texto usa el término supletorio de la ley (art. 8 Ley 1480: 1 año para productos nuevos si no se indica otro). Si se quiere anunciar un término propio por producto, hay que publicarlo en cada ficha.

## 4. Cuándo actualizar las versiones de las políticas

Las versiones están en `src/lib/legal.ts` → `POLICY`.

- Si cambias el texto de cookies de forma relevante, sube `POLICY.cookies`. Todos los visitantes verán el aviso otra vez.
- Si cambias privacidad o términos, sube `POLICY.privacy` / `POLICY.terms` y `POLICY.updated`. Los pedidos nuevos registrarán la versión nueva.

## 5. Si se activan herramientas de analítica o marketing

1. Define `NEXT_PUBLIC_GA_MEASUREMENT_ID` o `NEXT_PUBLIC_META_PIXEL_ID` en Vercel.
2. Haz redeploy. La política de cookies, el panel de preferencias y el CSP se actualizan solos.
3. Las herramientas solo se cargan si el visitante acepta la categoría correspondiente.
4. Sube `POLICY.cookies` para pedir el consentimiento de nuevo a quienes ya eligieron.
