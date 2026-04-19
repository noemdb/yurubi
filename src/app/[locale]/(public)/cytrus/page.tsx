// src/app/[locale]/(public)/cytrus/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Clock, ChefHat, GlassWater, MapPin } from "lucide-react";
import { SmartImage } from "@/components/public/SmartImage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cytrus" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function CytrusPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cytrus" });

  const features = locale.startsWith("es")
    ? [
        "Coctelería de autor premium",
        "Ambiente chill & relajado",
        "Música en vivo y selecta",
        "Terraza con vista privilegiada",
        "Menú de comida casual gourmet",
        "Ubicación exclusiva en el hotel",
      ]
    : [
        "Premium signature cocktails",
        "Chill & relaxed atmosphere",
        "Live and selected music",
        "Terrace with privileged view",
        "Gourmet casual food menu",
        "Exclusive hotel location",
      ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Header Cytrus */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src="/images/cytrus/01.png"
          alt="Cytrus Lounge & Bar"
          className="absolute inset-0 w-full h-full object-cover"
          fallbackText="Cytrus Lounge & Bar"
          fallbackClassName="bg-gray-950"
        />
        <div className="absolute inset-0 bg-gray-950/60 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-brand-green font-medium tracking-[0.3em] uppercase text-sm mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {t("experience")}
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Cytrus <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-blue-400">Lounge & Bar</span>
            </h1>
            <p className="text-xl md:text-3xl text-gray-200 font-light drop-shadow max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              {t("heroTitle")}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-10" />
      </section>

      {/* Info y Detalles */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Texto y Features */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 text-brand-green text-sm font-semibold mb-8">
                <GlassWater className="w-4 h-4" />
                {t("subtitle")}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                {locale.startsWith("es") ? "La Terraza más " : "The most "}
                <span className="italic text-brand-green">Chill</span> 
                {locale.startsWith("es") ? " de la Ciudad" : " Terrace in Town"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-10 leading-relaxed text-justify">
                {t("description")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-12">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-2 h-2 rounded-full bg-brand-green group-hover:scale-150 transition-transform" />
                    <span className="text-gray-700 dark:text-gray-100 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {locale.startsWith("es") ? "Horario" : "Schedule"}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{t("schedule")}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {locale.startsWith("es") ? "Ubicación" : "Location"}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Hotel Río Yurubí</p>
                </div>
              </div>
              
              <div className="mt-12">
                <a 
                  href="https://www.instagram.com/cytrusloungeandbar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:shadow-pink-500/30 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>{locale.startsWith("es") ? "Siguenos en Instagram" : "Follow us on Instagram"}</span>
                </a>
              </div>
            </div>

            {/* Galería de Imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
              <div className="relative group overflow-hidden rounded-3xl shadow-xl aspect-[4/5]">
                <SmartImage
                  src="/images/cytrus/02.png"
                  alt={t("ambiance")}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  fallbackText="Ambiance"
                />
              </div>
              <div className="relative group overflow-hidden rounded-3xl shadow-xl aspect-[4/5] mt-12">
                <SmartImage
                  src="/images/cytrus/03.png"
                  alt={t("ambiance")}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  fallbackText="Atmosphere"
                />
              </div>
              <div className="md:col-span-2 relative group overflow-hidden rounded-3xl shadow-xl aspect-video mt-6">
                <SmartImage
                  src="/images/cytrus/01.png"
                  alt={t("ambiance")}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  fallbackText="Main Lounge"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-12">
                    <p className="text-white text-2xl font-serif italic">{t("cta")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
