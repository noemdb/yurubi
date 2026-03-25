"use client";

import { useState, useTransition } from "react";
import { 
  Bed, 
  Edit3, 
  Plus, 
  Trash2, 
  Users, 
  Tag, 
  Info, 
  Check, 
  X, 
  Loader2 
} from "lucide-react";
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
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-brand-blue" />
          {isEs ? "Categorías de Habitación" : "Room Categories"}
        </h3>
        <Button 
          variant="outline" 
          className="rounded-2xl border-gray-100 font-bold gap-2 hover:bg-brand-blue hover:text-white transition-all"
          onClick={() => handleOpen()}
        >
          <Plus className="w-4 h-4" />
          {isEs ? "Nueva Categoría" : "New Category"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes.map((type) => (
          <div key={type.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:text-brand-blue" onClick={() => handleOpen(type)}>
                 <Edit3 className="w-3.5 h-3.5" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:text-red-500" onClick={() => setTypeToDelete(type)}>
                 <Trash2 className="w-3.5 h-3.5" />
               </Button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold text-xs uppercase">
                  {type.slug.slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-none">{type.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">/{type.slug}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {isEs ? "Ocupación Máx." : "Max Occupancy"}
                  </span>
                  <span className="font-bold text-gray-700">{type.maxOccupancy} {isEs ? 'Pers.' : 'Pax'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 flex items-center gap-1.5 font-medium">
                    <Bed className="w-3.5 h-3.5" />
                    {isEs ? "Precio Base" : "Base Price"}
                  </span>
                  <span className="font-bold text-brand-blue text-lg">{formatPrice(type.basePrice)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {type.amenities?.slice(0, 4).map((amenity: any) => (
                  <span key={amenity.id} className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                    {amenity.name}
                  </span>
                ))}
                {(type.amenities?.length || 0) > 4 && (
                  <span className="px-2 py-0.5 bg-gray-50 text-gray-300 rounded-lg text-[9px] font-bold">
                    +{(type.amenities?.length || 0) - 4}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 line-clamp-2 italic font-medium">
              "{type.description || (isEs ? 'Sin descripción' : 'No description')}"
            </p>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center">
                 <Tag className="w-6 h-6 text-brand-blue" />
              </div>
              {editingType ? (isEs ? "Editar Categoría" : "Edit Category") : (isEs ? "Nueva Categoría" : "New Category")}
            </DialogTitle>
            <DialogDescription className="text-base font-medium text-gray-500">
              {isEs ? "Configura los parámetros de este tipo de habitación." : "Configure the parameters for this room type."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Nombre" : "Name"}</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isEs ? "Ej. Suite Junior" : "e.g. Junior Suite"}
                  className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Slug (URL)" : "Slug"}</Label>
                <Input 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  placeholder="ej-suite-junior"
                  className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Precio" : "Price"}</Label>
                  <Input 
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Ocupación" : "Occupancy"}</Label>
                  <Input 
                    type="number"
                    value={formData.maxOccupancy}
                    onChange={(e) => setFormData({ ...formData, maxOccupancy: parseInt(e.target.value) || 1 })}
                    className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Descripción" : "Description"}</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium shadow-none resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{isEs ? "Servicios / Amenities" : "Amenities"}</Label>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 grid grid-cols-1 gap-2">
                {allAmenities.map(amenity => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.name)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      formData.amenities.includes(amenity.name) 
                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                        : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100/50'
                    }`}
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
              className="rounded-xl font-bold h-14 px-8"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              {isEs ? "Descartar" : "Discard"}
            </Button>
            <Button 
              className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 px-10 font-bold shadow-xl shadow-brand-blue/20 transition-all active:scale-95"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isEs ? "Guardar Categoría" : "Save Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!typeToDelete} onOpenChange={(open) => !open && setTypeToDelete(null)}>
        <DialogContent className="rounded-[2.5rem] max-w-sm p-10 border-none shadow-2xl text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <Trash2 className="w-10 h-10" />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900">
              {isEs ? "¿Eliminar Categoría?" : "Delete Category?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 leading-relaxed font-medium">
              {isEs 
                ? `¿Estás seguro de que deseas eliminar la categoría "${typeToDelete?.name}"? Esta acción no se puede deshacer.` 
                : `Are you sure you want to delete the category "${typeToDelete?.name}"? This action cannot be undone.`}
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
