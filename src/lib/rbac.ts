// src/lib/rbac.ts
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export type Permission =
  | "reservations:read"
  | "reservations:write"
  | "reservations:confirm"
  | "analytics:read"
  | "audit:read"
  | "admin:users"
  | "admin:settings"
  | "admin:content"
  | "admin:promotions"
  | "admin:reviews"
  | "admin:rooms";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  RECEPTIONIST: [
    "reservations:read",
    "reservations:write",
    "reservations:confirm",
  ],
  OWNER: ["reservations:read", "analytics:read", "audit:read"],
  ADMIN: [
    "reservations:read",
    "reservations:write",
    "reservations:confirm",
    "analytics:read",
    "audit:read",
    "admin:users",
    "admin:settings",
    "admin:content",
    "admin:promotions",
    "admin:reviews",
    "admin:rooms",
  ],
};

export async function requirePermission(permission: Permission) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;
  const allowed = ROLE_PERMISSIONS[role]?.includes(permission) ?? false;

  if (!allowed) redirect("/dashboard?error=unauthorized");

  return session.user;
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRoleHomeUrl(role: string, locale: string): string {
  switch (role) {
    case "RECEPTIONIST":
      return `/${locale}/dashboard/recepcionista`;
    case "OWNER":
      return `/${locale}/dashboard/reportes`;
    case "ADMIN":
    default:
      return `/${locale}/dashboard`;
  }
}
