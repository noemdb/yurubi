// src/app/[locale]/(public)/restaurante/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Users, ArrowRight, ChefHat, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        "Desayuno tipo buffet diario",
        "Menú ejecutivo de almuerzo",
        "Cena a la carta",
        "Especialidades criollas e internacionales",
        "Vista panorámica a los jardines",
        "Ambiente climatizado",
      ]
    : [
        "Daily buffet breakfast",
        "Executive lunch menu",
        "A la carte dinner",
        "Creole and international specialties",
        "Panoramic view to the gardens",
        "Air-conditioned environment",
      ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header Restaurante */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/50 z-10" />
        <picture>
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
            alt="Restaurante Hotel Río Yurubí"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <ChefHat className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow">
              {t("subtitle")}
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
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                {isEs ? "Experiencia Culinaria" : "Culinary Experience"}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {isEs
                  ? "Descubre los sabores auténticos de Yaracuy en nuestro restaurante principal. Combinamos ingredientes frescos locales con técnicas internacionales para ofrecerte platos memorables en un ambiente relajado y elegante."
                  : "Discover the authentic flavors of Yaracuy in our main restaurant. We combine fresh local ingredients with international techniques to offer you memorable dishes in a relaxed and elegant atmosphere."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                <div className="flex flex-col sm:flex-row gap-6 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm text-brand-blue">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t("schedule")}</p>
                      <p className="text-gray-600">7:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm text-brand-blue">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{t("capacity")}</p>
                      <p className="text-gray-600">80 {isEs ? "personas" : "people"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-lg h-14 px-8 bg-brand-blue hover:bg-brand-blue-600 rounded-full"
              >
                <Link href={`/${locale}/reservar-restaurante`}>
                  {t("reserveTable")} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Collage Lateral */}
            <div className="grid grid-cols-2 gap-4 h-full">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338988a2e8c0?q=80&w=2070&auto=format&fit=crop"
                alt="Plato del restaurante"
                className="w-full h-[300px] object-cover rounded-3xl"
              />
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
                alt="Ambiente del restaurante"
                className="w-full h-[300px] object-cover rounded-3xl mt-12"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
