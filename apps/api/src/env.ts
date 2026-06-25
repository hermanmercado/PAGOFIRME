import { z } from 'zod';

/** Longitud mínima exigida para los secretos que firman los JWT. */
const MIN_SECRET_LENGTH = 64;

/**
 * Patrones de placeholder / valores de ejemplo que NO deben aceptarse como
 * secretos válidos. Si alguien despliega con uno de estos, la app debe fallar.
 */
const PLACEHOLDER_PATTERNS = [
  'cambia-esto',
  'cambiar',
  'ejemplo',
  'example',
  'changeme',
  'change-me',
  'placeholder',
  'tu-secreto',
  'your-secret',
  'secreto-largo',
  'secret-key',
  'mysecret',
];

/**
 * Valida un secreto de firma de JWT: exige longitud mínima, rechaza
 * placeholders conocidos y secretos de baja entropía (pocos caracteres
 * distintos). Devuelve un mensaje claro cuando es inseguro.
 */
function jwtSecret(name: string) {
  return z
    .string({ required_error: `${name} es obligatorio` })
    .min(
      MIN_SECRET_LENGTH,
      `${name} debe tener al menos ${MIN_SECRET_LENGTH} caracteres. ` +
        'Generá uno fuerte con: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'base64url\'))"',
    )
    .refine(
      (val) => {
        const lower = val.toLowerCase();
        return !PLACEHOLDER_PATTERNS.some((p) => lower.includes(p));
      },
      {
        message:
          `${name} parece ser un valor de ejemplo/placeholder. ` +
          'Reemplazalo por un secreto aleatorio real (NO el de .env.example).',
      },
    )
    .refine((val) => new Set(val).size >= 16, {
      message:
        `${name} tiene muy poca variedad de caracteres (baja entropía). ` +
        'Usá un secreto aleatorio criptográficamente seguro.',
    });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().default(3001),
  API_HOST: z.string().default('0.0.0.0'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: jwtSecret('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: jwtSecret('JWT_REFRESH_SECRET'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  • ${i.path.join('.') || '(env)'}: ${i.message}`)
    .join('\n');
  // Fallar al arrancar con un mensaje claro, en vez de arrancar inseguro.
  console.error(
    '\n❌ Configuración de entorno inválida. La aplicación no puede arrancar:\n' +
      issues +
      '\n',
  );
  throw new Error('Variables de entorno inválidas (ver detalle arriba).');
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
