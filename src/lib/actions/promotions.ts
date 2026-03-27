// src/lib/actions/promotions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function togglePromotion(id: string, isActive: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.promotion.update({
    where: { id },
    data: { isActive: !isActive }
  });

  revalidatePath("/dashboard/promociones");
  revalidatePath("/");
  return { success: true };
}

export async function deletePromotion(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.promotion.delete({
    where: { id }
  });

  revalidatePath("/dashboard/promociones");
  revalidatePath("/");
  return { success: true };
}

export async function createPromotion(data: {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  discountType: "PERCENT" | "FIXED";
  value: number;
  startDate: Date | string;
  endDate: Date | string;
  conditions?: string;
  conditionsEn?: string;
  roomTypeIds?: string[];
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { roomTypeIds, ...rest } = data;

  await prisma.promotion.create({
    data: {
      ...rest,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: true,
      applicableRooms: roomTypeIds ? {
        connect: roomTypeIds.map(id => ({ id }))
      } : undefined
    }
  });

  revalidatePath("/dashboard/promociones");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true };
}

export async function updatePromotion(id: string, data: {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  discountType: "PERCENT" | "FIXED";
  value: number;
  startDate: Date | string;
  endDate: Date | string;
  conditions?: string;
  conditionsEn?: string;
  roomTypeIds?: string[];
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { roomTypeIds, ...rest } = data;

  await prisma.promotion.update({
    where: { id },
    data: {
      ...rest,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      applicableRooms: {
        set: roomTypeIds ? roomTypeIds.map(id => ({ id })) : []
      }
    }
  });

  revalidatePath("/dashboard/promociones");
  revalidatePath("/dashboard");
  revalidatePath("/");
  return { success: true };
}
