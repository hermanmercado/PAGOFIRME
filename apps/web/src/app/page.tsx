'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_ROLES, resolveRoleFromEmail, type DemoRole } from '@/lib/roles';
import { Icon } from '@/components/icons';
import { clearLogin, getLockRemaining, LOCK_MS, recordFailedLogin } from '@/lib/security';

/** Contraseña del login manual en la demo. */
const DEMO_PASSWORD = 'pagofirme';

/** Versión de la app + commit del build (inyectado por Railway; 'dev' en local). */
const APP_VERSION = '2.1.0';
const BUILD_COMMIT = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'dev';

const mmss = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const inputClass =
  'mb-2.5 w-full rounded-[10px] border border-wire bg-surface px-3.5 py-2.5 text-sm text-clean outline-none transition-colors placeholder:text-fog focus:border-cipher';

const maskStyle = {
  WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%)',
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lockUntil, setLockUntil] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);

  // Cuenta regresiva en vivo mientras la cuenta está bloqueada.
  useEffect(() => {
    if (!lockUntil) return;
    const tick = () => {
      const left = lockUntil - Date.now();
      if (left <= 0) {
        setLockUntil(0);
        setLockLeft(0);
      } else {
        setLockLeft(left);
      }
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [lockUntil]);

  const locked = lockLeft > 0;

  function goTo(role: DemoRole) {
    router.push(role.dashboard);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = (email.trim() || 'cuenta').toLowerCase();

    const rem = getLockRemaining(key);
    if (rem > 0) {
      setLockUntil(Date.now() + rem);
      return;
    }

    if (password === DEMO_PASSWORD) {
      clearLogin(key);
      setError(null);
      goTo(resolveRoleFromEmail(email));
      return;
    }

    const { remaining, locked: nowLocked } = recordFailedLogin(key);
    if (nowLocked) {
      setError(null);
      setLockUntil(Date.now() + LOCK_MS);
    } else {
      setError(
        `Contraseña incorrecta · te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} intento${
          remaining === 1 ? '' : 's'
        }`,
      );
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-void px-4 py-10">
      {/* Atmósfera: gradientes radiales cian sobre el fondo oscuro. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(34,211,238,.04) 0%, transparent 60%)',
        }}
      />
      {/* Retícula de puntos tipo QR, difuminada hacia abajo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(34,211,238,.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          ...maskStyle,
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cipher/25 bg-gradient-to-br from-surface to-lift"
            style={{ boxShadow: '0 0 20px rgba(34,211,238,.15)' }}
          >
            <Icon name="qrcode" className="h-7 w-7 text-cipher" />
          </div>
          <div className="font-heading text-2xl font-bold text-clean">
            pago<span className="text-cipher">firme</span>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-fog">
            <span className="h-1 w-1 rounded-full bg-cipher/50" />
            Cero comisiones · Bolivia · Open BCB
            <span className="h-1 w-1 rounded-full bg-cipher/50" />
          </div>
        </div>

        {/* Bienvenida */}
        <h1 className="mb-0.5 font-heading text-[17px] font-semibold tracking-tight text-clean">
          Bienvenido
        </h1>
        <p className="mb-4 text-xs text-fog">Inicia sesión con tu cuenta</p>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <label className="mb-1 block text-[11px] text-ghost" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@negocio.bo"
            className={inputClass}
          />

          <label className="mb-1 block text-[11px] text-ghost" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
          <p className="-mt-1 mb-2.5 text-[10px] text-fog">
            Demo: contraseña <span className="text-cipher">pagofirme</span>
          </p>

          {locked ? (
            <div className="mb-2.5 flex items-center gap-2 rounded-[10px] border border-loss/30 bg-loss/[0.08] px-3 py-2">
              <Icon name="lock" className="h-4 w-4 shrink-0 text-loss" />
              <span className="text-[11px] text-loss">
                Cuenta bloqueada por seguridad · reintentá en {mmss(lockLeft)}
              </span>
            </div>
          ) : (
            error && (
              <div className="mb-2.5 flex items-center gap-2 rounded-[10px] border border-risk/30 bg-risk/[0.06] px-3 py-2">
                <Icon name="alert-triangle" className="h-4 w-4 shrink-0 text-risk" />
                <span className="text-[11px] text-risk">{error}</span>
              </div>
            )
          )}

          <button
            type="submit"
            disabled={locked}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-cipher px-4 py-3 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90 disabled:bg-lift disabled:text-fog"
          >
            <Icon name="login" className="h-[18px] w-[18px]" />
            {locked ? `Bloqueado · ${mmss(lockLeft)}` : 'Iniciar sesión'}
          </button>
        </form>

        <p className="my-4 text-center text-xs text-fog">
          ¿Olvidaste tu contraseña? <span className="text-cipher">Recuperar</span>
        </p>

        {/* Separador */}
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="h-px flex-1 bg-wire" />
          <span className="text-[11px] text-fog">o entra como demo</span>
          <div className="h-px flex-1 bg-wire" />
        </div>

        {/* Tarjetas de rol — navegan directo al dashboard correspondiente. */}
        <div className="flex flex-col gap-1.5">
          {DEMO_ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => goTo(role)}
              className="group flex items-center gap-2.5 rounded-[10px] border border-wire bg-surface px-3.5 py-2.5 text-left transition-colors hover:border-cipher hover:bg-lift"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: role.iconBg }}
              >
                <Icon name={role.icon} className={`h-4 w-4 ${role.iconColor}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-clean">{role.title}</span>
                <span className="mt-0.5 block text-[10px] text-fog">{role.subtitle}</span>
              </span>
              <Icon
                name="chevron-right"
                className="ml-auto h-4 w-4 shrink-0 text-fog transition-colors group-hover:text-cipher"
              />
            </button>
          ))}
        </div>

        <p className="mt-5 text-center text-[10px] text-fog">
          PagoFirme v{APP_VERSION} · build {BUILD_COMMIT}
        </p>
      </div>
    </main>
  );
}
