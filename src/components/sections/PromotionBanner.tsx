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
    <div className="bg-brand-blue py-3 px-4 text-white overflow-hidden relative">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <Tag className="w-4 h-4 text-brand-green shrink-0 animate-bounce" />
        <p className="text-sm md:text-base font-medium">
          <span className="font-bold">
            {isEs ? "¡Promoción Especial!" : "Special Promotion!"}
          </span>{" "}
          {promotion.title} — {isEs ? "Reserva ahora y ahorra." : "Book now and save."}
        </p>
        <Link 
          href={`/${locale}/promociones`}
          className="text-xs md:text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 transition-colors font-bold whitespace-nowrap"
        >
          {isEs ? "Ver más" : "See more"} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      {/* Luces decorativas */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent skew-x-[-20deg]" />
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white/10 to-transparent skew-x-[-20deg]" />
    </div>
  );
}
