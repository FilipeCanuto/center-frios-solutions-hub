# Security Hardening Plan — 6 Findings

Visual/UX is untouched. All changes are backend/RLS/server-fn hardening.

## Audit Summary (what's actually wrong vs already safe)

| # | Finding | Current state | Action |
|---|---|---|---|
| 1 | service_role in client bundle | Used **only** in `src/integrations/supabase/client.server.ts` (server-only, gated by filename). Browser uses `VITE_SUPABASE_PUBLISHABLE_KEY`. | Verify + add lint guard |
| 2 | RLS INSERT on orders/transactions | Tables deny all client INSERT. Server fn writes via `supabaseAdmin`. Works, but no defense-in-depth. | Add explicit deny-all + documented service_role path |
| 3 | "always true" policy | `quote_leads.INSERT (anon,authenticated) check:true` is the offender. | Replace with field-shape + per-row constraints; route writes through server fn only |
| 4 | Rate-limit for public leads | In-memory `Map` in `rate-limit.server.ts` — resets per worker isolate, useless under load. | Add Postgres-backed `rate_limit_hits` table + `check_rate_limit()` SECURITY DEFINER fn |
| 5 | SECURITY DEFINER abuse | `has_role` (safe, idempotent) + `set_updated_at` (trigger). No public-callable admin fn today. | Explicit `REVOKE EXECUTE ... FROM public, anon`; `GRANT` only to required roles |
| 6 | (bonus) Anon write surface | `quote_leads` exposes anon INSERT directly. | Revoke anon INSERT; only server fn (service_role) writes |

## Migration (single file)

```sql
-- 1. quote_leads: remove "always true" anon INSERT; force server-fn path
DROP POLICY IF EXISTS "Anyone can submit a quote lead" ON public.quote_leads;
REVOKE INSERT ON public.quote_leads FROM anon, authenticated;
-- service_role keeps ALL (already implicit via GRANT ALL)
GRANT INSERT ON public.quote_leads TO service_role;

-- 2. orders / transactions: explicit deny for client roles (defense-in-depth)
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon, authenticated;
REVOKE ALL ON public.transactions FROM anon, authenticated;
GRANT ALL ON public.orders, public.transactions TO service_role;

-- 3. Rate-limit table (durable, cross-isolate)
CREATE TABLE public.rate_limit_hits (
  id bigserial PRIMARY KEY,
  bucket text NOT NULL,
  hit_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_rate_limit_bucket_time ON public.rate_limit_hits (bucket, hit_at DESC);
ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- no policies => only service_role (bypass) can read/write
GRANT ALL ON public.rate_limit_hits TO service_role;

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _bucket text, _limit int, _window_seconds int
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _count int;
BEGIN
  DELETE FROM public.rate_limit_hits
   WHERE hit_at < now() - (_window_seconds || ' seconds')::interval
     AND bucket = _bucket;
  SELECT count(*) INTO _count FROM public.rate_limit_hits
   WHERE bucket = _bucket
     AND hit_at > now() - (_window_seconds || ' seconds')::interval;
  IF _count >= _limit THEN RETURN false; END IF;
  INSERT INTO public.rate_limit_hits (bucket) VALUES (_bucket);
  RETURN true;
END $$;

-- 4. Lock SECURITY DEFINER fns
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text,int,int) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text,int,int) TO service_role;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon;
-- authenticated keeps EXECUTE (needed by RLS policies)
```

## Code changes

- **`src/lib/rate-limit.server.ts`** — add `rateLimitDb(bucket, limit, windowSeconds)` calling `supabaseAdmin.rpc('check_rate_limit', ...)`. Keep in-memory `rateLimit` as fast pre-check.
- **`src/lib/leads.functions.ts`** — replace `rateLimit(...)` with `await rateLimitDb(...)` for IP + email buckets.
- **`src/lib/payments.functions.ts`** — same swap for `pay:ip:*` and `pay:email:*` buckets.
- **`src/integrations/supabase/client.ts`** — add runtime guard: throw if a key starting with `sb_secret_` or the JWT `service_role` claim is detected (prevents accidental misconfiguration).
- **No UI changes.** No changes to `Pa7ProLanding.tsx`, `CheckoutDialog.tsx`, hero, etc.

## Verification

1. `supabase--linter` clean.
2. Submit lead 10× rapidly → 4th+ blocked (durable across reloads).
3. Browser DevTools → confirm `window.__SUPABASE` / bundle has only the publishable key.
4. From browser console: `supabase.from('quote_leads').insert({...})` → 401/403.
5. From browser console: `supabase.rpc('check_rate_limit', ...)` → permission denied.
6. Admin login still loads `/admin/pedidos` (has_role still works for `authenticated`).
7. PIX + credit-card checkout end-to-end still succeeds.

## Out of scope (won't touch)

`handlePayment`, `processPayment` business logic, Zod schemas, e-Rede integration, UI/CSS, design tokens, button variants, `CheckoutDialog` markup.

Approve to apply.
