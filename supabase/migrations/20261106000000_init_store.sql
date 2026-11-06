-- ════════════════════════════════════════════════════════════════════
-- THEFATTEST.STORE — initial schema
-- Tables: categories, products, inventory, customers, orders, order_items,
--         coupons, newsletter_subscribers, store_settings, admins
-- Security model:
--   • anon/authenticated can READ the active catalog only.
--   • Orders are created ONLY through create_order() (SECURITY DEFINER),
--     which recomputes prices, coupon and stock server-side.
--   • Coupons are never readable from the browser; validate_coupon() checks them.
--   • Newsletter: insert-only for the public.
--   • Admins (rows in public.admins linked to auth.users) can manage everything.
-- ════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto" with schema extensions;

-- ───────────── admins & helper ─────────────
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;

-- ───────────── catalog ─────────────
create table public.categories (
  slug text primary key,
  label text not null,
  grp text not null check (grp in ('clothing','sneakers','accessories','fragrances')),
  image_url text,
  sort_order int not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category_slug text not null references public.categories (slug),
  price integer not null check (price >= 0),            -- COP, no decimals
  compare_at integer check (compare_at is null or compare_at > 0),
  description text not null default '',
  details text[] not null default '{}',
  images text[] not null default '{}',
  colors jsonb not null default '[]',                    -- [{name, hex, image?}]
  is_new boolean not null default false,
  featured boolean not null default false,
  is_demo boolean not null default false,
  price_to_confirm boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category_slug) where active;

-- stock per product + size (+ optional color; '' = any color)
create table public.inventory (
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null,
  color text not null default '',
  stock integer not null default 0 check (stock >= 0),
  primary key (product_id, size, color)
);

-- ───────────── customers & orders ─────────────
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  created_at timestamptz not null default now(),
  unique (email, phone)
);

create type public.order_status as enum ('pendiente','confirmado','preparando','enviado','entregado','cancelado');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  customer_id uuid not null references public.customers (id),
  status public.order_status not null default 'pendiente',
  department text not null,
  city text not null,
  address text not null,
  notes text not null default '',
  subtotal integer not null,
  coupon_code text,
  discount integer not null default 0,
  shipping integer not null default 0,
  total integer not null,
  channel text not null default 'whatsapp',
  payment_provider text,            -- wompi | mercadopago | payu (future)
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_idx on public.orders (status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  product_name text not null,
  size text not null,
  color text not null,
  qty integer not null check (qty > 0),
  unit_price integer not null
);

-- ───────────── marketing ─────────────
create table public.coupons (
  code text primary key check (code = upper(code)),
  type text not null check (type in ('percent','fixed')),
  value integer not null check (value > 0),
  min_subtotal integer not null default 0,
  description text not null default '',
  max_uses integer,
  uses integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true
);

