'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { BottomNav, type NavItem } from '@/components/BottomNav';
import { Toaster, useToast } from '@/components/Toaster';
import { SessionTimeout } from '@/components/SessionTimeout';
import { RankingList } from '@/components/RankingList';
import { Toggle } from '@/components/Toggle';
import { OWNER_RANKING } from '@/lib/teamData';
import { FRAUD_EVENT, getFraudAlerts, type FraudAlert } from '@/lib/security';

type Tab = 'inicio' | 'equipo' | 'reportes' | 'config' | 'mas';
type MasView = 'hub' | 'contador' | 'links';

const NAV: NavItem<Tab>[] = [
  { id: 'inicio', label: 'Inicio', icon: 'dashboard' },
  { id: 'equipo', label: 'Equipo', icon: 'users' },
  { id: 'reportes', label: 'Reportes', icon: 'chart-bar' },
  { id: 'config', label: 'Config', icon: 'settings' },
  { id: 'mas', label: 'Más', icon: 'star' },
];

interface Member {
  ini: string;
  name: string;
  sub: string;
  badge: string;
  badgeKind: 'ok' | 'n' | 'e';
  warn?: boolean;
  inactive?: boolean;
}

const SUPERVISORES: Member[] = [
  { ini: 'MG', name: 'Marco Gutiérrez', sub: 'Supervisor · Tienda Centro · 3 vendedores', badge: 'Supervisor', badgeKind: 'ok' },
  { ini: 'RM', name: 'Rosa Mamani', sub: 'Supervisora · Tienda Sur · 2 vendedores', badge: 'Supervisor', badgeKind: 'ok' },
];
const VEND_CENTRO: Member[] = [
  { ini: 'CA', name: 'Carlos Arias', sub: 'Tienda Centro · Lím. Bs 2,000/ticket', badge: 'Vendedor', badgeKind: 'n' },
  { ini: 'JR', name: 'Juan Rojas', sub: 'Tienda Centro · Lím. Bs 2,000/ticket', badge: 'Vendedor', badgeKind: 'n' },
  { ini: 'LM', name: 'Luis Mamani', sub: '⚠ Venta inusual hoy · Tienda Centro', badge: 'Vendedor', badgeKind: 'n', warn: true },
];
const VEND_SUR: Member[] = [
  { ini: 'ML', name: 'María López', sub: 'Tienda Sur · Lím. Bs 1,500/ticket', badge: 'Vendedor', badgeKind: 'n' },
  { ini: 'AP', name: 'Ana Pereira', sub: 'Tienda Sur · inactiva', badge: 'Inactiva', badgeKind: 'e', inactive: true },
];

const badgeClass: Record<Member['badgeKind'], string> = {
  ok: 'bg-pay/10 text-pay',
  n: 'border border-wire bg-lift text-ghost',
  e: 'bg-loss/10 text-loss',
};

const INSIGHTS: { icon: IconName; title: string; desc: React.ReactNode }[] = [
  {
    icon: 'clock',
    title: 'Mejor hora de ventas',
    desc: (
      <>
        Tus ventas son <span className="font-medium text-cipher">40% más altas</span> los viernes
        entre <span className="font-medium text-cipher">10am y 12pm</span>. Considera más vendedores
        en ese horario.
      </>
    ),
  },
  {
    icon: 'user',
    title: 'Rendimiento por turno',
    desc: (
      <>
        Carlos Arias vende <span className="font-medium text-cipher">38% más</span> en turno mañana.
        Su mejor día es el martes.
      </>
    ),
  },
  {
    icon: 'trending-up',
    title: 'Comparación anual',
    desc: (
      <>
        Este mes <span className="font-medium text-cipher">Bs 31,200</span> vs{' '}
        <span className="font-medium text-cipher">Bs 26,400</span> el año pasado. Crecimiento del{' '}
        <span className="font-medium text-cipher">+18%</span>.
      </>
    ),
  },
];

const LINKS = [
  { name: 'Curso Marketing Digital', price: 'Bs 150.00', visitas: 284, pagos: 127, conv: '44%', url: 'pagofirme.bo/p/curso-marketing-digital', faded: false },
  { name: 'Curso Excel Avanzado', price: 'Bs 200.00', visitas: 156, pagos: 89, conv: '57%', url: 'pagofirme.bo/p/excel-avanzado', faded: false },
  { name: 'Pack Cursos Completo', price: 'Bs 350.00', visitas: 43, pagos: 12, conv: '28%', url: 'pagofirme.bo/p/pack-completo', faded: true },
];

