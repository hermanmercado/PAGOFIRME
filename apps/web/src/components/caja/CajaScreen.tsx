'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/icons';
import { bs, evalExpr, ticketId, type Linea, type Ticket } from '@/lib/caja';
import { whatsappShareUrl } from '@/lib/payLink';
import { recordQr, reportUnusualSale } from '@/lib/security';
import type { ToastKind } from '@/components/Toaster';

const keyBase =
  'flex min-h-[50px] select-none items-center justify-center bg-surface text-lg text-clean transition-colors active:bg-lift';

const CONFETTI_COLORS = ['#22D3EE', '#4ADE80', '#F5C842', '#a78bfa'];

export interface CajaScreenProps {
  /** Encabezado de la caja; recibe el ticket y la hora actuales. */
  renderHeader: (ctx: { ticketId: string; hora: string }) => React.ReactNode;
  /** Montos frecuentes (opcional; el supervisor no los usa). */
  montos?: number[];
  /** Límite por ticket en Bs (null = sin límite). */
  limit?: number | null;
  /** Número de ticket inicial. */
  ticketStart: number;
  /** Se llama al confirmarse un cobro. */
  onCobrado?: (ticket: Ticket) => void;
  /** Toast compartido del dashboard. */
  show: (msg: string, kind?: ToastKind) => void;
  /** Oculta la caja sin desmontarla (preserva el estado entre pestañas). */
  hidden?: boolean;
  /** Operador de la caja; activa el monitoreo antifraude (tasa de QR y venta inusual). */
  actor?: string;
  /** Ticket promedio del operador; un cobro > 3x dispara aviso de venta inusual. */
  avgTicket?: number;
  /** Código de cobro del vendedor; habilita "Cobrar por WhatsApp" con el link público. */
  payCode?: string;
}

