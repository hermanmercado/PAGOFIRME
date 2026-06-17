'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons';
import { BottomNav, type NavItem } from '@/components/BottomNav';
import { Toaster, useToast } from '@/components/Toaster';
import { SessionTimeout } from '@/components/SessionTimeout';
import { CajaScreen } from '@/components/caja/CajaScreen';
import { RankingList } from '@/components/RankingList';
import { Toggle } from '@/components/Toggle';
import type { SupData } from '@/lib/teamData';

type Tab = 'inicio' | 'caja' | 'reportes' | 'perfil';

const NAV: NavItem<Tab>[] = [
  { id: 'inicio', label: 'Inicio', icon: 'dashboard' },
  { id: 'caja', label: 'Mi caja', icon: 'store' },
  { id: 'reportes', label: 'Reportes', icon: 'chart-bar' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
];

export function SupervisorDashboard({ sup }: { sup: SupData }) {
  const router = useRouter();
  const { toast, show, hide } = useToast();
  const [tab, setTab] = useState<Tab>('inicio');

  // Cada vez que cambia de pestaña, descarta cualquier toast (incl. la
  // celebración del cobro) para que no quede flotando sobre otra sección.
  useEffect(() => {
    hide();
  }, [tab, hide]);

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-void">
      <div className="flex min-h-0 flex-1 flex-col">
        {tab === 'inicio' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] pb-3 pt-2.5">
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
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cipher/20 bg-[#0a1a2e] text-[10px] font-semibold text-cipher">
                    {sup.av}
                  </div>
                  <div>
                    <div className="text-[11px] leading-tight text-ghost">{sup.name}</div>
                    <div className="mt-px inline-block rounded-full border border-cipher/20 bg-cipher/[0.08] px-1.5 text-[9px] text-cipher">
                      Supervisor
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Métricas */}
              <div className="grid grid-cols-2 gap-1.5 p-4 pb-2">
                <div className="rounded-[14px] border border-cipher/25 bg-cipher/[0.05] px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Ventas hoy</div>
                  <div className="font-heading text-[17px] font-semibold text-clean">{sup.ventas}</div>
                  <div className="text-[10px] text-pay">↑ 10%</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Tickets</div>
                  <div className="font-heading text-[17px] font-semibold text-clean">{sup.tix}</div>
                  <div className="text-[10px] text-fog">{sup.vcount}</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Mi tienda</div>
                  <div className="font-heading text-[14px] font-semibold text-clean">
                    {sup.tiendaShort}
                  </div>
                  <div className="text-[10px] text-fog">activa</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Comisiones</div>
                  <div className="font-heading text-[17px] font-semibold text-cipher">Bs 0</div>
                  <div className="text-[10px] text-pay">siempre</div>
                </div>
              </div>

              {/* Alertas */}
              <div className="px-4 pb-1 pt-1">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-ghost">
                  <Icon name="bell" className="h-3.5 w-3.5" />
                  Alertas de mi tienda
                </div>
                <div className="overflow-hidden rounded-[14px] border border-wire bg-surface">
                  <div className="flex items-start gap-2.5 border-b border-wire px-3.5 py-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-risk/[0.08] text-risk">
                      <Icon name="trending-up" className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-clean">
                        Venta inusual — {sup.vends[sup.vends.length - 1]?.name ?? 'vendedor'}
                      </div>
                      <div className="text-[10px] leading-snug text-ghost">
                        Ticket Bs 1,800 · su promedio habitual es Bs 280
                      </div>
                    </div>
                    <div className="text-[9px] text-fog">09:12</div>
                  </div>
                  <div className="flex items-start gap-2.5 px-3.5 py-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cipher/[0.08] text-cipher">
                      <Icon name="circle-check" className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-clean">
                        3 tickets offline sincronizados
                      </div>
                      <div className="text-[10px] leading-snug text-ghost">
                        {sup.vends[0]?.name ?? 'Un vendedor'} recuperó conexión con BCB
                      </div>
                    </div>
                    <div className="text-[9px] text-fog">08:55</div>
                  </div>
                </div>
              </div>

              {/* Ranking de vendedores */}
              <div className="px-4 py-2">
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wide text-ghost">
                  Ranking de mis vendedores hoy
                </div>
                {sup.vends.map((v) => (
                  <div key={v.ini} className="flex items-center gap-2.5 border-b border-wire py-2 last:border-b-0">
                    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-wire bg-surface font-heading text-[11px] font-semibold text-cipher">
                      {v.ini}
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-clean">{v.name}</div>
                      <div className="text-[10px] text-fog">{v.tix} tickets hoy</div>
                    </div>
                    <div className="font-heading text-[13px] font-semibold text-cipher">{v.monto}</div>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => show('Agregar vendedor a mi tienda', 'ok')}
                  className="flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-wire py-2.5 text-xs text-ghost transition-colors active:border-cipher active:text-cipher"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Agregar vendedor a mi tienda
                </button>
              </div>
            </div>
          </div>
        )}

        <CajaScreen
          hidden={tab !== 'caja'}
          limit={sup.limit}
          ticketStart={sup.ticketStart}
          actor={sup.name}
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
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cipher/20 bg-[#0a1a2e] text-[10px] font-semibold text-cipher">
                    {sup.av}
                  </div>
                  <div>
                    <div className="text-[11px] leading-tight text-ghost">{sup.name}</div>
                    <div className="mt-px inline-block rounded-full border border-cipher/20 bg-cipher/[0.08] px-1.5 text-[9px] text-cipher">
                      Supervisor
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

        {tab === 'reportes' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Reportes · {sup.tienda}
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2.5 flex gap-1">
                <span className="rounded-full bg-cipher px-3 py-1 text-[11px] font-semibold text-[#0A0C15]">
                  Semana
                </span>
                <span className="rounded-full border border-wire bg-surface px-3 py-1 text-[11px] text-ghost">
                  Mes
                </span>
              </div>
              <div className="mb-2.5 rounded-[14px] border border-wire bg-surface px-3.5 py-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] text-fog">Total semana mi tienda</span>
                  <span className="font-heading text-lg font-semibold text-cipher">
                    {sup.repTotal}
                  </span>
                </div>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-fog">Tickets totales</span>
                  <span className="font-medium text-clean">142</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-fog">Comisiones</span>
                  <span className="font-medium text-cipher">Bs 0.00</span>
                </div>
              </div>
              <div className="mb-2 text-[11px] font-medium text-ghost">
                Ranking semanal — mis vendedores
              </div>
              <RankingList rows={sup.ranking} />
              <div className="mt-3 flex gap-1.5">
                <button
                  type="button"
                  onClick={() => show('Exportando PDF...', 'ok')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-wire py-2.5 text-[11px] text-ghost transition-colors active:border-cipher active:text-cipher"
                >
                  <Icon name="file-text" className="h-4 w-4" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => show('Exportando CSV...', 'ok')}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-wire py-2.5 text-[11px] text-ghost transition-colors active:border-cipher active:text-cipher"
                >
                  <Icon name="download" className="h-4 w-4" />
                  CSV
                </button>
              </div>
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
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-wire bg-void font-heading text-lg font-bold text-cipher">
                  {sup.av}
                </div>
                <div>
                  <div className="font-heading text-[15px] font-semibold tracking-tight text-clean">
                    {sup.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-fog">{sup.role}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-pay">
                    <span className="h-1.5 w-1.5 rounded-full bg-pay" />
                    Activo ahora
                  </div>
                </div>
              </div>

              <div className="mb-2 rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-ghost">
                  <Icon name="store" className="h-3 w-3" />
                  Mi tienda asignada
                </div>
                <div className="text-[14px] font-medium text-cipher">{sup.tienda}</div>
                <div className="mt-1 text-[10px] text-fog">
                  Sin restricción horaria · Sin límite de monto
                </div>
              </div>

              <div className="mb-2 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <div className="flex items-center gap-3 border-b border-wire px-4 py-3">
                  <Icon name="bell" className="h-5 w-5 text-ghost" />
                  <div className="flex-1">
                    <div className="text-[13px] text-clean">Alertas ventas inusuales</div>
                    <div className="text-[10px] text-fog">Notificación automática al dueño</div>
                  </div>
                  <Toggle defaultOn />
                </div>
                <div className="flex items-center gap-3 border-b border-wire px-4 py-3">
                  <Icon name="lock" className="h-5 w-5 text-ghost" />
                  <div className="flex-1">
                    <div className="text-[13px] text-clean">Modo claro</div>
                  </div>
                  <Toggle defaultOn={false} />
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Icon name="lock" className="h-5 w-5 text-ghost" />
                  <div className="flex-1 text-[13px] text-clean">Cambiar contraseña</div>
                  <Icon name="chevron-right" className="h-4 w-4 text-fog" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex w-full items-center gap-3 rounded-[14px] border border-wire bg-surface px-4 py-3 text-left transition-colors active:bg-lift"
              >
                <Icon name="login" className="h-5 w-5 text-loss" />
                <span className="text-[13px] text-loss">Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav items={NAV} active={tab} onChange={setTab} />
      <Toaster toast={toast} />
      <SessionTimeout />
    </div>
  );
}
