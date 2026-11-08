-- ─────────────────────────────────────────────────────────────
-- THEFATTEST.STORE — legal consent evidence, input validation, anti-spam
--   * orders: evidence of the data-processing authorization (Ley 1581/2012),
--     accepted policy versions and the separate, optional marketing consent
--   * newsletter_subscribers: authorization date, policy version and source
--   * cookie_consents: anonymous log of cookie choices (no PII, no IP)
--   * create_order: requires the authorization, validates lengths, rate-limits
-- ─────────────────────────────────────────────────────────────

-- orders ───────────────────────────────────────────────────────
alter table public.orders
  add column if not exists data_consent_at timestamptz,
  add column if not exists privacy_policy_version text,
  add column if not exists terms_version text,
  add column if not exists marketing_opt_in boolean not null default false;

-- newsletter ───────────────────────────────────────────────────
alter table public.newsletter_subscribers
  add column if not exists consent_at timestamptz not null default now(),
  add column if not exists policy_version text,
  add column if not exists source text not null default 'footer';

drop policy if exists "newsletter: subscribe" on public.newsletter_subscribers;
create policy "newsletter: subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (
    length(email) <= 160
    and policy_version is not null and length(policy_version) <= 10
    and source in ('footer', 'checkout')
    and consent_at between now() - interval '5 minutes' and now() + interval '5 minutes'
  );

-- cookie consent log ───────────────────────────────────────────
create table if not exists public.cookie_consents (
  id bigint generated always as identity primary key,
  device_id uuid not null,
  policy_version text not null,
  method text not null check (method in ('accept_all', 'reject_all', 'custom')),
  analytics boolean not null,
  marketing boolean not null,
  preferences boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists cookie_consents_device_idx on public.cookie_consents (device_id, created_at desc);
alter table public.cookie_consents enable row level security;
drop policy if exists "admin: cookie consents" on public.cookie_consents;
create policy "admin: cookie consents" on public.cookie_consents for select using (public.is_admin());

create or replace function public.log_cookie_consent(p_device uuid, p_version text, p_method text, p_choices jsonb)
returns void
language plpgsql volatile security definer set search_path = public
as $$
begin
  if p_version is null or length(p_version) > 10 or p_method not in ('accept_all', 'reject_all', 'custom') then
    raise exception 'Consentimiento inválido';
  end if;
  -- simple flood guard per device
  if (select count(*) from public.cookie_consents where device_id = p_device and created_at > now() - interval '1 hour') >= 20 then
    return;
  end if;
  insert into public.cookie_consents (device_id, policy_version, method, analytics, marketing, preferences)
  values (p_device, p_version, p_method,
          coalesce((p_choices->>'analytics')::boolean, false),
          coalesce((p_choices->>'marketing')::boolean, false),
          coalesce((p_choices->>'preferences')::boolean, false));
end $$;
revoke all on function public.log_cookie_consent(uuid, text, text, jsonb) from public;
grant execute on function public.log_cookie_consent(uuid, text, text, jsonb) to anon, authenticated;

-- create_order: authorization + validation + rate limit ─────────
create or replace function public.create_order(p_customer jsonb, p_items jsonb, p_coupon text default null)
returns table (code text, subtotal integer, discount integer, shipping integer, total integer)
language plpgsql volatile security definer set search_path = public, extensions
as $$
#variable_conflict use_column
declare
  v_customer uuid; v_order uuid; v_code text;
  v_sub integer := 0; v_disc integer := 0; v_ship integer := 0;
  v_phone text := regexp_replace(coalesce(p_customer->>'phone', ''), '\D', '', 'g');
  it jsonb; p public.products; inv public.inventory; c public.coupons; s public.store_settings;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'Pedido vacío o inválido';
  end if;

  -- Ley 1581/2012: no order without a prior, express authorization
  if coalesce((p_customer->>'data_consent')::boolean, false) is not true
     or coalesce(p_customer->>'privacy_version', '') = '' or coalesce(p_customer->>'terms_version', '') = '' then
    raise exception 'Falta la autorización de tratamiento de datos personales';
  end if;

  if coalesce(length(trim(p_customer->>'full_name')), 0) not between 3 and 120
     or length(v_phone) not between 7 and 15
     or coalesce(p_customer->>'email', '') !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(p_customer->>'email') > 160
     or coalesce(length(p_customer->>'department'), 0) not between 2 and 60
     or coalesce(length(p_customer->>'city'), 0) not between 2 and 80
     or coalesce(length(p_customer->>'address'), 0) not between 6 and 200
     or coalesce(length(p_customer->>'notes'), 0) > 500
     or length(p_customer->>'privacy_version') > 10 or length(p_customer->>'terms_version') > 10 then
    raise exception 'Datos del cliente incompletos o inválidos';
  end if;

  -- anti-spam: max 5 orders per phone in 30 minutes
  if (select count(*) from public.orders o join public.customers cu on cu.id = o.customer_id
      where regexp_replace(cu.phone, '\D', '', 'g') = v_phone and o.created_at > now() - interval '30 minutes') >= 5 then
    raise exception 'Demasiados pedidos en poco tiempo. Escríbenos por WhatsApp.';
  end if;

  select * into s from public.store_settings limit 1;
  v_code := 'TF-' || to_char(now() at time zone 'America/Bogota', 'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(3),'hex'),1,4));

  insert into public.customers (full_name, phone, email)
  values (trim(p_customer->>'full_name'), p_customer->>'phone', lower(p_customer->>'email'))
  on conflict (email, phone) do update set full_name = excluded.full_name
  returning id into v_customer;

  insert into public.orders (code, customer_id, department, city, address, notes, subtotal, total,
                             data_consent_at, privacy_policy_version, terms_version, marketing_opt_in)
  values (v_code, v_customer, p_customer->>'department', p_customer->>'city', p_customer->>'address', coalesce(p_customer->>'notes',''), 0, 0,
          now(), p_customer->>'privacy_version', p_customer->>'terms_version', coalesce((p_customer->>'marketing_opt_in')::boolean, false))
  returning id into v_order;

  for it in select * from jsonb_array_elements(p_items) loop
    select * into p from public.products where slug = it->>'slug' and active and not is_demo;
    if not found then raise exception 'Producto no disponible: %', it->>'slug'; end if;
    if (it->>'qty')::int < 1 or (it->>'qty')::int > 20 then raise exception 'Cantidad inválida'; end if;

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
grant execute on function public.create_order(jsonb, jsonb, text) to anon, authenticated;

-- Note: is_admin() stays executable by anon on purpose — RLS policies evaluated
-- for anonymous visitors call it (it only returns whether the caller is an admin).
