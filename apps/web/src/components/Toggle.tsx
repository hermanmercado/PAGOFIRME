'use client';

import { useState } from 'react';

/** Interruptor de configuración (estilo del prototipo). */
export function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
        on ? 'bg-cipher' : 'bg-lift'
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-[#0A0C15] transition-transform ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
