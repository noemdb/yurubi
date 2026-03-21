// src/lib/validators/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto").max(100),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe tener mayúscula, minúscula y número"
    ),
  role: z.enum(["RECEPTIONIST", "OWNER", "ADMIN"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
