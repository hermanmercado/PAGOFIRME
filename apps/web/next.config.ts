import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Transpila los paquetes internos del monorepo.
  transpilePackages: ['@pagofirme/ui'],
  typedRoutes: true,
  // Expone el commit del build (Railway inyecta RAILWAY_GIT_COMMIT_SHA) al bundle.
  // Se inlinea en build; en local queda 'dev'.
  env: {
    NEXT_PUBLIC_COMMIT_SHA: (process.env.RAILWAY_GIT_COMMIT_SHA ?? '').slice(0, 7) || 'dev',
  },
  // No cachear el HTML de las páginas: cada deploy se sirve fresco (evita HTML viejo
  // en caché de Railway/CDN/navegador). Se excluye /_next/ porque esos assets están
  // hasheados por contenido y deben seguir siendo cacheables.
  async headers() {
    return [
      {
        source: '/((?!_next/).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
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
