// src/app/[locale]/(admin)/dashboard/reservas/page.tsx
import { prisma } from "@/lib/prisma";
import { ReservationsTable } from "@/components/dashboard/ReservationsTable";
import { Plus } from "lucide-react";
import { Link } from "@/routing";
import { Button } from "@/components/ui/button";

export default async function ReservasAdminPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const isEs = locale === "es";

  // Fetch all reservations
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      guest: true,
      roomType: true,
    }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            {isEs ? "Gestión de Reservas" : "Reservations Management"}
          </h1>
          <p className="text-gray-500">
            {isEs ? "Controla el flujo de huéspedes, confirma pagos y administra estadías." : "Track guest flow, confirm payments, and manage stays."}
          </p>
        </div>
        
        <Link href="/reservar">
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 px-8 shadow-lg shadow-brand-blue/20 gap-2 font-bold transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            {isEs ? "Crear Reserva Manual" : "New Manual Booking"}
          </Button>
        </Link>
      </div>

      <ReservationsTable initialData={reservations} locale={locale} />
    </div>
  );
}
