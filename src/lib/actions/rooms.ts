// src/lib/actions/rooms.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function toggleRoomStatus(id: string, isAvailable: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.room.update({
    where: { id },
    data: { isAvailable: !isAvailable }
  });

  revalidatePath("/dashboard/habitaciones");
  revalidatePath("/dashboard/calendario");
  return { success: true };
}

export async function updateRoomTypePrice(id: string, basePrice: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.roomType.update({
    where: { id },
    data: { basePrice }
  });

  revalidatePath("/dashboard/habitaciones");
  revalidatePath("/habitaciones");
  return { success: true };
}
