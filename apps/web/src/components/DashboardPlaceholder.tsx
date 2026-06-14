import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons';

export interface DashboardPlaceholderProps {
  title: string;
  subtitle: string;
  icon?: IconName;
  /** Clase Tailwind para el color del icono. */
  accent?: string;
}

/**
 * Stub de dashboard por rol. La navegación desde el login ya funciona; cada
 * panel se construirá sobre este andamiaje.
 */
export function DashboardPlaceholder({
  title,
  subtitle,
  icon = 'dashboard',
  accent = 'text-cipher',
}: DashboardPlaceholderProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-wire bg-surface">
        <Icon name={icon} className={`h-8 w-8 ${accent}`} />
      </div>
      <h1 className="font-heading text-2xl font-bold text-clean">{title}</h1>
      <p className="max-w-sm text-sm text-ghost">{subtitle}</p>
      <span className="rounded-full border border-wire bg-surface px-3 py-1 text-xs text-fog">
        Dashboard en construcción
      </span>
      <Link href="/" className="mt-2 text-sm text-cipher hover:underline">
        ← Volver al inicio de sesión
      </Link>
    </main>
  );
}
