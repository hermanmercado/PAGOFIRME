/**
 * Links de cobro públicos (QRticket público) — features 1 y 4.
 *
 * Cada vendedor tiene un `codigo` estable que vive en la URL pública
 * `pagofirme.bo/pagar/[codigo]`. La página no requiere login: cualquier cliente
 * la abre, ingresa el monto y obtiene un QRticket instantáneo para escanear.
 *
 * El registro es estático (demo): resuelve códigos conocidos y, para cualquier
 * otro, devuelve un comercio genérico para que un link compartido nunca dé 404.
 */

/** Dominio público con el que se comparten los links (WhatsApp, Instagram, etc.). */
export const PUBLIC_HOST = 'pagofirme.bo';

/** Código de cobro del vendedor demo (Carlos Arias · Tienda Centro). */
export const VENDOR_PAY_CODE = 'carlos-centro';

export interface PayLinkInfo {
  /** Código que aparece en la URL pública. */
  codigo: string;
  /** Negocio dueño del cobro. */
  negocio: string;
  /** Vendedor/operador que recibe el cobro. */
  vendedor: string;
  /** Sucursal o ubicación. */
  sucursal: string;
  /** Iniciales para el avatar. */
  iniciales: string;
  /** true solo si el código está registrado; el fallback genérico es false. */
  verified: boolean;
}

const REGISTRY: Record<string, PayLinkInfo> = {
  [VENDOR_PAY_CODE]: {
    codigo: VENDOR_PAY_CODE,
    negocio: 'Cursos Digitales Bolivia',
    vendedor: 'Carlos Arias',
    sucursal: 'Tienda Centro',
    iniciales: 'CA',
    verified: true,
  },
  'rosa-sur': {
    codigo: 'rosa-sur',
    negocio: 'Cursos Digitales Bolivia',
    vendedor: 'Rosa Mamani',
    sucursal: 'Tienda Sur · El Alto',
    iniciales: 'RM',
    verified: true,
  },
};

/** Iniciales a partir de un nombre («Cobro directo» → «CD»). */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'PF';
  const first = parts[0]![0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? '') : '';
  return (first + last).toUpperCase() || 'PF';
}

/**
 * Resuelve un código a su negocio/vendedor. Para códigos desconocidos devuelve
 * un comercio genérico (con el propio código como referencia) — un link
 * compartido siempre renderiza algo válido.
 */
export function resolvePayLink(codigo: string): PayLinkInfo {
  const key = codigo.trim().toLowerCase();
  const found = REGISTRY[key];
  if (found) return found;
  return {
    codigo: key || 'pagofirme',
    negocio: 'Negocio en PagoFirme',
    vendedor: 'Cobro directo',
    sucursal: 'Bolivia',
    iniciales: initials('Cobro directo'),
    verified: false,
  };
}

/** URL pública branded del link de cobro (para compartir). */
export function payUrl(codigo: string): string {
  return `${PUBLIC_HOST}/pagar/${encodeURIComponent(codigo)}`;
}

/** Clave del día en hora local (YYYYMMDD). */
function dayStamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/**
 * Código de QRticket determinista a partir del código de cobro + monto. El mismo
 * monto reusa el mismo código (idempotente en la sesión), y alimenta a `QrMatrix`
 * para que el patrón cambie con el monto.
 */
export function payTicketCode(codigo: string, monto: number): string {
  const seed = `${dayStamp()}|${codigo.toLowerCase()}|${monto.toFixed(2)}`;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = (h >>> 0) % 1_000_000;
  return `PF-PG-${String(n).padStart(6, '0')}`;
}

/**
 * Mensaje pre-armado para cobrar por WhatsApp (feature 2). Se mantiene acá para
 * que el dominio y el formato del link vivan en un solo lugar.
 */
export function buildPayMessage(monto: number, codigo: string): string {
  const m = monto.toLocaleString('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `¡Hola! Tu cobro es de Bs ${m}. Pagá escaneando este QRticket: ${payUrl(codigo)}`;
}

/** Link `https://wa.me/?text=...` que abre WhatsApp con el mensaje pre-armado. */
export function whatsappShareUrl(monto: number, codigo: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildPayMessage(monto, codigo))}`;
}