export function CajaScreen({
  renderHeader,
  montos,
  limit = null,
  ticketStart,
  onCobrado,
  show,
  hidden = false,
  actor,
  avgTicket,
  payCode,
}: CajaScreenProps) {
  const [expr, setExpr] = useState('');
  const [lineas, setLineas] = useState<Linea[]>([]);
  // Contador para ids de línea estables (clave de React; sobrevive re-renders).
  const lineSeq = useRef(0);
  const [tnum, setTnum] = useState(ticketStart);
  const [hora, setHora] = useState('');
  const [modal, setModal] = useState<{ total: number; status: 'waiting' | 'paid' } | null>(null);

  useEffect(() => {
    setHora(new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' }));
  }, [tnum]);

  // Confirmación automática del pago tras mostrar el QR (demo).
  useEffect(() => {
    if (!modal || modal.status !== 'waiting') return;
    const t = setTimeout(() => setModal((m) => (m ? { ...m, status: 'paid' } : m)), 3500);
    return () => clearTimeout(t);
  }, [modal]);

  // Aviso al dueño cuando se confirma el cobro (paridad con el prototipo).
  useEffect(() => {
    if (modal?.status !== 'paid') return;
    const t = setTimeout(
      () => show(`Dueño notificado · Bs ${bs(modal.total)}`, 'celebrate'),
      1200,
    );
    return () => clearTimeout(t);
  }, [modal?.status, modal?.total, show]);

  const confetti = useMemo(() => {
    if (modal?.status !== 'paid') return [];
    return Array.from({ length: 16 }, (_, i) => ({
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      left: 8 + Math.random() * 84,
      delay: Math.random() * 0.7,
      size: 4 + Math.random() * 5,
    }));
  }, [modal?.status]);

  const total = lineas.reduce((s, l) => s + l.monto, 0);
  const calcVal = evalExpr(expr);
  const overLimit = limit != null && calcVal !== null && calcVal > limit;
  const display = expr.replace(/\*/g, '×');

  function pushKey(v: string) {
    setExpr((e) => e + (v === '×' ? '*' : v));
  }
  function igual() {
    // El resultado ya se muestra en vivo (calcVal) en la pantalla de la
    // calculadora; `=` no colapsa la expresión, así se preserva (p. ej. "2×3").
  }
  function agregarMonto(m: number) {
    const id = `l-${lineSeq.current++}`;
    setLineas((ls) => [...ls, { id, expr: String(m), monto: m }]);
    show(`Bs ${m} agregado al ticket`, 'ok');
  }
  function agregarLinea() {
    const val = evalExpr(expr);
    if (val === null || val <= 0) return;
    if (limit != null && val > limit) {
      show(`Monto supera el límite autorizado (Bs ${limit})`, 'warn');
      return;
    }
    const id = `l-${lineSeq.current++}`;
    setLineas((ls) => [...ls, { id, expr: display, monto: parseFloat(val.toFixed(2)) }]);
    setExpr('');
  }
  function eliminarLinea(i: number) {
    setLineas((ls) => ls.filter((_, idx) => idx !== i));
  }
  function nuevoTicket() {
    setLineas([]);
    setExpr('');
    setTnum((n) => n + 1);
  }
  function generarQR(viaWA = false) {
    if (!lineas.length) return;

    // Antifraude: tasa de QR (> 10/min) y cobro inusual (> 3x el promedio).
    if (actor) {
      const { count, justFlagged } = recordQr(actor);
      if (justFlagged) {
        show(`Actividad inusual: ${count} QR en 1 min · dueño notificado`, 'warn');
      }
    }
    if (avgTicket && total > avgTicket * 3) {
      show(`Cobro inusual: supera 3x tu promedio (Bs ${avgTicket}) · dueño notificado`, 'warn');
      if (actor) reportUnusualSale(actor, total, avgTicket);
    }

    // Cobrar por WhatsApp: abre WhatsApp con el mensaje pre-armado y el link
    // público de cobro. El cliente paga en /pagar/[codigo], no en persona.
    if (viaWA) {
      if (payCode) {
        window.open(whatsappShareUrl(total, payCode), '_blank', 'noopener,noreferrer');
        show(`WhatsApp abierto · cobro de Bs ${bs(total)}`, 'ok');
      } else {
        show('No hay link de cobro configurado', 'warn');
      }
      return;
    }

    setModal({ total, status: 'waiting' });
  }
  function confirmarYNuevo() {
    onCobrado?.({ id: ticketId(tnum), hora, total, lineas, ts: Date.now() });
    setModal(null);
    nuevoTicket();
  }

  const waiting = modal?.status === 'waiting';

  return (
    <div className={`${hidden ? 'hidden' : 'flex'} relative min-h-0 flex-1 flex-col`}>
      {renderHeader({ ticketId: ticketId(tnum), hora })}

      {/* Montos frecuentes */}
      {montos && montos.length > 0 && (
        <div className="shrink-0">
          <div className="px-[18px] pb-0.5 pt-1.5 text-[10px] uppercase tracking-wide text-fog">
            Montos frecuentes
          </div>
          <div className="flex flex-wrap gap-1.5 px-[18px] pb-1.5">
            {montos.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => agregarMonto(m)}
                className="rounded-full border border-wire bg-surface px-3 py-1 text-xs font-medium text-cipher transition-colors active:border-cipher active:bg-lift"
              >
                Bs {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Aviso de límite */}
      {overLimit && (
        <div className="mx-4 mb-1.5 flex shrink-0 items-center gap-2 rounded-[10px] border border-risk/25 bg-risk/[0.06] px-3 py-1.5">
          <Icon name="alert-triangle" className="h-3.5 w-3.5 shrink-0 text-risk" />
          <span className="text-[11px] text-risk">
            Bs {Math.round(calcVal ?? 0)} supera límite autorizado (Bs {limit})
          </span>
        </div>
      )}

      {/* Líneas del ticket */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {lineas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-5 text-center text-xs text-fog">
            <Icon name="calculator" className="h-9 w-9" />
            Ingresa montos y agrégalos al ticket
          </div>
        ) : (
          lineas.map((l, i) => (
            <div key={l.id} className="flex items-center gap-2.5 border-b border-wire px-[18px] py-2.5">
              <span className="w-3.5 shrink-0 font-mono text-[11px] text-fog">{i + 1}</span>
              <span className="flex-1 font-mono text-[13px] text-ghost">{l.expr}</span>
              <span className="min-w-[78px] text-right font-heading text-sm font-semibold text-clean">
                Bs {bs(l.monto)}
              </span>
              <button
                type="button"
                onClick={() => eliminarLinea(i)}
                aria-label="Eliminar línea"
                className="p-1 text-fog transition-colors active:text-loss"
              >
                <Icon name="x" className="h-[15px] w-[15px]" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Barra de total */}
      <div className="shrink-0 border-t border-wire px-[18px] pb-2 pt-2.5">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-[11px] text-ghost">{lineas.length} líneas</span>
          <div>
            <span className="font-heading text-[32px] font-bold leading-none tracking-tighter text-clean">
              {bs(total)}
            </span>
            <span className="ml-0.5 text-[13px] text-ghost">Bs</span>
          </div>
        </div>
        <div className="mb-1 flex gap-2">
          <button
            type="button"
            disabled={!lineas.length}
            onClick={() => generarQR(false)}
            className="flex flex-[2] items-center justify-center gap-2 rounded-[14px] bg-cipher px-3 py-3 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90 disabled:bg-lift disabled:text-fog"
          >
            <Icon name="qrcode" className="h-[18px] w-[18px]" />
            Generar QR
          </button>
          <button
            type="button"
            disabled={!lineas.length}
            onClick={() => generarQR(true)}
            aria-label="Cobrar por WhatsApp"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[14px] border border-[#065F46] bg-[#064E3B] py-3 text-xs font-semibold text-[#A7F3D0] disabled:border-wire disabled:bg-lift disabled:text-fog"
          >
            <Icon name="whatsapp" className="h-[18px] w-[18px]" />
            WhatsApp
          </button>
        </div>
        <button
          type="button"
          onClick={nuevoTicket}
          className="mt-1 flex w-full items-center justify-center gap-1.5 py-1.5 text-[11px] text-fog transition-colors active:text-loss"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
          Limpiar ticket
        </button>
      </div>

      {/* Pantalla de la calculadora */}
      <div className="flex shrink-0 items-center justify-between border-t border-wire bg-surface px-[18px] py-1">
        <span className="flex-1 font-mono text-xs text-fog">
          {display.length > 12 ? display : ''}
        </span>
        <span className="text-right font-heading text-[22px] font-semibold tracking-tight text-clean">
          {calcVal !== null ? calcVal.toLocaleString('es-BO') : display || '0'}
        </span>
      </div>

      {/* Teclado */}
      <div className="grid shrink-0 grid-cols-4 gap-px bg-wire">
        <button type="button" className={keyBase} onClick={() => pushKey('7')}>7</button>
        <button type="button" className={keyBase} onClick={() => pushKey('8')}>8</button>
        <button type="button" className={keyBase} onClick={() => pushKey('9')}>9</button>
        <button type="button" className={`${keyBase} font-heading text-xl text-cipher`} onClick={() => pushKey('×')}>×</button>

        <button type="button" className={keyBase} onClick={() => pushKey('4')}>4</button>
        <button type="button" className={keyBase} onClick={() => pushKey('5')}>5</button>
        <button type="button" className={keyBase} onClick={() => pushKey('6')}>6</button>
        <button type="button" className={`${keyBase} font-heading text-xl text-cipher`} onClick={() => pushKey('+')}>+</button>

        <button type="button" className={keyBase} onClick={() => pushKey('1')}>1</button>
        <button type="button" className={keyBase} onClick={() => pushKey('2')}>2</button>
        <button type="button" className={keyBase} onClick={() => pushKey('3')}>3</button>
        <button type="button" className={`${keyBase} text-ghost`} onClick={() => setExpr((e) => e.slice(0, -1))} aria-label="Borrar">⌫</button>

        <button type="button" className={`${keyBase} col-span-2`} onClick={() => pushKey('0')}>0</button>
        <button type="button" className={keyBase} onClick={() => pushKey('.')}>.</button>
        <button type="button" className={`${keyBase} font-heading text-xl text-cipher`} onClick={igual}>=</button>

        <button
          type="button"
          className="flex min-h-[50px] items-center justify-center bg-loss/[0.08] text-xs text-loss transition-colors active:bg-loss/[0.15]"
          onClick={() => setExpr('')}
        >
          AC
        </button>
        <button
          type="button"
          className="col-span-3 flex min-h-[50px] items-center justify-center gap-1 border-l border-cipher/15 bg-cipher/[0.07] text-[11px] font-semibold tracking-wide text-cipher transition-colors active:bg-cipher/[0.14]"
          onClick={agregarLinea}
        >
          + Agregar al ticket
        </button>
      </div>

      {/* Modal QR — el momento del cobro */}
      {modal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-[rgba(10,12,21,0.88)] backdrop-blur-sm">
          <div className="relative max-h-full w-full overflow-hidden rounded-t-[22px] border-t border-wire bg-surface">
            {/* Confeti: capa fija sobre el sheet, no scrollea */}
            {!waiting &&
              confetti.map((p, i) => (
                <span
                  key={i}
                  className="confetti-particle z-10"
                  style={{
                    left: `${p.left}%`,
                    top: '28%',
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}

            {/* Contenido scrolleable: entra en pantallas pequeñas sin superponerse */}
            <div className="max-h-[85vh] overflow-y-auto px-5 pb-7 pt-3.5 text-center">
              <div className="mx-auto mb-3 h-[3px] w-9 rounded bg-wire" />
            {waiting ? (
              <>
                <div className="font-heading text-base font-bold text-clean">QR generado</div>
                <div className="mb-2.5 text-[11px] text-ghost">Muéstrale este QR al cliente</div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1.5 font-heading text-base font-bold text-pay">
                  <Icon name="circle-check" className="h-4 w-4" />
                  ¡Pago confirmado!
                </div>
                <div className="mb-2.5 text-[11px] text-ghost">El cliente completó el pago</div>
              </>
            )}

            {/* Contenedor del QR / éxito */}
            <div
              className={`relative mx-auto mb-2.5 flex h-[130px] w-[130px] items-center justify-center rounded-[14px] border bg-void ${
                waiting ? 'border-cipher' : 'border-pay anim-flash'
              }`}
            >
              {waiting ? (
                <>
                  <Icon name="qrcode" className="h-20 w-20 text-cipher" />
                  <span className="qr-pulse-ring pointer-events-none absolute inset-0 rounded-[14px]" />
                </>
              ) : (
                <svg width="82" height="82" viewBox="0 0 82 82" aria-hidden="true">
                  <circle cx="41" cy="41" r="35" fill="none" stroke="rgba(34,211,238,.1)" strokeWidth="2" />
                  <circle
                    cx="41"
                    cy="41"
                    r="35"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="2.5"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="anim-draw-circle"
                    style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                  />
                  <path
                    d="M27 41l11 11 18-19"
                    fill="none"
                    stroke="#22D3EE"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="anim-scale-in"
                    style={{ opacity: 0 }}
                  />
                </svg>
              )}
            </div>

            <div
              className={`mb-1 font-heading font-bold tracking-tight text-clean ${
                waiting ? 'text-[28px]' : 'text-[44px] leading-none'
              }`}
            >
              <span className="mr-1 align-super text-base font-medium text-ghost">Bs</span>
              {bs(modal.total)}
            </div>
            <div className="mb-3 min-h-[18px] text-[11px] text-ghost">
              {waiting ? 'Esperando pago del cliente...' : 'Comprobante listo para enviar'}
            </div>

            {waiting ? (
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-full rounded-[14px] border border-wire bg-transparent py-3 text-[13px] text-ghost transition-colors active:border-cipher"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={confirmarYNuevo}
                className="w-full rounded-[14px] bg-cipher py-3 text-[13px] font-semibold text-[#0A0C15] transition active:opacity-90"
              >
                Nuevo ticket
              </button>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
