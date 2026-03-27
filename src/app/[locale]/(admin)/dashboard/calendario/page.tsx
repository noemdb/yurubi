// src/app/[locale]/(admin)/dashboard/calendario/page.tsx
import { prisma } from "@/lib/prisma";
import { OccupancyCalendar } from "@/components/dashboard/OccupancyCalendar";
import { startOfMonth, subMonths, addMonths } from "date-fns";

export default async function CalendarioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  // 1. Fetch all rooms with their types
  const rooms = await prisma.room.findMany({
    include: { roomType: true },
    orderBy: { roomNumber: "asc" }
  });

  // 2. Fetch reservations for a reasonable window (6 months)
  // En producción se filtraría dinámicamente según el mes seleccionado, 
  // pero para el MVP traemos una ventana amplia.
  const now = new Date();
  const reservations = await prisma.reservation.findMany({
    where: {
      status: { in: ["CONFIRMED", "PENDING"] },
      checkOut: { gte: subMonths(startOfMonth(now), 2) },
      checkIn: { lte: addMonths(startOfMonth(now), 4) }
    },
    include: {
      guest: { select: { fullName: true } }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEs ? "Calendario de Ocupación" : "Occupancy Calendar"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            {isEs 
              ? "Vista mensual de disponibilidad por habitación. Pasa el cursor sobre una reserva para ver detalles o pulsa para editar." 
              : "Monthly view of availability by room. Hover over a reservation to see details or click to edit."}
          </p>
        </div>
      </div>

      <OccupancyCalendar 
        rooms={rooms} 
        reservations={reservations} 
        locale={locale} 
      />
    </div>
  );
}
