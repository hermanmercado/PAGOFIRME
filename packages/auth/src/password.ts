import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/** Genera el hash de una contraseña en texto plano. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** Verifica una contraseña contra su hash. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
