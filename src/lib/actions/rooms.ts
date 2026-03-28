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

import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function createRoomType(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const maxOccupancy = parseInt(formData.get("maxOccupancy") as string);
  const amenities = formData.getAll("amenities") as string[];
  const imageFile = formData.get("image") as File | null;

  let imageUrls: string[] = [];

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const publicDir = path.join(process.cwd(), "public");
    const relativePath = `/images/rooms/${slug}/01.jpg`;
    const fullPath = path.join(publicDir, relativePath);

    // Create directory if it doesn't exist
    await mkdir(path.dirname(fullPath), { recursive: true });
    
    // Save the file
    await writeFile(fullPath, buffer);
    imageUrls = [relativePath];
  }

  await prisma.roomType.create({
    data: {
      name,
      slug,
      description,
      basePrice,
      maxOccupancy,
      images: imageUrls,
      isActive: true,
      amenities: {
        connect: amenities.map(name => ({ name }))
      }
    }
  });

  revalidatePath("/dashboard/habitaciones/categorias");
  revalidatePath("/habitaciones");
  revalidatePath("/reservar");
  return { success: true };
}

export async function updateRoomType(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const maxOccupancy = parseInt(formData.get("maxOccupancy") as string);
  const amenities = formData.getAll("amenities") as string[];
  const imageFile = formData.get("image") as File | null;

  const currentRoomType = await prisma.roomType.findUnique({ where: { id } });
  let imageUrls = currentRoomType?.images || [];

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const publicDir = path.join(process.cwd(), "public");
    const relativePath = `/images/rooms/${slug}/01.jpg`;
    const fullPath = path.join(publicDir, relativePath);

    // Create directory if it doesn't exist
    await mkdir(path.dirname(fullPath), { recursive: true });
    
    // Save the file
    await writeFile(fullPath, buffer);
    imageUrls = [relativePath];
  }

  await prisma.roomType.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      basePrice,
      maxOccupancy,
      images: imageUrls,
      amenities: {
        set: amenities.map(name => ({ name }))
      }
    }
  });

  revalidatePath("/dashboard/habitaciones/categorias");
  revalidatePath("/habitaciones");
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
