/** Tipos y utilidades compartidas por las cajas registradoras (vendedor y supervisor). */

export interface Linea {
  expr: string;
  monto: number;
}

export interface Ticket {
  id: string;
  hora: string;
  total: number;
  lineas: Linea[];
  /** Epoch ms del cobro; habilita el filtro por fecha del historial. */
  ts: number;
}

export const ticketId = (n: number) => `#T-0${String(n).padStart(3, '0')}`;

export const bs = (n: number) =>
  n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TICKETS_KEY = 'pf:vendor-tickets';

/** Carga los tickets cobrados persistidos (sobreviven cambios de pestaña y recargas). */
export function loadTickets(): Ticket[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TICKETS_KEY);
    return raw ? (JSON.parse(raw) as Ticket[]) : [];
  } catch {
    return [];
  }
}

export function saveTickets(tickets: Ticket[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Evalúa una expresión con sólo dígitos, '.', '+' y '*', respetando precedencia. */
export function evalExpr(expr: string): number | null {
  if (!expr) return null;
  let sum = 0;
  for (const term of expr.split('+')) {
    if (term === '') return null;
    let prod = 1;
    for (const factor of term.split('*')) {
      if (factor === '') return null;
      const n = Number(factor);
      if (!Number.isFinite(n)) return null;
      prod *= n;
    }
    sum += prod;
  }
  return Number.isFinite(sum) ? sum : null;
}
