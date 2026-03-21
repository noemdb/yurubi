// src/lib/validators/booking.ts
import { z } from "zod";

export const meetingRoomBookingSchema = z.object({
  contactName: z.string().min(2).max(150),
  company: z.string().max(150).optional(),
  rif: z.string().max(20).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
  email: z.string().email().optional(),
  eventDetails: z.string().min(10, "Describe el evento").max(1000),
  eventDate: z.coerce
    .date()
    .refine((d) => d >= new Date(), "Fecha futura requerida"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).default("06:00"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).default("12:00"),
  numberOfGuests: z.number().int().min(1).max(30),
});

export const restaurantBookingSchema = z.object({
  contactName: z.string().min(2).max(150),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
  idDocument: z.string().max(20).optional(),
  email: z.string().email().optional(),
  eventDate: z.coerce
    .date()
    .refine((d) => d >= new Date(), "Fecha futura requerida"),
  timeSlot: z.enum(["SLOT_12_14", "SLOT_14_16"]),
  numberOfGuests: z.number().int().min(1).max(80),
});

export const reviewSchema = z.object({
  guestName: z.string().min(2).max(100),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .min(10, "Escribe al menos 10 caracteres")
    .max(1000),
  language: z.enum(["es", "en"]).default("es"),
});

export type MeetingRoomBookingInput = z.infer<typeof meetingRoomBookingSchema>;
export type RestaurantBookingInput = z.infer<typeof restaurantBookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
