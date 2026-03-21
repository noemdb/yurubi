// src/app/[locale]/(public)/piscina/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Clock, Info, Sun, CheckSquare } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pool" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PoolPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pool" });
  const isEs = locale === "es";

  const rules = isEs
    ? [
        "Uso exclusivo para huéspedes del hotel (salvo pases especiales).",
        "Ducharse antes de ingresar al agua.",
        "Prohibido el ingreso con envases de vidrio.",
        "No se permite comer o beber dentro del agua.",
        "Menores de 12 años deben estar acompañados de un adulto.",
        "Vestimenta de baño adecuada es obligatoria.",
      ]
    : [
        "Exclusive use for hotel guests (except special passes).",
        "Shower before entering the water.",
        "No glass containers allowed.",
        "No eating or drinking inside the water.",
        "Children under 12 must be accompanied by an adult.",
        "Proper swimwear is mandatory.",
      ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <Sun className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {/* Imagen principal */}
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-sm mb-16 relative">
          <img
            src="https://images.unsplash.com/photo-1576013551627-1cc001f80211?q=80&w=2070&auto=format&fit=crop"
            alt="Piscina Hotel Río Yurubí"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <Info className="h-6 w-6 text-brand-blue" />
              {isEs ? "Información General" : "General Information"}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                <Clock className="w-6 h-6 text-gray-400 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900">{t("schedule")}</p>
                  <p className="text-gray-600">{t("scheduleValue")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-brand-green/20">
                <div className="bg-brand-green/10 p-2 rounded-full text-brand-green shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t("price")}</p>
                  <p className="text-gray-600">
                    {isEs
                      ? "Incluido gratis en tu estadía."
                      : "Included for free with your stay."}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isEs ? "Pase diario para visitantes: $15 USD p/p" : "Day pass for visitors: $15 USD p/p"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Normas */}
          <div className="bg-brand-blue-50 p-8 rounded-3xl border border-brand-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("rules")}</h2>
            <ul className="space-y-4">
              {rules.map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-brand-blue font-bold opacity-50">
                    {idx + 1}.
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
