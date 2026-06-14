import { serve } from '@hono/node-server';
import { prisma } from '@pagofirme/db';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { env } from './env.js';
import { requireAuth } from './middleware/auth.js';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import type { AppEnv } from './types.js';

const app = new Hono<AppEnv>();

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  }),
);

// ── Rutas ──────────────────────────────────────────────────
app.route('/health', healthRoutes);
app.route('/auth', authRoutes);

// Ejemplo de ruta protegida.
app.get('/me', requireAuth, async (c) => {
  const user = await prisma.user.findUnique({
    where: { id: c.get('userId') },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      twoFactorEnabled: true,
    },
  });
  return c.json({ user });
});

// ── Manejo de errores ──────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error('Error no controlado:', err);
  return c.json({ error: 'Error interno del servidor' }, 500);
});

app.notFound((c) => c.json({ error: 'Recurso no encontrado' }, 404));

serve({ fetch: app.fetch, port: env.API_PORT, hostname: env.API_HOST }, (info) => {
  console.info(`🚀 API PagoFirme escuchando en http://${env.API_HOST}:${info.port}`);
});

export type AppType = typeof app;
