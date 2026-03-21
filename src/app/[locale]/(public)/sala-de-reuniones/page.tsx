// src/app/[locale]/(public)/sala-de-reuniones/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Users, Clock, MonitorPlay, Wifi, ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meetingRoom" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function MeetingRoomPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meetingRoom" });
  const isEs = locale === "es";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header Sala */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/60 z-10" />
        <picture>
          <img
            src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop"
            alt="Sala de Reuniones Hotel Río Yurubí"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-md">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Descripción */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                {isEs ? "Espacio ideal para negocios" : "Ideal space for business"}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {isEs
                  ? "Nuestra sala de reuniones está diseñada para ofrecer privacidad, comodidad y la mejor tecnología para tus presentaciones corporativas, talleres o reuniones ejecutivas en un ambiente profesional rodeado de naturaleza."
                  : "Our meeting room is designed to offer privacy, comfort, and the best technology for your corporate presentations, workshops, or executive meetings in a professional environment surrounded by nature."}
              </p>

              {/* Grid Features */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-center flex-col text-center gap-3">
                  <Users className="h-8 w-8 text-brand-green" />
                  <div>
                    <p className="font-bold text-gray-900">{t("capacity").split(":")[1]?.trim()}</p>
                    <p className="text-sm text-gray-500">{isEs ? "Capacidad máxima" : "Max Capacity"}</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100 flex items-center justify-center flex-col text-center gap-3">
                  <Clock className="h-8 w-8 text-brand-blue" />
                  <div>
                    <p className="font-bold text-gray-900">1/2 Día o Completo</p>
                    <p className="text-sm text-gray-500">{isEs ? "Formatos flexibles" : "Flexible formats"}</p>
                  </div>
                </div>
              </div>

              {/* Equipamiento incluído */}
              <h3 className="font-bold text-gray-900 mb-4">{t("equipment")}</h3>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="bg-gray-100 p-2 rounded-full"><MonitorPlay className="w-4 h-4 text-brand-blue" /></div>
                  <span className="font-medium">Video Proyector (Video Beam) HD y Pantalla</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="bg-gray-100 p-2 rounded-full"><Wifi className="w-4 h-4 text-brand-blue" /></div>
                  <span className="font-medium">Conexión WiFi de alta velocidad</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-4 text-brand-blue flex items-center justify-center text-xs font-bold">A/C</div></div>
                  <span className="font-medium">Aire acondicionado independiente</span>
                </li>
              </ul>
            </div>

            {/* Pricing Card & CTA */}
            <div className="lg:pl-8">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10 sticky top-28">
                <div className="text-center mb-8 pb-8 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">
                    {isEs ? "Tarifa Estándar" : "Standard Rate"}
                  </p>
                  <div className="flex items-center justify-center text-5xl font-bold text-gray-900 mb-2">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                    250
                  </div>
                  <p className="text-gray-500 font-medium">USD / {isEs ? "Día" : "Day"}</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-gray-600 font-medium">Coffee Break AM</span>
                    <span className="text-brand-green font-bold text-sm bg-brand-green/10 px-2 py-1 rounded">Opcional</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-gray-600 font-medium">Almuerzo Ejecutivo</span>
                    <span className="text-brand-green font-bold text-sm bg-brand-green/10 px-2 py-1 rounded">Opcional</span>
                  </div>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full text-lg h-14 bg-brand-green hover:bg-brand-green-600 rounded-full"
                >
                  <Link href={`/${locale}/reservar-sala`}>
                    {t("requestQuote")} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-center text-sm text-gray-400 mt-4">
                  {isEs ? "Sujeto a disponibilidad." : "Subject to availability."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
