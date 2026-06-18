'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/icons';

/**
 * Onboarding de bienvenida (3 slides) que aparece SÓLO la primera vez que
 * alguien abre PagoFirme. La persistencia (localStorage) y el gate viven en la
 * página de login (app/page.tsx); este componente sólo renderiza el carrusel y
 * avisa con `onDone` cuando el usuario termina o salta.
 *
 * Cada slide se monta/desmonta según el índice activo, así sus animaciones se
 * reproducen frescas cada vez que se vuelve a entrar.
 */
export interface OnboardingProps {
  /** Se llama al terminar el último slide o al tocar "Saltar". */
  onDone: () => void;
}

const SLIDES = [
  { title: 'Tu QR. Listo en 1 segundo.', subtitle: 'Generá un cobro al instante, sin esperas ni apps externas.' },
  { title: 'El cliente escanea. Vos cobrás.', subtitle: 'El pago se confirma solo y vos lo ves caer en tiempo real.' },
  { title: 'Ves todo. Controlás todo.', subtitle: 'Tu negocio en datos, con IA que te dice dónde ganás más.' },
] as const;

export function Onboarding({ onDone }: OnboardingProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index]!;

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-void px-5 py-8">
      {/* Atmósfera: gradientes radiales cian, igual que el login. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,.10) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(74,222,128,.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[420px] flex-1 flex-col">
        {/* Barra superior: marca + saltar */}
        <div className="mb-2 flex items-center justify-between">
          <div className="font-heading text-sm font-bold text-clean">
            pago<span className="text-cipher">firme</span>
          </div>
          <button
            type="button"
            onClick={onDone}
            className="text-xs text-fog transition-colors hover:text-ghost"
          >
            Saltar
          </button>
        </div>

        {/* Escena animada del slide activo */}
        <div className="flex min-h-0 flex-1 items-center justify-center py-2">
          {index === 0 && <SlideQr />}
          {index === 1 && <SlideCobro />}
          {index === 2 && <SlideControl />}
        </div>

        {/* Texto */}
        <div key={index} className="ob-fade-up text-center">
          <h1 className="mb-2 font-heading text-[26px] font-bold leading-tight tracking-tight text-clean">
            {slide.title}
          </h1>
          <p className="mx-auto mb-6 max-w-[320px] text-sm text-ghost">{slide.subtitle}</p>
        </div>

        {/* Indicadores (dots) */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Ir al paso ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-cipher' : 'w-1.5 bg-wire'
              }`}
            />
          ))}
        </div>

        {/* Acción */}
        {isLast ? (
          <button
            type="button"
            onClick={onDone}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-pay px-4 py-3.5 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90"
          >
            Empezar gratis
            <Icon name="chevron-right" className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(i + 1, SLIDES.length - 1))}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-cipher px-4 py-3.5 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90"
          >
            Siguiente
            <Icon name="chevron-right" className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
    </main>
  );
}

/* ───────────────────────── Slide 1 — QR ───────────────────────── */

const QR_N = 21;
const QR_FINDER = 7;

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
  const zone = (r0: number, c0: number) =>
    r >= r0 && r < r0 + QR_FINDER && c >= c0 && c < c0 + QR_FINDER;
  return zone(0, 0) || zone(0, QR_N - QR_FINDER) || zone(QR_N - QR_FINDER, 0);
}

function finderFilled(r: number, c: number): boolean {
  const lr = r < QR_FINDER ? r : r - (QR_N - QR_FINDER);
  const lc = c < QR_FINDER ? c : c - (QR_N - QR_FINDER);
  const ring = lr === 0 || lr === QR_FINDER - 1 || lc === 0 || lc === QR_FINDER - 1;
  const center = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  return ring || center;
}

/** QR (decorativo) que se construye celda por celda, con scanner y esquinas. */
function SlideQr() {
  // Matriz determinista: el mismo patrón en cada render → sin parpadeos raros.
  const cells = useMemo(() => {
    const rng = mulberry32(hashStr('pagofirme-onboarding'));
    const out: boolean[] = [];
    for (let r = 0; r < QR_N; r++) {
      for (let c = 0; c < QR_N; c++) {
        out.push(inFinder(r, c) ? finderFilled(r, c) : rng() > 0.5);
      }
    }
    return out;
  }, []);

  return (
    <div className="relative h-[228px] w-[228px] rounded-[20px] border border-cipher/20 bg-gradient-to-br from-surface to-lift p-4 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
      {/* Esquinas futuristas en los 4 bordes */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-5 w-5 border-cipher ${
            pos === 'tl'
              ? 'left-1.5 top-1.5 rounded-tl-lg border-l-2 border-t-2'
              : pos === 'tr'
                ? 'right-1.5 top-1.5 rounded-tr-lg border-r-2 border-t-2'
                : pos === 'bl'
                  ? 'bottom-1.5 left-1.5 rounded-bl-lg border-b-2 border-l-2'
                  : 'bottom-1.5 right-1.5 rounded-br-lg border-b-2 border-r-2'
          }`}
        />
      ))}

      {/* Matriz del QR */}
      <div className="relative h-full w-full overflow-hidden rounded-md bg-white p-2">
        <div
          className="grid h-full w-full gap-px"
          style={{ gridTemplateColumns: `repeat(${QR_N}, minmax(0, 1fr))` }}
        >
          {cells.map((on, i) => {
            const r = Math.floor(i / QR_N);
            const c = i % QR_N;
            return (
              <span
                key={i}
                className={on ? 'ob-cell rounded-[1px] bg-[#0A0C15]' : ''}
                style={on ? { animationDelay: `${(r + c) * 16}ms` } : undefined}
              />
            );
          })}
        </div>
        {/* Scanner cian animado */}
        <span className="ob-scan" />
      </div>
    </div>
  );
}

