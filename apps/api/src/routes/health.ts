import { prisma } from '@pagofirme/db';
import { Hono } from 'hono';
import type { AppEnv } from '../types.js';

export const healthRoutes = new Hono<AppEnv>()
  .get('/', (c) => c.json({ status: 'ok', service: 'pagofirme-api' }))
  .get('/ready', async (c) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return c.json({ status: 'ready', db: 'up' });
    } catch {
      return c.json({ status: 'degraded', db: 'down' }, 503);
    }
  });
