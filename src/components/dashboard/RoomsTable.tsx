// src/components/dashboard/RoomsTable.tsx
"use client";

import { useState } from "react";
import { 
  Bed, 
  DoorOpen, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toggleRoomStatus, updateRoomTypePrice } from "@/lib/actions/rooms";
import { useToast } from "@/hooks/use-toast";
import { cn, formatPrice } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  rooms: any[];
}

export function RoomsTable({ roomTypes, locale }: { roomTypes: any[], locale: string }) {
  const { toast } = useToast();
  const isEs = locale === "es";
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleRoomStatus(id, currentStatus);
      toast({ title: isEs ? "Estado de habitación actualizado" : "Room status updated" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleUpdatePrice = async (id: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;
    try {
      await updateRoomTypePrice(id, price);
      setEditingPriceId(null);
      toast({ title: isEs ? "Precio actualizado" : "Price updated" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-12">
      {/* Room Types (Prices) */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <Bed className="w-5 h-5 text-brand-blue" />
          {isEs ? "Precios por Tipo de Habitación" : "Prices by Room Type"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {roomTypes.map((type) => (
            <div key={type.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{isEs ? "Categoría" : "Category"}</p>
              <h4 className="font-bold text-gray-900 text-lg mb-4">{type.name}</h4>
              
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
                {editingPriceId === type.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <Input 
                      type="number" 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="h-10 rounded-xl border-gray-200 bg-white"
                      autoFocus
                    />
                    <Button size="icon" onClick={() => handleUpdatePrice(type.id)} className="bg-brand-green text-white hover:bg-brand-green/90 rounded-xl h-10 w-10">
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingPriceId(null)} className="rounded-xl h-10 w-10">
                      <X className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-2xl font-serif font-bold text-brand-blue">{formatPrice(type.basePrice)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{isEs ? "Precio base / noche" : "Base price / night"}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => { setEditingPriceId(type.id); setNewPrice(type.basePrice.toString()); }}
                      className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Physical Rooms Status */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-brand-green" />
          {isEs ? "Estado de Habitaciones Físicas" : "Physical Rooms Status"}
        </h3>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  <th className="py-5 px-8">Nro. {isEs ? 'Habitación' : 'Room'}</th>
                  <th className="py-5 px-4">{isEs ? 'Piso' : 'Floor'}</th>
                  <th className="py-5 px-4">{isEs ? 'Tipo' : 'Type'}</th>
                  <th className="py-5 px-4 text-center">{isEs ? 'Disponible' : 'Available'}</th>
                  <th className="py-5 px-8 text-right">{isEs ? 'Notas' : 'Notes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {roomTypes.flatMap(type => type.rooms).sort((a,b) => a.roomNumber.localeCompare(b.roomNumber)).map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-6 px-8 flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs",
                        room.isAvailable ? "bg-brand-green/5 text-brand-green" : "bg-red-50 text-red-500"
                      )}>
                        {room.roomNumber}
                      </div>
                      <span className="font-bold text-gray-900">Room {room.roomNumber}</span>
                    </td>
                    <td className="py-6 px-4 text-sm text-gray-500 font-medium">Floor {room.floor || 1}</td>
                    <td className="py-6 px-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {roomTypes.find(t => t.id === room.roomTypeId)?.name}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Switch 
                          checked={room.isAvailable} 
                          onCheckedChange={() => handleToggle(room.id, room.isAvailable)}
                          className="data-[state=checked]:bg-brand-green"
                        />
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                       {!room.isAvailable && (
                         <div className="flex items-center justify-end gap-2 text-red-500 text-xs font-bold uppercase">
                           <AlertTriangle className="w-3 h-3" />
                           {isEs ? "Fuera de servicio" : "Out of order"}
                         </div>
                       )}
                       {room.isAvailable && <span className="text-gray-300 text-xs italic">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
