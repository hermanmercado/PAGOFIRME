'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import type { NavItem } from '@/components/BottomNav';
import { Toaster, useToast } from '@/components/Toaster';
import { SessionTimeout } from '@/components/SessionTimeout';

type AdminTab = 'negocios' | 'usuarios' | 'stats';

interface Negocio {
  ini: string;
  name: string;
  rep: string;
  nit: string;
  ciudad: string;
  estado: 'activo' | 'pendiente';
  avBg: string;
  avColor: string;
}

const NEGOCIOS: Negocio[] = [
  { ini: 'CD', name: 'Cursos Digitales Bolivia', rep: 'Juan Pérez', nit: '1234567890', ciudad: 'La Paz', estado: 'activo', avBg: '#0a1a2e', avColor: 'text-cipher' },
  { ini: 'TM', name: 'Tienda Mamani S.R.L.', rep: 'Rosa Mamani', nit: '9876543210', ciudad: 'El Alto', estado: 'pendiente', avBg: '#2e2400', avColor: 'text-risk' },
  { ini: 'FR', name: 'Ferretería Rodríguez', rep: 'Luis Rodríguez', nit: '4567891230', ciudad: 'Cochabamba', estado: 'pendiente', avBg: '#2e0a0f', avColor: 'text-loss' },
  { ini: 'MP', name: 'MiniMarket Palca', rep: 'Carmen Flores', nit: '3210987654', ciudad: 'Cochabamba', estado: 'activo', avBg: '#0a1a2e', avColor: 'text-cipher' },
];

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'activos', label: 'Activos' },
] as const;
type Filter = (typeof FILTERS)[number]['id'];

const NAV: NavItem<AdminTab>[] = [
  { id: 'negocios', label: 'Negocios', icon: 'building' },
  { id: 'usuarios', label: 'Usuarios', icon: 'users' },
  { id: 'stats', label: 'Stats', icon: 'chart-bar' },
];

