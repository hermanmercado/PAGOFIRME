import type { Route } from 'next';
import type { IconName } from '@/components/icons';

/** Rol de demostración mostrado como tarjeta en la pantalla de login. */
export interface DemoRole {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  /** Clase Tailwind para el color del icono. */
  iconColor: string;
  /** Color de fondo del recuadro del icono (valor literal). */
  iconBg: string;
  /** Ruta del dashboard al que navega la tarjeta. */
  dashboard: Route;
}

const VENDEDOR: DemoRole = {
  id: 'vend',
  title: 'Vendedor',
  subtitle: 'Carlos Arias · Tienda Centro',
  icon: 'store',
  iconColor: 'text-ghost',
  iconBg: '#1D2138',
  dashboard: '/vendedor' as Route,
};

const SUP_CENTRO: DemoRole = {
  id: 'sup1',
  title: 'Supervisor · Tienda Centro',
  subtitle: 'Marco Gutiérrez · La Paz',
  icon: 'star',
  iconColor: 'text-cipher',
  iconBg: '#0a1a2e',
  dashboard: '/supervisor-centro' as Route,
};

const SUP_SUR: DemoRole = {
  id: 'sup2',
  title: 'Supervisora · Tienda Sur',
  subtitle: 'Rosa Mamani · El Alto',
  icon: 'star',
  iconColor: 'text-cipher',
  iconBg: '#0a1a2e',
  dashboard: '/supervisor-sur' as Route,
};

const DUENO: DemoRole = {
  id: 'owner',
  title: 'Dueño del negocio',
  subtitle: 'Juan Pérez · Cursos Digitales Bolivia',
  icon: 'dashboard',
  iconColor: 'text-ghost',
  iconBg: '#1a1a2e',
  dashboard: '/dueno' as Route,
};

const ADMIN: DemoRole = {
  id: 'admin',
  title: 'Superadmin PagoFirme',
  subtitle: 'Panel interno · verificación',
  icon: 'shield',
  iconColor: 'text-risk',
  iconBg: '#2e2400',
  dashboard: '/admin' as Route,
};

const DEV: DemoRole = {
  id: 'dev',
  title: 'Portal Desarrolladores',
  subtitle: 'API pública · Sandbox · Docs',
  icon: 'code',
  iconColor: 'text-[#a78bfa]',
  iconBg: '#1a0a2e',
  dashboard: '/desarrolladores' as Route,
};

export const DEMO_ROLES: DemoRole[] = [VENDEDOR, SUP_CENTRO, SUP_SUR, DUENO, ADMIN, DEV];

/**
 * Mapea el rol real devuelto por la API al dashboard correspondiente. Para los
 * supervisores, que en la demo tienen dos paneles (Centro/Sur), desambiguamos
 * por el correo; el resto se resuelve directo por rol.
 */
export function dashboardForRole(role: string, email: string): Route {
  switch (role) {
    case 'ADMIN':
      return '/admin' as Route;
    case 'DUENO':
      return '/dueno' as Route;
    case 'SUPERVISOR': {
      const e = email.toLowerCase();
      return (e.includes('rosa') || e.includes('sur')
        ? '/supervisor-sur'
        : '/supervisor-centro') as Route;
    }
    default:
      return '/vendedor' as Route;
  }
}

/**
 * Resuelve el rol a partir del email del formulario manual, replicando la
 * heurística del prototipo (admin / dueño / supervisores → rol; resto → vendedor).
 */
export function resolveRoleFromEmail(email: string): DemoRole {
  const e = email.toLowerCase();
  if (e.includes('admin')) return ADMIN;
  if (e.includes('juan') || e.includes('dueno') || e.includes('dueño')) return DUENO;
  if (e.includes('marco') || e.includes('centro')) return SUP_CENTRO;
  if (e.includes('rosa') || e.includes('sur')) return SUP_SUR;
  return VENDEDOR;
}
