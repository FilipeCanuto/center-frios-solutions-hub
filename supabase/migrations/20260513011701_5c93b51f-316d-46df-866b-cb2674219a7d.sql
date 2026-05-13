create table public.quote_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  segment text,
  product_interest text,
  message text,
  source text
);

alter table public.quote_leads enable row level security;

create policy "Anyone can submit a quote lead"
  on public.quote_leads
  for insert
  to anon, authenticated
  with check (true);