const KYC: { icon: IconName; label: string; badge: string; badgeClass: string; iconColor: string }[] = [
  { icon: 'id', label: 'Cédula de identidad', badge: 'OK', badgeClass: 'bg-pay/10 text-pay', iconColor: 'text-cipher' },
  { icon: 'building', label: 'NIT registrado', badge: 'Revisar', badgeClass: 'bg-risk/10 text-risk', iconColor: 'text-risk' },
  { icon: 'home', label: 'Domicilio', badge: 'Pendiente', badgeClass: 'border border-wire bg-lift text-ghost', iconColor: 'text-fog' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [tab, setTab] = useState<AdminTab>('negocios');
  const [filter, setFilter] = useState<Filter>('todos');
  const [selected, setSelected] = useState<Negocio | null>(null);

  const visibles = NEGOCIOS.filter((n) =>
    filter === 'todos' ? true : filter === 'activos' ? n.estado === 'activo' : n.estado === 'pendiente',
  );

  function logout() {
    router.push('/');
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-void">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Detalle de negocio (KYC) */}
        {selected ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center gap-2.5 border-b border-wire px-[18px] py-3">
              <button type="button" onClick={() => setSelected(null)} aria-label="Volver">
                <Icon name="arrow-left" className="h-5 w-5 text-ghost" />
              </button>
              <div className="flex-1">
                <div className="text-sm font-medium text-clean">{selected.name}</div>
                <div className={`text-[10px] ${selected.estado === 'activo' ? 'text-cipher' : 'text-risk'}`}>
                  {selected.estado === 'activo' ? 'Activo y verificado' : 'Pendiente de verificación'}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  selected.estado === 'activo' ? 'bg-pay/10 text-pay' : 'bg-risk/10 text-risk'
                }`}
              >
                {selected.estado === 'activo' ? 'Activo' : 'Revisar'}
              </span>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <div className="border-b border-wire px-3.5 py-2 text-[10px] font-medium uppercase tracking-wide text-ghost">
                  Datos del negocio
                </div>
                {[
                  ['Representante', selected.rep],
                  ['NIT', selected.nit],
                  ['Ciudad', selected.ciudad],
                  ['Solicitud', '10 jun 2025'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-wire px-4 py-2.5 last:border-b-0">
                    <span className="text-[11px] text-fog">{k}</span>
                    <span className="text-[11px] font-medium text-clean">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mb-3 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <div className="border-b border-wire px-3.5 py-2 text-[10px] font-medium uppercase tracking-wide text-ghost">
                  Documentos KYC
                </div>
                {KYC.map((d) => (
                  <div key={d.label} className="flex items-center gap-3 border-b border-wire px-4 py-2.5 last:border-b-0">
                    <Icon name={d.icon} className={`h-[18px] w-[18px] ${d.iconColor}`} />
                    <span className="flex-1 text-xs text-clean">{d.label}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${d.badgeClass}`}>{d.badge}</span>
                  </div>
                ))}
              </div>

              {selected.estado === 'activo' ? (
                <div className="rounded-[14px] border border-wire bg-lift px-4 py-3 text-center text-[13px] text-ghost">
                  Negocio ya activo y verificado
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      show(`${selected.name} rechazado`, 'warn');
                      setSelected(null);
                    }}
                    className="flex-1 rounded-[14px] border border-loss py-3 text-[13px] text-loss transition-colors active:bg-loss/[0.08]"
                  >
                    Rechazar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      show(`${selected.name} aprobado y activado`, 'ok');
                      setSelected(null);
                    }}
                    className="flex-1 rounded-[14px] bg-cipher py-3 text-[13px] font-semibold text-[#0A0C15] transition active:opacity-90"
                  >
                    Aprobar y activar
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <header className="flex shrink-0 items-center justify-between border-b border-wire px-[18px] py-3">
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
              <span className="rounded-full border border-risk bg-[#2e2400] px-2.5 py-1 text-[11px] text-risk">
                Superadmin
              </span>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {tab === 'negocios' && (
                <>
                  <div className="flex gap-1 px-4 pb-1.5 pt-3">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={`rounded-full px-3 py-1 text-[11px] transition-colors ${
                          filter === f.id
                            ? 'bg-cipher font-semibold text-[#0A0C15]'
                            : 'border border-wire bg-surface text-ghost'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {visibles.map((n) => (
                    <button
                      key={n.nit}
                      type="button"
                      onClick={() => setSelected(n)}
                      className="flex w-full items-center gap-2.5 border-b border-wire px-[18px] py-3 text-left transition-colors active:bg-surface"
                    >
                      <div
                        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold ${n.avColor}`}
                        style={{ background: n.avBg }}
                      >
                        {n.ini}
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] font-medium text-clean">{n.name}</div>
                        <div className="mt-0.5 text-[10px] text-fog">
                          {n.rep} · NIT {n.nit} · {n.ciudad}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          n.estado === 'activo' ? 'bg-pay/10 text-pay' : 'bg-risk/10 text-risk'
                        }`}
                      >
                        {n.estado === 'activo' ? 'Activo' : 'Revisar'}
                      </span>
                    </button>
                  ))}

                  <div className="grid grid-cols-2 gap-1.5 p-4">
                    {[
                      ['4', 'negocios'],
                      ['2', 'pendientes'],
                      ['Bs 0', 'comisiones'],
                      ['284', 'tickets semana'],
                    ].map(([v, l]) => (
                      <div key={l} className="rounded-[14px] border border-wire bg-surface px-3.5 py-3">
                        <div className="font-heading text-[22px] font-bold tracking-tight text-cipher">{v}</div>
                        <div className="mt-0.5 text-[10px] text-fog">{l}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {tab === 'usuarios' && (
                <div className="flex flex-col items-center gap-2 py-16 text-center text-xs text-fog">
                  <Icon name="users" className="h-9 w-9" />
                  Gestión de usuarios · próximamente
                </div>
              )}

              {tab === 'stats' && (
                <div className="grid grid-cols-2 gap-1.5 p-4">
                  {[
                    ['4', 'negocios activos'],
                    ['2', 'verificaciones pend.'],
                    ['284', 'tickets / semana'],
                    ['Bs 0', 'comisiones cobradas'],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-[14px] border border-wire bg-surface px-3.5 py-3">
                      <div className="font-heading text-[22px] font-bold tracking-tight text-cipher">{v}</div>
                      <div className="mt-0.5 text-[10px] text-fog">{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <nav className="flex shrink-0 border-t border-wire bg-void">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSelected(null);
              setTab(item.id);
            }}
            className={`flex flex-1 flex-col items-center gap-0.5 px-1 pb-3 pt-2 text-[9px] transition-colors ${
              !selected && tab === item.id ? 'text-cipher' : 'text-fog'
            }`}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={logout}
          className="flex flex-1 flex-col items-center gap-0.5 px-1 pb-3 pt-2 text-[9px] text-fog"
        >
          <Icon name="login" className="h-5 w-5" />
          Salir
        </button>
      </nav>
      <Toaster toast={toast} />
      <SessionTimeout />
    </div>
  );
}
