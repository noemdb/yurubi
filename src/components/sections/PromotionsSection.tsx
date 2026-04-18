// src/components/sections/PromotionsSection.tsx
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Tag, Calendar, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOL } from "@/lib/constants";

export async function PromotionsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "promotions" });
  const isEs = locale === "es";

  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  if (!promotions.length) return null;

  return (
    <section className="py-24 bg-[#001a35] text-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-5/12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-green/10 text-brand-green font-bold text-xs mb-8 border border-brand-green/20 uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4" />
              {isEs ? "Oportunidades Imperdibles" : "Unmissable Offers"}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-8 leading-[1.1] tracking-tight text-white">
              {t("title")}
            </h2>
            <p className="text-lg md:text-xl text-brand-blue-100/80 mb-10 max-w-xl leading-relaxed font-medium">
              {t("subtitle")}
            </p>
            <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green-600 text-brand-blue-900 font-bold h-16 px-10 rounded-md shadow-2xl shadow-brand-green/20 transition-all hover:scale-105 active:scale-95">
              <Link href={`/${locale}/promociones`} className="flex items-center gap-3">
                {t("viewMore")} <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {promotions.map((promo) => (
              <div 
                key={promo.id} 
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-xl hover:bg-white/[0.07] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
              >
                {/* Decorative glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-brand-green/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-brand-green/20 p-4 rounded-md text-brand-green border border-brand-green/20">
                      <Tag className="w-6 h-6" />
                    </div>
                    {promo.value && (
                      <div className="text-right">
                        <div className="text-4xl font-bold text-brand-green leading-none">
                          {promo.discountType === 'PERCENT' ? `${promo.value}%` : `${CURRENCY_SYMBOL}${promo.value}`}
                        </div>
                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1 block">
                          {t("discount")}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-brand-green transition-colors leading-tight">
                    {isEs ? promo.title : (promo.titleEn || promo.title)}
                  </h3>
                  
                  <p className="text-brand-blue-100/70 mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
                    {isEs ? promo.description : (promo.descriptionEn || promo.description)}
                  </p>
                  
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs text-white/50 font-bold uppercase tracking-widest">
                      <Calendar className="w-4 h-4 text-brand-green/70" />
                      <span>{t("validUntil")}: {new Date(promo.endDate).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
