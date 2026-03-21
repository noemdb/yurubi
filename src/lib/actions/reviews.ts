// src/lib/actions/reviews.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function approveReview(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.review.update({
    where: { id },
    data: { status: "APPROVED" }
  });

  revalidatePath("/dashboard/resenas");
  revalidatePath("/");
  return { success: true };
}

export async function rejectReview(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.review.update({
    where: { id },
    data: { status: "REJECTED" }
  });

  revalidatePath("/dashboard/resenas");
  return { success: true };
}
