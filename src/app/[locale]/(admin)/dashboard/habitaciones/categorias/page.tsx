import { prisma } from "@/lib/prisma";
import { RoomTypesManager } from "@/components/dashboard/RoomTypesManager";
import { RoomsNav } from "@/components/dashboard/RoomsNav";

export default async function RoomCategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  const roomTypes = await prisma.roomType.findMany({
    orderBy: { name: "asc" },
    include: { amenities: true }
  });

  const allAmenities = await prisma.amenity.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-serif text-gray-900 mb-3 font-bold">
          {isEs ? "Categorías y Tarifas" : "Categories & Rates"}
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg font-medium">
          {isEs 
            ? "Gestiona los tipos de habitación, sus precios base, ocupación y servicios." 
            : "Manage room types, their base prices, occupancy, and services."}
        </p>
      </div>

      {/* <RoomsNav locale={locale} /> */}

      <RoomTypesManager 
        roomTypes={roomTypes} 
        allAmenities={allAmenities} 
        locale={locale} 
      />
    </div>
  );
}
