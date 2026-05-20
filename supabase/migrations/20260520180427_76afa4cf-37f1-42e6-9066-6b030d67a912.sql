-- Checkout uses service-role server functions; revoke unnecessary anon INSERT
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create transactions" ON public.transactions;

-- Lock down has_role: only used internally by RLS policies (which run as definer)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
