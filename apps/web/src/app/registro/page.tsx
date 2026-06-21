'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import { dashboardForRole } from '@/lib/roles';
import { Icon } from '@/components/icons';
import { PasswordInput } from '@/components/PasswordInput';

const inputClass =
  'mb-1 w-full rounded-[10px] border border-wire bg-surface px-3.5 py-2.5 text-sm text-clean outline-none transition-colors placeholder:text-fog focus:border-cipher';

const maskStyle = {
  WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black 0%, transparent 100%)',
} as const;

// Mismas reglas que el registerSchema de Zod del backend (@pagofirme/auth).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[67]\d{7}$/;

interface PwChecks {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
}

function checkPassword(pw: string): PwChecks {
  return {
    length: pw.length >= 8 && pw.length <= 128,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
  };
}

const PW_LABELS: Array<{ key: keyof PwChecks; label: string }> = [
  { key: 'length', label: '8+ caracteres' },
  { key: 'upper', label: 'Una mayúscula' },
  { key: 'lower', label: 'Una minúscula' },
  { key: 'number', label: 'Un número' },
];

export default function RegistroPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pw = checkPassword(password);
  const pwValid = pw.length && pw.upper && pw.lower && pw.number;

  const errors = {
    fullName: fullName.trim().length < 2 ? 'Ingresá tu nombre (2+ caracteres)' : null,
    businessName:
      businessName.trim().length < 2 ? 'Ingresá el nombre del negocio (2+ caracteres)' : null,
    email: !EMAIL_RE.test(email.trim()) ? 'Correo inválido' : null,
    phone:
      phone.trim() && !PHONE_RE.test(phone.trim())
        ? 'Celular boliviano inválido (8 dígitos, inicia en 6 o 7)'
        : null,
    password: !pwValid ? 'La contraseña no cumple los requisitos' : null,
  };
  const isValid = !Object.values(errors).some(Boolean);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setShowErrors(true);
    setError(null);
    if (!isValid) return;

    setSubmitting(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      router.push(dashboardForRole(res.user.role, res.user.email));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la cuenta');
      setSubmitting(false);
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
          backgroundImage: 'radial-gradient(circle, rgba(34,211,238,.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          ...maskStyle,
        }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            aria-label="Ir al inicio"
            className="qr-glow-pulse relative mx-auto mb-3.5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-cipher/25 bg-gradient-to-br from-surface to-lift"
          >
            <Icon name="qrcode" className="h-7 w-7 text-cipher" />
            <span className="qr-scan-line" aria-hidden="true" />
          </Link>
          <div className="font-heading text-2xl font-bold text-clean">
            pago<span className="text-cipher">firme</span>
          </div>
          <div className="mt-1.5 text-[11px] text-fog">Creá tu negocio en minutos · sin comisiones</div>
        </div>

        <h1 className="mb-0.5 font-heading text-[17px] font-semibold tracking-tight text-clean">
          Creá tu cuenta
        </h1>
        <p className="mb-4 text-xs text-fog">Sos el dueño: registramos vos y tu negocio</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nombre completo */}
          <label className="mb-1 block text-[11px] text-ghost" htmlFor="fullName">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan Pérez"
            className={inputClass}
          />
          {showErrors && errors.fullName && (
            <p className="mb-1.5 text-[10px] text-loss">{errors.fullName}</p>
          )}

          {/* Nombre del negocio */}
          <label className="mb-1 mt-1.5 block text-[11px] text-ghost" htmlFor="businessName">
            Nombre del negocio
          </label>
          <input
            id="businessName"
            type="text"
            autoComplete="organization"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="CobanaAcademy"
            className={inputClass}
          />
          {showErrors && errors.businessName && (
            <p className="mb-1.5 text-[10px] text-loss">{errors.businessName}</p>
          )}

          {/* Email */}
          <label className="mb-1 mt-1.5 block text-[11px] text-ghost" htmlFor="email">
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
          {showErrors && errors.email && (
            <p className="mb-1.5 text-[10px] text-loss">{errors.email}</p>
          )}

          {/* Celular (opcional) */}
          <label className="mb-1 mt-1.5 block text-[11px] text-ghost" htmlFor="phone">
            Celular <span className="text-fog">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={8}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="71234567"
            className={inputClass}
          />
          {showErrors && errors.phone && (
            <p className="mb-1.5 text-[10px] text-loss">{errors.phone}</p>
          )}

          {/* Contraseña */}
          <label className="mb-1 mt-1.5 block text-[11px] text-ghost" htmlFor="password">
            Contraseña
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            wrapperClassName="relative mb-2"
          />

          {/* Checklist de requisitos en vivo */}
          <ul className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1">
            {PW_LABELS.map(({ key, label }) => {
              const ok = pw[key];
              return (
                <li
                  key={key}
                  className={`flex items-center gap-1.5 text-[10px] ${ok ? 'text-pay' : 'text-fog'}`}
                >
                  <Icon
                    name={ok ? 'circle-check' : 'x'}
                    className={`h-3.5 w-3.5 shrink-0 ${ok ? 'text-pay' : 'text-fog'}`}
                  />
                  {label}
                </li>
              );
            })}
          </ul>

          {error && (
            <div className="mb-2.5 flex items-center gap-2 rounded-[10px] border border-risk/30 bg-risk/[0.06] px-3 py-2">
              <Icon name="alert-triangle" className="h-4 w-4 shrink-0 text-risk" />
              <span className="text-[11px] text-risk">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-cipher px-4 py-3 text-sm font-semibold text-[#0A0C15] transition active:scale-[.99] active:opacity-90 disabled:bg-lift disabled:text-fog"
          >
            <Icon name="store" className="h-[18px] w-[18px]" />
            {submitting ? 'Creando tu cuenta…' : 'Crear cuenta →'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-fog">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-medium text-cipher hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
