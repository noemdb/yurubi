// src/app/[locale]/(public)/promociones/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Tag, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "promotions" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PromotionsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "promotions" });
  const isEs = locale === "es";

  const now = new Date();

  // Buscar promociones activas (fecha actual entre start y end date)
  const activePromotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    include: {
      applicableRooms: true,
    },
    orderBy: { endDate: "asc" },
  });

  return (
    <div className="min-h-screen bg-brand-blue-50/50 py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {activePromotions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-brand-blue-100 max-w-2xl mx-auto">
            <Tag className="h-16 w-16 text-brand-blue-200 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              Sin Promociones Activas
            </h3>
            <p className="text-gray-500 mb-8">
              {t("noPromotions")}
            </p>
            <Button asChild variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue-50">
              <Link href={`/${locale}/habitaciones`}>Ver Tarifas Regulares</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {activePromotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-brand-blue-100 flex flex-col md:flex-row relative"
              >
                {/* Cinta de descuento */}
                <div className="absolute top-6 -left-8 -rotate-45 bg-red-500 text-white font-bold py-1 px-10 shadow-md text-sm text-center w-40 z-10">
                  {promo.discountType === "PERCENT"
                    ? `-${promo.value}%`
                    : `-$${promo.value}`}
                </div>

                <div className="md:w-1/3 aspect-video md:aspect-auto bg-brand-blue-100 relative shrink-0">
                  {promo.imageUrl ? (
                    <img
                      src={promo.imageUrl}
                      alt={isEs ? promo.title : promo.titleEn || promo.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 text-center text-brand-blue-700 font-serif text-2xl font-bold leading-tight relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 blur-xl">
                         <Tag className="w-[200%] h-[200%] -rotate-12 -translate-y-1/4 -translate-x-1/4" />
                      </div>
                      {isEs ? promo.title : promo.titleEn || promo.title}
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center flex-grow">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">
                    {isEs ? promo.title : promo.titleEn || promo.title}
                  </h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    {isEs ? promo.description : promo.descriptionEn || promo.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                      <Calendar className="h-4 w-4 text-brand-blue" />
                      <span>
                        {t("validUntil")} <strong className="text-gray-900">{formatDate(promo.endDate, locale)}</strong>
                      </span>
                    </div>
                  </div>

                  {(promo.conditions || promo.conditionsEn) && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {t("conditions")}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isEs ? promo.conditions : promo.conditionsEn || promo.conditions}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-600 w-full sm:w-auto text-base">
                      {/* Enviar al flujo de reservas indicando que miren tarifas promocionales */}
                      <Link href={`/${locale}/reservar`} className="flex items-center gap-2">
                        {t("bookNow")} <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
