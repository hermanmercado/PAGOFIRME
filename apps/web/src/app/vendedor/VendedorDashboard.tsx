'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons';
import { BottomNav, type NavItem } from '@/components/BottomNav';
import { Toaster, useToast } from '@/components/Toaster';
import { SessionTimeout } from '@/components/SessionTimeout';
import { Toggle } from '@/components/Toggle';
import { QrMatrix } from '@/components/QrMatrix';
import { CajaScreen } from '@/components/caja/CajaScreen';
import { bs, loadTickets, saveTickets, type Ticket } from '@/lib/caja';
import {
  dailyQrCode,
  dailyQrEnabled,
  getGlobalDailyQr,
  getVendorDailyQr,
  msUntilNextDay,
  setVendorDailyQr,
  todayLabel,
} from '@/lib/dailyQr';

type Tab = 'caja' | 'tickets' | 'resumen' | 'perfil';

const VENDOR = 'Carlos Arias';
const TIENDA = 'Tienda Centro';

const NAV: NavItem<Tab>[] = [
  { id: 'caja', label: 'Caja', icon: 'store' },
  { id: 'tickets', label: 'Tickets', icon: 'receipt' },
  { id: 'resumen', label: 'Resumen', icon: 'chart-bar' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
];

export default function VendedorDashboard() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [tab, setTab] = useState<Tab>('caja');
  // Estado inicializado de forma síncrona (el componente es client-only, ssr:false),
  // así el QR del día YA está en el primer render: cero loading, cero flash.
  const [tickets, setTickets] = useState<Ticket[]>(() => loadTickets());
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [dailyCode, setDailyCode] = useState<string | null>(() =>
    dailyQrEnabled() ? dailyQrCode(VENDOR, TIENDA) : null,
  );
  const [vendorDaily, setVendorDaily] = useState(() => getVendorDailyQr());
  const globalDaily = getGlobalDailyQr();

  const totalCobrado = tickets.reduce((s, t) => s + t.total, 0);

  // Tickets persistentes (sobreviven cambios de pestaña y recargas).
  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  // El QR cambia exactamente a las 00:00:01 de cada día, sin recargar.
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(() => {
        if (dailyQrEnabled()) setDailyCode(dailyQrCode(VENDOR, TIENDA));
        schedule();
      }, msUntilNextDay());
    };
    schedule();
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-void">
      <div className="flex min-h-0 flex-1 flex-col">
        <CajaScreen
          hidden={tab !== 'caja'}
          montos={[150, 200, 300]}
          limit={2000}
          ticketStart={43}
          actor={VENDOR}
          avgTicket={280}
          onCobrado={(t) => setTickets((ts) => [t, ...ts])}
          show={show}
          renderHeader={({ ticketId, hora }) => (
            <header className="shrink-0 border-b border-wire px-[18px] pb-[11px] pt-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    aria-label="Volver al login"
                    className="text-ghost transition-colors active:text-cipher"
                  >
                    <Icon name="arrow-left" className="h-5 w-5" />
                  </button>
                  <div className="font-heading text-[15px] font-bold">
                    <span className="text-clean">pago</span>
                    <span className="text-cipher">firme</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-wire bg-lift text-[10px] font-semibold text-ghost">
                    CA
                  </div>
                  <div>
                    <div className="text-[11px] leading-tight text-ghost">Carlos Arias</div>
                    <div className="mt-px inline-block rounded-full border border-wire bg-lift px-1.5 text-[9px] text-fog">
                      Vendedor · Centro
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="rounded-full border border-cipher/20 bg-cipher/[0.07] px-2.5 py-0.5 font-mono text-[10px] text-cipher">
                  Ticket {ticketId}
                </span>
                {hora && <span className="text-[10px] text-fog">{hora} · hoy</span>}
              </div>
            </header>
          )}
        />

        {tab === 'tickets' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Mis tickets de hoy
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-3 rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-fog">Total cobrado hoy</span>
                  <span className="font-medium text-cipher">Bs {bs(totalCobrado)}</span>
                </div>
                <div className="mt-1 flex justify-between text-[11px]">
                  <span className="text-fog">Tickets completados</span>
                  <span className="font-medium text-clean">{tickets.length}</span>
                </div>
              </div>
              {tickets.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center text-xs text-fog">
                  <Icon name="receipt" className="h-9 w-9" />
                  Aún no cobraste tickets hoy
                </div>
              ) : (
                tickets.map((t) => {
                  const open = expandedTicket === t.id;
                  return (
                    <div key={t.id} className="border-b border-wire">
                      <button
                        type="button"
                        onClick={() => setExpandedTicket(open ? null : t.id)}
                        className="flex w-full items-center gap-2.5 py-2.5 text-left transition-colors active:bg-surface"
                      >
                        <div className="flex-1">
                          <div className="font-mono text-xs font-medium text-clean">{t.id}</div>
                          <div className="mt-0.5 text-[10px] text-fog">
                            {t.hora} · {t.lineas.length} líneas
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-heading text-sm font-semibold text-clean">
                            Bs {bs(t.total)}
                          </div>
                          <span className="rounded-full bg-pay/10 px-1.5 text-[10px] text-pay">
                            Cobrado
                          </span>
                        </div>
                        <Icon
                          name="chevron-down"
                          className={`h-4 w-4 shrink-0 text-fog transition-transform ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {open && (
                        <div className="mb-2.5 overflow-hidden rounded-[10px] border border-wire bg-surface">
                          <div className="flex items-center justify-between border-b border-wire px-3 py-2 text-[10px] uppercase tracking-wide text-fog">
                            <span>Detalle del cobro</span>
                            <span className="normal-case">{t.hora}</span>
                          </div>
                          {t.lineas.map((l, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 border-b border-wire px-3 py-2"
                            >
                              <span className="w-4 shrink-0 font-mono text-[10px] text-fog">
                                {i + 1}
                              </span>
                              <span className="flex-1 font-mono text-[11px] text-ghost">{l.expr}</span>
                              <span className="font-heading text-[12px] font-semibold text-clean">
                                Bs {bs(l.monto)}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between px-3 py-2">
                            <span className="text-[11px] font-medium text-clean">Total cobrado</span>
                            <span className="font-heading text-sm font-bold text-cipher">
                              Bs {bs(t.total)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {tab === 'resumen' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Mi resumen del día
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="py-4 text-center">
                <div className="mb-1.5 text-[11px] uppercase tracking-wide text-fog">
                  Total cobrado hoy
                </div>
                <div className="font-heading text-[46px] font-extrabold leading-none tracking-[-2px] text-clean">
                  <span className="mr-1 align-super text-xl font-medium text-ghost">Bs</span>
                  {bs(totalCobrado)}
                </div>
              </div>
              <div className="mb-2.5 grid grid-cols-2 gap-1.5">
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Cobrados</div>
                  <div className="font-heading text-[17px] font-semibold text-clean">
                    {tickets.length}
                  </div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Cancelados</div>
                  <div className="font-heading text-[17px] font-semibold text-clean">0</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Offline pend.</div>
                  <div className="font-heading text-[17px] font-semibold text-risk">0</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Comisiones</div>
                  <div className="font-heading text-[17px] font-semibold text-cipher">Bs 0</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => show('Caja del día cerrada', 'ok')}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-wire bg-transparent py-2.5 text-[13px] text-ghost transition-colors active:border-cipher"
              >
                <Icon name="lock" className="h-[18px] w-[18px]" />
                Cerrar caja del día
              </button>
            </div>
          </div>
        )}

        {tab === 'perfil' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Mi perfil
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2.5 flex items-center gap-3.5 rounded-[14px] border border-wire bg-surface p-4">
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-wire bg-void font-heading text-lg font-bold text-ghost">
                  CA
                </div>
                <div>
                  <div className="font-heading text-[15px] font-semibold tracking-tight text-clean">
                    Carlos Arias
                  </div>
                  <div className="mt-0.5 text-[11px] text-fog">Vendedor · Tienda Centro</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-pay">
                    <span className="h-1.5 w-1.5 rounded-full bg-pay" />
                    Activo ahora
                  </div>
                </div>
              </div>

              <div className="mb-2 rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-ghost">
                  <Icon name="clock" className="h-3 w-3" />
                  Horario y límites autorizados
                </div>
                <div className="mb-1 text-[13px] font-medium text-clean">8:00 AM — 6:00 PM</div>
                <div className="text-[10px] text-fog">
                  Límite por ticket: <strong className="text-clean">Bs 2,000</strong> · Autorizado
                  por: Marco G.
                </div>
              </div>

              <div className="mb-2 rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-ghost">
                  <Icon name="device-mobile" className="h-3 w-3" />
                  Sesión activa
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cipher" />
                  <span className="flex-1 text-[11px] text-clean">Samsung Galaxy A14 · Bolivia</span>
                  <span className="text-[10px] text-fog">Ahora</span>
                </div>
              </div>

              <div className="mb-2 flex items-center gap-3 rounded-[14px] border border-wire bg-surface px-3.5 py-3">
                <Icon name="qrcode" className="h-5 w-5 shrink-0 text-ghost" />
                <div className="flex-1">
                  <div className="text-[13px] text-clean">QR diario automático</div>
                  <div className="text-[10px] text-fog">
                    {globalDaily
                      ? 'Al abrir la app, tu QR del día ya está listo'
                      : 'Desactivado por el dueño'}
                  </div>
                </div>
                <Toggle
                  checked={globalDaily && vendorDaily}
                  disabled={!globalDaily}
                  onChange={(on) => {
                    setVendorDailyQr(on);
                    setVendorDaily(on);
                    setDailyCode(on && globalDaily ? dailyQrCode(VENDOR, TIENDA) : null);
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex w-full items-center gap-3 rounded-[14px] border border-wire bg-surface px-4 py-3 text-left transition-colors active:bg-lift"
              >
                <Icon name="login" className="h-5 w-5 text-loss" />
                <span className="text-[13px] text-loss">Cerrar sesión</span>
              </button>

              <div className="py-3 text-center text-[10px] text-fog">
                PagoFirme v2.0.0 · Bolivia
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav items={NAV} active={tab} onChange={setTab} />

      {/* QR del día — presente en el PRIMER render: instantáneo, sin loading ni animación. */}
      {dailyCode && (
        <div className="absolute inset-0 z-[55] flex flex-col items-center justify-center gap-3 bg-void px-8 text-center">
          <div className="font-heading text-[15px] font-bold">
            <span className="text-clean">pago</span>
            <span className="text-cipher">firme</span>
          </div>
          <div>
            <div className="font-heading text-lg font-bold text-clean">Tu QR del día</div>
            <div className="mt-0.5 text-[11px] capitalize text-fog">{todayLabel()}</div>
          </div>
          <div className="rounded-[18px] bg-white p-3">
            <QrMatrix code={dailyCode} size={176} />
          </div>
          <div className="rounded-full border border-wire bg-surface px-3 py-1 font-mono text-[12px] text-cipher">
            {dailyCode}
          </div>
          <p className="max-w-[270px] text-[11px] leading-relaxed text-ghost">
            <span className="text-clean">Sin monto</span> — el cliente escanea e ingresa lo que desea
            pagar. Cambia solo a las 00:00 de cada día.
          </p>
          <button
            type="button"
            onClick={() => setDailyCode(null)}
            className="mt-1 w-full max-w-[270px] rounded-[14px] bg-cipher py-3 text-[13px] font-semibold text-[#0A0C15] transition active:opacity-90"
          >
            Abrir caja
          </button>
        </div>
      )}

      <Toaster toast={toast} />
      <SessionTimeout />
    </div>
  );
}
