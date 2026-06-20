
-- 1. quote_leads: remove permissive "always true" anon INSERT
DROP POLICY IF EXISTS "Anyone can submit a quote lead" ON public.quote_leads;
REVOKE INSERT ON public.quote_leads FROM anon, authenticated;
GRANT INSERT, SELECT ON public.quote_leads TO service_role;

-- 2. orders / transactions: explicit deny for client roles
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;
REVOKE ALL ON public.transactions FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.transactions TO service_role;

-- 3. Durable rate-limit table + function
CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  id bigserial PRIMARY KEY,
  bucket text NOT NULL,
  hit_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_bucket_time
  ON public.rate_limit_hits (bucket, hit_at DESC);

GRANT ALL ON public.rate_limit_hits TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.rate_limit_hits_id_seq TO service_role;

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon/authenticated; service_role bypasses RLS.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _bucket text,
  _limit int,
  _window_seconds int
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count int;
BEGIN
  DELETE FROM public.rate_limit_hits
   WHERE bucket = _bucket
     AND hit_at < now() - make_interval(secs => _window_seconds);

  SELECT count(*) INTO _count
    FROM public.rate_limit_hits
   WHERE bucket = _bucket
     AND hit_at > now() - make_interval(secs => _window_seconds);

  IF _count >= _limit THEN
    RETURN false;
  END IF;

  INSERT INTO public.rate_limit_hits (bucket) VALUES (_bucket);
  RETURN true;
END;
$$;

-- 4. Lock down SECURITY DEFINER fns
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, int, int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, int, int) TO service_role;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
