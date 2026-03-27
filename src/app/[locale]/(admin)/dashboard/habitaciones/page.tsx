import { prisma } from "@/lib/prisma";
import { RoomsTable } from "@/components/dashboard/RoomsTable";
import { RoomsNav } from "@/components/dashboard/RoomsNav";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3">
          {isEs ? "Inventario de Habitaciones" : "Room Inventory"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg font-medium">
          {isEs 
            ? "Gestiona el estado operacional y la asignación de cada habitación física del hotel." 
            : "Manage the operational status and assignment of each physical room in the hotel."}
        </p>
      </div>

      {/* <RoomsNav locale={locale} /> */}

      <RoomsTable roomTypes={roomTypes} locale={locale} />
    </div>
  );
}
