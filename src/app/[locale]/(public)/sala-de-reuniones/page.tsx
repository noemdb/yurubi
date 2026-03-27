// src/app/[locale]/(public)/sala-de-reuniones/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Users, Clock, MonitorPlay, Wifi, ArrowRight, Sun, AirVent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/public/SmartImage";
import { WhatsAppBookingButton } from "@/components/public/WhatsAppBookingButton";

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
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Header Sala - Cinematic & Condensed */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src="/images/meeting-room/01.jpg"
          alt="Sala de Reuniones Hotel Río Yurubí"
          className="absolute inset-0 w-full h-full object-cover"
          fallbackText={t("title")}
          fallbackClassName="bg-brand-blue-900"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4 opacity-80">
              <span className="h-px w-8 bg-brand-green" />
              <span className="text-white uppercase tracking-[0.2em] text-xs font-semibold">Business Excellence</span>
              <span className="h-px w-8 bg-brand-green" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {t("title")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg italic">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Tighter Layout */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Descripción y Features - Left Column */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                {isEs ? "El escenario perfecto para sus decisiones" : "The perfect stage for your decisions"}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed font-light">
                {isEs
                  ? "Diseñada para la máxima productividad, nuestra sala combina un ambiente ejecutivo con la serenidad del entorno natural de Yaracuy. Cada detalle, desde la iluminación hasta la acústica, ha sido optimizado para el éxito de sus eventos corporativos."
                  : "Designed for maximum productivity, our room combines an executive atmosphere with the serenity of the natural environment of Yaracuy. Every detail, from lighting to acoustics, has been optimized for the success of your corporate events."}
              </p>

              {/* Stats & Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="p-6 bg-brand-blue-50/50 rounded-3xl border border-brand-blue-100 flex items-center gap-5">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <Users className="h-6 w-6 text-brand-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{t("capacity").split(":")[1]?.trim()}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{isEs ? "Capacidad Máx." : "Max Capacity"}</p>
                  </div>
                </div>
                <div className="p-6 bg-brand-green-50/50 rounded-3xl border border-brand-green-100 flex items-center gap-5">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <Clock className="h-6 w-6 text-brand-green" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{isEs ? "Flexible" : "Flexible"}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{isEs ? "Día o Medio Día" : "Full or Half Day"}</p>
                  </div>
                </div>
              </div>

              {/* Equipamiento incluído - List Style */}
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-6 h-1 bg-brand-blue rounded-full" />
                  {t("equipment")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  {[
                    { icon: MonitorPlay, text: isEs ? "Video Beam HD y Pantalla" : "HD Video Beam & Screen" },
                    { icon: Wifi, text: isEs ? "WiFi de Alta Velocidad" : "High-Speed WiFi" },
                    { icon: Sun, text: isEs ? "Iluminación Natural y Artificial" : "Natural & Artificial Light" },
                    { icon: AirVent, text: isEs ? "Climatización Silenciosa" : "Silent AC" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 group">
                      <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:bg-brand-blue/5 transition-colors">
                        <item.icon className="w-4 h-4 text-brand-blue" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Card & CTA - Right Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-10 lg:sticky lg:top-28 transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-6 pb-6 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                    {isEs ? "Tarifa Preferencial Corporativa" : "Preferential Corporate Rate"}
                  </p>
                  <div className="flex items-center justify-center text-6xl font-serif font-bold text-gray-900 mb-2">
                    <span className="text-2xl text-gray-400 font-sans mr-2">$</span>
                    250
                  </div>
                  <p className="text-gray-400 font-medium text-sm flex items-center justify-center gap-2">
                    {isEs ? "USD por jornada completa" : "USD per full day session"}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center group bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 hover:bg-brand-green/5 hover:border-brand-green/10 transition-all">
                    <span className="text-gray-600 font-medium text-sm">Coffee Break AM/PM</span>
                    <span className="text-[10px] text-brand-green font-bold bg-brand-green/10 px-3 py-1 rounded-full uppercase tracking-tighter">Opcional</span>
                  </div>
                  <div className="flex justify-between items-center group bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 hover:bg-brand-green/5 hover:border-brand-green/10 transition-all">
                    <span className="text-gray-600 font-medium text-sm">Almuerzo Ejecutivo</span>
                    <span className="text-[10px] text-brand-green font-bold bg-brand-green/10 px-3 py-1 rounded-full uppercase tracking-tighter">Opcional</span>
                  </div>
                </div>

                {/*
                <Button
                  asChild
                  size="lg"
                  className="w-full text-lg h-14 bg-brand-blue hover:bg-brand-blue-700 rounded-full shadow-lg shadow-brand-blue/20 transition-all font-bold"
                >
                  <Link href={`/${locale}/reservar-sala`}>
                    {t("requestQuote")} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                */}

                <WhatsAppBookingButton
                  roomName="reserva"
                  roomId="reservaId"
                  locale={locale}
                  className="w-full text-cta-sm h-12 px-6 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366] rounded-full backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(37,211,102,0.1)]"
                />
                <p className="text-center text-[11px] text-gray-400 mt-6 italic">
                  * {isEs ? "Solicite un presupuesto personalizado para eventos de varios días." : "Request a custom quote for multi-day events."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
