'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Icon } from '@/components/icons';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Clase del input (por defecto replica el estilo de los inputs del producto). */
  className?: string;
  /** Clase del contenedor relativo (incluye el margen inferior estándar). */
  wrapperClassName?: string;
}

const DEFAULT_INPUT_CLASS =
  'w-full rounded-[10px] border border-wire bg-surface py-2.5 pl-3.5 pr-11 text-sm text-clean outline-none transition-colors placeholder:text-fog focus:border-cipher';

/**
 * Input de contraseña reutilizable con botón de mostrar/ocultar.
 * El botón es `type="button"` (no envía el form), alterna el `type` del input
 * entre `password` y `text`, y expone `aria-label` dinámico + `aria-pressed`.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, wrapperClassName, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div className={wrapperClassName ?? 'relative mb-2.5'}>
        <input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={className ?? DEFAULT_INPUT_CLASS}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
          className="absolute right-0 top-0 flex h-full w-11 items-center justify-center rounded-r-[10px] text-fog outline-none transition-colors hover:text-cipher focus-visible:text-cipher"
        >
          <Icon name={visible ? 'eye-off' : 'eye'} className="h-[18px] w-[18px]" />
        </button>
      </div>
    );
  },
);
