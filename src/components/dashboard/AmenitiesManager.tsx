"use client";

import { useState, useTransition } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3,
  List,
  Check,
  Loader2,
  Box
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
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <List className="w-5 h-5 text-brand-blue" />
          {isEs ? "Amenidades" : "Amenities"}
        </h3>
        <Button 
          variant="outline" 
          className="rounded-2xl border-gray-100 font-bold gap-2 hover:bg-brand-blue hover:text-white transition-all"
          onClick={() => handleOpen()}
        >
          <Plus className="w-4 h-4" />
          {isEs ? "Nueva Amenidad" : "New Amenity"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex items-center justify-between overflow-hidden relative">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold">
                 <Box className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-none">{amenity.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{amenity.icon || "Sin ícono"}</p>
              </div>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:text-brand-blue" onClick={() => handleOpen(amenity)}>
                 <Edit3 className="w-3.5 h-3.5" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:text-red-500" onClick={() => setAmenityToDelete(amenity)}>
                 <Trash2 className="w-3.5 h-3.5" />
               </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-md p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center">
                 <List className="w-5 h-5 text-brand-blue" />
              </div>
              {editingAmenity ? (isEs ? "Editar Amenidad" : "Edit Amenity") : (isEs ? "Nueva Amenidad" : "New Amenity")}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-500">
              {isEs ? "Registra los detalles de esta amenidad." : "Register the details for this amenity."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Nombre" : "Name"}</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isEs ? "Ej. WiFi" : "e.g. WiFi"}
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Ícono" : "Icon"}</Label>
              <Input 
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="wifi"
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-4">
            <Button 
              variant="ghost" 
              className="rounded-xl font-bold h-12 px-6"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              {isEs ? "Descartar" : "Discard"}
            </Button>
            <Button 
              className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-brand-blue/20 transition-all active:scale-95"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Guardar Amenidad" : "Save Amenity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!amenityToDelete} onOpenChange={(open) => !open && setAmenityToDelete(null)}>
        <DialogContent className="rounded-[2.5rem] max-w-sm p-10 border-none shadow-2xl text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <Trash2 className="w-10 h-10" />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900">
              {isEs ? "¿Eliminar Amenidad?" : "Delete Amenity?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 leading-relaxed font-medium">
              {isEs 
                ? `¿Estás seguro de que deseas eliminar la amenidad "${amenityToDelete?.name}"? Las categorías de cuarto perderán esta amenidad. Esta acción no se puede deshacer.` 
                : `Are you sure you want to delete the amenity "${amenityToDelete?.name}"? Room categories will lose this amenity. This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-10">
            <Button 
              variant="destructive" 
              className="h-14 rounded-2xl font-bold text-lg shadow-lg shadow-red-200"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isEs ? "Sí, Eliminar" : "Yes, Delete"}
            </Button>
            <Button 
              variant="ghost" 
              className="h-12 rounded-xl text-gray-400 font-bold"
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
