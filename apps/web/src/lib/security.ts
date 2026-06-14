/**
 * Detección de fraude básica (demo, sin backend). El estado se persiste en
 * localStorage para que las alertas generadas por un rol (p. ej. el vendedor)
 * lleguen al dashboard del dueño, y para que el bloqueo de login sobreviva a la
 * navegación entre pantallas.
 */

export interface FraudAlert {
  id: string;
  time: string;
  title: string;
  desc: string;
}

const QR_KEY = 'pf:qr-events';
const ALERT_KEY = 'pf:fraud-alerts';
const LOGIN_KEY = 'pf:login-fails';

export const QR_WINDOW_MS = 60_000;
export const QR_LIMIT = 10;
export const LOGIN_LIMIT = 3;
export const LOCK_MS = 15 * 60_000;

/** Evento que se dispara cuando cambian las alertas (refresco en el mismo tab). */
export const FRAUD_EVENT = 'pf:fraud';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
}

function nowTime(): string {
  return new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
}

// ── Alertas de fraude (visibles para el dueño) ──────────────────────────────
export function getFraudAlerts(): FraudAlert[] {
  return read<FraudAlert[]>(ALERT_KEY, []);
}

export function addFraudAlert(title: string, desc: string) {
  const id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const next = [{ id, time: nowTime(), title, desc }, ...getFraudAlerts()].slice(0, 20);
  write(ALERT_KEY, next);
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(FRAUD_EVENT));
}

// ── Tasa de QR (> 10 por minuto por operador) ───────────────────────────────
export function recordQr(actor: string): { count: number; justFlagged: boolean } {
  const store = read<Record<string, number[]>>(QR_KEY, {});
  const cutoff = Date.now() - QR_WINDOW_MS;
  const events = (store[actor] ?? []).filter((t) => t > cutoff);
  events.push(Date.now());
  store[actor] = events;
  write(QR_KEY, store);
  const count = events.length;
  const justFlagged = count === QR_LIMIT + 1;
  if (justFlagged) {
    addFraudAlert(
      `Actividad inusual · ${actor}`,
      `${count} QR generados en menos de 1 minuto · posible fraude`,
    );
  }
  return { count, justFlagged };
}

// ── Venta inusual (> 3x el promedio del vendedor) ───────────────────────────
export function reportUnusualSale(actor: string, monto: number, avg: number) {
  addFraudAlert(
    `Venta inusual · ${actor}`,
    `Cobro Bs ${monto.toLocaleString('es-BO')} supera 3x el promedio (Bs ${avg})`,
  );
}

// ── Bloqueo de cuenta por intentos fallidos de login ────────────────────────
interface LoginState {
  count: number;
  lockUntil: number;
}

export function getLockRemaining(email: string): number {
  const store = read<Record<string, LoginState>>(LOGIN_KEY, {});
  const s = store[email];
  if (!s) return 0;
  return Math.max(0, s.lockUntil - Date.now());
}

export function recordFailedLogin(email: string): { remaining: number; locked: boolean } {
  const store = read<Record<string, LoginState>>(LOGIN_KEY, {});
  const s = store[email] ?? { count: 0, lockUntil: 0 };
  s.count += 1;
  let locked = false;
  if (s.count >= LOGIN_LIMIT) {
    s.lockUntil = Date.now() + LOCK_MS;
    s.count = 0;
    locked = true;
  }
  store[email] = s;
  write(LOGIN_KEY, store);
  return { remaining: Math.max(0, LOGIN_LIMIT - s.count), locked };
}

export function clearLogin(email: string) {
  const store = read<Record<string, LoginState>>(LOGIN_KEY, {});
  if (store[email]) {
    delete store[email];
    write(LOGIN_KEY, store);
  }
}
