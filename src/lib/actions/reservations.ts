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
