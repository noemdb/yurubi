// src/app/[locale]/(public)/sala-de-reuniones/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Users, Clock, MonitorPlay, Wifi, AirVent, Sparkles, Building2, PartyPopper, UtensilsCrossed } from "lucide-react";
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
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20 overflow-hidden transition-colors duration-300">
      {/* 1. Hero Header - Cinematic & Compact */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src="/images/meeting-room/01.jpg"
          alt="Sala de Reuniones Hotel Río Yurubí"
          className="absolute inset-0 w-full h-full object-cover"
          fallbackText={t("title")}
          fallbackClassName="bg-brand-blue-900"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10" />
        <div className="container relative z-20 mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <span className="h-px w-10 bg-brand-green" />
              <span className="text-white uppercase tracking-[0.3em] text-[10px] font-bold">Business & Events</span>
              <span className="h-px w-10 bg-brand-green" />
            </div>
            <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-lg italic leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Introduction & Simple Gallery */}
      <section className="py-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-12 xl:col-span-6">
              <div className="flex items-center gap-4 mb-3">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                <span className="text-brand-blue font-bold tracking-widest uppercase text-[10px]">Versatilidad Sin Límites</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {isEs ? "El escenario perfecto para cada ocasión" : "The perfect stage for every occasion"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base mb-6 leading-relaxed font-light">
                {isEs
                  ? "Descubra un entorno donde el prestigio corporativo y la belleza excepcional convergen armónicamente. Nuestra versatilidad nos permite transformar radicalmente nuestros espacios para dar vida a la visión de su evento, adaptándonos con precisión desde una confidencial reunión ejecutiva de alta gerencia, hasta el banquete de gala más sofisticado y memorable. Elevamos sus estándares reuniendo confort, servicio de primera línea y atención al detalle en cada metro cuadrado."
                  : "Discover an environment where corporate prestige and exceptional beauty converge harmoniously. Our versatility allows us to radically transform our spaces to bring your event's vision to life, adapting with precision from a confidential top-management executive meeting to the most sophisticated and memorable gala banquet. We elevate your standards by combining comfort, top-tier service, and attention to detail in every square meter."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-gray-800 mb-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-serif font-bold text-brand-blue dark:text-brand-blue-400">15 - 350</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">{isEs ? "Capacidad" : "Capacity"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xl font-serif font-bold text-brand-green">100%</span>
                  <span className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-widest">{isEs ? "Equipado" : "Equipped"}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-12 xl:col-span-6 flex flex-col gap-4 mt-8 lg:mt-0">
              {/* Sala 1 - Destacada */}
              <div className="w-full aspect-[3/2] rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 group relative">
                <SmartImage
                  src="/images/meeting-room/01.png"
                  alt="Primera Sala de Conferencias"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-xl" />
              </div>

              {/* Grid Inferior - Salas 2 y 3 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Sala 2 */}
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5 group transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                  <SmartImage
                    src="/images/meeting-room/02.png"
                    alt="Segunda Sala y Eventos Especiales"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-xl" />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm border border-white/20">
                    <span className="text-[9px] font-bold text-brand-blue uppercase tracking-widest leading-none">
                      {isEs ? "Eventos Especiales" : "Special Events"}
                    </span>
                  </div>
                </div>

                {/* Sala 3 - Piscina */}
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-xl ring-1 ring-black/5 group transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                  <SmartImage
                    src="/images/meeting-room/03.png"
                    alt="Festejos y Área de Piscina"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-xl" />
                  <div className="absolute bottom-3 right-3 sm:right-auto sm:left-3 bg-brand-green/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm border border-brand-green/20">
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest leading-none">
                      {isEs ? "Festejos Piscina" : "Poolside Events"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Event Types Grid */}
      <section className="py-8 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8 italic">
              {isEs ? "Experiencias a su medida" : "Bespoke Experiences"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Corporate */}
              <div className="group bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[1.25rem] border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 text-brand-blue/5 dark:text-brand-blue/10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                   <Building2 className="w-16 h-16" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">{t("corporateTitle")}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed mb-4 italic">
                    {isEs
                      ? "Impulse el crecimiento y sinergia de su equipo en un entorno diseñado sin distracciones, ideal para elevar el enfoque empresarial y fomentar nuevas y productivas oportunidades."
                      : "Boost your team's growth and synergy in an environment designed without distractions, ideal for elevating business focus and fostering new productive opportunities."}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {[
                      isEs ? "Conferencias" : "Conferences",
                      isEs ? "Talleres" : "Workshops",
                      isEs ? "Reuniones" : "Meetings"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                        <div className="w-1 h-1 rounded-full bg-brand-blue/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Social */}
              <div className="group bg-white dark:bg-gray-900 p-6 md:p-8 rounded-[1.25rem] border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 text-brand-green/5 dark:text-brand-green/10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                   <PartyPopper className="w-16 h-16" />
                </div>
                <div className="relative z-10 text-left">
                  <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green mb-4">
                    <PartyPopper className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">{t("socialTitle")}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed mb-4 italic">
                    {isEs
                      ? "Celebre amor, vida y logros rodeado de encanto. Convertimos sus sueños en realidades tangibles creando atmósferas mágicas repletas de destellos y recuerdos inolvidables."
                      : "Celebrate love, life, and achievements surrounded by charm. We turn your dreams into tangible realities by creating magical atmospheres full of sparkles and unforgettable memories."}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {[
                      isEs ? "Bodas" : "Weddings",
                      isEs ? "Aniversarios" : "Anniversaries",
                      isEs ? "Bautizos" : "Baptisms"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                        <div className="w-1 h-1 rounded-full bg-brand-green/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* 4. Equipment & Catering Overlay */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tech Box */}
            <div className="bg-brand-blue-900 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden group">
               <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <MonitorPlay className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                  <h3 className="text-lg font-serif font-bold mb-2 flex items-center gap-3">
                    <div className="w-5 h-0.5 bg-brand-green rounded-full" />
                    {t("equipment")}
                  </h3>
                  <p className="text-white/70 text-xs font-light mb-5 leading-relaxed">
                    {isEs 
                      ? "Disponemos de la más moderna infraestructura audiovisual, conexiones estables y climatización inteligente para garantizar que cada presentación sea un rotundo éxito sin interrupciones."
                      : "We have the most modern audiovisual infrastructure, stable connections, and smart climate control to ensure that every presentation is a resounding success without interruptions."}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: MonitorPlay, text: isEs ? "Video Beam HD" : "HD Video Beam" },
                      { icon: Wifi, text: isEs ? "Fibra Óptica" : "Fiber Optic" },
                      { icon: AirVent, text: isEs ? "Climatización" : "AC" },
                      { icon: Users, text: isEs ? "Mobiliario" : "Furniture" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="p-1 bg-white/10 rounded-lg">
                          <item.icon className="w-3 h-3 text-brand-green" />
                        </div>
                        <span className="text-[10px] text-white/80 font-medium leading-tight uppercase tracking-wider">{item.text}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Catering Box */}
            <div className="bg-brand-green-50 dark:bg-[#062012] rounded-[1rem] p-8 border border-brand-green-100 dark:border-[#1e5a37]/50 flex flex-col justify-between group transition-colors duration-300">
               <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3">
                    <UtensilsCrossed className="w-5 h-5 text-brand-green" />
                    {t("cateringTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-light text-sm mb-4 leading-relaxed">
                    {isEs 
                      ? "Nuestra oferta gastronómica premium está meticulosamente diseñada para complementar la grandeza de sus eventos. Contamos con un equipo culinario experto dispuesto a apaciguar los paladares más exigentes, ofreciendo desde estaciones dinámicas y confortables pausas ejecutivas para café, hasta exquisitos banquetes a múltiples tiempos que deleitarán a cada invitado."
                      : "Our premium gastronomic offering is meticulously designed to complement the grandeur of your events. We have an expert culinary team ready to appease the most demanding palates, offering everything from dynamic stations and comfortable executive coffee breaks to exquisite multi-course banquets that will delight every guest."}
                  </p>
               </div>
               <div className="flex flex-wrap gap-2">
                 {[
                   isEs ? "Coffee Break" : "Coffee Break",
                   isEs ? "Almuerzos" : "Lunches",
                   isEs ? "Cenas" : "Dinners"
                 ].map((tag, i) => (
                   <span key={i} className="px-3 py-1 bg-white rounded-full text-[9px] font-bold text-brand-green shadow-sm border border-brand-green/10 uppercase">
                      {tag}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA / Compact Card */}
      <section className="py-8 container mx-auto px-4 max-w-4xl text-center">
         <div className="bg-white dark:bg-gray-900 rounded-[1.25rem] shadow-lg p-8 md:p-12 border border-gray-100 dark:border-gray-800 relative">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">{t("requestQuote")}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 italic text-sm max-w-lg mx-auto leading-relaxed">
              {isEs 
                ? "Garantice hoy el rotundo éxito de su próximo encuentro ejecutivo, banquete o celebración privada. Nuestro equipo de asesores logísticos le guiará paso a paso para planificar y modelar su evento perfecto." 
                : "Ensure the resounding success of your next executive meeting, banquet, or private celebration today. Our team of logistics advisors will guide you step by step to plan and model your perfect event."}
            </p>
            
            <div className="max-w-xs mx-auto space-y-4">
              <WhatsAppBookingButton
                roomName="reserva"
                roomId="eventos"
                locale={locale}
                className="w-full h-12 bg-brand-blue hover:bg-brand-blue-700 text-white rounded-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] font-bold text-base flex items-center justify-center gap-3"
              />
              <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium italic">{isEs ? "* Presupuestos personalizados" : "* Custom quotes"}</p>
            </div>

            <div className="flex items-center justify-center gap-4 text-gray-100 dark:text-gray-800 mt-8">
               <span className="h-px w-12 bg-gray-50 dark:bg-gray-800" />
               <p className="text-[9px] uppercase tracking-[0.2em] font-bold italic text-gray-200 dark:text-gray-700">{isEs ? "Tradición & Excelencia" : "Tradition & Excellence"}</p>
               <span className="h-px w-12 bg-gray-50 dark:bg-gray-800" />
            </div>
         </div>
      </section>
    </div>
  );
}
