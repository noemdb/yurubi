// src/lib/actions/users.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["ADMIN", "OWNER", "RECEPTIONIST"]),
});

const UpdateUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  role: z.enum(["ADMIN", "OWNER", "RECEPTIONIST"]),
  isActive: z.boolean(),
});

async function ensureAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createUser(data: any) {
  const session = await ensureAdmin();
  
  const validated = UserSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { name, email, password, role } = validated.data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: { email: ["Email ya está en uso"] } };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as Role,
    },
  });

  await prisma.auditLog.create({
    data: {
      entity: "USER",
      entityId: user.id,
      action: "CREATE",
      performedById: session.user?.id,
      changes: { name, email, role },
    },
  });

  revalidatePath("/[locale]/(admin)/dashboard/users", "page");
  return { success: true, user };
}

export async function updateUser(id: string, data: any) {
  const session = await ensureAdmin();
  
  const validated = UpdateUserSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { name, role, isActive } = validated.data;

  const user = await prisma.user.update({
    where: { id },
    data: { name, role: role as Role, isActive },
  });

  await prisma.auditLog.create({
    data: {
      entity: "USER",
      entityId: id,
      action: "UPDATE",
      performedById: session.user?.id,
      changes: { name, role, isActive },
    },
  });

  revalidatePath("/[locale]/(admin)/dashboard/users", "page");
  return { success: true, user };
}

export async function deleteUser(id: string) {
  const session = await ensureAdmin();
  
  // Prevent self-deletion
  if (id === session.user?.id) {
    throw new Error("Cannot delete yourself");
  }

  await prisma.user.delete({
    where: { id },
  });

  await prisma.auditLog.create({
    data: {
      entity: "USER",
      entityId: id,
      action: "DELETE",
      performedById: session.user?.id,
    },
  });

  revalidatePath("/[locale]/(admin)/dashboard/users", "page");
}

export async function toggleUserStatus(id: string, active: boolean) {
  const session = await ensureAdmin();
  
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: active },
  });

  await prisma.auditLog.create({
    data: {
      entity: "USER",
      entityId: id,
      action: "UPDATE",
      performedById: session.user?.id,
      changes: { isActive: active },
    },
  });

  revalidatePath("/[locale]/(admin)/dashboard/users", "page");
  return user;
}
