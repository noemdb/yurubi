// src/lib/actions/reservations.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sendReservationStatusEmail } from "./email";

export async function confirmReservation(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.reservation.update({
    where: { id },
    data: { 
      status: "CONFIRMED",
      confirmedById: session.user?.id
    }
  });

  await sendReservationStatusEmail(id);

  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/calendario");
  revalidatePath("/dashboard/recepcionista");
  return { success: true };
}

export async function rejectReservation(id: string, reason?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.reservation.update({
    where: { id },
    data: { 
      status: "REJECTED",
      rejectionReason: reason
    }
  });

  await sendReservationStatusEmail(id);

  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/recepcionista");
  return { success: true };
}

export async function cancelReservation(id: string, reason?: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.reservation.update({
    where: { id },
    data: { 
      status: "CANCELLED",
      cancellationReason: reason
    }
  });

  // No enviamos email de "cancelación" necesariamente según spec rápido, 
  // pero podríamos si se requiere.
  
  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/calendario");
  return { success: true };
}

export async function assignRoom(reservationId: string, roomId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { roomId }
  });

  revalidatePath(`/dashboard/reservas/${reservationId}`);
  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/calendario");
  return { success: true };
}

export async function updatePaymentStatus(id: string, paid: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.reservation.update({
    where: { id },
    data: { advancePaymentPaid: paid }
  });

  revalidatePath(`/dashboard/reservas/${id}`);
  revalidatePath("/dashboard/reservas");
  return { success: true };
}

export async function createManualReservation(data: {
  fullName: string,
  email: string,
  phone: string,
  idDocument: string,
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
  totalPrice: number,
  numberOfGuests: number
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const checkIn = new Date(data.checkIn);
  const checkOut = new Date(data.checkOut);
  const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Create or find guest
  const guest = await prisma.guest.upsert({
    where: { idDocument: data.idDocument },
    update: { 
      fullName: data.fullName, 
      email: data.email, 
      phone: data.phone 
    },
    create: { 
      fullName: data.fullName, 
      email: data.email, 
      phone: data.phone,
      idDocument: data.idDocument
    }
  });

  // Create reservation
  const reservation = await prisma.reservation.create({
    data: {
      guestId: guest.id,
      roomTypeId: data.roomTypeId,
      checkIn: checkIn,
      checkOut: checkOut,
      numberOfNights: numberOfNights,
      numberOfGuests: data.numberOfGuests,
      totalPrice: data.totalPrice,
      status: "CONFIRMED",
      advancePaymentPaid: true,
      createdById: session.user?.id
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reservas");
  revalidatePath("/dashboard/calendario");
  return { success: true, id: reservation.id };
}
