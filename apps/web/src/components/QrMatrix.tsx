import * as React from 'react';

/**
 * Matriz tipo QR determinista, generada 100% en el cliente (sin librerías ni
 * llamadas al servidor) → instantánea. El mismo `code` produce siempre el mismo
 * patrón, así que cambia sólo cuando cambia el código (una vez por día).
 */
export interface QrMatrixProps {
  code: string;
  size?: number;
  className?: string;
  /** Texto accesible. Es una matriz decorativa (demo), no un QR escaneable. */
  label?: string;
}

const N = 25;
const FINDER = 7;

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), 1 | t);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inFinder(r: number, c: number): boolean {
  const zone = (r0: number, c0: number) => r >= r0 && r < r0 + FINDER && c >= c0 && c < c0 + FINDER;
  return zone(0, 0) || zone(0, N - FINDER) || zone(N - FINDER, 0);
}

function finderFilled(r: number, c: number): boolean {
  const lr = r < FINDER ? r : r - (N - FINDER);
  const lc = c < FINDER ? c : c - (N - FINDER);
  const ring = lr === 0 || lr === FINDER - 1 || lc === 0 || lc === FINDER - 1;
  const center = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  return ring || center;
}

/** Zona reservada alrededor de cada finder (queda en blanco, como un QR real). */
function inSeparator(r: number, c: number): boolean {
  return (
    (r <= FINDER && c <= FINDER) ||
    (r <= FINDER && c >= N - FINDER - 1) ||
    (r >= N - FINDER - 1 && c <= FINDER)
  );
}

export function QrMatrix({ code, size = 168, className, label = 'Código QR (demo)' }: QrMatrixProps) {
  const rng = mulberry32(hashStr(code));
  const rects: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let fill = false;
      if (inFinder(r, c)) fill = finderFilled(r, c);
      else if (inSeparator(r, c)) fill = false;
      else fill = rng() > 0.52;
      if (fill) {
        rects.push(<rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} />);
      }
    }
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`-1 -1 ${N + 2} ${N + 2}`}
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label={label}
    >
      <rect x={-1} y={-1} width={N + 2} height={N + 2} fill="#ffffff" />
      <g fill="#0A0C15">{rects}</g>
    </svg>
  );
}
