"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tag, 
  Check, 
  Loader2,
  Users,
  Search,
  Eraser
} from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  createRoomType, 
  updateRoomType, 
  deleteRoomType 
} from "@/lib/actions/rooms";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function RoomTypesManager({ 
  roomTypes, 
  allAmenities,
  locale 
}: { 
  roomTypes: any[]; 
  allAmenities: any[];
  locale: string 
}) {
  const { toast } = useToast();
  const isEs = locale === "es";
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  // CRUD Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    basePrice: 0,
    maxOccupancy: 2,
    description: "",
    amenities: [] as string[]
  });

  // Delete Confirmation State
  const [typeToDelete, setTypeToDelete] = useState<any>(null);

  const filteredTypes = useMemo(() => {
    return roomTypes.filter(t => 
      t.name.toLowerCase().includes(search.toLowerCase()) || 
      t.slug.toLowerCase().includes(search.toLowerCase())
    );
  }, [roomTypes, search]);

  const handleOpen = (type?: any) => {
    if (type) {
      setEditingType(type);
      setFormData({
        name: type.name,
        slug: type.slug,
        basePrice: type.basePrice,
        maxOccupancy: type.maxOccupancy,
        description: type.description || "",
        amenities: type.amenities?.map((a: any) => a.name) || []
      });
    } else {
      setEditingType(null);
      setFormData({
        name: "",
        slug: "",
        basePrice: 0,
        maxOccupancy: 2,
        description: "",
        amenities: []
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug || formData.basePrice <= 0) {
      toast({ title: isEs ? "Campos obligatorios faltantes" : "Missing required fields", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        if (editingType) {
          await updateRoomType(editingType.id, formData);
          toast({ title: isEs ? "Categoría actualizada" : "Category updated" });
        } else {
          await createRoomType(formData);
          toast({ title: isEs ? "Categoría creada" : "Category created" });
        }
        setIsOpen(false);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    startTransition(async () => {
      try {
        await deleteRoomType(typeToDelete.id);
        toast({ title: isEs ? "Categoría eliminada" : "Category deleted" });
        setTypeToDelete(null);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  const toggleAmenity = (amenityName: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter(a => a !== amenityName)
        : [...prev.amenities, amenityName]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tool Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-900 px-8 py-5 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none grow">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
           <Input 
             placeholder={isEs ? "Buscar categorías..." : "Search categories..."}
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
            className="bg-gray-900 hover:bg-black text-white rounded-2xl h-12 px-8 font-bold gap-2 shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95 shrink-0 flex-1 md:flex-none"
            onClick={() => handleOpen()}
          >
            <Plus className="w-4 h-4" />
            {isEs ? "Nueva Categoría" : "New Category"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredTypes.map((type) => (
          <div key={type.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-2xl hover:border-brand-blue/20 dark:hover:border-brand-blue/40 transition-all group flex flex-col justify-between overflow-hidden relative min-h-[300px]">
            <div className="absolute top-4 right-4 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all flex gap-1.5 z-10">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white dark:bg-slate-900/90 backdrop-blur-sm shadow-sm dark:shadow-none hover:text-brand-blue border border-gray-100 dark:border-slate-800" onClick={() => handleOpen(type)}>
                 <Edit3 className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white dark:bg-slate-900/90 backdrop-blur-sm shadow-sm dark:shadow-none hover:text-red-500 border border-gray-100 dark:border-slate-800" onClick={() => setTypeToDelete(type)}>
                 <Trash2 className="w-4 h-4" />
               </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 pr-16">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs uppercase shrink-0 shadow-inner">
                  {type.slug.slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-tight mb-1">{type.name}</h4>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-bold uppercase tracking-widest bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md inline-block">
                    /{type.slug}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-gray-50 dark:border-slate-800/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 opacity-40">
                    <Users className="w-3 h-3" />
                    <p className="text-[9px] font-bold uppercase tracking-wider">{isEs ? "Ocupación" : "Occupancy"}</p>
                  </div>
                  <p className="font-bold text-gray-700 dark:text-gray-300 text-xs">{type.maxOccupancy} Pers.</p>
                </div>
                <div className="space-y-1 text-right border-l border-gray-200/50 dark:border-slate-700/50 pl-4">
                  <div className="flex items-center gap-1.5 justify-end opacity-40">
                    <Tag className="w-3 h-3" />
                    <p className="text-[9px] font-bold uppercase tracking-wider">{isEs ? "Tarifa Base" : "Base Rate"}</p>
                  </div>
                  <p className="font-bold text-brand-blue text-sm">{formatPrice(type.basePrice)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[50px]">
                {type.amenities?.map((amenity: any) => (
                  <span key={amenity.id} className="px-2 py-1 bg-brand-blue/5 dark:bg-brand-blue/10 text-brand-blue rounded-lg text-[9px] font-bold uppercase tracking-tight border border-brand-blue/10 dark:border-brand-blue/20">
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-gray-50 dark:border-slate-800/50">
               <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 italic font-medium leading-relaxed px-1">
                {type.description || (isEs ? 'Sin descripción configurada' : 'No description configured')}
              </p>
            </div>
          </div>
        ))}
        
        {filteredTypes.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-100 dark:border-slate-800 flex flex-col items-center">
             <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center text-gray-100 mb-6">
                <Tag className="w-10 h-10" />
             </div>
             <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-sm">
               {isEs ? "No se encontraron categorías" : "No categories found"}
             </p>
          </div>
        )}
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-[3rem] max-w-2xl p-10 border-none shadow-2xl dark:shadow-none overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center border border-brand-blue/10 dark:border-brand-blue/20">
                 <Tag className="w-6 h-6 text-brand-blue" />
              </div>
              {editingType ? (isEs ? "Editar Categoría" : "Edit Category") : (isEs ? "Nueva Categoría" : "New Category")}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-500 dark:text-gray-400 pt-2 px-1">
              {isEs 
                ? "Define la capacidad, servicios y tarifa base de este tipo de habitación." 
                : "Define capacity, services, and base rate for this room type."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? "Nombre del Tipo" : "Type Name"}</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isEs ? "Ej. Suite Junior" : "e.g. Junior Suite"}
                  className="h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold shadow-none text-sm px-5"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? "Identificador (Slug)" : "Slug"}</Label>
                <Input 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  placeholder="ej-suite-junior"
                  className="h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-mono font-bold shadow-none text-xs px-5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? `Tarifa (${CURRENCY_SYMBOL})` : `Rate (${CURRENCY_SYMBOL})`}</Label>
                  <Input 
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold shadow-none text-sm px-5"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? "Ocupación" : "Occupancy"}</Label>
                  <Input 
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) || 1 })}
                    className="h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold shadow-none text-sm px-5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? "Descripción" : "Description"}</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-medium shadow-none resize-none text-sm p-5"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2 mb-3">{isEs ? "Servicios Incluidos" : "Included Amenities"}</Label>
              <div className="bg-gray-50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 grid grid-cols-1 gap-2 overflow-y-auto h-full max-h-[420px] custom-scrollbar shadow-inner">
                {allAmenities.map(amenity => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.name)}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-xl text-xs font-bold transition-all border",
                      formData.amenities.includes(amenity.name) 
                        ? 'bg-brand-blue border-brand-blue text-white shadow-lg dark:shadow-none shadow-brand-blue/20 translate-x-1' 
                        : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 hover:border-brand-blue/20 dark:hover:border-brand-blue/40 hover:text-brand-blue'
                    )}
                  >
                    {amenity.name}
                    {formData.amenities.includes(amenity.name) && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-12 gap-4">
            <Button 
              variant="ghost" 
              className="rounded-2xl font-bold h-14 px-8 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              {isEs ? "Descartar" : "Discard"}
            </Button>
            <Button 
              className="bg-gray-900 hover:bg-black text-white rounded-[2rem] h-14 px-12 font-bold shadow-2xl dark:shadow-none shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-widest"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Guardar Categoría" : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!typeToDelete} onOpenChange={(open) => !open && setTypeToDelete(null)}>
        <DialogContent className="rounded-[3rem] max-w-sm p-12 border-none shadow-2xl dark:shadow-none text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-8 border border-red-100 shadow-inner">
            <Trash2 className="w-10 h-10" />
          </div>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900 dark:text-gray-100">
              {isEs ? "¿Confirmar Eliminación?" : "Confirm Deletion?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
              {isEs 
                ? `Al eliminar la categoría "${typeToDelete?.name}" se verán afectadas las habitaciones asociadas. ¿Estás seguro?` 
                : `Deleting the category "${typeToDelete?.name}" will affect associated rooms. Are you sure?`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-10">
            <Button 
              variant="destructive" 
              className="h-14 rounded-2xl font-bold text-sm shadow-xl dark:shadow-none shadow-red-100 uppercase tracking-widest active:scale-95"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Sí, Eliminar" : "Yes, Delete"}
            </Button>
            <Button 
              variant="ghost" 
              className="h-12 rounded-2xl text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest"
              onClick={() => setTypeToDelete(null)}
              disabled={isPending}
            >
              {isEs ? "Cancelar" : "Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
