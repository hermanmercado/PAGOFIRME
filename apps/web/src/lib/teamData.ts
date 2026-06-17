/** Datos de demostración del equipo (supervisores, vendedores, rankings). */

import { BCB_MAX } from './caja';

export interface VendRow {
  ini: string;
  name: string;
  tix: number;
  monto: string;
}

export interface RankRow {
  n: string;
  v: string;
  p: number;
}

export interface SupData {
  id: 'sup1' | 'sup2';
  av: string;
  name: string;
  role: string;
  tienda: string;
  tiendaShort: string;
  ventas: string;
  tix: string;
  vcount: string;
  repTotal: string;
  ticketStart: number;
  /** Límite por ticket de la sucursal (NIVEL 2). Siempre <= BCB_MAX. */
  limit: number;
  vends: VendRow[];
  ranking: RankRow[];
}

export const SUP_CENTRO: SupData = {
  id: 'sup1',
  av: 'MG',
  name: 'Marco Gutiérrez',
  role: 'Supervisor · Tienda Centro',
  tienda: 'Tienda Centro',
  tiendaShort: 'Centro',
  ventas: 'Bs 4,280',
  tix: '34',
  vcount: '3 vendedores',
  repTotal: 'Bs 19,400',
  ticketStart: 11,
  limit: 2000, // NIVEL 2: límite del dueño (menor al BCB)
  vends: [
    { ini: 'CA', name: 'Carlos Arias', tix: 12, monto: 'Bs 1,840' },
    { ini: 'JR', name: 'Juan Rojas', tix: 11, monto: 'Bs 1,620' },
    { ini: 'LM', name: 'Luis Mamani', tix: 11, monto: 'Bs 820' },
  ],
  ranking: [
    { n: 'Carlos Arias', v: 'Bs 7,200', p: 100 },
    { n: 'Juan Rojas', v: 'Bs 6,800', p: 94 },
    { n: 'Luis Mamani', v: 'Bs 5,400', p: 75 },
  ],
};

export const SUP_SUR: SupData = {
  id: 'sup2',
  av: 'RM',
  name: 'Rosa Mamani',
  role: 'Supervisora · Tienda Sur',
  tienda: 'Tienda Sur',
  tiendaShort: 'Sur',
  ventas: 'Bs 2,200',
  tix: '20',
  vcount: '2 vendedores',
  repTotal: 'Bs 11,800',
  ticketStart: 11,
  limit: BCB_MAX, // solo tope BCB (NIVEL 1), sin límite del dueño
  vends: [
    { ini: 'ML', name: 'María López', tix: 12, monto: 'Bs 1,350' },
    { ini: 'AP', name: 'Ana Pereira', tix: 8, monto: 'Bs 850' },
  ],
  ranking: [
    { n: 'María López', v: 'Bs 6,100', p: 100 },
    { n: 'Ana Pereira', v: 'Bs 5,700', p: 93 },
  ],
};

export const OWNER_RANKING: RankRow[] = [
  { n: 'Carlos Arias (Centro)', v: 'Bs 7,200', p: 100 },
  { n: 'Juan Rojas (Centro)', v: 'Bs 6,800', p: 94 },
  { n: 'María López (Sur)', v: 'Bs 6,100', p: 85 },
  { n: 'Ana Pereira (Sur)', v: 'Bs 5,700', p: 79 },
  { n: 'Luis Mamani (Centro)', v: 'Bs 5,400', p: 75 },
];
