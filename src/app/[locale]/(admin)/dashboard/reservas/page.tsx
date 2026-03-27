// src/app/[locale]/(admin)/dashboard/reservas/page.tsx
import { prisma } from "@/lib/prisma";
import { ReservationsTable } from "@/components/dashboard/ReservationsTable";
import { ManualBookingButton } from "@/components/dashboard/ManualBookingButton";
import { auth } from "@/auth";

export default async function ReservasAdminPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const isEs = locale === "es";

  const session = await auth();
  const isOwner = session?.user?.role === "OWNER";

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: { guest: true, roomType: true, room: true }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEs ? "Gestión de Reservas" : "Reservations Management"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isEs ? "Controla el flujo de huéspedes, confirma pagos y administra estadías." : "Track guest flow, confirm payments, and manage stays."}
          </p>
        </div>
        
        {!isOwner && <ManualBookingButton locale={locale} />}
      </div>

      <ReservationsTable initialData={reservations} locale={locale} readOnly={isOwner} />
    </div>
  );
}
