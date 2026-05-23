// Simple in-memory IP rate limiter for public server functions.
// Per-instance only (best-effort); pair with edge-level limits in production.

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
