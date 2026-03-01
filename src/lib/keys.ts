import crypto from 'crypto';

const PREFIX = 'av_sk_';

/**
 * Generate a new API key with a random 32-byte hex value.
 * Returns { key, prefix, hash }.
 */
export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const raw = crypto.randomBytes(32).toString('hex');
  const key = `${PREFIX}${raw}`;
  const prefix = key.slice(0, 14);
  const hash = hashKey(key);
  return { key, prefix, hash };
}

/**
 * Hash an API key using SHA-256.
 */
export function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Mask a key prefix for display: show first 14 chars + dots.
 */
export function maskKey(prefix: string): string {
  return `${prefix}${'•'.repeat(16)}`;
}
