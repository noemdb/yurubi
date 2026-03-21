// src/app/[locale]/(public)/habitaciones/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Users, Wifi, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rooms" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function RoomsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rooms" });

  const rooms = await prisma.roomType.findMany({
    where: { isActive: true },
    orderBy: { basePrice: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid de Habitaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row group"
            >
              {/* Image Section */}
              <div className="md:w-2/5 aspect-[4/3] md:aspect-auto relative bg-gray-200 overflow-hidden shrink-0">
                {room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-blue-50 to-brand-green-50 flex items-center justify-center">
                    <span className="font-serif text-brand-blue/30 text-2xl font-bold -rotate-12">
                      {room.name}
                    </span>
                  </div>
                )}
                {/* Price tag flotante */}
                <div className="absolute top-4 left-4 md:hidden bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <span className="font-bold text-gray-900">
                    {formatPrice(room.basePrice)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">{t("perNight")}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-serif text-2xl font-bold text-gray-900">
                      {room.name}
                    </h2>
                    <div className="hidden md:block text-right shrink-0 ml-4">
                      <div className="font-bold text-xl text-brand-blue">
                        {formatPrice(room.basePrice)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {t("perNight")}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Users className="h-4 w-4 text-brand-blue" />
                    <span>{t("maxGuests", { count: room.maxOccupancy })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Wifi className="h-4 w-4 text-brand-green" />
                    <span>Free WiFi</span>
                  </div>
                </div>

                {/* Footer del card */}
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                  <Link
                    href={`/${locale}/habitaciones/${room.slug}`}
                    className="text-gray-500 hover:text-brand-blue text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    {t("viewDetails")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Button asChild className="bg-brand-blue hover:bg-brand-blue-600 rounded-full px-6">
                    <Link href={`/${locale}/reservar?roomType=${room.id}`}>
                      {t("bookRoom")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
