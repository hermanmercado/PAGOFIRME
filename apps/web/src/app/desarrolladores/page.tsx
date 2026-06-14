'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/icons';
import { BottomNav, type NavItem } from '@/components/BottomNav';
import { Toaster, useToast } from '@/components/Toaster';
import { SessionTimeout } from '@/components/SessionTimeout';
import { Toggle } from '@/components/Toggle';

type Tab = 'inicio' | 'docs' | 'webhooks' | 'plan';

const PURPLE = '#a78bfa';

const NAV: NavItem<Tab>[] = [
  { id: 'inicio', label: 'Inicio', icon: 'dashboard' },
  { id: 'docs', label: 'Docs', icon: 'code' },
  { id: 'webhooks', label: 'Webhooks', icon: 'webhook' },
  { id: 'plan', label: 'Plan', icon: 'credit-card' },
];

const API_KEY_MASKED = 'pk_test_••••••••••••••••••••••••4f2a';
const API_KEY_REAL = 'pk_test_5f8c2a9d4e1b7c3a6f0d8e2b4f2a';

interface Endpoint {
  id: string;
  method: 'POST' | 'GET' | 'DEL';
  path: string;
  desc: string;
  code: string;
  resp: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'crear',
    method: 'POST',
    path: '/cobros',
    desc: 'Crear QR de cobro',
    code: `{
  "monto": 150.00,
  "descripcion": "Curso Marketing Digital",
  "webhook_url": "https://tuapp.bo/pagos/confirmado",
  "referencia": "ORD-2025-001"
}`,
    resp: `{
  "cobro_id": "COB-TEST-0001",
  "qr_url": "https://pagofirme.bo/qr/COB-TEST-0001",
  "monto": 150.00,
  "estado": "pendiente",
  "expira_en": "2025-06-12T10:05:00Z"
}`,
  },
  {
    id: 'consultar',
    method: 'GET',
    path: '/cobros/{id}',
    desc: 'Consultar estado',
    code: `GET /cobros/COB-2025-0847`,
    resp: `{
  "cobro_id": "COB-TEST-0001",
  "estado": "pagado",
  "monto": 150.00,
  "bcb_id": "BCB-2025-00847",
  "comision": 0.00
}`,
  },
  {
    id: 'listar',
    method: 'GET',
    path: '/cobros',
    desc: 'Listar cobros',
    code: `GET /cobros?estado=pagado&desde=2025-06-01&limite=50`,
    resp: `{
  "total": 847,
  "cobros": [ { "cobro_id": "COB-TEST-0001", "estado": "pagado" } ]
}`,
  },
  {
    id: 'anular',
    method: 'DEL',
    path: '/cobros/{id}',
    desc: 'Anular cobro pendiente',
    code: `DEL /cobros/COB-2025-0847`,
    resp: `{
  "cobro_id": "COB-TEST-0001",
  "anulado": true,
  "anulado_en": "2025-06-12T09:50:00Z"
}`,
  },
];

const METHOD_CLASS: Record<Endpoint['method'], string> = {
  POST: 'bg-pay/10 text-pay',
  GET: 'bg-cipher/10 text-cipher',
  DEL: 'bg-loss/10 text-loss',
};

