// src/app/[locale]/(admin)/dashboard/huespedes/page.tsx
import { prisma } from "@/lib/prisma";
import { GuestsTable } from "@/components/dashboard/GuestsTable";

export default async function HuespedesAdminPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const isEs = locale === "es";

  // Fetch all guests
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            {isEs ? "Base de Datos de Huéspedes" : "Guest Database"}
          </h1>
          <p className="text-gray-500">
            {isEs ? "Consulta el historial de clientes, sus datos de contacto y procedencia." : "Manage customer records, contact information, and origins."}
          </p>
        </div>
      </div>

      <GuestsTable initialData={guests} locale={locale} />
    </div>
  );
}
