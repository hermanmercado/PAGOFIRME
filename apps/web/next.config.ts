import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Transpila los paquetes internos del monorepo.
  transpilePackages: ['@pagofirme/ui'],
  typedRoutes: true,
  webpack: (config) => {
    // Los paquetes internos se consumen como código fuente TS y usan imports con
    // extensión explícita `.js` (estilo ESM). tsc los resuelve vía
    // moduleResolution "Bundler", pero el resolver de webpack no sustituye
    // `.js`→`.ts` por defecto; este alias se lo indica.
    //
    // Nota: NO hace falta aliasear `react`/`react-dom` a una copia concreta —
    // React 19 está hoisteado a la raíz del monorepo como única instancia
    // (la 18.3.1 de Expo queda anidada en apps/mobile), así que styled-jsx y
    // ui comparten el mismo React que la app.
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return config;
  },
};

export default nextConfig;
