// src/app/[locale]/(public)/restaurante/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Users, ArrowRight, ChefHat, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/public/SmartImage";
import { WhatsAppBookingButton } from "@/components/public/WhatsAppBookingButton";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "restaurant" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "restaurant" });
  const isEs = locale === "es";

  const features = isEs
    ? [
        "Desayuno premium y variado",
        "Menú ejecutivo de lujo para el almuerzo",
        "Cenas a la carta con platos de autor",
        "Fusión de sabores criollos e internacionales",
        "Vista panorámica a nuestros jardines",
        "Espacios climatizados de máximo confort",
      ]
    : [
        "Premium and varied breakfast",
        "Luxury executive lunch menu",
        "Signature a la carte dinners",
        "Fusion of Creole and international flavors",
        "Panoramic view of our lush gardens",
        "Maximum comfort air-conditioned spaces",
      ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Header Restaurante */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src="/images/restaurant/01.jpg"
          alt="Restaurante Hotel Río Yurubí"
          className="absolute inset-0 w-full h-full object-cover"
          fallbackText={isEs ? "Restaurante El Yurubí" : "El Yurubí Restaurant"}
          fallbackClassName="bg-brand-blue-900"
        />
        <div className="absolute inset-0 bg-gray-900/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <ChefHat className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow max-w-2xl mx-auto leading-relaxed">
              {isEs 
                ? "Una travesía gastronómica donde los sabores auténticos de nuestra tierra se encuentran con la excelencia culinaria internacional." 
                : "A gastronomic journey where the authentic flavors of our land meet international culinary excellence."}
            </p>
          </div>
        </div>
      </section>

      {/* Info y Detalles */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Texto y Features */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                {isEs ? "Un Santuario del Sabor" : "A Sanctuary of Flavor"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                {isEs
                  ? "Elevamos la oferta gastronómica de Yaracuy fusionando de manera sublime el calor de la cocina criolla con técnicas de la más alta gastronomía internacional. Nuestro equipo de artesanos culinarios selecciona minuciosamente ingredientes frescos y locales de primera calidad para crear una experiencia en su paladar y platos memorables. Disfrute de nuestra impecable hospitalidad dentro de un ambiente maravillosamente relajado, climatizado y lleno de sofisticación."
                  : "We elevate the gastronomic offering of Yaracuy by sublimely fusing the warmth of Creole cuisine with techniques of the highest international gastronomy. Our team of culinary artisans carefully selects fresh, premium local ingredients to create an experience for your palate and memorable dishes. Enjoy our impeccable hospitality within a wonderfully relaxed, air-conditioned, and sophisticated environment."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/50 p-6 sm:p-8 rounded-lg border border-gray-100 dark:border-gray-700 mb-8 shadow-sm">
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-green mb-6">
                  {isEs ? "Información de Interés" : "Useful Information"}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-between">
                  {/* Horario */}
                  <div className="flex items-start gap-4 group">
                    <div className="bg-white dark:bg-gray-700 p-3.5 rounded-md shadow-sm text-brand-blue dark:text-brand-blue-300 group-hover:bg-brand-blue dark:group-hover:bg-brand-blue group-hover:text-white dark:group-hover:text-white transition-colors duration-500">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 mb-0.5">{t("schedule")}</p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">7:00 AM - 10:00 PM</p>
                      <p className="text-[10px] text-gray-400 italic mt-1">{isEs ? "Abierto todo el día" : "Open all day"}</p>
                    </div>
                  </div>
                  {/* Capacidad */}
                  <div className="flex items-start gap-4 group">
                    <div className="bg-white dark:bg-gray-700 p-3.5 rounded-md shadow-sm text-brand-blue dark:text-brand-blue-300 group-hover:bg-brand-blue dark:group-hover:bg-brand-blue group-hover:text-white dark:group-hover:text-white transition-colors duration-500">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 mb-0.5">{t("capacity")}</p>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">80 {isEs ? "Comensales" : "Diners"}</p>
                      <p className="text-[10px] text-gray-400 italic mt-1">{isEs ? "Atmósfera íntima y acogedora" : "Intimate and cozy atmosphere"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-lg h-14 px-8 bg-brand-blue hover:bg-brand-blue-600 rounded-full"
              >
                <Link href={`/${locale}/reservar-restaurante`}>
                  {t("reserveTable")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
               */}
              <WhatsAppBookingButton
                roomName="reservaRestarurant"
                roomId="reservaId"
                locale={locale}
                className="w-full text-cta-sm h-14 px-8 bg-brand-blue hover:bg-brand-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              />
            </div>

            {/* Collage Lateral */}
            <div className="grid grid-cols-2 gap-4 h-full">
              <SmartImage
                src="/images/restaurant/01.jpg"
                alt="Plato del restaurante"
                className="w-full h-[300px] object-cover rounded-lg shadow-lg transition-transform duration-700 hover:scale-105"
                fallbackText=""
                fallbackClassName="bg-brand-blue-50"
              />
              <SmartImage
                src="/images/restaurant/02.jpg"
                alt="Ambiente del restaurante"
                className="w-full h-[300px] object-cover rounded-xl mt-12 shadow-lg transition-transform duration-700 hover:scale-105"
                fallbackText=""
                fallbackClassName="bg-brand-green-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA a Cytrus Lounge & Bar */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                {locale.startsWith("es") ? "¿Buscas un ambiente más relajado?" : "Looking for a more relaxed atmosphere?"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {locale.startsWith("es") 
                    ? "Descubre Cytrus Lounge & Bar, nuestra terraza exclusiva con coctelería de autor y la mejor música chill de la ciudad." 
                    : "Discover Cytrus Lounge & Bar, our exclusive terrace with signature cocktails and the best chill music in town."}
            </p>
            <Button asChild variant="outline" size="lg" className="rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-all">
                <Link href="/cytrus">
                    {locale.startsWith("es") ? "Visitar Cytrus Lounge & Bar" : "Visit Cytrus Lounge & Bar"} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
