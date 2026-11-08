# Auditoría de privacidad y seguridad: THEFATTEST.STORE

Fecha: 8 de noviembre de 2026. Alcance: código del repositorio, proyecto Supabase `dqzjwdcwblizhpaeertg` y despliegue en Vercel.

## Stack

- Next.js 15 (App Router) en Vercel.
- Supabase (Postgres, us-east-1).
- Zustand (estado del carrito en localStorage).
- Framer Motion.
- Pedidos que se confirman por WhatsApp. No hay pagos en línea.

## Inventario de datos y almacenamiento

| Dónde | Qué | Base |
| --- | --- | --- |
| `localStorage: tf-consent` | Elección de cookies (categorías, fecha, versión, id aleatorio) | Necesaria |
| `localStorage: thefattest-cart` | Carrito y cupón | Necesaria |
| `localStorage: thefattest-orders` | Copia de los pedidos del propio usuario | Necesaria (se puede borrar desde "Mis pedidos") |
| `localStorage: thefattest-lang` | Idioma | **Preferencias (requiere consentimiento)** |
| Supabase `customers` / `orders` / `order_items` | Datos del pedido + evidencia de autorización | Autorización Ley 1581 (obligatoria para comprar) |
| Supabase `newsletter_subscribers` | Correo + fecha + versión + origen | Autorización expresa |
| Supabase `cookie_consents` | Id aleatorio, versión, categorías (sin datos personales ni IP) | Evidencia de consentimiento |

**Cookies HTTP:** el sitio no instala ninguna. Verificado con Playwright: 0 cookies y 0 peticiones a terceros antes del consentimiento.

## Hallazgos y acciones

| # | Hallazgo | Acción |
| --- | --- | --- |
| 1 | No había gestor de consentimiento | Banner, panel por categorías, botón permanente en el footer, registro local y en el servidor, borrado al retirar el consentimiento y nueva solicitud si cambia la versión |
| 2 | El idioma se guardaba sin consentimiento | Ahora solo se guarda con consentimiento de "Preferencias" |
| 3 | La foto del hero se cargaba desde images.unsplash.com (tercero que recibe la IP) | La imagen ahora se sirve desde el propio dominio. Las fuentes ya eran propias (next/font) |
| 4 | El boletín guardaba correos en localStorage si fallaba la base de datos | Eliminado. También se borra la clave heredada `thefattest-newsletter` |
| 5 | El checkout combinaba términos y privacidad en una sola casilla | Ahora hay tres casillas, ninguna premarcada: términos (obligatoria), autorización de datos con el texto exigido (obligatoria) y marketing (opcional, separada) |
| 6 | No quedaba evidencia de la autorización | `orders` guarda `data_consent_at` (hora del servidor), `privacy_policy_version`, `terms_version` y `marketing_opt_in`. `newsletter_subscribers` guarda `consent_at`, `policy_version` y `source` |
| 7 | `create_order` no exigía autorización y validaba poco | Rechaza pedidos sin autorización, valida longitudes, limita la cantidad a 1–20 y limita a 5 pedidos por teléfono cada 30 minutos |
| 8 | El boletín aceptaba inserciones sin consentimiento | La política RLS exige `policy_version`, longitud ≤ 160 y un `source` válido |
| 9 | No había protección contra spam en formularios | Honeypot en checkout y boletín, tiempo mínimo en el checkout y límites en el servidor |
| 10 | No había cabeceras de seguridad | CSP con lista blanca (terceros solo si están configurados), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy y COOP |
| 11 | Pasarelas de pago "próximamente" sin integración (Mercado Pago, Wompi, PayU) y medios de pago concretos sin confirmar | Retirados del checkout y de las FAQ. El sitio solo describe el flujo real |
| 12 | Las políticas mencionaban perfumería y joyería, que ya no se venden | Textos corregidos |
| 13 | La copia local de pedidos no se podía borrar | Botón "Borrar mis pedidos de este dispositivo" |

## Verificaciones (todas pasaron)

- Petición anónima a `rpc/create_order` sin autorización → rechazada ("Falta la autorización…").
- Lectura anónima de `orders`, `newsletter_subscribers` y `cookie_consents` → `[]` (RLS).
- Inserción anónima en el boletín sin `policy_version` → rechazada por RLS.
- La clave pública del frontend es la *publishable key*. No hay claves `service_role` ni secretos en el repositorio.

## Advertencias del linter de Supabase (aceptadas)

`create_order`, `validate_coupon`, `log_cookie_consent` e `is_admin` son `SECURITY DEFINER` ejecutables por `anon`. Es intencional:

- Son la única vía de escritura pública y validan sus entradas.
- `is_admin()` lo usan las políticas RLS y solo devuelve si el usuario que llama es administrador.

## Recomendaciones pendientes (no implementadas)

- **`/admin`:** hoy es una vista previa que solo lee datos del navegador del propio visitante (no está indexada). Antes de mostrar pedidos reales, debe protegerse con Supabase Auth y la tabla `admins`.
- **CSP con nonce:** usar un middleware con nonce para eliminar `'unsafe-inline'` en scripts.
- **Retención de datos:** definir un plazo de retención y una tarea periódica que anonimice pedidos antiguos y borre `cookie_consents` de más de N años.
- **Protección anti-bots avanzada:** valorar Cloudflare Turnstile en el checkout si aparece spam real. Requiere actualizar la política de cookies.
