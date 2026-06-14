/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6fbf3',
          100: '#c2f4e0',
          200: '#8fe8c6',
          300: '#54d7a8',
          400: '#22c08a',
          500: '#06a574',
          600: '#04855e',
          700: '#06694b',
          800: '#08533d',
          900: '#084433',
        },
        ink: {
          DEFAULT: '#0c1b16',
          muted: '#5b6b64',
        },
      },
    },
  },
  plugins: [],
};
