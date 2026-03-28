// src/app/[locale]/(public)/habitaciones/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Users, Wifi, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SmartImage } from "@/components/public/SmartImage";
import { WhatsAppBookingButton } from "@/components/public/WhatsAppBookingButton";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group h-full"
            >
              {/* Image Section */}
              <div className="aspect-[4/3] relative bg-gray-200 overflow-hidden shrink-0">
                <SmartImage
                  src={room.images?.[0] || "/images/hero/IMG-20260316-WA0024.jpg"}
                  alt={room.name}
                  fallbackText={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  fallbackClassName="bg-gradient-to-br from-brand-blue-50 to-brand-green-50"
                  textClassName="font-serif text-brand-blue/30 text-2xl font-bold -rotate-12"
                />
                
                {/* Price tag flotante - Glassmorphism style */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg z-10 ring-1 ring-black/5">
                  <span className="font-serif text-xl font-bold text-brand-blue">
                    {formatPrice(room.basePrice)}
                  </span>
                  <span className="text-gray-500 text-xs ml-1 uppercase tracking-wider">{t("perNight")}</span>
                </div>

                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="mb-6">
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
                    {room.name}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {room.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4 mt-auto">
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <Users className="h-4 w-4 text-brand-blue" />
                    <span>{room.maxOccupancy} max</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <Wifi className="h-4 w-4 text-brand-green" />
                    <span>Wi-Fi</span>
                  </div>
                </div>

                {/* Footer del card */}
                <div className="mt-auto grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                  <Button asChild variant="outline" className="rounded-full h-12 border-gray-200 hover:border-brand-blue hover:bg-brand-blue/5 text-gray-600 transition-all">
                    <Link href={`/${locale}/habitaciones/${room.slug}`}>
                      {t("viewDetails")}
                    </Link>
                  </Button>
                  
                   <WhatsAppBookingButton
                    roomName={room.name}
                    roomId={room.id}
                    locale={locale}
                    className="w-full text-cta-sm h-12 px-6 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] rounded-full backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(37,211,102,0.1)]"
                  />
                  {/*
                  <Button asChild className="bg-brand-blue hover:bg-brand-blue-700 rounded-full h-12 shadow-md hover:shadow-lg transition-all text-white border-none">
                    <Link href={`/${locale}/reservar?roomType=${room.id}`}>
                      {t("bookRoom")}
                    </Link>
                  </Button>
                  */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
