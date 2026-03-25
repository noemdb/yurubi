import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AmenitiesManager } from "@/components/dashboard/AmenitiesManager";
import { RoomsNav } from "@/components/dashboard/RoomsNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amenidades | Dashboard",
};

export default async function AmenitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  const amenities = await prisma.amenity.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          {locale === "es" ? "Amenidades de Habitación" : "Room Amenities"}
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          {locale === "es" 
            ? "Gestiona las amenidades disponibles para las habitaciones."
            : "Manage the amenities available for the rooms."}
        </p>
      </div>

      {/* <RoomsNav locale={locale} /> */}
      
      <AmenitiesManager amenities={amenities} locale={locale} />
    </div>
  );
}
