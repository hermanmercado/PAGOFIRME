/**
 * Design tokens de PagoFirme.
 * Plataforma-agnósticos: se consumen tanto en web (Tailwind) como en mobile (NativeWind).
 */
export const colors = {
  brand: {
    50: '#e6fbf3',
    100: '#c2f4e0',
    200: '#8fe8c6',
    300: '#54d7a8',
    400: '#22c08a',
    500: '#06a574', // color principal
    600: '#04855e',
    700: '#06694b',
    800: '#08533d',
    900: '#084433',
  },
  ink: {
    DEFAULT: '#0c1b16',
    muted: '#5b6b64',
  },
  danger: '#e5484d',
  warning: '#f5a524',
  success: '#06a574',
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

export const fonts = {
  sans: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
} as const;

export const tokens = { colors, radii, fonts } as const;
export type Tokens = typeof tokens;
