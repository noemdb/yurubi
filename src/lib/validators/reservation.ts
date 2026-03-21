// src/lib/validators/reservation.ts
import { z } from "zod";
import { guestSchema } from "./guest";

const baseStep1Schema = z.object({
  roomTypeId: z.string().cuid("Selecciona un tipo de habitación"),
  checkIn: z.coerce
    .date()
    .refine((d) => d >= new Date(), "La fecha de entrada debe ser futura"),
  checkOut: z.coerce.date(),
  numberOfGuests: z.number().int().min(1, "Mínimo 1 huésped").max(6),
});

// Paso 1: Selección de fechas y tipo
export const reservationStep1Schema = baseStep1Schema
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out debe ser después del check-in",
    path: ["checkOut"],
  })
  .refine(
    (data) => {
      const nights = Math.ceil(
        (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      return nights >= 1;
    },
    { message: "Mínimo 1 noche", path: ["checkOut"] }
  );

// Paso 2: Datos del huésped
export const reservationStep2Schema = guestSchema;

// Paso 3: Método de pago
export const reservationStep3Schema = z.object({
  paymentMethod: z.enum(["TRANSFERENCIA", "ZELLE", "EFECTIVO"]),
  notes: z.string().max(500).optional(),
  language: z.enum(["es", "en"]).default("es"),
});

// Schema completo (server-side)
export const createReservationSchema = baseStep1Schema
  .merge(z.object({ guest: reservationStep2Schema }))
  .merge(reservationStep3Schema)
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out debe ser después del check-in",
    path: ["checkOut"],
  })
  .refine(
    (data) => {
      const nights = Math.ceil(
        (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );
      return nights >= 1;
    },
    { message: "Mínimo 1 noche", path: ["checkOut"] }
  );

export type ReservationStep1Input = z.infer<typeof reservationStep1Schema>;
export type ReservationStep2Input = z.infer<typeof reservationStep2Schema>;
export type ReservationStep3Input = z.infer<typeof reservationStep3Schema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
