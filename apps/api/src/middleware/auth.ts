import { verifyToken } from '@pagofirme/auth';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { AppEnv } from '../types.js';

/** Exige un access token JWT válido en el header Authorization. */
export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Token de acceso requerido' });
  }

  const token = header.slice('Bearer '.length);
  try {
    const claims = await verifyToken(token, 'access');
    c.set('userId', claims.sub);
    c.set('userRole', claims.role);
  } catch {
    throw new HTTPException(401, { message: 'Token inválido o expirado' });
  }

  await next();
});

/** Restringe el acceso a los roles indicados. */
export function requireRole(...roles: string[]) {
  return createMiddleware<AppEnv>(async (c, next) => {
    if (!roles.includes(c.get('userRole'))) {
      throw new HTTPException(403, { message: 'No autorizado' });
    }
    await next();
  });
}
