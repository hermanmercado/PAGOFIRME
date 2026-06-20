import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
import type { UserRole } from '@prisma/client';
import { config as loadEnv } from 'dotenv';

// Ver nota en src/index.ts: @prisma/client es CJS con exports dinámicos.
const { PrismaClient, UserRole: Role } = pkg;

// El paquete es ESM ("type": "module"), donde __dirname no existe; lo derivamos.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

loadEnv({ path: path.resolve(__dirname, '../../../.env') });
loadEnv({ path: path.resolve(__dirname, '../.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Hash bcrypt (12 rounds) de la contraseña demo "PagoFirme2026".
// Embebido para que el seed no dependa de @pagofirme/auth.
const DEMO_HASH = '$2a$12$/tmYKHwu2pJb9dEGDdiQhOgbtXpbNaV1mQnjCZm2GjRSFurx75sLW';

// Bs → centavos.
const bs = (amount: number) => BigInt(amount * 100);

async function upsertUser(input: {
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  branchName?: string;
  payCode?: string;
  perTicketLimit?: bigint | null;
  businessUnitId?: string | null;
  supervisorId?: string | null;
}) {
  const data = {
    fullName: input.fullName,
    role: input.role,
    phone: input.phone ?? null,
    branchName: input.branchName ?? null,
    payCode: input.payCode ?? null,
    perTicketLimit: input.perTicketLimit ?? null,
    businessUnitId: input.businessUnitId ?? null,
    supervisorId: input.supervisorId ?? null,
    status: 'ACTIVE' as const,
    emailVerified: true,
  };
  return prisma.user.upsert({
    where: { email: input.email },
    update: data,
    create: { email: input.email, passwordHash: DEMO_HASH, ...data },
  });
}

async function main() {
  console.info('🌱 Sembrando datos demo de PagoFirme...');

  // ── Superadmin PagoFirme ───────────────────────────────────
  await upsertUser({
    email: 'admin@pagofirme.bo',
    fullName: 'Superadmin PagoFirme',
    role: Role.ADMIN,
  });

  // ── Dueño del negocio ──────────────────────────────────────
  const owner = await upsertUser({
    email: 'juan@cursosdigitales.bo',
    fullName: 'Juan Pérez',
    role: Role.DUENO,
  });

  // ── Unidad de negocio ──────────────────────────────────────
  const unit = await prisma.businessUnit.upsert({
    where: { id: 'cobana-academy' },
    update: { name: 'CobanaAcademy', active: true, perTicketLimit: bs(2000), ownerId: owner.id },
    create: {
      id: 'cobana-academy',
      name: 'CobanaAcademy',
      active: true,
      perTicketLimit: bs(2000), // NIVEL 2: límite del dueño (< BCB_MAX)
      ownerId: owner.id,
    },
  });

  // ── Supervisores (uno por sucursal/tienda) ─────────────────
  const supCentro = await upsertUser({
    email: 'marco@cursosdigitales.bo',
    fullName: 'Marco Gutiérrez',
    role: Role.SUPERVISOR,
    branchName: 'Tienda Centro',
    perTicketLimit: bs(2000),
    businessUnitId: unit.id,
  });

  const supSur = await upsertUser({
    email: 'rosa@cursosdigitales.bo',
    fullName: 'Rosa Mamani',
    role: Role.SUPERVISOR,
    branchName: 'Tienda Sur',
    payCode: 'rosa-sur',
    perTicketLimit: null, // sólo tope BCB (NIVEL 1)
    businessUnitId: unit.id,
  });

  // ── Vendedores ─────────────────────────────────────────────
  const vendedores: Array<{
    email: string;
    fullName: string;
    branchName: string;
    supervisorId: string;
    payCode?: string;
  }> = [
    {
      email: 'carlos@cursosdigitales.bo',
      fullName: 'Carlos Arias',
      branchName: 'Tienda Centro',
      supervisorId: supCentro.id,
      payCode: 'carlos-centro',
    },
    {
      email: 'jrojas@cursosdigitales.bo',
      fullName: 'Juan Rojas',
      branchName: 'Tienda Centro',
      supervisorId: supCentro.id,
    },
    {
      email: 'lmamani@cursosdigitales.bo',
      fullName: 'Luis Mamani',
      branchName: 'Tienda Centro',
      supervisorId: supCentro.id,
    },
    {
      email: 'mlopez@cursosdigitales.bo',
      fullName: 'María López',
      branchName: 'Tienda Sur',
      supervisorId: supSur.id,
    },
    {
      email: 'apereira@cursosdigitales.bo',
      fullName: 'Ana Pereira',
      branchName: 'Tienda Sur',
      supervisorId: supSur.id,
    },
  ];

  for (const v of vendedores) {
    await upsertUser({
      email: v.email,
      fullName: v.fullName,
      role: Role.VENDEDOR,
      branchName: v.branchName,
      payCode: v.payCode,
      businessUnitId: unit.id,
      supervisorId: v.supervisorId,
    });
  }

  console.info(
    `✅ Demo lista: 1 admin, 1 dueño, 1 unidad (${unit.name}), 2 supervisores, ${vendedores.length} vendedores.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
