'use client';

import { useEffect, useState } from 'react';

export type ToastKind = 'ok' | 'warn';
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
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function show(msg: string, kind: ToastKind = 'ok') {
    setToast((prev) => ({ msg, kind, seq: (prev?.seq ?? 0) + 1 }));
  }

  return { toast, show };
}

export function Toaster({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;
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
