// src/app/[locale]/(public)/piscina/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Clock, Info, Sun, CheckSquare } from "lucide-react";
import { SmartImage } from "@/components/public/SmartImage";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300">
      {/* Hero Section - Cinematic but more condensed */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <SmartImage
          src="/images/pool/01.jpg"
          alt={t("title")}
          className="absolute inset-0 w-full h-full object-cover"
          fallbackText={t("title")}
          fallbackClassName="bg-brand-blue-900"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10" />
        <div className="container relative z-20 mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4 opacity-80">
              <span className="h-px w-8 bg-brand-green" />
              <span className="text-white uppercase tracking-[0.2em] text-xs font-semibold">Resort Experience</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
              {t("title")}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-light max-w-2xl leading-relaxed drop-shadow-lg italic">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-30">
        {/* Sección de Introducción y Galería Asimétrica - Condensada */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16">
          <div className="lg:col-span-12 xl:col-span-5">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {isEs ? "Un refugio de serenidad bajo el sol" : "A serenity refuge under the sun"}
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed font-light">
              <p>
                {isEs 
                  ? "Nuestra piscina ha sido diseñada como un espejo de agua que refleja la exuberante vegetación de Yaracuy. Es el punto de encuentro ideal para quienes buscan desconectar de la rutina y sumergirse en un ambiente de absoluta relajación."
                  : "Our pool has been designed as a water mirror reflecting the lush vegetation of Yaracuy. It is the ideal meeting point for those looking to disconnect from the routine and immerse themselves in an atmosphere of absolute relaxation."}
              </p>
              <p>
                {isEs
                  ? "Rodeada de hermosos jardines y con una temperatura siempre agradable, ofrece espacios tanto para la natación activa como para el descanso contemplativo. Aquí, cada detalle está pensado para su bienestar."
                  : "Surrounded by beautiful gardens and with a always pleasant temperature, it offers spaces for both active swimming and contemplative rest. Here, every detail is designed for your well-being."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10">
              {[
                isEs ? "Tumbonas ergonómicas" : "Ergonomic loungers",
                isEs ? "Servicio de toallas" : "Towel service",
                isEs ? "Área para niños" : "Children's area",
                isEs ? "Duchas externas" : "Outdoor showers",
                isEs ? "Ambiente musical suave" : "Soft background music",
                isEs ? "Vigilancia permanente" : "Permanent supervision",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 py-6 border-y border-gray-100 dark:border-gray-800 mb-8 max-w-md">
              <div className="text-center flex-1">
                <p className="text-brand-blue font-serif text-2xl font-bold">28°C</p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">Temp. Promedio</p>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
              <div className="text-center flex-1">
                <p className="text-brand-green font-serif text-2xl font-bold">1.4m</p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-widest mt-0.5">Profundidad Máx.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-8 aspect-[16/10] rounded-2xl overflow-hidden shadow-xl ring-4 ring-white dark:ring-gray-900 transform hover:scale-[1.02] transition-all duration-700">
              <SmartImage
                src="/images/pool/02.jpg"
                alt="Detalle Piscina"
                className="w-full h-full object-cover"
                fallbackClassName="bg-brand-green-50"
              />
            </div>
            <div className="col-span-4 aspect-[4/5] rounded-xl overflow-hidden shadow-lg ring-2 ring-white dark:ring-gray-900 transform -ml-8 relative z-10 hover:scale-[1.05] transition-all duration-700">
              <SmartImage
                src="/images/pool/03.jpg"
                alt="Vista Alternativa"
                className="w-full h-full object-cover"
                fallbackClassName="bg-brand-blue-50"
              />
            </div>
          </div>
        </div>

        {/* Info & Rules - More Compact Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-brand-blue-50 dark:bg-brand-blue-900/20 p-8 rounded-2xl flex flex-col justify-between border border-brand-blue-100/30 dark:border-brand-blue-900/50">
            <div>
              <Clock className="w-8 h-8 text-brand-blue dark:text-brand-blue-400 mb-6" />
              <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">{t("schedule")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">{t("scheduleValue")}</p>
            </div>
            <p className="text-brand-blue dark:text-brand-blue-400 font-medium mt-8 flex items-center gap-2 text-sm">
              {isEs ? "Abierto todos los días (con excepción de los lunes)" : "Open every day (except Mondays)"}
              <span className="h-1 w-1 rounded-full bg-brand-blue dark:bg-brand-blue-400 animate-pulse" />
            </p>
          </div>

          <div className="bg-brand-green-50 dark:bg-[#062012] p-8 rounded-2xl flex flex-col justify-between border border-brand-green-100/30 dark:border-[#1e5a37]/50 transition-colors duration-300">
            <div>
              <CheckSquare className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">{t("price")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                {isEs ? "Gratis para huéspedes alojados." : "Free for staying guests."}
              </p>
            </div>
            <div className="mt-8 p-3 bg-white/50 dark:bg-slate-900/60 rounded-lg border border-brand-green/10 dark:border-[#1e5a37]/30 flex justify-between items-center transition-colors">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">Visitantes Externos</p>
              <p className="text-brand-green dark:text-emerald-400 font-bold text-lg">USD 7.5 </p>
            </div>
          </div>

          <div className="bg-brand-blue-900 p-8 lg:p-10 rounded-2xl shadow-xl text-white md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-3">
              <div className="w-6 h-1 bg-brand-green rounded-full" />
              {t("rules")}
            </h3>
            <ul className="space-y-3">
              {rules.slice(0, 6).map((rule, idx) => (
                <li key={idx} className="flex gap-3 items-start text-[13px] text-white/70 leading-relaxed border-b border-white/5 pb-3 last:border-0 last:pb-0 font-light">
                  <span className="text-brand-green font-mono text-[10px] mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
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
