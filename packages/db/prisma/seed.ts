import path from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
import type { RailType } from '@prisma/client';
import { config as loadEnv } from 'dotenv';

// Ver nota en src/index.ts: @prisma/client es CJS con exports dinámicos.
const { PrismaClient, RailType: Rail } = pkg;

loadEnv({ path: path.resolve(__dirname, '../../../.env') });
loadEnv({ path: path.resolve(__dirname, '../.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.info('🌱 Sembrando rieles de pago iniciales...');

  const rails: Array<{
    code: string;
    type: RailType;
    displayName: string;
    provider: string | null;
    priority: number;
  }> = [
    {
      code: 'SIMPLE_QR',
      type: Rail.BANK_QR,
      displayName: 'QR Interoperable (Simple)',
      provider: 'ASFI',
      priority: 10,
    },
    {
      code: 'TIGO_MONEY',
      type: Rail.WALLET,
      displayName: 'Tigo Money',
      provider: 'Tigo',
      priority: 20,
    },
    {
      code: 'PAGOFIRME_INTERNAL',
      type: Rail.INTERNAL,
      displayName: 'Transferencia interna PagoFirme',
      provider: null,
      priority: 30,
    },
  ];

  for (const rail of rails) {
    await prisma.paymentRail.upsert({
      where: { code: rail.code },
      update: {},
      create: rail,
    });
  }

  console.info(`✅ ${rails.length} rieles de pago listos.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
