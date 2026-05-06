-- ═══════════════════════════════════════════════════════════
-- KULT E-commerce — Supabase Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ─── Extensions ───────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles (extiende auth.users) ──────────────────────
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text not null default '',
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── Brands ───────────────────────────────────────────────
create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description text,
  created_at timestamptz default now() not null
);

alter table brands enable row level security;

create policy "Anyone can read brands"
  on brands for select using (true);

create policy "Service role can manage brands"
  on brands for all using (auth.role() = 'service_role');

-- ─── Categories ───────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  created_at timestamptz default now() not null
);

alter table categories enable row level security;

create policy "Anyone can read categories"
  on categories for select using (true);

create policy "Service role can manage categories"
  on categories for all using (auth.role() = 'service_role');

-- ─── Products ─────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  name text not null,
  slug text unique not null,
  description text,
  brand_id uuid references brands on delete set null,
  category_id uuid references categories on delete set null,
  base_price numeric(10,2) not null default 0,
  images text[] default '{}',
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table products enable row level security;

create policy "Anyone can read active products"
  on products for select using (is_active = true);

create policy "Service role can manage products"
  on products for all using (auth.role() = 'service_role');

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_brand on products(brand_id);

-- ─── Product Variants ─────────────────────────────────────
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products on delete cascade not null,
  size text not null,
  color text not null,
  color_hex text,
  stock integer not null default 0,
  price_override numeric(10,2),
  sku text unique not null,
  created_at timestamptz default now() not null,
  unique(product_id, size, color)
);

alter table product_variants enable row level security;

create policy "Anyone can read variants"
  on product_variants for select using (true);

create policy "Service role can manage variants"
  on product_variants for all using (auth.role() = 'service_role');

create index if not exists idx_variants_product on product_variants(product_id);
create index if not exists idx_variants_sku on product_variants(sku);

-- ─── Wishlists ────────────────────────────────────────────
create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references products on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, product_id)
);

alter table wishlists enable row level security;

create policy "Users can manage own wishlist"
  on wishlists for all using (auth.uid() = user_id);

-- ─── Orders ───────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  guest_email text,
  guest_phone text,
  status text not null default 'pendiente'
    check (status in ('pendiente','confirmado','despachado','entregado','cancelado')),
  total numeric(10,2) not null default 0,
  shipping_address jsonb not null default '{}',
  payment_method text not null
    check (payment_method in ('bold','contraentrega')),
  bold_transaction_id text,
  tracking_number text,
  created_at timestamptz default now() not null
);

alter table orders enable row level security;

create policy "Users can read own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Service role can manage orders"
  on orders for all using (auth.role() = 'service_role');

create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created on orders(created_at desc);

-- ─── Order Items ──────────────────────────────────────────
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders on delete cascade not null,
  product_id uuid references products on delete set null,
  variant_id uuid references product_variants on delete set null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null
);

alter table order_items enable row level security;

create policy "Users can read own order items"
  on order_items for select
  using (exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid()));

create policy "Service role can manage order items"
  on order_items for all using (auth.role() = 'service_role');

-- ─── Admin Users ──────────────────────────────────────────
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  role text not null default 'agente'
    check (role in ('superadmin','admin','agente')),
  password_hash text not null default '',
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

alter table admin_users enable row level security;

create policy "Only service role can manage admin users"
  on admin_users for all using (auth.role() = 'service_role');

-- ─── Coupons (futuro) ─────────────────────────────────────
create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(10,2) not null,
  expires_at timestamptz,
  is_active boolean default true not null
);

alter table coupons enable row level security;

create policy "Anyone can read active coupons"
  on coupons for select using (is_active = true);

create policy "Service role can manage coupons"
  on coupons for all using (auth.role() = 'service_role');

-- ─── Storage Buckets ──────────────────────────────────────
-- Ejecutar manualmente en Storage > New Bucket:
-- Nombre: product-images | Público: true | Tamaño max: 10MB

-- ─── Seed: Categorías y Marcas de ejemplo ────────────────
insert into categories (name, slug) values
  ('Jeans', 'jeans'),
  ('Camisetas', 'camisetas'),
  ('Accesorios', 'accesorios'),
  ('Outerwear', 'outerwear'),
  ('Shorts', 'shorts')
on conflict (slug) do nothing;

insert into brands (name) values
  ('Supreme'),
  ('Carhartt WIP'),
  ('Stüssy'),
  ('Palace'),
  ('WTAPS'),
  ('A-COLD-WALL*'),
  ('Aimé Leon Dore'),
  ('Noah')
on conflict do nothing;
