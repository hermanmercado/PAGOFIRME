'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/icons';

/** Inactividad total antes de cerrar sesión (5 min) y antelación del aviso (60 s). */
const IDLE_MS = 5 * 60 * 1000;
const WARN_MS = 60 * 1000;

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

/**
 * Cierre de sesión automático por inactividad (seguridad nivel bancario).
 * Muestra un aviso con cuenta regresiva 60 s antes del cierre. Cualquier
 * actividad reinicia el contador, salvo mientras el aviso está visible: ahí se
 * exige confirmación explícita ("Seguir conectado").
 */
export function SessionTimeout() {
  const router = useRouter();
  const [warning, setWarning] = useState(false);
  const [remaining, setRemaining] = useState(WARN_MS / 1000);
  const lastActivity = useRef(0);
  const warningRef = useRef(false);

  const keepAlive = useCallback(() => {
    lastActivity.current = Date.now();
    warningRef.current = false;
    setWarning(false);
  }, []);

  const logout = useCallback(() => {
    warningRef.current = false;
    router.push('/');
  }, [router]);

  useEffect(() => {
    lastActivity.current = Date.now();

    // La actividad sólo reinicia el contador si el aviso no está visible.
    const onActivity = () => {
      if (!warningRef.current) lastActivity.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const tick = setInterval(() => {
      const idle = Date.now() - lastActivity.current;
      if (idle >= IDLE_MS) {
        logout();
        return;
      }
      if (idle >= IDLE_MS - WARN_MS) {
        if (!warningRef.current) {
          warningRef.current = true;
          setWarning(true);
        }
        setRemaining(Math.max(0, Math.ceil((IDLE_MS - idle) / 1000)));
      }
    }, 1000);

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      clearInterval(tick);
    };
  }, [logout]);

  if (!warning) return null;

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      className="absolute inset-0 z-[70] flex items-center justify-center bg-[rgba(10,12,21,0.9)] px-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-[320px] rounded-[18px] border border-risk/30 bg-surface p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-risk/[0.1] text-risk">
          <Icon name="clock" className="h-6 w-6" />
        </div>
        <div className="font-heading text-base font-bold text-clean">Tu sesión está por expirar</div>
        <p className="mt-1 text-[11px] leading-relaxed text-ghost">
          Por tu seguridad, cerraremos la sesión por inactividad en
        </p>
        <div className="my-2 font-heading text-[40px] font-extrabold leading-none tracking-tight text-risk">
          {remaining}
          <span className="ml-1 text-base font-medium text-fog">s</span>
        </div>
        <button
          type="button"
          onClick={keepAlive}
          className="mb-2 w-full rounded-[12px] bg-cipher py-3 text-[13px] font-semibold text-[#0A0C15] transition active:opacity-90"
        >
          Seguir conectado
        </button>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-[12px] border border-wire py-2.5 text-[12px] text-ghost transition-colors active:border-loss active:text-loss"
        >
          Cerrar sesión ahora
        </button>
      </div>
    </div>
  );
}
