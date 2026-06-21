import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';
import { QrMatrix } from '@/components/QrMatrix';

/**
 * Landing pública de PagoFirme. Server Component (sin hooks): tipográfico,
 * oscuro, con mucho aire, titulares en Syne (font-heading) y acento cian.
 * Reutiliza la marca: la matriz QR y la línea de escaneo `qr-scan-line`.
 */

const claims: Array<{ icon: IconName; label: string; detail: string }> = [
  { icon: 'coin', label: '0% comisiones', detail: 'Cobrás el 100%' },
  { icon: 'shield', label: 'Open BCB', detail: 'Multi-riel regulado' },
  { icon: 'circle-check', label: 'Confirmación al instante', detail: 'Sin esperas' },
];

const features: Array<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'qrcode',
    title: 'Cobrá con un QR',
    body: 'Generá un QR por negocio o por vendedor. Tu cliente escanea, paga y listo —sin terminal, sin hardware.',
  },
  {
    icon: 'cash',
    title: 'Cero comisiones',
    body: 'No te quedamos con un centavo de cada venta. Lo que cobrás es lo que recibís, directo a tu cuenta.',
  },
  {
    icon: 'chart-bar',
    title: 'Equipo y control',
    body: 'Sucursales, supervisores y vendedores con límites por cobro y métricas en tiempo real. Todo desde un panel.',
  },
];

const steps: Array<{ title: string; body: string }> = [
  { title: 'Creá tu cuenta', body: 'Registrás vos y tu negocio en menos de un minuto.' },
  { title: 'Generá tu QR', body: 'Uno por tienda o uno por vendedor, como prefieras.' },
  { title: 'Cobrá y confirmá', body: 'El pago se confirma al instante. Cero comisiones, siempre.' },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-void text-clean">
      {/* Atmósfera: gradientes radiales cian sobre el fondo oscuro. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,.10) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 85% 110%, rgba(34,211,238,.05) 0%, transparent 60%)',
        }}
      />
      {/* Retícula de puntos tipo QR. */}
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

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="flex items-center justify-between py-6">
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
        <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cipher/25 bg-cipher/[0.06] px-3 py-1 text-[11px] font-medium text-cipher">
              <span className="h-1.5 w-1.5 rounded-full bg-cipher" />
              Pagos QR para Bolivia
            </span>
            <h1 className="mt-5 break-words font-heading text-[clamp(2rem,9vw,3rem)] font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Cobrá con un QR.
              <br />
              <span className="text-cipher">Cero comisiones.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ghost">
              La pasarela de pagos multi-riel que te deja quedarte con cada peso. Sin terminal, sin
              letra chica, confirmación al instante.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/registro"
                className="flex items-center gap-2 rounded-[14px] bg-cipher px-6 py-3 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90"
              >
                Crear cuenta
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
        </section>

        {/* ── Banda de claims ────────────────────────────────── */}
        <section className="grid gap-3 border-y border-wire py-6 sm:grid-cols-3">
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
        </section>

        {/* ── Features ───────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <h2 className="max-w-xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Todo lo que tu negocio necesita para cobrar.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-wire bg-surface/60 p-6 transition-colors hover:border-cipher/40"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cipher/20 bg-cipher/[0.06]">
                  <Icon name={f.icon} className="h-6 w-6 text-cipher" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-clean">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ghost">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3 pasos ────────────────────────────────────────── */}
        <section className="border-t border-wire py-20 md:py-28">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cipher">
            Cómo funciona
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Empezás a cobrar en 3 pasos.
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
        </section>

        {/* ── CTA de cierre ──────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="relative overflow-hidden rounded-[32px] border border-cipher/20 bg-gradient-to-br from-surface to-lift px-8 py-16 text-center">
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
                Crear mi cuenta
                <Icon name="chevron-right" className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-wire py-8 text-[11px] text-fog sm:flex-row">
          <span>© 2026 PagoFirme · Bolivia</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-cipher/50" />
            Cero comisiones · Open BCB
            <span className="h-1 w-1 rounded-full bg-cipher/50" />
          </span>
        </footer>
      </div>
    </main>
  );
}
