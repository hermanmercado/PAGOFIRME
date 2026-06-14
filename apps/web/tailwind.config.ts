import { colors } from '@pagofirme/ui/tokens';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        ink: colors.ink,
        danger: colors.danger,
        warning: colors.warning,
        success: colors.success,
        // Paleta oscura "v3" usada por el producto (login + dashboards).
        // Refleja las variables CSS del prototipo pagofirme_v3.
        void: '#0F1120',
        surface: '#161929',
        lift: '#1D2138',
        wire: '#252A48',
        ghost: '#8892B0',
        fog: '#3D4A6B',
        clean: '#E8F0FF',
        cipher: { DEFAULT: '#22D3EE', dark: '#0891B2' },
        pay: '#4ADE80',
        risk: '#F59E0B',
        loss: '#F43F5E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-syne)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