/* ──────────────────────── Slide 2 — Cobro ──────────────────────── */

const COBRO_TARGET = 350;

/** Cliente escanea → pago confirmado: contador en vivo + check verde con ping. */
function SlideCobro() {
  const [amount, setAmount] = useState(0);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setAmount(Math.round(COBRO_TARGET * t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPaid(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex w-full max-w-[300px] flex-col items-center">
      {/* Estado: Escaneando → ✓ Cobrado */}
      <div
        className={`mb-6 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
          paid ? 'border-pay/30 bg-pay/[0.1] text-pay' : 'border-cipher/30 bg-cipher/[0.08] text-cipher'
        }`}
      >
        {paid ? (
          <>
            <Icon name="check" className="h-3.5 w-3.5" />
            Cobrado
          </>
        ) : (
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-cipher" />
            Escaneando…
          </>
        )}
      </div>

      {/* Círculo central: ícono de escaneo o check verde con ping */}
      <div className="relative mb-6 flex h-[120px] w-[120px] items-center justify-center">
        {paid ? (
          <>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pay/30" />
            <span className="absolute inline-flex h-full w-full rounded-full bg-pay/10" />
            <span className="anim-scale-in relative flex h-[88px] w-[88px] items-center justify-center rounded-full bg-pay/15">
              <Icon name="check" className="h-12 w-12 text-pay" strokeWidth={2.5} />
            </span>
          </>
        ) : (
          <>
            <span className="qr-pulse-ring absolute inset-0 rounded-full" />
            <Icon name="device-mobile" className="h-12 w-12 text-cipher" />
          </>
        )}
      </div>

      {/* Contador que sube en tiempo real */}
      <div className="font-heading text-[44px] font-bold leading-none tracking-tighter text-clean">
        <span className="mr-1 align-super text-base font-medium text-ghost">Bs</span>
        {amount.toLocaleString('es-BO')}
      </div>
      <div className="mt-2 text-[11px] text-ghost">
        {paid ? 'Pago confirmado · dueño notificado' : 'Esperando al cliente…'}
      </div>
    </div>
  );
}

/* ─────────────────────── Slide 3 — Control ─────────────────────── */

const VENTAS = [
  { dia: 'Lun', pct: 45 },
  { dia: 'Mar', pct: 60 },
  { dia: 'Mié', pct: 50 },
  { dia: 'Jue', pct: 72 },
  { dia: 'Vie', pct: 100, top: true },
  { dia: 'Sáb', pct: 80 },
];

/** Dashboard: barras de ventas que crecen + insight de IA. */
function SlideControl() {
  return (
    <div className="w-full max-w-[320px]">
      {/* Gráfico de barras */}
      <div className="mb-4 rounded-[18px] border border-wire bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-fog">Ventas de la semana</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-pay">
            <Icon name="trending-up" className="h-3.5 w-3.5" />
            +24%
          </span>
        </div>
        <div className="flex h-[120px] items-end justify-between gap-2">
          {VENTAS.map((v, i) => (
            <div key={v.dia} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-[96px] w-full items-end">
                <div
                  className={`ob-bar w-full rounded-t-md ${v.top ? 'bg-pay' : 'bg-cipher/40'}`}
                  style={{ height: `${v.pct}%`, animationDelay: `${i * 90}ms` }}
                />
              </div>
              <span className={`text-[10px] ${v.top ? 'font-semibold text-pay' : 'text-fog'}`}>
                {v.dia}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insight de IA */}
      <div
        className="ob-fade-up flex items-center gap-3 rounded-[14px] border border-cipher/20 bg-cipher/[0.06] px-4 py-3"
        style={{ animationDelay: '0.5s' }}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cipher/15">
          <Icon name="brain" className="h-5 w-5 text-cipher" />
        </span>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-cipher">Insight de IA</div>
          <div className="text-sm font-medium text-clean">Viernes es tu mejor día</div>
        </div>
      </div>
    </div>
  );
}
