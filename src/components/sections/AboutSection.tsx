// src/components/sections/AboutSection.tsx
"use client";

import { useTranslations } from "next-intl";
import { SectionReveal } from "@/components/shared/SectionReveal";
import Image from "next/image";
import { 
  History, 
  Users, 
  Building2, 
  BedDouble, 
  Utensils, 
  Waves, 
  Calendar,
  Sparkles
} from "lucide-react";

interface AboutSectionProps {
  locale: string;
}

export function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations("about");

  const stats = [
    {
      label: t("stats.years"),
      value: "67+",
      icon: History,
    },
    {
      label: t("stats.rooms"),
      value: "45",
      icon: BedDouble,
    },
    {
      label: t("stats.capacity"),
      value: "350",
      icon: Users,
    },
  ];

  const hospitality = [
    {
      title: locale === 'es' ? 'Habitaciones' : 'Rooms',
      content: t("hospitality.rooms"),
      icon: BedDouble,
      color: "blue",
    },
    {
      title: locale === 'es' ? 'Gastronomía' : 'Gastronomy',
      content: t("hospitality.restaurant"),
      icon: Utensils,
      color: "green",
    },
    {
      title: locale === 'es' ? 'Recreación' : 'Recreation',
      content: t("hospitality.recreation"),
      icon: Waves,
      color: "blue",
    },
    {
      title: t("hospitality.eventsTitle"),
      content: t("hospitality.events"),
      icon: Calendar,
      color: "green",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* 1. Hero Section (Welcome) */}
      <section className="relative py-24 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/logo/partials/rio.png')] bg-repeat bg-[length:300px_auto]" />
        </div>
        
        <div className="container-fluid mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <SectionReveal>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-8 leading-tight">
                {t("title")}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
                {t("description")}
              </p>
              
              <div className="flex flex-wrap justify-center gap-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-3xl md:text-4xl font-bold text-brand-blue dark:text-brand-blue-400 mb-2">
                      {stat.value}
                    </span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 2. Tradition Section (Image Right) */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SectionReveal>
              <div className="flex items-center gap-4 mb-4">
                <History className="w-6 h-6 text-brand-green" />
                <span className="text-brand-green font-bold tracking-widest uppercase text-sm block">
                  {t("subtitle1")}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 italic leading-snug">
                 {locale === 'es' 
                  ? '"Llegar a un lugar que te recibe como en casa"' 
                  : '"Arriving at a place that welcomes you like home"'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                {t("content1")}
              </p>
            </SectionReveal>
            
            <SectionReveal delay={0.2}>
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-gray-100 dark:border-gray-800">
                <Image
                  src="/images/galery/05.jpg"
                  alt="Hotel Río Yurubí History"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 3. Architecture Section (Image Left) */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <SectionReveal className="order-2 lg:order-1" delay={0.2}>
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-gray-200 dark:border-gray-800">
                <Image
                  src="/images/galery/02.jpg"
                  alt="Hotel Río Yurubí Architecture"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </SectionReveal>

            <SectionReveal className="order-1 lg:order-2">
              <div className="flex items-center gap-4 mb-4">
                <Building2 className="w-6 h-6 text-brand-blue" />
                <span className="text-brand-blue font-bold tracking-widest uppercase text-sm block">
                  {t("subtitle2")}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 italic leading-snug">
                {locale === 'es' ? 'Una atmósfera de elegancia atemporal' : 'An atmosphere of timeless elegance'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                {t("content2")}
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* 4. Hospitality Grid */}
      <section className="py-24 overflow-hidden bg-white dark:bg-gray-950 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl -z-10" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <SectionReveal>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue mb-8">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                {t("subtitle3")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t("content3")}
              </p>
            </SectionReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {hospitality.map((item, idx) => (
              <SectionReveal key={idx} delay={idx * 0.1}>
                <div className="p-10 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:border-brand-blue/20 transition-all duration-500 group h-full flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 transform group-hover:rotate-6 ${
                    item.color === 'blue' 
                      ? 'bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white' 
                      : 'bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-white'
                  }`}>
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Commitment Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="absolute inset-0 bg-[url('/images/logo/partials/rio.png')] bg-repeat bg-[length:400px_auto]" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <SectionReveal>
              <div className="w-20 h-20 rounded-full border-2 border-brand-green/30 flex items-center justify-center mx-auto mb-10">
                <Building2 className="w-10 h-10 text-brand-green" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mb-8 leading-tight">
                {t("subtitle4")}
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed mb-16 italic font-light">
                {t("content4")}
              </p>
              
              <div className="inline-block py-6 px-12 border-t border-b border-gray-800 mb-10">
                <p className="font-serif text-2xl md:text-3xl font-bold text-brand-green italic tracking-wide">
                  "{t("cta")}"
                </p>
              </div>
              
              <div className="flex justify-center">
                <a
                  href={`/${locale}/habitaciones`}
                  className="bg-brand-green hover:bg-brand-green/90 text-brand-blue-900 font-bold px-8 py-4 rounded-full transition-transform hover:scale-105 active:scale-95 text-lg shadow-xl shadow-brand-green/20"
                >
                  Conoce más o reserva tu próxima estadía
                </a>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
