"use client";

import { Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function Step2RoomSelection({
  rooms,
  locale,
  onSelect,
  onBack,
}: {
  rooms: any[];
  locale: string;
  onSelect: (room: any) => void;
  onBack: () => void;
}) {
  const isEs = locale === "es";

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 mb-6">
          {isEs ? "No hay habitaciones disponibles." : "No rooms available."}
        </p>
        <Button variant="outline" onClick={onBack}>{isEs ? "Volver" : "Back"}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            {isEs ? "Habitaciones Disponibles" : "Available Rooms"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isEs ? "Selecciona la habitación ideal para tu estadía." : "Select the ideal room for your stay."}
          </p>
        </div>
        <Button variant="ghost" onClick={onBack} className="text-brand-blue hover:bg-brand-blue-50 rounded-xl">
          &larr; {isEs ? "Modificar Búsqueda" : "Modify Search"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col bg-white group cursor-pointer" onClick={() => onSelect(room)}>
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
               {room.images?.[0] ? (
                 <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
               ) : (
                 <div className="w-full h-full bg-brand-blue-50 flex items-center justify-center">
                   <span className="text-brand-blue-200 font-serif text-xl">{room.name}</span>
                 </div>
               )}
               <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1.5 border border-gray-100/50">
                 <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                 {room.availableCount} {isEs ? "disp." : "avail."}
               </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
               <div className="flex justify-between items-start mb-3">
                 <h3 className="font-serif text-xl font-bold text-gray-900 pr-2">{room.name}</h3>
                 <div className="text-right shrink-0 bg-brand-green-50 px-3 py-1.5 rounded-xl border border-brand-green-100">
                   <div className="text-lg font-bold text-brand-green leading-none">{formatPrice(room.basePrice)}</div>
                 </div>
               </div>
               
               <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                 {room.description}
               </p>
               
               <div className="mt-auto">
                 <Button 
                   onClick={(e) => { e.stopPropagation(); onSelect(room); }} 
                   className="w-full bg-brand-blue hover:bg-brand-blue-600 h-12 rounded-xl text-md shadow-sm transition-transform active:scale-[0.98]"
                 >
                   {isEs ? "Seleccionar" : "Select Room"}
                 </Button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
