import { createHash, randomBytes, randomUUID } from 'node:crypto';

/**
 * Genera un refresh token opaco (alta entropía) junto con su hash SHA-256.
 * Solo el hash se persiste; el valor en claro se entrega una única vez al cliente.
 */
export function generateRefreshToken(): { token: string; tokenHash: string } {
  const token = randomBytes(48).toString('base64url');
  return { token, tokenHash: hashToken(token) };
}

/** Hash determinístico para almacenar/comparar refresh tokens. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Identificador de familia para la rotación de refresh tokens. */
export function newTokenFamily(): string {
  return randomUUID();
}
