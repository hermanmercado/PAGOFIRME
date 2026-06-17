'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/icons';

export type ToastKind = 'ok' | 'warn' | 'celebrate';
export interface ToastState {
  msg: string;
  kind: ToastKind;
  /** Cambia en cada disparo para reiniciar el temporizador aunque el texto se repita. */
  seq: number;
}

/** Hook de toasts efímeros. `show` dispara un mensaje que se descarta solo. */
export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    // La celebración del cobro dura más para que el vendedor la disfrute.
    const ms = toast.kind === 'celebrate' ? 3500 : 2200;
    const t = setTimeout(() => setToast(null), ms);
    return () => clearTimeout(t);
  }, [toast]);

  function show(msg: string, kind: ToastKind = 'ok') {
    setToast((prev) => ({ msg, kind, seq: (prev?.seq ?? 0) + 1 }));
  }

  return { toast, show };
}

export function Toaster({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;

  // Celebración: tarjeta grande centrada con check verde y animación de entrada.
  // `pointer-events-none` para que el botón del modal siga tocable por debajo.
  if (toast.kind === 'celebrate') {
    return (
      <div className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center px-6">
        <div
          key={toast.seq}
          className="anim-celebrate flex flex-col items-center gap-3.5 rounded-[26px] border border-pay/40 bg-[#0c1f17] px-10 py-9 text-center shadow-[0_0_48px_rgba(74,222,128,0.32)]"
        >
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-pay/15 ring-2 ring-pay/40">
            <Icon name="circle-check" className="h-12 w-12 text-pay" />
          </div>
          <div className="font-heading text-xl font-bold leading-tight text-clean">
            {toast.msg}
          </div>
        </div>
      </div>
    );
  }

  // Toasts normales: pill discreto en la parte inferior (sobre el bottom nav).
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-20 z-[60] flex justify-center px-4">
      <div
        className={`rounded-full border px-4 py-2 text-xs font-medium shadow-lg ${
          toast.kind === 'ok'
            ? 'border-pay/30 bg-[#0c1f17] text-pay'
            : 'border-risk/30 bg-[#231a07] text-risk'
        }`}
      >
        {toast.msg}
      </div>
    </div>
  );
}
