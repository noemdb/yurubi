// src/app/[locale]/(public)/page.tsx
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { RoomsPreview } from "@/components/sections/RoomsPreview";
import { Services } from "@/components/sections/Services";
import { Location } from "@/components/sections/Location";
import { Contact } from "@/components/sections/Contact";
import { PromotionBanner } from "@/components/sections/PromotionBanner";
import { ServiceHighlights } from "@/components/sections/ServiceHighlights";
import { PromotionsSection } from "@/components/sections/PromotionsSection";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { ReviewsCarousel } from "@/components/public/ReviewsCarousel";
import { SectionReveal } from "@/components/shared/SectionReveal";


interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    title: isEs
      ? "Hotel Río Yurubí | Alojamiento en San Felipe, Yaracuy"
      : "Hotel Río Yurubí | Accommodation in San Felipe, Yaracuy",
    description: isEs
      ? "Hotel frente al Parque Nacional Yurubí. Habitaciones cómodas, restaurante, piscina y sala de reuniones en San Felipe, Yaracuy, Venezuela."
      : "Hotel facing Yurubí National Park. Comfortable rooms, restaurant, pool and meeting room in San Felipe, Yaracuy, Venezuela.",
  };
}

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Hotel Río Yurubí",
  description: "Hotel frente al Parque Nacional Yurubí en San Felipe, Yaracuy",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Final Avenida La Fuente",
    addressLocality: "San Felipe",
    addressRegion: "Yaracuy",
    postalCode: "3201",
    addressCountry: "VE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "10.4035",
    longitude: "-68.7470",
  },
  telephone: "+582542310798",
  email: "hotelrioyurubi@gmail.com",
  priceRange: "$$",
};

import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale); // Requerimiento Next.js 15+ para evitar bugs asíncronos en Client components

  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      guestName: true,
      rating: true,
      comment: true,
    }
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
      />
      <div className="flex flex-col min-h-screen">
        <PromotionBanner locale={locale} />
        
        <SectionReveal>
          <Hero locale={locale} />
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <RoomsPreview locale={locale} />
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <PromotionsSection locale={locale} />
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <ServiceHighlights locale={locale} />
        </SectionReveal>

        <SectionReveal>
          <Services />
        </SectionReveal>

        {/* Gallery Section */}
        <SectionReveal>
          <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  {locale === 'es' ? 'Nuestra Galería Visual' : 'Our Visual Gallery'}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  {locale === 'es' 
                    ? 'Cada rincón del Hotel Río Yurubí ha sido diseñado para conectar con la naturaleza y ofrecerte una experiencia estética inigualable. Explora nuestro paraíso.' 
                    : 'Every corner of Hotel Río Yurubí has been designed to connect with nature and offer you an unparalleled aesthetic experience. Explore our paradise.'}
                </p>
              </div>
              {(() => {
                const allGalleryImages = Array.from({ length: 20 }, (_, i) => ({
                  id: i + 1,
                  src: `/images/galery/${String(i + 1).padStart(2, "0")}.jpg`,
                  category: ["rooms", "pool", "areas"][i % 3] as string,
                  title: locale === 'es' ? `Momento ${i + 1}` : `Moment ${i + 1}`,
                }));
                // Barajar y tomar 6 (servidor-side)
                const randomImages = allGalleryImages.sort(() => 0.5 - Math.random()).slice(0, 6);
                return <GalleryGrid locale={locale} images={randomImages} />;
              })()}
            </div>
          </section>
        </SectionReveal>

        {/* Testimonials Section */}
        {/* <SectionReveal>
          <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                  {locale === 'es' ? 'Lo que dicen nuestros huéspedes' : 'What our guests say'}
                </h2>
                <p className="text-brand-blue-700 text-lg font-medium">
                  {locale === 'es' 
                    ? 'Historias reales de descanso y confort. Descubre por qué somos el destino favorito en San Felipe.' 
                    : 'Real stories of rest and comfort. Discover why we are the favorite destination in San Felipe.'}
                </p>
              </div>
              <ReviewsCarousel reviews={reviews} locale={locale} />
            </div>
          </section>
        </SectionReveal> */}

        <SectionReveal>
          <Location />
        </SectionReveal>

        <SectionReveal>
          <Contact />
        </SectionReveal>
      </div>

    </>
  );
}
