import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

// En Prisma 7 la carga automática de .env está deshabilitada cuando existe
// prisma.config.ts, así que la hacemos explícitamente. Buscamos el .env de la
// raíz del monorepo y, como fallback, el local del paquete.
loadEnv({ path: path.resolve(__dirname, '../../.env') });
loadEnv({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
  // La URL de conexión para Migrate / Introspect vive ahora aquí (ya no en el schema).
  // Leemos process.env directamente (en vez del helper env() que lanza error) para
  // que `prisma generate` —usado en postinstall— funcione aunque falte DATABASE_URL.
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
