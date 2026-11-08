# THEFATTEST.STORE

**BUILT DIFFERENT. WORN DIFFERENT.** Tienda online de streetwear: ropa, sneakers, accesorios, joyería y perfumería, con pedidos que se confirman por WhatsApp.

Hecha con Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Zustand y Lucide. Supabase es opcional.

## Arrancar

```bash
npm install
cp .env.example .env.local   # ajusta los valores
npm run dev                  # http://localhost:3000
npm run build && npm start   # producción
```

## Qué incluye

| Ruta | Qué hace |
| --- | --- |
| `/` | Hero de campaña, THE LATEST DROP, categorías, brand story, comunidad e Instagram |
| `/shop` | Catálogo con búsqueda, filtros (categoría, precio, talla, novedades, ofertas, stock), orden y "cargar más". Los filtros quedan en la URL (`?cat=`, `?group=clothing`, `?new=1`, `?sale=1`…) |
| `/product/[slug]` | Galería, color y talla obligatorios, stock por talla, cantidad, añadir / comprar ahora, envío, cambios, relacionados, JSON-LD |
| Carrito (drawer) | Cambiar talla y cantidad, eliminar, vaciar, cupón, barra de envío gratis, totales. Se guarda en `localStorage` |
| `/checkout` | Datos del cliente, departamento, ciudad, dirección, referencias y validación. **No cobra nada** |
| `/checkout/confirmacion` | Pedido `TF-AAMMDD-XXXX` + botón que abre WhatsApp con el pedido ya escrito |
| `/account` | Pedidos hechos desde ese dispositivo |
| `/admin` | Vista previa del back-office: resumen, inventario por talla, pedidos y su estado, cupones y estado de la configuración (sin indexar) |
| `/about`, `/info/*` | Historia de la marca, FAQ, envíos y contacto |
| Legal | `/politica-de-privacidad`, `/terminos-y-condiciones`, `/cambios-y-devoluciones`, `/politica-de-cookies`, `/informacion-legal` + gestor de consentimiento de cookies. Ver `docs/LEGAL-PENDIENTES.md` y `docs/AUDITORIA-PRIVACIDAD-SEGURIDAD.md` |
| SEO | Metadata, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD de tienda y producto |

## Catálogo

Todo está en `src/lib/products.ts`.

- **`realProducts`**: las 14 prendas reales de @thefattest.store. Las fotos están en `public/products/` y hay una copia de 640 px en `public/products/sm/`.
  - `priceToConfirm: true` marca un precio que todavía hay que confirmar. Solo el Saco Kenzo ($130.000) tiene precio confirmado.
  - **El stock por talla es de ejemplo.** Pon las cantidades reales.
- **`demoProducts`**: productos de relleno con fotos de Unsplash para las categorías que todavía no tienen inventario (sneakers, joyería, perfumería, jeans, cargos, chaquetas, accesorios). Llevan la etiqueta **DEMO** y no aparecen en el sitemap. Bórralos cuando tengas inventario real de esas categorías.

Para añadir un producto, copia uno de `realProducts`, pon sus fotos en `public/products/` y en `public/products/sm/`, y ajusta `sizes` con el stock de cada talla.

## Configuración (`.env.local`)

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp de la tienda. Por defecto es `573105386878` (+57 310 538 6878) |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Por defecto es instagram.com/thefattest.store |
| `NEXT_PUBLIC_TIKTOK_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` | Si los dejas vacíos, no se muestran |
| `NEXT_PUBLIC_DEMO_MODE` | Ponlo en `false` cuando ya no queden productos demo |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Activan la base de datos. Usa solo la clave *anon*, **nunca** la `service_role` |

Envío gratis, tarifa fija y días de cambio se configuran en `src/lib/config.ts`.

## Supabase (conectado)

La tienda usa el proyecto de Supabase **THEFATTEST.STORE** (`dqzjwdcwblizhpaeertg`), que ya está configurado:

- Tiene aplicada la migración `supabase/migrations/20261106000000_init_store.sql`.
- Tiene cargadas las 10 categorías, los 14 productos reales con su stock por talla (70 filas) y los cupones `FATTEST10` y `DROP20K`.
- La URL y la clave publishable vienen por defecto en `src/lib/supabase.ts`. Con las políticas RLS es seguro que estén en el navegador.

Qué hace cada parte:

- Los pedidos se crean con la función `create_order()`. Esa función recalcula en el servidor los precios, el cupón y el envío, y descuenta el stock bloqueando la fila. Rechaza los productos demo, que tampoco se pueden añadir al carrito en la web.
- Desde el navegador no se pueden leer los pedidos, los clientes ni los cupones. Los cupones se validan con `validate_coupon()`.
- Al newsletter solo se le pueden añadir correos, en la tabla `newsletter_subscribers`.
- Para ver los pedidos: Supabase → Table Editor → `orders` y `order_items`.
- Los administradores son usuarios de Supabase Auth que estén en la tabla `admins`. Para dar acceso: `insert into admins(user_id) values ('<uuid>')`.
- `npm run db:seed-sql` vuelve a generar `supabase/seed.sql` con todo el catálogo, para usarlo en otro proyecto.

> El stock que muestra la web sale de `src/lib/products.ts`, y el stock real que se descuenta está en la tabla `inventory`. Cuando cambies cantidades, actualiza los dos (o conecta la web para que lea `inventory`).

## Pagos

Por ahora el cliente genera el pedido, lo envía por WhatsApp, la tienda confirma y le comparte los datos de pago. La página **no cobra ni simula pagos**.

Para conectar Wompi, Mercado Pago o PayU:

1. Crea una ruta de servidor (`src/app/api/pay/route.ts`) que reciba el código del pedido, lea el total desde Supabase y cree la transacción con la clave privada guardada en el servidor.
2. Recibe el webhook de la pasarela y pasa el pedido a `confirmado` (`payment_provider` y `payment_reference` ya existen en `orders`).
3. Activa la opción en `PAYMENTS`, en `src/components/checkout/CheckoutForm.tsx`.

## Panel admin

`/admin` lee hoy el catálogo del código y los pedidos guardados en ese navegador. Para usarlo en producción:

- Protégelo con Supabase Auth: un middleware que exija sesión y que el usuario esté en `admins`.
- Haz que lea y escriba en `orders`, `inventory`, `products` y `coupons`. Las políticas RLS ya permiten todo a los administradores.

## Antes de lanzar

- [ ] Precios reales (quita `priceToConfirm`) y stock real por talla.
- [ ] Revisa el texto de `/about` y las políticas de `src/lib/info-pages.tsx`. Son una base y conviene que los revise un abogado (Ley 1581 de 2012 y Ley 1480 de 2011).
- [ ] Cambia las reseñas de ejemplo (`SocialProof.tsx`, marcadas como DEMO) por reseñas reales y verificables, o quítalas.
- [ ] Borra los productos demo o pon `NEXT_PUBLIC_DEMO_MODE=false` cuando ya no haya ninguno.
- [ ] Pon `NEXT_PUBLIC_SITE_URL` con el dominio final.
