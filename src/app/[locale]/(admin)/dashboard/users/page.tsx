// src/app/[locale]/(admin)/dashboard/users/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UsersTable } from "@/components/dashboard/UsersTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Usuarios | Hotel Río Yurubí",
};

export default async function UsersManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  
  // Restricted to ADMIN
  if (!session || session.user?.role !== "ADMIN") {
    redirect(`/${locale}/dashboard`);
  }

  const isEs = locale === "es";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      image: true,
    }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
          {isEs ? "Gestión de Usuarios" : "User Management"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-lg">
          {isEs
            ? "Administra las cuentas del personal, define roles y controla el acceso al sistema."
            : "Manage staff accounts, define roles and control system access."}
        </p>
      </div>

      <UsersTable initialData={users} locale={locale} />
    </div>
  );
}
