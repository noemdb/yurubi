// src/components/sections/PromotionBanner.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";

export async function PromotionBanner({ locale }: { locale: string }) {
  const isEs = locale === "es";
  
  // Buscar la promoción más reciente y activa
  const promotion = await prisma.promotion.findFirst({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!promotion) return null;

  return (
    <div className="bg-brand-blue-900 py-2.5 px-4 text-white overflow-hidden relative border-b border-white/5">
      <div className="container mx-auto flex items-center justify-center gap-6 text-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-brand-green/20 p-1.5 rounded">
            <Tag className="w-3.5 h-3.5 text-brand-green animate-pulse" />
          </div>
          <p className="text-xs md:text-sm font-medium tracking-wide">
            <span className="font-bold text-brand-green uppercase text-[9px] mr-2 tracking-[0.2em] px-2 py-0.5 bg-brand-green/10 rounded-sm">
              {isEs ? "PROMO" : "OFFER"}
            </span>
            {promotion.title}
          </p>
        </div>
        
        <Link 
          href={`/${locale}/promociones`}
          className="group text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-brand-green hover:text-brand-blue-900 px-4 py-1.5 rounded-xl flex items-center gap-2 transition-all duration-300 border border-white/10 hover:border-brand-green"
        >
          {isEs ? "Aprovechar" : "Claim Offer"} 
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      {/* Subtle glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-45deg] animate-[shimmer_5s_infinite]" />
    </div>
  );
}
