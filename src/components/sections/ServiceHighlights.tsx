// src/components/sections/ServiceHighlights.tsx
import Link from "next/link";
import { Utensils, Waves, Users, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function ServiceHighlights({ locale }: { locale: string }) {
  const isEs = locale === "es";
  const t = await getTranslations({ locale, namespace: "services" });

  const highlights = [
    {
      id: "restaurant",
      icon: <Utensils className="w-8 h-8 text-brand-blue" />,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
      title: isEs ? "Restaurante El Yurubí" : "El Yurubí Restaurant",
      desc: isEs 
        ? "Gastronomía local e internacional con los mejores ingredientes de la región." 
        : "Local and international gastronomy with the best ingredients of the region.",
      link: `/${locale}/restaurante`,
    },
    {
      id: "pool",
      icon: <Waves className="w-8 h-8 text-brand-green" />,
      image: "https://images.unsplash.com/photo-1576013551627-1cc001f80211?q=80&w=2070&auto=format&fit=crop",
      title: isEs ? "Piscina y Relax" : "Pool & Relax",
      desc: isEs 
        ? "Relájate en nuestras aguas cristalinas rodeado de vegetación exuberante." 
        : "Relax in our crystal-clear waters surrounded by lush vegetation.",
      link: `/${locale}/piscina`,
    },
    {
      id: "events",
      icon: <Users className="w-8 h-8 text-brand-blue" />,
      image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop",
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
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6 italic">
            {isEs ? "Mucho más que descanso" : "More than just rest"}
          </h2>
          <p className="text-gray-500 text-lg">
            {isEs 
              ? "Descubre todas las experiencias que tenemos preparadas para ti dentro de nuestras instalaciones." 
              : "Discover all the experiences we have prepared for you within our facilities."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {highlights.map((item) => (
            <div key={item.id} className="group relative bg-gray-50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute top-6 left-6 bg-white p-3 rounded-2xl shadow-lg ring-1 ring-black/5">
                  {item.icon}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{item.title}</h3>
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
