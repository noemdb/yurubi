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

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  // Imágenes en hardcode para el MVP/Setup
  const images = [
    { src: "https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2069&auto=format&fit=crop", title: "Fachada Natural" },
    { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", title: "Restaurante" },
    { src: "https://images.unsplash.com/photo-1576013551627-1cc001f80211?q=80&w=2070&auto=format&fit=crop", title: "Piscina Principal" },
    { src: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop", title: "Sala de Eventos" },
    { src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop", title: "Habitación Matrimonial" },
    { src: "https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?q=80&w=2070&auto=format&fit=crop", title: "Suite Familiar" },
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop", title: "Interior Suite" },
    { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop", title: "Áreas Verdes" },
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden group rounded-2xl bg-gray-100 ${
                idx === 0 || idx === 3 ? "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-square"
              }`}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-serif font-bold text-lg drop-shadow-md">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
