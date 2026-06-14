/**
 * QR diario automático. El vendedor lo activa en su Perfil; el dueño puede
 * desactivarlo globalmente. Si está habilitado, al abrir la app se muestra el
 * QR del día (una vez por día) antes de la caja. El código cambia cada día.
 */

const VENDOR_KEY = 'pf:daily-qr-vendor';
const GLOBAL_KEY = 'pf:daily-qr-global';
const SEEN_KEY = 'pf:daily-qr-seen';

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : raw === 'true';
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Clave del día en hora local (YYYY-MM-DD). */
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/** Código del QR determinista por día (mismo día → mismo código). */
export function dailyQrCode(): string {
  const key = todayKey();
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = (h >>> 0) % 1_000_000;
  return `PF-${key.replace(/-/g, '')}-${String(n).padStart(6, '0')}`;
}

/** Fecha legible para mostrar en el QR del día. */
export function todayLabel(): string {
  return new Date().toLocaleDateString('es-BO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export const getVendorDailyQr = () => readBool(VENDOR_KEY, true);
export const setVendorDailyQr = (on: boolean) => writeBool(VENDOR_KEY, on);
export const getGlobalDailyQr = () => readBool(GLOBAL_KEY, true);
export const setGlobalDailyQr = (on: boolean) => writeBool(GLOBAL_KEY, on);

/** Habilitado sólo si el dueño no lo desactivó globalmente y el vendedor lo activó. */
export const dailyQrEnabled = () => getGlobalDailyQr() && getVendorDailyQr();

export function dailyQrSeenToday(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(SEEN_KEY) === todayKey();
  } catch {
    return true;
  }
}

export function markDailyQrSeen() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SEEN_KEY, todayKey());
  } catch {
    /* almacenamiento no disponible */
  }
}
