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

export async function createRoom(data: { roomNumber: string, floor: number, roomTypeId: string }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.room.create({
    data: {
      roomNumber: data.roomNumber,
      floor: data.floor,
      roomTypeId: data.roomTypeId,
      isAvailable: true
    }
  });

  revalidatePath("/dashboard/habitaciones");
  return { success: true };
}

export async function updateRoom(id: string, data: { roomNumber: string, floor: number, roomTypeId: string }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.room.update({
    where: { id },
    data: {
      roomNumber: data.roomNumber,
      floor: data.floor,
      roomTypeId: data.roomTypeId
    }
  });

  revalidatePath("/dashboard/habitaciones");
  return { success: true };
}

export async function deleteRoom(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Check if room has reservations? In a real app we might want to prevent deletion if there are active reservations.
  // For now, let's just delete it.
  await prisma.room.delete({
    where: { id }
  });

  revalidatePath("/dashboard/habitaciones");
  return { success: true };
}

export async function createRoomType(data: { 
  name: string, 
  slug: string, 
  description: string, 
  basePrice: number, 
  maxOccupancy: number, 
  amenities: string[] 
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { amenities, ...rest } = data;

  await prisma.roomType.create({
    data: {
      ...rest,
      images: [],
      isActive: true,
      amenities: {
        connect: amenities.map(name => ({ name }))
      }
    }
  });

  revalidatePath("/dashboard/habitaciones");
  revalidatePath("/reservar");
  return { success: true };
}

export async function updateRoomType(id: string, data: { 
  name: string, 
  slug: string, 
  description: string, 
  basePrice: number, 
  maxOccupancy: number, 
  amenities: string[] 
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { amenities, ...rest } = data;

  await prisma.roomType.update({
    where: { id },
    data: {
      ...rest,
      amenities: {
        set: amenities.map(name => ({ name }))
      }
    }
  });

  revalidatePath("/dashboard/habitaciones");
  revalidatePath("/reservar");
  return { success: true };
}

export async function deleteRoomType(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Check if rooms exist
  const count = await prisma.room.count({ where: { roomTypeId: id } });
  if (count > 0) throw new Error("Cannot delete room type with existing rooms");

  await prisma.roomType.delete({
    where: { id }
  });

  revalidatePath("/dashboard/habitaciones");
  revalidatePath("/reservar");
  return { success: true };
}
