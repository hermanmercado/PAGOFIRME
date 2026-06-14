# PagoFirme

> Pasarela de pagos QR interoperable para Bolivia — **cero comisiones** y arquitectura **multi-riel**.

Monorepo gestionado con [Turborepo](https://turbo.build) + npm workspaces.

## 🧱 Estructura

```
pagofirme/
├── apps/
│   ├── web/      → Next.js 15 + TypeScript + Tailwind CSS
│   ├── mobile/   → Expo 52 + React Native + NativeWind
│   └── api/      → Hono + Node.js + TypeScript
├── packages/
│   ├── db/       → PostgreSQL + Prisma 7 (cliente + esquema + seed)
│   ├── auth/     → JWT + Refresh Tokens (rotación) + 2FA (TOTP) + Zod
│   └── ui/       → Componentes React + design tokens compartidos
├── package.json  → workspaces + scripts globales
└── turbo.json    → pipeline de tareas
```

## 🛠️ Stack

| Capa        | Tecnología                                    |
| ----------- | --------------------------------------------- |
| Web         | Next.js 15, React 19, Tailwind CSS            |
| Mobile      | Expo 52, React Native 0.76, NativeWind        |
| Backend     | Hono, Node.js, TypeScript                     |
| Base datos  | PostgreSQL, Prisma 7                           |
| Auth        | JWT, Refresh Tokens, 2FA (TOTP), bcrypt       |
| Validación  | Zod                                           |
| Deploy      | Railway                                        |

## 🚀 Puesta en marcha

Requiere **Node.js >= 20** y una base de datos PostgreSQL.

```bash
# 1. Instalar dependencias (el cliente de Prisma se genera solo vía postinstall)
npm install

# 2. Configurar variables de entorno
cp .env.example .env   # editar con tus credenciales

# 3. Aplicar el esquema a la base de datos y sembrar datos iniciales
npm run db:push        # o db:migrate para migraciones versionadas
npm run db:seed --workspace=@pagofirme/db

# 4. Levantar todo en desarrollo
npm run dev
```

| App    | URL local              |
| ------ | ---------------------- |
| Web    | http://localhost:3000  |
| API    | http://localhost:3001  |
| Mobile | Expo Dev Tools         |

## 📜 Scripts globales

| Comando              | Descripción                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Levanta todas las apps en desarrollo     |
| `npm run build`      | Compila todo el monorepo                 |
| `npm run lint`       | Linter en todos los paquetes             |
| `npm run typecheck`  | Chequeo de tipos                         |
| `npm run format`     | Formatea con Prettier                    |
| `npm run db:studio`  | Abre Prisma Studio                       |

## 🔐 Arquitectura multi-riel

PagoFirme enruta cada cobro al mejor *riel* de pago disponible:

- **BANK_QR** — QR interoperable bancario (ASFI / BCB)
- **WALLET** — billeteras móviles (ej. Tigo Money)
- **INTERNAL** — transferencias internas PagoFirme

Los montos se almacenan en centavos (`BigInt`) y cada transacción genera
asientos de doble partida en el libro mayor (`LedgerEntry`).

## 🧩 Notas técnicas (decisiones del monorepo)

- **Paquetes internos como código fuente.** `db`, `auth` y `ui` se consumen como
  TypeScript directo (sin emitir `dist`): Next los transpila vía
  `transpilePackages`, Metro vía `watchFolders`, y la API se ejecuta con `tsx`
  (en dev y en producción). Sus scripts `build`/`typecheck` solo validan tipos.
- **Prisma 7.** La URL de conexión vive en `packages/db/prisma.config.ts` (ya no
  en el `schema.prisma`) y el cliente usa el **driver adapter** `@prisma/adapter-pg`.
  `@prisma/client` es CommonJS con exports dinámicos, por eso en `db/src/index.ts`
  se importa el default y se desestructura el constructor. Un hook `postinstall`
  regenera el cliente tras cada `npm install`.
- **Doble versión de React.** Expo 52 requiere React 18.3.1 y Next 15 usa React 19,
  por lo que conviven en el monorepo. Para evitar que webpack cargue **dos
  instancias** de React 19 (ej. `styled-jsx` de Next tomando la 18.3.1 de Expo →
  `useContext` null en el prerender), React 19 se **hoistea a la raíz como única
  instancia**: se declara `react`/`react-dom` en el `package.json` raíz, con lo que
  `web`, `ui` y `styled-jsx` resuelven la misma copia, y la 18.3.1 de Expo queda
  anidada en `apps/mobile` (donde Metro la resuelve). `react-native-reanimated`
  sigue fijado a la versión de Expo 52, y `apps/web` declara explícitamente las
  dependencias anidadas de Next que npm omite (`@next/env`, `@swc/helpers`,
  `styled-jsx`), alineadas a la versión exacta de `next`.
- **Resolución `.js`→`.ts` en web.** Los paquetes internos se consumen como código
  fuente con imports de extensión explícita (`./cn.js`). `tsc` los resuelve con
  `moduleResolution: "Bundler"`, pero el resolver de webpack no sustituye la
  extensión por defecto, así que `apps/web/next.config.ts` añade un
  `resolve.extensionAlias`.
