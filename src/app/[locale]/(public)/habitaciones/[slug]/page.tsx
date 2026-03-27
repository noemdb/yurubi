// src/app/[locale]/(public)/habitaciones/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { Users, LayoutDashboard, Wifi, Tv, Coffee, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SmartImage } from "@/components/public/SmartImage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const room = await prisma.roomType.findUnique({ where: { slug } });
  
  if (!room) return { title: "Not Found" };
  
  return {
    title: `${room.name} | Hotel Río Yurubí`,
    description: room.description,
  };
}

export default async function RoomDetailsPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "rooms" });
  const isEs = locale === "es";

  const room = await prisma.roomType.findUnique({
    where: { slug },
    include: { amenities: true }
  });

  if (!room || !room.isActive) {
    notFound();
  }

  // Diccionario básico de iconos para amenidades
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="w-5 h-5 text-brand-green" />;
    if (lower.includes("tv")) return <Tv className="w-5 h-5 text-brand-blue" />;
    if (lower.includes("café") || lower.includes("coffee")) return <Coffee className="w-5 h-5 text-amber-700" />;
    return <ShieldCheck className="w-5 h-5 text-brand-blue" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header (Back Link + Title) */}
        <div className="mb-8">
          <Link 
            href={`/${locale}/habitaciones`}
            className="text-brand-blue font-medium hover:underline mb-4 inline-block"
          >
            &larr; {isEs ? "Volver a Habitaciones" : "Back to Rooms"}
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {room.name}
              </h1>
              <p className="text-gray-500 flex gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <Users className="w-4 h-4 text-brand-blue" />
                  {t("maxGuests", { count: room.maxOccupancy })}
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <LayoutDashboard className="w-4 h-4 text-brand-green" />
                  {15 * room.maxOccupancy} m²
                </span>
              </p>
            </div>
            
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-brand-green/20">
              <div className="text-sm text-gray-500 uppercase font-semibold tracking-wider">
                {isEs ? "Desde" : "From"}
              </div>
              <div className="text-4xl font-bold text-brand-green flex items-end gap-1">
                {formatPrice(room.basePrice)}
                <span className="text-sm text-gray-500 font-normal mb-1">/{isEs ? "Noche" : "Night"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Galería / Main Image */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12 h-[500px]">
          <div className="lg:col-span-2 bg-gray-200 rounded-3xl overflow-hidden h-full relative">
            <SmartImage
              src={`/images/rooms/${room.slug}/01.jpg`}
              alt={room.name}
              fallbackText={room.name}
              className="w-full h-full object-cover"
              fallbackClassName="bg-brand-blue-50"
              textClassName="font-serif text-brand-blue/30 text-3xl font-bold"
            />
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
            <div className="bg-gray-200 rounded-3xl overflow-hidden h-full">
              <SmartImage
                src={`/images/rooms/${room.slug}/02.jpg`}
                alt="Detail 1"
                fallbackText=""
                className="w-full h-full object-cover"
                fallbackClassName="bg-brand-green-50"
                textClassName="hidden"
              />
            </div>
            <div className="bg-gray-200 rounded-3xl overflow-hidden h-full relative group">
              <SmartImage
                src={`/images/rooms/${room.slug}/03.jpg`}
                alt="Detail 2"
                fallbackText=""
                className="w-full h-full object-cover"
                fallbackClassName="bg-gray-100"
                textClassName="hidden"
              />
              {/* Overlay para "Ver todas las fotos" */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white font-bold">{isEs ? "Ver Galería" : "View Gallery"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Booking CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description y Amenidades */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                {isEs ? "Descripción" : "Description"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {room.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
                {isEs ? "Amenidades de la Habitación" : "Room Amenities"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {room.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    {getAmenityIcon(amenity.name)}
                    <span className="font-medium text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-28">
               <h3 className="font-bold text-xl text-gray-900 mb-6 text-center">
                 {isEs ? "Asegura tu estadía" : "Secure your stay"}
               </h3>
               
               <p className="text-gray-500 text-sm mb-6 text-center">
                 {isEs ? "Selecciona fechas en el siguiente paso para confirmar disponibilidad real y desglose de tarifas." : "Select dates in the next step to confirm real availability and rate breakdown."}
               </p>

               <Button 
                 asChild
                 size="lg"
                 className="w-full h-14 bg-brand-blue hover:bg-brand-blue-600 text-lg rounded-2xl"
               >
                 <Link href={`/${locale}/reservar?roomType=${room.id}`}>
                   {t("bookRoom")} <ExternalLink className="w-5 h-5 ml-2 border-l border-white/20 pl-2" />
                 </Link>
               </Button>
               
               <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">{isEs ? "Check-in" : "Check-in"}</span>
                   <span className="font-bold text-gray-900">14:00 (2:00 PM)</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-500">{isEs ? "Check-out" : "Check-out"}</span>
                   <span className="font-bold text-gray-900">12:00 (12:00 PM)</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
