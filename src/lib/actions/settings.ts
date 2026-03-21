// src/lib/actions/settings.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateSystemSetting(key: string, value: any) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });

  revalidatePath("/dashboard/configuracion");
  revalidatePath("/");
  return { success: true };
}
