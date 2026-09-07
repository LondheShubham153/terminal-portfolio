import "server-only";

// Process-local rate limiter. Appropriate for a single-instance personal
// portfolio; resets on server restart and does not coordinate across instances.
const buckets = new Map<string, { count: number; firstAttemptAt: number }>();

export function checkRateLimit(
  bucket: string,
  identifier: string,
  { maxAttempts, windowMs }: { maxAttempts: number; windowMs: number },
): { allowed: boolean; retryAfterMs?: number } {
  const key = `${bucket}:${identifier}`;
  const now = Date.now();

  // Evict only entries in this same bucket, using this call's window — buckets
  // (e.g. "login" vs "contact") have different windows and must not evict each other.
  for (const [k, v] of buckets) {
    if (k.startsWith(`${bucket}:`) && now - v.firstAttemptAt > windowMs) {
      buckets.delete(k);
    }
  }

  const entry = buckets.get(key);

  if (!entry || now - entry.firstAttemptAt > windowMs) {
    buckets.set(key, { count: 1, firstAttemptAt: now });
    return { allowed: true };
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, retryAfterMs: windowMs - (now - entry.firstAttemptAt) };
  }

  entry.count += 1;
  return { allowed: true };
}

export function resetRateLimit(bucket: string, identifier: string) {
  buckets.delete(`${bucket}:${identifier}`);
}
