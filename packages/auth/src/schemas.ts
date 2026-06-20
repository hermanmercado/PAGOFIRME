import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128)
  .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
  .regex(/[a-z]/, 'Debe incluir al menos una minúscula')
  .regex(/[0-9]/, 'Debe incluir al menos un número');

export const registerSchema = z.object({
  email: z.string().email('Correo inválido'),
  phone: z
    .string()
    .regex(/^[67]\d{7}$/, 'Número de celular boliviano inválido (8 dígitos, inicia en 6 o 7)')
    .optional(),
  password: passwordSchema,
  fullName: z.string().min(2, 'Nombre demasiado corto').max(120),
  // Auto-registro = alta de un dueño con su negocio. La unidad se crea junto al usuario.
  businessName: z.string().min(2, 'Nombre del negocio demasiado corto').max(120),
});

export const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
  totp: z.string().length(6, 'El código 2FA debe tener 6 dígitos').optional(),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

export const enable2faSchema = z.object({
  totp: z.string().length(6, 'El código 2FA debe tener 6 dígitos'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type Enable2faInput = z.infer<typeof enable2faSchema>;
