-- Ensure RLS is enabled
ALTER TABLE public.quote_leads ENABLE ROW LEVEL SECURITY;

-- Grants: allow anon to insert leads via contact form; allow authenticated to read (gated by policy); service_role full
GRANT INSERT ON public.quote_leads TO anon;
GRANT SELECT ON public.quote_leads TO authenticated;
GRANT ALL ON public.quote_leads TO service_role;

-- Policies
DROP POLICY IF EXISTS "Anyone can submit a quote lead" ON public.quote_leads;
CREATE POLICY "Anyone can submit a quote lead"
  ON public.quote_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all quote leads" ON public.quote_leads;
CREATE POLICY "Admins can view all quote leads"
  ON public.quote_leads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));