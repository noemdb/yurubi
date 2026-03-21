// src/components/dashboard/PromotionsTable.tsx
"use client";

import { useState } from "react";
import { 
  Tag, 
  Trash2, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { togglePromotion, deletePromotion } from "@/lib/actions/promotions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface Promotion {
  id: string;
  title: string;
  discountType: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export function PromotionsTable({ initialData, locale }: { initialData: Promotion[], locale: string }) {
  const { toast } = useToast();
  const isEs = locale === "es";

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await togglePromotion(id, currentStatus);
      toast({ title: isEs ? "Estado actualizado" : "Status updated" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isEs ? "¿Seguro que deseas eliminar esta promoción?" : "Are you sure you want to delete this promotion?")) return;
    try {
      await deletePromotion(id);
      toast({ title: isEs ? "Promoción eliminada" : "Promotion deleted" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {initialData.map((promo) => (
        <div key={promo.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all group">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="bg-brand-blue/5 p-3 rounded-2xl text-brand-blue">
                <Tag className="w-6 h-6" />
              </div>
              <Switch 
                checked={promo.isActive}
                onCheckedChange={() => handleToggle(promo.id, promo.isActive)}
                className="data-[state=checked]:bg-brand-green"
              />
            </div>
            
            <div>
              <h3 className="font-serif font-bold text-xl text-gray-900 group-hover:text-brand-blue transition-colors">
                {promo.title}
              </h3>
              <p className="text-sm font-bold text-brand-green mt-1">
                {promo.discountType === 'PERCENT' ? `${promo.value}% Off` : `$${promo.value} Discount`}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date(promo.startDate).toLocaleDateString(locale)} - {new Date(promo.endDate).toLocaleDateString(locale)}</span>
              </div>
              <div className={cn(
                "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
                promo.isActive ? "text-green-600" : "text-gray-400"
              )}>
                {promo.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {promo.isActive ? (isEs ? 'Activa ahora' : 'Active now') : (isEs ? 'Inactiva' : 'Inactive')}
              </div>
            </div>
          </div>

          <div className="mt-auto px-8 py-4 bg-gray-50 flex items-center justify-between border-t border-gray-100 italic">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-bold uppercase text-[10px]" onClick={() => handleDelete(promo.id)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {isEs ? 'Eliminar' : 'Delete'}
            </Button>
            <Button variant="ghost" size="sm" className="text-brand-blue hover:bg-brand-blue/5 rounded-xl font-bold uppercase text-[10px]">
              <ExternalLink className="w-4 h-4 mr-2" />
              {isEs ? 'Editar' : 'Edit'}
            </Button>
          </div>
        </div>
      ))}
      
      {initialData.length === 0 && (
        <div className="col-span-full py-24 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
           <Tag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
           <p className="text-gray-400 font-medium">
             {isEs ? "No hay promociones creadas." : "No promotions created yet."}
           </p>
        </div>
      )}
    </div>
  );
}
