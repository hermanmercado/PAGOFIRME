import { randomBytes } from 'node:crypto';
import { authenticator } from 'otplib';

const ISSUER = process.env.TOTP_ISSUER ?? 'PagoFirme';

/** Genera un secreto TOTP base32 para asociar a un usuario. */
export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

/** Construye la URI otpauth:// para mostrar como QR en la app autenticadora. */
export function buildTotpUri(account: string, secret: string): string {
  return authenticator.keyuri(account, ISSUER, secret);
}

/** Verifica un código TOTP de 6 dígitos contra el secreto del usuario. */
export function verifyTotp(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}

/** Genera códigos de respaldo (uso único) para recuperación de 2FA. */
export function generateBackupCodes(count = 10): string[] {
  return Array.from({ length: count }, () =>
    randomBytes(5).toString('hex').toUpperCase().match(/.{1,5}/g)!.join('-'),
  );
}
