// src/components/sections/ServiceHighlights.tsx
import Link from "next/link";
import { Utensils, Waves, Users, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SmartImage } from "@/components/public/SmartImage";

export async function ServiceHighlights({ locale }: { locale: string }) {
  const isEs = locale === "es";
  const t = await getTranslations({ locale, namespace: "services" });

  const highlights = [
    {
      id: "restaurant",
      icon: <Utensils className="w-8 h-8 text-brand-blue" />,
      image: "/images/service/restaurant/01.jpg",
      title: isEs ? "Restaurante El Yurubí" : "El Yurubí Restaurant",
      desc: isEs 
        ? "Gastronomía local e internacional con los mejores ingredientes de la región." 
        : "Local and international gastronomy with the best ingredients of the region.",
      link: `/${locale}/restaurante`,
    },
    {
      id: "pool",
      icon: <Waves className="w-8 h-8 text-brand-green" />,
      image: "/images/service/pool/01.jpg",
      title: isEs ? "Piscina y Relax" : "Pool & Relax",
      desc: isEs 
        ? "Relájate en nuestras aguas cristalinas rodeado de vegetación exuberante." 
        : "Relax in our crystal-clear waters surrounded by lush vegetation.",
      link: `/${locale}/piscina`,
    },
    {
      id: "events",
      icon: <Users className="w-8 h-8 text-brand-blue" />,
      image: "/images/service/events/01.jpg",
      title: isEs ? "Eventos Corporativos" : "Corporate Events",
      desc: isEs 
        ? "Salones equipados para tus conferencias, talleres y celebraciones especiales." 
        : "Fully equipped rooms for your conferences, workshops, and special celebrations.",
      link: `/${locale}/sala-de-reuniones`,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-section-title mb-6 italic text-brand-blue-900">
            {isEs ? "Mucho más que descanso" : "More than just rest"}
          </h2>
          <p className="text-section-subtitle font-medium text-gray-600">
            {isEs 
              ? "Transformamos tu estadía en una experiencia sensorial completa. Descubre los rincones diseñados para tu placer." 
              : "We transform your stay into a complete sensory experience. Discover the corners designed for your pleasure."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {highlights.map((item) => (
            <div key={item.id} className="group relative bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
              <div className="aspect-[4/3] overflow-hidden relative">
                <SmartImage 
                  src={item.image} 
                  alt={item.title} 
                  fallbackText={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute top-6 left-6 bg-white p-3 rounded-2xl shadow-lg ring-1 ring-black/5">
                  {item.icon}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-card-title mb-4">{item.title}</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  {item.desc}
                </p>
                <Link 
                  href={item.link} 
                  className="mt-auto flex items-center gap-2 text-brand-blue font-bold group/link"
                >
                  {isEs ? "Explorar" : "Explore"} 
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
