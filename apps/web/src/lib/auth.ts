import { apiFetch } from './api';

/** Usuario autenticado tal como lo devuelve la API. */
export interface AuthUser {
  id: string;
  email: string;
  role: 'VENDEDOR' | 'SUPERVISOR' | 'DUENO' | 'ADMIN';
}

interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

/** Respuesta del login cuando la cuenta tiene 2FA activo y falta el código. */
interface Requires2faResponse {
  requires2fa: true;
}

type LoginResponse = SessionResponse | Requires2faResponse;

const ACCESS_KEY = 'pf:access-token';
const REFRESH_KEY = 'pf:refresh-token';
const USER_KEY = 'pf:user';

function persist(res: SessionResponse) {
  try {
    localStorage.setItem(ACCESS_KEY, res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  } catch {
    // localStorage no disponible (modo privado): la sesión vive sólo en memoria.
  }
}

/** Inicia sesión contra la API real. Persiste los tokens si tiene éxito. */
export async function login(
  email: string,
  password: string,
  totp?: string,
): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, ...(totp ? { totp } : {}) }),
  });
  if ('accessToken' in res) persist(res);
  return res;
}

/** Alta de un dueño + su negocio. Devuelve sesión iniciada. */
export async function register(input: {
  fullName: string;
  email: string;
  password: string;
  businessName: string;
  phone?: string;
}): Promise<SessionResponse> {
  const res = await apiFetch<SessionResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  persist(res);
  return res;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Cierra la sesión local y revoca el refresh token en el servidor (best-effort). */
export async function logout(): Promise<void> {
  let refreshToken: string | null = null;
  try {
    refreshToken = localStorage.getItem(REFRESH_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignorar
  }
  if (refreshToken) {
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {
      // El logout local ya ocurrió; si el servidor falla no bloqueamos al usuario.
    });
  }
}
