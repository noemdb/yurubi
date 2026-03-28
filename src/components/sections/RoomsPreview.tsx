// src/components/sections/RoomsPreview.tsx
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Users, Wifi, MessageSquare } from "lucide-react";
import { WhatsAppBookingButton } from "@/components/public/WhatsAppBookingButton";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AnimatedRoomsGrid } from "@/components/public/AnimatedRoomsGrid";
import { SmartImage } from "@/components/public/SmartImage";

export async function RoomsPreview({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "rooms" });

  // Fetch 3 random or top rooms from DB for the preview
  const rooms = await prisma.roomType.findMany({
    where: { isActive: true },
    take: 3,
    orderBy: { basePrice: "asc" },
  });

  if (!rooms.length) return null;

  return (
    <section className="py-8 bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-section-title mb-4">
              {t("title")}
            </h2>
            <p className="text-section-subtitle mb-6">{t("subtitle")}</p>
            <p className="text-muted-foreground mb-2 italic">
              {t("interestInfo")}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="text-brand-blue hover:text-brand-blue-700 hover:bg-brand-blue/5"
          >
            <Link href={`/${locale}/habitaciones`} className="flex items-center gap-2">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <AnimatedRoomsGrid>
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/60 group h-full flex flex-col"
            >
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                <SmartImage
                  src={room.images?.[0] || ""}
                  alt={room.name}
                  fallbackText={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-10">
                  <span className="text-card-price">
                    {formatPrice(room.basePrice)}
                  </span>
                  <span className="text-caption ml-1">{t("perNight")}</span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-card-title mb-3 group-hover:text-brand-blue transition-colors">
                  {room.name}
                </h3>
                <p className="text-card-body mb-8 line-clamp-2">
                  {room.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 mt-auto">
                  <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                    <Users className="h-4 w-4 text-brand-blue" />
                    <span>{room.maxOccupancy} max</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                    <Wifi className="h-4 w-4 text-brand-green" />
                    <span>Wi-Fi</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <Button asChild variant="outline" className="text-cta-sm rounded-full border-border hover:border-brand-blue dark:hover:border-brand-blue hover:bg-brand-blue/5 transition-colors h-12">
                    <Link href={`/${locale}/habitaciones/${room.slug}`}>
                      {locale === 'es' ? 'Detalles' : 'Details'}
                    </Link>
                  </Button>
                  {/*
                  <Button asChild className="text-cta-sm rounded-full bg-brand-blue hover:bg-brand-blue-700 h-12 shadow-md hover:shadow-lg transition-all">
                      <Link href={`/${locale}/reservar?roomType=${room.id}`}>
                        {locale === 'es' ? 'Reservar' : 'Book Now'}
                      </Link>
                    </Button>
                   */}
                  <WhatsAppBookingButton
                    roomName={room.name}
                    roomId={room.id}
                    locale={locale}
                    className="w-full text-cta-sm h-12 px-6 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] rounded-full backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(37,211,102,0.1)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </AnimatedRoomsGrid>

      </div>
    </section>
  );
}
