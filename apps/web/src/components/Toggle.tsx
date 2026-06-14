'use client';

import { useState } from 'react';

export interface ToggleProps {
  /** Estado inicial en modo no controlado. */
  defaultOn?: boolean;
  /** Estado en modo controlado (tiene prioridad sobre defaultOn). */
  checked?: boolean;
  onChange?: (on: boolean) => void;
  disabled?: boolean;
}

/** Interruptor de configuración (estilo del prototipo). Soporta modo controlado. */
export function Toggle({ defaultOn = true, checked, onChange, disabled = false }: ToggleProps) {
  const [internal, setInternal] = useState(defaultOn);
  const on = checked ?? internal;

  function toggle() {
    if (disabled) return;
    const next = !on;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      disabled={disabled}
      className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
        on ? 'bg-cipher' : 'bg-lift'
      } ${disabled ? 'opacity-40' : ''}`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-[#0A0C15] transition-transform ${
          on ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
