// src/app/[locale]/(admin)/dashboard/bitacora/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BitacoraTable } from "@/components/dashboard/BitacoraTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitácora de Auditoría | Hotel Río Yurubí",
};

export default async function BitacoraPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  const isEs = locale === "es";

  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { timestamp: "desc" },
    include: {
      performedBy: {
        select: { name: true, email: true, role: true },
      },
    },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {isEs ? "Bitácora de Auditoría" : "Audit Log"}
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          {isEs
            ? "Registro de todas las acciones realizadas sobre el sistema."
            : "Record of all actions performed on the system."}
        </p>
      </div>

      <BitacoraTable logs={logs as any} locale={locale} />
    </div>
  );
}
