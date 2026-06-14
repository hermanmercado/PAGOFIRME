/** Variables tipadas que se inyectan en el contexto de Hono. */
export interface AppVariables {
  userId: string;
  userRole: string;
}

export type AppEnv = { Variables: AppVariables };
