import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { QrMatrix } from '@/components/QrMatrix';

/**
 * Landing pública de PagoFirme. Server Component (sin hooks): tipográfico,
 * oscuro, con mucho aire, titulares en Syne (font-heading) y acento cian.
 * Reutiliza la marca: la matriz QR y la línea de escaneo `qr-scan-line`.
 *
 * Enfoque: el vendedor/emprendedor individual que cobra todos los días.
 * Mensaje aspiracional (visión completa multi-riel), una idea fuerte por
 * sección y cero jerga. Mobile-first: nada se desborda en celulares angostos.
 *
 * Layout: patrón "full-bleed con contenido centrado". El fondo y las líneas
 * divisorias de cada sección llegan de borde a borde; el contenido vive en un
 * contenedor central (`SHELL`) legible, con padding lateral generoso y
 * consistente que escala en escritorio.
 */

/** Contenedor central reutilizable: ancho legible + padding lateral escalonado. */
const SHELL = 'mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12';

const claims: Array<{ icon: IconName; label: string; detail: string }> = [
  { icon: 'coin', label: '0% comisiones', detail: 'Cobrás el 100%' },
  { icon: 'clock', label: 'Cobro al instante', detail: 'Confirmación inmediata' },
  { icon: 'shield', label: 'Hecho para Bolivia', detail: 'Pensado para vos y tu negocio' },
];

const steps: Array<{ title: string; body: string }> = [
  { title: 'Creá tu cuenta', body: 'Te registrás vos y tu negocio en menos de un minuto.' },
  {
    title: 'Mostrá tu QR',
    body: 'Uno solo, siempre listo en tu celular. Sin máquina ni hardware.',
  },
  {
    title: 'Cobrá y confirmá',
    body: 'El cliente paga y vos recibís la confirmación al instante.',
  },
];

const audiences: Array<{ icon: IconName; label: string }> = [
  { icon: 'user', label: 'Vendedores y comerciantes' },
  { icon: 'store', label: 'Tiendas y locales' },
  { icon: 'users', label: 'Equipos que crecen' },
];

const benefits: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'cash',
    title: 'Cero comisiones, siempre',
    body: 'No te quedamos con un centavo. Lo que cobrás es tuyo, directo a tu cuenta.',
  },
  {
    icon: 'device-mobile',
    title: 'Sin terminal ni hardware',
    body: 'Tu celular es la caja. Generás tu QR y ya estás cobrando, hoy mismo.',
  },
  {
    icon: 'lock',
    title: 'Tu plata, segura',
    body: 'Verificación en dos pasos y alertas de actividad inusual cuidan tu cuenta.',
  },
  {
    icon: 'file-invoice',
    title: 'Listo para el contador',
    body: 'Cada cobro queda registrado, con tu reporte de IVA e IT cuando lo necesites.',
  },
];

