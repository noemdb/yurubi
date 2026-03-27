"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  Tag, 
  Trash2, 
  Calendar, 
  Plus,
  Pencil,
  CircleDollarSign,
  Percent,
  Search,
  Eraser,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  togglePromotion, 
  deletePromotion, 
  createPromotion, 
  updatePromotion 
} from "@/lib/actions/promotions";
import { useToast } from "@/hooks/use-toast";
import { cn, formatPrice } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { PromotionForm } from "./PromotionForm";
import { Badge } from "@/components/ui/badge";

export function PromotionManager({ 
  initialData, 
  roomTypes, 
  locale 
}: { 
  initialData: any[], 
  roomTypes: any[], 
  locale: string 
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<any>(null);
  const [search, setSearch] = useState("");
  const isEs = locale === "es";

  const filteredData = useMemo(() => {
    return initialData.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      (p.titleEn && p.titleEn.toLowerCase().includes(search.toLowerCase()))
    );
  }, [initialData, search]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await togglePromotion(id, currentStatus);
        toast({ title: isEs ? "Estado actualizado" : "Status updated" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      try {
        await deletePromotion(id);
        toast({ title: isEs ? "Promoción eliminada" : "Promotion deleted" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, values);
        toast({ title: isEs ? "Promoción actualizada" : "Promotion updated" });
      } else {
        await createPromotion(values);
        toast({ title: isEs ? "Promoción creada" : "Promotion created" });
      }
      setOpen(false);
      setEditingPromotion(null);
    } catch (e: any) {
      toast({ 
        title: "Error", 
        description: e.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 px-8 py-5 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
           <Input 
             placeholder={isEs ? "Buscar promociones..." : "Search promotions..."}
             className="pl-12 h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all text-sm font-bold shadow-none"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSearch("")} 
            className="h-12 w-12 rounded-2xl border border-gray-100 dark:border-slate-800 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50"
          >
            <Eraser className="w-4 h-4" />
          </Button>

          <Button 
            className="bg-gray-900 hover:bg-black text-white rounded-2xl h-12 px-8 font-bold gap-2 shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95 shrink-0 flex-1 md:flex-none uppercase tracking-widest text-xs"
            onClick={() => {
              setEditingPromotion(null);
              setOpen(true);
            }}
          >
            <Plus className="w-5 h-5" />
            {isEs ? "Nueva Promoción" : "New Promotion"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((promo) => (
          <div key={promo.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden flex flex-col hover:shadow-2xl hover:border-brand-blue/20 dark:hover:border-brand-blue/40 transition-all group relative">
            
            <div className="p-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all group-hover:rotate-3",
                  promo.isActive ? "bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue" : "bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-gray-600"
                )}>
                  <Tag className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2.5">
                   <Switch 
                    checked={promo.isActive}
                    onCheckedChange={() => handleToggle(promo.id, promo.isActive)}
                    className="data-[state=checked]:bg-brand-green scale-90"
                    disabled={isPending}
                  />
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-[0.2em]",
                    promo.isActive ? "text-brand-green" : "text-gray-300 dark:text-gray-600"
                  )}>
                    {promo.isActive ? (isEs ? 'Activa' : 'Active') : (isEs ? 'Inactiva' : 'Inactive')}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors line-clamp-1 pr-10">
                  {isEs ? promo.title : (promo.titleEn || promo.title)}
                </h3>
                <div className="flex items-center gap-2 mt-3">
                   {promo.discountType === 'PERCENT' ? (
                     <Badge className="bg-brand-green/10 text-brand-green border-none font-bold rounded-lg px-2.5 py-1 text-[10px] tracking-wider">
                       <Percent className="w-3 h-3 mr-1" /> {promo.value}% OFF
                     </Badge>
                   ) : (
                     <Badge className="bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue border-none font-bold rounded-lg px-2.5 py-1 text-[10px] tracking-wider">
                       <CircleDollarSign className="w-3 h-3 mr-1" /> {formatPrice(promo.value)} OFF
                     </Badge>
                   )}
                </div>
              </div>

              <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 min-h-[32px] font-medium leading-relaxed italic">
                {isEs ? promo.description : (promo.descriptionEn || promo.description)}
              </p>

              <div className="space-y-4 pt-5 border-t border-gray-50 dark:border-slate-800/50">
                <div className="flex items-center gap-3 text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                  <span>{new Date(promo.startDate).toLocaleDateString(locale)} — {new Date(promo.endDate).toLocaleDateString(locale)}</span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 min-h-[50px]">
                   {promo.applicableRooms.map((room: any) => (
                     <span key={room.id} className="text-[9px] font-bold px-2 py-0.5 bg-gray-50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 rounded-md border border-gray-100 dark:border-slate-800 uppercase tracking-tighter">
                       {room.name}
                     </span>
                   ))}
                </div>
              </div>
            </div>

            <div className="px-7 py-5 bg-gray-50 dark:bg-slate-800/30 flex items-center justify-between border-t border-gray-50 dark:border-slate-800/50">
               <Dialog>
                 <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl font-bold uppercase text-[9px] h-9 px-4 tracking-widest" 
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      {isEs ? 'Eliminar' : 'Delete'}
                    </Button>
                 </DialogTrigger>
                 <DialogContent className="rounded-[3rem] max-w-sm p-12 border-none shadow-2xl dark:shadow-none text-center">
                    <DialogHeader className="sr-only">
                      <DialogTitle>{isEs ? "Eliminar Promoción" : "Delete Promotion"}</DialogTitle>
                    </DialogHeader>
                    <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-inner">
                      <Trash2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">{isEs ? "¿Eliminar Promoción?" : "Delete Promotion?"}</h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-8">{isEs ? "Esta acción no se puede deshacer." : "This action cannot be undone."}</p>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => handleDelete(promo.id)} variant="destructive" className="h-12 rounded-xl font-bold uppercase text-xs tracking-widest shadow-xl dark:shadow-none shadow-red-100">
                        {isEs ? "Sí, Eliminar" : "Yes, Delete"}
                      </Button>
                      <Button variant="ghost" className="h-10 rounded-xl text-gray-400 dark:text-gray-500 font-bold uppercase text-xs tracking-widest">
                        {isEs ? "Cancelar" : "Cancel"}
                      </Button>
                    </div>
                 </DialogContent>
               </Dialog>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-brand-blue hover:bg-brand-blue/90 hover:text-white rounded-xl font-bold uppercase text-[9px] h-9 px-4 tracking-widest transition-all bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800"
                onClick={() => {
                  setEditingPromotion(promo);
                  setOpen(true);
                }}
              >
                <Pencil className="w-3.5 h-3.5 mr-2" />
                {isEs ? 'Editar' : 'Edit'}
              </Button>
            </div>
          </div>
        ))}
        
        {filteredData.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center">
             <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-slate-800/50 shadow-inner flex items-center justify-center mb-6 text-gray-200 dark:text-gray-700">
                <Tag className="w-10 h-10" />
             </div>
             <p className="text-gray-400 dark:text-gray-500 font-bold text-sm uppercase tracking-[0.2em]">
               {isEs ? "No se encontraron ofertas" : "No offers found"}
             </p>
             <Button 
               variant="outline" 
               onClick={() => {
                 setEditingPromotion(null);
                 setOpen(true);
               }}
               className="mt-8 rounded-2xl font-bold border-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-900 hover:text-white h-12 px-8 uppercase tracking-widest text-xs"
             >
                {isEs ? "Crear Nueva Promoción" : "Create New Promotion"}
             </Button>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(val) => {
        setOpen(val);
        if (!val) setEditingPromotion(null);
      }}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden border-none bg-transparent shadow-none outline-none rounded-[3rem]">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {editingPromotion ? (isEs ? "Editar Promoción" : "Edit Promotion") : (isEs ? "Nueva Promoción" : "New Promotion")}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[95vh] overflow-y-auto custom-scrollbar">
            <PromotionForm 
              initialData={editingPromotion}
              roomTypes={roomTypes}
              locale={locale}
              onSubmit={handleSubmit}
              onCancel={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
