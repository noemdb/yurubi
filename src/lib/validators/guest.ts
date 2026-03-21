// src/lib/validators/guest.ts
import { z } from "zod";

export const guestSchema = z.object({
  fullName: z.string().min(2, "Nombre requerido").max(150),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Teléfono inválido (ej: +582541234567)"),
  idDocument: z.string().min(4, "Documento requerido").max(20),
  address: z.string().min(5, "Dirección requerida").max(200),
  origin: z.string().min(2, "Procedencia requerida").max(100),
});

export type GuestInput = z.infer<typeof guestSchema>;
