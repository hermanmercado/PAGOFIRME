import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export type TokenType = 'access' | 'refresh';

export interface AppTokenClaims extends JWTPayload {
  sub: string; // userId
  role: string;
  type: TokenType;
}

const encoder = new TextEncoder();

function secretFor(type: TokenType): Uint8Array {
  const value =
    type === 'access' ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET;
  if (!value) {
    throw new Error(`Falta el secreto JWT para tokens de tipo "${type}"`);
  }
  return encoder.encode(value);
}

export interface SignTokenOptions {
  userId: string;
  role: string;
  type: TokenType;
  /** Tiempo de expiración (ej. "15m", "30d"). */
  expiresIn: string;
}

/** Firma un JWT (access o refresh). */
export async function signToken(opts: SignTokenOptions): Promise<string> {
  return new SignJWT({ role: opts.role, type: opts.type })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(opts.userId)
    .setIssuedAt()
    .setIssuer('pagofirme')
    .setExpirationTime(opts.expiresIn)
    .sign(secretFor(opts.type));
}

/** Verifica y decodifica un JWT del tipo indicado. */
export async function verifyToken(token: string, type: TokenType): Promise<AppTokenClaims> {
  const { payload } = await jwtVerify(token, secretFor(type), {
    issuer: 'pagofirme',
  });
  if (payload.type !== type) {
    throw new Error('Tipo de token inválido');
  }
  return payload as AppTokenClaims;
}