export default function DuenoDashboard() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [tab, setTab] = useState<Tab>('inicio');
  const [masView, setMasView] = useState<MasView>('hub');
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);

  // Alertas de fraude generadas por vendedores (persistidas en localStorage).
  useEffect(() => {
    const refresh = () => setFraudAlerts(getFraudAlerts());
    refresh();
    window.addEventListener(FRAUD_EVENT, refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(FRAUD_EVENT, refresh);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  function goTab(id: Tab) {
    if (id === 'mas') setMasView('hub');
    setTab(id);
  }

  function memberRow(m: Member) {
    return (
      <div
        key={m.ini}
        className={`flex items-center gap-2.5 border-b border-wire px-[18px] py-3 ${m.inactive ? 'opacity-50' : ''}`}
      >
        <div
          className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border bg-surface font-heading text-xs font-bold text-cipher ${
            m.inactive ? 'border-loss' : 'border-wire'
          }`}
        >
          {m.ini}
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-medium text-clean">{m.name}</div>
          <div className={`text-[10px] ${m.warn ? 'text-risk' : 'text-fog'}`}>{m.sub}</div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${badgeClass[m.badgeKind]}`}>
          {m.badge}
        </span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-void">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ───── INICIO ───── */}
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
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-wire bg-[#1a1a2e] text-[10px] font-semibold text-ghost">
                    JP
                  </div>
                  <div>
                    <div className="text-[11px] leading-tight text-ghost">Juan Pérez</div>
                    <div className="mt-px inline-block rounded-full border border-wire bg-lift px-1.5 text-[9px] text-ghost">
                      Dueño
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-1.5 p-4 pb-2">
                <div className="rounded-[14px] border border-cipher/25 bg-cipher/[0.05] px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Total hoy</div>
                  <div className="font-heading text-[17px] font-semibold text-clean">Bs 6,480</div>
                  <svg viewBox="0 0 80 18" preserveAspectRatio="none" className="mt-1 h-[18px] w-full">
                    <polyline
                      points="0,14 13,10 26,12 39,7 52,9 65,4 80,2"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity=".5"
                    />
                    <circle cx="80" cy="2" r="2" fill="#22D3EE" opacity=".8" />
                  </svg>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Tickets hoy</div>
                  <div className="font-heading text-[17px] font-semibold text-clean">54</div>
                  <div className="text-[10px] text-fog">2 tiendas</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Semana</div>
                  <div className="font-heading text-[15px] font-semibold text-clean">Bs 31,200</div>
                  <div className="text-[10px] text-fog">Lun–Jue</div>
                </div>
                <div className="rounded-[14px] border border-wire bg-surface px-3.5 py-2.5">
                  <div className="text-[10px] text-fog">Comisiones</div>
                  <div className="font-heading text-[17px] font-semibold text-cipher">Bs 0</div>
                  <div className="text-[10px] text-pay">siempre</div>
                </div>
              </div>

              <div className="px-4 pb-1 pt-1">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-ghost">
                  <Icon name="bell" className="h-3.5 w-3.5" />
                  Alertas del negocio
                </div>
                <div className="overflow-hidden rounded-[14px] border border-wire bg-surface">
                  {fraudAlerts.map((a) => (
                    <div key={a.id} className="flex items-start gap-2.5 border-b border-wire px-3.5 py-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-loss/[0.08] text-loss">
                        <Icon name="alert-triangle" className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-clean">{a.title}</div>
                        <div className="text-[10px] leading-snug text-ghost">{a.desc}</div>
                      </div>
                      <div className="text-[9px] text-fog">{a.time}</div>
                    </div>
                  ))}
                  <div className="flex items-start gap-2.5 border-b border-wire px-3.5 py-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-risk/[0.08] text-risk">
                      <Icon name="trending-up" className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-clean">Venta inusual · Tienda Centro</div>
                      <div className="text-[10px] leading-snug text-ghost">
                        Luis Mamani · Bs 1,800 (prom. Bs 280) · Marco notificado
                      </div>
                    </div>
                    <div className="text-[9px] text-fog">09:12</div>
                  </div>
                  <div className="flex items-start gap-2.5 px-3.5 py-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cipher/[0.08] text-cipher">
                      <Icon name="cash" className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-clean">Pago recibido · Bs 300</div>
                      <div className="text-[10px] leading-snug text-ghost">
                        Carlos Arias · Tienda Centro · #T-0041
                      </div>
                    </div>
                    <div className="text-[9px] text-fog">09:05</div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-1 pt-2 text-[11px] font-medium text-ghost">Mis tiendas hoy</div>
              <div className="px-4 pb-4">
                {/* Tienda Centro */}
                <div className="mb-2 rounded-[14px] border border-cipher/25 bg-cipher/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-[13px] font-semibold text-clean">Tienda Centro</span>
                    <span className="rounded-full bg-pay/10 px-2 py-0.5 text-[10px] text-pay">Activa</span>
                  </div>
                  <div className="mb-2 text-[10px] text-fog">Av. Montes 123, La Paz</div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fog">Ventas hoy</span>
                    <span className="font-medium text-cipher">Bs 4,280</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fog">Tickets</span>
                    <span className="font-medium text-clean">34</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fog">Vendedores activos</span>
                    <span className="font-medium text-clean">3</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 border-t border-wire pt-2">
                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-cipher/[0.08] font-heading text-[8px] font-semibold text-cipher">
                      MG
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-medium text-clean">Marco Gutiérrez</div>
                      <div className="text-[9px] text-fog">Supervisor de tienda</div>
                    </div>
                    <div className="font-heading text-[11px] font-semibold text-cipher">Bs 4,280</div>
                  </div>
                </div>
                {/* Tienda Sur */}
                <div className="rounded-[14px] border border-wire bg-surface px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-[13px] font-semibold text-clean">Tienda Sur</span>
                    <span className="rounded-full bg-pay/10 px-2 py-0.5 text-[10px] text-pay">Activa</span>
                  </div>
                  <div className="mb-2 text-[10px] text-fog">Calle 21 de Sep. 45, El Alto</div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fog">Ventas hoy</span>
                    <span className="font-medium text-cipher">Bs 2,200</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fog">Tickets</span>
                    <span className="font-medium text-clean">20</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-fog">Vendedores activos</span>
                    <span className="font-medium text-clean">2</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 border-t border-wire pt-2">
                    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-cipher/[0.08] font-heading text-[8px] font-semibold text-cipher">
                      RM
                    </div>
                    <div className="flex-1">
                      <div className="text-[11px] font-medium text-clean">Rosa Mamani</div>
                      <div className="text-[9px] text-fog">Supervisora de tienda</div>
                    </div>
                    <div className="font-heading text-[11px] font-semibold text-cipher">Bs 2,200</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── EQUIPO ───── */}
        {tab === 'equipo' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-wire px-[18px] py-3">
              <span className="text-[15px] font-medium text-clean">Mi equipo</span>
              <button
                type="button"
                onClick={() => show('Crear usuario', 'ok')}
                className="flex items-center gap-1 rounded-[10px] bg-cipher px-3 py-1.5 text-[11px] font-medium text-[#0A0C15]"
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
                Nuevo
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="bg-void px-[18px] py-2 text-[10px] font-medium uppercase tracking-wide text-fog">
                Supervisores
              </div>
              {SUPERVISORES.map(memberRow)}
              <div className="bg-void px-[18px] py-2 text-[10px] font-medium uppercase tracking-wide text-fog">
                Vendedores — Tienda Centro
              </div>
              {VEND_CENTRO.map(memberRow)}
              <div className="bg-void px-[18px] py-2 text-[10px] font-medium uppercase tracking-wide text-fog">
                Vendedores — Tienda Sur
              </div>
              {VEND_SUR.map(memberRow)}
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => show('Agregar vendedor', 'ok')}
                  className="flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-dashed border-wire py-2.5 text-xs text-ghost transition-colors active:border-cipher active:text-cipher"
                >
                  <Icon name="plus" className="h-4 w-4" />
                  Agregar vendedor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───── REPORTES ───── */}
        {tab === 'reportes' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Reportes e inteligencia
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2.5 flex gap-1">
                <span className="rounded-full bg-cipher px-3 py-1 text-[11px] font-semibold text-[#0A0C15]">Semana</span>
                <span className="rounded-full border border-wire bg-surface px-3 py-1 text-[11px] text-ghost">Mes</span>
                <span className="rounded-full border border-wire bg-surface px-3 py-1 text-[11px] text-ghost">Rango</span>
              </div>
              <div className="mb-2.5 rounded-[14px] border border-wire bg-surface px-3.5 py-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] text-fog">Total semana — ambas tiendas</span>
                  <span className="font-heading text-lg font-semibold text-cipher">Bs 31,200</span>
                </div>
                {[
                  ['Tienda Centro', 'Bs 19,400'],
                  ['Tienda Sur', 'Bs 11,800'],
                  ['Tickets totales', '284'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-[11px]">
                    <span className="text-fog">{l}</span>
                    <span className="font-medium text-clean">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[11px]">
                  <span className="text-fog">Comisiones pagadas</span>
                  <span className="font-medium text-cipher">Bs 0.00</span>
                </div>
              </div>

              <div className="mb-2 text-[11px] font-medium text-ghost">
                Ranking global — todos los vendedores
              </div>
              <RankingList rows={OWNER_RANKING} />

              <div className="mb-2 mt-3 flex items-center gap-1.5 text-[11px] font-medium text-ghost">
                <Icon name="brain" className="h-3.5 w-3.5" />
                Inteligencia de tu negocio
              </div>
              {INSIGHTS.map((it) => (
                <div key={it.title} className="mb-2 rounded-[14px] border border-wire bg-surface px-3.5 py-3">
                  <div className="mb-1.5 flex items-center gap-2">
                    <div className="flex h-[26px] w-[26px] items-center justify-center rounded-lg bg-cipher/[0.08] text-cipher">
                      <Icon name={it.icon} className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium text-clean">{it.title}</span>
                  </div>
                  <div className="text-[11px] leading-relaxed text-ghost">{it.desc}</div>
                </div>
              ))}

              <div className="mt-1 flex gap-1.5">
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

        {/* ───── CONFIG ───── */}
        {tab === 'config' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Configuración
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <ConfigRow icon="building" title="Mi negocio" sub="Cursos Digitales Bolivia · NIT 1234567890" arrow />
                <ConfigRow icon="credit-card" title="Cuenta bancaria BCB" sub="Banco Mercantil ···4521" arrow />
                <ConfigRow icon="store" title="Mis tiendas" sub="2 tiendas activas" arrow last />
              </div>

              <div className="mb-1.5 px-1 text-[11px] font-medium text-ghost">Control de vendedores</div>
              <div className="mb-2 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <ConfigRow icon="coin" title="Límite por ticket" sub="Centro: Bs 2,000 · Sur: Bs 1,500" arrow />
                <ConfigRow icon="clock" title="Horario de operación" sub="Centro: 8am–6pm · Sur: 9am–7pm" arrow />
                <ConfigRow icon="alert-triangle" title="Alertas ventas inusuales" sub="Cuando supere 3× el promedio del vendedor">
                  <Toggle defaultOn />
                </ConfigRow>
                <ConfigRow icon="device-mobile" title="Sesión única por vendedor" sub="Cierra sesión anterior si abre nueva" last>
                  <Toggle defaultOn />
                </ConfigRow>
              </div>

              <div className="mb-2 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <ConfigRow icon="receipt" title="Suscripción" sub="Plan Pro · Vence 31 dic 2025">
                  <span className="rounded-full border border-cipher/20 bg-cipher/[0.08] px-2 py-0.5 text-[10px] text-cipher">
                    Activo
                  </span>
                </ConfigRow>
                <ConfigRow icon="shield" title="Autenticación 2FA" sub="Google Authenticator · Activo" arrow />
                <ConfigRow icon="bell" title="Notificaciones push" sub="Cada pago recibido en tiempo real" last>
                  <Toggle defaultOn />
                </ConfigRow>
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

        {/* ───── MÁS / HERRAMIENTAS ───── */}
        {tab === 'mas' && masView === 'hub' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Herramientas
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2.5 text-[11px] text-fog">Todo lo que PagoFirme hace por tu negocio</div>
              <ToolCard icon="file-invoice" iconBg="#0a1a2e" iconColor="text-cipher" title="Reporte para el contador" sub="PDF mensual listo · ingresos · IVA · detalle" onClick={() => setMasView('contador')} />
              <ToolCard icon="receipt" iconBg="#2e0a0f" iconColor="text-loss" title="Facturación electrónica" sub="Facturas SIN Bolivia · emisión automática" tag="Próx." tagClass="bg-[#2e2400] text-risk" onClick={() => show('Facturación electrónica · próximamente', 'ok')} />
              <ToolCard icon="link" iconBg="#0a2e1a" iconColor="text-pay" title="Links de pago" sub="Un link por producto · comparte en WhatsApp" onClick={() => setMasView('links')} />
              <ToolCard icon="brain" iconBg="#1a0a2e" iconColor="text-[#a78bfa]" title="Alertas inteligentes" sub="IA analiza tu negocio y te avisa lo importante" tag="3 nuevas" tagClass="bg-[#0a1a2e] text-cipher" onClick={() => show('3 alertas inteligentes nuevas', 'ok')} />
              <ToolCard icon="trophy" iconBg="#2e2400" iconColor="text-risk" title="Ranking del mercado" sub="Cómo estás vs negocios similares en Bolivia" onClick={() => show('Abriendo ranking del mercado', 'ok')} />
              <ToolCard icon="cash" iconBg="#0a2e1a" iconColor="text-pay" title="Crédito para tu negocio" sub="Hasta Bs 15,000 · basado en tus ventas" tag="Nuevo" tagClass="border border-[#16a34a] bg-[#0a2e1a] text-pay" green onClick={() => show('Solicitud de crédito iniciada', 'ok')} />
            </div>
          </div>
        )}

        {tab === 'mas' && masView === 'contador' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center gap-2.5 border-b border-wire px-[18px] py-3">
              <button type="button" onClick={() => setMasView('hub')} aria-label="Volver">
                <Icon name="arrow-left" className="h-5 w-5 text-ghost" />
              </button>
              <span className="text-[15px] font-medium text-clean">Reporte para el contador</span>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2.5 rounded-[14px] border border-wire bg-lift px-3.5 py-3">
                <div className="mb-0.5 text-[11px] text-fog">Próximo reporte automático</div>
                <div className="text-base font-medium text-clean">1 de julio 2025</div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-cipher">
                  <Icon name="mail" className="h-3 w-3" />
                  Se enviará a contador@tuempresa.bo
                </div>
              </div>

              <div className="mb-1.5 text-[11px] font-medium text-ghost">Junio 2025 — resumen fiscal</div>
              <div className="mb-2.5 rounded-[14px] border border-wire bg-surface p-3.5">
                {[
                  ['Ingresos brutos', 'Bs 31,200.00', false],
                  ['IVA 13% a declarar', 'Bs 4,056.00', true],
                  ['IT 3% a declarar', 'Bs 936.00', true],
                  ['Tickets emitidos', '284', false],
                  ['Tienda Centro', 'Bs 19,400.00', false],
                  ['Tienda Sur', 'Bs 11,800.00', false],
                  ['Comisiones pagadas', 'Bs 0.00', true],
                ].map(([l, v, green]) => (
                  <div key={l as string} className="flex justify-between border-b border-wire py-1.5 text-[11px] last:border-b-0">
                    <span className="text-fog">{l}</span>
                    <span className={`font-medium ${green ? 'text-pay' : 'text-clean'}`}>{v}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-wire py-1.5 text-[11px]">
                  <span className="text-fog">Estado SIN</span>
                  <span className="rounded-full border border-pay/20 bg-pay/[0.08] px-2 py-0.5 text-[9px] text-pay">
                    Al día
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => show('Descargando PDF...', 'ok')}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-[14px] bg-cipher py-3 text-[13px] font-semibold text-[#0A0C15] transition active:opacity-90"
              >
                <Icon name="file-text" className="h-[18px] w-[18px]" />
                Descargar PDF — Junio 2025
              </button>
              <button
                type="button"
                onClick={() => show('Enviado al contador por email', 'ok')}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-[14px] border border-wire py-2.5 text-[13px] text-ghost transition-colors active:border-cipher"
              >
                <Icon name="mail" className="h-[18px] w-[18px]" />
                Enviar al contador por email
              </button>

              <div className="mb-1.5 text-[11px] font-medium text-ghost">Reportes anteriores</div>
              {[
                ['Mayo 2025', 'Bs 28,400 · 261 tickets', 'PDF · 84KB'],
                ['Abril 2025', 'Bs 24,100 · 218 tickets', 'PDF · 76KB'],
                ['Marzo 2025', 'Bs 21,800 · 195 tickets', 'PDF · 71KB'],
              ].map(([name, sub, size]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => show(`Descargando ${name}`, 'ok')}
                  className="mb-1.5 flex w-full items-center gap-3 rounded-[14px] border border-wire bg-surface px-3.5 py-3 text-left transition-colors active:bg-lift"
                >
                  <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#0a1a2e] text-cipher">
                    <Icon name="file-text" className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-clean">{name}</div>
                    <div className="text-[10px] text-fog">{sub}</div>
                  </div>
                  <span className="text-[10px] text-ghost">{size}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'mas' && masView === 'links' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-wire px-[18px] py-3">
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={() => setMasView('hub')} aria-label="Volver">
                  <Icon name="arrow-left" className="h-5 w-5 text-ghost" />
                </button>
                <span className="text-[15px] font-medium text-clean">Links de pago</span>
              </div>
              <button
                type="button"
                onClick={() => show('Nuevo link creado', 'ok')}
                className="flex items-center gap-1 rounded-[10px] bg-cipher px-3 py-1.5 text-[11px] font-medium text-[#0A0C15]"
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
                Nuevo
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-3 text-[11px] text-fog">
                Crea un link por producto y compártelo donde quieras. El cliente paga sin que estés
                presente.
              </div>
              {LINKS.map((lk) => (
                <div
                  key={lk.url}
                  className={`mb-2 rounded-[14px] border border-wire bg-surface px-4 py-3 ${lk.faded ? 'opacity-60' : ''}`}
                >
                  <div className="text-[13px] font-medium text-clean">{lk.name}</div>
                  <div className="mb-1.5 font-heading text-xl font-bold text-cipher">{lk.price}</div>
                  <div className="mb-2 flex gap-3 text-[10px] text-fog">
                    <span className="flex items-center gap-1">
                      <Icon name="eye" className="h-3 w-3" />
                      <span className="font-medium text-clean">{lk.visitas}</span> visitas
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="check" className="h-3 w-3" />
                      <span className="font-medium text-clean">{lk.pagos}</span> pagos
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="trending-up" className="h-3 w-3" />
                      <span className="font-medium text-clean">{lk.conv}</span> conv.
                    </span>
                  </div>
                  <div className="mb-2 block overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-wire bg-void px-2.5 py-1.5 font-mono text-[10px] text-ghost">
                    {lk.url}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => show('Compartiendo por WhatsApp...', 'ok')}
                      className="flex flex-1 items-center justify-center gap-1 rounded-[10px] border border-[#065F46] bg-[#064E3B] py-1.5 text-[10px] text-[#A7F3D0]"
                    >
                      <Icon name="whatsapp" className="h-3.5 w-3.5" />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => show('Link copiado', 'ok')}
                      className="flex flex-1 items-center justify-center gap-1 rounded-[10px] border border-wire bg-lift py-1.5 text-[10px] text-ghost transition-colors active:border-cipher active:text-cipher"
                    >
                      <Icon name="copy" className="h-3.5 w-3.5" />
                      Copiar
                    </button>
                    <button
                      type="button"
                      onClick={() => show('Abriendo QR permanente', 'ok')}
                      className="flex flex-1 items-center justify-center gap-1 rounded-[10px] border border-wire bg-lift py-1.5 text-[10px] text-ghost transition-colors active:border-cipher active:text-cipher"
                    >
                      <Icon name="qrcode" className="h-3.5 w-3.5" />
                      QR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav items={NAV} active={tab} onChange={goTab} />
      <Toaster toast={toast} />
      <SessionTimeout />
    </div>
  );
}

function ConfigRow({
  icon,
  title,
  sub,
  arrow = false,
  last = false,
  children,
}: {
  icon: IconName;
  title: string;
  sub?: string;
  arrow?: boolean;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${last ? '' : 'border-b border-wire'}`}>
      <Icon name={icon} className="h-5 w-5 shrink-0 text-ghost" />
      <div className="flex-1">
        <div className="text-[13px] text-clean">{title}</div>
        {sub && <div className="mt-0.5 text-[10px] text-fog">{sub}</div>}
      </div>
      {children}
      {arrow && <Icon name="chevron-right" className="h-4 w-4 text-fog" />}
    </div>
  );
}

function ToolCard({
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  tag,
  tagClass,
  green = false,
  onClick,
}: {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  sub: string;
  tag?: string;
  tagClass?: string;
  green?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-2 flex w-full items-center gap-3 rounded-[14px] border bg-surface px-4 py-3.5 text-left transition-colors active:bg-lift ${
        green ? 'border-[#16a34a]' : 'border-wire'
      }`}
    >
      <div
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px]"
        style={{ background: iconBg }}
      >
        <Icon name={icon} className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-medium text-clean">{title}</div>
        <div className={`mt-0.5 text-[10px] ${green ? 'text-pay' : 'text-fog'}`}>{sub}</div>
      </div>
      {tag ? (
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] ${tagClass ?? ''}`}>{tag}</span>
      ) : (
        <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-fog" />
      )}
    </button>
  );
}
