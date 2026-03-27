"use client";

import { useState, useTransition } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3,
  List,
  Loader2,
  Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  createAmenity, 
  updateAmenity, 
  deleteAmenity 
} from "@/lib/actions/amenities";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IconSelector, AmenityIcon } from "@/components/ui/IconSelector";
import { cn } from "@/lib/utils";

export function AmenitiesManager({ 
  amenities, 
  locale 
}: { 
  amenities: any[]; 
  locale: string 
}) {
  const { toast } = useToast();
  const isEs = locale === "es";
  const [isPending, startTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: ""
  });

  const [amenityToDelete, setAmenityToDelete] = useState<any>(null);

  const handleOpen = (amenity?: any) => {
    if (amenity) {
      setEditingAmenity(amenity);
      setFormData({
        name: amenity.name,
        icon: amenity.icon || ""
      });
    } else {
      setEditingAmenity(null);
      setFormData({
        name: "",
        icon: ""
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast({ title: isEs ? "Nombre obligatorio" : "Name required", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        if (editingAmenity) {
          await updateAmenity(editingAmenity.id, formData);
          toast({ title: isEs ? "Amenidad actualizada" : "Amenity updated" });
        } else {
          await createAmenity(formData);
          toast({ title: isEs ? "Amenidad creada" : "Amenity created" });
        }
        setIsOpen(false);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = async () => {
    if (!amenityToDelete) return;
    startTransition(async () => {
      try {
        await deleteAmenity(amenityToDelete.id);
        toast({ title: isEs ? "Amenidad eliminada" : "Amenity deleted" });
        setAmenityToDelete(null);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-8 py-5 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center text-brand-blue shadow-inner">
            <List className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-none">
              {isEs ? "Catálogo de Amenidades" : "Amenities Catalog"}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] mt-1.5 px-0.5">
              {amenities.length} {isEs ? 'Servicios Registrados' : 'Registered Services'}
            </p>
          </div>
        </div>
        <Button 
          className="bg-gray-900 hover:bg-black text-white rounded-2xl h-12 px-8 font-bold gap-2 shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95 shrink-0"
          onClick={() => handleOpen()}
        >
          <Plus className="w-4 h-4" />
          {isEs ? "Nueva Amenidad" : "New Amenity"}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none hover:border-brand-blue/30 hover:shadow-xl transition-all group flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center text-brand-blue mb-4 border border-gray-100 dark:border-slate-800 shadow-inner transition-all group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white group-hover:rotate-3">
               <AmenityIcon name={amenity.icon} className="w-8 h-8" />
            </div>
            
            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-[11px] uppercase tracking-wider mb-1 px-2 line-clamp-1">{amenity.name}</h4>
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-mono font-bold uppercase tracking-widest bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md">
              {amenity.icon || "—"}
            </span>

            <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-xl bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none hover:text-brand-blue hover:bg-white dark:hover:bg-slate-900" 
                onClick={() => handleOpen(amenity)}
               >
                 <Edit3 className="w-3.5 h-3.5" />
               </Button>
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-xl bg-white dark:bg-slate-900/90 backdrop-blur-sm border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none hover:text-red-500 hover:bg-white dark:hover:bg-slate-900" 
                onClick={() => setAmenityToDelete(amenity)}
               >
                 <Trash2 className="w-3.5 h-3.5" />
               </Button>
            </div>
          </div>
        ))}

        {amenities.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700">
             <Box className="w-16 h-16 text-gray-100 mx-auto mb-4 opacity-50" />
             <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
               {isEs ? "No hay amenidades registradas." : "No amenities registered."}
             </p>
          </div>
        )}
      </div>

      {/* Add / Edit Amenity Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-[3rem] max-w-md p-10 border-none shadow-2xl dark:shadow-none overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center border border-brand-blue/10 dark:border-brand-blue/20">
                 <List className="w-6 h-6 text-brand-blue" />
              </div>
              {editingAmenity ? (isEs ? "Editar Amenidad" : "Edit Amenity") : (isEs ? "Nueva Amenidad" : "New Amenity")}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-500 dark:text-gray-400 pt-2 px-1">
              {isEs ? "Registra los detalles y elige un ícono visual para identificar el servicio." : "Register details and choose a visual icon to identify the service."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-2">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? "Nombre de la Amenidad" : "Amenity Name"}</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isEs ? "Ej. Aire Acondicionado" : "e.g. Air Conditioning"}
                className="h-14 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold shadow-none text-sm px-5"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">{isEs ? "Elegir Ícono Visual" : "Choose Visual Icon"}</Label>
              <div className="bg-gray-50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800">
                <IconSelector 
                  value={formData.icon} 
                  onChange={(val) => setFormData({ ...formData, icon: val })} 
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-12 gap-4 flex-col sm:flex-row">
            <Button 
              variant="ghost" 
              className="rounded-2xl font-bold h-14 flex-1 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              {isEs ? "Descartar" : "Discard"}
            </Button>
            <Button 
              className="bg-gray-900 hover:bg-black text-white rounded-2xl h-14 flex-1 font-bold shadow-xl dark:shadow-none shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-widest"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Guardar Cambios" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!amenityToDelete} onOpenChange={(open) => !open && setAmenityToDelete(null)}>
        <DialogContent className="rounded-[3rem] max-w-sm p-12 border-none shadow-2xl dark:shadow-none text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-8 border border-red-100 shadow-inner">
            <Trash2 className="w-10 h-10" />
          </div>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900 dark:text-gray-100">
              {isEs ? "¿Eliminar Amenidad?" : "Delete Amenity?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
              {isEs 
                ? `¿Eliminar "${amenityToDelete?.name}"? Esta acción no se puede deshacer y afectará a las categorías.` 
                : `Delete "${amenityToDelete?.name}"? This action cannot be undone and will affect categories.`}
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
              onClick={() => setAmenityToDelete(null)}
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
