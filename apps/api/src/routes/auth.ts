import {
  generateRefreshToken,
  hashPassword,
  hashToken,
  loginSchema,
  newTokenFamily,
  refreshSchema,
  registerSchema,
  signToken,
  verifyPassword,
  verifyToken,
  verifyTotp,
} from '@pagofirme/auth';
import { prisma } from '@pagofirme/db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { env } from '../env.js';
import type { AppEnv } from '../types.js';

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

async function issueTokens(userId: string, role: string, family: string, meta: {
  userAgent?: string;
  ipAddress?: string;
}) {
  const accessToken = await signToken({
    userId,
    role,
    type: 'access',
    expiresIn: env.JWT_ACCESS_TTL,
  });

  const { token: refreshToken, tokenHash } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      family,
      userAgent: meta.userAgent ?? null,
      ipAddress: meta.ipAddress ?? null,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

export const authRoutes = new Hono<AppEnv>()
  // ── Registro ──────────────────────────────────────────────
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const input = c.req.valid('json');

    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new HTTPException(409, { message: 'El correo ya está registrado' });
    }

    const user = await prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone ?? null,
        passwordHash: await hashPassword(input.password),
        fullName: input.fullName,
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    return c.json({ user }, 201);
  })

  // ── Login ─────────────────────────────────────────────────
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const input = c.req.valid('json');
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new HTTPException(401, { message: 'Credenciales inválidas' });
    }

    if (user.twoFactorEnabled) {
      if (!input.totp) {
        return c.json({ requires2fa: true }, 200);
      }
      if (!user.twoFactorSecret || !verifyTotp(input.totp, user.twoFactorSecret)) {
        throw new HTTPException(401, { message: 'Código 2FA inválido' });
      }
    }

    const tokens = await issueTokens(user.id, user.role, newTokenFamily(), {
      userAgent: c.req.header('User-Agent'),
      ipAddress: c.req.header('X-Forwarded-For'),
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return c.json({ ...tokens, user: { id: user.id, email: user.email, role: user.role } });
  })

  // ── Refresh (con rotación + detección de reuso) ───────────
  .post('/refresh', zValidator('json', refreshSchema), async (c) => {
    const { refreshToken } = c.req.valid('json');

    let claims;
    try {
      claims = await verifyToken(refreshToken, 'refresh');
    } catch {
      throw new HTTPException(401, { message: 'Refresh token inválido' });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(refreshToken) },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new HTTPException(401, { message: 'Sesión expirada' });
    }

    // Reuso de un token ya rotado → revocar toda la familia (posible robo).
    if (stored.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { family: stored.family, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new HTTPException(401, { message: 'Sesión revocada por seguridad' });
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await issueTokens(stored.userId, String(claims.role), stored.family, {
      userAgent: c.req.header('User-Agent'),
      ipAddress: c.req.header('X-Forwarded-For'),
    });

    return c.json(tokens);
  })

  // ── Logout ────────────────────────────────────────────────
  .post('/logout', zValidator('json', refreshSchema), async (c) => {
    const { refreshToken } = c.req.valid('json');
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return c.json({ ok: true });
  });
