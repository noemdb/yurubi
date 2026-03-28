// src/app/[locale]/(public)/galeria/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("title"), description: t("subtitle") };
}

import { SmartImage } from "@/components/public/SmartImage";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";

// ...
export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const isEs = locale === "es";

  // Fetch room category images
  const roomTypes = await prisma.roomType.findMany({
    where: { isActive: true },
    select: { name: true, slug: true, images: true }
  });

  const roomImages = roomTypes
    .filter(rt => rt.images && rt.images.length > 0)
    .map(rt => ({
      src: rt.images[0]!, // Non-null assertion after filter
      title: rt.name
    }));

  // Generar array de 20 imágenes locales
  const placeholderImages = Array.from({ length: 20 }, (_, i) => ({
    src: `/images/galery/${String(i + 1).padStart(2, "0")}.jpg`,
    title: isEs ? `Momento ${i + 1}` : `Moment ${i + 1}`,
  }));

  const galleryImages = [...roomImages, ...placeholderImages];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section - Condensed & Premium */}
      <div className="bg-gray-50 py-12 border-b border-gray-100 mb-12">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 opacity-60">
            <span className="h-px w-8 bg-brand-green" />
            <span className="text-gray-900 uppercase tracking-[0.2em] text-xs font-semibold">Visual Journey</span>
            <span className="h-px w-8 bg-brand-green" />
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto italic">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className="relative overflow-hidden group rounded-3xl bg-gray-100 break-inside-avoid shadow-sm transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              <SmartImage
                src={img.src}
                alt={img.title}
                className="w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                fallbackClassName="bg-brand-blue-50 aspect-square"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                <p className="text-brand-green text-[10px] font-bold uppercase tracking-[0.2em] mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  Hotel Río Yurubí
                </p>
                <h3 className="text-white font-serif font-bold text-lg leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA Section */}
        <div className="mt-20 text-center p-12 bg-brand-blue-900 rounded-[3rem] text-white">
          <h2 className="text-3xl font-serif font-bold mb-4">
            {isEs ? "¿Listo para vivir la experiencia?" : "Ready to live the experience?"}
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto font-light">
            {isEs 
              ? "Cada rincón del Hotel Río Yurubí ha sido diseñado para crear recuerdos inolvidables. Reserve hoy y sea parte de nuestra galería."
              : "Every corner of Hotel Río Yurubí has been designed to create unforgettable memories. Book today and be part of our gallery."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="ghost"
              className="w-full sm:w-auto text-cta h-16 px-10 border border-[#25D366]/50 text-white hover:bg-[#25D366]/20 hover:border-[#25D366] rounded-full backdrop-blur-md transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,211,102,0.15)]"
              asChild
            >
              <a href="https://wa.me/582542310798" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <MessageSquare className="mr-3 h-6 w-6 text-[#25D366] fill-[#25D366]/10" />
                {tHero("whatsapp")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
