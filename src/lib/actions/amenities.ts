"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createAmenity(data: { name: string; icon: string | null }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.amenity.create({
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  revalidatePath("/dashboard/habitaciones/amenidades");
  // Also revalidate categories as they use amenities
  revalidatePath("/dashboard/habitaciones/categorias");
  return { success: true };
}

export async function updateAmenity(id: string, data: { name: string; icon: string | null }) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.amenity.update({
    where: { id },
    data: {
      name: data.name,
      icon: data.icon,
    },
  });

  revalidatePath("/dashboard/habitaciones/amenidades");
  revalidatePath("/dashboard/habitaciones/categorias");
  return { success: true };
}

export async function deleteAmenity(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  // Remove relationships with room types first to avoid foreign key constraints
  await prisma.roomType.updateMany({
    where: {
      amenities: {
        some: { id },
      },
    },
    data: {}, // Wait, prisma implicitly handles many-to-many relationship deletion.
  });

  await prisma.amenity.delete({
    where: { id },
  });

  revalidatePath("/dashboard/habitaciones/amenidades");
  revalidatePath("/dashboard/habitaciones/categorias");
  return { success: true };
}
