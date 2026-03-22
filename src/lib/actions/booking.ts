"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().min(1),
});

export async function checkAvailability(params: { checkIn: Date; checkOut: Date; guests: number }) {
  const parsed = searchSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid search parameters");
  }

  const { checkIn, checkOut, guests } = parsed.data;

  // Encontrar todos los tipos de habitación activos que soporten la ocupación
  const roomTypes = await prisma.roomType.findMany({
    where: {
      isActive: true,
      maxOccupancy: { gte: guests },
    },
    include: {
      _count: { select: { rooms: true } },
    },
  });

  // Para cada tipo, contar reservas activas solapadas y comparar con habitaciones físicas
  const availabilityRes = await Promise.all(
    roomTypes.map(async (rt) => {
      const totalRooms = rt._count.rooms;

      // Si no hay habitaciones físicas registradas, igual aparece disponible con cupo 1
      // (permite reservas por tipo aunque no se hayan cargado habitaciones individuales)
      if (totalRooms === 0) {
        return { ...rt, isAvailable: true, availableCount: 1 };
      }

      const overlappingReservations = await prisma.reservation.count({
        where: {
          roomTypeId: rt.id,
          status: { notIn: ["CANCELLED", "REJECTED"] },
          checkIn: { lt: checkOut },
          checkOut: { gt: checkIn },
        },
      });

      const isAvailable = overlappingReservations < totalRooms;

      return {
        ...rt,
        isAvailable,
        availableCount: Math.max(0, totalRooms - overlappingReservations),
      };
    })
  );

  return availabilityRes.filter((rt) => rt.isAvailable);
}

import { createReservationSchema, type CreateReservationInput } from "../validators/reservation";
import { sendReservationStatusEmail } from "./email";

export async function processReservation(input: CreateReservationInput) {
  const parsed = createReservationSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Datos de reserva inválidos");
  }
  
  const data = parsed.data;

  // 1. Re-verificar disponibilidad estrictamente en DB
  const availability = await checkAvailability({ 
    checkIn: data.checkIn, 
    checkOut: data.checkOut, 
    guests: data.numberOfGuests 
  });
  
  if (!availability.some((rt: any) => rt.id === data.roomTypeId)) {
    throw new Error("La habitación seleccionada ya no se encuentra disponible para estas fechas. Por favor, intenta de nuevo.");
  }

  const room = await prisma.roomType.findUnique({ where: { id: data.roomTypeId } });
  if (!room) throw new Error("Habitación no encontrada");

  // 2. Cálculo Server-Side del precio y noches
  const nights = Math.max(1, Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24)));
  const totalPrice = room.basePrice * nights;

  // 3. Transacción atómica de persistencia
  const reservation = await prisma.$transaction(async (tx: any) => {
    // Upsert guest basado en el ID Documento Único
    const guest = await tx.guest.upsert({
      where: { idDocument: data.guest.idDocument },
      update: data.guest,
      create: data.guest,
    });

    const res = await tx.reservation.create({
      data: {
        roomTypeId: data.roomTypeId,
        guestId: guest.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: data.numberOfGuests,
        numberOfNights: nights,
        totalPrice: totalPrice,
        status: "PENDING",
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        language: data.language,
      }
    });
    
    // Log de auditoría
    await tx.auditLog.create({
      data: {
        action: "CREATE",
        entity: "RESERVATION",
        entityId: res.id,
        changes: { source: "WIZARD", paymentMethod: data.paymentMethod },
      }
    });

    return res;
  });

  // 4. Enviar email de confirmación (non-blocking)
  sendReservationStatusEmail(reservation.id).catch(console.error);

  return { id: reservation.id };
}
