
-- Orders table for storing customer purchases
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_company text,
  customer_cnpj text,
  shipping_address jsonb NOT NULL,
  product_name text NOT NULL,
  product_price numeric(12,2) NOT NULL,
  shipping_price numeric(12,2) NOT NULL DEFAULT 0,
  total_price numeric(12,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('pix','credit_card','debit_card','boleto')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','cancelled'))
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- No public access; only service-role (server fns) can read/write
CREATE POLICY "Service role manages orders"
  ON public.orders FOR ALL
  USING (false)
  WITH CHECK (false);

-- Transactions table for gateway responses
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway text NOT NULL DEFAULT 'rede',
  gateway_transaction_id text,
  amount numeric(12,2) NOT NULL,
  status text NOT NULL,
  pix_qr_code text,
  pix_copia_cola text,
  raw_response jsonb
);

CREATE INDEX idx_transactions_order_id ON public.transactions(order_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages transactions"
  ON public.transactions FOR ALL
  USING (false)
  WITH CHECK (false);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Allow reading order status by id for PIX polling (read-only, status column only via server fn).
-- We keep RLS locked; the client polls through a server fn instead.