const rails: Array<{ icon: IconName; title: string; body: string }> = [
  { icon: 'qrcode', title: 'QR bancario', body: 'El QR interoperable de los bancos.' },
  { icon: 'device-mobile', title: 'Billeteras móviles', body: 'Pagos desde el celular.' },
  { icon: 'refresh', title: 'Transferencias', body: 'Directo entre cuentas.' },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-void text-clean">
      {/* Atmósfera: gradientes radiales cian sobre el fondo oscuro (full-width). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,.10) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 85% 110%, rgba(34,211,238,.05) 0%, transparent 60%)',
        }}
      />
      {/* Retícula de puntos tipo QR (full-width). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(34,211,238,.10) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className={`${SHELL} flex items-center justify-between py-6`}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-cipher/25 bg-gradient-to-br from-surface to-lift">
              <Icon name="qrcode" className="h-5 w-5 text-cipher" />
              <span className="qr-scan-line" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">
              pago<span className="text-cipher">firme</span>
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-full border border-wire px-4 py-2 text-xs font-medium text-ghost transition-colors hover:border-cipher hover:text-clean"
          >
            Ingresar
          </Link>
        </header>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section>
          <div className={`${SHELL} grid items-center gap-10 py-16 md:grid-cols-2 md:py-24`}>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cipher/25 bg-cipher/[0.06] px-3 py-1 text-[11px] font-medium text-cipher">
                <span className="h-1.5 w-1.5 rounded-full bg-cipher" />
                Pagos QR para Bolivia
              </span>
              <h1 className="mt-5 break-words font-heading text-[clamp(2rem,9vw,3rem)] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                Cobrá con un QR.
                <br />
                <span className="text-cipher">Quedate con todo.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-ghost">
                Tu cliente escanea, paga y listo. Sin terminal, sin papeleo y sin que nadie te
                descuente comisiones. Lo que vendés es lo que recibís.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/registro"
                  className="flex items-center gap-2 rounded-[14px] bg-cipher px-6 py-3 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90"
                >
                  Crear mi cuenta gratis
                  <Icon name="chevron-right" className="h-[18px] w-[18px]" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-[14px] border border-wire px-6 py-3 text-sm font-semibold text-clean transition-colors hover:border-cipher"
                >
                  <Icon name="login" className="h-[18px] w-[18px]" />
                  Ingresar
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-fog">
                Listo en 1 minuto · Sin costos de instalación · Cero comisiones
              </p>
            </div>

            {/* Visual: matriz QR de marca con línea de escaneo. */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-full max-w-[288px] overflow-hidden rounded-[28px] border border-cipher/20 bg-gradient-to-br from-surface to-lift p-4 shadow-[0_0_60px_rgba(34,211,238,0.12)] sm:p-6 md:w-auto">
                <div className="overflow-hidden rounded-xl">
                  <QrMatrix
                    code="pagofirme-landing"
                    size={240}
                    label="Código QR de demostración"
                    className="h-auto w-full max-w-[240px]"
                  />
                </div>
                <span className="qr-scan-line" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Banda de claims (divisor de borde a borde) ─────── */}
        <section className="border-y border-wire">
          <div className={`${SHELL} grid gap-3 py-6 sm:grid-cols-3`}>
            {claims.map((c) => (
              <div key={c.label} className="flex items-center gap-3 px-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-wire bg-surface">
                  <Icon name={c.icon} className="h-5 w-5 text-cipher" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-clean">{c.label}</div>
                  <div className="text-[11px] text-fog">{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Cómo funciona ──────────────────────────────────── */}
        <section>
          <div className={`${SHELL} py-20 md:py-28`}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cipher">
              Cómo funciona
            </span>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Empezá a cobrar en 3 pasos.
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="relative">
                  <div className="font-heading text-5xl font-extrabold text-cipher/30">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-semibold text-clean">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ghost">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Para quién (divisor de borde a borde) ──────────── */}
        <section className="border-t border-wire">
          <div className={`${SHELL} py-20 md:py-28`}>
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cipher">
                  Para quién es
                </span>
                <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Pensado para el que cobra todos los días.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-ghost">
                  Seas vendedor, tengas tu tienda o trabajes por tu cuenta, PagoFirme es tu caja en
                  el bolsillo. Sin contratos, sin alquiler de terminal, sin sorpresas. Y el día que
                  crezcas y sumes gente, organizás tu equipo desde el mismo lugar.
                </p>
              </div>
              <div className="grid gap-3">
                {audiences.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl border border-wire bg-surface/60 px-5 py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cipher/20 bg-cipher/[0.06]">
                      <Icon name={item.icon} className="h-5 w-5 text-cipher" />
                    </span>
                    <span className="text-sm font-semibold text-clean">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Beneficios (divisor de borde a borde) ──────────── */}
        <section className="border-t border-wire">
          <div className={`${SHELL} py-20 md:py-28`}>
            <h2 className="max-w-xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Todo a tu favor, nada en contra.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-wire bg-surface/60 p-6 transition-colors hover:border-cipher/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cipher/20 bg-cipher/[0.06]">
                    <Icon name={b.icon} className="h-6 w-6 text-cipher" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-clean">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ghost">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Multi-riel (visión, divisor de borde a borde) ──── */}
        <section className="border-t border-wire">
          <div className={`${SHELL} py-20 md:py-28`}>
            <div className="relative overflow-hidden rounded-[32px] border border-cipher/20 bg-gradient-to-br from-surface to-lift px-6 py-14 sm:px-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(34,211,238,.12) 0%, transparent 70%)',
                }}
              />
              <div className="relative">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cipher">
                  Multi-riel
                </span>
                <h2 className="mt-3 max-w-xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Un QR que funciona con todos.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ghost">
                  PagoFirme conecta los rieles de pago de Bolivia para que tu cliente pague como
                  quiera y a vos siempre te llegue. Una sola pantalla, todos los bancos.
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {rails.map((r) => (
                    <div
                      key={r.title}
                      className="rounded-2xl border border-wire bg-void/40 p-5 backdrop-blur-sm"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cipher/20 bg-cipher/[0.06]">
                        <Icon name={r.icon} className="h-6 w-6 text-cipher" />
                      </span>
                      <h3 className="mt-4 font-heading text-base font-semibold text-clean">
                        {r.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-ghost">{r.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA de cierre ──────────────────────────────────── */}
        <section>
          <div className={`${SHELL} py-20 md:py-28`}>
            <div className="relative overflow-hidden rounded-[32px] border border-cipher/20 bg-gradient-to-br from-surface to-lift px-6 py-16 text-center sm:px-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 80% at 50% 0%, rgba(34,211,238,.12) 0%, transparent 70%)',
                }}
              />
              <h2 className="relative font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">
                Quedate con cada peso.
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-base text-ghost">
                Creá tu cuenta hoy y empezá a cobrar con QR sin comisiones.
              </p>
              <div className="relative mt-8 flex justify-center">
                <Link
                  href="/registro"
                  className="flex items-center gap-2 rounded-[14px] bg-cipher px-7 py-3.5 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90"
                >
                  Crear mi cuenta gratis
                  <Icon name="chevron-right" className="h-[18px] w-[18px]" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer (divisor de borde a borde) ──────────────── */}
        <footer className="border-t border-wire">
          <div
            className={`${SHELL} flex flex-col items-center justify-between gap-3 py-8 text-[11px] text-fog sm:flex-row`}
          >
            <span>© 2026 PagoFirme · Bolivia</span>
            <span className="flex items-center gap-1.5 text-center">
              <span className="h-1 w-1 rounded-full bg-cipher/50" />
              Cero comisiones · Multi-riel
              <span className="h-1 w-1 rounded-full bg-cipher/50" />
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
