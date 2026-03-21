// src/app/[locale]/(admin)/dashboard/habitaciones/page.tsx
import { prisma } from "@/lib/prisma";
import { RoomsTable } from "@/components/dashboard/RoomsTable";

export default async function HabitacionesAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  // Fetch room types with their physical rooms
  const roomTypes = await prisma.roomType.findMany({
    include: {
      rooms: true
    },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          {isEs ? "Inventario y Tarifas" : "Inventory and Rates"}
        </h1>
        <p className="text-gray-500 max-w-2xl">
          {isEs 
            ? "Administra los precios base por categoría y el estado operacional de cada habitación física." 
            : "Manage base prices by category and the operational status of each physical room."}
        </p>
      </div>

      <RoomsTable roomTypes={roomTypes} locale={locale} />
    </div>
  );
}
