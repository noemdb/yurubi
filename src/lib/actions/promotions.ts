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