create table public.newsletter_subscribers (
  email text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

create table public.store_settings (
  id boolean primary key default true check (id),   -- single row
  free_shipping_from integer not null default 300000,
  flat_shipping integer not null default 14900,
  whatsapp_number text,
  updated_at timestamptz not null default now()
);
insert into public.store_settings default values;

-- ───────────── RLS ─────────────
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.store_settings enable row level security;

-- public catalog reads
create policy "catalog: read categories" on public.categories for select using (true);
create policy "catalog: read active products" on public.products for select using (active or public.is_admin());
create policy "catalog: read inventory" on public.inventory for select using (true);
create policy "settings: read" on public.store_settings for select using (true);

-- newsletter: anyone may subscribe, nobody but admins may read
create policy "newsletter: subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);

-- admins manage everything
create policy "admin: admins" on public.admins for select using (user_id = auth.uid() or public.is_admin());
create policy "admin: categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: inventory" on public.inventory for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: order_items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: coupons" on public.coupons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin: newsletter" on public.newsletter_subscribers for select using (public.is_admin());
create policy "admin: settings" on public.store_settings for update using (public.is_admin()) with check (public.is_admin());

-- ───────────── RPC: validate_coupon ─────────────
create or replace function public.validate_coupon(p_code text, p_subtotal integer)
returns table (valid boolean, message text, type text, value integer, min_subtotal integer, description text)
language plpgsql stable security definer set search_path = public
as $$
declare c public.coupons;
begin
  select * into c from public.coupons where code = upper(trim(p_code));
  if not found or not c.active
     or (c.starts_at is not null and now() < c.starts_at)
     or (c.ends_at is not null and now() > c.ends_at)
     or (c.max_uses is not null and c.uses >= c.max_uses) then
    return query select false, 'Cupón no válido.'::text, null::text, null::int, null::int, null::text; return;
  end if;
  if p_subtotal < c.min_subtotal then
    return query select false, 'No cumples el mínimo de compra para este cupón.'::text, null::text, null::int, null::int, null::text; return;
  end if;
  return query select true, null::text, c.type, c.value, c.min_subtotal, c.description;
end $$;

-- ───────────── RPC: create_order ─────────────
-- p_customer: {full_name, phone, email, department, city, address, notes}
-- p_items:    [{slug, size, color, qty}]
create or replace function public.create_order(p_customer jsonb, p_items jsonb, p_coupon text default null)
returns table (code text, subtotal integer, discount integer, shipping integer, total integer)
language plpgsql volatile security definer set search_path = public, extensions
as $$
#variable_conflict use_column
declare
  v_customer uuid; v_order uuid; v_code text;
  v_sub integer := 0; v_disc integer := 0; v_ship integer := 0;
  it jsonb; p public.products; inv public.inventory; c public.coupons; s public.store_settings;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'Pedido vacío o inválido';
  end if;
  if coalesce(length(trim(p_customer->>'full_name')),0) < 3 or coalesce(length(p_customer->>'phone'),0) < 7
     or coalesce(p_customer->>'email','') !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Datos del cliente incompletos';
  end if;

  select * into s from public.store_settings limit 1;
  v_code := 'TF-' || to_char(now() at time zone 'America/Bogota', 'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(3),'hex'),1,4));

  insert into public.customers (full_name, phone, email)
  values (trim(p_customer->>'full_name'), p_customer->>'phone', lower(p_customer->>'email'))
  on conflict (email, phone) do update set full_name = excluded.full_name
  returning id into v_customer;

  insert into public.orders (code, customer_id, department, city, address, notes, subtotal, total)
  values (v_code, v_customer, p_customer->>'department', p_customer->>'city', p_customer->>'address', coalesce(p_customer->>'notes',''), 0, 0)
  returning id into v_order;

  for it in select * from jsonb_array_elements(p_items) loop
    select * into p from public.products where slug = it->>'slug' and active and not is_demo;
    if not found then raise exception 'Producto no disponible: %', it->>'slug'; end if;
    if (it->>'qty')::int < 1 then raise exception 'Cantidad inválida'; end if;

    -- lock the stock row and decrement (color-specific row first, then generic)
    select * into inv from public.inventory
      where product_id = p.id and size = it->>'size' and color in (coalesce(it->>'color',''), '')
      order by (color = '') limit 1 for update;
    if not found or inv.stock < (it->>'qty')::int then
      raise exception 'Sin stock suficiente: % talla %', p.name, it->>'size';
    end if;
    update public.inventory set stock = stock - (it->>'qty')::int
      where product_id = inv.product_id and size = inv.size and color = inv.color;

    insert into public.order_items (order_id, product_id, product_name, size, color, qty, unit_price)
    values (v_order, p.id, p.name, it->>'size', coalesce(it->>'color',''), (it->>'qty')::int, p.price);
    v_sub := v_sub + p.price * (it->>'qty')::int;
  end loop;

  if p_coupon is not null then
    select * into c from public.coupons where code = upper(trim(p_coupon)) and active
      and (starts_at is null or now() >= starts_at) and (ends_at is null or now() <= ends_at)
      and (max_uses is null or uses < max_uses) for update;
    if found and v_sub >= c.min_subtotal then
      v_disc := least(v_sub, case when c.type = 'percent' then round(v_sub * c.value / 100.0)::int else c.value end);
      update public.coupons set uses = uses + 1 where code = c.code;
    end if;
  end if;

  v_ship := case when v_sub - v_disc >= s.free_shipping_from then 0 else s.flat_shipping end;
  update public.orders set subtotal = v_sub, discount = v_disc, coupon_code = case when v_disc > 0 then upper(p_coupon) end,
    shipping = v_ship, total = v_sub - v_disc + v_ship where id = v_order;

  return query select v_code, v_sub, v_disc, v_ship, v_sub - v_disc + v_ship;
end $$;

revoke all on function public.create_order(jsonb, jsonb, text) from public;
revoke all on function public.validate_coupon(text, integer) from public;
grant execute on function public.create_order(jsonb, jsonb, text) to anon, authenticated;
grant execute on function public.validate_coupon(text, integer) to anon, authenticated;
