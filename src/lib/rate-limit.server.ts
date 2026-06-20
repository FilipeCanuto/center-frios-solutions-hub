// Rate limiting for public server functions.
// - `rateLimit`: in-memory per-isolate fast path (best-effort)
// - `rateLimitDb`: durable Postgres-backed limiter (cross-isolate, authoritative)

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): { ok: boolean; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (b.count >= opts.limit) {
    return { ok: false, retryAfterMs: b.resetAt - now };
  }
  b.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

/**
 * Durable rate-limit check backed by the `rate_limit_hits` table.
 * Returns `{ ok: false }` when the bucket exceeded `limit` hits within
 * the rolling `windowSeconds`. Fails open (returns ok) on infra error so
 * a DB outage doesn't take down public forms — pair with `rateLimit`.
 */
export async function rateLimitDb(
  bucket: string,
  limit: number,
  windowSeconds: number,
): Promise<{ ok: boolean }> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: boolean | null; error: unknown }>)("check_rate_limit", {
      _bucket: bucket,
      _limit: limit,
      _window_seconds: windowSeconds,
    });
    if (error) {
      console.error("[rateLimitDb] rpc error:", error);
      return { ok: true };
    }
    return { ok: data === true };
  } catch (err) {
    console.error("[rateLimitDb] unexpected error:", err);
    return { ok: true };
  }
}
