'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { QrMatrix } from '@/components/QrMatrix';
import { bs } from '@/lib/caja';
import { payTicketCode, payUrl, type PayLinkInfo } from '@/lib/payLink';

const CONFETTI_COLORS = ['#22D3EE', '#4ADE80', '#F5C842', '#a78bfa'];
const QUICK = [50, 100, 200, 500];

type Generated = { monto: number; code: string; status: 'waiting' | 'paid' };

export function PagarClient({ info }: { info: PayLinkInfo }) {
  const [raw, setRaw] = useState('');
  const [ticket, setTicket] = useState<Generated | null>(null);

  const monto = parseFloat(raw);
  const valid = Number.isFinite(monto) && monto > 0;

  // El QRticket es el payload escaneable: riel + comercio + monto. Cambia con el
  // monto, así QrMatrix dibuja un patrón distinto por cobro.
  const payload = ticket ? `PF|${info.codigo}|${ticket.monto.toFixed(2)}|${ticket.code}` : '';

  // Confirmación automática del pago (demo), igual que la caja del vendedor.
  useEffect(() => {
    if (ticket?.status !== 'waiting') return;
    const t = setTimeout(
      () => setTicket((g) => (g ? { ...g, status: 'paid' } : g)),
      3500,
    );
    return () => clearTimeout(t);
  }, [ticket?.status]);

  const confetti = useMemo(() => {
    if (ticket?.status !== 'paid') return [];
    return Array.from({ length: 16 }, (_, i) => ({
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
      left: 8 + Math.random() * 84,
      delay: Math.random() * 0.7,
      size: 4 + Math.random() * 5,
    }));
  }, [ticket?.status]);

  function onlyMoney(v: string): string {
    // Sólo dígitos y un punto decimal, máx. 2 decimales.
    const cleaned = v.replace(/[^\d.]/g, '');
    const [intPart, ...rest] = cleaned.split('.');
    if (rest.length === 0) return intPart ?? '';
    return `${intPart}.${rest.join('').slice(0, 2)}`;
  }

  function generar() {
    if (!valid) return;
    const m = parseFloat(monto.toFixed(2));
    setTicket({ monto: m, code: payTicketCode(info.codigo, m), status: 'waiting' });
  }

  function reset() {
    setTicket(null);
    setRaw('');
  }

  const waiting = ticket?.status === 'waiting';

  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-void px-4 py-7">
      {/* Atmósfera cian (consistente con el login). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-[420px] flex-1 flex-col">
        {/* Marca */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cipher/25 bg-surface">
            <Icon name="qrcode" className="h-4 w-4 text-cipher" />
          </div>
          <div className="font-heading text-[17px] font-bold">
            <span className="text-clean">pago</span>
            <span className="text-cipher">firme</span>
          </div>
        </div>

        {/* Tarjeta del negocio */}
        <div className="mb-3 flex items-center gap-3.5 rounded-[16px] border border-wire bg-surface p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-wire bg-void font-heading text-base font-bold text-cipher">
            {info.iniciales}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-heading text-[15px] font-semibold tracking-tight text-clean">
              {info.negocio}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-fog">
              {info.vendedor} · {info.sucursal}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-pay/25 bg-pay/[0.07] px-2 py-0.5 text-[10px] text-pay">
            <Icon name="shield" className="h-3 w-3" />
            Seguro
          </div>
        </div>

        {!ticket ? (
          /* ── Ingreso del monto ─────────────────────────────── */
          <div className="flex flex-1 flex-col">
            <div className="rounded-[16px] border border-wire bg-surface px-4 pb-4 pt-5">
              <label
                htmlFor="monto"
                className="mb-1 block text-center text-[11px] uppercase tracking-wide text-fog"
              >
                ¿Cuánto vas a pagar?
              </label>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="font-heading text-2xl font-medium text-ghost">Bs</span>
                <input
                  id="monto"
                  inputMode="decimal"
                  autoFocus
                  value={raw}
                  onChange={(e) => setRaw(onlyMoney(e.target.value))}
                  onKeyDown={(e) => e.key === 'Enter' && generar()}
                  placeholder="0"
                  className="w-[60%] max-w-[220px] bg-transparent text-center font-heading text-[46px] font-extrabold leading-none tracking-tighter text-clean outline-none placeholder:text-fog"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                {QUICK.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setRaw(String(m))}
                    className="rounded-full border border-wire bg-lift px-3 py-1 text-xs font-medium text-cipher transition-colors active:border-cipher"
                  >
                    Bs {m}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!valid}
              onClick={generar}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] bg-cipher px-4 py-3.5 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90 disabled:bg-lift disabled:text-fog"
            >
              <Icon name="qrcode" className="h-[18px] w-[18px]" />
              Generar QRticket
            </button>

            <p className="mt-3 px-2 text-center text-[11px] leading-relaxed text-fog">
              Ingresá el monto y escaneá el QRticket con la app de tu banco o billetera.
              <span className="text-ghost"> Sin comisiones · sin registro.</span>
            </p>

            <div className="mt-auto pt-6 text-center text-[10px] text-fog">
              {payUrl(info.codigo)}
            </div>
          </div>
        ) : (
          /* ── QRticket generado ─────────────────────────────── */
          <div className="relative flex flex-1 flex-col items-center rounded-[16px] border border-wire bg-surface px-5 pb-5 pt-6 text-center">
            {!waiting &&
              confetti.map((p, i) => (
                <span
                  key={i}
                  className="confetti-particle z-10"
                  style={{
                    left: `${p.left}%`,
                    top: '22%',
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    animationDelay: `${p.delay}s`,
                  }}
                />
              ))}

            {waiting ? (
              <>
                <div className="font-heading text-base font-bold text-clean">QRticket listo</div>
                <div className="mb-3 text-[11px] text-ghost">Escaneá con tu app bancaria</div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1.5 font-heading text-base font-bold text-pay">
                  <Icon name="circle-check" className="h-4 w-4" />
                  ¡Pago confirmado!
                </div>
                <div className="mb-3 text-[11px] text-ghost">Tu pago se completó</div>
              </>
            )}

            {waiting ? (
              <div className="relative rounded-[16px] bg-white p-3">
                <QrMatrix code={payload} size={188} />
                <span className="qr-pulse-ring pointer-events-none absolute inset-0 rounded-[16px]" />
              </div>
            ) : (
              <div className="anim-flash relative flex h-[214px] w-[214px] items-center justify-center rounded-[16px] border border-pay bg-void">
                <svg width="96" height="96" viewBox="0 0 82 82" aria-hidden="true">
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
              </div>
            )}

            {waiting && (
              <div className="mt-2.5 rounded-full border border-wire bg-lift px-3 py-1 font-mono text-[12px] text-cipher">
                {ticket.code}
              </div>
            )}

            <div className="mt-3 font-heading text-[40px] font-bold leading-none tracking-tight text-clean">
              <span className="mr-1 align-super text-base font-medium text-ghost">Bs</span>
              {bs(ticket.monto)}
            </div>
            <div className="mb-4 mt-1 min-h-[16px] text-[11px] text-ghost">
              {waiting ? 'Esperando tu pago…' : `Cobro de ${info.vendedor}`}
            </div>

            <button
              type="button"
              onClick={reset}
              className={`mt-auto w-full rounded-[14px] py-3 text-[13px] font-semibold transition active:opacity-90 ${
                waiting
                  ? 'border border-wire bg-transparent text-ghost active:border-cipher'
                  : 'bg-cipher text-[#0A0C15]'
              }`}
            >
              {waiting ? 'Cambiar monto' : 'Hacer otro pago'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
