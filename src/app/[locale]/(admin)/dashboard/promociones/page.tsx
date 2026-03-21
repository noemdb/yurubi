// src/app/[locale]/(admin)/dashboard/promociones/page.tsx
import { prisma } from "@/lib/prisma";
import { PromotionsTable } from "@/components/dashboard/PromotionsTable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/routing";

export default async function PromocionesAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            {isEs ? "Gestión de Promociones" : "Promotions Management"}
          </h1>
          <p className="text-gray-500 max-w-2xl">
            {isEs 
              ? "Configura ofertas especiales, descuentos estacionales y paquetes turísticos." 
              : "Set up special offers, seasonal discounts, and tour packages."}
          </p>
        </div>
        
        <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 px-8 shadow-lg shadow-brand-blue/20 gap-2 font-bold transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          {isEs ? "Nueva Promoción" : "Create Promotion"}
        </Button>
      </div>

      <PromotionsTable initialData={promotions} locale={locale} />
    </div>
  );
}
