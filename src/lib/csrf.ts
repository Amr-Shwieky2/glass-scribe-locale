/**
 * Stateless CSRF tokens for the public contact form: HMAC-signed with
 * CSRF_SECRET, valid for 1 hour. Fails closed when the secret is missing.
 * Server-only.
 */
import { createSignedToken, verifySignedToken } from './signed-token';

const TOKEN_TYPE = 'csrf';
export const CSRF_TTL_SECONDS = 60 * 60;

function getSecret(): string | null {
  const secret = process.env.CSRF_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isCsrfConfigured(): boolean {
  return getSecret() !== null;
}

export function issueCsrfToken(): string | null {
  const secret = getSecret();
  return secret ? createSignedToken(TOKEN_TYPE, CSRF_TTL_SECONDS, secret).token : null;
}

export function verifyCsrfToken(token: unknown): boolean {
  const secret = getSecret();
  return !!secret && verifySignedToken(token, TOKEN_TYPE, secret) !== null;
}
