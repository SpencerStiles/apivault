// Simple sliding-window rate limiter using in-memory storage.
// For production, replace with a Redis-based solution (e.g. @upstash/ratelimit).

interface RateLimitRecord {
  requests: number[]; // Unix timestamps (ms) of each request in the current window
  limit: number;
  windowMs: number;
}

const store = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp (ms) when the oldest request leaves the window
}

/**
 * Check whether an API key is within its rate limit.
 *
 * @param apiKeyId  Unique identifier for the API key
 * @param limit     Maximum number of requests allowed per window
 * @param windowMs  Window length in milliseconds (default: 1 hour)
 */
export function checkRateLimit(
  apiKeyId: string,
  limit: number,
  windowMs = 3_600_000,
): RateLimitResult {
  const now = Date.now();
  const record = store.get(apiKeyId) ?? { requests: [], limit, windowMs };

  // Remove timestamps that have fallen outside the current window
  record.requests = record.requests.filter((ts) => now - ts < windowMs);

  const resetAt =
    record.requests.length > 0
      ? record.requests[0] + windowMs
      : now + windowMs;

  if (record.requests.length >= limit) {
    store.set(apiKeyId, record);
    return { allowed: false, remaining: 0, resetAt };
  }

  record.requests.push(now);
  store.set(apiKeyId, record);

  return {
    allowed: true,
    remaining: limit - record.requests.length,
    resetAt,
  };
}