const PLANS = [
  {
    name: 'Developer Pro',
    price: 'Bs 500',
    active: true,
    features: ['5,000 llamadas/mes', 'Webhooks ilimitados', 'Sandbox incluido', 'Soporte por WhatsApp', 'Dashboard de métricas'],
    cta: null,
  },
  {
    name: 'Enterprise',
    price: 'Bs 1,500',
    active: false,
    features: ['Llamadas ilimitadas', 'SLA 99.99% uptime', 'IP dedicada', 'Soporte prioritario', 'Facturación electrónica'],
    cta: { label: 'Hablar con ventas', warn: false },
  },
  {
    name: 'Developer Básico',
    price: 'Bs 200',
    active: false,
    features: ['1,000 llamadas/mes', '3 webhooks', 'Sandbox incluido', 'Soporte por email'],
    cta: { label: 'Bajar a Básico', warn: true },
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto whitespace-pre rounded-[10px] border border-[#6d28d9]/20 bg-[#060810] px-3 py-2.5 font-mono text-[10px] leading-relaxed text-[#c4b5fd]">
      {children}
    </pre>
  );
}

export default function DeveloperPortal() {
  const router = useRouter();
  const { toast, show } = useToast();
  const [tab, setTab] = useState<Tab>('inicio');
  const [keyVisible, setKeyVisible] = useState(false);
  const [openEp, setOpenEp] = useState<string | null>('crear');
  const [tried, setTried] = useState<Record<string, 'loading' | 'done'>>({});

  function tryEndpoint(id: string) {
    setTried((t) => ({ ...t, [id]: 'loading' }));
    setTimeout(() => setTried((t) => ({ ...t, [id]: 'done' })), 700);
  }

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-void">
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ───── INICIO ───── */}
        {tab === 'inicio' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-wire px-[18px] py-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  aria-label="Volver al login"
                  className="text-ghost transition-colors active:text-[#a78bfa]"
                >
                  <Icon name="arrow-left" className="h-5 w-5" />
                </button>
                <div className="font-heading text-[15px] font-bold">
                  <span className="text-clean">pago</span>
                  <span className="text-cipher">firme</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a0a2e] text-[10px] font-semibold text-[#a78bfa]">
                  MV
                </div>
                <div>
                  <div className="text-[11px] leading-tight text-ghost">Mario Vega</div>
                  <div className="mt-px inline-block rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/[0.08] px-1.5 text-[9px] text-[#a78bfa]">
                    Developer
                  </div>
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-risk bg-[#2e2000] px-4 py-1.5">
                <Icon name="flask" className="h-3.5 w-3.5 shrink-0 text-risk" />
                <span className="flex-1 text-[11px] text-risk">
                  Modo sandbox activo · las transacciones son de prueba
                </span>
                <button
                  type="button"
                  onClick={() => show('Activando producción...', 'ok')}
                  className="text-[10px] text-risk underline"
                >
                  Activar producción
                </button>
              </div>

              <div className="p-4 pb-2">
                <div className="rounded-[14px] border border-[#6d28d9]/30 bg-gradient-to-br from-[#2a1a4e]/60 to-surface p-4">
                  <div className="text-[10px] text-[#a78bfa]">Llamadas este mes</div>
                  <div className="font-heading text-[26px] font-bold text-clean">1,284</div>
                  <div className="text-[10px] text-fog">de 5,000 incluidas · 74% disponible</div>
                  <div className="mt-2 h-1 overflow-hidden rounded bg-lift">
                    <div className="h-full rounded bg-gradient-to-r from-[#6d28d9] to-[#a78bfa]" style={{ width: '26%' }} />
                  </div>
                </div>
              </div>

              <div className="px-4 pb-2">
                <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium text-ghost">
                  <Icon name="key" className="h-3 w-3" />
                  Tu API Key
                </div>
                <div className="flex items-center gap-2.5 rounded-[10px] border border-[#6d28d9]/20 bg-void px-3 py-2.5">
                  <span className="flex-1 truncate font-mono text-[11px] text-[#a78bfa]">
                    {keyVisible ? API_KEY_REAL : API_KEY_MASKED}
                  </span>
                  <button type="button" onClick={() => setKeyVisible((v) => !v)} aria-label="Mostrar API key" className="text-[#a78bfa]">
                    <Icon name="eye" className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => show('API Key copiada al portapapeles', 'ok')} aria-label="Copiar" className="text-[#a78bfa]">
                    <Icon name="copy" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 px-4 pb-2">
                {[
                  ['Cobros exitosos', '847', '↑ 23%', PURPLE],
                  ['Monto procesado', 'Bs 124,500', 'este mes', '#8892B0'],
                  ['Tiempo resp. API', '142ms', 'promedio', '#4ADE80'],
                  ['Uptime', '99.9%', 'últimos 30 días', '#4ADE80'],
                ].map(([l, v, s, c]) => (
                  <div key={l} className="rounded-[14px] border border-[#2a1a4e] bg-surface px-3.5 py-2.5">
                    <div className="text-[10px] text-fog">{l}</div>
                    <div className="font-heading text-[15px] font-semibold" style={{ color: c }}>
                      {v}
                    </div>
                    <div className="text-[10px] text-fog">{s}</div>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-ghost">
                    <Icon name="dashboard" className="h-3.5 w-3.5" />
                    Mis aplicaciones
                  </span>
                  <button
                    type="button"
                    onClick={() => show('Nueva app creada', 'ok')}
                    className="flex items-center gap-1 rounded-[10px] border border-[#6d28d9] bg-[#1a0a2e] px-2.5 py-1 text-[10px] text-[#a78bfa]"
                  >
                    <Icon name="plus" className="h-3 w-3" />
                    Nueva app
                  </button>
                </div>
                <div className="overflow-hidden rounded-[14px] border border-wire bg-surface">
                  <div className="flex items-center gap-2.5 border-b border-wire px-3.5 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#1a0a2e] text-[#a78bfa]">
                      <Icon name="shopping-cart" className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-clean">TiendaOnline.bo</div>
                      <div className="text-[10px] text-fog">847 cobros · activa</div>
                    </div>
                    <span className="h-[7px] w-[7px] rounded-full bg-pay" />
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#1a0a2e] text-[#a78bfa]">
                      <Icon name="school" className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-clean">AcademiaDigital.bo</div>
                      <div className="text-[10px] text-fog">437 cobros · sandbox</div>
                    </div>
                    <span className="h-[7px] w-[7px] rounded-full bg-risk" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───── DOCS ───── */}
        {tab === 'docs' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-wire px-[18px] py-3">
              <span className="text-[15px] font-medium text-clean">Documentación API</span>
              <span className="flex items-center gap-1 rounded-full border border-risk/20 bg-risk/[0.08] px-2 py-0.5 text-[10px] text-risk">
                <Icon name="flask" className="h-3 w-3" />
                Sandbox
              </span>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-2.5 text-[11px] text-fog">
                Base URL: <span className="font-mono text-[#a78bfa]">https://api.pagofirme.bo/v1</span>
              </div>
              <div className="mb-1.5 text-[11px] font-medium text-ghost">Autenticación</div>
              <div className="mb-3">
                <CodeBlock>{`// Header requerido en todas las requests
Authorization: Bearer pk_test_TU_API_KEY`}</CodeBlock>
              </div>

              <div className="mb-1.5 text-[11px] font-medium text-ghost">Endpoints</div>
              {ENDPOINTS.map((ep) => {
                const open = openEp === ep.id;
                const state = tried[ep.id];
                return (
                  <div key={ep.id} className="mb-2 overflow-hidden rounded-[14px] border border-wire bg-surface">
                    <button
                      type="button"
                      onClick={() => setOpenEp(open ? null : ep.id)}
                      className="flex w-full items-center gap-2 px-3.5 py-3 text-left transition-colors active:bg-lift"
                    >
                      <span className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${METHOD_CLASS[ep.method]}`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs text-clean">{ep.path}</span>
                      <span className="flex-1 text-[10px] text-fog">{ep.desc}</span>
                      <Icon
                        name="chevron-down"
                        className={`h-3.5 w-3.5 text-fog transition-transform ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open && (
                      <div className="border-t border-wire bg-void px-3.5 py-3">
                        <CodeBlock>{ep.code}</CodeBlock>
                        <button
                          type="button"
                          onClick={() => tryEndpoint(ep.id)}
                          className="mt-2 flex items-center gap-1.5 rounded-[10px] border border-[#6d28d9]/20 bg-[#1a0a2e] px-3 py-1.5 text-[11px] font-medium text-[#a78bfa]"
                        >
                          <Icon name="play" className="h-3 w-3" />
                          Probar en sandbox
                        </button>
                        {state && (
                          <pre
                            className={`mt-2 overflow-x-auto whitespace-pre rounded-[10px] border px-3 py-2.5 font-mono text-[10px] leading-relaxed ${
                              state === 'loading'
                                ? 'border-risk/15 bg-[#040608] text-[#fcd34d]'
                                : 'border-pay/15 bg-[#040608] text-[#86efac]'
                            }`}
                          >
                            {state === 'loading' ? 'Llamando API sandbox...' : ep.resp}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ───── WEBHOOKS ───── */}
        {tab === 'webhooks' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex shrink-0 items-center justify-between border-b border-wire px-[18px] py-3">
              <span className="text-[15px] font-medium text-clean">Webhooks</span>
              <button
                type="button"
                onClick={() => show('Webhook agregado', 'ok')}
                className="flex items-center gap-1 rounded-[10px] border border-[#6d28d9] bg-[#1a0a2e] px-3 py-1.5 text-[11px] text-[#a78bfa]"
              >
                <Icon name="plus" className="h-3 w-3" />
                Agregar
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="mb-3 text-[11px] leading-relaxed text-ghost">
                PagoFirme envía una notificación POST a tu URL cuando ocurre un evento. Tu servidor
                debe responder con HTTP 200.
              </div>

              <div className="mb-1.5 text-[11px] font-medium text-ghost">URLs configuradas</div>
              <div className="mb-3 overflow-hidden rounded-[14px] border border-wire bg-surface">
                <div className="flex items-center gap-2.5 border-b border-wire px-3.5 py-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-pay" />
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-mono text-[11px] text-ghost">https://tiendaonline.bo/pagos/webhook</div>
                    <div className="mt-0.5 text-[9px] text-fog">Último evento: hace 3 min · 847 eventos</div>
                  </div>
                  <button type="button" onClick={() => show('Webhook eliminado', 'warn')} aria-label="Eliminar" className="text-fog">
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-loss" />
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-mono text-[11px] text-ghost">https://academiadigital.bo/api/pf</div>
                    <div className="mt-0.5 text-[9px] text-loss">Error 404 · último intento: hace 1h</div>
                  </div>
                  <button type="button" onClick={() => show('Reintentando webhook...', 'ok')} aria-label="Reintentar" className="text-fog">
                    <Icon name="refresh" className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-1.5 text-[11px] font-medium text-ghost">Eventos disponibles</div>
              <div className="mb-3 overflow-hidden rounded-[14px] border border-wire bg-surface">
                {(
                  [
                    { ev: 'cobro.pagado', icon: 'circle-check', color: 'text-pay', on: true },
                    { ev: 'cobro.pendiente', icon: 'clock', color: 'text-risk', on: true },
                    { ev: 'cobro.anulado', icon: 'x', color: 'text-loss', on: false },
                    { ev: 'cobro.expirado', icon: 'alert-triangle', color: 'text-risk', on: false },
                  ] as { ev: string; icon: IconName; color: string; on: boolean }[]
                ).map((e) => (
                  <div key={e.ev} className="flex items-center gap-2 border-b border-wire px-3.5 py-2.5 last:border-b-0">
                    <Icon name={e.icon} className={`h-3.5 w-3.5 ${e.color}`} />
                    <span className="flex-1 font-mono text-[11px] text-clean">{e.ev}</span>
                    <Toggle defaultOn={e.on} />
                  </div>
                ))}
              </div>

              <div className="mb-1.5 text-[11px] font-medium text-ghost">Ejemplo de payload</div>
              <CodeBlock>{`{
  "evento": "cobro.pagado",
  "timestamp": "2025-06-12T09:43:12Z",
  "data": {
    "cobro_id": "COB-2025-0847",
    "monto": 150.00,
    "referencia": "ORD-2025-001",
    "bcb_id": "BCB-2025-00847",
    "comision": 0.00
  }
}`}</CodeBlock>
            </div>
          </div>
        )}

        {/* ───── PLAN ───── */}
        {tab === 'plan' && (
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="shrink-0 border-b border-wire px-[18px] py-3 text-[15px] font-medium text-clean">
              Mi plan
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {PLANS.map((p) => {
                const cta = p.cta;
                return (
                <div
                  key={p.name}
                  className={`relative mb-2 rounded-[14px] border p-4 ${
                    p.active
                      ? 'border-[#6d28d9]/35 bg-gradient-to-br from-[#6d28d9]/[0.08] to-surface'
                      : 'border-wire bg-surface'
                  }`}
                >
                  {p.active && (
                    <span className="absolute right-3 top-3 rounded-full border border-[#a78bfa]/20 bg-[#a78bfa]/10 px-2 py-0.5 text-[9px] text-[#a78bfa]">
                      Plan actual
                    </span>
                  )}
                  <div className="font-heading text-sm font-semibold text-clean">{p.name}</div>
                  <div className="mb-1.5 font-heading text-[22px] font-bold text-[#a78bfa]">
                    {p.price}
                    <span className="text-xs font-normal text-fog">/mes</span>
                  </div>
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 py-0.5 text-[11px] text-ghost">
                      <Icon name="check" className="h-3 w-3 text-[#a78bfa]" />
                      {f}
                    </div>
                  ))}
                  {cta && (
                    <button
                      type="button"
                      onClick={() => show(`${cta.label}...`, cta.warn ? 'warn' : 'ok')}
                      className={`mt-2.5 w-full rounded-[10px] py-2.5 text-xs font-medium ${
                        cta.warn
                          ? 'border border-wire bg-lift text-ghost'
                          : 'border border-[#6d28d9] bg-[#1a0a2e] text-[#a78bfa]'
                      }`}
                    >
                      {cta.label}
                    </button>
                  )}
                </div>
                );
              })}

              <div className="mb-1.5 mt-1 text-[11px] font-medium text-ghost">Uso este mes</div>
              <div className="overflow-hidden rounded-[14px] border border-wire bg-surface">
                <div className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-[11px] text-fog">Llamadas API</span>
                  <span className="font-mono text-[11px] text-clean">1,284 / 5,000</span>
                </div>
                <div className="px-3.5 pb-2.5">
                  <div className="h-1 overflow-hidden rounded bg-lift">
                    <div className="h-full rounded bg-gradient-to-r from-[#6d28d9] to-[#a78bfa]" style={{ width: '26%' }} />
                  </div>
                  <div className="mt-1 text-[9px] text-fog">26% utilizado · renueva el 1 jul</div>
                </div>
                {[
                  ['Cobros procesados', 'Bs 124,500'],
                  ['Webhooks enviados', '1,276'],
                  ['Próxima factura', 'Bs 500 · 1 jul 2025'],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between border-t border-wire px-3.5 py-2.5">
                    <span className="text-[11px] text-fog">{l}</span>
                    <span className="font-mono text-[11px] text-clean">{v}</span>
                  </div>
                ))}
              </div>
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
