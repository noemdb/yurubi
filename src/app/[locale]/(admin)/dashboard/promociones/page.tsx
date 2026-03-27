// src/app/[locale]/(admin)/dashboard/promociones/page.tsx
import { prisma } from "@/lib/prisma";
import { PromotionManager } from "@/components/dashboard/PromotionManager";

export default async function PromocionesAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  const promotions = await prisma.promotion.findMany({
    include: { applicableRooms: true },
    orderBy: { createdAt: "desc" }
  });

  const roomTypes = await prisma.roomType.findMany({
    where: { isActive: true },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
            {isEs ? "Gestión de Promociones" : "Promotions Management"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl font-medium">
            {isEs 
              ? "Configura ofertas especiales, descuentos estacionales y paquetes turísticos." 
              : "Set up special offers, seasonal discounts, and tour packages."}
          </p>
        </div>
      </div>

      <PromotionManager 
        initialData={promotions} 
        roomTypes={roomTypes} 
        locale={locale} 
      />
    </div>
  );
}
