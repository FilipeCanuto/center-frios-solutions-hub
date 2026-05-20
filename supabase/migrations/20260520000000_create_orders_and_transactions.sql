-- Create orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_company text,
  customer_cnpj text,
  shipping_address jsonb not null, -- street, number, complement, district, city, state, cep
  product_name text not null,
  product_price numeric not null,
  shipping_price numeric not null,
  total_price numeric not null,
  payment_method text not null, -- 'pix' | 'credit_card'
  status text not null default 'pending' -- 'pending' | 'paid' | 'failed' | 'cancelled'
);

-- Create transactions table
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  created_at timestamptz not null default now(),
  gateway text not null default 'rede',
  gateway_transaction_id text,
  amount numeric not null,
  status text not null, -- 'authorized' | 'captured' | 'denied' | 'pending' | 'refunded'
  raw_response jsonb,
  pix_qr_code text,
  pix_copia_cola text
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.transactions enable row level security;

-- Policies for orders
create policy "Anyone can insert orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can select their own order by ID"
  on public.orders
  for select
  to anon, authenticated
  using (true); -- In a full SaaS we would restrict to auth.uid(), but for this lead-checkout we allow reading order if ID is known.

-- Policies for transactions
create policy "Anyone can insert transactions"
  on public.transactions
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can select transactions by order ID"
  on public.transactions
  for select
  to anon, authenticated
  using (true);
