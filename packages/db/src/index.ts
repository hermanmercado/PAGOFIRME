import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
import type { PrismaClient } from '@prisma/client';

// `@prisma/client` (Prisma 7) es CommonJS y expone sus miembros mediante un
// spread dinámico (`module.exports = { ...require('.prisma/client/default') }`),
// que el detector de named-exports de Node no puede analizar bajo ESM. Por eso
// importamos el default (= module.exports) y desestructuramos el constructor.
const { PrismaClient: PrismaClientCtor } = pkg;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Falta la variable de entorno DATABASE_URL');
  }

  // Prisma 7 usa driver adapters para la conexión a la base de datos.
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClientCtor({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });
}

/**
 * Cliente singleton de Prisma.
 * En desarrollo reutilizamos la instancia para evitar agotar el pool de
 * conexiones por el hot-reload.
 */
export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Re-exportamos los tipos (modelos, enums, inputs) para los consumidores.
export type * from '@prisma/client';
