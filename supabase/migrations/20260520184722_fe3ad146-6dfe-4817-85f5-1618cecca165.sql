CREATE INDEX IF NOT EXISTS idx_transactions_order_tid
  ON public.transactions (order_id, gateway_transaction_id);